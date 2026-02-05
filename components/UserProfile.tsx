import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  User as UserIcon, MapPin, ShieldCheck, Key, Award, Mail, Calendar, Edit3, 
  CheckCircle2, Lock, Activity, Fingerprint, Save, RefreshCcw, BadgeCheck, 
  TrendingUp, Briefcase, X, Loader2, Scan, ShieldAlert, Cpu, Wifi, Send, 
  LogOut, Trash2, AlertTriangle, Phone, Globe, Radio, Sparkles, Smartphone, 
  Zap, Bell, MessageSquare, ChevronRight, MoreVertical, Check, UserPlus, 
  Handshake, FileCode, FileSignature, Stamp, BookOpenCheck, Coins, Flower2, 
  Download, Gift, Share2, Twitter, Linkedin, Youtube, AtSign, Facebook, Star, 
  History, Terminal, ShieldX, Unlock, KeyRound, Eye, Settings, Database, 
  HeartPulse, Info, Palette, Cloud, Wind, Music, Copy, ExternalLink,
  Target, BarChart3, Binary, Layout, SmartphoneNfc, TreePine, Trophy, Clock, ShieldPlus,
  Camera, Landmark
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { User } from '../types';
import IdentityCard from './IdentityCard';
import { SignalShard } from '../App';
import { auth, resendVerificationEmail } from '../services/firebaseService';
import Login from './Login';

