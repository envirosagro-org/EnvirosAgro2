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
  Star
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

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onLogout, onDeleteAccount, signals, setSignals, onAcceptProposal }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'dossier' | 'signals' | 'security'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [role, setRole] = useState(user.role);
  const [isSaving, setIsSaving] = useState(false);

  const unreadCount = signals.filter(n => !n.read).length;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({ ...user, name, location, role });
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      
      {/* 1. Header Segment (Matches Screenshot Top) */}
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

      {/* 2. Registry Standing (Matches Screenshot) */}
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

      {/* 3. Navigation Shards (Matches Screenshot Row) */}
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
            className={`flex-1 min-w-max flex items-center gap-3 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]' : 'text-slate-500 hover:text-white'}`}
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

      {/* 4. Cryptographic Identity (Matches Screenshot) */}
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

      {/* 5. Danger Zone & Detach Node (Matches Screenshot) */}
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
           
           {/* High-Fidelity Box for the button as seen in screenshot */}
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

      {/* 6. Registry Card (Matches Screenshot Section) */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-6">
           <UserIcon className="w-6 h-6 text-emerald-400" />
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter">REGISTRY <span className="text-emerald-400">CARD</span></h3>
        </div>
        <div className="transform scale-100 hover:scale-[1.02] transition-transform duration-700">
           <IdentityCard user={user} />
        </div>
      </div>

      {/* 7. Social Identification Footer (Matches Screenshot) */}
      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 flex flex-col items-center shadow-3xl space-y-8">
         <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mb-4">SOCIAL IDENTIFICATION</p>
            <div className="w-24 h-1.5 bg-emerald-600 rounded-full mx-auto"></div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
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
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default UserProfile;