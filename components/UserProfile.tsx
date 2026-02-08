import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  User as UserIcon, MapPin, ShieldCheck, Key, Award, Mail, Calendar, Edit3, 
  CheckCircle2, Lock, Activity, Fingerprint, Save, RefreshCcw, BadgeCheck, 
  TrendingUp, Briefcase, X, Loader2, Scan, ShieldAlert, Cpu, Wifi, Send, 
  LogOut, Trash2, AlertTriangle, Phone, Globe, Radio, Sparkles, Smartphone, 
  Zap, Bell, MessageSquare, ChevronRight, MoreVertical, Check, UserPlus, 
  Handshake, FileCode, FileSignature, Stamp, BookOpenCheck, Coins, Flower2, 
  Download, Gift, Share2, Twitter, Linkedin, Youtube, AtSign, Facebook, Star, 
  History, Terminal, Unlock, KeyRound, Eye, Settings, Database, 
  HeartPulse, Info, Palette, Cloud, Wind, Music, Copy, ExternalLink,
  Target, BarChart3, Binary, Layout, SmartphoneNfc, TreePine, Trophy, Clock, ShieldPlus,
  Camera, Landmark, Pickaxe, Compass, Droplets, Gem, Boxes, Sprout, Crown, Wallet, ArrowRight,
  ShieldX, MessageSquareCode, Printer, FileDown
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip,
  Radar as RechartsRadar
} from 'recharts';
import { User, ViewState, SignalShard } from '../types';
import { auth, resendVerificationEmail, setupRecaptcha, requestPhoneCode } from '../services/firebaseService';
import IdentityCard from './IdentityCard';

interface UserProfileProps {
  user: User;
  isGuest: boolean;
  onUpdate: (user: User) => void;
  onLogin: (user: User) => void;
  onNavigate: (view: ViewState) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  notify: any;
}

const MONTH_FLOWERS: Record<string, { flower: string; color: string; hex: string; desc: string; zodiac: string; trait: string }> = {
  'January': { flower: 'Carnation', trait: 'Devotion', zodiac: 'Capricorn/Aquarius', color: 'text-pink-400', hex: '#f472b6', desc: 'Symbol of fascination and divine love.' },
  'February': { flower: 'Violet', trait: 'Loyalty', zodiac: 'Aquarius/Pisces', color: 'text-purple-400', hex: '#c084fc', desc: 'Symbol of loyalty, wisdom, and hope.' },
  'March': { flower: 'Daffodil', trait: 'New Beginnings', zodiac: 'Pisces/Aries', color: 'text-yellow-400', hex: '#facc15', desc: 'Symbol of rebirth and new beginnings.' },
  'April': { flower: 'Daisy', trait: 'Innocence', zodiac: 'Aries/Taurus', color: 'text-stone-200', hex: '#e7e5e4', desc: 'Symbol of purity, innocence, and true love.' },
  'May': { flower: 'Lily Valley', trait: 'Happiness', zodiac: 'Taurus/Gemini', color: 'text-emerald-100', hex: '#ecfdf5', desc: 'Symbol of sweetness and return of happiness.' },
  'June': { flower: 'Rose', trait: 'Passion', zodiac: 'Gemini/Cancer', color: 'text-rose-500', hex: '#f43f5e', desc: 'Symbol of passion, beauty, and friendship.' },
  'July': { flower: 'Larkspur', trait: 'Positivity', zodiac: 'Cancer/Leo', color: 'text-blue-400', hex: '#60a5fa', desc: 'Symbol of positivity, dignity, and open heart.' },
  'August': { flower: 'Gladiolus', trait: 'Strength', zodiac: 'Leo/Virgo', color: 'text-orange-500', hex: '#f97316', desc: 'Symbol of strength and moral integrity.' },
  'September': { flower: 'Aster', trait: 'Wisdom', zodiac: 'Virgo/Libra', color: 'text-indigo-400', hex: '#818cf8', desc: 'Symbol of love, wisdom, and faith.' },
  'October': { flower: 'Marigold', trait: 'Optimism', zodiac: 'Libra/Scorpio', color: 'text-amber-500', hex: '#f59e0b', desc: 'Symbol of optimism and prosperity.' },
  'November': { flower: 'Chrysanthemum', trait: 'Abundance', zodiac: 'Scorpio/Sagittarius', color: 'text-red-500', hex: '#ef4444', desc: 'Symbol of joy and abundance.' },
  'December': { flower: 'Narcissus', trait: 'Respect', zodiac: 'Sagittarius/Capricorn', color: 'text-blue-100', hex: '#f0f9ff', desc: 'Symbol of respect and faithfulness.' },
};

