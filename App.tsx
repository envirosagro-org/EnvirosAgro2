
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, Factory, Monitor, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2, Signal as SignalIcon, Target,
  Truck, Layers, Map as MapIcon, Compass as CompassIcon, Server, Workflow, ShieldPlus, ChevronLeftCircle, ArrowLeft,
  ChevronRight, ArrowUp, UserCheck, BookOpen, Stamp, Binoculars, Command, Bot, Wand2, Brain, ArrowRight, Home,
  Building, ShieldX, ScanLine,
  MapPin,
  Download,
  FileDigit,
  Music,
  GraduationCap,
  ArrowUpRight,
  ShoppingBag,
  Sparkle,
  Mail,
  BellRing,
  Settings,
  CheckCircle2,
  Video,
  Clock,
  SearchCode,
  LayoutGrid,
  // Added Construction and Package icons to fix undefined errors
  Construction,
  Package
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, NotificationType, MediaShard, SignalShard, VectorAddress } from './types';
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
import AIAnalyst from './components/AIAnalyst';
import VerificationHUD from './components/VerificationHUD';
import SettingsPortal from './components/SettingsPortal';
import TemporalVideo from './components/TemporalVideo';
import Robot from './components/Robot';
import NetworkGenesis from './components/NetworkGenesis';

import { 
  syncUserToCloud, 
  auth, 
  getStewardProfile, 
  signOutSteward, 
  onAuthStateChanged,
  listenToCollection,
  saveCollectionItem,
  dispatchNetworkSignal,
  markPermanentAction,
  listenToPulse,
  refreshAuthUser,
  updateSignalReadStatus,
  markAllSignalsAsReadInDb
} from './services/firebaseService';
import { chatWithAgroExpert } from './services/geminiService';

export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M100 180C100 180 95 160 100 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 145C100 145 70 140 50 120C30 100 20 80 25 55C30 30 55 20 75 35C85 45 100 30 100 30C100 30 115 45 125 35C145 20 170 30 175 55C180 80 170 100 150 120C130 140 100 145 100 145Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

// Added GUEST_STWD constant to fix undefined error on line 250
const GUEST_STWD: User = {
  name: 'Guest Steward',
  email: '',
  esin: 'EA-GUEST-0000',
  mnemonic: '',
  regDate: '',
  role: 'Observer',
  location: 'Global Hub',
  wallet: { balance: 0, eatBalance: 0, exchangeRate: 1, bonusBalance: 0, tier: 'Seed', lifetimeEarned: 0, linkedProviders: [] },
  metrics: { agriculturalCodeU: 0, timeConstantTau: 0, sustainabilityScore: 0, socialImmunity: 0, viralLoadSID: 0, baselineM: 0 },
  skills: {},
  isReadyForHire: false
};

