
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
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';
import IdentityCard from './IdentityCard';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onLogout, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'dossier' | 'security'>('general');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [role, setRole] = useState(user.role);
  const [isSaving, setIsSaving] = useState(false);

  // Security Interaction States
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricStep, setBiometricStep] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'idle' | 'sending' | 'verified'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({
        ...user,
        name,
        location,
        role
      });
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  const startBiometricScan = () => {
    setBiometricStep('scanning');
    setTimeout(() => {
      setBiometricStep('complete');
    }, 3000);
  };

  const initiateRecoveryCheck = () => {
    setRecoveryStep('sending');
    setTimeout(() => {
      setRecoveryStep('verified');
    }, 2500);
  };

  const handleDeleteFinal = () => {
    if (deleteInput === user.esin) {
      onDeleteAccount?.();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
                <Calendar className="w-3 h-3" /> Node Active Since {user.regDate}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] bg-blue-500/5 border-blue-500/20 flex flex-col justify-center text-center space-y-4">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Registry Standing</p>
           <h3 className="text-5xl font-black text-white tracking-tighter">EXCELLENT</h3>
           <div className="flex justify-center gap-1">
             {[...Array(5)].map((_, i) => (
               <Award key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
             ))}
           </div>
           <p className="text-xs text-slate-500 font-medium italic">"Top 5% of stewards in the {user.location.split(',')[1] || 'Global'} zone."</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'general', label: 'Identity Settings', icon: UserIcon },
          { id: 'dossier', label: 'Steward Dossier', icon: Fingerprint },
          { id: 'security', label: 'Node Security', icon: Lock },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left-4 duration-500">
          
          {activeTab === 'general' && (
            <div className="space-y-8">
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
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Anchor Email (Immutable)</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                          type="email" 
                          disabled
                          value={user.email}
                          className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-slate-600 cursor-not-allowed font-medium" 
                        />
                      </div>
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
                 </div>

                 <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-center gap-4 mt-4">
                    <Activity className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Identity changes require a cryptographic re-sync with the global registry. This may briefly pause your active reaction mining sessions.
                    </p>
                 </div>
              </div>

              {/* Danger Zone */}
              <div className="glass-card p-10 rounded-[40px] border border-rose-500/30 bg-rose-500/5 space-y-8">
                 <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Danger Zone</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col justify-center">
                       <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-400" /> Terminate Node Session
                       </h4>
                       <p className="text-xs text-slate-500">Unbind hardware relay and clear local session state.</p>
                       <button 
                        onClick={onLogout}
                        className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                       >
                          Execute Logout
                       </button>
                    </div>

                    <div className="space-y-2 flex flex-col justify-center">
                       <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-rose-500" /> Delete Node Entry
                       </h4>
                       <p className="text-xs text-slate-500">Permanently purge your ESIN from the local registry.</p>
                       <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-4 px-8 py-3 bg-rose-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/40 hover:bg-rose-500 transition-all"
                       >
                          Purge Identity
                       </button>
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

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                          onClick={() => { setShowBiometricModal(true); setBiometricStep('idle'); }}
                          className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 text-left hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all group"
                        >
                           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              <Fingerprint className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white group-hover:text-emerald-400">Biometric Vault</p>
                              <p className="text-[10px] text-slate-500">Node bound to device hardware.</p>
                           </div>
                        </button>
                        <button 
                          onClick={() => { setShowRecoveryModal(true); setRecoveryStep('idle'); }}
                          className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 text-left hover:bg-blue-500/5 hover:border-blue-500/20 transition-all group"
                        >
                           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                              <Key className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white group-hover:text-blue-400">Recovery Anchor</p>
                              <p className="text-[10px] text-slate-500">Verified via {user.email}</p>
                           </div>
                        </button>
                     </div>
                  </div>

                  <div className="flex justify-center pt-4">
                     <button className="px-10 py-4 bg-rose-600/10 border border-rose-500/20 rounded-2xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                        Initiate Node Transfer
                     </button>
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
                      <span className="text-slate-500 font-bold uppercase">Node Integrity</span>
                      <span className="text-emerald-400 font-black">STABLE</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold uppercase">Registry Sync</span>
                      <span className="text-blue-400 font-black">100%</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold uppercase">Vouch Score</span>
                      <span className="text-white font-black">42.8/50</span>
                   </div>
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                   <Activity className="w-4 h-4" /> Download Node Dossier
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowDeleteConfirm(false)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-1 rounded-[44px] border-rose-500/40 bg-rose-950/20 overflow-hidden">
              <div className="p-12 space-y-10 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-rose-500/20 rounded-[32px] flex items-center justify-center border border-rose-500/40 animate-bounce">
                    <AlertTriangle className="w-10 h-10 text-rose-500" />
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Purge Node Identity?</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                       This action is permanent. Your node <strong>{user.esin}</strong> will be unlinked from the registry and all spendable EAC will be lost.
                    </p>
                 </div>

                 <div className="w-full space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type your ESIN to confirm purge</p>
                    <input 
                      type="text" 
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder={user.esin}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-center font-mono uppercase tracking-widest focus:ring-2 focus:ring-rose-500/40 outline-none" 
                    />
                 </div>

                 <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                      onClick={handleDeleteFinal}
                      disabled={deleteInput !== user.esin}
                      className="flex-1 py-4 bg-rose-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/40 hover:bg-rose-500 transition-all disabled:opacity-30"
                    >
                       Purge Node
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Biometric Vault Modal */}
      {showBiometricModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowBiometricModal(false)}></div>
          <div className="relative z-10 w-full max-w-md glass-card p-1 rounded-[40px] border-emerald-500/20 overflow-hidden">
             <div className="bg-[#050706]/90 p-10 space-y-8 flex flex-col items-center text-center min-h-[450px] justify-center">
                <button onClick={() => setShowBiometricModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                {biometricStep === 'idle' && (
                  <div className="space-y-8 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                       <Scan className="w-12 h-12 text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Hardware Lock</h3>
                       <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                          Secure your EnvirosAgro steward node by binding it to this device's hardware signature.
                       </p>
                    </div>
                    <button 
                      onClick={startBiometricScan}
                      className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] transition-all"
                    >
                       Initialize Scan
                    </button>
                  </div>
                )}

                {biometricStep === 'scanning' && (
                  <div className="space-y-8 animate-in fade-in duration-500 flex flex-col items-center">
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full border-2 border-emerald-500/20 flex items-center justify-center overflow-hidden">
                          <Fingerprint className="w-16 h-16 text-emerald-500 animate-pulse" />
                       </div>
                       <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-white uppercase tracking-widest">Reading Hardware</h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] animate-pulse">0x882_ENCRYPT_HARDWARE_ID...</p>
                    </div>
                  </div>
                )}

                {biometricStep === 'complete' && (
                  <div className="space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 scale-110">
                       <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Vault Bound</h3>
                       <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">Biometric Integrity Confirmed</p>
                    </div>
                    <button 
                      onClick={() => setShowBiometricModal(false)}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Return to Security
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Recovery Anchor Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowRecoveryModal(false)}></div>
          <div className="relative z-10 w-full max-w-md glass-card p-1 rounded-[40px] border-blue-500/20 overflow-hidden">
             <div className="bg-[#050706]/90 p-10 space-y-8 flex flex-col items-center text-center min-h-[450px] justify-center">
                <button onClick={() => setShowRecoveryModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                {recoveryStep === 'idle' && (
                  <div className="space-y-8 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                       <Wifi className="w-12 h-12 text-blue-400" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Recovery Anchor</h3>
                       <p className="text-slate-400 text-xs leading-relaxed">
                          Your node identity is anchored to <br/><span className="text-blue-400 font-bold">{user.email}</span>.
                       </p>
                    </div>
                    <button 
                      onClick={initiateRecoveryCheck}
                      className="w-full py-5 bg-blue-600 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all"
                    >
                       Ping Recovery Node
                    </button>
                  </div>
                )}

                {recoveryStep === 'sending' && (
                  <div className="space-y-8 animate-in fade-in duration-500 flex flex-col items-center">
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full border-2 border-blue-500/20 flex items-center justify-center overflow-hidden">
                          <Send className="w-12 h-12 text-blue-400 animate-ping" />
                       </div>
                       <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-white uppercase tracking-widest">Routing Signal</h3>
                       <p className="text-blue-500/60 font-mono text-[10px] animate-pulse">DISPATCHING_RECOVERY_PACKET...</p>
                    </div>
                  </div>
                )}

                {recoveryStep === 'verified' && (
                  <div className="space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 scale-110">
                       <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Path Verified</h3>
                       <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1">Registry Handshake Successful</p>
                    </div>
                    <button 
                      onClick={() => setShowRecoveryModal(false)}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Return to Security
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
