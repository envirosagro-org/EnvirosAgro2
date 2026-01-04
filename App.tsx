
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
  Sparkles,
  Upload,
  FileText,
  BarChart3,
  /* Added missing Bot icon */
  Bot
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
  const [mintingStep, setMintingStep] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [mintResult, setMintResult] = useState<string | null>(null);
  const [calculatedReward, setCalculatedReward] = useState(0);

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
   * DEPOSIT ENGINE
   */
  const handleDepositEAC = (amount: number, gateway: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + (amount * 0.1) // Bonus for network liquidity
      }
    };
    handleUpdateUser(updatedUser);
    triggerEconomyToast(amount, `+${amount} EAC MINTED VIA ${gateway}`);
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

  // EVIDENCE MINTING FLOW
  const handleStartMinting = async () => {
    if (!evidenceDesc.trim()) return;
    setMintingStep('analyzing');
    
    // Gemini Evidence Analysis
    const response = await diagnoseCropIssue(evidenceDesc);
    setMintResult(response.text);
    
    // EOS Framework Reward Calculation: Reward = Base(25) * Multiplier(m, Ca)
    const ca = user?.metrics.agriculturalCodeU || 1.0;
    const m = user?.metrics.timeConstantTau || 1.0;
    const multiplier = 1 + (Math.log10(ca * m + 1) / 5);
    setCalculatedReward(Math.round(25 * multiplier));
    
    setMintingStep('confirm');
  };

  const finalizeMinting = () => {
    if (!user) return;
    const amount = calculatedReward;
    const updatedUser: User = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + amount
      }
    };
    handleUpdateUser(updatedUser);
    setMintingStep('success');
    triggerEconomyToast(amount, `+${amount} EAC MINTED: EVIDENCE CERTIFIED`);
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
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={(view) => setActiveView(view)} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} />}
          {activeView === 'vendor' && <VendorPortal user={user} />}
          {activeView === 'ingest' && <NetworkIngest />}
          {activeView === 'sustainability' && <Sustainability onAction={() => { setMintingStep('upload'); setIsMintingModalOpen(true); }} />}
          {activeView === 'economy' && <Economy user={user} onMint={() => { setMintingStep('upload'); setIsMintingModalOpen(true); }} />}
          {activeView === 'industrial' && <Industrial user={user} onSpendEAC={spendEAC} />}
          {activeView === 'intelligence' && <Intelligence />}
          {activeView === 'community' && <Community user={user} onContribution={processContribution} onSpendEAC={spendEAC} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={handleDepositEAC} />}
          {activeView === 'media' && <MediaHub />}
          {activeView === 'info' && <InfoPortal />}
        </div>
      </main>

      {/* GLOBAL EVIDENCE MINTING MODAL */}
      {isMintingModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setIsMintingModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-4xl glass-card rounded-[48px] border-emerald-500/20 overflow-hidden flex flex-col shadow-2xl bg-[#050706]">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-emerald-600/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                  <Camera className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Evidence <span className="text-emerald-400">Minting</span></h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Direct Reward Engine • EOS Framework</p>
                </div>
              </div>
              <button onClick={() => setIsMintingModalOpen(false)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-10">
              {mintingStep === 'upload' && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2"><Upload className="w-5 h-5 text-emerald-400" /> Field Upload</h3>
                       <div className="aspect-square glass-card rounded-[40px] border-2 border-dashed border-emerald-500/20 flex flex-col items-center justify-center text-center p-10 group hover:border-emerald-500/40 transition-all cursor-pointer">
                          <Camera className="w-12 h-12 text-slate-700 group-hover:text-emerald-400 transition-colors mb-4" />
                          <p className="text-sm font-bold text-white">Capture / Upload Proof</p>
                          <p className="text-[10px] text-slate-500 mt-2">Spectral Scan, Soil Log, or Photo Evidence</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Scientific Context</h3>
                       <textarea 
                        value={evidenceDesc}
                        onChange={e => setEvidenceDesc(e.target.value)}
                        placeholder="Describe the regenerative practices observed. Mention specific metrics like pH, nitrogen levels, or moisture retention..."
                        className="w-full h-[300px] bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
                       />
                    </div>
                  </div>
                  <button 
                    onClick={handleStartMinting}
                    disabled={!evidenceDesc.trim()}
                    className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                  >
                    <Sparkles className="w-5 h-5" /> Run AI Certification
                  </button>
                </div>
              )}

              {mintingStep === 'analyzing' && (
                <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in zoom-in duration-500 text-center">
                   <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-emerald-500/10 flex items-center justify-center">
                         <Bot className="w-16 h-16 text-emerald-400 animate-pulse" />
                      </div>
                      <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Gemini Analyzing...</h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto uppercase tracking-widest">Cross-referencing evidence with EOS sustainability equations.</p>
                   </div>
                </div>
              )}

              {mintingStep === 'confirm' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="p-10 glass-card rounded-[40px] bg-emerald-500/5 border-l-4 border-emerald-500/50">
                      <div className="flex items-center gap-4 mb-6">
                         <ShieldCheck className="w-8 h-8 text-emerald-400" />
                         <h4 className="text-xl font-bold text-white uppercase tracking-widest">Certification Report</h4>
                      </div>
                      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed italic whitespace-pre-line overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
                         {mintResult}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-8 glass-card rounded-[32px] border-white/5 text-center">
                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Base Reward</p>
                         <p className="text-2xl font-mono font-black text-white">25 EAC</p>
                      </div>
                      <div className="p-8 glass-card rounded-[32px] border-white/5 text-center">
                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">EOS Multiplier</p>
                         <p className="text-2xl font-mono font-black text-blue-400">{(calculatedReward / 25).toFixed(2)}x</p>
                      </div>
                      <div className="p-8 glass-card rounded-[32px] border-emerald-500/20 bg-emerald-500/5 text-center">
                         <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">Final Mint</p>
                         <p className="text-3xl font-mono font-black text-emerald-400">{calculatedReward} EAC</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button onClick={() => setMintingStep('upload')} className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Revise Evidence</button>
                      <button 
                        onClick={finalizeMinting}
                        className="flex-[2] py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <Zap className="w-6 h-6 fill-current" /> Sign & Mint EAC
                      </button>
                   </div>
                </div>
              )}

              {mintingStep === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 animate-in zoom-in duration-700 text-center">
                   <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                      <CheckCircle2 className="w-16 h-16 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter">EAC Tokens Minted</h3>
                      <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Transaction Indexed on Industrial Ledger</p>
                   </div>
                   <div className="w-full glass-card p-10 rounded-[48px] border-white/5 bg-emerald-500/5 space-y-4 text-left max-w-lg">
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 font-black uppercase">Minted Balance</span>
                         <span className="text-emerald-400 font-mono font-bold">+{calculatedReward} EAC</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 font-black uppercase">Registry Path</span>
                         <span className="text-white font-mono text-[11px]">0x{Math.random().toString(16).slice(2, 14).toUpperCase()}...</span>
                      </div>
                   </div>
                   <button onClick={() => setIsMintingModalOpen(false)} className="w-full max-w-lg py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss Portal</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