const REGISTRY_NODES: RegistryGroup[] = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard, sections: [{id: 'metrics', label: 'Node Metrics'}, {id: 'oracle', label: 'Oracle Hub'}, {id: 'path', label: 'Strategic Path'}] },
      { id: 'network_genesis', name: 'Network Genesis', icon: Construction },
      { id: 'ai_analyst', name: 'Neural Analyst', icon: Brain },
      { id: 'settings', name: 'System Settings', icon: Settings, sections: [{id: 'display', label: 'UI Display'}, {id: 'privacy', label: 'Security Shards'}] },
      { id: 'profile', name: 'Steward Profile', icon: UserIcon, sections: [{id: 'dossier', label: 'Personal Registry'}, {id: 'card', label: 'Identity Shard'}, {id: 'celestial', label: 'Birth Resonance'}] },
      { id: 'network_signals', name: 'Signal Terminal', icon: SignalIcon, sections: [{id: 'terminal', label: 'Inbound Feed'}, {id: 'ledger', label: 'Signal History'}] },
      { id: 'network', name: 'Network Topology', icon: NetworkIcon },
      { id: 'farm_os', name: 'Farm OS', icon: Binary, sections: [{id: 'kernel', label: 'Kernel Stack'}, {id: 'hardware', label: 'Hardware Monitor'}, {id: 'shell', label: 'System Shell'}] },
      { id: 'impact', name: 'Network Impact', icon: TrendingUp, sections: [{id: 'whole', label: 'Vitality'}, {id: 'carbon', label: 'Carbon Ledger'}, {id: 'thrusts', label: 'Resonance'}] },
      { id: 'sustainability', name: 'Sustainability Shard', icon: Leaf },
      { id: 'intelligence', name: 'Science Oracle', icon: Microscope, sections: [{id: 'twin', label: 'Digital Twin'}, {id: 'simulator', label: 'EOS Physics'}, {id: 'temporal_video', label: 'Temporal Predictor'}, {id: 'telemetry', label: 'IoT Ingest'}, {id: 'trends', label: 'Trend Ingest'}, {id: 'eos_ai', label: 'Expert Oracle'}] },
      { id: 'explorer', name: 'Registry Explorer', icon: Database, sections: [{id: 'blocks', label: 'Blocks'}, {id: 'ledger', label: 'Tx Ledger'}, {id: 'consensus', label: 'Quorum'}, {id: 'settlement', label: 'Finality'}] },
      { id: 'sitemap', name: 'Registry Matrix', icon: MapIcon },
      { id: 'info', name: 'Hub Info', icon: Info, sections: [{id: 'about', label: 'About'}, {id: 'security', label: 'Security'}, {id: 'legal', label: 'Legal'}, {id: 'faq', label: 'FAQ'}] }
    ]
  },
  {
    category: 'Missions & Capital',
    items: [
      { id: 'contract_farming', name: 'Contract Farming', icon: Handshake, sections: [{id: 'browse', label: 'Missions'}, {id: 'deployments', label: 'Deployments'}] },
      { id: 'investor', name: 'Investor Portal', icon: Briefcase, sections: [{id: 'opportunities', label: 'Vetting'}, {id: 'portfolio', label: 'Portfolio'}, {id: 'analytics', label: 'Analytics'}] },
      { id: 'agrowild', name: 'Agrowild', icon: Binoculars, sections: [{id: 'conservancy', label: 'Protected Nodes'}, {id: 'tourism', label: 'Eco-Tourism'}] },
      { id: 'community', name: 'Steward Community', icon: Users, sections: [{id: 'social', label: 'Social Mesh'}, {id: 'shards', label: 'Social Shards'}, {id: 'lms', label: 'Knowledge Base'}] }
    ]
  },
  {
    category: 'Value & Production',
    items: [
      { id: 'industrial', name: 'Industrial Cloud', icon: Factory, sections: [{id: 'bridge', label: 'Registry Bridge'}, {id: 'sync', label: 'Process Sync'}, {id: 'path', label: 'Analyzer'}] },
      { id: 'agro_value_enhancement', name: 'Value Forge', icon: FlaskConical, sections: [{id: 'synthesis', label: 'Asset Synthesis'}, {id: 'optimization', label: 'Process Tuning'}] },
      { id: 'wallet', name: 'Treasury Node', icon: Wallet, sections: [{id: 'treasury', label: 'Utility'}, {id: 'staking', label: 'Staking'}, {id: 'swap', label: 'Swap'}] },
      { id: 'economy', name: 'Market Center', icon: Globe, sections: [{id: 'catalogue', label: 'Registry Assets'}, {id: 'infrastructure', label: 'Industrial Nodes'}, {id: 'forecasting', label: 'Demand Matrix'}] },
      { id: 'vendor', name: 'Vendor Command', icon: Warehouse },
      { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers },
      { id: 'envirosagro_store', name: 'Official Org Store', icon: Store }
    ]
  },
  {
    category: 'Operations & Trace',
    items: [
      { id: 'online_garden', name: 'Online Garden', icon: Flower, sections: [{id: 'bridge', label: 'Telemetry Bridge'}, {id: 'shards', label: 'Shard Manager'}, {id: 'mining', label: 'Extraction'}] },
      { id: 'digital_mrv', name: 'Digital MRV', icon: Scan, sections: [{id: 'land_select', label: 'Geofence'}, {id: 'ingest', label: 'Evidence Ingest'}] },
      { id: 'ingest', name: 'Data Ingest', icon: Cable },
      { id: 'live_farming', name: 'Inflow Control', icon: Monitor, sections: [{id: 'lifecycle', label: 'Pipeline'}] },
      { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck, sections: [{id: 'orders', label: 'Shipments'}, {id: 'trace', label: 'Traceability'}] },
      { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake, sections: [{id: 'directory', label: 'Directory'}, {id: 'support', label: 'Support'}] },
      { id: 'circular', name: 'Circular Grid', icon: Recycle, sections: [{id: 'market', label: 'Refurbished Store'}] },
      { id: 'tools', name: 'Industrial Tools', icon: Wrench, sections: [{id: 'kanban', label: 'Kanban'}, {id: 'sigma', label: 'Six Sigma'}] },
      { id: 'robot', name: 'Swarm Command', icon: Bot, sections: [{id: 'registry', label: 'Fleet Registry'}, {id: 'security', label: 'Intranet Security'}] }
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
    category: 'Network Governance',
    items: [
      { id: 'intranet', name: 'Intranet Hub', icon: ShieldPlus },
      { id: 'emergency_portal', name: 'Emergency Command', icon: Siren },
      { id: 'agro_regency', name: 'Agro Regency', icon: History },
      { id: 'code_of_laws', name: 'Code of Laws', icon: Scale },
      { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays },
      { id: 'chroma_system', name: 'Chroma-SEHTI', icon: Palette },
      { id: 'agrolang', name: 'AgroLang IDE', icon: Code2 },
      { id: 'research', name: 'Invention Ledger', icon: Zap },
      { id: 'registry_handshake', name: 'Node Handshake', icon: QrCode },
      { id: 'biotech_hub', name: 'Biotech Hub', icon: Dna },
      { id: 'permaculture_hub', name: 'Permaculture Hub', icon: Compass },
      { id: 'cea_portal', name: 'CEA Portal', icon: BoxSelect },
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 }
    ]
  }
];

export interface RegistryItem {
  id: string;
  name: string;
  icon: any;
  sections?: { id: string; label: string; desc?: string }[];
}

