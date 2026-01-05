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
  Menu,
  X,
  Layers,
  Radio,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  Loader2,
  Camera,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Landmark,
  Store,
  Cable,
  Sparkles,
  Upload,
  FileText,
  Power,
  ShieldX,
  Bot,
  AlertCircle,
  Scan,
  Lock,
  ArrowRight,
  Wrench
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
import ToolsSection from './components/ToolsSection';
import { diagnoseCropIssue } from './services/geminiService';
import { syncUserToCloud } from './services/firebaseService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [economyToast, setEconomyToast] = useState<{ amount: number, label: string } | null>(null);
  const [isMintingModalOpen, setIsMintingModalOpen] = useState(false);
  const [mintingStep, setMintingStep] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [mintResult, setMintResult] = useState<string | null>(null);
  const [calculatedReward, setCalculatedReward] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDeRegistering, setIsDeRegistering] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('agro_steward');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('agro_steward', JSON.stringify(updatedUser));
    await syncUserToCloud(updatedUser);
  };

  const handleDepositEAC = (amount: number, gateway: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + (amount * 0.1)
      }
    };
    handleUpdateUser(updatedUser);
    triggerEconomyToast(amount, `+${amount} EAC MINTED VIA ${gateway}`);
  };

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
    const totalPoints = (Object.values(updatedSkills) as number[]).reduce((a, b) => (a as number) + (b as number), 0);
    const isReady = totalPoints >= 100;
    const newLifetime = user.wallet.lifetimeEarned + eacReward;
    let newTier = user.wallet.tier;
    if (newLifetime >= 2000) newTier = 'Harvest';
    else if (newLifetime >= 500) newTier = 'Sprout';
    const updatedUser: User = {
      ...user,
      skills: updatedSkills,
      isReadyForHire: isReady,
      wallet: { ...user.wallet, balance: user.wallet.balance + eacReward, lifetimeEarned: newLifetime, tier: newTier }
    };
    handleUpdateUser(updatedUser);
    triggerEconomyToast(eacReward, `+${eacReward} EAC: ${type.toUpperCase()}`);
  };

  const spendEAC = (amount: number, reason: string) => {
    if (!user || user.wallet.balance < amount) {
      alert("INSUFFICIENT LIQUIDITY: Node treasury requires more EAC.");
      return false;
    }
    const updatedUser: User = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance - amount } };
    handleUpdateUser(updatedUser);
    triggerEconomyToast(-amount, `-${amount} EAC: ${reason.toUpperCase()}`);
    return true;
  };

  const triggerEconomyToast = (amount: number, label: string) => {
    setEconomyToast({ amount, label });
    setTimeout(() => setEconomyToast(null), 3000);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('agro_steward', JSON.stringify(newUser));
  };

  const executeLogout = () => {
    setIsDeRegistering(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('agro_steward');
      setActiveView('dashboard');
      setIsDeRegistering(false);
      setShowLogoutConfirm(false);
    }, 2000);
  };

  const handleStartMinting = async () => {
    if (!evidenceDesc.trim()) return;
    setMintingStep('analyzing');
    try {
      const response = await diagnoseCropIssue(evidenceDesc);
      setMintResult(response.text);
      const reward = Math.floor(40 + Math.random() * 60);
      setCalculatedReward(reward);
      setMintingStep('confirm');
    } catch (error) {
      setMintingStep('upload');
      alert("Oracle connection failed. Try again.");
    }
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

  const closeMintingModal = () => {
    setIsMintingModalOpen(false);
    setMintingStep('upload');
    setEvidenceDesc('');
    setMintResult(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

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
    { id: 'tools', name: 'Integrated Tools', icon: Wrench },
    { id: 'media', name: 'Media Hub', icon: Radio },
    { id: 'community', name: 'Learning Hub', icon: Library },
    { id: 'ecosystem', name: 'Ecosystem Brands', icon: Layers },
    { id: 'explorer', name: 'Ledger Registry', icon: Database },
    { id: 'info', name: 'Governance & Info', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050706] text-slate-200 font-sans relative">
      {economyToast && (
        <div className="fixed top-20 right-10 z-[200] animate-in slide-in-from-top-4 duration-500 pointer-events-none">
          <div className={`glass-card px-6 py-3 rounded-2xl flex items-center gap-4 border-l-4 shadow-2xl ${economyToast.amount > 0 ? 'border-l-emerald-500 bg-emerald-500/10' : 'border-l-rose-500 bg-rose-500/10'}`}>
            <Zap className={`w-5 h-5 ${economyToast.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tighter">{economyToast.label}</p>
              <p className="text-[10px] text-slate-400 font-mono italic">Cloud Index Active</p>
            </div>
          </div>
        </div>
      )}

      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 glass-card border-r border-white/5 flex flex-col z-50`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 agro-gradient rounded-lg flex items-center justify-center shrink-0 shadow-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight">EnvirosAgro™</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white">
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
          <button onClick={() => setShowLogoutConfirm(true)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative p-6 scroll-smooth">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-[#050706]/80 backdrop-blur-md z-40 py-3 px-2 rounded-b-3xl border-b border-white/5">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
                {navigation.find(n => n.id === activeView)?.name}
              </h1>
              <p className="text-slate-500 text-[10px] font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                EnvirosAgro™ Cloud Registry: {user.esin}
              </p>
            </div>
          </div>
          <button onClick={() => setActiveView('wallet')} className={`flex items-center gap-3 glass-card px-5 py-2.5 rounded-full border transition-all ${activeView === 'wallet' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-black uppercase">Node Treasury</span>
              <span className="text-sm font-mono text-emerald-400 font-bold">{user.wallet.balance.toFixed(2)} EAC</span>
            </div>
            <div className="p-1.5 bg-emerald-500/20 rounded-full">
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
          </button>
        </header>

        <div className="animate-in fade-in duration-500">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={(view) => setActiveView(view)} />}
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={(view) => setActiveView(view)} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={() => setShowLogoutConfirm(true)} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} />}
          {activeView === 'vendor' && <VendorPortal user={user} />}
          {activeView === 'ingest' && <NetworkIngest />}
          {activeView === 'sustainability' && <Sustainability onAction={() => { setMintingStep('upload'); setIsMintingModalOpen(true); }} />}
          {activeView === 'economy' && <Economy user={user} onMint={() => { setMintingStep('upload'); setIsMintingModalOpen(true); }} />}
          {activeView === 'industrial' && <Industrial user={user} onSpendEAC={spendEAC} />}
          {activeView === 'intelligence' && <Intelligence />}
          {activeView === 'tools' && <ToolsSection />}
          {activeView === 'community' && <Community user={user} onContribution={processContribution} onSpendEAC={spendEAC} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={handleDepositEAC} />}
          {activeView === 'media' && <MediaHub />}
          {activeView === 'info' && <InfoPortal />}
        </div>
      </main>

      {/* Evidence Minting Modal */}
      {isMintingModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={closeMintingModal}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[56px] border-emerald-500/20 bg-black/40 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-emerald-600/5">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                       <Upload className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mint <span className="text-emerald-400">Evidence</span></h3>
                       <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Proof of Sustainability Protocol v3.2</p>
                    </div>
                 </div>
                 <button onClick={closeMintingModal} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 {mintingStep === 'upload' && (
                   <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                      <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                        Submit field observations, spectral telemetry, or soil health records to the EOS ledger to mint regenerative equity (EAC).
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Telemetry Description</label>
                            <textarea 
                             value={evidenceDesc}
                             onChange={(e) => setEvidenceDesc(e.target.value)}
                             placeholder="Describe the scientific data point or observation..."
                             className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-sm focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all resize-none h-48"
                            />
                         </div>
                         <div className="space-y-6 flex flex-col justify-center">
                            <div className="p-8 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-500/40 transition-all group cursor-pointer h-48">
                               <Camera className="w-10 h-10 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attach Spectral Capture</p>
                            </div>
                            <div className="flex items-center gap-3 px-4">
                               <Lock className="w-4 h-4 text-emerald-500" />
                               <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">End-to-End ZK Encryption</span>
                            </div>
                         </div>
                      </div>

                      <button 
                       onClick={handleStartMinting}
                       disabled={!evidenceDesc.trim()}
                       className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                      >
                         <Zap className="w-6 h-6 fill-current" /> Initialize Verification Sweep
                      </button>
                   </div>
                 )}

                 {mintingStep === 'analyzing' && (
                   <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in zoom-in duration-500">
                      <div className="relative">
                         <div className="w-32 h-32 rounded-full border-4 border-emerald-500/10 flex items-center justify-center">
                            <Bot className="w-12 h-12 text-emerald-400 animate-pulse" />
                         </div>
                         <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                      </div>
                      <div className="text-center space-y-2">
                         <h4 className="text-2xl font-bold text-white uppercase tracking-widest">Consulting Oracle...</h4>
                         <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Running SEHTI Scientific Check</p>
                      </div>
                   </div>
                 )}

                 {mintingStep === 'confirm' && (
                   <div className="space-y-8 animate-in slide-in-from-right duration-500">
                      <div className="p-8 glass-card rounded-[40px] bg-white/[0.01] border-l-4 border-emerald-500/50">
                         <div className="flex items-center gap-3 mb-6">
                            <Bot className="w-5 h-5 text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Diagnostic Report</span>
                         </div>
                         <div className="prose prose-invert prose-emerald max-w-none text-slate-300 italic text-sm leading-relaxed whitespace-pre-line">
                            {mintResult}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="p-8 glass-card rounded-[40px] border-emerald-500/20 bg-emerald-500/5 space-y-2 text-center group hover:bg-emerald-500/10 transition-all">
                            <p className="text-[10px] text-slate-500 font-black uppercase">Mintable Reward</p>
                            <h4 className="text-4xl font-black text-white font-mono">{calculatedReward} <span className="text-xs text-emerald-500">EAC</span></h4>
                            <p className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest mt-2">Verified Performance Boost</p>
                         </div>
                         <div className="space-y-4 flex flex-col justify-center">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium italic">"This evidence is enqueued for verification on the EOS Mainnet. Your steward standing will increase."</p>
                            <div className="flex gap-4">
                               <button onClick={() => setMintingStep('upload')} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard</button>
                               <button onClick={finalizeMinting} className="flex-[2] py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                  <ShieldCheck className="w-4 h-4" /> Mint Asset
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {mintingStep === 'success' && (
                   <div className="flex flex-col items-center justify-center py-12 space-y-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                         <CheckCircle2 className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Evidence Certified</h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Asset Indexed // Registry Sync Success</p>
                      </div>
                      <button onClick={closeMintingModal} className="w-full max-w-md py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Return to Hub</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => !isDeRegistering && setShowLogoutConfirm(false)}></div>
          <div className="relative z-10 w-full max-w-md glass-card p-10 rounded-[44px] border-rose-500/20 bg-rose-950/20 overflow-hidden shadow-2xl text-center space-y-8">
            {isDeRegistering ? (
              <div className="py-10 space-y-6 animate-in zoom-in duration-500">
                <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase">De-Registering...</h3>
                  <p className="text-rose-400/60 font-mono text-[10px] tracking-widest uppercase animate-pulse">Safely clearing registry shards</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-rose-500/10 rounded-[32px] flex items-center justify-center border border-rose-500/40 mx-auto">
                   <Power className="w-10 h-10 text-rose-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Terminate Session?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You are about to sign out from node <strong>{user.esin}</strong>. Your session keys will be cleared from this local hardware instance.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                  <button onClick={executeLogout} className="flex-1 py-4 bg-rose-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/40 hover:bg-rose-500 transition-all">Terminate</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;