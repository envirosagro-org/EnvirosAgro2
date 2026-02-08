
import React, { useState, useMemo } from 'react';
import { 
  User as UserIcon, MapPin, ShieldCheck, Edit3, 
  BadgeCheck, Loader2, Star, Flower2, Stamp, Wallet, 
  ChevronRight, Radio, ShieldPlus, Fingerprint, Plus,
  Activity, Zap, ShieldAlert, Binary, Database,
  TrendingUp, Dna, Microscope, Target, Waves,
  Shield as ShieldIcon, Globe, Lock, Info, Download,
  FileCode, History, Camera, UserPlus, HeartPulse,
  Coins, ShieldX, Settings, Share2, Bell, LogOut,
  Mail, Phone, ExternalLink, Globe2, Trash2, Save,
  X, CheckCircle2, CreditCard, Key, AlertCircle,
  Pencil, MessageSquare, Twitter, Linkedin, Facebook,
  // Add missing icons
  ArrowUpRight, Copy, SmartphoneNfc
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Radar as RechartsRadar, Tooltip 
} from 'recharts';
import { User, ViewState, SignalShard } from '../types';
import IdentityCard from './IdentityCard';

interface UserProfileProps {
  user: User;
  isGuest: boolean;
  onUpdate: (user: User) => void;
  onLogin: () => void;
  onNavigate: (view: ViewState) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  notify: any;
}

const MONTH_FLOWERS: Record<string, { flower: string; color: string; hex: string; trait: string; resonance: string }> = {
  'JAN': { flower: 'Carnation', trait: 'Devotion', color: 'text-pink-400', hex: '#f472b6', resonance: '432Hz' },
  'FEB': { flower: 'Violet', trait: 'Loyalty', color: 'text-purple-400', hex: '#c084fc', resonance: '528Hz' },
  'MAR': { flower: 'Daffodil', trait: 'New Beginnings', color: 'text-fuchsia-400', hex: '#e879f9', resonance: '396Hz' },
  'APR': { flower: 'Daisy', trait: 'Innocence', color: 'text-stone-200', hex: '#e7e5e4', resonance: '417Hz' },
  'MAY': { flower: 'Lily Valley', trait: 'Happiness', color: 'text-emerald-100', hex: '#ecfdf5', resonance: '639Hz' },
  'JUN': { flower: 'Rose', trait: 'Passion', color: 'text-rose-500', hex: '#f43f5e', resonance: '741Hz' },
  'JUL': { flower: 'Larkspur', trait: 'Positivity', color: 'text-blue-400', hex: '#60a5fa', resonance: '852Hz' },
  'AUG': { flower: 'Gladiolus', trait: 'Strength', color: 'text-orange-500', hex: '#f97316', resonance: '963Hz' },
  'SEP': { flower: 'Aster', trait: 'Wisdom', color: 'text-indigo-400', hex: '#818cf8', resonance: '174Hz' },
  'OCT': { flower: 'Marigold', trait: 'Optimism', color: 'text-amber-500', hex: '#f59e0b', resonance: '285Hz' },
  'NOV': { flower: 'Chrysanthemum', trait: 'Abundance', color: 'text-red-500', hex: '#ef4444', resonance: '432Hz' },
  'DEC': { flower: 'Narcissus', trait: 'Respect', color: 'text-blue-100', hex: '#f0f9ff', resonance: '528Hz' },
};