export interface RegistryGroup {
  category: string;
  items: RegistryItem[];
}

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [viewSection, setViewSection] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  
  // Vector History Tracking for Retrograde/Advance
  const [history, setHistory] = useState<VectorAddress[]>([]);
  const [forwardHistory, setForwardHistory] = useState<VectorAddress[]>([]);

  const [projects, setProjects] = useState<AgroProject[]>([]);
  const [contracts, setContracts] = useState<FarmingContract[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([]);
  const [bitrate, setBitrate] = useState(4500);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [transactions, setTransactions] = useState<AgroTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationShard[]>([]);
  const [mediaShards, setMediaShards] = useState<MediaShard[]>([]);
  const [signals, setSignals] = useState<SignalShard[]>([]);
  const [pulseMessage, setPulseMessage] = useState('Registry synchronized. No anomalies detected.');
  
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<any | null>(null);
  const [osInitialCode, setOsInitialCode] = useState<string | null>(null);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showZenithButton, setShowZenithButton] = useState(false);

  // Added navigate function to fix undefined error on line 255
  const navigate = (dimension: ViewState, element: string | null = null) => {
    setHistory(prev => [...prev, { dimension: view, element: viewSection }]);
    setForwardHistory([]);
    setView(dimension);
    setViewSection(element);
    if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  // Added goBack and goForward functions to fix undefined errors on lines 488, 526
  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setForwardHistory(f => [{ dimension: view, element: viewSection }, ...f]);
    setHistory(h => h.slice(0, -1));
    setView(prev.dimension);
    setViewSection(prev.element || null);
  };

  const goForward = () => {
    if (forwardHistory.length === 0) return;
    const next = forwardHistory[0];
    setHistory(prev => [...prev, { dimension: view, element: viewSection }]);
    setForwardHistory(f => f.slice(1));
    setView(next.dimension);
    setViewSection(next.element || null);
  };

  // Added handleScroll and scrollToTop functions to fix undefined errors on lines 365, 560
  const handleScroll = (el: HTMLDivElement) => {
    const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setScrollProgress(progress);
    setShowZenithButton(el.scrollTop > 500);
  };

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Added emitSignal to fix undefined error on line 257
  const emitSignal = async (signal: Partial<SignalShard>) => {
    const res = await dispatchNetworkSignal(signal);
    if (res) {
      setSignals(prev => [res, ...prev]);
      if (res.priority === 'critical' || res.priority === 'high') {
        const notif: NotificationShard = {
          id: res.id,
          type: res.priority === 'critical' ? 'error' : 'warning',
          title: res.title,
          message: res.message
        };
        setNotifications(prev => [notif, ...prev]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 5000);
      }
    }
  };

  // Added handleEarnEAC and handleSpendEAC to fix undefined errors on lines 256, 257
  const handleEarnEAC = async (amount: number, reason: string) => {
    if (!user) return;
    const updated = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + (amount > 0 ? amount : 0)
      }
    };
    setUser(updated);
    await syncUserToCloud(updated);
    emitSignal({
      type: 'commerce',
      origin: 'TREASURY',
      title: 'CAPITAL_INGEST',
      message: `Earned ${amount} EAC: ${reason}`,
      priority: 'low',
      actionIcon: 'Coins'
    });
  };

  const handleSpendEAC = async (amount: number, reason: string): Promise<boolean> => {
    if (!user || user.wallet.balance < amount) {
      emitSignal({
        type: 'commerce',
        origin: 'TREASURY',
        title: 'LIQUIDITY_FAILURE',
        message: 'Insufficient EAC for this shard commitment.',
        priority: 'high',
        actionIcon: 'ShieldAlert'
      });
      return false;
    }
    const updated = {
      ...user,
      wallet: { ...user.wallet, balance: user.wallet.balance - amount }
    };
    setUser(updated);
    await syncUserToCloud(updated);
    emitSignal({
      type: 'commerce',
      origin: 'TREASURY',
      title: 'CAPITAL_EXPENDITURE',
      message: `Spent ${amount} EAC: ${reason}`,
      priority: 'low',
      actionIcon: 'CreditCard'
    });
    return true;
  };

  // Added handleLogout and handlePerformPermanentAction to fix undefined errors on line 265
  const handleLogout = async () => {
    await signOutSteward();
    setUser(null);
    setView('dashboard');
  };

  const handlePerformPermanentAction = async (key: string, reward: number, reason: string): Promise<boolean> => {
    if (!user) return false;
    if (user.completedActions?.includes(key)) return false;
    const success = await markPermanentAction(key);
    if (success) {
      handleEarnEAC(reward, reason);
      const updatedUser = { ...user, completedActions: [...(user.completedActions || []), key] };
      setUser(updatedUser);
      return true;
    }
    return false;
  };

  // Added signal read functions to fix line 429, 452 errors
  const markSignalAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await updateSignalReadStatus(id, true);
    if (ok) setSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const markAllSignalsAsRead = async () => {
    const unreadIds = signals.filter(s => !s.read).map(s => s.id);
    const ok = await markAllSignalsAsReadInDb(unreadIds);
    if (ok) setSignals(prev => prev.map(s => ({ ...s, read: true })));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getStewardProfile(fbUser.uid);
        if (profile) setUser(profile);
      }
      setIsBooting(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubProjects = listenToCollection('projects', setProjects);
    const unsubContracts = listenToCollection('contracts', setContracts);
    const unsubOrders = listenToCollection('orders', setOrders);
    const unsubProducts = listenToCollection('products', setVendorProducts);
    const unsubUnits = listenToCollection('industrial_units', setIndustrialUnits);
    const unsubLive = listenToCollection('live_products', setLiveProducts);
    const unsubBlockchain = listenToCollection('blocks', setBlockchain);
    const unsubMedia = listenToCollection('media_ledger', setMediaShards);
    const unsubSignals = listenToCollection('signals', setSignals);
    const unsubPulse = listenToPulse(setPulseMessage);

    return () => {
      unsubProjects(); unsubContracts(); unsubOrders(); unsubProducts();
      unsubUnits(); unsubLive(); unsubBlockchain(); unsubMedia();
      unsubSignals(); unsubPulse();
    };
  }, [user]);

  const renderView = () => {
    const currentUser = user || GUEST_STWD;
    const isGuest = !user;

    switch (view) {
      case 'auth': return <Login onLogin={(u) => { setUser(u); setView('dashboard'); }} />;
      case 'dashboard': return <Dashboard onNavigate={navigate} user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
      case 'sustainability': return <Sustainability user={currentUser} onNavigate={navigate} onMintEAT={handleEarnEAC} />;
      case 'economy': return <Economy user={currentUser} isGuest={isGuest} onSpendEAC={handleSpendEAC} onNavigate={navigate} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} projects={projects} notify={emitSignal} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={setUser!} initialSection={viewSection} />;
      case 'wallet': return <AgroWallet user={currentUser} isGuest={isGuest} onNavigate={navigate} onUpdateUser={setUser!} onSwap={async () => { handleEarnEAC(0, 'SWAP_EAT'); return true; }} onEarnEAC={handleEarnEAC} notify={emitSignal} transactions={transactions} initialSection={viewSection} />;
      case 'intelligence': return <Intelligence user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onOpenEvidence={() => setIsEvidenceOpen(true)} initialSection={viewSection} />;
      case 'community': return <Community user={currentUser} isGuest={isGuest} onContribution={() => {}} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'explorer': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} />;
      case 'ecosystem': return <Ecosystem user={currentUser} onDeposit={handleEarnEAC} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'industrial': return <Industrial user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} industrialUnits={industrialUnits} vendorProducts={vendorProducts} orders={orders} notify={emitSignal} collectives={[]} setCollectives={() => {}} onSaveProject={(p) => saveCollectionItem('projects', p)} setIndustrialUnits={() => {}} initialSection={viewSection} />;
      case 'investor': return <InvestorPortal user={currentUser} onUpdate={setUser!} onSpendEAC={handleSpendEAC} projects={projects} onNavigate={navigate} />;
      case 'profile': return <UserProfile user={currentUser} isGuest={isGuest} onUpdate={setUser!} onNavigate={navigate} signals={signals} setSignals={setSignals} notify={emitSignal} onLogin={() => setView('auth')} onLogout={handleLogout} onPermanentAction={handlePerformPermanentAction} initialSection={viewSection} />;
      case 'channelling': return <Channelling user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'media': return <MediaHub user={currentUser} userBalance={currentUser.wallet.balance} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} initialAction={viewSection} />;
      case 'crm': return <NexusCRM user={currentUser} onSpendEAC={handleSpendEAC} vendorProducts={vendorProducts} onNavigate={navigate} orders={orders} initialSection={viewSection} />;
      case 'tqm': return <TQMGrid user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} liveProducts={liveProducts} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'circular': return <CircularGrid user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} onNavigate={navigate} initialSection={viewSection} />;
      case 'tools': return <ToolsSection user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onOpenEvidence={(t) => { setActiveTaskForEvidence(t); setIsEvidenceOpen(true); }} tasks={[]} onSaveTask={(t) => saveCollectionItem('tasks', t)} notify={emitSignal} initialSection={viewSection} />;
      case 'research': return <ResearchInnovation user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'live_farming': return <LiveFarming user={currentUser} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={handleEarnEAC} onSaveProduct={(p) => saveCollectionItem('live_products', p)} onNavigate={navigate} notify={emitSignal} initialSection={viewSection} />;
      case 'contract_farming': return <ContractFarming user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} contracts={contracts} setContracts={setContracts} onSaveContract={(c) => saveCollectionItem('contracts', c)} />;
      case 'agrowild': return <Agrowild user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onPlaceOrder={(o) => saveCollectionItem('orders', o)} vendorProducts={vendorProducts} notify={emitSignal} />;
      case 'impact': return <Impact user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'animal_world': return <NaturalResources user={currentUser} type="animal_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'plants_world': return <NaturalResources user={currentUser} type="plants_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'aqua_portal': return <NaturalResources user={currentUser} type="aqua_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'soil_portal': return <NaturalResources user={currentUser} type="soil_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'air_portal': return <NaturalResources user={currentUser} type="air_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'intranet': return <IntranetPortal user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'cea_portal': return <CEA user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'biotech_hub': return <Biotechnology user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'permaculture_hub': return <Permaculture user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onEmitSignal={emitSignal} notify={emitSignal} initialSection={viewSection} />;
      case 'emergency_portal': return <EmergencyPortal user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} />;
      case 'agro_regency': return <AgroRegency user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'code_of_laws': return <CodeOfLaws user={currentUser} />;
      case 'agro_calendar': return <AgroCalendar user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} onNavigate={navigate} />;
      case 'chroma_system': return <ChromaSystem user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'envirosagro_store': return <EnvirosAgroStore user={currentUser} onSpendEAC={handleSpendEAC} onPlaceOrder={(o) => saveCollectionItem('orders', o)} />;
      case 'agro_value_enhancement': return <AgroValueEnhancement user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'digital_mrv': return <DigitalMRV user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onUpdateUser={setUser!} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'registry_handshake': return <RegistryHandshake user={currentUser} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'online_garden': return <OnlineGarden user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} notify={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} initialSection={viewSection} />;
      case 'farm_os': return <FarmOS user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} initialCode={osInitialCode} clearInitialCode={() => setOsInitialCode(null)} initialSection={viewSection} />;
      case 'network_signals': return <SignalCenter user={currentUser} signals={signals} setSignals={setSignals} onNavigate={navigate} initialSection={viewSection} />;
      case 'network': return <NetworkView />;
      case 'media_ledger': return <MediaLedger user={currentUser} shards={mediaShards} />;
      case 'agrolang': return <AgroLang user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onEmitSignal={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} initialSection={viewSection} />;
      case 'sitemap': return <Sitemap nodes={REGISTRY_NODES} onNavigate={navigate} />;
      case 'ai_analyst': return <AIAnalyst user={currentUser} onEmitSignal={emitSignal} onNavigate={navigate} />;
      case 'vendor': return <VendorPortal user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} vendorProducts={vendorProducts} onRegisterProduct={(p) => { setVendorProducts(prev => [p, ...prev]); saveCollectionItem('products', p); }} onNavigate={navigate} initialSection={viewSection} onUpdateProduct={(p) => { setVendorProducts(prev => prev.map(x => x.id === p.id ? p : x)); saveCollectionItem('products', p); }} onEmitSignal={emitSignal} />;
      case 'ingest': return <NetworkIngest user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'info': return <InfoPortal user={currentUser} onNavigate={navigate} onAcceptAll={() => handlePerformPermanentAction('ACCEPT_ALL_AGREEMENTS', 50, 'AGREEMENT_QUORUM_SYNC')} onPermanentAction={handlePerformPermanentAction} />;
      case 'settings': return <SettingsPortal user={currentUser} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'temporal_video': return <TemporalVideo user={currentUser} onNavigate={navigate} />;
      case 'robot': return <Robot user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} />;
      case 'network_genesis': return <NetworkGenesis user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      default: return <Dashboard onNavigate={navigate} user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
    }
  };

  const unreadSignalsCount = useMemo(() => signals.filter(s => !s.read).length, [signals]);

  if (isBooting) return <InitializationScreen onComplete={() => setIsBooting(false)} />;

  return (
    <div className="min-h-screen bg-[#050706] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden animate-in fade-in duration-1000">
      <div className="fixed top-0 left-0 right-0 z-[1000] h-8 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 h-full shrink-0">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[7px] font-black uppercase text-emerald-400 tracking-widest">NETWORK_PULSE</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-[7px] text-emerald-500/80 font-mono font-black uppercase tracking-widest">
            {pulseMessage} • {new Date().toISOString()} • STABILITY: 1.42x • CONSENSUS: 100% • 
          </div>
        </div>
      </div>

      <div className={`fixed top-8 left-0 bottom-0 z-[250] bg-black/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'} ${isMobileMenuOpen ? 'w-80 translate-x-0' : ''}`}>
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
                <SycamoreLogo size={32} className="text-black" />
             </div>
             {(isSidebarOpen || isMobileMenuOpen) && (
               <div className="animate-in fade-in slide-in-from-left-2">
                 <h1 className="text-lg font-black text-white italic tracking-tighter leading-none uppercase">Enviros<span className="text-emerald-400">Agro</span></h1>
                 <p className="text-[6px] text-slate-500 font-black uppercase tracking-0.4em mt-1 italic">Registry</p>
               </div>
             )}
           </div>
           {isMobileMenuOpen && <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white"><X size={20} /></button>}
        </div>

        <nav className="px-4 py-8 space-y-10">
           {REGISTRY_NODES.map((group) => (
             <div key={group.category} className="space-y-4">
                {(isSidebarOpen || isMobileMenuOpen) && <p className={`px-4 text-[7px] font-black uppercase tracking-[0.3em] text-slate-700 italic`}>{group.category}</p>}
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button key={item.id} onClick={() => navigate(item.id as ViewState)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${view === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                      <item.icon size={16} className={view === item.id ? 'text-white' : 'text-slate-500'} />
                      {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-left leading-none">{item.name}</span>}
                    </button>
                  ))}
                </div>
             </div>
           ))}
        </nav>
      </div>

      <main ref={mainContentRef} onScroll={(e) => handleScroll(e.currentTarget)} className={`transition-all duration-500 pt-14 pb-32 h-screen overflow-y-auto custom-scrollbar relative ${isSidebarOpen ? 'lg:pl-80 pr-4 lg:pr-10' : 'lg:pl-24 pr-4 lg:pr-10'} pl-4`}>
        <div className="fixed top-8 left-0 right-0 z-[200] h-0.5 pointer-events-none">
          <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%`, marginLeft: isSidebarOpen ? '20rem' : '5rem' }}></div>
        </div>

        <header className="flex justify-between items-center mb-6 md:mb-8 sticky top-0 bg-[#050706]/90 backdrop-blur-xl py-3 md:py-4 z-[150] px-2 -mx-2 border-b border-emerald-500/10 shadow-lg">
           <div className="flex items-center gap-4 overflow-hidden">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0">{isSidebarOpen ? <ChevronLeft size={18}/> : <Menu size={18}/>}</button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0"><Menu size={18}/></button>
              <div className="space-y-0.5 truncate max-w-[120px] sm:max-w-none">
                 <h2 className="text-sm sm:text-lg font-black text-white uppercase italic tracking-widest truncate leading-tight">{(view || '').replace(/_/g, ' ')}</h2>
                 <p className="text-[6px] sm:text-[8px] text-slate-600 font-mono tracking-widest uppercase truncate font-bold">STATUS: {user ? 'ANCHORED' : 'OBSERVER_MODE'}</p>
              </div>
           </div>
           
           <div className="flex-1 max-w-md mx-6 hidden md:block">
              <button onClick={() => setIsGlobalSearchOpen(true)} className="w-full h-10 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-slate-500 hover:border-emerald-500/40 hover:bg-white/10 transition-all group shadow-inner">
                 <div className="flex items-center gap-3">
                    <Search size={14} className="group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Search Multi-Ledger Registry...</span>
                 </div>
                 <div className="flex items-center gap-1.5 opacity-30">
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-mono">⌘</span>
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-mono">K</span>
                 </div>
              </button>
           </div>

           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Integrated AI Assistant Toggle (SycamoreLeaf Branding) */}
              <button 
                onClick={() => { setIsConsultantOpen(!isConsultantOpen); setIsGlobalSearchOpen(false); setIsInboxOpen(false); }}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative group ${isConsultantOpen ? 'bg-indigo-600 text-white border-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}
                title="Concierge Oracle"
              >
                 <SycamoreLogo size={18} className={isConsultantOpen ? "text-white" : "text-emerald-400"} />
                 <div className={`absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-black ${isConsultantOpen ? 'animate-none' : 'animate-pulse'}`}></div>
              </button>

              {/* User Inbox Trigger */}
              {user && (
                <div className="relative">
                  <button 
                    onClick={() => { setIsInboxOpen(!isInboxOpen); setIsGlobalSearchOpen(false); setIsConsultantOpen(false); }}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative ${isInboxOpen ? 'bg-indigo-600 text-white border-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    title="User Inbox"
                  >
                    <BellRing size={18} className={unreadSignalsCount > 0 ? 'animate-pulse' : ''} />
                    {unreadSignalsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[7px] font-black flex items-center justify-center rounded-full border border-black animate-in zoom-in">
                        {unreadSignalsCount > 9 ? '9+' : unreadSignalsCount}
                      </span>
                    )}
                  </button>

                  {/* Compact Signal Inbox Dropdown */}
                  {isInboxOpen && (
                    <div className="absolute top-14 right-0 w-80 md:w-96 glass-card rounded-3xl border border-white/10 bg-[#050706] shadow-3xl overflow-hidden animate-in slide-in-from-top-4 z-[500]">
                       <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                             <Mail size={12} /> INBOX_TERMINAL
                          </span>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={markAllSignalsAsRead} 
                              className="text-[7px] font-black text-emerald-400 hover:text-emerald-300 uppercase flex items-center gap-1.5 transition-colors"
                            >
                               <CheckCircle2 size={10} /> Mark All Read
                            </button>
                          </div>
                       </div>
                       <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                          {signals.filter(s => !s.read).slice(0, 5).length === 0 ? (
                            <div className="p-10 text-center opacity-30 italic text-[10px] uppercase font-black">No active shards.</div>
                          ) : (
                            signals.filter(s => !s.read).slice(0, 5).map(sig => (
                              <div 
                                key={sig.id} 
                                onClick={() => { navigate(sig.meta?.target as ViewState || 'network_signals'); setIsInboxOpen(false); }}
                                className={`p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-all border-l-4 group/msg ${sig.priority === 'critical' ? 'border-rose-600' : sig.priority === 'high' ? 'border-amber-500' : 'border-indigo-500'}`}
                              >
                                 <div className="flex items-center justify-between gap-3 mb-1">
                                    <div className="flex items-center gap-2">
                                       <span className="text-7px font-mono text-slate-700">{new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                       <span className={`text-[6px] font-black uppercase px-1.5 py-0.5 rounded ${sig.priority === 'critical' ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-600'}`}>{sig.priority}</span>
                                    </div>
                                    <button 
                                      onClick={(e) => markSignalAsRead(sig.id, e)}
                                      className="opacity-0 group-hover/msg:opacity-100 p-1 hover:bg-emerald-500/10 rounded text-emerald-500 transition-all"
                                    >
                                       <CheckCircle2 size={10} />
                                    </button>
                                 </div>
                                 <h5 className="text-[10px] font-black text-white uppercase italic truncate">{sig.title}</h5>
                                 <p className="text-[9px] text-slate-500 mt-1 line-clamp-1 italic">"{sig.message}"</p>
                              </div>
                            ))
                          )}
                       </div>
                       <button onClick={() => navigate('profile', 'signals')} className="w-full py-3 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Go to Steward Dossier</button>
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setIsGlobalSearchOpen(true)} className="md:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><Search size={16} className="text-slate-400" /></button>
              {user && <button onClick={() => setView('wallet')} className="px-3 py-2 glass-card rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 hover:bg-emerald-500/10 transition-all group"><Coins size={12} className="text-emerald-400 group-hover:rotate-12 transition-transform" /><span className="text-[8px] sm:text-[10px] font-mono font-black text-white">{(user?.wallet.balance || 0).toFixed(0)}</span></button>}
              <button onClick={() => setView('profile')} className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all shadow-xl overflow-hidden ${user ? 'border-white/10 bg-slate-800' : 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'}`}>
                 {user ? (<><div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-white/20 bg-black/40">{user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon size={12} className="text-slate-500 m-auto mt-1.5" />}</div><span className="text-[8px] font-black text-white hidden sm:block truncate max-w-[60px] uppercase italic">{user.name.split(' ')[0]}</span></>) : (<><UserPlus size={14} className="text-emerald-400" /><span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Sync</span></>)}
              </button>
           </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          {renderView()}
        </div>

        {/* --- VECTOR RETROGRADE & ADVANCE CONTROLS --- */}
        <footer className="mt-20 pt-8 border-t border-white/5 pb-12 flex flex-col items-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-500 px-4">
           {/* Primary Control Row */}
           <div className="flex w-full items-center justify-between gap-4">
              {/* VECTOR RETROGRADE (BACK) */}
              <button 
                onClick={goBack} 
                disabled={history.length === 0}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all active:scale-95 group/back ${history.length > 0 ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'border-white/5 text-slate-800 opacity-20 cursor-not-allowed'}`}
                title="Vector Retrograde"
              >
                 <ChevronLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                 <div className="flex flex-col items-start text-left hidden md:block">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none">Retrograde</span>
                    <span className="text-6px font-mono opacity-50 mt-1 uppercase">Prev_Vector</span>
                 </div>
              </button>

              {/* STRATEGIC SHARD DOCK - Quick Navigation Hub */}
              <div className="flex p-1 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-3xl">
                 {[
                   { id: 'dashboard', label: 'Command', icon: LayoutGrid },
                   { id: 'economy', label: 'Market', icon: Globe },
                   { id: 'wallet', label: 'Treasury', icon: Coins },
                   { id: 'intelligence', label: 'Science', icon: Microscope },
                   { id: 'impact', label: 'Resonance', icon: TrendingUp },
                   { id: 'sitemap', label: 'Matrix', icon: MapIcon }
                 ].map(shard => (
                   <button 
                     key={shard.id}
                     onClick={() => navigate(shard.id as ViewState)}
                     className={`p-3 rounded-xl transition-all group/shard relative ${view === shard.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                     title={shard.label}
                   >
                      <shard.icon size={16} />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] font-black uppercase tracking-widest rounded border border-white/10 opacity-0 group-hover/shard:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                         {shard.label}
                      </div>
                   </button>
                 ))}
              </div>

              {/* VECTOR ADVANCE (FORWARD) */}
              <button 
                onClick={goForward} 
                disabled={forwardHistory.length === 0}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all active:scale-95 group/fwd ${forwardHistory.length > 0 ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'border-white/5 text-slate-800 opacity-20 cursor-not-allowed'}`}
                title="Vector Advance"
              >
                 <div className="flex flex-col items-end text-right hidden md:block">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 transition-all">Advance</span>
                    <span className="text-6px font-mono opacity-50 mt-1 uppercase">Next_Vector</span>
                 </div>
                 <ChevronRight size={16} className="group-hover/fwd:translate-x-1 transition-transform" />
              </button>
           </div>

           {/* Secondary Branding Row */}
           <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 border-t border-white/5 pt-8 px-4 opacity-40">
              <div className="flex items-center gap-4">
                 <SycamoreLogo size={20} className="text-emerald-500" />
                 <div className="text-left">
                    <p className="text-9px font-black text-white uppercase italic tracking-widest leading-none">Enviros<span className="text-emerald-400">Agro</span></p>
                    <p className="text-[6px] text-slate-600 font-bold uppercase tracking-[0.4em] mt-1">Planetary_Regeneration_Grid</p>
                 </div>
              </div>

              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-7px text-slate-700 font-mono uppercase font-black">MATRIX_SYNC_OK</span>
                 </div>
                 <p className="text-7px text-slate-700 font-mono uppercase tracking-widest">© 2025 EA_ROOT_NODE</p>
                 <button onClick={() => navigate('info')} className="text-7px font-black text-slate-600 hover:text-white uppercase tracking-[0.4em]">SAFETY_REGISTRY</button>
              </div>
           </div>
        </footer>

        {showZenithButton && <button onClick={scrollToTop} className="fixed bottom-32 right-6 sm:right-10 p-3.5 sm:p-4 agro-gradient rounded-xl sm:rounded-2xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all z-[400] border border-white/20 animate-in fade-in zoom-in duration-300"><LucideIcons.ArrowUp size={20} /></button>}
      </main>

      <div className="fixed top-24 right-4 sm:right-10 z-[500] space-y-4 max-w-[280px] sm:max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 sm:p-5 rounded-2xl border shadow-3xl flex items-start gap-3 pointer-events-auto animate-in slide-in-from-right duration-500 ${n.type === 'error' ? 'bg-rose-950/80 border-rose-500/30 text-rose-500' : n.type === 'warning' ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' : 'bg-black/95 border-emerald-500/20 text-emerald-400'}`}>
            {n.type === 'error' ? <LucideIcons.ShieldAlert className="shrink-0 mt-0.5" size={16} /> : <LucideIcons.Info className="shrink-0 mt-0.5" size={16} />}
            <div className="flex-1 space-y-0.5"><h5 className="text-[9px] font-black uppercase tracking-widest">{n.title}</h5><p className="text-[9px] italic text-slate-300 leading-tight">{n.message}</p></div>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-slate-700 hover:text-white"><X size={12}/></button>
          </div>
        ))}
      </div>

      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} onNavigate={navigate} vendorProducts={vendorProducts} />
      <EvidenceModal isOpen={isEvidenceOpen} onClose={() => setIsEvidenceOpen(false)} user={user || GUEST_STWD} onMinted={(val) => handleEarnEAC(val, 'FIELD_EVIDENCE_INGEST')} onNavigate={navigate} taskToIngest={activeTaskForEvidence} />
      <LiveVoiceBridge isOpen={false} isGuest={!user} onClose={() => {}} />
      <FloatingConsultant isOpen={isConsultantOpen} onClose={() => setIsConsultantOpen(false)} user={user || GUEST_STWD} onNavigate={navigate} />
    </div>
  );
};