const PROGRESSION_TIERS = [
  { level: 1, title: 'Seeder', icon: Sprout, col: 'text-emerald-400' },
  { level: 2, title: 'Cultivator', icon: MapPin, col: 'text-emerald-500' },
  { level: 3, title: 'Miner', icon: Pickaxe, col: 'text-amber-500' },
  { level: 4, title: 'Steward', icon: ShieldCheck, col: 'text-blue-400' },
  { level: 5, title: 'Super-Agro', icon: Crown, col: 'text-indigo-400' },
];

const UserProfile: React.FC<UserProfileProps> = ({ user, isGuest, onUpdate, onNavigate, signals, setSignals, notify }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'signals' | 'dossier' | 'security' | 'sharing'>('hub');
  const [isEditing, setIsEditing] = useState(false);
  const [isMintingCert, setIsMintingCert] = useState(false);
  const [certMinted, setCertMinted] = useState(!!user.zodiacFlower?.certId);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Verification States
  const [phoneInput, setPhoneInput] = useState(user.lineNumber || '');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const isEmailVerified = (auth.currentUser as any)?.emailVerified;
  const unreadCount = signals.filter(n => !n.read).length;

  const currentTier = useMemo(() => {
    const score = user.metrics.sustainabilityScore;
    const hasLand = (user.resources || []).some(r => r.category === 'LAND');
    if (score > 90 && hasLand) return PROGRESSION_TIERS[4];
    if (score > 75 && hasLand) return PROGRESSION_TIERS[3];
    if (hasLand && user.wallet.eatBalance > 5) return PROGRESSION_TIERS[2];
    if (hasLand) return PROGRESSION_TIERS[1];
    return PROGRESSION_TIERS[0];
  }, [user.metrics.sustainabilityScore, user.resources, user.wallet.eatBalance]);

  useEffect(() => {
    if (activeTab === 'signals' && unreadCount > 0) {
      setSignals(prev => prev.map(s => ({ ...s, read: true })));
    }
  }, [activeTab, unreadCount, setSignals]);

  const skillData = useMemo(() => {
    const base = [
      { subject: 'Agronomy', A: 40 },
      { subject: 'Robotics', A: 20 },
      { subject: 'Commerce', A: 35 },
      { subject: 'Ecology', A: 50 },
      { subject: 'Ledger', A: 30 },
    ];
    return base.map(b => ({ ...b, A: user.skills?.[b.subject] || b.A }));
  }, [user.skills]);

  const handleUpdateMonth = (month: string) => {
    const flowerData = MONTH_FLOWERS[month];
    if (!flowerData) return;
    onUpdate({
      ...user,
      zodiacFlower: {
        month,
        flower: flowerData.flower,
        color: flowerData.color,
        hex: flowerData.hex,
        pointsAdded: true
      }
    });
    setCertMinted(false);
  };

  const handleSaveProfile = () => {
    onUpdate(editedUser);
    setIsEditing(false);
    alert("REGISTRY_UPDATE: Steward identity anchored successfully to local ledger.");
  };

  const handleMintCertificate = () => {
    if (isGuest) {
      alert("UPGRADE_REQUIRED: Minting certificates requires an anchored registry node.");
      return;
    }
    setIsMintingCert(true);
    setTimeout(() => {
      setIsMintingCert(false);
      const certId = `CERT-ZOD-${Math.random().toString(36).substring(7).toUpperCase()}`;
      setCertMinted(true);
      onUpdate({
        ...user,
        zodiacFlower: {
          ...user.zodiacFlower!,
          certId: certId,
          mintedAt: new Date().toISOString()
        }
      });
    }, 3500);
  };

  const downloadProfessionalShard = () => {
    // Generate a standalone HTML shard that looks like a professional card
    const qrData = JSON.stringify({
      esin: user.esin,
      name: user.name,
      role: user.role,
      loc: user.location,
      ver: "EOS-6.5",
      reg: user.regDate
    });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=050706&color=10b981`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>EnvirosAgro ID Shard - ${user.esin}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background: #000; color: #fff; }
        .card { width: 85.6mm; height: 53.98mm; background: #050706; border-radius: 12px; border: 1px solid rgba(16,185,129,0.3); position: relative; overflow: hidden; }
        .agro-gradient { background: linear-gradient(135deg, #065f46 0%, #10b981 100%); }
      </style>
    </head>
    <body class="flex items-center justify-center min-h-screen">
      <div class="card p-4 flex flex-col justify-between shadow-2xl">
        <div class="flex justify-between items-start">
           <div className="flex items-center gap-2">
             <div class="w-8 h-8 agro-gradient rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.47 10-10 10z"/><path d="M11 20v-5"/></svg>
             </div>
             <div>
               <h3 class="text-[10px] font-black uppercase tracking-tighter italic leading-none">Enviros<span class="text-emerald-400">Agro™</span></h3>
               <p class="text-[5px] text-slate-500 uppercase tracking-[0.2em] font-bold">Industrial Identity</p>
             </div>
           </div>
           <div class="text-right">
             <p class="text-[5px] text-emerald-500 font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/5">Authenticated</p>
           </div>
        </div>
        <div class="flex gap-4 items-center">
           <div class="flex-1 space-y-2">
             <div class="space-y-0.5">
               <p class="text-[5px] text-slate-600 font-bold uppercase tracking-widest">Steward Designation</p>
               <h4 class="text-sm font-black italic tracking-tighter truncate uppercase">${user.name}</h4>
             </div>
             <div class="grid grid-cols-2 gap-2">
               <div>
                 <p class="text-[5px] text-slate-700 font-bold uppercase tracking-widest">Pillar Role</p>
                 <p class="text-[7px] font-bold uppercase truncate">${user.role}</p>
               </div>
               <div>
                 <p class="text-[5px] text-slate-700 font-bold uppercase tracking-widest">Registry ID</p>
                 <p class="text-[7px] font-mono font-bold">${user.esin}</p>
               </div>
             </div>
           </div>
           <div class="w-16 h-16 bg-black p-1 rounded-lg border border-white/10">
              <img src="${qrUrl}" class="w-full h-full">
           </div>
        </div>
        <div class="flex justify-between items-end border-t border-white/10 pt-2">
           <p class="text-[5px] text-slate-700 font-mono">HASH: 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}</p>
           <p class="text-[5px] text-slate-700 font-mono">REG: ${user.regDate}</p>
        </div>
      </div>
    </body>
    </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STEWARD_CARD_${user.esin}.html`;
    a.click();
    URL.revokeObjectURL(url);
    notify('success', 'SHARD_DOWNLOADED', 'Professional Identity Shard (HTML) saved to local node.');
  };

  const downloadCertificate = () => {
    if (!user.zodiacFlower?.certId) return;
    const certHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Celestial Certificate - ${user.zodiacFlower.certId}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background: #020403; color: #fff; padding: 40px; display: flex; items-center; justify-center; min-height: 100vh; }
        .cert { max-width: 800px; width: 100%; border: 8px double rgba(16,185,129,0.3); padding: 60px; background: rgba(5,7,6,0.8); border-radius: 40px; position: relative; }
        .agro-gradient { background: linear-gradient(135deg, #065f46 0%, #10b981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      </style>
    </head>
    <body>
      <div class="cert text-center space-y-12">
        <div class="space-y-4">
           <h1 class="text-5xl font-black uppercase italic tracking-tighter agro-gradient">Certificate of Bio-Resonance</h1>
           <p class="text-xs text-slate-500 font-bold uppercase tracking-[0.5em]">EnvirosAgro™ Celestial Vault</p>
        </div>
        <div class="space-y-2">
           <p class="text-xs text-slate-600 font-black uppercase tracking-widest">Presented to Steward</p>
           <h2 class="text-4xl font-black uppercase italic">${user.name}</h2>
           <p class="text-sm font-mono text-emerald-400">${user.esin}</p>
        </div>
        <div class="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
           <div>
              <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Celestial Cycle</p>
              <p class="text-2xl font-bold uppercase">${user.zodiacFlower.month}</p>
           </div>
           <div>
              <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resonant Flower</p>
              <p class="text-2xl font-bold uppercase">${user.zodiacFlower.flower}</p>
           </div>
        </div>
        <div class="space-y-2 pt-8">
           <p class="text-[10px] text-slate-700 font-mono">CERTIFICATE_ID: ${user.zodiacFlower.certId}</p>
           <p class="text-[10px] text-slate-700 font-mono">MINT_TIMESTAMP: ${user.zodiacFlower.mintedAt}</p>
           <p class="text-[10px] text-emerald-600 font-black uppercase tracking-[0.3em] mt-4">Registry Finality: ZK_PROVEN</p>
        </div>
      </div>
    </body>
    </html>
    `;
    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CELESTIAL_CERT_${user.zodiacFlower.certId}.html`;
    a.click();
    URL.revokeObjectURL(url);
    notify('success', 'CERT_DOWNLOADED', 'Verifiable Celestial Shard (HTML) saved.');
  };

  const handlePrintId = () => {
    window.print();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditedUser(prev => ({ ...prev, avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Verification Logic ---
  const handleEmailResend = async () => {
    setIsVerifying(true);
    try {
      await resendVerificationEmail();
      alert("SIGNAL_TRANSMITTED: Verification shard sent to Gmail. Check your inbox.");
    } catch (e) {
      alert("SYNC_ERROR: Failed to transmit verification shard.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePhoneVerifyStart = async () => {
    if (!phoneInput) return;
    setIsVerifying(true);
    setVerificationError(null);
    try {
      const verifier = setupRecaptcha('recaptcha-container-profile');
      const result = await requestPhoneCode(phoneInput, verifier);
      setConfirmationResult(result);
      setOtpStep(true);
    } catch (err: any) {
      setVerificationError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpVerify = async () => {
    const code = otpCode.join('');
    if (code.length < 6) return;
    setIsVerifying(true);
    try {
      await confirmationResult.confirm(code);
      const updatedUser: User = { ...user, isPhoneVerified: true, lineNumber: phoneInput };
      onUpdate(updatedUser);
      setOtpStep(false);
      alert("HANDSHAKE_VERIFIED: Phone node anchored to registry.");
    } catch (err: any) {
      setVerificationError("INVALID_OTP: Code mismatch.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...otpCode];
    newCode[index] = val.slice(-1);
    setOtpCode(newCode);
    if (val && index < 5) {
      document.getElementById(`otp-profile-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      <div id="recaptcha-container-profile"></div>
      
      {/* 1. Profile Header / ID Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <div className="lg:col-span-8">
           <div className="glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col md:flex-row items-center gap-12 group shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
                 <Fingerprint className="w-[600px] h-[600px] text-white" />
              </div>
              
              <div className="relative shrink-0 flex flex-col items-center gap-4">
                 <div className="w-44 h-44 rounded-full bg-slate-800 border-4 border-white/10 flex items-center justify-center text-8xl font-black text-emerald-400 shadow-2xl group-hover:scale-105 transition-transform duration-700 overflow-hidden relative">
                   {user.avatar ? (
                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                     user.name[0]
                   )}
                   {isEditing && (
                     <button onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera size={40} />
                     </button>
                   )}
                 </div>
                 <input type="file" ref={avatarInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                 <div className="flex gap-2">
                    <span className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest ${currentTier.col}`}>
                       Tier: {currentTier.title}
                    </span>
                 </div>
              </div>

              <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
                 <div className="space-y-2">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                       <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">{user.name}</h2>
                       {!isGuest && <BadgeCheck className="w-8 h-8 text-blue-400 shadow-blue-500/20" />}
                    </div>
                    <p className="text-emerald-400 font-mono text-sm tracking-[0.4em] uppercase">{user.esin}</p>
                 </div>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{user.role}</span>
                    <span className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest">{user.location}</span>
                 </div>
                 <div className="pt-4 flex justify-center md:justify-start">
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl"
                    >
                       <Edit3 size={16} /> {isEditing ? 'CANCEL EDIT' : 'EDIT CORE PROFILE'}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between shadow-3xl group">
           <div className="space-y-8">
              <div className="flex justify-between items-center px-2">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Node Treasury</p>
                 <Wallet className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center space-y-1 shadow-inner">
                    <p className="text-[8px] text-slate-600 font-black uppercase">Utility EAC</p>
                    <p className="text-2xl font-mono font-black text-white">{user.wallet.balance.toFixed(0)}</p>
                 </div>
                 <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center space-y-1 shadow-inner">
                    <p className="text-[8px] text-slate-600 font-black uppercase">Equity EAT</p>
                    <p className="text-2xl font-mono font-black text-amber-500">{user.wallet.eatBalance.toFixed(2)}</p>
                 </div>
              </div>
           </div>
           <button onClick={() => onNavigate('wallet')} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[28px] text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-xl mt-6">Open Node Treasury</button>
        </div>
      </div>

      {/* 2. Main Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide gap-4 p-2 glass-card rounded-[32px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-6 mx-auto lg:mx-4 relative z-20">
        {[
          { id: 'hub', label: 'STEWARD HUB', icon: Layout },
          { id: 'signals', label: 'NODE SIGNALS', icon: Bell, badge: unreadCount },
          { id: 'dossier', label: 'CELESTIAL VAULT', icon: Flower2 },
          { id: 'security', label: 'VAULT SECURITY', icon: Settings },
          { id: 'sharing', label: 'GRID DIFFUSION', icon: Share2 },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105 ring-4 ring-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
            {tab.badge && tab.badge > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#050706]">{tab.badge}</span>}
          </button>
        ))}
      </div>

      <div className="min-h-[800px] px-4">
        {isEditing ? (
          <div className="max-w-4xl mx-auto glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.02] shadow-3xl animate-in slide-in-from-bottom-6">
             <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl text-white"><Edit3 size={32} /></div>
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Edit <span className="text-indigo-400">Core Profile</span></h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Steward Name</label>
                      <input type="text" value={editedUser.name} onChange={e => setEditedUser({...editedUser, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold italic focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Role Shard</label>
                      <input type="text" value={editedUser.role} onChange={e => setEditedUser({...editedUser, role: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase tracking-widest" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Location Hub</label>
                      <input type="text" value={editedUser.location} onChange={e => setEditedUser({...editedUser, location: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold italic focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Gender Shard</label>
                      <select value={editedUser.gender || 'Not Specified'} onChange={e => setEditedUser({...editedUser, gender: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none focus:ring-4 focus:ring-indigo-500/10 transition-all">
                         <option>Male</option>
                         <option>Female</option>
                         <option>Non-Binary</option>
                         <option>Not Specified</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Steward Bio (Social Hub)</label>
                      <textarea value={editedUser.bio || ''} onChange={e => setEditedUser({...editedUser, bio: e.target.value})} placeholder="Describe your agricultural philosophy..." className="w-full bg-black border border-white/10 rounded-3xl p-6 text-white text-sm h-32 resize-none italic focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner" />
                   </div>
                </div>
             </div>
             <div className="pt-12 mt-12 border-t border-white/5 flex gap-6 justify-center">
                <button onClick={() => setIsEditing(false)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Discard Changes</button>
                <button onClick={handleSaveProfile} className="px-20 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">ANCHOR UPDATED IDENTITY</button>
             </div>
          </div>
        ) : (
          <>
            {activeTab === 'hub' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="lg:col-span-8 space-y-10">
                    <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 shadow-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s]"><Compass size={400} /></div>
                       <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 gap-10">
                          <div className="flex items-center gap-8">
                             <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl"><Compass className="w-10 h-10 text-white" /></div>
                             <div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Identity <span className="text-emerald-400">Shard Hub</span></h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3">EOS_IDENTITY_HANDSHAKE_v6.5</p>
                             </div>
                          </div>
                          
                          <div className="flex gap-4">
                             <button 
                               onClick={handlePrintId}
                               className="px-8 py-4 bg-white rounded-2xl text-black font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-emerald-50 transition-all active:scale-95"
                             >
                                <Printer size={16} /> Print Card
                             </button>
                             <button 
                               onClick={downloadProfessionalShard}
                               className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95"
                             >
                                <FileDown size={16} /> Download Shard
                             </button>
                          </div>
                       </div>

                       <div className="flex justify-center py-10 relative z-10">
                          <IdentityCard user={user} />
                       </div>

                       <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-indigo-400 group-hover:scale-110 transition-all shadow-inner"><Target size={32} /></div>
                             <div className="text-left">
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Sustainability Baseline</p>
                                <p className="text-3xl font-mono font-black text-white">{user.metrics.sustainabilityScore}%</p>
                             </div>
                          </div>
                          <button onClick={() => onNavigate('online_garden')} className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all">Go to Garden Hub</button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-10 glass-card rounded-[56px] border border-blue-500/20 bg-blue-500/[0.02] space-y-8 shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700"><SmartphoneNfc size={200} className="text-blue-500" /></div>
                          <div className="flex items-center gap-4 relative z-10">
                             <div className="p-3 bg-blue-600 rounded-2xl shadow-xl"><Binary size={24} className="text-white" /></div>
                             <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Hardware <span className="text-blue-400">Registry</span></h4>
                          </div>
                          <p className="text-sm text-slate-400 italic relative z-10 leading-relaxed">"Manage sharded industrial nodes."</p>
                          <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 shadow-inner relative z-10">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Nodes</span>
                                <span className="text-xl font-mono font-black text-blue-400">{(user.resources || []).filter(r => r.category === 'HARDWARE').length}</span>
                             </div>
                             <button onClick={() => onNavigate('registry_handshake')} className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-md">Open Handshake</button>
                          </div>
                       </div>
                       <div className="p-10 glass-card rounded-[56px] border border-emerald-500/20 bg-emerald-500/[0.02] space-y-8 shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700"><TreePine size={200} className="text-emerald-500" /></div>
                          <div className="flex items-center gap-4 relative z-10">
                             <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl"><MapPin size={24} className="text-white" /></div>
                             <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Land <span className="text-emerald-400">Inventory</span></h4>
                          </div>
                          <p className="text-sm text-slate-400 italic relative z-10 leading-relaxed">"Verified geofence plots."</p>
                          <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 shadow-inner relative z-10">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Anchored Shards</span>
                                <span className="text-xl font-mono font-black text-emerald-400">{(user.resources || []).filter(r => r.category === 'LAND').length}</span>
                             </div>
                             <button onClick={() => onNavigate('registry_handshake')} className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-md">Pair Physical Plot</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/60 relative overflow-hidden shadow-3xl flex flex-col items-center">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">DOMAIN_PROFICIENCY</h4>
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontStyle="italic" />
                                <RechartsRadar name="Steward" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="pt-10 border-t border-white/5 w-full mt-10 grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Reputation</p>
                             <p className="text-xl font-mono font-black text-indigo-400">{user.wallet.lifetimeEarned.toFixed(0)}</p>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Rank</p>
                             <p className="text-xl font-mono font-black text-emerald-400">#{(Math.random()*100).toFixed(0)}</p>
                          </div>
                       </div>
                    </div>

                    <div className="glass-card p-10 rounded-[56px] border border-fuchsia-500/20 bg-fuchsia-950/5 space-y-6 shadow-xl group/gift relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform"><Flower2 size={120} /></div>
                       <div className="flex items-center gap-4 relative z-10">
                          <Gift className="w-6 h-6 text-fuchsia-400 animate-bounce" />
                          <h4 className="text-xl font-black text-white uppercase italic">Celestial Shard</h4>
                       </div>
                       {!user.zodiacFlower ? (
                         <div className="space-y-4 relative z-10">
                            <p className="text-xs text-slate-500 italic">Identify birth cycle to unlock.</p>
                            <button onClick={() => setActiveTab('dossier')} className="w-full py-4 bg-fuchsia-800 hover:bg-fuchsia-700 rounded-2xl text-[9px] font-black uppercase text-white shadow-xl transition-all">Go to Vault</button>
                         </div>
                       ) : (
                         <div className="flex items-center gap-6 relative z-10 animate-in zoom-in">
                            <div className="w-16 h-16 rounded-2xl bg-fuchsia-600/20 flex items-center justify-center border border-fuchsia-500/40">
                               <Flower2 className={user.zodiacFlower.color} />
                            </div>
                            <div>
                               <p className="text-lg font-black text-white uppercase italic leading-none">{user.zodiacFlower.flower}</p>
                               <p className="text-[9px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{user.zodiacFlower.month} Shard</p>
                            </div>
                            <button onClick={() => setActiveTab('dossier')} className="ml-auto p-3 bg-white/5 rounded-xl text-fuchsia-400"><ArrowRight size={20}/></button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-10 duration-500">
                 <div className="p-16 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl space-y-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[12s]"><Lock size={500} className="text-indigo-400" /></div>
                    <div className="relative z-10 text-center space-y-8 border-b border-white/5 pb-16">
                       <div className="w-28 h-28 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform">
                          <ShieldPlus size={56} className="text-white" />
                       </div>
                       <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Vault <span className="text-indigo-400">Security</span></h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                       <div className="space-y-10">
                          <div className="p-10 bg-emerald-500/5 rounded-[56px] border border-emerald-500/20 space-y-8 shadow-inner">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <ShieldCheck size={24} className="text-emerald-400" />
                                <h4 className="text-xl font-black text-white uppercase italic m-0">Registry Trust</h4>
                             </div>
                             
                             {/* Gmail Node Verification */}
                             <div className="space-y-4">
                               <div className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3">
                                     <Mail size={14} className="text-slate-500" />
                                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gmail Node</span>
                                  </div>
                                  <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isEmailVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                     {isEmailVerified ? 'VERIFIED' : 'PENDING'}
                                  </div>
                               </div>
                               {!isEmailVerified && (
                                 <button onClick={handleEmailResend} disabled={isVerifying} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                   {isVerifying ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                   Resend Verification Shard
                                 </button>
                               )}
                             </div>

                             {/* Phone Node Verification */}
                             <div className="space-y-4 pt-4 border-t border-white/5">
                               <div className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3">
                                     <Smartphone size={14} className="text-slate-500" />
                                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Node</span>
                                  </div>
                                  <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.isPhoneVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                     {user.isPhoneVerified ? 'VERIFIED' : 'PENDING'}
                                  </div>
                               </div>
                               {!user.isPhoneVerified && (
                                 <div className="space-y-4 animate-in slide-in-from-top-2">
                                    {!otpStep ? (
                                      <div className="flex gap-2">
                                         <input 
                                           type="tel" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} 
                                           placeholder="+254 700 000 000"
                                           className="flex-1 bg-black border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:ring-2 focus:ring-blue-500/20 outline-none" 
                                         />
                                         <button onClick={handlePhoneVerifyStart} disabled={isVerifying || !phoneInput} className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase transition-all">
                                            {isVerifying ? <Loader2 size={12} className="animate-spin" /> : 'Send OTP'}
                                         </button>
                                      </div>
                                    ) : (
                                      <div className="space-y-4 p-6 bg-black rounded-[32px] border border-white/10 shadow-inner">
                                         <p className="text-[9px] text-slate-500 font-black uppercase text-center mb-4">Enter 6-Digit SMS Shard</p>
                                         <div className="flex justify-center gap-2">
                                            {otpCode.map((digit, i) => (
                                              <input
                                                key={i} id={`otp-profile-${i}`} type="text" maxLength={1} value={digit}
                                                onChange={e => handleOtpChange(e.target.value, i)}
                                                className="w-8 h-10 bg-black/60 border border-white/10 rounded-lg text-center text-xl font-mono font-black text-blue-400 outline-none focus:border-blue-500"
                                              />
                                            ))}
                                         </div>
                                         <button onClick={handleOtpVerify} disabled={isVerifying} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[9px] font-black uppercase transition-all shadow-xl">
                                            {isVerifying ? <Loader2 size={12} className="animate-spin" /> : 'Verify & Anchor'}
                                         </button>
                                         <button onClick={() => setOtpStep(false)} className="w-full text-[8px] text-slate-600 font-black uppercase hover:text-white">Back</button>
                                      </div>
                                    )}
                                 </div>
                               )}
                               {verificationError && <p className="text-[8px] text-rose-500 uppercase font-black px-4">{verificationError}</p>}
                             </div>
                          </div>
                          
                          <div className="p-10 bg-black/80 rounded-[56px] border border-white/5 space-y-6 shadow-inner group/phrase hover:border-indigo-500/30 transition-all">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <KeyRound size={24} className="text-indigo-400" />
                                <h4 className="text-xl font-black text-white uppercase italic m-0">Recovery Shards</h4>
                             </div>
                             <div className="grid grid-cols-3 gap-3">
                                {user.mnemonic.split(' ').map((word, i) => (
                                   <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center relative group/word">
                                      <span className="text-[9px] font-black text-white uppercase tracking-widest blur-md group-hover/word:blur-none transition-all cursor-help">{word}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
            
            {activeTab === 'dossier' && (
              <div className="max-w-5xl mx-auto space-y-16 animate-in zoom-in duration-500 text-center">
                 <div className="space-y-6">
                    <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">CELESTIAL <span className="text-fuchsia-400">VAULT</span></h3>
                    <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto">"Managing cosmic agricultural resonance and birth cycle sharding."</p>
                 </div>

                 <div className="glass-card p-12 rounded-[80px] border border-fuchsia-500/20 bg-fuchsia-500/[0.02] space-y-12 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Flower2 size={600} className="text-fuchsia-400" /></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 text-left">
                       <div className="space-y-8">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                             <Star className="w-8 h-8 text-fuchsia-400 fill-fuchsia-400" /> Birth Cycle Sync
                          </h4>
                          <p className="text-slate-400 text-lg leading-relaxed italic">Select your birth cycle:</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                             {Object.keys(MONTH_FLOWERS).map(m => (
                                <button 
                                   key={m} 
                                   onClick={() => handleUpdateMonth(m)} 
                                   className={`py-5 rounded-[24px] text-[10px] font-black uppercase transition-all border-2 ${user.zodiacFlower?.month === m ? 'bg-fuchsia-600 text-white border-white shadow-xl scale-110' : 'bg-black/40 border-white/10 text-slate-600 hover:text-fuchsia-400 hover:border-fuchsia-500/40'}`}
                                >
                                   {m.substring(0,3)}
                                </button>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-col justify-center">
                          {!user.zodiacFlower ? (
                            <div className="text-center space-y-10 py-16 opacity-30 border-4 border-dashed border-white/5 rounded-[64px] bg-black/20">
                               <Gift size={100} className="text-slate-500 mx-auto animate-bounce" />
                               <p className="text-2xl font-black uppercase tracking-[0.5em] text-white">ORACLE STANDBY</p>
                            </div>
                          ) : (
                            <div className="space-y-12 animate-in slide-in-from-right-10">
                               <div className="glass-card p-12 rounded-[64px] bg-black/60 border-2 border-fuchsia-500/30 flex flex-col items-center text-center space-y-8 shadow-3xl relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-4 opacity-[0.05]"><Sparkles size={120} /></div>
                                  <div className="w-40 h-40 rounded-[48px] flex items-center justify-center shadow-[0_0_80px_rgba(232,121,249,0.2)] border-2 border-fuchsia-500/40 bg-fuchsia-500/5 group-hover:scale-105 transition-transform relative">
                                     <Flower2 size={80} className={user.zodiacFlower.color} />
                                  </div>
                                  <div className="space-y-3">
                                     <h5 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{user.zodiacFlower.flower}</h5>
                                     <p className="text-xs text-fuchsia-400 font-black uppercase tracking-[0.3em]">{MONTH_FLOWERS[user.zodiacFlower.month].trait} INTEGRITY SHARD</p>
                                  </div>
                               </div>

                               {!certMinted ? (
                                 <button 
                                   onClick={handleMintCertificate} 
                                   disabled={isMintingCert}
                                   className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(232,121,249,0.3)] flex items-center justify-center gap-6 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 ring-8 ring-white/5"
                                 >
                                    {isMintingCert ? <Loader2 size={32} className="animate-spin" /> : <Stamp size={32} />}
                                    {isMintingCert ? 'SEQUENCING SHARD...' : 'MINT CELESTIAL CERTIFICATE'}
                                 </button>
                               ) : (
                                 <button 
                                   onClick={downloadCertificate}
                                   className="w-full py-10 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-6 transition-all"
                                 >
                                    <Download size={32} /> DOWNLOAD CERT SHARD
                                 </button>
                               )}
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
                <div className="lg:col-span-8 space-y-10">
                   <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Node <span className="text-indigo-400">Signals</span></h3>
                         <p className="text-slate-500 text-lg font-medium italic mt-2">Sharded node alerts.</p>
                      </div>
                   </div>
                   <div className="grid gap-6">
                      {(signals || []).length === 0 ? (
                         <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                            <Radio size={80} className="text-slate-600 animate-pulse" />
                            <p className="text-2xl font-black uppercase tracking-[0.4em]">Signal Buffer Empty</p>
                         </div>
                      ) : (
                        (signals || []).map(signal => (
                            <div key={signal.id} className={`glass-card p-10 rounded-[48px] border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden bg-black/40 shadow-2xl ${
                               signal.read ? 'opacity-50 grayscale border-white/5' : signal.priority === 'high' ? 'border-rose-500/20' : 'border-white/5'
                            }`}>
                               <div className="flex items-center gap-8 w-full md:w-auto">
                                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center"><Database size={24}/></div>
                                  <div className="space-y-1">
                                     <h4 className="text-xl font-black text-white uppercase italic">{signal.title}</h4>
                                     <p className="text-slate-400 text-sm italic">"{signal.message}"</p>
                                  </div>
                               </div>
                            </div>
                         ))
                      )}
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === 'sharing' && (
              <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700 text-center">
                 <div className="p-20 glass-card rounded-[80px] border-2 border-emerald-500/20 bg-black/60 shadow-3xl space-y-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s]"><Share2 size={800} className="text-emerald-400" /></div>
                    <div className="relative z-10 space-y-10">
                       <div className="w-32 h-32 bg-emerald-600 rounded-[48px] flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] mx-auto border-4 border-white/10">
                          <Radio size={64} className="text-white animate-pulse" />
                       </div>
                       <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0">Grid <span className="text-emerald-400">Diffusion</span></h3>
                       <p className="text-slate-400 text-2xl font-medium mt-8 italic max-w-3xl mx-auto leading-relaxed">
                          "Broadcast your stewardship metrics and node integrity across the local and global network mesh."
                       </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 max-w-4xl mx-auto pt-10">
                       {[
                         { id: 'x', label: 'X / TWITTER', icon: Twitter, color: 'hover:text-blue-400' },
                         { id: 'whatsapp', label: 'WHATSAPP', icon: MessageSquare, color: 'hover:text-emerald-400' },
                         { id: 'facebook', label: 'FACEBOOK', icon: Facebook, color: 'hover:text-blue-600' },
                         { id: 'linkedin', label: 'LINKEDIN', icon: Linkedin, color: 'hover:text-blue-500' },
                       ].map(p => (
                          <button 
                             key={p.id} 
                             className="flex flex-col items-center gap-8 p-12 bg-black/80 border border-white/10 rounded-[64px] transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 group/share shadow-2xl active:scale-95 ring-4 ring-white/5"
                          >
                             <p.icon size={64} className={`text-slate-700 transition-all group-hover/share:scale-110 group-hover/share:rotate-6 ${p.color}`} />
                             <span className="text-xs font-black text-slate-500 group-hover/share:text-white uppercase tracking-[0.4em]">{p.label}</span>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 150px -20px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-card, .print-card * {
            visibility: visible;
          }
          .print-card {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;