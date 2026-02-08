import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2, Signal as SignalIcon, Target,
  Truck, Layers, Map as MapIcon, Compass as CompassIcon, Server, Workflow, ShieldPlus, ChevronLeftCircle, ArrowLeft,
  ChevronRight, ArrowUp, UserCheck
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, NotificationType, MediaShard, SignalShard } from './types';
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
import NaturalResources from './components/NaturalResources';
import IntranetPortal from './components/IntranetPortal';
import EnvirosAgroStore from './components/EnvirosAgroStore';
import CEA from './components/CEA';
import Biotechnology from './components/Biotechnology';
import Permaculture from './components/Permaculture';
import EmergencyPortal from './components/EmergencyPortal';
import AgroRegency from './components/AgroRegency';
import CodeOfLaws from './components/CodeOfLaws';
import AgroCalendar from './components/AgroCalendar';
import ChromaSystem from './components/ChromaSystem';
import AgroValueEnhancement from './components/AgroValueEnhancement';
import DigitalMRV from './components/DigitalMRV';
import RegistryHandshake from './components/RegistryHandshake';
import OnlineGarden from './components/OnlineGarden';
import FarmOS from './components/FarmOS';
import NetworkView from './components/NetworkView';
import MediaLedger from './components/MediaLedger';
import AgroLang from './components/AgroLang';
import SignalCenter from './components/SignalCenter';
import Sitemap from './components/Sitemap';

import { 
  syncUserToCloud, 
  auth, 
  getStewardProfile, 
  signOutSteward, 
  onAuthStateChanged,
  listenToCollection,
  saveCollectionItem
} from './services/firebaseService';

export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M100 180C100 180 95 160 100 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 145C100 145 70 140 50 120C30 100 20 80 25 55C30 30 55 20 75 35C85 45 100 30 100 30C100 30 115 45 125 35C145 20 170 30 175 55C180 80 170 100 150 120C130 140 100 145 100 145Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

const BOOT_LOGS = [
  "INITIALIZING SYCAMORE_OS_v6.5...",
  "MAPPING_GEOFENCE_SHARDS [OK]",
  "CALIBRATING_M_CONSTANT_BASE [1.42]",
  "SYNCING_L3_INDUSTRIAL_LEDGER...",
  "ZK_PROOF_ENGINE_BOOT [SUCCESS]",
  "ESTABLISHING_ORACLE_HANDSHAKE...",
  "SEHTI_THRUST_ALIGNED",
  "NODE_SYNC_FINALIZED"
];

const InitializationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLog(prev => (prev < BOOT_LOGS.length - 1 ? prev + 1 : prev));
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center space-y-12 overflow-hidden">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <div className="relative group">
        <div className="w-48 h-48 rounded-[48px] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.2)] animate-pulse relative z-20">
          <SycamoreLogo size={100} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
        </div>
        <div className="absolute inset-[-20px] border-2 border-dashed border-emerald-500/20 rounded-[64px] animate-spin-slow"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-20">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex flex-col items-center gap-2">
           <p className="text-[10px] font-mono font-black text-emerald-400/80 uppercase tracking-[0.6em] animate-pulse">
              {BOOT_LOGS[currentLog]}
           </p>
           <p className="text-[8px] font-mono text-slate-700 font-bold uppercase tracking-widest">
              SECURE_BOOT // KERNEL_SYNC: {progress}%
           </p>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30">
        <h1 className="text-xl font-black text-white italic tracking-tighter">Enviros<span className="text-emerald-400">Agro</span></h1>
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Planetary Regeneration Grid</p>
      </div>
    </div>
  );
};

const GUEST_STWD: User = {
  name: 'GUEST STEWARD',
  email: 'guest@envirosagro.org',
  esin: 'EA-GUEST-VOID-NODE',
  mnemonic: 'none',
  regDate: new Date().toLocaleDateString(),
  role: 'OBSERVER',
  location: 'GLOBAL MESH NODE',
  wallet: {
    balance: 0,
    eatBalance: 0,
    exchangeRate: 1.0,
    bonusBalance: 0,
    tier: 'Seed',
    lifetimeEarned: 0,
    linkedProviders: [],
    miningStreak: 0,
    lastSyncDate: new Date().toISOString().split('T')[0],
    pendingSocialHarvest: 0,
    stakedEat: 0
  },
  metrics: {
    agriculturalCodeU: 0,
    timeConstantTau: 0,
    sustainabilityScore: 0,
    socialImmunity: 0,
    viralLoadSID: 0,
    baselineM: 0
  },
  skills: {},
  isReadyForHire: false
};