/**
 * Added InitializationScreen component to fix line 316 error.
 * Provides an industrial-style loading sequence for the OS boot phase.
 */
const InitializationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Sycamore OS...');

  useEffect(() => {
    const steps = [
      { p: 10, s: 'Loading Kernel Shards...' },
      { p: 30, s: 'Establishing Mesh Handshake...' },
      { p: 50, s: 'Syncing Registry Consensus...' },
      { p: 70, s: 'Mounting Industrial Matrix...' },
      { p: 90, s: 'Finalizing m-Constant Calibration...' },
      { p: 100, s: 'Registry Synchronized.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatus(steps[currentStep].s);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[2000] bg-[#050706] flex flex-col items-center justify-center space-y-12">
      <div className="relative">
        <SycamoreLogo size={120} className="text-emerald-500 animate-pulse" />
        <div className="absolute inset-0 border-4 border-dashed border-emerald-500/20 rounded-full animate-spin-slow scale-150"></div>
      </div>
      <div className="w-64 space-y-4">
        <div className="flex justify-between items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
           <span>{status}</span>
           <span>{progress}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5">
           <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Added GlobalSearch component to fix line 573 error.
 * Implements a registry-wide search interface for industrial assets.
 */
const GlobalSearch: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (v: ViewState, s?: string) => void; vendorProducts: VendorProduct[] }> = ({ isOpen, onClose, onNavigate, vendorProducts }) => {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;

  const results = query.trim() ? vendorProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];

  return (
    <div className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-xl flex items-start justify-center pt-32 px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl glass-card rounded-[40px] border-2 border-emerald-500/20 bg-black/60 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="p-8 flex items-center gap-6 border-b border-white/5">
           <Search size={24} className="text-emerald-400" />
           <input 
             autoFocus
             type="text" 
             value={query}
             onChange={e => setQuery(e.target.value)}
             placeholder="Search Multi-Ledger Registry..."
             className="flex-1 bg-transparent border-none text-2xl font-black text-white outline-none italic placeholder:text-stone-900"
           />
           <button onClick={onClose} className="p-3 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X size={24}/></button>
        </div>
        <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
           {results.length > 0 ? (
             results.map(r => (
               <div key={r.id} onClick={() => { onNavigate('economy'); onClose(); }} className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-emerald-500/30 cursor-pointer transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center"><Package size={24} className="text-slate-500 group-hover:text-emerald-400" /></div>
                     <div>
                        <h4 className="text-lg font-black text-white uppercase italic">{r.name}</h4>
                        <p className="text-[10px] text-slate-600 font-mono">{r.id}</p>
                     </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-800 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
               </div>
             ))
           ) : (
             <div className="py-20 text-center opacity-20 italic uppercase tracking-[0.4em] font-black">Awaiting Ingest...</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default App;
