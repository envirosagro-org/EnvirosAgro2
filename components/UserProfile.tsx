
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
  Gift
} from 'lucide-react';
import { User } from '../types';
import IdentityCard from './IdentityCard';
import { verifyTelecommNode } from '../services/geminiService';
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

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onLogout, onDeleteAccount, signals, setSignals, onAcceptProposal }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'dossier' | 'signals' | 'security'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [viewingContract, setViewingContract] = useState<SignalShard | null>(null);
  const [isGeneratingBadge, setIsGeneratingBadge] = useState(false);
  
  // Form State
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [role, setRole] = useState(user.role);
  const [countryCode, setCountryCode] = useState(user.countryCode || '+254');
  const [lineNumber, setLineNumber] = useState(user.lineNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  const unreadCount = signals.filter(n => !n.read).length;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({
        ...user,
        name,
        location,
        role,
        countryCode,
        lineNumber
      });
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  const markRead = (id: string) => {
    setSignals(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setSignals(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (sig: SignalShard) => {
    if (sig.type === 'engagement' && sig.meta?.collectiveId) {
      setViewingContract(sig);
    } else {
      markRead(sig.id);
    }
  };

  const finalizeAcceptance = (id: string) => {
    setIsVerifying(id);
    setTimeout(() => {
      onAcceptProposal?.(id);
      setIsVerifying(null);
      setViewingContract(null);
    }, 2500);
  };

  const downloadZodiacBadge = async () => {
    if (!user.zodiacFlower) return;
    setIsGeneratingBadge(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#050706';
    ctx.fillRect(0, 0, 1000, 1000);

    // Glow Effect
    const gradient = ctx.createRadialGradient(500, 500, 0, 500, 500, 500);
    gradient.addColorStop(0, '#10b98111');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 1000);

    // Badge Ring
    ctx.beginPath();
    ctx.arc(500, 500, 400, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    // Stylized Flower
    ctx.font = 'bold 180px serif';
    ctx.fillStyle = user.zodiacFlower.hex || '#f472b6';
    ctx.textAlign = 'center';
    ctx.fillText('❁', 500, 550);

    // User Data
    ctx.font = 'black 45px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(user.name.toUpperCase(), 500, 720);
    
    ctx.font = 'bold 35px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText(user.esin, 500, 780);

    ctx.font = 'bold 25px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('STWD_ZODIAC_RECOGNITION_NODE', 500, 850);

    // Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `EnvirosAgro_Identity_Shard_${user.zodiacFlower.flower}.png`;
    link.href = dataUrl;
    link.click();
    
    setIsGeneratingBadge(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[40px] relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 right-0 w-64 h-64 agro-gradient opacity-10 blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative group">
            <div className="w-40 h-40 rounded-[48px] bg-slate-800 border-4 border-white/5 flex items-center justify-center text-6xl font-black text-emerald-400 shadow-2xl relative overflow-hidden">
               {user.name[0]}
               <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Edit3 className="w-8 h-8 text-white" />
               </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-xl">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h2 className="text-4xl font-black text-white tracking-tight">{user.name}</h2>
                <BadgeCheck className="w-6 h-6 text-blue-400 fill-blue-400/20" />
              </div>
              <p className="text-emerald-500 font-mono text-sm tracking-[0.2em] mt-1">{user.esin}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3 h-3" /> {user.location}
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> {user.role}
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Active Since {user.regDate}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] bg-blue-500/5 border-blue-500/20 flex flex-col justify-center text-center space-y-4">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Registry Standing</p>
           <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic">Master</h3>
           <div className="flex justify-center gap-1">
             {[...Array(5)].map((_, i) => (
               <Award key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
             ))}
           </div>
           <p className="text-xs text-slate-500 font-medium italic">"High reputation node (Cycle 12)"</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'general', label: 'Identity Settings', icon: UserIcon, badge: 0 },
          { id: 'signals', label: 'Network Signals', icon: Bell, badge: unreadCount },
          { id: 'dossier', label: 'Steward Dossier', icon: Fingerprint, badge: 0 },
          { id: 'security', label: 'Node Security', icon: Lock, badge: 0 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> 
            {tab.label}
            {tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#050706] animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left-4 duration-500">
          
          {activeTab === 'signals' && (
            <div className="space-y-8">
               <div className="flex justify-between items-end border-b border-white/5 pb-6 px-4">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Incoming <span className="text-emerald-400">Signals</span></h3>
                    <p className="text-slate-500 text-sm mt-1">Real-time engagement and system telemetry shards.</p>
                  </div>
                  <button 
                    onClick={() => setSignals(prev => prev.map(n => ({...n, read: true})))}
                    className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark all as read
                  </button>
               </div>

               <div className="space-y-6">
                  {signals.length === 0 ? (
                    <div className="glass-card p-20 rounded-[48px] border-white/5 flex flex-col items-center text-center space-y-4 opacity-30">
                       <Radio className="w-16 h-16 text-slate-500 animate-pulse" />
                       <p className="text-lg font-bold text-slate-400 uppercase">Silence in the Registry</p>
                    </div>
                  ) : (
                    signals.map(sig => {
                      const Icon = sig.type === 'system' ? ShieldCheck : sig.type === 'engagement' ? Handshake : Globe;
                      const PriorityColor = sig.priority === 'high' ? 'text-rose-400' : sig.priority === 'medium' ? 'text-amber-400' : 'text-blue-400';
                      const isContract = sig.type === 'engagement' && sig.meta?.collectiveId;
                      
                      return (
                        <div 
                          key={sig.id} 
                          className={`glass-card p-8 rounded-[40px] border-2 transition-all flex flex-col group relative overflow-hidden ${sig.read ? 'border-white/5 bg-white/[0.01]' : isContract ? 'border-amber-500/40 bg-amber-500/[0.03] shadow-[0_0_50px_rgba(245,158,11,0.1)]' : 'border-emerald-500/20 bg-emerald-500/[0.03] shadow-2xl'}`}
                        >
                           <div className="flex items-start gap-8 w-full">
                              <div className={`p-5 rounded-[24px] shrink-0 transition-all ${sig.read ? 'bg-white/5 text-slate-600' : isContract ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400 shadow-xl shadow-emerald-900/10 group-hover:scale-110'}`}>
                                 {isContract ? <FileSignature className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                       <h4 className={`text-xl font-bold uppercase tracking-tight ${sig.read ? 'text-slate-400' : 'text-white'}`}>
                                          {isContract && <span className="text-amber-500 mr-2">[BINDING_CONTRACT]</span>}
                                          {sig.title}
                                       </h4>
                                       {!sig.read && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{sig.timestamp}</span>
                                 </div>
                                 
                                 {isContract ? (
                                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                                       <div className="flex items-center gap-2 mb-2">
                                          <FileCode className="w-4 h-4 text-amber-500" />
                                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Protocol: EA_RECRUIT_V3.2</span>
                                       </div>
                                       <p className="text-slate-300 text-sm italic font-medium leading-relaxed">
                                          {sig.message}
                                       </p>
                                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                          <div>
                                             <p className="text-[8px] text-slate-600 uppercase font-black">Collective Node</p>
                                             <p className="text-xs font-mono text-white truncate">{sig.meta.collectiveName}</p>
                                          </div>
                                          <div className="text-right">
                                             <p className="text-[8px] text-slate-600 uppercase font-black">Bounty</p>
                                             <p className="text-xs font-mono text-emerald-400 font-black">{sig.meta.reward} EAC</p>
                                          </div>
                                       </div>
                                    </div>
                                 ) : (
                                    <p className={`text-sm leading-relaxed italic ${sig.read ? 'text-slate-500' : 'text-slate-300'}`}>
                                       "{sig.message}"
                                    </p>
                                 )}

                                 <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <span className="text-[8px] font-black text-slate-700 font-mono uppercase tracking-[0.4em]">{sig.id}</span>
                                       <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                       <span className={`text-[8px] font-black uppercase tracking-widest ${PriorityColor}`}>Priority: {sig.priority}</span>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                       {sig.actionLabel && !sig.read && (
                                          <button 
                                             onClick={() => handleAction(sig)}
                                             className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${isContract ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-900/20' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20'}`}
                                          >
                                             <sig.actionIcon className="w-3 h-3" />
                                             {sig.actionLabel}
                                          </button>
                                       )}
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); deleteNotification(sig.id); }}
                                         className="p-2.5 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20"
                                       >
                                          <Trash className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className={`absolute top-0 right-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${isContract ? 'bg-amber-500/40' : 'bg-emerald-500/20'}`}></div>
                        </div>
                      );
                    })
                  )}
               </div>
               
               <div className="p-8 glass-card rounded-[40px] bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-8 group">
                  <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                     <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-white uppercase tracking-widest italic">Engagement Multiplier</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Respond to peer signals within 12h to boost your Societal (S) Thrust by 0.5% per interaction.</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* Zodiac Flower Gift Badge Section */}
              {user.zodiacFlower && (
                <div className="glass-card p-10 rounded-[48px] border-pink-500/20 bg-pink-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 animate-in slide-in-from-top-4 duration-700">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                      <Gift className="w-64 h-64 text-pink-400" />
                   </div>
                   <div className="w-32 h-32 rounded-[40px] bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shadow-2xl shrink-0 group hover:rotate-12 transition-transform duration-500 relative">
                      <Flower2 className={`w-16 h-16 ${user.zodiacFlower.color}`} />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[40px] backdrop-blur-sm">
                         <Download className="w-8 h-8 text-white" />
                      </div>
                   </div>
                   <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Zodiac <span className="text-pink-400">Flower Shard</span></h3>
                         <p className="text-[10px] text-pink-400 font-black uppercase tracking-[0.4em] mt-2">Lilies Around x EnvirosAgro™ Gift</p>
                      </div>
                      <p className="text-slate-400 text-sm font-medium italic">
                         Your {user.zodiacFlower.flower} badge is anchored to the {user.zodiacFlower.month} registry. This shard grants 100 bonus reputation points for your worker dossier.
                      </p>
                      <button 
                        onClick={downloadZodiacBadge}
                        disabled={isGeneratingBadge}
                        className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-pink-600 hover:border-pink-500 transition-all shadow-xl group/btn disabled:opacity-50"
                      >
                         {isGeneratingBadge ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" />}
                         Download Identity Shard (PNG)
                      </button>
                   </div>
                </div>
              )}

              <div className="glass-card p-10 rounded-[40px] space-y-8 relative overflow-hidden">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                       <Edit3 className="w-5 h-5 text-emerald-400" />
                       Edit Steward Parameters
                    </h3>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Modify Registry
                      </button>
                    ) : (
                      <div className="flex gap-2">
                         <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase">Cancel</button>
                         <button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-2 agro-gradient rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"
                         >
                           {isSaving ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                           {isSaving ? 'Signing...' : 'Commit Changes'}
                         </button>
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Legal/Professional Alias</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Primary Node Location</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Professional Role</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Line Number Ingest</label>
                       <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="tel" 
                            disabled={!isEditing}
                            value={lineNumber}
                            onChange={(e) => setLineNumber(e.target.value)}
                            placeholder="7XX XXX XXX"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-mono tracking-widest disabled:opacity-50" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'dossier' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
               <div className="glass-card p-8 rounded-[40px] space-y-6">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Thrust Performance
                  </h4>
                  <div className="space-y-6">
                    {[
                      { label: 'Societal integration', val: 82, col: 'bg-emerald-400' },
                      { label: 'Environmental stewardship', val: 94, col: 'bg-blue-400' },
                      { label: 'Technological adoption', val: 76, col: 'bg-amber-400' },
                      { label: 'Informational accuracy', val: 89, col: 'bg-purple-400' },
                    ].map(item => (
                      <div key={item.label}>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-white">{item.val}%</span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.col} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="glass-card p-8 rounded-[40px] space-y-6">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Node Milestones
                  </h4>
                  <div className="space-y-4">
                     {user.zodiacFlower && (
                        <div className="flex gap-4 p-4 bg-pink-500/5 border border-pink-500/20 rounded-2xl animate-pulse">
                           <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                              <Flower2 size={20} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white">Floral Registry Sync</p>
                              <p className="text-[10px] text-slate-500 font-medium">Earned {user.zodiacFlower.flower} Zodiac Badge.</p>
                           </div>
                        </div>
                     )}
                     {[
                       { title: "Genesis Anchor", date: "Jan 12", desc: "First node initialization successful." },
                       { title: "Carbon-Zero Pilot", date: "Feb 08", desc: "Achieved 10t CO2e mitigation." },
                       { title: "Registry Trusted", date: "Mar 22", desc: "Verified 100 consecutive audits." },
                     ].map((m, i) => (
                       <div key={i} className="flex gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                             <span className="text-[10px] font-black">{m.date}</span>
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white">{m.title}</p>
                             <p className="text-[10px] text-slate-500 font-medium">{m.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="glass-card p-10 rounded-[40px] space-y-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Lock className="w-6 h-6 text-blue-400" /> Cryptographic Identity
                     </h3>
                     <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded tracking-widest border border-blue-500/20">Secured Layer-1</span>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center">
                           <p className="text-xs font-bold text-slate-300">Public Signing Key (ESIN)</p>
                           <button className="text-[10px] font-black text-blue-400 uppercase">Revoke</button>
                        </div>
                        <p className="text-xs font-mono text-emerald-400 break-all p-4 bg-black/40 rounded-xl border border-white/5">
                          {btoa(user.esin + user.email).substring(0, 64).toUpperCase()}...
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Identity Card Sidebox */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-400" /> Registry Card
          </h3>
          <div className="sticky top-24 transform scale-100 hover:scale-[1.02] transition-transform">
             <IdentityCard user={user} />
             <div className="mt-8 glass-card p-8 rounded-[40px] space-y-6">
                <div className="text-center">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Social Identification</p>
                   <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-6"></div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold uppercase">Signals Unread</span>
                      <span className={`font-black ${unreadCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{unreadCount}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold uppercase">Node Integrity</span>
                      <span className="text-emerald-400 font-black">STABLE</span>
                   </div>
                </div>
                <button 
                  onClick={() => setActiveTab('signals')}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                   <Bell className="w-4 h-4" /> View Signal Shards
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Contract Review Modal */}
      {viewingContract && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setViewingContract(null)}></div>
           <div className="relative z-[210] w-full max-w-2xl glass-card p-1 rounded-[56px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-in zoom-in duration-300">
              <div className="p-12 space-y-10 min-h-[600px] flex flex-col">
                 <button onClick={() => setViewingContract(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 <div className="flex items-center gap-6 mb-2">
                    <div className="p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                        <BookOpenCheck className="w-10 h-10 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Collective <span className="text-amber-500">Contract Review</span></h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Binding Shard: 0x772_RECRUIT</p>
                    </div>
                 </div>

                 <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar pr-4">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-1">
                          <p className="text-[9px] text-slate-500 uppercase font-black">Contracting Admin</p>
                          <p className="text-sm font-mono text-white truncate">{viewingContract.meta.adminEsin}</p>
                       </div>
                       <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-1">
                          <p className="text-[9px] text-slate-500 uppercase font-black">Target Collective</p>
                          <p className="text-sm font-mono text-emerald-400 truncate">{viewingContract.meta.collectiveName}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest px-4">Agreement Narrative</h4>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 prose prose-invert max-w-none">
                          <p className="text-slate-300 text-lg leading-loose italic whitespace-pre-line font-medium border-l-4 border-amber-500/30 pl-8">
                             "I, {user.name} (ESIN: {user.esin}), acknowledge the invitation to anchor my agricultural node to the {viewingContract.meta.collectiveName} distributed ledger. 
                             
                             By signing this shard, I commit to the mission objectives:
                             
                             '${viewingContract.meta.mission}'
                             
                             In exchange, the network will release a 50 EAC settlement to my treasury upon successful m-constant synchronization."
                          </p>
                       </div>
                    </div>

                    <div className="p-8 glass-card rounded-[40px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
                       <div className="flex items-center gap-4">
                          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                             <Coins className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-500 font-black uppercase">Settlement Reward</p>
                             <p className="text-2xl font-mono font-black text-white">{viewingContract.meta.reward} EAC</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] text-slate-500 uppercase font-black">Ledger Status</p>
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded tracking-widest border border-amber-500/20">Awaiting Signature</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-6 relative z-10 pt-4 border-t border-white/5">
                    <button onClick={() => setViewingContract(null)} className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Decline Shard</button>
                    <button 
                      onClick={() => finalizeAcceptance(viewingContract.id)}
                      disabled={!!isVerifying}
                      className="flex-[2] py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-30"
                    >
                       {isVerifying ? (
                         <>
                           <Loader2 className="w-8 h-8 animate-spin" />
                           <span>ZK-Proof Syncing...</span>
                         </>
                       ) : (
                         <>
                           <Stamp className="w-8 h-8" />
                           <span>Authorize Binding Contract</span>
                         </>
                       )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default UserProfile;
