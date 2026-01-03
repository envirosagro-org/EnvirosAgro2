
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  ShoppingCart, 
  Users, 
  BrainCircuit, 
  Library,
  Database,
  Wallet,
  Leaf,
  Bell,
  PlusCircle,
  Menu,
  X,
  Layers,
  Radio,
  ShieldAlert,
  LogOut,
  Settings,
  AlertTriangle,
  User as UserIcon,
  Loader2,
  Camera,
  CheckCircle2,
  Zap,
  Globe,
  ShieldCheck,
  ArrowRight,
  Landmark,
  Store,
  Cable,
  Sparkles
} from 'lucide-react';
import { ViewState, User } from './types';
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
import { diagnoseCropIssue } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Economy Toast State
  const [economyToast, setEconomyToast] = useState<{ amount: number, label: string } | null>(null);

  // Minting Action State
  const [isMintingModalOpen, setIsMintingModalOpen] = useState(false);

  // Load session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('agro_steward');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('agro_steward', JSON.stringify(updatedUser));
    
    // Also update in registry
    const registry = JSON.parse(localStorage.getItem('agro_users') || '[]');
    const index = registry.findIndex((u: User) => u.esin === updatedUser.esin);
    if (index !== -1) {
      registry[index] = updatedUser;
      localStorage.setItem('agro_users', JSON.stringify(registry));
    }
  };

  /**
   * PROOF OF CONTRIBUTION ENGINE
   */
  const processContribution = (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => {
    if (!user) return;

    let eacReward = 0;
    let skillPoints = 0;

    switch (type) {
      case 'post': eacReward = 5; skillPoints = 2; break;
      case 'upload': eacReward = 20; skillPoints = 10; break;
      case 'module': eacReward = 100; skillPoints = 20; break;
      case 'quiz': eacReward = 50; skillPoints = 15; break;
    }

    const updatedSkills = { ...user.skills };
    updatedSkills[category] = (updatedSkills[category] || 0) + skillPoints;

    const totalPoints = (Object.values(updatedSkills) as number[]).reduce((a, b) => a + b, 0);
    const isReady = totalPoints >= 100;

    const newLifetime = user.wallet.lifetimeEarned + eacReward;
    
    let newTier = user.wallet.tier;
    if (newLifetime >= 2000) newTier = 'Harvest';
    else if (newLifetime >= 500) newTier = 'Sprout';

    const updatedUser: User = {
      ...user,
      skills: updatedSkills,
      isReadyForHire: isReady,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + eacReward,
        lifetimeEarned: newLifetime,
        tier: newTier
      }
    };

    handleUpdateUser(updatedUser);
    triggerEconomyToast(eacReward, `+${eacReward} EAC: ${type.toUpperCase()}`);
  };

  /**
   * SPENDING ENGINE
   */
  const spendEAC = (amount: number, reason: string) => {
    if (!user || user.wallet.balance < amount) {
      alert("INSUFFICIENT LIQUIDITY: Node treasury requires more EAC.");
      return false;
    }

    const updatedUser: User = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance - amount
      }
    };

    handleUpdateUser(updatedUser);
    triggerEconomyToast(-amount, `-${amount} EAC: ${reason.toUpperCase()}`);
    return true;
  };

  const triggerEconomyToast = (amount: number, label: string) => {
    setEconomyToast({ amount, label });
    setTimeout(() => setEconomyToast(null), 3000);
  };

  const handleLogin = (newUser: User) => {
    const structuredUser = {
      ...newUser,
      skills: newUser.skills || { 'General': 10 },
      isReadyForHire: newUser.isReadyForHire || false
    };
    setUser(structuredUser);
    localStorage.setItem('agro_steward', JSON.stringify(structuredUser));
  };

  const handleLogout = () => {
    if (window.confirm("TERMINATE SESSION: This will unbind your active node from the current hardware relay. Proceed?")) {
      setUser(null);
      localStorage.removeItem('agro_steward');
      setActiveView('dashboard');
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    
    // Purge from Registry
    const registry = JSON.parse(localStorage.getItem('agro_users') || '[]');
    const updatedRegistry = registry.filter((u: User) => u.esin !== user.esin);
    localStorage.setItem('agro_users', JSON.stringify(updatedRegistry));
    
    // Purge current session
    setUser(null);
    localStorage.removeItem('agro_steward');
    setActiveView('dashboard');
    alert("NODE PURGED: Your identity and EAC balance have been removed from the local registry.");
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const navigation = [
    { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
    { id: 'wallet', name: 'Agro-Wallet', icon: Wallet },
    { id: 'profile', name: 'Steward Profile', icon: UserIcon },
    { id: 'investor', name: 'Investor Portal', icon: Landmark },
    { id: 'vendor', name: 'Vendor Portal', icon: Store },
    { id: 'ingest', name: 'Network Ingest', icon: Cable },
    { id: 'sustainability', name: 'Science & IoT', icon: Cpu },
    { id: 'economy', name: 'Market & Mining', icon: ShoppingCart },
    { id: 'industrial', name: 'Industrial Cloud', icon: Users },
    { id: 'intelligence', name: 'EOS Intelligence', icon: BrainCircuit },
    { id: 'media', name: 'Media Hub', icon: Radio },
    { id: 'community', name: 'Learning Hub', icon: Library },
    { id: 'ecosystem', name: 'Ecosystem Brands', icon: Layers },
    { id: 'explorer', name: 'Ledger Registry', icon: Database },
    { id: 'info', name: 'Governance & Info', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050706] text-slate-200 font-sans relative">
      
      {/* Economy Toast Notification */}
      {economyToast && (
        <div className="fixed top-20 right-10 z-[200] animate-in slide-in-from-top-4 duration-500 pointer-events-none">
          <div className={`glass-card px-6 py-3 rounded-2xl flex items-center gap-4 border-l-4 shadow-2xl ${economyToast.amount > 0 ? 'border-l-emerald-500 bg-emerald-500/10' : 'border-l-rose-500 bg-rose-500/10'}`}>
            <Zap className={`w-5 h-5 ${economyToast.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tighter">{economyToast.label}</p>
              <p className="text-[10px] text-slate-400 font-mono">Registry Sync Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 glass-card border-r border-white/5 flex flex-col z-50`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 agro-gradient rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Leaf className="text-white w-5 h-5" />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight text-nowrap">EnvirosAgro</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white transition-colors">
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-1 px-3 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewState)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm text-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className={`p-3 bg-white/[0.02] rounded-xl flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
             {isSidebarOpen && (
               <div className="flex-1">
                  <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase">
                     <span>{user.wallet.tier} Node</span>
                     <span>{Math.floor((user.wallet.lifetimeEarned % 500) / 5)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                     <div className="h-full agro-gradient" style={{ width: `${(user.wallet.lifetimeEarned % 500) / 5}%` }}></div>
                  </div>
               </div>
             )}
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center gap-3 p-3 glass-card rounded-xl transition-all ${!isSidebarOpen && 'justify-center'} ${activeView === 'profile' ? 'border-emerald-500 bg-emerald-500/10' : 'hover:bg-white/5'}`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                <span className="text-xs font-bold text-emerald-400">{user.name[0]}</span>
              </div>
              {isSidebarOpen && (
                <div className="min-w-0 text-left flex-1">
                  <p className="text-xs font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-emerald-500 font-mono truncate uppercase tracking-tighter">Verified Node</p>
                </div>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 ${!isSidebarOpen && 'justify-center'}`}
              title="Terminate Session"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-6 scroll-smooth">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-[#050706]/80 backdrop-blur-md z-40 py-3 px-2 rounded-b-3xl border-b border-white/5">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
                {navigation.find(n => n.id === activeView)?.name}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-slate-500 text-[10px] font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                  EOS ID: {user.esin}
                </p>
                {user.isReadyForHire && (
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/20 animate-pulse">Ready For Hire</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView('wallet')}
              className={`flex items-center gap-3 glass-card px-5 py-2.5 rounded-full border transition-all ${activeView === 'wallet' ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-900/40' : 'border-white/10 hover:border-white/20'}`}
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Node Balance</span>
                <span className="text-sm font-mono text-emerald-400 font-bold">{user.wallet.balance.toFixed(2)} EAC</span>
              </div>
              <div className="p-1.5 bg-emerald-500/20 rounded-full">
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
            </button>
          </div>
        </header>

        <div className="animate-in fade-in duration-500">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={(view) => setActiveView(view)} />}
          {activeView === 'wallet' && <AgroWallet user={user} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} />}
          {activeView === 'vendor' && <VendorPortal user={user} />}
          {activeView === 'ingest' && <NetworkIngest />}
          {activeView === 'sustainability' && <Sustainability onAction={() => setIsMintingModalOpen(true)} />}
          {activeView === 'economy' && <Economy user={user} />}
          {activeView === 'industrial' && <Industrial user={user} onSpendEAC={spendEAC} />}
          {activeView === 'intelligence' && <Intelligence />}
          {activeView === 'community' && <Community user={user} onContribution={processContribution} onSpendEAC={spendEAC} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'ecosystem' && <Ecosystem />}
          {activeView === 'media' && <MediaHub />}
          {activeView === 'info' && <InfoPortal />}
        </div>
      </main>
    </div>
  );
};

export default App;
