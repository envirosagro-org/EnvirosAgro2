
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Cpu, ShoppingCart, Users, BrainCircuit, Library, Database, Wallet, Leaf, Menu, X, Layers, Radio, ShieldAlert, LogOut, User as UserIcon, Loader2, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Upload, Power, Mic, Coins, Activity, Globe, Share2, Server, Terminal, Shield, ExternalLink, Moon, Sun, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, ArrowLeft, CheckCircle2, AlertCircle, Info, Timer, AlertTriangle, Microscope, UserPlus, Handshake, Sprout, Briefcase, PawPrint, UserCircle, BellRing, Settings2, Bot
} from 'lucide-react';
import { ViewState, User, WorkerProfile, AgroProject, AgroTransaction } from './types';
import Dashboard from './components/Dashboard';
import Sustainability from './components/Sustainability';
import Economy from './components/Economy';
import Industrial from './components/Industrial';
import Intelligence from './components/Intelligence';
import Community from './components/Community';
import Explorer from './components/Explorer';
import Ecosystem from './components/Ecosystem';
import MediaHub from './components/MediaHub';
import InfoPortal from './components/InfoPortal';
import Login from './components/Login';
import AgroWallet from './components/AgroWallet';
import UserProfile from './components/UserProfile';
import InvestorPortal from './components/InvestorPortal';
import VendorPortal from './components/VendorPortal';
import NetworkIngest from './components/NetworkIngest';
import ToolsSection from './components/ToolsSection';
import LiveVoiceBridge from './components/LiveVoiceBridge';
import Channelling from './components/Channelling';
import EvidenceModal from './components/EvidenceModal';
import CircularGrid from './components/CircularGrid';
import NexusCRM from './components/NexusCRM';
import TQMGrid from './components/TQMGrid';
import ResearchInnovation from './components/ResearchInnovation';
import LiveFarming from './components/LiveFarming';
import ContractFarming from './components/ContractFarming';
import Agrowild from './components/Agrowild';
import FloatingConsultant from './components/FloatingConsultant';
import { syncUserToCloud } from './services/firebaseService';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

