import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  ShieldCheck, 
  Key, 
  Award, 
  Mail, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  Lock, 
  Activity, 
  Fingerprint, 
  Save, 
  RefreshCcw,
  BadgeCheck,
  TrendingUp,
  Briefcase,
  X,
  Loader2,
  Scan,
  ShieldAlert,
  Cpu,
  Wifi,
  Send,
  LogOut,
  Trash2,
  AlertTriangle,
  Phone,
  Globe,
  Radio,
  Sparkles,
  Smartphone,
  Zap,
  Bell,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Trash,
  Check,
  UserPlus,
  Handshake,
  FileCode,
  FileSignature,
  Stamp,
  BookOpenCheck,
  Coins,
  Flower2,
  Download,
  Gift,
  Share2,
  Twitter,
  Linkedin,
  Youtube,
  AtSign,
  Facebook,
  Star,
  History,
  Terminal,
  ShieldX,
  Unlock,
  KeyRound,
  Eye,
  Settings,
  Database,
  HeartPulse,
  Info,
  Palette,
  Cloud,
  Wind,
  Music,
  Copy,
  ExternalLink
} from 'lucide-react';
import { User } from '../types';
import IdentityCard from './IdentityCard';
import { SignalShard } from '../App';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  onAcceptProposal?: (id: string) => void;
}

const MONTH_FLOWERS: Record<string, { flower: string; color: string; hex: string; desc: string; zodiac: string }> = {
  'January': { flower: 'Carnation', zodiac: 'Capricorn/Aquarius', color: 'text-pink-400', hex: '#f472b6', desc: 'Symbol of fascination and divine love.' },
  'February': { flower: 'Violet', zodiac: 'Aquarius/Pisces', color: 'text-purple-400', hex: '#c084fc', desc: 'Symbol of loyalty, wisdom, and hope.' },
  'March': { flower: 'Daffodil', zodiac: 'Pisces/Aries', color: 'text-yellow-400', hex: '#facc15', desc: 'Symbol of rebirth and new beginnings.' },
  'April': { flower: 'Daisy', zodiac: 'Aries/Taurus', color: 'text-stone-200', hex: '#e7e5e4', desc: 'Symbol of purity, innocence, and true love.' },
  'May': { flower: 'Lily of the Valley', zodiac: 'Taurus/Gemini', color: 'text-emerald-100', hex: '#ecfdf5', desc: 'Symbol of sweetness and return of happiness.' },
  'June': { flower: 'Rose', zodiac: 'Gemini/Cancer', color: 'text-rose-500', hex: '#f43f5e', desc: 'Symbol of passion, beauty, and friendship.' },
  'July': { flower: 'Larkspur', zodiac: 'Cancer/Leo', color: 'text-blue-400', hex: '#60a5fa', desc: 'Symbol of positivity, dignity, and open heart.' },
  'August': { flower: 'Gladiolus', zodiac: 'Leo/Virgo', color: 'text-orange-500', hex: '#f97316', desc: 'Symbol of strength and moral integrity.' },
  'September': { flower: 'Aster', zodiac: 'Virgo/Libra', color: 'text-indigo-400', hex: '#818cf8', desc: 'Symbol of love, wisdom, and faith.' },
  'October': { flower: 'Marigold', zodiac: 'Libra/Scorpio', color: 'text-amber-500', hex: '#f59e0b', desc: 'Symbol of optimism and prosperity.' },
  'November': { flower: 'Chrysanthemum', zodiac: 'Scorpio/Sagittarius', color: 'text-red-500', hex: '#ef4444', desc: 'Symbol of joy and abundance.' },
  'December': { flower: 'Narcissus', zodiac: 'Sagittarius/Capricorn', color: 'text-blue-100', hex: '#f0f9ff', desc: 'Symbol of respect and faithfulness.' },
};

