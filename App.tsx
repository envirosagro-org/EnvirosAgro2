
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Cpu, ShoppingCart, Users, BrainCircuit, Library, Database, Wallet, Leaf, Menu, X, Layers, Radio, ShieldAlert, LogOut, User as UserIcon, Loader2, Camera, CheckCircle2, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Upload, FileText, Power, Bot, AlertCircle, Lock, ArrowRight, Wrench, Mic, Coins, Heart, Activity
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
import LiveVoiceBridge from './components/LiveVoiceBridge';
import { diagnoseCropIssue } from './services/geminiService';
import { syncUserToCloud } from './services/firebaseService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  
  const [economyToast, setEconomyToast] = useState<{ amount: number, label: string } | null>(null);
  
  // Minting Logic States
  const [isMintingModalOpen, setIsMintingModalOpen] = useState(false);
  const [mintingStep, setMintingStep] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [mintResult, setMintResult] = useState<string | null>(null);
  const [calculatedReward, setCalculatedReward] = useState(0);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('agro_steward');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('agro_steward', JSON.stringify(updatedUser));
    await syncUserToCloud(updatedUser);
  };

  const spendEAC = (amount: number, reason: string) => {
    if (!user || user.wallet.balance < amount) {
      alert(`INSUFFICIENT LIQUIDITY: Node treasury requires ${amount} EAC for ${reason.replace(/_/g, ' ')}.`);
      return false;
    }
    const updatedUser: User = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance - amount } };
    handleUpdateUser(updatedUser);
    setEconomyToast({ amount: -amount, label: reason.toUpperCase() });
    setTimeout(() => setEconomyToast(null), 3000);
    return true;
  };

  const handleDepositEAC = (amount: number, gateway: string) => {
    if (!user) return;
    const updatedUser: User = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance + amount } };
    handleUpdateUser(updatedUser);
    setEconomyToast({ amount, label: `DEPOSIT VIA ${gateway}` });
    setTimeout(() => setEconomyToast(null), 3000);
  };

  const processContribution = (type: string, category: string) => {
    if (!user) return;
    const reward = type === 'post' ? 5 : type === 'upload' ? 20 : 50;
    const updatedUser: User = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance + reward } };
    handleUpdateUser(updatedUser);
    setEconomyToast({ amount: reward, label: `${type.toUpperCase()} REWARD` });
    setTimeout(() => setEconomyToast(null), 3000);
  };

  // Shared Minting Logic
  const handleStartMinting = async () => {
    setMintingStep('analyzing');
    // Using Gemini to "verify" the evidence
    try {
      const res = await diagnoseCropIssue(evidenceDesc || "General scientific field evidence.", evidenceFile?.split(',')[1]);
      setMintResult(res.text);
      // Reward based on C(a) logic simulation
      const reward = Math.floor(25 + Math.random() * 75);
      setCalculatedReward(reward);
      setMintingStep('confirm');
    } catch (e) {
      alert("Registry Handshake Error. Retry analysis.");
      setMintingStep('upload');
    }
  };

  const finalizeMinting = () => {
    if (!user) return;
    const updatedUser: User = { 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: user.wallet.balance + calculatedReward,
        lifetimeEarned: user.wallet.lifetimeEarned + calculatedReward
      } 
    };
    handleUpdateUser(updatedUser);
    setMintingStep('success');
    setEconomyToast({ amount: calculatedReward, label: "EVIDENCE MINTED" });
    setTimeout(() => setEconomyToast(null), 3000);
  };

  if (!user) return <Login onLogin={setUser} />;

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
        <div className="fixed top-20 right-10 z-[200] animate-in slide-in-from-top-4 duration-500">
          <div className={`glass-card px-6 py-3 rounded-2xl flex items-center gap-4 border-l-4 shadow-2xl ${economyToast.amount > 0 ? 'border-l-emerald-500 bg-emerald-500/10' : 'border-l-rose-500 bg-rose-500/10'}`}>
            <Zap className={`w-5 h-5 ${economyToast.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
            <div><p className="text-white font-black text-sm uppercase tracking-tighter">{economyToast.label}</p><p className="text-[10px] text-slate-400 font-mono italic">Registry Sync</p></div>
          </div>
        </div>
      )}

      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 glass-card border-r border-white/5 flex flex-col z-50`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 agro-gradient rounded-lg flex items-center justify-center shrink-0 shadow-lg"><Leaf className="text-white w-5 h-5" /></div>{isSidebarOpen && <span className="text-xl font-bold">EnvirosAgro™</span>}</div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white">{isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 mx-auto" />}</button>
        </div>
        <nav className="flex-1 mt-4 space-y-1 px-3 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => (
            <button key={item.id} onClick={() => setActiveView(item.id as ViewState)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeView === item.id ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5 shrink-0" />{isSidebarOpen && <span className="font-medium text-sm text-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-3">
          <button onClick={() => setIsVoiceBridgeOpen(!isVoiceBridgeOpen)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isVoiceBridgeOpen ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}><Mic className="w-5 h-5 shrink-0" />{isSidebarOpen && <span className="font-bold text-xs uppercase">Voice Bridge</span>}</button>
          <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"><LogOut className="w-5 h-5 shrink-0" />{isSidebarOpen && <span className="font-bold text-xs uppercase">Logout</span>}</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative p-6">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-[#050706]/80 backdrop-blur-md z-40 py-3 px-2 rounded-b-3xl border-b border-white/5">
          <div><h1 className="text-2xl font-bold text-white tracking-tight capitalize">{navigation.find(n => n.id === activeView)?.name}</h1><p className="text-slate-500 text-[10px] font-mono flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Registry: {user.esin}</p></div>
          <button onClick={() => setActiveView('wallet')} className={`flex items-center gap-3 glass-card px-5 py-2.5 rounded-full border transition-all ${activeView === 'wallet' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}><div className="flex flex-col items-end"><span className="text-[10px] text-slate-500 font-black uppercase">Treasury</span><span className="text-sm font-mono text-emerald-400 font-bold">{user.wallet.balance.toFixed(2)} EAC</span></div><div className="p-1.5 bg-emerald-500/20 rounded-full"><Wallet className="w-4 h-4 text-emerald-400" /></div></button>
        </header>

        {activeView === 'dashboard' && <Dashboard user={user} onNavigate={setActiveView} />}
        {activeView === 'wallet' && <AgroWallet user={user} onNavigate={setActiveView} />}
        {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={() => setShowLogoutConfirm(true)} />}
        {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} />}
        {activeView === 'vendor' && <VendorPortal user={user} />}
        {activeView === 'ingest' && <NetworkIngest />}
        {activeView === 'sustainability' && <Sustainability onAction={() => setIsMintingModalOpen(true)} />}
        {activeView === 'economy' && <Economy user={user} onMint={() => setIsMintingModalOpen(true)} />}
        {activeView === 'industrial' && <Industrial user={user} onSpendEAC={spendEAC} />}
        {activeView === 'intelligence' && <Intelligence userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
        {activeView === 'tools' && <ToolsSection />}
        {activeView === 'community' && <Community user={user} onContribution={processContribution} onSpendEAC={spendEAC} />}
        {activeView === 'explorer' && <Explorer />}
        {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={handleDepositEAC} />}
        {activeView === 'media' && <MediaHub userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
        {activeView === 'info' && <InfoPortal />}
      </main>

      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} onClose={() => setIsVoiceBridgeOpen(false)} />

      {/* Minting Evidence Modal */}
      {isMintingModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setIsMintingModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[56px] border-emerald-500/20 overflow-hidden shadow-2xl bg-[#050706]">
            <div className="p-10 bg-emerald-600/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-xl">
                    <Microscope className="w-8 h-8 text-emerald-400" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mint <span className="text-emerald-400">Evidence</span></h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Industrial Registry v3.2</p>
                 </div>
              </div>
              <button onClick={() => setIsMintingModalOpen(false)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
            </div>

            <div className="p-12 min-h-[400px] flex flex-col justify-center">
              {mintingStep === 'upload' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                  <div 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="p-16 border-4 border-dashed border-white/5 rounded-[48px] bg-white/[0.01] flex flex-col items-center text-center group hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] cursor-pointer transition-all"
                  >
                    <input type="file" id="file-upload" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setEvidenceFile(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    {evidenceFile ? (
                      <div className="space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                        <p className="text-white font-bold uppercase tracking-widest">Scientific Shard Loaded</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Upload className="w-16 h-16 text-slate-700 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                        <div>
                          <p className="text-xl font-bold text-white uppercase tracking-tight">Ingest Field Telemetry</p>
                          <p className="text-slate-500 text-sm mt-2 italic">Support: Spectral PDF, Soil CSV, Crop Scans (JPG/PNG)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Evidence Context</label>
                    <textarea 
                      value={evidenceDesc}
                      onChange={(e) => setEvidenceDesc(e.target.value)}
                      placeholder="Explain the regenerative practice or scientific outcome..."
                      className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 text-white text-sm h-32 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <button 
                    onClick={handleStartMinting}
                    disabled={!evidenceFile}
                    className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl disabled:opacity-30"
                  >
                    INITIALIZE AI VALIDATION
                  </button>
                </div>
              )}

              {mintingStep === 'analyzing' && (
                <div className="flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                    <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-2xl">
                       <Bot className="w-12 h-12 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Registry Oracle <span className="text-emerald-400">Auditing</span></h3>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-[0.4em] animate-pulse">Running SEHTI Consistency Check...</p>
                  </div>
                </div>
              )}

              {mintingStep === 'confirm' && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-8 glass-card rounded-[40px] border-l-4 border-emerald-500/50 bg-emerald-950/10 space-y-6">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-emerald-400" />
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Oracle Validation Shard</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-slate-300 italic text-lg leading-relaxed whitespace-pre-line border-l border-white/10 pl-6">
                       {mintResult}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="p-8 bg-black/60 rounded-[32px] border border-white/5 space-y-2 text-center">
                        <p className="text-[10px] text-slate-500 font-black uppercase mb-1">C(a) Impact</p>
                        <p className="text-3xl font-mono font-black text-white">+1.42x</p>
                     </div>
                     <div className="p-8 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20 space-y-2 text-center">
                        <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">EAC Reward</p>
                        <p className="text-3xl font-mono font-black text-emerald-400">+{calculatedReward}</p>
                     </div>
                  </div>
                  <button 
                    onClick={finalizeMinting}
                    className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6"
                  >
                    <Coins className="w-8 h-8" /> SETTLE & MINT EAC
                  </button>
                </div>
              )}

              {mintingStep === 'success' && (
                <div className="flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                  <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                     <CheckCircle2 className="w-20 h-20 text-white" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Shard Committed</h3>
                     <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]">Treasury Synchronized // Shard Hash 0x882...</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMintingModalOpen(false);
                      setMintingStep('upload');
                      setEvidenceFile(null);
                      setEvidenceDesc('');
                    }} 
                    className="w-full py-8 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all"
                  >
                    Dismiss Ingest Terminal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="relative z-10 w-full max-w-md glass-card p-10 rounded-[44px] border-rose-500/20 bg-rose-950/20 text-center space-y-8">
            <div className="w-20 h-20 bg-rose-500/10 rounded-[32px] flex items-center justify-center border border-rose-500/40 mx-auto"><Power className="w-10 h-10 text-rose-500" /></div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Terminate Session?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={() => { localStorage.removeItem('agro_steward'); window.location.reload(); }} className="flex-1 py-4 bg-rose-600 rounded-2xl text-white font-black text-xs uppercase hover:bg-rose-500 transition-all shadow-xl">Terminate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Re-using Microscope icon for Ingest
const Microscope = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 18c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3Z"/><path d="M12 18h9"/><path d="M16 12l2 2"/><path d="M9 12l3 3"/><path d="M10 5l4 4"/><path d="M15 2l5 5"/>
  </svg>
);

export default App;
