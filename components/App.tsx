
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Cpu, ShoppingCart, Users, BrainCircuit, Library, Database, Wallet, Leaf, Menu, X, Layers, Radio, ShieldAlert, LogOut, User as UserIcon, Loader2, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Upload, Power, Mic, Coins, Activity, Globe, Share2, Server, Terminal, Shield, ExternalLink, Moon, Sun, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info, Timer, AlertTriangle, Microscope, UserPlus, Handshake, Sprout, Briefcase, PawPrint, UserCircle, BellRing, Settings2, Bot, Fingerprint, Network, Binary, TrendingUp, Maximize, Minimize, Baby, HeartPulse, SearchCode, Command, Play, Newspaper, Film, Pickaxe, HardHat,
  Trash2,
  Inbox
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
import Impact from './components/Impact';
import { syncUserToCloud } from './services/firebaseService';

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

const BASE_EXCHANGE_RATE = 100.0;
const PENALTY_FACTOR = 10.0;

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [showSignalDropdown, setShowSignalDropdown] = useState(false);
  
  const [networkSignals, setNetworkSignals] = useState<SignalShard[]>([
    { 
      id: 'SIG-001', 
      type: 'system', 
      title: 'Registry Ingest Success', 
      message: 'Center Gate has synchronized your node metrics to the global shard.', 
      timestamp: '10m ago', 
      read: false, 
      priority: 'high' 
    },
    { 
      id: 'SIG-002', 
      type: 'engagement', 
      title: 'Vouch Request', 
      message: 'A new steward node is requesting a trust vouch for Tier 2 access.', 
      timestamp: '45m ago', 
      read: false, 
      priority: 'medium' 
    }
  ]);

  const [collectives, setCollectives] = useState<any[]>([
    { 
      id: 'COLL-01', 
      name: 'Bantu Soil Guardians', 
      adminEsin: 'EA-ADMIN-X842', 
      members: [
        { id: 'W-01', name: 'Dr. Sarah Chen', sustainabilityRating: 98 },
        { id: 'W-02', name: 'Marcus T.', sustainabilityRating: 85 }
      ], 
      type: 'Clan', 
      mission: 'Preserving ancestral composting methods.',
      resonance: 92,
      objectives: ['Restore Soil Biome', 'Map Lineage Seeds'],
      signals: [{ from: 'Dr. Sarah Chen', text: 'Moisture Shard committed.', timestamp: '10:42 AM', type: 'text' }],
      missionCampaign: { active: true, title: 'Bantu Soil Restoration', target: 50000, pool: 12500 }
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
      totalCapital: 500000, fundedAmount: 320000, batchesClaimed: 0, totalBatches: 10,
      progress: 20, roiEstimate: 15, collateralLocked: 250000, profitsAccrued: 12500,
      investorShareRatio: 0.20, performanceIndex: 88, memberCount: 7, isPreAudited: true, isPostAudited: true
    }
  ]);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  useEffect(() => {
    const bootTimer = setTimeout(() => setIsBooting(false), 2000);
    document.documentElement.classList.add('dark');
    
    const savedUser = localStorage.getItem('agro_steward');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    return () => clearTimeout(bootTimer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agro_steward');
    setUser(null);
    setActiveView('dashboard');
  };

  const handleNavigate = (newView: ViewState) => {
    setActiveView(newView);
    setShowSignalDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const m = updatedUser.metrics.timeConstantTau;
    updatedUser.wallet.exchangeRate = BASE_EXCHANGE_RATE * (1 + (PENALTY_FACTOR / m));
    setUser(updatedUser);
    localStorage.setItem('agro_steward', JSON.stringify(updatedUser));
    await syncUserToCloud(updatedUser);
  };

  const earnEAC = (amount: number, reason: string) => {
    if (!user) return;
    handleUpdateUser({ 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + amount 
      } 
    });
  };

  const spendEAC = (amount: number, reason: string) => {
    if (!user) return false;
    const totalAvailable = user.wallet.balance + user.wallet.bonusBalance;
    if (totalAvailable < amount) return false;

    let newBonus = user.wallet.bonusBalance;
    let newBalance = user.wallet.balance;

    if (newBonus >= amount) {
      newBonus -= amount;
    } else {
      const remaining = amount - newBonus;
      newBonus = 0;
      newBalance -= remaining;
    }

    handleUpdateUser({ 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: newBalance,
        bonusBalance: newBonus 
      } 
    });
    return true;
  };

  const swapEACforEAT = (eatAmount: number) => {
    if (!user) return false;
    const cost = eatAmount * user.wallet.exchangeRate;
    if (user.wallet.balance < cost) return false;
    handleUpdateUser({
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance - cost,
        eatBalance: user.wallet.eatBalance + eatAmount
      }
    });
    return true;
  };

  const unreadSignals = networkSignals.filter(s => !s.read);

  const markSignalRead = (id: string) => {
    setNetworkSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const clearAllSignals = () => {
    setNetworkSignals([]);
    setShowSignalDropdown(false);
  };

  if (isBooting) return (
    <div className="fixed inset-0 z-[500] bg-[#050706] flex items-center justify-center overflow-hidden">
      <div className="text-center space-y-8 animate-in fade-in duration-1000">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] bg-black/60 border-2 border-emerald-500/30 flex items-center justify-center mx-auto relative animate-float shadow-2xl">
          <Leaf className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">ENVIROS<span className="text-emerald-400">AGRO OS</span></h1>
        <div className="w-56 md:w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-emerald-500/60 animate-boot-progress"></div>
        </div>
      </div>
      <style>{`@keyframes boot-progress { 0% { width: 0%; } 100% { width: 100%; } } .animate-boot-progress { animation: boot-progress 2s ease-in-out forwards; }`}</style>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const registryNodes = [
    { 
      category: 'Command & Analytics', 
      items: [
        { id: 'dashboard', name: 'Command Hub', icon: LayoutDashboard },
        { id: 'impact', name: 'Global Impact', icon: TrendingUp },
        { id: 'intelligence', name: 'Science and IoT', icon: Microscope },
        { id: 'research', name: 'Research and Innovation', icon: BrainCircuit },
      ]
    },
    { 
      category: 'Treasury & Commerce', 
      items: [
        { id: 'wallet', name: 'Treasury Node', icon: Wallet },
        { id: 'investor', name: 'Investor Portal', icon: Landmark },
        { id: 'economy', name: 'Market and Mining', icon: Pickaxe },
        { id: 'contract_farming', name: 'Capital Bridge', icon: Briefcase },
        { id: 'vendor', name: 'Vendor Registry', icon: Store },
        { id: 'circular', name: 'Circular Grid', icon: Recycle },
      ]
    },
    { 
      category: 'Ecosystem & Wild', 
      items: [
        { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers },
        { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
        { id: 'media', name: 'Media Hub', icon: Film },
        { id: 'agrowild', name: 'Agrowild Hub', icon: PawPrint },
        { id: 'live_farming', name: 'Live Processing', icon: Sprout },
        { id: 'community', name: 'Learning Hub', icon: Library },
      ]
    },
    { 
      category: 'Registry & Ops', 
      items: [
        { id: 'industrial', name: 'Industrial Cloud', icon: HardHat },
        { id: 'tqm', name: 'Traceability Shards', icon: ClipboardCheck },
        { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake },
        { id: 'explorer', name: 'Ledger Registry', icon: Database },
        { id: 'ingest', name: 'Network Ingest', icon: Cable },
        { id: 'tools', name: 'Node Tools', icon: Wrench },
      ]
    },
    { 
      category: 'Governance & Identity', 
      items: [
        { id: 'info', name: 'Governance', icon: ShieldAlert },
        { id: 'profile', name: 'Node Dossier', icon: UserIcon },
      ]
    }
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 agro-gradient rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <Leaf className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="text-xl font-black uppercase tracking-tighter italic whitespace-nowrap">Enviros<span className="text-emerald-400">Agro</span></span>}
        </div>
        {!isMobile && (
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:text-white transition-colors">
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        )}
        {isMobile && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="flex-1 mt-4 space-y-6 px-3 overflow-y-auto custom-scrollbar pb-8">
        {registryNodes.map((group, idx) => (
          <div key={idx} className="space-y-2">
             {isSidebarOpen && <h5 className="text-[8px] font-black text-slate-600 uppercase tracking-[0.25em] px-3">{group.category}</h5>}
             <div className="space-y-1">
               {group.items.map((item) => (
                 <button 
                   key={item.id} 
                   onClick={() => handleNavigate(item.id as ViewState)} 
                   className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${activeView === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                 >
                   <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? 'text-white' : 'group-hover:scale-105 transition-transform'}`} />
                   {isSidebarOpen && <span className="font-black text-[9px] uppercase tracking-[0.15em] truncate">{item.name}</span>}
                 </button>
               ))}
             </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 space-y-3">
        <button onClick={() => setIsVoiceBridgeOpen(true)} className="w-full flex items-center justify-center gap-3 p-4 agro-gradient rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
          <Mic size={18} /> {isSidebarOpen && "ORACLE VOICE"}
        </button>
      </div>
    </>
  );

  return (
    <div className={`flex h-screen overflow-hidden bg-[#050706] text-slate-200`}>
      <div className="scanline"></div>
      
      <aside className={`hidden lg:flex ${isSidebarOpen ? 'w-72' : 'w-20'} glass-card border-r border-white/5 flex flex-col z-50 transition-all duration-300 relative shadow-2xl bg-black/40`}>
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-[80%] max-w-sm glass-card border-r border-white/10 bg-[#050706] flex flex-col animate-in slide-in-from-left duration-300">
             <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative flex flex-col bg-[#050706]">
        <header className="flex justify-between items-center sticky top-0 bg-black/60 backdrop-blur-3xl z-40 py-4 px-4 md:px-10 border-b border-white/5 shadow-xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-white/5 rounded-xl text-emerald-500 border border-white/10 shadow-lg active:scale-90 transition-all"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white truncate max-w-[150px] md:max-w-none">
                {activeView.replace(/_/g, ' ')} Shard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[7px] md:text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] font-mono">NODE_AUTH: {user.esin}</p>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-8 px-6 border-x border-white/5 h-full">
            <div className="text-center group cursor-pointer" onClick={() => handleNavigate('wallet')}>
              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">EAC Shards</p>
              <p className="text-xl font-mono font-black text-emerald-400 group-hover:scale-105 transition-transform">{(user.wallet.balance + user.wallet.bonusBalance).toFixed(0)}</p>
            </div>
            <div className="text-center group cursor-pointer" onClick={() => handleNavigate('wallet')}>
              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">EAT Equity</p>
              <p className="text-xl font-mono font-black text-yellow-500 group-hover:scale-105 transition-transform">{user.wallet.eatBalance.toFixed(3)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowSignalDropdown(!showSignalDropdown)} 
                className={`p-2.5 rounded-xl border transition-all relative ${showSignalDropdown ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-[#0B0F0D] border-white/10 text-slate-500 hover:text-white'}`}
              >
                <Bell size={18} />
                {unreadSignals.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#050706] animate-pulse">
                    {unreadSignals.length}
                  </span>
                )}
              </button>

              {showSignalDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSignalDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-[350px] md:w-[400px] rounded-[32px] border border-white/10 bg-[#0B0F0D] shadow-[0_24px_48px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4 bg-emerald-600/10 border-b border-white/5 flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Radio className="w-4 h-4 text-emerald-400" /> Network Signals
                      </h4>
                      <button onClick={clearAllSignals} className="text-[8px] font-black text-slate-500 hover:text-rose-400 uppercase transition-colors">Wipe</button>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {networkSignals.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                          <Inbox size={40} className="text-slate-600" />
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Buffer Empty</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {networkSignals.map(sig => (
                            <div 
                              key={sig.id} 
                              onClick={() => markSignalRead(sig.id)}
                              className={`p-5 hover:bg-white/[0.03] transition-all cursor-pointer relative group ${!sig.read ? 'bg-emerald-500/[0.02]' : 'opacity-60'}`}
                            >
                              {!sig.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                              <div className="flex gap-4">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-white/5 ${sig.type === 'system' ? 'bg-blue-600/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                  {sig.type === 'system' ? <ShieldAlert size={16} /> : <Zap size={16} />}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between items-start">
                                    <h5 className="text-[10px] font-black text-white uppercase tracking-tight italic">{sig.title}</h5>
                                    <span className="text-[7px] font-mono text-slate-600">{sig.timestamp}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">"{sig.message}"</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => handleNavigate('profile')} className="flex items-center gap-3 p-1.5 md:pr-4 glass-card rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-600/10 transition-all shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-black text-emerald-500">{user.name[0]}</div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black text-white uppercase">{user.name}</p>
                <p className="text-[8px] text-emerald-500/60 font-mono font-black">SYNC_OK</p>
              </div>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 relative max-w-[1920px] mx-auto w-full">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} onSwap={swapEACforEAT} />}
          {activeView === 'sustainability' && <Sustainability user={user} onMintEAT={(v: number) => earnEAC(v, 'RESONANCE_IMPROVE')} />}
          {activeView === 'channelling' && <Channelling user={user} onEarnEAC={earnEAC} />}
          {activeView === 'economy' && <Economy user={user} onNavigate={handleNavigate} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} projects={projects} />}
          {activeView === 'media' && <MediaHub userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={earnEAC} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'impact' && <Impact user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'industrial' && <Industrial user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} collectives={collectives} setCollectives={setCollectives} />}
          {activeView === 'intelligence' && <Intelligence userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
          {activeView === 'live_farming' && <LiveFarming user={user} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'vendor' && <VendorPortal user={user} />}
          {activeView === 'agrowild' && <Agrowild user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'research' && <ResearchInnovation user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'tqm' && <TQMGrid user={user} onSpendEAC={spendEAC} />}
          {activeView === 'crm' && <NexusCRM user={user} onSpendEAC={spendEAC} />}
          {activeView === 'circular' && <CircularGrid user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} signals={networkSignals} setSignals={setNetworkSignals} />}
          {activeView === 'community' && <Community user={user} onContribution={() => earnEAC(5, 'CONTRIB')} onSpendEAC={spendEAC} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'ingest' && <NetworkIngest />}
          {activeView === 'tools' && <ToolsSection user={user} />}
          {activeView === 'info' && <InfoPortal />}
        </div>
      </main>

      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} onClose={() => setIsVoiceBridgeOpen(false)} />
      <FloatingConsultant user={user} />
      <EvidenceModal isOpen={isEvidenceModalOpen} onClose={() => setIsEvidenceModalOpen(false)} user={user} onMinted={(v: number) => earnEAC(v, 'MANUAL_MINT')} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