const SOCIAL_CHANNELS = [
  { id: 'Threads', name: 'Threads', icon: AtSign, color: 'text-white' },
  { id: 'X', name: 'X', icon: Twitter, color: 'text-blue-400' },
  { id: 'LinkedIn', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { id: 'TikTok', name: 'TikTok', icon: Music, color: 'text-pink-500' },
  { id: 'Facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-700' },
];

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onLogout, onDeleteAccount, signals, setSignals, onAcceptProposal }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'dossier' | 'signals' | 'security'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingBirthCert, setIsGeneratingBirthCert] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(user.zodiacFlower?.month || '');
  const [isCopied, setIsCopied] = useState(false);

  const unreadCount = signals.filter(n => !n.read).length;

  const handleUpdateMonth = (month: string) => {
    if (!month) {
      onUpdate({ ...user, zodiacFlower: undefined });
      setSelectedMonth('');
      return;
    }
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
    setSelectedMonth(month);
  };

  const handleShare = async (platform: string) => {
    const shareData = {
      title: 'EnvirosAgro™ Registry Node Shard',
      text: `Identify Steward: ${user.name} | ESIN: ${user.esin}. Active node on the EnvirosAgro blockchain network for sustainable industrial agriculture.`,
      url: window.location.origin,
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Native share failed');
      }
    }

    // Fallbacks
    let shareUrl = '';
    const encodedText = encodeURIComponent(shareData.text + ' ' + shareData.url);
    const encodedUrl = encodeURIComponent(shareData.url);

    switch (platform) {
      case 'X':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'Threads':
        shareUrl = `https://threads.net/intent/post?text=${encodedText}`;
        break;
      case 'Copy':
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      case 'Native':
        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        }
        return;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const generateBirthCertificate = () => {
    if (!user.zodiacFlower) return;
    
    const flowerInfo = MONTH_FLOWERS[user.zodiacFlower.month];
    if (!flowerInfo) return;

    setIsGeneratingBirthCert(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const themeHex = flowerInfo.hex || '#10b981';
      
      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 1600, 1200);
      
      // Border
      ctx.strokeStyle = themeHex;
      ctx.lineWidth = 24;
      ctx.strokeRect(60, 60, 1480, 1080);
      
      // Inner Border
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 100, 1400, 1000);

      // Watermark
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = themeHex;
      ctx.font = '900 800px serif';
      ctx.textAlign = 'center';
      ctx.fillText('LILIES', 800, 850);
      ctx.globalAlpha = 1;

      // Header
      ctx.fillStyle = themeHex;
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LILIES AROUND™ • AESTHETIC BOTANICAL REGISTRY', 800, 180);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic bold 90px serif';
      ctx.fillText('Celestial Birth Shard', 800, 300);
      
      // Content
      ctx.font = '34px serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('This industrial certification confirms that steward', 800, 420);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 70px monospace';
      ctx.fillText(user.name.toUpperCase(), 800, 550);
      
      ctx.font = '34px serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`born in the month of ${user.zodiacFlower?.month || 'Unknown'},`, 800, 650);
      ctx.fillText(`is anchored to the ${flowerInfo.flower} biological frequency.`, 800, 710);

      // Flower Details
      ctx.fillStyle = themeHex;
      ctx.font = 'bold 45px serif';
      ctx.fillText(`ZODIAC: ${flowerInfo.zodiac.toUpperCase()}`, 800, 840);
      
      ctx.font = 'italic 30px serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`"${flowerInfo.desc}"`, 800, 920);

      // Footer
      ctx.fillStyle = '#475569';
      ctx.font = '22px monospace';
      ctx.fillText(`NODE: ${user.esin} // REGISTRY_v5.0 // ENVIROSAGRO HQ`, 800, 1050);
      
      // Seal
      ctx.beginPath();
      ctx.arc(1350, 950, 80, 0, Math.PI * 2);
      ctx.strokeStyle = themeHex;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = themeHex;
      ctx.font = 'bold 20px monospace';
      ctx.fillText('SEHTI_OK', 1350, 955);

      const link = document.createElement('a');
      link.download = `LiliesAround_BirthShard_${user.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
      setIsGeneratingBirthCert(false);
    }, 2000);
  };

  const markAllRead = () => {
    setSignals(prev => prev.map(s => ({ ...s, read: true })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      
      {/* 1. Header Segment */}
      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 flex flex-col items-center text-center space-y-8 relative overflow-hidden shadow-3xl">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[56px] bg-slate-800 border-4 border-white/5 flex items-center justify-center text-8xl font-black text-emerald-400 shadow-2xl relative">
            {user.name[0]}
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-xl">
             <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{user.name}</h2>
            <CheckCircle2 className="w-7 h-7 text-blue-400" />
          </div>
          <p className="text-emerald-500 font-mono text-sm tracking-[0.4em] uppercase">{user.esin}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {user.location.toUpperCase()}
            </span>
            <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {user.role.toUpperCase()}
            </span>
            <span className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3">
              <Calendar className="w-3.5 h-3.5" /> ACTIVE SINCE {user.regDate.replace(/\//g, '.')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Registry Standing */}
      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 flex flex-col justify-center text-center space-y-6 shadow-3xl">
         <p className="text-[12px] font-black text-blue-400 uppercase tracking-[0.4em]">Registry Standing</p>
         <h3 className="text-8xl font-black text-white tracking-tighter uppercase italic m-0">MASTER</h3>
         <div className="flex justify-center gap-2">
           {[...Array(5)].map((_, i) => (
             <Award key={i} className="w-7 h-7 text-amber-500 fill-amber-500" />
           ))}
         </div>
         <p className="text-sm text-slate-500 font-medium italic opacity-60">"High reputation node (Cycle 12)"</p>
      </div>

      {/* 3. Navigation Shards (Tabs) */}
      <div className="glass-card p-4 rounded-[32px] border-white/5 bg-black/60 shadow-xl overflow-x-auto scrollbar-hide flex items-center gap-2">
        {[
          { id: 'general', label: 'IDENTITY SETTINGS', icon: UserIcon },
          { id: 'signals', label: 'NETWORK SIGNALS', icon: Bell, badge: unreadCount },
          { id: 'dossier', label: 'STEWARD DOSSIER', icon: Fingerprint },
          { id: 'security', label: 'NODE SECURITY', icon: Lock },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-max flex items-center gap-3 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> 
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="ml-2 w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#050706]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        
        {/* --- NETWORK SIGNALS --- */}
        {activeTab === 'signals' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-4">
                <Bell className="w-6 h-6 text-emerald-400" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Signal <span className="text-emerald-400">Stream</span></h3>
              </div>
              <span className="px-4 py-1.5 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase rounded-full border border-rose-500/20">Unread: {unreadCount}</span>
            </div>

            <div className="grid gap-6">
              {signals.map(signal => (
                <div key={signal.id} className={`p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-emerald-500/30 transition-all ${!signal.read ? 'ring-2 ring-emerald-500/20' : ''}`}>
                  <div className="flex items-center gap-6 flex-1">
                    <div className={`p-4 rounded-2xl ${signal.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'} border border-white/5`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic m-0">{signal.title}</h4>
                      <p className="text-slate-400 text-sm italic mt-1">{signal.message}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <span className="text-[10px] font-mono text-slate-600 uppercase font-black">{signal.timestamp}</span>
                    <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
              {signals.length === 0 && (
                <div className="py-20 text-center opacity-20 italic uppercase tracking-[0.4em]">No active signals found in shard.</div>
              )}
            </div>

            <button 
              onClick={markAllRead}
              className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-emerald-400 transition-all"
            >
              SYNC GLOBAL PULSE
            </button>
          </div>
        )}

        {/* --- STEWARD DOSSIER --- */}
        {activeTab === 'dossier' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 space-y-12 relative overflow-hidden shadow-3xl">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Fingerprint size={400} /></div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10 relative z-10">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase italic m-0">Steward <span className="text-emerald-400">Dossier</span></h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-2 tracking-[0.4em] uppercase">STWD_DOSSIER_SHARD #842_A</p>
                  </div>
                  <div className="p-5 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4">
                     <ShieldCheck className="w-8 h-8 text-emerald-400" />
                     <div className="text-left">
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Auth Signature</p>
                        <p className="text-xs font-mono font-black text-white">SECURE_ZK_PROOF_OK</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                  {[
                    { l: 'BIOMETRICS', v: 'OK', c: 'text-emerald-400', i: HeartPulse },
                    { l: 'TRUST SCORE', v: '99.9%', c: 'text-emerald-400', i: ShieldCheck },
                    { l: 'EAC YIELD', v: '1.42x', c: 'text-blue-400', i: TrendingUp },
                    { l: 'REGISTRY', v: 'CYCLE 12', c: 'text-indigo-400', i: Database }
                  ].map(stat => (
                    <div key={stat.l} className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center space-y-2 group hover:border-emerald-500/40 transition-all">
                       <stat.i className={`w-6 h-6 ${stat.c} mx-auto opacity-40 group-hover:opacity-100 transition-opacity`} />
                       <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{stat.l}</p>
                       <p className={`text-2xl font-mono font-black ${stat.c}`}>{stat.v}</p>
                    </div>
                  ))}
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="p-10 bg-black/80 rounded-[44px] border border-white/5 shadow-inner">
                     <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 px-2 flex items-center gap-3">
                        <Info size={14} className="text-emerald-400" /> Professional Narrative
                     </h4>
                     <p className="text-slate-300 text-lg leading-relaxed italic font-medium">
                        "A dedicated land steward focused on high-density regenerative sharding in the Kenya regional node. Specializing in bio-electric plant resonance and ZK-registry coordination."
                     </p>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest px-4">Verified Skills</h4>
                     <div className="flex flex-wrap gap-3">
                        {['Soil Science', 'IoT Calibration', 'ZK-Auth', 'Permaculture Design', 'Economic Sharding'].map(s => (
                           <span key={s} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:border-emerald-500/40 transition-all cursor-default flex items-center gap-3">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" /> {s}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-4 text-slate-700">
                     <Stamp className="w-10 h-10 opacity-20" />
                     <p className="text-[9px] font-black uppercase tracking-widest">OFFICIAL_STWD_SEAL</p>
                  </div>
                  <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-slate-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl">
                     <Download size={16} /> Export Shard Cert
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- NODE SECURITY --- */}
        {activeTab === 'security' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { t: 'Node PIN Access', s: 'ACTIVE', i: KeyRound, c: 'text-emerald-400' },
                 { t: 'Multi-Factor Sharding', s: 'ENCRYPTED', i: Smartphone, c: 'text-blue-400' },
                 { t: 'Registry Session Lock', s: 'SECURE', i: ShieldCheck, c: 'text-indigo-400' }
               ].map(sec => (
                 <div key={sec.t} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 text-center space-y-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors"></div>
                    <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center mx-auto border border-white/10 group-hover:rotate-6 transition-transform relative z-10">
                       <sec.i className={`w-8 h-8 ${sec.c}`} />
                    </div>
                    <div className="relative z-10">
                       <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{sec.t}</h4>
                       <p className={`text-[10px] font-mono mt-3 font-black tracking-[0.4em] ${sec.c}`}>{sec.s}</p>
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 hover:text-white transition-all relative z-10">CONFIGURE</button>
                 </div>
               ))}
            </div>

            <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                     <Terminal className="w-6 h-6 text-emerald-400" />
                     <h3 className="text-2xl font-black text-white uppercase italic">Node <span className="text-emerald-400">Audit Logs</span></h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-all">Clear Stream</button>
               </div>
               
               <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-4">
                  {[
                    { e: 'Registry Session Started', t: 'Just Now', s: 'SUCCESS', i: Unlock, c: 'text-emerald-400' },
                    { e: 'ZK-Sync Protocol Handshake', t: '12m ago', s: 'STABLE', i: RefreshCcw, c: 'text-blue-400' },
                    { e: 'Auth Ingest Shard Initialized', t: '2h ago', s: 'SIGNED', i: Fingerprint, c: 'text-indigo-400' },
                    { e: 'Node Access PIN Verified', t: '2h ago', s: 'OK', i: Lock, c: 'text-emerald-400' },
                    { e: 'Telemetry Encryption Enabled', t: '5h ago', s: 'SECURED', i: ShieldCheck, c: 'text-blue-400' }
                  ].map((log, i) => (
                    <div key={i} className="p-6 bg-black/60 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                             <log.i className={`w-5 h-5 ${log.c}`} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-white uppercase italic">{log.e}</p>
                             <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold">{log.t}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border ${log.c.replace('text', 'bg-opacity-10 border-opacity-20')} ${log.c}`}>{log.s}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-card p-12 rounded-[56px] border border-rose-500/20 bg-rose-500/5 shadow-3xl text-center space-y-8">
               <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 shadow-xl animate-pulse">
                     <ShieldX className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Emergency <span className="text-rose-500">Nuclear Shard</span></h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto italic font-medium">"Immediately revoke all access nodes, kill active registry sessions, and purge the local node cache."</p>
               </div>
               <button 
                 onClick={onLogout}
                 className="px-16 py-6 bg-rose-600 hover:bg-rose-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all ring-8 ring-rose-500/5"
               >
                  REVOKE ALL ACCESS
               </button>
            </div>
          </div>
        )}

        {/* --- IDENTITY SETTINGS (Default) --- */}
        {activeTab === 'general' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* NEW: ASTROLOGICAL BIRTH MONTH GIFT from Lilies Around */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-6">
                <Flower2 className="w-6 h-6 text-fuchsia-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Birth Month <span className="text-fuchsia-500">Gift Shard</span></h3>
                <span className="ml-auto px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 text-[9px] font-black uppercase rounded tracking-widest border border-fuchsia-500/20">lilies Around™ Exclusive</span>
              </div>
              
              <div className="glass-card p-12 rounded-[56px] border border-fuchsia-500/20 bg-fuchsia-500/[0.03] space-y-10 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Flower2 size={400} /></div>
                
                {!user.zodiacFlower ? (
                  <div className="text-center space-y-8 relative z-10 py-6">
                    <div className="w-20 h-20 bg-fuchsia-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-fuchsia-500/20 shadow-xl"><Gift size={40} className="text-fuchsia-400" /></div>
                    <div className="space-y-4">
                      <h4 className="text-3xl font-black text-white uppercase italic">Access Your <span className="text-fuchsia-400">Botanical Gift</span></h4>
                      <p className="text-slate-400 text-lg italic max-w-lg mx-auto leading-relaxed">Choose your birth month to receive a customized 'Celestial Birth Shard' certificate and biological frequency anchor.</p>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-2xl mx-auto">
                      {Object.keys(MONTH_FLOWERS).map(m => (
                        <button 
                          key={m} 
                          onClick={() => handleUpdateMonth(m)}
                          className="py-3 bg-black/40 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase hover:text-white hover:border-fuchsia-500/40 transition-all active:scale-95"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="w-48 h-48 rounded-[48px] bg-black/60 flex items-center justify-center shadow-3xl border border-fuchsia-500/30 group-hover:rotate-6 transition-transform relative shrink-0">
                      <div className="absolute inset-0 opacity-10"><Cloud className="w-full h-full text-white" /></div>
                      <Flower2 size={80} className={user.zodiacFlower.color} />
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                       <div>
                          <p className="text-[11px] font-black text-fuchsia-400 uppercase tracking-widest mb-1">{user.zodiacFlower.month.toUpperCase()} // BIRTH SHARD</p>
                          <h4 className="text-5xl font-black text-white uppercase italic tracking-tight m-0">{user.zodiacFlower.flower}</h4>
                          <p className="text-slate-400 text-base italic mt-3 leading-relaxed">"{MONTH_FLOWERS[user.zodiacFlower.month]?.desc || ''}"</p>
                       </div>
                       <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          <button 
                            onClick={generateBirthCertificate}
                            disabled={isGeneratingBirthCert}
                            className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                          >
                             {isGeneratingBirthCert ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                             {isGeneratingBirthCert ? 'MINTING SHARD...' : 'MINT CELESTIAL CERT'}
                          </button>
                          <button onClick={() => handleUpdateMonth('')} className="px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cryptographic Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-6">
                <Lock className="w-6 h-6 text-slate-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Cryptographic <span className="text-slate-500">Identity</span></h3>
                <span className="ml-auto px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded tracking-widest border border-blue-500/20">Secured Layer-1</span>
              </div>
              
              <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-3xl">
                <div className="flex justify-between items-center px-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Signing Key (ESIN)</p>
                    <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">REVOKE</button>
                </div>
                <div className="p-8 bg-black/60 rounded-[32px] border border-white/5">
                    <p className="text-emerald-500 font-mono text-sm break-all leading-relaxed uppercase tracking-widest">
                      {btoa(user.esin + "SECURE_LAYER").substring(0, 72)}...
                    </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-6">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">DANGER <span className="text-rose-500">ZONE</span></h3>
              </div>
              
              <div className="glass-card p-12 rounded-[56px] border border-rose-500/20 bg-rose-500/5 shadow-3xl relative overflow-hidden group">
                <div className="text-center space-y-3 mb-10">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight m-0">TERMINATE SESSION</h4>
                    <p className="text-slate-500 text-sm italic font-medium">"Detach your node from the current registry session."</p>
                </div>
                
                <div className="max-w-md mx-auto p-2 border-4 border-blue-500/40 rounded-2xl relative group">
                    <div className="absolute inset-0 border-2 border-blue-400/20 rounded-xl animate-pulse"></div>
                    <button 
                      onClick={onLogout}
                      className="w-full py-8 bg-rose-600 hover:bg-rose-500 rounded-xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(225,29,72,0.4)] flex items-center justify-center gap-6 transition-all active:scale-95 group-hover:scale-[1.01]"
                    >
                      <LogOut size={24} />
                      DETACH NODE
                    </button>
                </div>
              </div>
            </div>

            {/* Registry Card */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-6">
                <UserIcon className="w-6 h-6 text-emerald-400" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">REGISTRY <span className="text-emerald-400">CARD</span></h3>
              </div>
              <div className="transform scale-100 hover:scale-[1.02] transition-transform duration-700">
                <IdentityCard user={user} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Social Identification & External Sharing Footer */}
      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 flex flex-col items-center shadow-3xl space-y-12">
         <div className="text-center space-y-4">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">SOCIAL IDENTIFICATION</p>
            <div className="w-24 h-1.5 bg-emerald-600 rounded-full mx-auto"></div>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full border-b border-white/5 pb-12">
            {[
              { l: 'SIGNALS UNREAD', v: unreadCount, c: 'text-rose-500' },
              { l: 'TRUST SCORE', v: '99.9%', c: 'text-emerald-400' },
              { l: 'NETWORK QUORUM', v: 'ACTIVE', c: 'text-blue-400' },
              { l: 'REPUTATION', v: user.wallet.lifetimeEarned, c: 'text-amber-500' }
            ].map(s => (
               <div key={s.l} className="text-center">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-3">{s.l}</p>
                  <p className={`text-2xl font-mono font-black ${s.c}`}>{s.v}</p>
               </div>
            ))}
         </div>

         {/* BROADCAST NODE TO EXTERNAL REGISTRIES (Functional Social Sharing) */}
         <div className="w-full space-y-12">
            <div className="flex flex-col items-center gap-4">
               <h4 className="text-xl font-black text-white uppercase italic tracking-[0.3em] flex items-center gap-4">
                 <Share2 className="text-emerald-400 w-6 h-6" /> Broadcast <span className="text-emerald-400">Node Signal</span>
               </h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Synchronize Profile Shard to External Internet Registries</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
               {SOCIAL_CHANNELS.map(sc => (
                 <button 
                   key={sc.name}
                   onClick={() => handleShare(sc.id)}
                   className="p-8 bg-white/[0.02] border border-white/10 rounded-[40px] hover:bg-emerald-600/10 hover:border-emerald-500/40 transition-all group flex flex-col items-center gap-4 min-w-[140px] active:scale-95 shadow-xl relative overflow-hidden"
                   title={`Broadcast to ${sc.name}`}
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 ${sc.color} group-hover:scale-110 transition-transform relative z-10 shadow-inner`}>
                       <sc.icon size={28} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest relative z-10">{sc.name}</span>
                 </button>
               ))}
               
               {/* Universal Share Button */}
               <button 
                 onClick={() => handleShare('Native')}
                 className="p-8 bg-emerald-600/5 border border-emerald-500/20 rounded-[40px] hover:bg-emerald-600/10 hover:border-emerald-500/40 transition-all group flex flex-col items-center gap-4 min-w-[140px] active:scale-95 shadow-2xl relative"
               >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                     <ExternalLink size={28} />
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 group-hover:text-white uppercase tracking-widest">Share Node</span>
               </button>
            </div>

            {/* Quick Actions / Copy Shard */}
            <div className="max-w-md mx-auto p-1.5 glass-card rounded-3xl bg-black/60 border border-white/5 flex items-center gap-2">
               <div className="flex-1 px-6 py-4 bg-black rounded-2xl border border-white/5 overflow-hidden">
                  <p className="text-[9px] font-mono text-slate-600 truncate uppercase tracking-widest">REGISTRY_LINK: {window.location.origin}</p>
               </div>
               <button 
                  onClick={() => handleShare('Copy')}
                  className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${isCopied ? 'bg-emerald-600 text-white shadow-emerald-900/40' : 'bg-white/5 text-slate-400 hover:text-white'}`}
               >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  {isCopied ? 'COPIED' : 'COPY SHARD'}
               </button>
            </div>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UserProfile;
