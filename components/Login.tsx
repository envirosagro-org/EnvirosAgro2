import React, { useState } from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  UserPlus, 
  Key, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle,
  Mail,
  Inbox,
  X,
  Search,
  Fingerprint,
  RefreshCcw,
  LocateFixed,
  Zap,
  Map as MapIcon,
  Navigation,
  Radar,
  Maximize2,
  Signal,
  Smartphone,
  ShieldAlert as ShieldAlertIcon,
  Copy
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
  const [isLocating, setIsLocating] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [geoAuthEnabled, setGeoAuthEnabled] = useState(false);
  const [showDevicePrompt, setShowDevicePrompt] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [gpsCoords, setGpsCoords] = useState('');
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

  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

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

  const handleActivateLocation = (autoMode: boolean = false) => {
    setIsLocating(true);
    setError(null);
    setShowDevicePrompt(false);
    triggerHaptic(50);

    if (!navigator.geolocation) {
      setError("HARDWARE ERROR: Geolocation not supported. Switch to Manual Node entry.");
      setIsLocating(false);
      setIsManualLocation(true);
      triggerHaptic([100, 50, 100]);
      if (autoMode) setMode('register');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoords(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        triggerHaptic([30, 30, 30]);
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          const geoData = await response.json();
          if (geoData && geoData.address) {
            setCountry(geoData.address.country || '');
            setCounty(geoData.address.county || geoData.address.state || '');
            setCity(geoData.address.city || geoData.address.town || geoData.address.village || '');
          }
        } catch (geoErr) {
          console.warn("Reverse geocode sync failed, proceeding with coordinate anchor only.");
        }

        setLocationVerified(true);
        setIsLocating(false);
        setIsManualLocation(false);
        setShowDevicePrompt(false);
        
        if (autoMode) {
          const savedRegistry = localStorage.getItem('envirosagro_stewards_registry');
          if (savedRegistry) {
            setMode('login');
          } else {
            setMode('register');
          }
        }
      },
      (err) => {
        let msg = "";
        switch(err.code) {
          case err.PERMISSION_DENIED:
            msg = "GPS SIGNAL FAILED: Permission denied.";
            break;
          case err.POSITION_UNAVAILABLE:
            msg = "GPS SIGNAL FAILED: Signal lost.";
            break;
          case err.TIMEOUT:
            msg = "GPS SIGNAL FAILED: Request timed out.";
            break;
          default:
            msg = "GPS SIGNAL FAILED: " + err.message;
        }
        setError(msg);
        setIsLocating(false);
        setIsManualLocation(true);
        setShowDevicePrompt(true);
        triggerHaptic([100, 50, 100]);
        if (autoMode) setMode('register');
      },
      options
    );
  };

  const handleRegisterInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationVerified && !isManualLocation) {
      setError("REGISTRY ERROR: Geo-Node anchor is required for node initialization.");
      return;
    }
    setError(null);
    setLoading(true);
    
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        setError("STATION ERROR: This email is already bound to an active Steward Node.");
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
        // Seamlessly auto-fill the code for the demo/simulation flow
        setVCode(code);
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
      triggerHaptic([50, 50]);
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
      location: `${city || 'Unknown City'}, ${county || 'Unknown County'}, ${country || 'Unknown Country'} [${gpsCoords || 'Manual-Node'}]`,
      wallet: { balance: 0, bonusBalance: 100, tier: 'Seed', lifetimeEarned: 100 },
      metrics: { 
        agriculturalCodeU: 1.2, 
        timeConstantTau: 8.5, 
        sustainabilityScore: 72,
        socialImmunity: 60,
        viralLoadSID: 35
      },
      skills: { 'General': 10 },
      isReadyForHire: false
    };

    const success = await syncUserToCloud(newUser);
    if (success) {
      setGeneratedUser(newUser);
      setMode('success');
      setShowMockEmail(false);
      triggerHaptic([100, 100, 100]);
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
        if (geoAuthEnabled) {
          setIsLocating(true);
          triggerHaptic(50);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              triggerHaptic([30, 30, 30]);
              onLogin(user);
            },
            () => {
              setError("GEO-AUTH FAILED: Unable to verify presence. Proceed without bonus?");
              setLoading(false);
              setIsLocating(false);
              setGeoAuthEnabled(false);
              setShowDevicePrompt(true);
              triggerHaptic([100, 50]);
            }
          );
        } else {
          onLogin(user);
        }
      } else {
        setError("AUTHENTICATION FAILED: ESIN signature not found.");
        triggerHaptic([50, 50]);
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
        triggerHaptic([50, 50, 50]);
      } else {
        setError(`RECOVERY ERROR: Node not found.`);
        triggerHaptic([100, 50]);
      }
    } catch (err) {
      setError("COMMUNICATION ERROR: Recovery node unreachable.");
    }
    setLoading(false);
  };

  const handleCopyESIN = () => {
    if (recoveredESIN) {
      navigator.clipboard.writeText(recoveredESIN);
      alert("ESIN Signature copied.");
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
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {recoveredESIN}
                    </p>
                  </>
                ) : (
                  <>
                    <h5 className="text-sm font-bold text-white mb-1">Node Verify</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Your code is: <span className="text-lg font-mono font-black text-emerald-400 block tracking-[0.2em]">{generatedCode}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDevicePrompt && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card p-10 rounded-[48px] border-amber-500/30 bg-[#0a0c0b] max-w-sm w-full text-center space-y-8 shadow-3xl">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto relative">
              <Smartphone className="w-12 h-12 text-amber-500" />
              <div className="absolute inset-[-8px] border-2 border-amber-500/20 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white uppercase italic">Enable Location</h3>
              <p className="text-slate-400 text-sm leading-relaxed italic font-medium">
                GPS signal failed. Please check your device settings and ensure <span className="text-amber-500 font-bold">Location Services</span> are enabled.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowDevicePrompt(false); handleActivateLocation(); }}
                className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-4 h-4" /> Try Again
              </button>
              <button 
                onClick={() => { setShowDevicePrompt(false); setIsManualLocation(true); }}
                className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white"
              >
                Switch to Manual Entry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl p-4 md:p-8 flex flex-col items-center">
        <div className="text-center mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-20 h-20 agro-gradient rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 ring-1 ring-white/20">
            <Leaf className="text-white w-10 h-10" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              Enviros<span className="text-emerald-400">Agro™</span>
            </h1>
            <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 mt-2">
              <ShieldCheck className="w-3 h-3" /> Blockchain Identity Protocol
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl glass-card p-1 rounded-[44px] shadow-2xl border-white/5 relative overflow-hidden">
          <div className="bg-[#050706]/80 backdrop-blur-3xl rounded-[43px] p-8 md:p-10 overflow-y-auto max-h-[75vh] custom-scrollbar relative flex flex-col justify-center min-h-[500px]">
            
            {error && mode !== 'landing' && !showDevicePrompt && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[11px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                <ShieldAlertIcon className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {mode === 'landing' && (
              <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight italic leading-none">Access Control</h2>
                  <p className="text-slate-500 text-sm font-medium">Initialize or resume your EnvirosAgro™ node session.</p>
                </div>

                <div className="p-10 glass-card rounded-[48px] border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-8 group shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none"></div>
                  {isLocating ? (
                    <div className="w-24 h-24 flex items-center justify-center relative">
                       <Radar className="w-20 h-20 text-emerald-400 animate-spin-slow opacity-20 absolute" />
                       <Loader2 className="w-10 h-10 text-emerald-500 animate-spin relative z-10" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] ring-4 ring-white/10 group-hover:scale-110 transition-transform relative z-10">
                      <Smartphone className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="space-y-3 relative z-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Geo-Node Anchor</h3>
                    <p className="text-slate-500 text-xs italic leading-relaxed max-w-xs mx-auto font-medium">
                      Authorize your regional hub via GPS to automatically initialize or resume your registry shard.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleActivateLocation(true)}
                    disabled={isLocating}
                    className="w-full max-w-xs py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 relative z-10"
                  >
                    {isLocating ? 'Scanning Satellites...' : <LocateFixed className="w-5 h-5 fill-current" />}
                    {isLocating ? 'INITIALIZING...' : 'ACTIVATE LOCATION'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => { setMode('register'); setError(null); setLocationVerified(false); setCountry(''); setCounty(''); setCity(''); setIsManualLocation(false); }} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-[32px] text-left hover:bg-emerald-600/10 hover:border-emerald-500/40 transition-all flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl"><UserPlus className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight italic">New Steward</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Manual Start.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-400 transition-all" />
                  </button>
                  <button onClick={() => { setMode('login'); setError(null); }} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-[32px] text-left hover:bg-blue-600/10 hover:border-blue-500/40 transition-all flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl"><Key className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Existing Node</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Manual Login.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-all" />
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegisterInitiate} className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-left">
                <div className="flex items-center gap-3 mb-2 text-left">
                  <button onClick={() => { setMode('landing'); setError(null); }} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Initialize Node</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Steward Alias</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Alias" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-emerald-500/40" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Anchor Email</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="registry@node" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/40" />
                    </div>
                  </div>

                  <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                       <Radar className="w-40 h-40 text-emerald-500 animate-pulse" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <MapIcon className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Geo-Node Anchor</h4>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => { setIsManualLocation(!isManualLocation); setLocationVerified(false); }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isManualLocation ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg' : 'bg-white/5 text-slate-500 border border-white/10'}`}
                        >
                          {isManualLocation ? <Maximize2 size={12} /> : <Navigation size={12} />}
                          {isManualLocation ? 'Manual Ingest' : 'Flexible Sync'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleActivateLocation(false)}
                          disabled={isLocating}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${locationVerified ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-600 text-white shadow-lg active:scale-95'}`}
                        >
                          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Signal className="w-3.5 h-3.5" />}
                          {isLocating ? 'Scanning...' : locationVerified ? 'LOCKED' : 'Activate Location'}
                        </button>
                      </div>
                    </div>
                    
                    {isManualLocation ? (
                       <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
                          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-3">
                             <AlertCircle className="w-4 h-4 text-indigo-400" />
                             <p className="text-[9px] text-indigo-300 font-bold uppercase">Manual Ingest Active: Provide coordinates or select from registry.</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Node Coordinates (Lat, Lng) - <span className="text-slate-500 italic">Optional</span></label>
                            <input 
                              type="text" 
                              value={gpsCoords} 
                              onChange={e => setGpsCoords(e.target.value)} 
                              placeholder="0.0000, 0.0000" 
                              className="w-full bg-black/60 border border-white/5 rounded-xl py-4 px-6 text-white text-sm font-mono outline-none focus:border-indigo-500/40" 
                            />
                          </div>
                       </div>
                    ) : (
                       <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                          <div className={`h-full bg-emerald-500 transition-all duration-1000 ${isLocating ? 'animate-pulse' : ''}`} style={{ width: locationVerified ? '100%' : isLocating ? '60%' : '0%' }}></div>
                       </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Country</label>
                        <input type="text" required value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Kenya" className="w-full bg-black/60 border border-white/5 rounded-xl py-3 px-4 text-white text-xs outline-none focus:border-emerald-500/40" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">County / State</label>
                        <input type="text" required value={county} onChange={e => setCounty(e.target.value)} placeholder="e.g. Nairobi" className="w-full bg-black/60 border border-white/5 rounded-xl py-3 px-4 text-white text-xs outline-none focus:border-emerald-500/40" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">City / Hub</label>
                        <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Westlands" className="w-full bg-black/60 border border-white/5 rounded-xl py-3 px-4 text-white text-xs outline-none focus:border-emerald-500/40" />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || (!locationVerified && !isManualLocation) || !city || !country} 
                  className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all ${ (locationVerified || isManualLocation) && city && country ? 'agro-gradient text-white hover:scale-[1.02]' : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'}`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  INITIALIZE REGISTRY SHARD
                </button>
              </form>
            )}

            {mode === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-10 animate-in zoom-in duration-500 text-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Confirm Shard</h2>
                  <p className="text-slate-500 text-sm">Intercept code received via {email}.</p>
                </div>
                <input type="text" maxLength={6} required autoFocus value={vCode} onChange={e => setVCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-10 text-white font-mono text-5xl text-center focus:ring-4 focus:ring-blue-500/20 tracking-[0.4em] outline-none placeholder:text-slate-900" />
                <button type="submit" disabled={loading || vCode.length !== 6} className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Validate Registry Handshake
                </button>
              </form>
            )}

            {mode === 'mnemonic' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">Recovery Seed</h2>
                  <p className="text-slate-400 text-xs italic leading-relaxed">Store this 12-word phrase in physical isolation. It is the ONLY way to recover your node.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 p-8 bg-black/60 border border-white/10 rounded-[48px] relative overflow-hidden shadow-inner">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                   {generatedMnemonic.split(' ').map((word, i) => (
                     <div key={i} className="bg-white/5 border border-white/5 py-4 px-2 rounded-2xl group hover:border-emerald-500/40 transition-all">
                        <span className="text-[8px] text-slate-700 block mb-1 uppercase font-black tracking-widest">{i + 1}</span>
                        <span className="text-sm font-mono font-bold text-white tracking-tighter">{word}</span>
                     </div>
                   ))}
                </div>
                <button onClick={finalizeRegistration} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  I Have Secured My Seed
                </button>
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-center">
                <div className="flex items-center gap-3 mb-2 text-left">
                  <button onClick={() => { setMode('landing'); setError(null); }} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Cloud Auth</h2>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 block">Enter ESIN Signature</label>
                  <input type="text" required value={esinInput} onChange={e => setEsinInput(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-10 px-6 text-white font-mono text-3xl md:text-4xl text-center uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/20 placeholder:text-slate-900 shadow-inner" />
                </div>
                
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all shadow-xl" onClick={() => setGeoAuthEnabled(!geoAuthEnabled)}>
                   <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-all ${geoAuthEnabled ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-slate-600'}`}>
                         <LocateFixed size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">Geo-Proof Signature</p>
                         <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">Physical Presence (1.1x Resilience Bonus)</p>
                      </div>
                   </div>
                   <div className={`w-12 h-6 rounded-full p-1 transition-all ${geoAuthEnabled ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${geoAuthEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </div>
                </div>

                <button type="submit" disabled={loading || isLocating} className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl disabled:opacity-50 active:scale-95 transition-all">
                  {loading || isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                  {isLocating ? 'Establishing Geo-Gate...' : 'Authorize Session'}
                </button>
                <button type="button" onClick={() => { setMode('recovery'); setRecoveredESIN(null); }} className="text-[10px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot ESIN signature?</button>
              </form>
            )}

            {mode === 'recovery' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => { setMode('login'); setError(null); }} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Node Recovery</h2>
                </div>

                {!recoveredESIN ? (
                  <div className="space-y-8">
                    <div className="flex p-1 bg-white/5 rounded-2xl gap-1">
                      <button onClick={() => setRecoveryMethod('email')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${recoveryMethod === 'email' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Email Anchor</button>
                      <button onClick={() => setRecoveryMethod('phrase')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${recoveryMethod === 'phrase' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Seed Phrase</button>
                    </div>

                    <form onSubmit={handleRecoverySubmit} className="space-y-8">
                      {recoveryMethod === 'email' ? (
                        <div className="space-y-8">
                          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-xl">
                            <Mail className="w-10 h-10 text-blue-400" />
                          </div>
                          <input type="email" required value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} placeholder="steward@registry.node" className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-10 text-white outline-none focus:ring-2 focus:ring-blue-500/40" />
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xl">
                            <Fingerprint className="w-10 h-10 text-emerald-400" />
                          </div>
                          <textarea required value={recoveryPhrase} onChange={e => setRecoveryPhrase(e.target.value)} placeholder="word1 word2 word3..." className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-10 text-white text-lg font-mono h-48 focus:ring-2 focus:ring-emerald-500/40 outline-none resize-none" />
                        </div>
                      )}
                      <button type="submit" disabled={loading} className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-3xl active:scale-95">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {loading ? "Searching Registry..." : "Find My Node"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-8 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-3xl scale-110">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="p-10 bg-black/60 border border-white/10 rounded-[48px] relative group overflow-hidden shadow-inner">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">ESIN Signature</p>
                       <p className="text-2xl font-mono font-black text-emerald-400 tracking-tight">{recoveredESIN}</p>
                    </div>
                    <button onClick={handleCopyESIN} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl">
                       <Copy className="w-5 h-5" /> Copy & Return to Login
                    </button>
                  </div>
                )}
              </div>
            )}

            {mode === 'success' && generatedUser && (
              <div className="space-y-12 animate-in zoom-in duration-700 text-center py-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-3xl scale-110 relative">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                    <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight italic leading-none">Identity Secure</h2>
                  <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.6em] mt-2">EnvirosAgro™ Cloud Sync Complete</p>
                </div>
                <div className="transform scale-90 md:scale-100">
                  <IdentityCard user={generatedUser} />
                </div>
                <button onClick={() => onLogin(generatedUser)} className="w-full max-w-md py-8 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all">
                  Initialize Command Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;