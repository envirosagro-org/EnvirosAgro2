
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Cpu, ShoppingCart, Users, BrainCircuit, Library, Database, Wallet, Leaf, Menu, X, Layers, Radio, ShieldAlert, LogOut, User as UserIcon, Loader2, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Upload, Power, Mic, Coins, Activity, Globe, Share2, Server, Terminal, Shield, ExternalLink, Moon, Sun, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, ArrowLeft, CheckCircle2, AlertCircle, Info, Timer, AlertTriangle, Microscope, UserPlus, Handshake, Sprout, Briefcase
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
    if (action) setPendingAction(action);
    setViewHistory(prev => [...prev, activeView]);
    setActiveView(newView);
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
        <header className="flex justify-between items-center sticky top-0 bg-white/80 dark:bg-agro-bg/80 backdrop-blur-xl z-40 py-4 px-6 md:px-10 border-b border-slate-200 dark:border-white/5">
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
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none dark:text-white text-slate-900">
                {navigation.find(n => n.id === activeView)?.name}
              </h1>
              <p className="hidden md:block text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1 opacity-60">Node: {user.esin}</p>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 px-6 border-l border-slate-200 dark:border-white/5 ml-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Global Consensus</span>
                <span className="text-[10px] font-mono font-black text-emerald-500">100% VERIFIED</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center glass-card p-1 rounded-2xl border-slate-200 dark:border-white/5">
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Dark Mode"
              >
                <Moon size={18} />
              </button>
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${theme === 'light' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Light Mode"
              >
                <Sun size={18} />
              </button>
            </div>

            <button onClick={() => handleNavigate('wallet')} className="flex items-center gap-4 glass-card px-4 py-2 rounded-2xl border-emerald-500/20 hover:bg-emerald-500/5 transition-all group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Treasury</span>
                <span className="text-lg font-mono font-black dark:text-white text-slate-900">{(user.wallet.balance + (user.wallet.bonusBalance || 0)).toFixed(0)} <span className="text-xs text-emerald-500">EAC</span></span>
              </div>
              <div className="p-2.5 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500 transition-colors group-hover:text-white text-emerald-500">
                <Wallet size={20} />
              </div>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 relative overflow-x-hidden scrollbar-hide">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />}
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
          {activeView === 'live_farming' && <LiveFarming user={user} onEarnEAC={earnEAC} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} onSpendEAC={spendEAC} />}
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
                 n.type === 'success' ? 'border-emerald-500 bg-emerald-500/5' : 
                 n.type === 'error' ? 'border-rose-500 bg-rose-500/5' : 
                 n.type === 'warning' ? 'border-amber-500 bg-amber-500/5' : 
                 'border-blue-500 bg-blue-500/5'
               }`}>
                  <div className={`p-2.5 rounded-xl ${
                    n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                    n.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 
                    n.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 
                    'bg-blue-500/20 text-blue-400'
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
        <nav className="fixed bottom-0 left-0 right-0 h-20 glass-card border-t border-slate-200 dark:border-white/5 flex items-center justify-around px-4 z-[100] pb-safe bg-white/80 dark:bg-agro-bg/80 backdrop-blur-3xl">
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
          <div className="absolute inset-0 bg-agro-bg/95 backdrop-blur-2xl" onClick={() => setShowMobileMenu(false)}></div>
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-sm:max-w-sm dark:bg-agro-bg bg-white shadow-2xl p-8 flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-400 rounded-l-[40px]">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  {viewHistory.length > 0 && (
                    <button onClick={handleGoBack} className="p-3 bg-white/5 rounded-full text-slate-400"><ArrowLeft size={20} /></button>
                  )}
                  <h3 className="text-xl font-black uppercase italic tracking-tighter dark:text-white text-slate-900">Registry <span className="text-emerald-500">Nodes</span></h3>
                </div>
                <button onClick={() => setShowMobileMenu(false)} className="p-3 bg-white/5 rounded-full text-slate-600 dark:text-slate-400"><X size={28} /></button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                {navigation.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => { handleNavigate(item.id as ViewState); setShowMobileMenu(false); }} 
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      activeView === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'dark:text-slate-400 text-slate-500 hover:bg-slate-500/5'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                  </button>
                ))}
             </div>
             <div className="pt-8 mt-8 border-t border-white/5 space-y-4">
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

      <style>{`
        @keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }
        .animate-progress-shrink { animation: progress-shrink linear forwards; }
      `}</style>
    </div>
  );
};

export default App;