const UserProfile: React.FC<UserProfileProps> = ({ user, isGuest, onUpdate, onLogin, onNavigate, onLogout, notify, signals }) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'card' | 'celestial' | 'edit' | 'settings' | 'sharing' | 'signals'>('dossier');
  const [isMintingCert, setIsMintingCert] = useState(false);
  
  // Defensive initialization of selectedMonth to ensure it maps to a key in MONTH_FLOWERS
  const initialMonth = (user.zodiacFlower?.month?.substring(0, 3).toUpperCase()) || 'MAR';
  const [selectedMonth, setSelectedMonth] = useState(MONTH_FLOWERS[initialMonth] ? initialMonth : 'MAR');

  // Form states for "Edit"
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editLocation, setEditLocation] = useState(user.location);
  const [isSaving, setIsSaving] = useState(false);

  const skillsData = useMemo(() => [
    { subject: 'Soil Science', A: (user.metrics.sustainabilityScore || 0) + 10 },
    { subject: 'Hydraulics', A: 75 },
    { subject: 'Botany', A: 88 },
    { subject: 'Industrial OS', A: 92 },
    { subject: 'Social Immunity', A: user.metrics.socialImmunity || 0 },
  ], [user.metrics]);

  const handleUpdateMonth = (month: string) => {
    const normalizedMonth = month.substring(0, 3).toUpperCase();
    const flowerData = MONTH_FLOWERS[normalizedMonth];
    if (!flowerData) return;
    
    setSelectedMonth(normalizedMonth);
    onUpdate({
      ...user,
      zodiacFlower: {
        month: normalizedMonth,
        flower: flowerData.flower,
        color: flowerData.color,
        hex: flowerData.hex,
        pointsAdded: true
      }
    });
  };

  const handleMintCertificate = () => {
    setIsMintingCert(true);
    setTimeout(() => {
      setIsMintingCert(false);
      notify('success', 'CELESTIAL_ANCHOR', 'Birth cycle resonance sharded to registry.');
    }, 3500);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({
        ...user,
        name: editName,
        role: editRole,
        bio: editBio,
        location: editLocation
      });
      setIsSaving(false);
      notify('success', 'PROFILE_UPDATED', 'Steward dossier has been resynced with the network.');
    }, 1500);
  };

  const tabs = [
    { id: 'dossier', label: 'Dossier', icon: UserIcon },
    { id: 'card', label: 'Identity Card', icon: Fingerprint },
    { id: 'celestial', label: 'Celestial Vault', icon: Flower2 },
    { id: 'edit', label: 'Edit Node', icon: Pencil },
    { id: 'signals', label: 'Network Signals', icon: Bell },
    { id: 'sharing', label: 'External Shards', icon: Share2 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  // Safety selector for flower data
  const activeFlower = MONTH_FLOWERS[selectedMonth] || MONTH_FLOWERS['MAR'];

  if (isGuest) {
    return (
      <div className="max-w-xl mx-auto py-20 animate-in fade-in zoom-in duration-700">
        <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-black/40 text-center space-y-8 shadow-3xl">
          <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl animate-float">
            <Lock size={48} className="text-emerald-400" />
          </div>
          <div className="space-y-4">
             <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Guest <span className="text-emerald-400">Observer</span></h2>
             <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
                "Anonymous nodes are restricted to read-only views. Sync your steward identity to unlock sharding, minting, and industrial finality."
             </p>
          </div>
          <button 
            onClick={onLogin}
            className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all ring-8 ring-emerald-500/5"
          >
             Initialize Shard Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700 pb-32 px-4 lg:px-0">
      
      {/* 1. Portal Header Section */}
      <div className="glass-card p-10 md:p-14 rounded-[80px] bg-black/60 border border-white/5 relative overflow-hidden flex flex-col items-center text-center space-y-8 shadow-3xl">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <Fingerprint className="w-[800px] h-[800px] text-white" />
         </div>
         
         <div className="relative group">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-[#1e293b] border-4 border-white/5 shadow-3xl overflow-hidden flex items-center justify-center relative">
               {user.avatar ? (
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl font-black text-slate-700">
                    {user.name[0]}
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-12 translate-x-1/2 z-10">
               <div className="p-4 bg-indigo-600 rounded-full border-4 border-[#020403] shadow-[0_0_40px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-500">
                  <BadgeCheck size={32} className="text-white" />
               </div>
            </div>
         </div>

         <div className="space-y-4 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{user.name}</h2>
            <p className="text-emerald-400 font-mono text-lg md:text-2xl tracking-[0.4em] uppercase opacity-80">{user.esin}</p>
         </div>

         <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20">{user.wallet.tier} Tier</span>
            <span className="px-6 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">{user.role}</span>
            <span className="px-6 py-2 bg-white/5 text-slate-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-white/10">{user.location}</span>
         </div>
      </div>

      {/* 2. Secondary Sections Navigation */}
      <div className="flex justify-center">
         <div className="flex flex-wrap justify-center gap-3 p-2 glass-card rounded-full bg-black/40 border border-white/5 shadow-3xl overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
         </div>
      </div>

      {/* 3. Render Area */}
      <div className="min-h-[600px]">
         {/* DOSSIER OVERVIEW */}
         {activeTab === 'dossier' && (
           <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 space-y-10 shadow-3xl flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Coins size={300} className="text-emerald-500" /></div>
                    <h3 className="text-base font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 italic relative z-10">
                       NODE TREASURY <Wallet className="w-5 h-5 text-emerald-500" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                       <div className="p-10 bg-black/60 rounded-[44px] border border-white/5 shadow-inner text-center space-y-4 group/util hover:border-emerald-500/20 transition-all">
                          <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">UTILITY EAC</p>
                          <p className="text-6xl font-mono font-black text-white tracking-tighter">{user.wallet.balance.toLocaleString()}</p>
                          <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-[9px] uppercase">
                             <TrendingUp size={12} /> +12.4% Δ
                          </div>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[44px] border border-white/5 shadow-inner text-center space-y-4 group/equity hover:border-amber-500/20 transition-all">
                          <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">EQUITY EAT</p>
                          <p className="text-6xl font-mono font-black text-amber-500 tracking-tighter">{user.wallet.eatBalance.toFixed(2)}</p>
                          <div className="flex items-center justify-center gap-2 text-amber-500/60 font-black text-[9px] uppercase">
                             <Target size={12} /> m-SYNC: 1.42x
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-8 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Microscope size={200} className="text-blue-400" /></div>
                    <h3 className="text-base font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 italic px-4 relative z-10">
                       SKILLS RESONANCE <Dna className="w-5 h-5 text-blue-400" />
                    </h3>
                    <div className="h-80 w-full relative z-10">
                       <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                             <PolarGrid stroke="rgba(255,255,255,0.05)" />
                             <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} fontStyle="italic" />
                             <RechartsRadar name="Skill Level" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px' }} />
                          </RadarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* IDENTITY CARD */}
         {activeTab === 'card' && (
           <div className="animate-in zoom-in duration-500 flex flex-col items-center space-y-12">
              <div className="text-center space-y-4">
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Physical <span className="text-emerald-400">Handshake Shard</span></h3>
                 <p className="text-slate-500 italic text-lg">"Your sovereign industrial identity, verifiable via QR or NFC taps."</p>
              </div>
              <div className="p-10 glass-card rounded-[80px] bg-white/[0.01] border-2 border-white/5 shadow-3xl">
                 <IdentityCard user={user} />
              </div>
              <div className="flex gap-4">
                 <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-3">
                    <Download size={18} /> Export PDF Warrant
                 </button>
                 <button className="px-10 py-4 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                    <Stamp size={18} /> Order Physical Hard-Copy
                 </button>
              </div>
           </div>
         )}

         {/* CELESTIAL VAULT */}
         {activeTab === 'celestial' && (
           <div className="animate-in zoom-in duration-700 space-y-16">
              <div className="text-center space-y-6">
                 <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter m-0 leading-none text-white drop-shadow-[0_40px_80px_rgba(232,121,249,0.3)]">
                    CELESTIAL <span className="text-fuchsia-400">VAULT</span>
                 </h2>
                 <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-70 leading-relaxed px-10">
                    "Synchronizing industrial cycles with cosmic agricultural resonance."
                 </p>
              </div>

              <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-fuchsia-500/20 bg-fuchsia-950/5 space-y-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                    <Flower2 size={1000} className="text-fuchsia-500" />
                 </div>
                 
                 <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-12 mb-10 relative z-10 gap-10">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 bg-fuchsia-800 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700">
                          <Star className="text-white fill-current w-12 h-12 animate-pulse" />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-widest leading-none">BIRTH CYCLE <br/><span className="text-fuchsia-400">RESONANCE</span></h3>
                    </div>
                    <div className="text-center md:text-right">
                       <p className="text-[11px] text-fuchsia-400/60 font-black uppercase tracking-[0.5em] mb-3 italic">SYNC_FREQUENCY</p>
                       {/* Defensive lookup using activeFlower fallback */}
                       <p className="text-6xl font-mono font-black text-white leading-none">{activeFlower.resonance}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.keys(MONTH_FLOWERS).map(m => (
                       <button 
                          key={m} 
                          onClick={() => handleUpdateMonth(m)}
                          className={`py-8 rounded-[32px] text-xl font-black uppercase transition-all border-2 relative overflow-hidden group/btn ${selectedMonth === m ? 'bg-fuchsia-800 border-white text-white shadow-[0_0_100px_rgba(232,121,249,0.5)] scale-105' : 'bg-black/60 border-white/5 text-slate-700 hover:border-fuchsia-500/40 hover:text-fuchsia-400'}`}
                       >
                          {m}
                       </button>
                    ))}
                 </div>

                 <div className="mt-20 flex flex-col md:flex-row items-center gap-16 relative z-10 pt-16 border-t border-white/5">
                    <div className="w-48 h-48 rounded-[64px] bg-fuchsia-800/20 flex items-center justify-center border-4 border-fuchsia-500/30 shadow-3xl animate-float">
                       {/* Defensive color application */}
                       <Flower2 size={96} className={`${activeFlower.color}`} />
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                       <h5 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{activeFlower.flower}</h5>
                       <p className="text-slate-400 text-xl font-medium italic opacity-80 leading-relaxed">
                          "Identifying a high resonance between your birth node and the current seasonal cycle. Minting this shard anchors 50 EAC growth yield to your registry account."
                       </p>
                       <button 
                         onClick={handleMintCertificate}
                         disabled={isMintingCert}
                         className="w-full max-w-md py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6"
                       >
                          {isMintingCert ? <Loader2 className="animate-spin w-6 h-6" /> : <Stamp size={28} />}
                          {isMintingCert ? 'MINTING SHARD...' : 'ANCHOR CELESTIAL SHARD'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* EDIT PROFILE FORM */}
         {activeTab === 'edit' && (
           <div className="animate-in slide-in-from-right-6 duration-700 max-w-4xl mx-auto">
              <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-12 shadow-3xl">
                 <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                    <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl text-white">
                       <Pencil size={32} />
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Edit Steward <span className="text-emerald-400">Dossier</span></h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Steward Alias</label>
                       <input 
                         type="text" value={editName} onChange={e => setEditName(e.target.value)}
                         className="w-full bg-black border border-white/10 rounded-3xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Pillar Role</label>
                       <input 
                         type="text" value={editRole} onChange={e => setEditRole(e.target.value)}
                         className="w-full bg-black border border-white/10 rounded-3xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                       />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Biometric Location</label>
                       <input 
                         type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)}
                         className="w-full bg-black border border-white/10 rounded-3xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                       />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Identity Narrative (Bio)</label>
                       <textarea 
                         value={editBio} onChange={e => setEditBio(e.target.value)}
                         className="w-full bg-black border border-white/10 rounded-[40px] p-8 text-white font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none h-48 resize-none"
                         placeholder="Describe your regenerative contribution..."
                       />
                    </div>
                 </div>

                 <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                    <button onClick={() => setActiveTab('dossier')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Discard</button>
                    <button 
                       onClick={handleSaveProfile}
                       disabled={isSaving}
                       className="px-16 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                       {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                       {isSaving ? 'SYNCING_DOUCMENT...' : 'ANCHOR_CHANGES'}
                    </button>
                 </div>
              </div>
           </div>
         )}

         {/* NETWORK SIGNALS (NOTIFICATIONS HISTORY) */}
         {activeTab === 'signals' && (
           <div className="animate-in slide-in-from-left-6 duration-700 space-y-10">
              <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Signal <span className="text-indigo-400">Ledger</span></h3>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Personal Event Ingest</p>
              </div>
              <div className="space-y-4">
                 {signals.length === 0 ? (
                    <div className="py-40 text-center opacity-10">
                       <Bell size={120} className="mx-auto mb-6" />
                       <p className="text-2xl font-black uppercase tracking-[0.5em]">No signals sharded</p>
                    </div>
                 ) : (
                    signals.map(sig => (
                       <div key={sig.id} className="p-8 glass-card rounded-[48px] border border-white/5 bg-black/60 flex items-center justify-between group hover:border-indigo-500/20 transition-all shadow-2xl relative overflow-hidden">
                          <div className="flex items-center gap-8 relative z-10">
                             <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform`}>
                                <sig.actionIcon size={24} />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic m-0">{sig.title}</h4>
                                <p className="text-sm text-slate-400 mt-2 italic">"{sig.message}"</p>
                             </div>
                          </div>
                          <div className="text-right shrink-0 relative z-10">
                             <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest mb-2">{sig.timestamp}</p>
                             <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase rounded-full border border-indigo-500/20">ZK_ANCHOR_VERIFIED</span>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
         )}

         {/* EXTERNAL SHARING */}
         {activeTab === 'sharing' && (
           <div className="animate-in zoom-in duration-700 space-y-12 max-w-4xl mx-auto">
              <div className="glass-card p-16 rounded-[80px] border border-emerald-500/20 bg-emerald-950/5 text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]"><Share2 size={600} className="text-emerald-400" /></div>
                 <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto animate-float">
                    <Share2 size={56} className="text-white" />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Broadcasting <span className="text-emerald-400">Node</span></h3>
                    <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto italic leading-relaxed">"Propagate your industrial achievements across external planetary networks."</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <button className="p-8 bg-blue-600/10 border border-blue-500/30 rounded-[44px] flex items-center justify-between group/link hover:bg-blue-600 transition-all shadow-xl">
                       <div className="flex items-center gap-6">
                          <Twitter className="w-10 h-10 text-blue-400 group-hover/link:text-white transition-colors" />
                          <span className="text-xl font-black text-white italic tracking-tighter">X Sharding</span>
                       </div>
                       <ArrowUpRight className="text-blue-400 group-hover/link:text-white" />
                    </button>
                    <button className="p-8 bg-indigo-600/10 border border-indigo-500/30 rounded-[44px] flex items-center justify-between group/link hover:bg-indigo-600 transition-all shadow-xl">
                       <div className="flex items-center gap-6">
                          <Linkedin className="w-10 h-10 text-indigo-400 group-hover/link:text-white transition-colors" />
                          <span className="text-xl font-black text-white italic tracking-tighter">Chain Link</span>
                       </div>
                       <ArrowUpRight className="text-indigo-400 group-hover/link:text-white" />
                    </button>
                    <button className="p-8 bg-rose-600/10 border border-rose-500/30 rounded-[44px] flex items-center justify-between group/link hover:bg-rose-600 transition-all shadow-xl md:col-span-2">
                       <div className="flex items-center gap-6">
                          <Globe2 className="w-10 h-10 text-rose-400 group-hover/link:text-white transition-colors" />
                          <span className="text-xl font-black text-white italic tracking-tighter">Personal Web Shard</span>
                       </div>
                       <Copy className="text-rose-400 group-hover/link:text-white" />
                    </button>
                 </div>
              </div>
           </div>
         )}

         {/* SYSTEM SETTINGS */}
         {activeTab === 'settings' && (
           <div className="animate-in slide-in-from-right-6 duration-700 max-w-4xl mx-auto space-y-12">
              <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-12 shadow-3xl">
                 <div className="flex items-center justify-between border-b border-white/5 pb-8 px-4">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-slate-800 rounded-3xl shadow-xl text-slate-400">
                          <Settings size={32} />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">System <span className="text-slate-500">Settings</span></h3>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[44px] group hover:border-emerald-500/20 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-emerald-400 transition-colors"><Bell size={24} /></div>
                          <div>
                             <p className="text-xl font-black text-white italic tracking-widest leading-none">Telemetry Alerts</p>
                             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-3">High-frequency push notifications</p>
                          </div>
                       </div>
                       <div className="w-14 h-8 bg-emerald-600 rounded-full flex items-center px-1 shadow-inner relative group/toggle cursor-pointer">
                          <div className="w-6 h-6 bg-white rounded-full translate-x-6 transition-transform"></div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[44px] group hover:border-blue-500/20 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-blue-400 transition-colors"><ShieldIcon size={24} /></div>
                          <div>
                             <p className="text-xl font-black text-white italic tracking-widest leading-none">Privacy Sharding</p>
                             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-3">Obfuscate precise node coordinates</p>
                          </div>
                       </div>
                       <div className="w-14 h-8 bg-slate-800 rounded-full flex items-center px-1 shadow-inner relative group/toggle cursor-pointer">
                          <div className="w-6 h-6 bg-slate-600 rounded-full transition-transform"></div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[44px] group hover:border-rose-500/20 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-rose-500 transition-colors"><SmartphoneNfc size={24} /></div>
                          <div>
                             <p className="text-xl font-black text-white italic tracking-widest leading-none">Biometric Auth</p>
                             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-3">Local device biometric sharding</p>
                          </div>
                       </div>
                       <div className="w-14 h-8 bg-emerald-600 rounded-full flex items-center px-1 shadow-inner relative group/toggle cursor-pointer">
                          <div className="w-6 h-6 bg-white rounded-full translate-x-6 transition-transform"></div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-12 border-t border-white/5 flex flex-col gap-6">
                    <button 
                      onClick={onLogout}
                      className="w-full py-8 bg-rose-600/10 border-2 border-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-[40px] text-[13px] font-black uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-6"
                    >
                       <LogOut size={24} /> DECOUPLE NODE SESSION
                    </button>
                    <button className="text-[9px] font-black text-slate-700 hover:text-rose-400 uppercase tracking-[0.6em] transition-colors py-4">PERMANENT_REGISTRY_WIPE</button>
                 </div>
              </div>
           </div>
         )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .agro-gradient-fuchsia { background: linear-gradient(135deg, #701a75 0%, #d946ef 100%); }
        @keyframes scan { 
          0% { top: -10px; } 
          100% { top: 100%; } 
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UserProfile;