export interface SignalShard {
  id: string;
  type: 'system' | 'engagement' | 'network';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionLabel?: string;
  actionIcon?: any;
  meta?: any;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [viewHistory, setViewHistory] = useState<ViewState[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [showSignalDropdown, setShowSignalDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [networkSignals, setNetworkSignals] = useState<SignalShard[]>([
    { 
      id: 'SIG-001', 
      type: 'system', 
      title: 'Protocol Upgrade v3.2.1', 
      message: 'Center Gate has synchronized new C(a) multipliers.', 
      timestamp: '10m ago', 
      read: false, 
      priority: 'high' 
    }
  ]);

  const [collectives, setCollectives] = useState<any[]>([
    { 
      id: 'COLL-01', 
      name: 'Bantu Soil Guardians', 
      adminEsin: 'EA-ADMIN-X842', 
      members: [
        { id: 'W-01', name: 'Dr. Sarah Chen', sustainabilityRating: 98 },
        { id: 'W-02', name: 'Marcus T.', sustainabilityRating: 85 },
        { id: 'W-03', name: 'Elena Rodriguez', sustainabilityRating: 92 }
      ], 
      type: 'Clan', 
      mission: 'Preserving ancestral composting methods.',
      resonance: 92,
      objectives: ['Restore Soil Biome', 'Map Lineage Seeds'],
      signals: [{ from: 'Dr. Sarah Chen', text: 'Moisture Shard #402 committed to Bantu Ledger.', timestamp: '10:42 AM', type: 'text' }],
      materials: [{ name: 'Heritage_Grains_Map.png', uploader: 'Dr. Sarah Chen', size: '2.4MB' }],
      missionCampaign: {
        active: true,
        title: 'Bantu Soil Restoration Shard',
        target: 50000,
        pool: 12500
      }
    }
  ]);

  const [projects, setProjects] = useState<AgroProject[]>([
    { 
      id: 'PRJ-NE-291', 
      name: "Bantu Regenerative Cluster", 
      adminEsin: 'EA-ADMIN-X842',
      description: "Scaling ancient Bantu irrigation techniques using IoT telemetry.",
      thrust: "Societal", 
      status: 'Execution',
      totalCapital: 500000, 
      fundedAmount: 320000, 
      batchesClaimed: 0, 
      totalBatches: 10,
      progress: 20, 
      roiEstimate: 15,
      collateralLocked: 250000,
      profitsAccrued: 12500,
      investorShareRatio: 0.20, 
      performanceIndex: 88,
      memberCount: 7,
      isPreAudited: true,
      isPostAudited: true
    },
    { 
      id: 'PRJ-KE-101', 
      name: "Nairobi Spectral Lab", 
      adminEsin: 'EA-ADMIN-X842',
      description: "Establishing localized crop testing using satellite shards.",
      thrust: "Technological", 
      status: 'Funding',
      totalCapital: 120000, 
      fundedAmount: 85000, 
      batchesClaimed: 0, 
      totalBatches: 5,
      progress: 5, 
      roiEstimate: 22,
      collateralLocked: 60000,
      profitsAccrued: 0,
      investorShareRatio: 0.15, 
      performanceIndex: 0,
      memberCount: 4,
      isPreAudited: true,
      isPostAudited: false
    }
  ]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('agro_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    document.documentElement.className = theme;
    
    const savedUser = localStorage.getItem('agro_steward');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(7);
    const newNotif: Notification = { id, type, title, message, timestamp: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('agro_steward');
    setUser(null);
    setActiveView('dashboard');
    setViewHistory([]);
    setShowProfileDropdown(false);
    addNotification('info', 'SESSION_TERMINATED', 'Your node has been detached from the registry.');
  };

  const sendSignal = (signal: Omit<SignalShard, 'id' | 'timestamp' | 'read'>) => {
    const id = `SIG-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const newSignal: SignalShard = {
      ...signal,
      id,
      timestamp: 'Just now',
      read: false
    };
    setNetworkSignals(prev => [newSignal, ...prev]);
    addNotification('info', 'SIGNAL_INCOMING', `New ${signal.type} shard received in your profile.`);
  };

  const handleAcceptProposal = (signalId: string) => {
    const signal = networkSignals.find(s => s.id === signalId);
    if (!signal || !signal.meta || !user) return;

    const { collectiveId, collectiveName, reward } = signal.meta;

    setCollectives(prev => prev.map(c => {
      if (c.id === collectiveId) {
        const isAlreadyMember = c.members.some((m: any) => m.id === user.esin);
        if (isAlreadyMember) return c;
        return {
          ...c,
          members: [...c.members, { 
            id: user.esin, 
            name: user.name, 
            sustainabilityRating: user.metrics.sustainabilityScore 
          }]
        };
      }
      return c;
    }));

    if (reward) {
      const updatedUser: User = {
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance + reward,
          lifetimeEarned: user.wallet.lifetimeEarned + reward
        }
      };
      handleUpdateUser(updatedUser);
    }

    addNotification('success', 'CONTRACT_ANCHORED', `Handshake complete. You have joined ${collectiveName}. +${reward} EAC released.`);
    setNetworkSignals(prev => prev.map(s => s.id === signalId ? { ...s, read: true, actionLabel: undefined } : s));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('agro_theme', newTheme);
  };

  const handleNavigate = (newView: ViewState, action: string | null = null) => {
    if (newView === activeView && !action) return;
    if (action) {
      if (action === 'LOGOUT_PROMPT') {
        handleLogout();
        return;
      }
      setPendingAction(action);
    }
    setViewHistory(prev => [...prev, activeView]);
    setActiveView(newView);
    setShowProfileDropdown(false);
    setShowSignalDropdown(false);
    if (isMobile) setShowMobileMenu(false);
  };

  const handleGoBack = () => {
    if (viewHistory.length === 0) return;
    const previousView = viewHistory[viewHistory.length - 1];
    setViewHistory(prev => prev.slice(0, -1));
    setActiveView(previousView);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('agro_steward', JSON.stringify(updatedUser));
    await syncUserToCloud(updatedUser);
  };

  const spendEAC = (amount: number, reason: string) => {
    if (!user) return false;
    const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);
    
    if (totalBalance < amount) {
      addNotification('error', 'LIQUIDITY_FAIL', `Insufficient EAC for ${reason.replace('_', ' ')}.`);
      return false;
    }

    let remainingToSpend = amount;
    let newBonusBalance = user.wallet.bonusBalance || 0;
    let newBalance = user.wallet.balance;

    if (newBonusBalance > 0) {
      const spendFromBonus = Math.min(newBonusBalance, remainingToSpend);
      newBonusBalance -= spendFromBonus;
      remainingToSpend -= spendFromBonus;
    }

    if (remainingToSpend > 0) {
      newBalance -= remainingToSpend;
    }

    const updatedUser: User = { 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: newBalance,
        bonusBalance: newBonusBalance
      } 
    };
    handleUpdateUser(updatedUser);
    addNotification('success', 'EAC_BURN', `Spent ${amount} EAC for ${reason.replace('_', ' ')}.`);
    return true;
  };

  const earnEAC = (amount: number, reason: string) => {
    if (!user) return;
    const updatedUser: User = { 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + amount 
      } 
    };
    handleUpdateUser(updatedUser);
    addNotification('success', 'EAC_MINT', `Earned ${amount} EAC: ${reason.replace('_', ' ')}.`);
  };

  if (!user) return <Login onLogin={setUser} />;

  const navigation = [
    { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
    { id: 'wallet', name: 'Agro-Wallet', icon: Wallet },
    { id: 'agrowild', name: 'Agrowild Portal', icon: PawPrint },
    { id: 'live_farming', name: 'Live Farming', icon: Sprout },
    { id: 'contract_farming', name: 'Contract Farming', icon: Briefcase },
    { id: 'research', name: 'Research & Innovation', icon: Microscope },
    { id: 'tqm', name: 'TQM & Trace', icon: ClipboardCheck },
    { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake },
    { id: 'profile', name: 'Steward Profile', icon: UserIcon },
    { id: 'investor', name: 'Investor Portal', icon: Landmark },
    { id: 'vendor', name: 'Vendor Portal', icon: Store },
    { id: 'circular', name: 'Circular Grid', icon: Recycle },
    { id: 'ingest', name: 'Network Ingest', icon: Cable },
    { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
    { id: 'sustainability', name: 'Science & IoT', icon: Cpu },
    { id: 'economy', name: 'Market & Mining', icon: ShoppingCart },
    { id: 'industrial', name: 'Industrial Cloud', icon: Users },
    { id: 'intelligence', name: 'EOS Intelligence', icon: BrainCircuit },
    { id: 'tools', name: 'Integrated Tools', icon: Wrench },
    { id: 'media', name: 'Media Hub', icon: Radio },
    { id: 'community', name: 'Learning Hub', icon: Library },
    { id: 'ecosystem', name: 'Ecosystem Brands', icon: Layers },
    { id: 'explorer', name: 'Ledger Registry', icon: Database },
    { id: 'info', name: 'Governance & Info', icon: ShieldAlert },
  ];

  const unreadSignals = networkSignals.filter(s => !s.read);

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#050706] text-slate-200' : 'bg-slate-50 text-slate-900'} transition-colors duration-500`}>
      <div className="scanline"></div>
      
      {!isMobile && (
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} glass-card border-r border-slate-200 dark:border-white/5 flex flex-col z-50 transition-all duration-300 relative`}>
          <div className="p-6 flex items-center justify-between overflow-hidden border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-4 min-w-0">
              <div onClick={() => handleNavigate('dashboard')} className="w-10 h-10 agro-gradient rounded-xl flex items-center justify-center shrink-0 shadow-lg group cursor-pointer hover:rotate-12 transition-transform">
                <Leaf className="text-white w-6 h-6" />
              </div>
              {isSidebarOpen && <span className="text-xl font-black uppercase tracking-tighter truncate italic dark:text-white text-slate-900">Enviros<span className="text-emerald-500">Agro™</span></span>}
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-emerald-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <nav className="flex-1 mt-4 space-y-1 px-3 overflow-y-auto scrollbar-hide pb-10">
            {navigation.map((item) => (
              <button 
                key={item.id} 
                onClick={() => handleNavigate(item.id as ViewState)} 
                className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all group ${
                  activeView === item.id 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-500/5 hover:text-emerald-500'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 group-hover:scale-110 transition-transform ${activeView === item.id ? 'text-emerald-500' : ''}`} />
                {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest truncate">{item.name}</span>}
              </button>
            ))}
          </nav>

          <div className="p-6 mt-auto border-t border-slate-200 dark:border-white/5 space-y-3">
            <button 
              onClick={() => setIsVoiceBridgeOpen(true)}
              className="w-full flex items-center justify-center gap-3 p-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform"
            >
              <Mic size={18} /> {isSidebarOpen && "Initialize Voice"}
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 bg-rose-600/10 border border-rose-500/20 rounded-2xl text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
            >
              <LogOut size={18} /> {isSidebarOpen && "Detach Node"}
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto relative flex flex-col pb-24 lg:pb-0">
        <header className="flex justify-between items-center sticky top-0 bg-white/60 dark:bg-agro-bg/40 backdrop-blur-3xl z-40 py-4 px-6 md:px-10 border-b border-slate-200 dark:border-white/5 transition-all duration-500">
          <div className="flex items-center gap-4">
            {isMobile ? (
              <button onClick={() => setShowMobileMenu(true)} className="p-2 text-slate-400">
                <Menu size={24} />
              </button>
            ) : (
              viewHistory.length > 0 && (
                <button 
                  onClick={handleGoBack}
                  className="flex items-center gap-2 p-2 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all group"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </button>
              )
            )}
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none dark:text-white text-slate-900">
                {navigation.find(n => n.id === activeView)?.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-60 font-mono">Registry: {user.esin}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Global Search Interaction (Mock) */}
            <button className="p-2.5 text-slate-400 hover:text-emerald-500 transition-colors hidden sm:block">
              <Search size={18} />
            </button>

            {/* Network Signals Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowSignalDropdown(!showSignalDropdown); setShowProfileDropdown(false); }}
                className={`relative p-2.5 rounded-xl transition-all ${showSignalDropdown ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-500/5 hover:text-emerald-500'}`}
              >
                {unreadSignals.length > 0 ? <BellRing size={18} className="animate-bounce" /> : <Bell size={18} />}
                {unreadSignals.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#050706]">
                    {unreadSignals.length}
                  </span>
                )}
              </button>

              {showSignalDropdown && (
                <div className="absolute top-full right-0 mt-4 w-[320px] md:w-[400px] rounded-[32px] border-white/10 bg-[#0a1510] shadow-3xl overflow-hidden animate-in zoom-in duration-200 z-[100] border-2">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-emerald-500" /> Network Signals
                    </h4>
                    <span className="text-[9px] font-mono text-emerald-500/60 uppercase">{unreadSignals.length} New Shards</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                    {networkSignals.length > 0 ? networkSignals.map(sig => (
                      <div 
                        key={sig.id} 
                        onClick={() => handleNavigate('profile')}
                        className={`p-5 hover:bg-white/[0.05] transition-all cursor-pointer group flex gap-4 ${!sig.read ? 'bg-emerald-500/[0.05]' : ''}`}
                      >
                         <div className={`p-3 rounded-xl h-fit border ${!sig.read ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                            {sig.type === 'system' ? <Server size={14} /> : <UserCircle size={14} />}
                         </div>
                         <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                               <p className={`text-[11px] font-black uppercase tracking-tight ${!sig.read ? 'text-white' : 'text-slate-500'}`}>{sig.title}</p>
                               <span className="text-[8px] font-mono text-slate-700">{sig.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 italic font-medium">"{sig.message}"</p>
                         </div>
                      </div>
                    )) : (
                      <div className="p-10 text-center space-y-3 opacity-20">
                         <Activity size={24} className="mx-auto" />
                         <p className="text-[10px] font-black uppercase">No active shards in registry.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white/5 text-center border-t border-white/5">
                    <button onClick={() => handleNavigate('profile')} className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors">
                      View All Shards
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

            <button onClick={() => handleNavigate('wallet')} className="flex items-center gap-3 glass-card px-4 py-2 rounded-2xl border-emerald-500/20 hover:bg-emerald-500/10 transition-all group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Treasury</span>
                <span className="text-sm font-mono font-black dark:text-white text-slate-900">{(user.wallet.balance + (user.wallet.bonusBalance || 0)).toFixed(0)} <span className="text-[10px] text-emerald-500 font-sans">EAC</span></span>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500 transition-colors group-hover:text-white text-emerald-500">
                <Wallet size={18} />
              </div>
            </button>

            {/* Steward Profile Action */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowSignalDropdown(false); }}
                className="flex items-center gap-3 p-1.5 glass-card rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all group active:scale-95 shadow-lg backdrop-blur-md"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 font-black shadow-lg relative overflow-hidden">
                   {user.name[0]}
                   <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <ChevronLeft size={14} className={`text-slate-500 transition-transform duration-300 ${showProfileDropdown ? '-rotate-90' : ''} hidden sm:block`} />
              </button>

              {showProfileDropdown && (
                <div className="absolute top-full right-0 mt-4 w-[280px] rounded-[32px] border-white/10 bg-[#0a1510] shadow-3xl overflow-hidden animate-in slide-in-from-top-2 duration-300 z-[100] border-2">
                   <div className="p-8 space-y-6">
                      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                         <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-emerald-900/20">
                            {user.name[0]}
                         </div>
                         <div className="min-w-0">
                            <h4 className="text-base font-black text-white uppercase tracking-tight truncate m-0 leading-none">{user.name}</h4>
                            <p className="text-[10px] text-slate-500 font-mono mt-2 truncate tracking-widest">{user.esin}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black rounded border border-emerald-500/30 uppercase">{user.wallet.tier} Rank</span>
                         </div>
                      </div>

                      <nav className="space-y-1">
                         {[
                           { id: 'profile', name: 'My Profile', icon: UserCircle },
                           { id: 'wallet', name: 'Treasury Sync', icon: Coins },
                           { id: 'intelligence', name: 'AI Consultation', icon: Bot },
                           { id: 'profile', name: 'Registry Settings', icon: Settings2, action: null },
                         ].map(item => (
                           <button 
                             key={item.name} 
                             onClick={() => handleNavigate(item.id as ViewState)}
                             className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-emerald-600/10 hover:text-white transition-all group/item"
                           >
                              <item.icon size={16} className="group-hover/item:text-emerald-400 transition-colors" />
                              <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                           </button>
                         ))}
                      </nav>

                      <div className="pt-6 border-t border-white/5">
                         <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-3 p-4 bg-rose-600/10 border border-rose-500/20 rounded-2xl text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                         >
                            <LogOut size={16} /> Detach Node session
                         </button>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 relative overflow-x-hidden scrollbar-hide">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
          {activeView === 'agrowild' && <Agrowild user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} signals={networkSignals} setSignals={setNetworkSignals} onAcceptProposal={handleAcceptProposal} />}
          {activeView === 'investor' && (
             <InvestorPortal 
               user={user} 
               onUpdate={handleUpdateUser} 
               projects={projects} 
               pendingAction={pendingAction} 
               clearAction={() => setPendingAction(null)} 
             />
          )}
          {activeView === 'vendor' && <VendorPortal user={user} />}
          {activeView === 'tqm' && <TQMGrid user={user} onSpendEAC={spendEAC} />}
          {activeView === 'circular' && <CircularGrid user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'crm' && <NexusCRM user={user} onSpendEAC={spendEAC} />}
          {activeView === 'ingest' && <NetworkIngest />}
          {activeView === 'channelling' && <Channelling user={user} onEarnEAC={earnEAC} />}
          {activeView === 'sustainability' && <Sustainability onAction={() => setIsEvidenceModalOpen(true)} />}
          {activeView === 'economy' && <Economy user={user} onMint={() => setIsEvidenceModalOpen(true)} />}
          {activeView === 'live_farming' && <LiveFarming user={user} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'industrial' && (
            <Industrial 
              user={user} 
              onSpendEAC={spendEAC} 
              onSendProposal={sendSignal} 
              collectives={collectives} 
              setCollectives={setCollectives}
              onAddProject={(p) => setProjects(prev => [p, ...prev])}
              onUpdateProject={(p) => setProjects(prev => prev.map(oldP => oldP.id === p.id ? p : oldP))}
              pendingAction={pendingAction}
              clearAction={() => setPendingAction(null)}
              onNavigate={handleNavigate}
            />
          )}
          {activeView === 'intelligence' && <Intelligence userBalance={user.wallet.balance + (user.wallet.bonusBalance || 0)} onSpendEAC={spendEAC} />}
          {activeView === 'tools' && <ToolsSection />}
          {activeView === 'research' && <ResearchInnovation user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'community' && <Community user={user} onContribution={() => {}} onSpendEAC={spendEAC} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={() => {}} onUpdateUser={handleUpdateUser} />}
          {activeView === 'media' && <MediaHub userBalance={user.wallet.balance + (user.wallet.bonusBalance || 0)} onSpendEAC={spendEAC} />}
          {activeView === 'info' && <InfoPortal />}
        </div>

        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[300] flex flex-col gap-4 pointer-events-none w-full max-sm:max-w-[90%] max-w-sm">
           {notifications.map(n => (
             <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right-8 duration-500">
               <div className={`glass-card p-5 rounded-3xl border-l-4 shadow-2xl flex items-start gap-4 ${
                 n.type === 'success' ? 'border-emerald-500 bg-emerald-500/10' : 
                 n.type === 'error' ? 'border-rose-500 bg-rose-500/10' : 
                 n.type === 'warning' ? 'border-amber-500 bg-amber-500/10' : 
                 'border-blue-500 bg-blue-500/10'
               } backdrop-blur-2xl`}>
                  <div className={`p-2.5 rounded-xl ${
                    n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                    n.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 
                    n.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 
                    n.type === 'blue-500/20 text-blue-400'
                  }`}>
                    {n.type === 'success' ? <CheckCircle2 size={18} /> : 
                     n.type === 'error' ? <AlertTriangle size={18} /> : 
                     n.type === 'warning' ? <AlertCircle size={18} /> : 
                     <Info size={18} />}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white">{n.title}</h5>
                        <span className="text-[8px] font-mono text-slate-500">{n.timestamp}</span>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium italic">"{n.message}"</p>
                     <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full animate-progress-shrink ${
                          n.type === 'success' ? 'bg-emerald-500' : 
                          n.type === 'error' ? 'bg-rose-500' : 
                          'bg-blue-500'
                        }`} style={{ animationDuration: '5s' }}></div>
                     </div>
                  </div>
               </div>
             </div>
           ))}
        </div>
      </main>

      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-20 glass-card border-t border-slate-200 dark:border-white/5 flex items-center justify-around px-4 z-[100] pb-safe bg-white/60 dark:bg-agro-bg/40 backdrop-blur-3xl">
          {navigation.slice(0, 5).map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleNavigate(item.id as ViewState)} 
              className={`flex flex-col items-center gap-1.5 p-2 transition-all ${activeView === item.id ? 'text-emerald-500' : 'text-slate-400'}`}
            >
              <item.icon size={22} className={activeView === item.id ? 'animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.name.split(' ')[0]}</span>
            </button>
          ))}
          <button onClick={() => setShowMobileMenu(true)} className="flex flex-col items-center gap-1.5 p-2 text-slate-400">
            <Layers size={22} />
            <span className="text-[9px] font-black uppercase tracking-widest">Portal</span>
          </button>
        </nav>
      )}

      {showMobileMenu && (
        <div className="fixed inset-0 z-[200] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-agro-bg/90 backdrop-blur-2xl" onClick={() => setShowMobileMenu(false)}></div>
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-sm:max-w-sm dark:bg-agro-bg/60 bg-white/80 shadow-2xl p-8 flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-400 rounded-l-[40px] backdrop-blur-3xl">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  {viewHistory.length > 0 && (
                    <button onClick={handleGoBack} className="p-3 bg-white/10 rounded-full text-slate-400"><ArrowLeft size={20} /></button>
                  )}
                  <h3 className="text-xl font-black uppercase italic tracking-tighter dark:text-white text-slate-900">Registry <span className="text-emerald-500">Nodes</span></h3>
                </div>
                <button onClick={() => setShowMobileMenu(false)} className="p-3 bg-white/10 rounded-full text-slate-600 dark:text-slate-400"><X size={28} /></button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                {navigation.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => { handleNavigate(item.id as ViewState); setShowMobileMenu(false); }} 
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      activeView === item.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'dark:text-slate-400 text-slate-500 hover:bg-slate-500/10'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                  </button>
                ))}
             </div>
             <div className="pt-8 mt-8 border-t border-white/10 space-y-4">
                <button onClick={() => { setIsVoiceBridgeOpen(true); setShowMobileMenu(false); }} className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                   <Mic size={18} /> Initialize Voice
                </button>
                <button onClick={handleLogout} className="w-full py-5 bg-rose-600/10 border border-rose-500/20 rounded-3xl text-rose-500 font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                   <LogOut size={18} /> Detach Node
                </button>
             </div>
          </div>
        </div>
      )}

      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} onClose={() => setIsVoiceBridgeOpen(false)} />
      <EvidenceModal 
        isOpen={isEvidenceModalOpen} 
        onClose={() => setIsEvidenceModalOpen(false)} 
        user={user} 
        onMinted={(val) => earnEAC(val, 'SCIENTIFIC_EVIDENCE_MINT')}
      />
      
      {/* ADDED: Moveable Floating Consultant */}
      <FloatingConsultant user={user} />

      <style>{`
        @keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }
        .animate-progress-shrink { animation: progress-shrink linear forwards; }
      `}</style>
    </div>
  );
};

export default App;