const REGISTRY_NODES = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
      { id: 'network_signals', name: 'Signal Terminal', icon: SignalIcon },
      { id: 'network', name: 'Network Topology', icon: NetworkIcon },
      { id: 'sitemap', name: 'Network Sitemap', icon: MapIcon },
      { id: 'farm_os', name: 'Farm OS', icon: Binary },
      { id: 'impact', name: 'Network Impact', icon: TrendingUp },
      { id: 'sustainability', name: 'Sustainability Shard', icon: Leaf },
      { id: 'code_of_laws', name: 'Code of Laws', icon: Scale },
      { id: 'chroma_system', name: 'Chroma-SEHTI', icon: Palette },
      { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays },
      { id: 'intelligence', name: 'Science Oracle', icon: Microscope },
      { id: 'explorer', name: 'Registry Explorer', icon: Database }
    ]
  },
  {
    category: 'Value & Production',
    items: [
      { id: 'agro_value_enhancement', name: 'Value Enhancement', icon: FlaskConical },
      { id: 'wallet', name: 'Treasury Node', icon: Wallet },
      { id: 'economy', name: 'Market Cloud', icon: Globe },
      { id: 'industrial', name: 'Industrial Cloud', icon: Briefcase },
      { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers }
    ]
  },
  {
    category: 'Operations & Trace',
    items: [
      { id: 'online_garden', name: 'Online Garden', icon: Flower },
      { id: 'digital_mrv', name: 'Digital MRV', icon: Scan },
      { id: 'live_farming', name: 'Product Processing', icon: Wheat },
      { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck },
      { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake },
      { id: 'circular', name: 'Circular Grid', icon: Recycle },
      { id: 'tools', name: 'Industrial Tools', icon: Wrench }
    ]
  },
  {
    category: 'Natural Resources',
    items: [
      { id: 'animal_world', name: 'Animal World', icon: PawPrint },
      { id: 'plants_world', name: 'Plants World', icon: TreePine },
      { id: 'aqua_portal', name: 'Aqua Portal', icon: Droplets },
      { id: 'soil_portal', name: 'Soil Portal', icon: Mountain },
      { id: 'air_portal', name: 'Air Portal', icon: Wind }
    ]
  },
  {
    category: 'Innovation & Shards',
    items: [
      { id: 'agrolang', name: 'AgroLang IDE', icon: Code2 },
      { id: 'research', name: 'Invention Ledger', icon: Zap },
      { id: 'biotech_hub', name: 'Genetic Decoder', icon: Dna },
      { id: 'permaculture_hub', name: 'Design Resilience', icon: Compass },
      { id: 'cea_portal', name: 'Controlled Enviro', icon: BoxSelect },
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 }
    ]
  },
  {
    category: 'Governance & Heritage',
    items: [
      { id: 'community', name: 'Social Registry', icon: Users },
      { id: 'info', name: 'Info Portal', icon: Info },
      { id: 'intranet', name: 'HQ Portal', icon: Landmark },
      { id: 'emergency_portal', name: 'Emergency Hub', icon: Siren },
      { id: 'profile', name: 'Identity Dossier', icon: UserIcon },
      { id: 'registry_handshake', name: 'Registry Handshake', icon: QrCode },
      { id: 'vendor', name: 'Supplier Command', icon: Warehouse },
      { id: 'ingest', name: 'Network Ingest', icon: Cable },
      { id: 'agro_regency', name: 'Agro Regency', icon: History }
    ]
  },
  {
    category: 'Stores',
    items: [
      { id: 'envirosagro_store', name: 'EnvirosAgro Store', icon: Store }
    ]
  }
];

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // App-wide data states
  const [projects, setProjects] = useState<AgroProject[]>([]);
  const [contracts, setContracts] = useState<FarmingContract[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [transactions, setTransactions] = useState<AgroTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationShard[]>([]);
  const [mediaShards, setMediaShards] = useState<MediaShard[]>([]);
  const [signals, setSignals] = useState<SignalShard[]>([]);
  
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<any | null>(null);
  const [osInitialCode, setOsInitialCode] = useState<string | null>(null);

  // SCROLL MANAGEMENT
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showZenithButton, setShowZenithButton] = useState(false);

  // Reset scroll on view change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view]);

  // Track scroll for progress bar and zenith button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
    setShowZenithButton(target.scrollTop > 400);
  };

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Synchronize authentication status with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getStewardProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Registry data synchronization listeners
  useEffect(() => {
    const unsubProjects = listenToCollection('projects', (data) => setProjects(data));
    const unsubContracts = listenToCollection('contracts', (data) => setContracts(data));
    const unsubOrders = listenToCollection('orders', (data) => setOrders(data));
    const unsubProducts = listenToCollection('products', (data) => setVendorProducts(data));
    const unsubUnits = listenToCollection('industrial_units', (data) => setIndustrialUnits(data));
    const unsubLive = listenToCollection('live_products', (data) => setLiveProducts(data));
    const unsubTx = listenToCollection('transactions', (data) => setTransactions(data));
    const unsubSignals = listenToCollection('signals', (data) => setSignals(data));

    return () => {
      unsubProjects();
      unsubContracts();
      unsubOrders();
      unsubProducts();
      unsubUnits();
      unsubLive();
      unsubTx();
      unsubSignals();
    };
  }, [user]);

  const notify = (type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [{ id, type, title, message, duration: 5000 }, ...prev]);
  };

  const handleSpendEAC = async (amount: number, reason: string): Promise<boolean> => {
    if (!user) {
      notify('warning', 'AUTH_REQUIRED', "You must anchor a steward node to execute industrial spends.");
      setView('auth');
      return false;
    }
    if (user.wallet.balance < amount) {
      notify('error', 'INSUFFICIENT_FUNDS', `You need ${amount} EAC for ${reason}.`);
      return false;
    }
    
    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance - amount
      }
    };
    
    setUser(updatedUser);
    await syncUserToCloud(updatedUser);
    
    const newTx: AgroTransaction = {
      id: `TX-${Date.now()}`,
      type: 'Transfer',
      farmId: user.esin,
      details: reason,
      value: -amount,
      unit: 'EAC'
    };
    
    setTransactions(prev => [newTx, ...prev]);
    saveCollectionItem('transactions', newTx);
    return true;
  };

  const handleEarnEAC = (amount: number, reason: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        lifetimeEarned: (user.wallet.lifetimeEarned || 0) + amount
      }
    };
    setUser(updatedUser);
    syncUserToCloud(updatedUser);
    
    const newTx: AgroTransaction = {
      id: `TX-${Date.now()}`,
      type: 'Reward',
      farmId: user.esin,
      details: reason,
      value: amount,
      unit: 'EAC'
    };
    setTransactions(prev => [newTx, ...prev]);
    saveCollectionItem('transactions', newTx);
  };

  const handleLogout = async () => {
    await signOutSteward();
    setUser(null);
    setView('dashboard');
  };

  const navigate = (v: ViewState, action: string | null = null) => {
    setView(v);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], meta?: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...meta } : o));
    saveCollectionItem('orders', { id: orderId, status, ...meta });
  };

  const handleRegisterProduct = (product: VendorProduct) => {
    setVendorProducts(prev => [product, ...prev]);
    saveCollectionItem('products', product);
  };

  const renderView = () => {
    const currentUser = user || GUEST_STWD;
    const isGuest = !user;

    switch (view) {
      case 'auth': return <Login onLogin={(u) => { setUser(u); setView('dashboard'); }} />;
      case 'dashboard': return <Dashboard onNavigate={navigate} user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
      case 'sustainability': return <Sustainability user={currentUser} onNavigate={navigate} onMintEAT={handleEarnEAC} />;
      case 'economy': return <Economy user={currentUser} isGuest={isGuest} onSpendEAC={handleSpendEAC} onNavigate={navigate} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} projects={projects} notify={notify} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={setUser!} />;
      case 'wallet': return <AgroWallet user={currentUser} isGuest={isGuest} onNavigate={navigate} onUpdateUser={setUser!} onSwap={async (eat) => { handleEarnEAC(0, 'SWAP_EAT'); return true; }} onEarnEAC={handleEarnEAC} notify={notify} transactions={transactions} />;
      case 'intelligence': return <Intelligence user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onOpenEvidence={() => setIsEvidenceOpen(true)} />;
      case 'community': return <Community user={currentUser} isGuest={isGuest} onContribution={() => {}} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'explorer': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} />;
      case 'ecosystem': return <Ecosystem user={currentUser} onDeposit={handleEarnEAC} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'industrial': return <Industrial user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} industrialUnits={industrialUnits} notify={notify} collectives={[]} setCollectives={() => {}} onSaveProject={(p) => saveCollectionItem('projects', p)} setIndustrialUnits={() => {}} />;
      case 'profile': return <UserProfile user={currentUser} isGuest={isGuest} onUpdate={setUser!} onNavigate={navigate} signals={signals} setSignals={setSignals} notify={notify} onLogin={() => setView('auth')} onLogout={handleLogout} />;
      case 'channelling': return <Channelling user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'media': return <MediaHub user={currentUser} userBalance={currentUser.wallet.balance} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'crm': return <NexusCRM user={currentUser} onSpendEAC={handleSpendEAC} vendorProducts={vendorProducts} onNavigate={navigate} orders={orders} />;
      case 'tqm': return <TQMGrid user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} liveProducts={liveProducts} onNavigate={navigate} />;
      case 'circular': return <CircularGrid user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} onNavigate={navigate} />;
      case 'tools': return <ToolsSection user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onOpenEvidence={(t) => { setActiveTaskForEvidence(t); setIsEvidenceOpen(true); }} tasks={[]} onSaveTask={() => {}} notify={notify} />;
      case 'research': return <ResearchInnovation user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'live_farming': return <LiveFarming user={currentUser} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={handleEarnEAC} onSaveProduct={(p) => saveCollectionItem('live_products', p)} onNavigate={navigate} notify={notify} />;
      case 'contract_farming': return <ContractFarming user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} contracts={contracts} setContracts={setContracts} onSaveContract={(c) => saveCollectionItem('contracts', c)} />;
      case 'agrowild': return <Agrowild user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onPlaceOrder={(o) => saveCollectionItem('orders', o)} vendorProducts={vendorProducts} />;
      case 'impact': return <Impact user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'animal_world': return <NaturalResources user={currentUser} type="animal_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'plants_world': return <NaturalResources user={currentUser} type="plants_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'aqua_portal': return <NaturalResources user={currentUser} type="aqua_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'soil_portal': return <NaturalResources user={currentUser} type="soil_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'air_portal': return <NaturalResources user={currentUser} type="air_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'intranet': return <IntranetPortal user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'cea_portal': return <CEA user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'biotech_hub': return <Biotechnology user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'permaculture_hub': return <Permaculture user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'emergency_portal': return <EmergencyPortal user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'agro_regency': return <AgroRegency user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'code_of_laws': return <CodeOfLaws user={currentUser} />;
      case 'agro_calendar': return <AgroCalendar user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'chroma_system': return <ChromaSystem user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'envirosagro_store': return <EnvirosAgroStore user={currentUser} onSpendEAC={handleSpendEAC} onPlaceOrder={(o) => saveCollectionItem('orders', o)} />;
      case 'agro_value_enhancement': return <AgroValueEnhancement user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} liveProducts={liveProducts} orders={orders} onNavigate={navigate} />;
      case 'digital_mrv': return <DigitalMRV user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'registry_handshake': return <RegistryHandshake user={currentUser} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'online_garden': return <OnlineGarden user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} notify={notify} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} />;
      case 'farm_os': return <FarmOS user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialCode={osInitialCode} clearInitialCode={() => setOsInitialCode(null)} />;
      case 'network_signals': return <SignalCenter user={currentUser} signals={signals} setSignals={setSignals} onNavigate={navigate} />;
      case 'network': return <NetworkView />;
      case 'media_ledger': return <MediaLedger user={currentUser} shards={mediaShards} />;
      case 'agrolang': return <AgroLang user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} />;
      case 'sitemap': return <Sitemap nodes={REGISTRY_NODES} onNavigate={navigate} />;
      case 'vendor': return <VendorPortal user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} vendorProducts={vendorProducts} onRegisterProduct={handleRegisterProduct} />;
      case 'ingest': return <NetworkIngest user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'info': return <InfoPortal onNavigate={navigate} />;
      default: return <Dashboard onNavigate={navigate} user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
    }
  };

  if (isBooting) {
    return <InitializationScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#050706] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden animate-in fade-in duration-1000">
      <aside className={`fixed top-0 left-0 bottom-0 z-[100] bg-black/80 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'w-80' : 'w-20'}`}>
        <div className="p-8 flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
              <SycamoreLogo size={32} className="text-black" />
           </div>
           {isSidebarOpen && (
             <div className="animate-in fade-in slide-in-from-left-2">
                <h1 className="text-xl font-black text-white italic tracking-tighter">Enviros<span className="text-emerald-400">Agro</span></h1>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Core Node Registry</p>
             </div>
           )}
        </div>

        <nav className="px-4 py-8 space-y-10">
           {REGISTRY_NODES.map((group) => {
             const hasActiveItem = group.items.some(i => i.id === view);
             return (
               <div key={group.category} className="space-y-4">
                  {isSidebarOpen && <p className={`px-4 text-[9px] font-black uppercase tracking-widest transition-colors ${hasActiveItem ? 'text-emerald-400' : 'text-slate-600'}`}>{group.category}</p>}
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setView(item.id as ViewState)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${view === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                      >
                        <item.icon size={20} className={view === item.id ? 'text-white' : 'text-slate-500'} />
                        {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>}
                      </button>
                    ))}
                  </div>
               </div>
             );
           })}
        </nav>

        {user && (
          <div className="mt-auto p-8">
             <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all">
                <LogOut size={20} />
                {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>}
             </button>
          </div>
        )}
      </aside>

      <main 
        ref={mainContentRef}
        onScroll={handleScroll}
        className={`transition-all duration-500 pt-10 pb-32 h-screen overflow-y-auto custom-scrollbar relative ${isSidebarOpen ? 'pl-96 pr-10' : 'pl-32 pr-10'}`}
      >
        {/* Navigation Progress Shard */}
        <div className="fixed top-0 left-0 right-0 z-[200] h-1 pointer-events-none">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" 
            style={{ width: `${scrollProgress}%`, marginLeft: isSidebarOpen ? '20rem' : '5rem' }}
          ></div>
        </div>

        <header className="flex justify-between items-center mb-10 sticky top-0 bg-[#050706]/80 backdrop-blur-md py-4 z-[150] px-4 -mx-4 border-b border-white/5">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                 {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
              </button>
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{view.replace(/_/g, ' ')}</h2>
                 <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">NODE_SYNC_STATUS: {user ? 'CLOUD_ANCHORED' : 'GUEST_OBSERVER'}</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {user && (
                <button onClick={() => setView('wallet')} className="px-6 py-3 glass-card rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3 hover:bg-emerald-500/10 transition-all group">
                   <Coins size={16} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                   <span className="text-sm font-mono font-black text-white">{(user?.wallet.balance || 0).toFixed(0)} <span className="text-xs text-emerald-600/60 font-sans italic">EAC</span></span>
                </button>
              )}
              <button 
                onClick={() => setView('profile')} 
                className={`flex items-center gap-3 px-4 py-2 rounded-2xl border-2 transition-all shadow-xl overflow-hidden ${user ? 'border-white/10 bg-slate-800' : 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'}`}
              >
                 {user ? (
                   <>
                     <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon size={16} className="text-slate-500" />}
                     </div>
                     <span className="text-[10px] font-black uppercase text-white hidden md:block">{user.name.split(' ')[0]}</span>
                   </>
                 ) : (
                   <>
                     <UserPlus size={18} className="text-emerald-400" />
                     <span className="text-[10px] font-black uppercase text-emerald-400">Sync Steward</span>
                   </>
                 )}
              </button>
           </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderView()}
        </div>

        {/* Zenith Return Button */}
        {showZenithButton && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 p-5 agro-gradient rounded-3xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all z-[400] border-2 border-white/20 animate-in fade-in zoom-in duration-300"
            title="Return to Zenith"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </main>

      <EvidenceModal 
        isOpen={isEvidenceOpen} 
        onClose={() => setIsEvidenceOpen(false)} 
        user={user || GUEST_STWD} 
        onMinted={handleEarnEAC} 
        onNavigate={navigate} 
        taskToIngest={activeTaskForEvidence} 
      />
      <LiveVoiceBridge isOpen={false} isGuest={!user} onClose={() => {}} />
      <FloatingConsultant user={user || GUEST_STWD} />
    </div>
  );
};

export default App;