interface UserProfileProps {
  user: User;
  isGuest: boolean;
  onUpdate: (user: User) => void;
  onLogin: (user: User) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  onAcceptProposal?: (id: string) => void;
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

const UserProfile: React.FC<UserProfileProps> = ({ user, isGuest, onUpdate, onLogin, onLogout, onDeleteAccount, signals, setSignals }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'signals' | 'dossier' | 'security' | 'sharing'>('hub');
  const [isEditing, setIsEditing] = useState(false);
  const [isMintingCert, setIsMintingCert] = useState(false);
  const [certMinted, setCertMinted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isResendingVerif, setIsResendingVerif] = useState(false);
  const [verifSent, setVerifSent] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Fix: Cast auth.currentUser to any to satisfy type checker for emailVerified property
  const isEmailVerified = (auth.currentUser as any)?.emailVerified;
  const unreadCount = signals.filter(n => !n.read).length;

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

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

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

  const handleResendVerif = async () => {
    setIsResendingVerif(true);
    try {
      await resendVerificationEmail();
      setVerifSent(true);
      setTimeout(() => setVerifSent(false), 5000);
    } catch (e) {
      alert("Failed to transmit verification shard.");
    } finally {
      setIsResendingVerif(false);
    }
  };

  const handleMintCertificate = () => {
    if (isGuest) {
      alert("UPGRADE_REQUIRED: Minting certificates requires an anchored registry node.");
      return;
    }
    setIsMintingCert(true);
    setTimeout(() => {
      setIsMintingCert(false);
      setCertMinted(true);
      alert("SUCCESS: Birth Month Gift Certificate has been minted to your digital vault.");
    }, 3500);
  };

  const handleDownloadCertificate = () => {
    if (!user.zodiacFlower) return;
    
    const certContent = `
ENVIROSAGRO BLOCKCHAIN REGISTRY
===============================
CELESTIAL STEWARD CERTIFICATE
-------------------------------
Steward Designation: ${user.name}
Node ESIN: ${user.esin}
Registry Date: ${new Date().toLocaleDateString()}
-------------------------------
Birth Month Cycle: ${user.zodiacFlower.month}
Zodiac/Integrity Shard: ${MONTH_FLOWERS[user.zodiacFlower.month].trait}
Celestial Flower: ${user.zodiacFlower.flower}
Registry Hash: 0x${Math.random().toString(16).substring(2, 12).toUpperCase()}
===============================
CERTIFIED BY THE ENVIROSAGRO ORACLE
    `;

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CELESTIAL_SHARD_${user.esin}_CERT.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = (platform: string) => {
    const appUrl = window.location.origin;
    const text = `I am a verified Steward on the EnvirosAgro Blockchain. Join the decentralized sustainability revolution! Node: ${user.esin}`;
    const shareUrls: Record<string, string> = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + appUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank');
  };

  const handleCopyRef = () => {
    const refLink = `${window.location.origin}/ref/${user.esin.split('-')[1]}`;
    navigator.clipboard.writeText(refLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditedUser(prev => ({ ...prev, avatar: base64 }));
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      
      {isGuest && (
        <div className="mx-4">
          <div className="glass-card p-12 rounded-[64px] border-2 border-blue-500/30 bg-blue-600/5 shadow-3xl text-center space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
              <ShieldCheck className="w-[800px] h-[800px] text-blue-400" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                <Landmark size={48} />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Permanent <span className="text-blue-400">Node Anchor</span></h2>
              <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">
                "Local mode data is volatile. Sign up to anchor your identity, wallet, and resources to the global EnvirosAgro registry and begin earning EAC rewards."
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
               <Login onLogin={onLogin} isEmbed />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col md:flex-row items-center gap-12 group shadow-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Fingerprint className="w-[600px] h-[600px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-44 h-44 rounded-[56px] bg-slate-800 border-4 border-white/10 flex items-center justify-center text-8xl font-black text-emerald-400 shadow-2xl group-hover:scale-105 transition-transform duration-700 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-3xl animate-pulse">
                 <ShieldCheck className="w-8 h-8 text-white" />
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <div className="flex items-center justify-center md:justify-start gap-4">
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">{user.name}</h2>
                    {!isGuest && <BadgeCheck className="w-8 h-8 text-blue-400" />}
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-full w-fit mx-auto md:ml-0">
                    <span className="text-emerald-500 font-mono text-sm tracking-[0.4em] uppercase">{user.esin}</span>
                 </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                 <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{user.role}</span>
                 <span className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">{user.wallet.tier.toUpperCase()} TIER</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Network Reputation</p>
              <h4 className="text-8xl font-mono font-black text-white tracking-tighter">
                {user.wallet.lifetimeEarned.toFixed(0).padStart(3, '0')}
              </h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Consensus Trust</span>
                 <span className="text-emerald-400 font-bold">{isGuest ? 'LOCAL' : '99.8%'}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-emerald-500 shadow-[0_0_20px_#10b98144]" style={{ width: isGuest ? '10%' : '99.8%' }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide gap-4 p-2 glass-card rounded-[32px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-6 mx-auto lg:mx-0">
        {[
          { id: 'hub', label: 'STEWARD HUB', icon: Layout },
          { id: 'signals', label: 'NODE SIGNALS', icon: Bell, badge: unreadCount },
          { id: 'dossier', label: 'DIGITAL DOSSIER', icon: Fingerprint },
          { id: 'security', label: 'SECURITY & SETTINGS', icon: Settings },
          { id: 'sharing', label: 'NETWORK SHARING', icon: Share2 },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> 
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#050706] shadow-xl">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[800px] px-4">
        
        {activeTab === 'hub' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-8 space-y-10">
                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/60 relative overflow-hidden shadow-3xl group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Activity size={400} /></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl">
                             <Target className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Skill <span className="text-indigo-400">Resonance</span></h3>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3">STWD_DOMAIN_PROFICIENCY</p>
                          </div>
                       </div>
                       <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center min-w-[160px]">
                          <p className="text-[9px] text-slate-600 font-black uppercase mb-1">AGGREGATE LVL</p>
                          <p className="text-4xl font-mono font-black text-white tracking-tighter">LV.4</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                       <div className="h-[350px] w-full bg-white/[0.01] rounded-[48px] p-6 border border-white/5 shadow-inner">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} fontStyle="italic" />
                                <Radar name="Proficiency" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="space-y-6 flex flex-col justify-center">
                          {skillData.map(skill => (
                             <div key={skill.subject} className="space-y-2">
                                <div className="flex justify-between items-center px-2">
                                   <span className="text-xs font-black text-slate-400 uppercase italic tracking-widest">{skill.subject}</span>
                                   <span className="text-sm font-mono font-black text-white">{skill.A}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                   <div className={`h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]`} style={{ width: `${skill.A}%` }}></div>
                                </div>
                             </div>
                          ))}
                          <button 
                            onClick={() => setActiveTab('dossier')}
                            className="mt-6 w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all shadow-xl"
                          >
                             UPGRADE DOMAIN SHARDS
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-amber-500/20 bg-amber-500/[0.02] space-y-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><TrendingUp size={250} className="text-amber-500" /></div>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="p-3 bg-amber-500 rounded-2xl shadow-xl"><Binary size={24} className="text-white" /></div>
                       <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Regional <span className="text-amber-500">Impact</span></h4>
                    </div>
                    <div className="space-y-6 relative z-10 pt-4">
                       {[
                         { l: 'C(a) Index', v: user.metrics.agriculturalCodeU, c: 'text-emerald-400' },
                         { l: 'm-Resilience', v: user.metrics.timeConstantTau, c: 'text-blue-400' },
                         { l: 'SID Load', v: user.metrics.viralLoadSID + '%', c: 'text-rose-500' },
                       ].map(m => (
                          <div key={m.l} className="flex justify-between items-center border-b border-white/5 pb-4 group/m">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/m:text-slate-300 transition-colors">{m.l}</span>
                             <span className={`text-xl font-mono font-black ${m.c}`}>{m.v}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 {!isGuest && (
                   <button 
                    onClick={onLogout}
                    className="w-full py-6 bg-rose-600/10 border border-rose-500/20 rounded-3xl text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                   >
                      <LogOut size={16} /> TERMINATE LOCAL SESSION
                   </button>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'signals' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
              <div className="lg:col-span-8 space-y-10">
                 <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Network <span className="text-indigo-400">Signals</span></h3>
                       <p className="text-slate-500 text-lg font-medium italic mt-2">Historical and real-time alerts sharded to your node.</p>
                    </div>
                    <button onClick={() => setSignals(prev => prev.map(s => ({...s, read: true})))} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Clear All Shards</button>
                 </div>

                 <div className="grid gap-6">
                    {signals.length === 0 ? (
                       <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                          <Radio size={80} className="text-slate-600 animate-pulse" />
                          <p className="text-2xl font-black uppercase tracking-[0.4em]">Signal Buffer Empty</p>
                       </div>
                    ) : (
                       signals.map(signal => (
                          <div key={signal.id} className={`glass-card p-10 rounded-[48px] border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden bg-black/40 shadow-2xl ${
                             signal.read ? 'opacity-50 grayscale border-white/5' : signal.priority === 'high' ? 'border-rose-500/20 animate-in pulse-slow' : 'border-indigo-500/20'
                          }`}>
                             <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center border transition-all ${
                                   signal.read ? 'bg-slate-800 text-slate-500' : 'bg-white/5 border-white/10 text-white shadow-xl group-hover:rotate-6'
                                }`}>
                                   <Database size={32} />
                                </div>
                                <div className="space-y-2">
                                   <div className="flex items-center gap-4">
                                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic m-0 group-hover:text-emerald-400 transition-colors">{signal.title}</h4>
                                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-[0.2em] border ${
                                         signal.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                                      }`}>{signal.priority} Priority</span>
                                   </div>
                                   <p className="text-slate-400 text-base leading-relaxed italic max-w-xl">"{signal.message}"</p>
                                </div>
                             </div>
                             <button onClick={() => setSignals(prev => prev.filter(s => s.id !== signal.id))} className="p-4 bg-white/5 rounded-2xl hover:bg-rose-500/10 text-slate-700 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={20} />
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'dossier' && (
          <div className="max-w-5xl mx-auto space-y-16 animate-in zoom-in duration-500">
             <div className="text-center space-y-4 px-10">
                <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">THE STEWARD <span className="text-emerald-400">DOSSIER</span></h3>
                <p className="text-slate-500 text-xl font-medium italic leading-relaxed">"The complete immutable identity profile of node steward {user.esin}."</p>
             </div>

             <IdentityCard user={user} />

             <div className="glass-card p-12 rounded-[80px] border border-fuchsia-500/20 bg-fuchsia-500/[0.02] space-y-12 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Flower2 size={600} className="text-fuchsia-400" /></div>
                
                <div className="flex items-center gap-8 relative z-10 border-b border-white/5 pb-10 mb-10">
                   <div className="p-6 bg-fuchsia-600 rounded-[32px] shadow-3xl group-hover:rotate-12 transition-transform">
                      <Star size={40} className="text-white fill-current" />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black text-white uppercase italic tracking-widest m-0 leading-none">CELESTIAL <span className="text-fuchsia-500">GIFT SHARD</span></h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase mt-3 tracking-[0.4em]">BIRTH_CYCLE_MINTING_PROTOCOL</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                   <div className="space-y-8">
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest px-4 italic leading-relaxed border-l-2 border-fuchsia-500/40 ml-2">
                        Select your birth cycle to synchronize your node with celestial growth signatures:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                         {Object.keys(MONTH_FLOWERS).map(m => (
                            <button 
                               key={m} 
                               onClick={() => handleUpdateMonth(m)} 
                               className={`py-5 rounded-[24px] text-[10px] font-black uppercase transition-all border-2 ${user.zodiacFlower?.month === m ? 'bg-fuchsia-600 text-white border-white shadow-[0_0_30px_rgba(232,121,249,0.4)] scale-110' : 'bg-black/40 border-white/10 text-slate-600 hover:text-fuchsia-400 hover:border-fuchsia-500/40'}`}
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
                                 {certMinted && <div className="absolute -top-3 -right-3 p-3 bg-emerald-500 rounded-2xl shadow-xl animate-in zoom-in"><CheckCircle2 size={24} className="text-white" /></div>}
                              </div>
                              <div className="space-y-3">
                                 <h5 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{user.zodiacFlower.flower}</h5>
                                 <p className="text-xs text-fuchsia-400 font-black uppercase tracking-[0.3em]">{MONTH_FLOWERS[user.zodiacFlower.month].trait} INTEGRITY SHARD</p>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">{MONTH_FLOWERS[user.zodiacFlower.month].zodiac}</p>
                              </div>
                              <p className="text-slate-400 text-lg italic leading-relaxed border-l-4 border-fuchsia-500/30 pl-8 py-4 bg-white/5 rounded-r-3xl">
                                 "{MONTH_FLOWERS[user.zodiacFlower.month].desc}"
                              </p>
                           </div>

                           {!certMinted ? (
                             <button 
                               onClick={handleMintCertificate} 
                               disabled={isMintingCert}
                               className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(232,121,249,0.3)] flex items-center justify-center gap-6 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 ring-8 ring-white/5"
                             >
                                {isMintingCert ? <Loader2 size={32} className="animate-spin" /> : <Stamp size={32} />}
                                {isMintingCert ? 'SEQUENCING SHARD...' : 'MINT GIFT CERTIFICATE'}
                             </button>
                           ) : (
                             <div className="flex gap-4 animate-in slide-in-from-bottom-4">
                                <button 
                                  onClick={handleDownloadCertificate}
                                  className="flex-1 py-8 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
                                >
                                   <Download size={24} /> DOWNLOAD CERTIFICATE
                                </button>
                                <button 
                                  onClick={() => handleShare('x')}
                                  className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-fuchsia-400 hover:text-white transition-all shadow-xl"
                                >
                                   <Share2 size={24} />
                                </button>
                             </div>
                           )}
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'security' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-right-10 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 glass-card p-12 md:p-16 rounded-[64px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl space-y-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[12s]"><Lock size={500} className="text-indigo-400" /></div>
                    
                    <div className="relative z-10 text-center space-y-8 border-b border-white/5 pb-16">
                       <div className="w-28 h-28 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform">
                          <ShieldPlus size={56} className="text-white" />
                       </div>
                       <div>
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Vault <span className="text-indigo-400">Security</span></h3>
                          <p className="text-slate-500 text-lg font-medium italic mt-4 max-w-lg mx-auto">"Managing the cryptographic shards and recovery keys associated with node {user.esin}."</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                       <div className="space-y-10">
                          <div className="p-10 bg-emerald-500/5 rounded-[56px] border border-emerald-500/20 space-y-8 shadow-inner">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <ShieldCheck size={24} className="text-emerald-400" />
                                <h4 className="text-xl font-black text-white uppercase italic m-0">Registry Trust</h4>
                             </div>
                             <div className="space-y-6">
                                <div className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-2xl border border-white/5">
                                   <div className="flex items-center gap-3">
                                      <Mail size={16} className="text-slate-500" />
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Node</span>
                                   </div>
                                   <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isEmailVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                      {isEmailVerified ? 'VERIFIED' : 'PENDING'}
                                   </div>
                                </div>
                                {!isEmailVerified && !isGuest && (
                                   <button 
                                      onClick={handleResendVerif}
                                      disabled={isResendingVerif || verifSent}
                                      className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                   >
                                      {isResendingVerif ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                      {verifSent ? 'SHARD TRANSMITTED' : 'RESEND VERIFICATION SHARD'}
                                   </button>
                                )}
                             </div>
                          </div>

                          <div className="p-10 bg-black/80 rounded-[56px] border border-white/5 space-y-10 shadow-inner group/phrase hover:border-indigo-500/30 transition-all h-full flex flex-col justify-between">
                             <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                   <KeyRound size={24} className="text-indigo-400" />
                                   <h4 className="text-xl font-black text-white uppercase italic m-0">Recovery Shards</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-3 py-4">
                                   {user.mnemonic.split(' ').map((word, i) => (
                                      <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center relative group/word">
                                         <span className="text-[10px] font-mono font-bold text-slate-600 block mb-1">0{i+1}</span>
                                         <span className="text-[9px] font-black text-white uppercase tracking-widest blur-md group-hover/word:blur-none transition-all cursor-help">{word}</span>
                                      </div>
                                   ))}
                                </div>
                             </div>
                             <button className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[9px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg">
                                <Download size={14} /> EXPORT SECRET COLD-SHARD
                             </button>
                          </div>
                       </div>

                       <div className="space-y-8 flex flex-col justify-center">
                          <div className="p-10 glass-card rounded-[56px] border border-white/10 bg-black/60 space-y-8 shadow-inner">
                             <h4 className="text-xl font-black text-white uppercase italic m-0 flex items-center gap-3"><Settings size={20} className="text-indigo-400"/> Network Settings</h4>
                             <div className="space-y-8">
                                {[
                                   { l: 'Public Visibility', v: true },
                                   { l: 'Proactive Telemetry Ingest', v: false },
                                   { l: 'Two-Factor Sharding', v: true },
                                ].map((s, i) => (
                                   <div key={i} className="flex justify-between items-center group/opt">
                                      <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] group-hover/opt:text-slate-300 transition-colors">{s.l}</span>
                                      <button className={`w-14 h-7 rounded-full relative px-1 transition-all flex items-center ${s.v ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}>
                                         <div className={`w-5 h-5 bg-white rounded-full transition-all ${s.v ? 'ml-auto' : 'ml-0'}`}></div>
                                      </button>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {!isGuest && (
                            <div className="p-10 glass-card rounded-[56px] border border-rose-500/10 bg-rose-500/[0.02] space-y-6 group/danger hover:border-rose-500/40 transition-all shadow-xl">
                              <div className="flex items-center gap-4">
                                  <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 group-hover/danger:scale-110 transition-transform"><ShieldX size={24} /></div>
                                  <h4 className="text-xl font-black text-white uppercase italic m-0">Dangerous <span className="text-rose-500">Zone</span></h4>
                              </div>
                              <p className="text-[10px] text-slate-500 italic leading-relaxed uppercase tracking-tight">
                                  "Node termination is permanent. All local assets and reputation shards will be burnt."
                              </p>
                              <button onClick={onDeleteAccount} className="w-full py-5 bg-rose-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center gap-3 border border-rose-400/20">
                                  <Trash2 size={16} /> TERMINATE REGISTRY NODE
                              </button>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-bottom-10">
                    <div className="glass-card p-12 rounded-[64px] border border-emerald-500/20 bg-black/60 shadow-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform duration-1000"><Edit3 size={300} className="text-emerald-400" /></div>
                       <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-10 mb-10">
                          <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl"><Edit3 size={32} className="text-white" /></div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Edit <span className="text-emerald-400">Identity</span></h4>
                       </div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="flex flex-col items-center gap-4">
                             <div className="w-32 h-32 rounded-3xl bg-slate-800 border-2 border-white/10 flex items-center justify-center overflow-hidden relative group/avatar shadow-2xl">
                                {editedUser.avatar ? (
                                  <img src={editedUser.avatar} className="w-full h-full object-cover" alt="Avatar Preview" />
                                ) : (
                                  <UserIcon size={64} className="text-slate-600" />
                                )}
                                <button 
                                  onClick={() => avatarInputRef.current?.click()}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-black text-white uppercase tracking-widest gap-2"
                                >
                                   {isUploadingAvatar ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                                   Change Shard
                                </button>
                                <input 
                                  type="file" 
                                  ref={avatarInputRef} 
                                  onChange={handleAvatarUpload} 
                                  className="hidden" 
                                  accept="image/*" 
                                />
                             </div>
                             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Profile Biometric Ingest</p>
                          </div>

                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Steward Designation</label>
                             <input 
                                type="text" 
                                value={editedUser.name} 
                                onChange={e => setEditedUser({...editedUser, name: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-[28px] py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-xl italic" 
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Thrust Role</label>
                             <input 
                                type="text" 
                                value={editedUser.role} 
                                onChange={e => setEditedUser({...editedUser, role: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-[28px] py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm uppercase tracking-widest" 
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Regional Hub (Location)</label>
                             <input 
                                type="text" 
                                value={editedUser.location} 
                                onChange={e => setEditedUser({...editedUser, location: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-[28px] py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm italic" 
                             />
                          </div>
                          <button 
                            onClick={handleSaveProfile}
                            className="w-full py-8 mt-6 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] active:scale-[1.02] transition-all flex items-center justify-center gap-4 border border-white/10"
                          >
                             <Save size={24} /> ANCHOR CHANGES
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'sharing' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700">
              <div className="p-20 glass-card rounded-[80px] border-2 border-emerald-500/20 bg-black/60 shadow-3xl text-center space-y-16 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s]"><Share2 size={800} className="text-emerald-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 bg-emerald-600 rounded-[48px] flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] mx-auto border-4 border-white/10 group-hover:scale-110 transition-transform">
                       <Radio size={64} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0">Grid <span className="text-emerald-400">Diffusion</span></h3>
                       <p className="text-slate-400 text-3xl font-medium mt-8 italic max-w-3xl mx-auto leading-relaxed">
                          "Broadcast your stewardship metrics and node integrity across the local and global network mesh."
                       </p>
                    </div>
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
                          onClick={() => handleShare(p.id)}
                          className="flex flex-col items-center gap-8 p-12 bg-black/80 border border-white/10 rounded-[64px] transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 group/share shadow-2xl active:scale-95 ring-4 ring-white/5"
                       >
                          <p.icon size={64} className={`text-slate-700 transition-all group-hover/share:scale-110 group-hover/share:rotate-6 ${p.color}`} />
                          <span className="text-xs font-black text-slate-500 group-hover/share:text-white uppercase tracking-[0.4em]">{p.label}</span>
                       </button>
                    ))}
                 </div>

                 <div className="p-12 bg-black/80 rounded-[64px] border-2 border-white/10 shadow-inner relative z-10 group/invite overflow-hidden max-w-3xl mx-auto">
                    <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/invite:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 px-6 relative z-10">
                       <div className="text-left space-y-3">
                          <h4 className="text-3xl font-black text-white uppercase italic m-0">Invite <span className="text-emerald-400">Stewards</span></h4>
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-none">EARN REWARDS PER VERIFIED ONBOARDING SHARD</p>
                       </div>
                       <div className="flex gap-4 w-full md:w-auto">
                          <div className="flex-1 bg-black border border-white/10 rounded-3xl px-8 py-5 font-mono text-xs text-slate-400 flex items-center truncate min-w-[240px] shadow-inner">
                             {window.location.origin}/ref/{user.esin.split('-')[1]}
                          </div>
                          <button 
                            onClick={handleCopyRef}
                            className={`p-5 rounded-3xl shadow-xl active:scale-90 transition-all ${isCopied ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                          >
                            {isCopied ? <CheckCircle2 size={24} className="text-white" /> : <Copy size={24} className="text-white" />}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 150px -20px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default UserProfile;