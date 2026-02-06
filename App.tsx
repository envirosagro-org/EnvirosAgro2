import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Layers, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, OrderStatus, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, NotificationType } from './types';
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
import { 
  syncUserToCloud, 
  auth, 
  getStewardProfile, 
  signOutSteward, 
  broadcastPulse, 
  listenForGlobalEchoes, 
  saveCollectionItem, 
  onAuthStateChanged,
  listenToCollection
} from './services/firebaseService';
import { createGenesisBlock, mineBlock, VALIDATORS } from './services/blockchainService';

export interface SignalShard {
  id: string;
  type: 'system' | 'engagement' | 'network' | 'commerce' | 'pulse';
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

const GUEST_STWD: User = {
  name: 'Local Steward',
  email: 'guest@local.node',
  esin: 'EA-GUEST-NODE-0000',
  mnemonic: 'local development node only no recovery required',
  regDate: new Date().toLocaleDateString(),
  role: 'Explorer / Viewer',
  location: 'Localhost Node',
  wallet: {
    balance: 500,
    eatBalance: 0,
    exchangeRate: 600,
    bonusBalance: 0,
    tier: 'Seed',
    lifetimeEarned: 0,
    linkedProviders: [],
    miningStreak: 1,
    lastSyncDate: new Date().toISOString().split('T')[0],
    pendingSocialHarvest: 0,
    stakedEat: 0
  },
  metrics: {
    agriculturalCodeU: 1.0,
    timeConstantTau: 8.5,
    sustainabilityScore: 50,
    socialImmunity: 60,
    viralLoadSID: 0,
    baselineM: 8.5
  },
  skills: { 'General': 10 },
  isReadyForHire: false
};

const REGISTRY_NODES = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
      { id: 'network', name: 'Network Topology', icon: NetworkIcon },
      { id: 'farm_os', name: 'Farm OS', icon: Binary },
      { id: 'agrolang', name: 'AgroLang IDE', icon: Code2 },
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
    category: 'Information & Shards',
    items: [
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 }
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
    category: 'Mission & Capital',
    items: [
      { id: 'contract_farming', name: 'Contract Farming', icon: Handshake },
      { id: 'investor', name: 'Vetting Registry', icon: Landmark },
      { id: 'agrowild', name: 'Agrowild Portal', icon: PawPrint }
    ]
  },
  {
    category: 'Innovation Hub',
    items: [
      { id: 'research', name: 'Invention Ledger', icon: Zap },
      { id: 'biotech_hub', name: 'Genetic Decoder', icon: Dna },
      { id: 'permaculture_hub', name: 'Design Resilience', icon: Compass },
      { id: 'cea_portal', name: 'Controlled Enviro', icon: BoxSelect }
    ]
  },
  {
    category: 'Governance & Infrastructure',
    items: [
      { id: 'registry_handshake', name: 'Registry Handshake', icon: QrCode },
      { id: 'vendor', name: 'Supplier Command', icon: Warehouse },
      { id: 'ingest', name: 'Network Ingest', icon: Cable },
      { id: 'emergency_portal', name: 'Crisis Command', icon: Siren },
      { id: 'agro_regency', name: 'Agro Regency', icon: Infinity },
      { id: 'intranet', name: 'Audit Center', icon: ShieldCheck },
      { id: 'envirosagro_store', name: 'Proprietary Store', icon: Store }
    ]
  },
  {
    category: 'Heritage & Community',
    items: [
      { id: 'profile', name: 'Identity Dossier', icon: UserIcon },
      { id: 'community', name: 'Heritage Hub', icon: Users },
      { id: 'info', name: 'Portal Info', icon: Info }
    ]
  }
];

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState<User>(GUEST_STWD);
  const [isGuest, setIsGuest] = useState(true);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Command & Strategy': true
  });
  const [notifications, setNotifications] = useState<NotificationShard[]>([]);
  const [pendingShellCode, setPendingShellCode] = useState<string | null>(null);

  // BLOCKCHAIN & NETWORK
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [mempool, setMempool] = useState<AgroTransaction[]>([]);
  const [isMining, setIsMining] = useState(false);
  const [globalEchoes, setGlobalEchoes] = useState<any[]>([]);

  // REGISTRY ENTITIES
  const [transactions, setTransactions] = useState<AgroTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([
    { id: 'VPR-882', name: 'Regenerative Maize Shards v4', description: 'High-resilience verified seeds.', price: 45, stock: 1200, category: 'Seed', thrust: 'Environmental', supplierEsin: 'EA-SUPP-X1', supplierName: 'Green Root Node', supplierType: 'RAW_MATERIALS', status: 'AUTHORIZED', timestamp: '2d ago', image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400' }
  ]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([]);
  const [contracts, setContracts] = useState<FarmingContract[]>([
    { id: 'CTR-842', investorEsin: 'EA-INV-01', investorName: 'Neo-Agro Capital', productType: 'Maize Farming Node', requiredLand: '50-100 Hectares', requiredLabour: '20 Steward Units', budget: 50000, status: 'Open', applications: [], capitalIngested: false }
  ]);
  const [projects, setProjects] = useState<AgroProject[]>([
    { id: 'PRJ-NE-291', name: "Bantu Regenerative Cluster", adminEsin: 'EA-ADMIN-X842', description: "Scaling ancient Bantu irrigation techniques using IoT telemetry.", thrust: "Societal", status: 'Execution', totalCapital: 500000, fundedAmount: 320000, batchesClaimed: 0, totalBatches: 10, progress: 20, roiEstimate: 15, collateralLocked: 250000, profitsAccrued: 12500, investorShareRatio: 0.20, performanceIndex: 88, memberCount: 7, isPreAudited: true, isPostAudited: true }
  ]);
  const [networkSignals, setNetworkSignals] = useState<SignalShard[]>([]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const notify = useCallback((type: NotificationType, title: string, message: string, duration = 5000, actionLabel?: string, actionIcon?: any, meta?: any) => {
    const id = `SHARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newNotif: NotificationShard = { id, type, title, message, duration, actionLabel, actionIcon, meta };
    
    setNotifications(prev => [newNotif, ...prev]);

    const signal: SignalShard = {
      id: `SIG-${id}`,
      type: type === 'success' ? 'commerce' : 'system',
      title: title,
      message: message,
      timestamp: new Date().toISOString(),
      read: false,
      priority: type === 'error' ? 'high' : 'medium',
      actionLabel,
      actionIcon,
      meta
    };
    setNetworkSignals(prev => [signal, ...prev]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  // HYDRATION & RECOVERY
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        const profile = await getStewardProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
          setIsGuest(false);
          setIsCloudSynced(true);
          notify('success', 'REGISTRY_SYNC', 'Node identification anchored to HQ cluster.');
        }
      } else {
        const saved = localStorage.getItem('agro_steward');
        if (saved) {
           const parsed = JSON.parse(saved);
           setUser(parsed);
           setIsGuest(parsed.esin.startsWith('EA-GUEST'));
        }
      }
      setIsBooting(false);
    });
    return () => unsubAuth();
  }, [notify]);

  // CLOUD REGISTRY LISTENERS
  useEffect(() => {
    if (isGuest || !auth.currentUser) return;
    const unsubs = [
      listenToCollection('transactions', (items) => setTransactions(items as AgroTransaction[])),
      listenToCollection('orders', (items) => setOrders(items as Order[])),
      listenToCollection('projects', (items) => setProjects(items as AgroProject[])),
      listenToCollection('contracts', (items) => setContracts(items as FarmingContract[])),
      listenToCollection('signals', (items) => setNetworkSignals(items as SignalShard[])),
      listenForGlobalEchoes(setGlobalEchoes)
    ];
    return () => unsubs.forEach(u => u());
  }, [isGuest]);

  const addPulse = useCallback((msg: string) => {
    if (!isGuest && user) broadcastPulse(user.esin, msg);
  }, [isGuest, user]);

  const commitToBlockchain = useCallback(async (txs: AgroTransaction[]) => {
    setIsMining(true);
    const lastBlock = blockchain[0] || await createGenesisBlock();
    const validator = VALIDATORS[Math.floor(Math.random() * VALIDATORS.length)];
    await new Promise(r => setTimeout(r, 2000));
    const newBlock = await mineBlock(lastBlock, txs, validator);
    setBlockchain(prev => [newBlock, ...prev]);
    setIsMining(false);
    addPulse(`Registry block ${newBlock.hash.substring(0, 8)} finalized by ${validator}`);
    notify('success', 'BLOCK_FINALIZED', `Shard commit successful. Block hash: ${newBlock.hash.substring(0, 12)}...`);
  }, [blockchain, addPulse, notify]);

  const pushToMempool = useCallback((tx: AgroTransaction) => {
    setMempool(prev => {
        const updated = [...prev, tx];
        if (updated.length >= 3) {
            commitToBlockchain(updated);
            return [];
        }
        return updated;
    });
  }, [commitToBlockchain]);

  const handleUpdateUser = useCallback(async (updatedUser: User) => {
    const m = updatedUser.metrics.timeConstantTau;
    updatedUser.wallet.exchangeRate = BASE_EXCHANGE_RATE * (1 + (PENALTY_FACTOR / m));
    setUser(updatedUser);
    localStorage.setItem('agro_steward', JSON.stringify(updatedUser));
    if (!isGuest) await syncUserToCloud(updatedUser);
  }, [isGuest]);

  const anchorTransaction = useCallback(async (tx: Partial<AgroTransaction>) => {
    const newTx: AgroTransaction = {
      id: tx.id || `TX-${Math.random().toString(36).substring(7).toUpperCase()}`,
      type: tx.type || 'Transfer',
      farmId: tx.farmId || 'NODE-CORE',
      details: tx.details || 'Standard Registry Entry',
      value: tx.value || 0,
      unit: tx.unit || 'EAC'
    };
    if (!isGuest) await saveCollectionItem('transactions', newTx);
    pushToMempool(newTx);
    return newTx;
  }, [isGuest, pushToMempool]);

  const earnEAC = useCallback(async (baseAmount: number, reason: string) => {
    if (!user) return;
    const multiplier = user.metrics.timeConstantTau / 8.5; 
    const finalAmount = Math.ceil(baseAmount * multiplier);
    await anchorTransaction({ type: 'Reward', details: reason, value: finalAmount, unit: 'EAC' });
    handleUpdateUser({ 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: user.wallet.balance + finalAmount, 
        lifetimeEarned: user.wallet.lifetimeEarned + finalAmount 
      } 
    });
    addPulse(`Registry reward: +${finalAmount} EAC - ${reason}`);
    notify('success', 'REWARD_MINTED', `+${finalAmount} EAC sharded to treasury: ${reason}`);
  }, [user, handleUpdateUser, anchorTransaction, addPulse, notify]);

  const spendEAC = async (amount: number, reason: string) => {
    if (user.wallet.balance < amount) {
      notify('error', 'LIQUIDITY_VOID', 'Insufficient EAC for registry commitment.');
      return false;
    }
    await anchorTransaction({ type: 'Burn', details: reason, value: -amount, unit: 'EAC' });
    handleUpdateUser({ ...user, wallet: { ...user.wallet, balance: user.wallet.balance - amount } });
    notify('info', 'CAPITAL_ANCHORED', `${amount} EAC committed to: ${reason}`);
    return true;
  };

  const swapEACforEAT = async (eatAmount: number) => {
    const cost = eatAmount * user.wallet.exchangeRate;
    if (user.wallet.balance < cost) {
      notify('error', 'LIQUIDITY_VOID', 'Insufficient EAC for equity conversion.');
      return false;
    }
    handleUpdateUser({ 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: user.wallet.balance - cost, 
        eatBalance: user.wallet.eatBalance + eatAmount 
      } 
    });
    await anchorTransaction({ type: 'NodeSwap', details: 'EAC to EAT conversion', value: eatAmount, unit: 'EAT' });
    notify('success', 'EQUITY_ANCHORED', `Converted EAC to ${eatAmount.toFixed(4)} EAT gold shards.`);
    return true;
  };

  const handleLogout = () => {
    signOutSteward();
    localStorage.removeItem('agro_steward');
    setUser(GUEST_STWD);
    setIsGuest(true);
    setActiveView('dashboard');
    notify('info', 'SESSION_TERMINATED', 'Node disconnected from HQ cluster.');
  };

  const handlePlaceOrder = async (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substring(7).toUpperCase()}`,
      itemId: orderData.itemId || 'unknown',
      itemName: orderData.itemName || 'Asset Shard',
      itemType: orderData.itemType || 'Product',
      itemImage: orderData.itemImage,
      cost: orderData.cost || 0,
      status: 'ORD_PLACED',
      supplierEsin: orderData.supplierEsin || 'EA-ORG-CORE',
      customerEsin: user.esin,
      timestamp: new Date().toISOString(),
      trackingHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      isReceiptIssued: true,
      isPrnSigned: false,
      sourceTab: orderData.sourceTab || 'market'
    };
    if (!isGuest) await saveCollectionItem('orders', newOrder);
    await spendEAC(newOrder.cost, `PROCURING_${newOrder.itemName}`);
    addPulse(`Procurement Handshake: ${newOrder.itemName}`);
    notify('success', 'PROCUREMENT_START', `Initialized order for ${newOrder.itemName}. Tracking: ${newOrder.id}`);
  };

  const handleUpdateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, meta?: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...meta } : o));
    if (!isGuest) {
       const o = orders.find(ord => ord.id === orderId);
       if (o) saveCollectionItem('orders', { ...o, status, ...meta });
    }
    notify('info', 'LIFECYCLE_UPDATE', `Order ${orderId} promoted to ${status.replace(/_/g, ' ')}.`);
  }, [isGuest, orders, notify]);

  const handleRegisterProduct = useCallback(async (product: VendorProduct) => {
    setVendorProducts(prev => [product, ...prev]);
    if (!isGuest) {
      try {
        await saveCollectionItem('products', product);
      } catch (e) {}
    }
    addPulse(`New asset registered: ${product.name}`);
    notify('success', 'ASSET_ANCHORED', `Provisioned ${product.name} to the global cloud catalogue.`);
  }, [isGuest, addPulse, notify]);

  const handleNavigate = (newView: ViewState) => {
    setActiveView(newView);
    setIsMobileMenuOpen(false);
    const group = REGISTRY_NODES.find(g => g.items.some(i => i.id === newView));
    if (group) setExpandedGroups(prev => ({ ...prev, [group.category]: true }));
  };

  const handleExecuteToShell = (code: string) => {
    setPendingShellCode(code);
    setActiveView('farm_os');
  };

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const SidebarContent = ({ forceLabel = false }: { forceLabel?: boolean }) => (
    <>
      <div className="p-4 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <Layers className="text-emerald-500 w-8 h-8 shrink-0" />
          {(isSidebarOpen || forceLabel) && (
             <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">Enviros<span className="text-emerald-400">Agro</span></span>
                <span className="text-[7px] font-black tracking-[0.6em] text-slate-500 uppercase ml-0.5 block">Industrial OS</span>
             </div>
          )}
        </div>
        {isMobile && <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>}
      </div>
      <div className="flex-1 mt-6 space-y-4 px-2 md:px-4 overflow-y-auto custom-scrollbar pb-10">
        {REGISTRY_NODES.map((group, idx) => {
          const isExpanded = expandedGroups[group.category];
          const hasActiveInGroup = group.items.some(item => item.id === activeView);
          return (
            <div key={idx} className="space-y-1">
               {(isSidebarOpen || forceLabel) ? (
                 <button onClick={() => toggleGroup(group.category)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-all group/header">
                    <h5 className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] ${isExpanded || hasActiveInGroup ? 'text-emerald-400' : 'text-slate-300'}`}>{group.category}</h5>
                    <ChevronDown size={10} className={`text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                 </button>
               ) : <div className="h-px bg-white/5 mx-4 my-4" />}
               <div className={`space-y-1 overflow-hidden transition-all duration-500 ${isExpanded || !isSidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                 {group.items.map((item) => (
                   <button key={item.id} onClick={() => handleNavigate(item.id as ViewState)} className={`w-full flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all ${activeView === item.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}>
                     <item.icon className={`w-4 h-4 shrink-0 ${activeView === item.id ? 'text-white' : 'text-slate-400'}`} />
                     {(isSidebarOpen || forceLabel) && <span className="font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] truncate">{item.name}</span>}
                   </button>
                 ))}
               </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 md:p-6 border-t border-white/5 space-y-4 bg-black/20">
        <button onClick={() => { setIsVoiceBridgeOpen(true); if(isMobile) setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-4 md:p-5 agro-gradient rounded-xl md:rounded-2xl text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
          <Mic size={16} /> {(isSidebarOpen || forceLabel) && <span>ORACLE VOICE</span>}
        </button>
      </div>
    </>
  );

  if (isBooting) return (
    <div className="fixed inset-0 z-[500] bg-[#050706] flex flex-col items-center justify-center">
      <Layers className="w-20 h-20 text-emerald-500 animate-float mb-8" />
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">ENVIROS<span className="text-emerald-400">AGRO OS</span></h1>
      <div className="w-48 h-1 bg-white/5 rounded-full mt-6 overflow-hidden"><div className="h-full bg-emerald-500 animate-boot-progress"></div></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#050706] text-slate-200">
      <aside className={`hidden lg:flex ${isSidebarOpen ? 'w-80' : 'w-24'} glass-card border-r border-white/5 flex flex-col z-50 transition-all duration-500 bg-black/60`}>
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#050706] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-300">
            <SidebarContent forceLabel />
          </aside>
        </div>
      )}

      {/* REFINED GLOBAL NOTIFICATION SHARD BLOCK */}
      <div className="fixed top-20 right-4 md:right-8 z-[1000] flex flex-col gap-3 w-full max-w-[calc(100%-2rem)] md:max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right-10 duration-500">
             <div className={`glass-card p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-2 shadow-3xl flex items-start gap-4 md:gap-5 relative overflow-hidden bg-black/95 ${
               n.type === 'success' ? 'border-emerald-500/40' : 
               n.type === 'error' ? 'border-rose-500/40' : 
               n.type === 'warning' ? 'border-amber-500/40' : 
               'border-indigo-500/40'
             }`}>
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
                   <div className="w-full h-1 bg-white absolute top-0 animate-scan"></div>
                </div>

                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${
                   n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                   n.type === 'error' ? 'bg-rose-500/10 text-rose-500' : 
                   n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                   'bg-indigo-500/10 text-indigo-400'
                }`}>
                   {n.type === 'success' ? <BadgeCheck size={20} /> : 
                    n.type === 'error' ? <ShieldAlert size={20} /> : 
                    n.type === 'warning' ? <AlertTriangle size={20} /> : 
                    <Activity size={20} />}
                </div>

                <div className="flex-1 space-y-1 pr-4">
                   <h5 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{n.title}</h5>
                   <p className="text-xs md:text-sm font-medium text-white italic leading-relaxed">"{n.message}"</p>
                   
                   {n.actionLabel && (
                     <div className="pt-2 animate-in fade-in duration-700">
                        <button 
                          onClick={() => {
                            if (n.meta?.target) handleNavigate(n.meta.target);
                            setNotifications(prev => prev.filter(item => item.id !== n.id));
                          }}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl pointer-events-auto"
                        >
                           {n.actionIcon ? <n.actionIcon size={10} /> : <FileText size={10} />}
                           {n.actionLabel}
                        </button>
                     </div>
                   )}

                   <p className="text-[7px] md:text-[8px] font-mono text-slate-700 font-bold uppercase mt-2">REF: 0x{n.id.split('-')[1] || n.id.substring(0,6)}</p>
                </div>

                <button 
                  onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                  className="absolute top-3 right-3 p-1.5 text-slate-700 hover:text-white transition-all pointer-events-auto"
                >
                   <X size={12} />
                </button>

                <div className="absolute bottom-0 left-0 h-0.5 md:h-1 bg-white/5 w-full">
                   <div 
                    className={`h-full transition-all duration-[5000ms] ease-linear ${
                      n.type === 'success' ? 'bg-emerald-500' : 
                      n.type === 'error' ? 'bg-rose-500' : 
                      n.type === 'warning' ? 'bg-amber-500' : 
                      'bg-indigo-500'
                    }`}
                    style={{ width: '0%', animation: 'shrink 5s linear forwards' }}
                   ></div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="flex justify-between items-center bg-black/60 backdrop-blur-xl z-40 py-2 px-4 md:px-8 border-b border-white/5 h-16 md:h-20 shrink-0">
          <button onClick={() => isMobile ? setIsMobileMenuOpen(true) : setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-emerald-500 border border-white/10 rounded-lg md:rounded-xl"><Menu size={18} /></button>
          <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase italic">{activeView.replace(/_/g, ' ').toUpperCase()} SHARD</h1>
          <div className="flex items-center gap-3 md:gap-4">
             {isCloudSynced ? <ShieldCheck className="text-emerald-400" size={18} /> : <Loader2 className="text-blue-400 animate-spin" size={18} />}
             <button onClick={() => handleNavigate('profile')} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-black overflow-hidden shadow-inner">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Biometric" /> : user.name[0]}
             </button>
          </div>
        </header>

        <div className="bg-emerald-500/5 border-y border-white/5 p-1.5 px-4 md:px-8 overflow-hidden shrink-0">
           <div className="whitespace-nowrap animate-marquee text-[8px] md:text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest">
             {globalEchoes.map(e => `[${e.esin?.split('-')[1] || 'NODE'}] ${e.message}`).join(' • ')}
           </div>
        </div>

        <div className="p-4 md:p-8 flex-1 max-w-[1920px] mx-auto w-full">
          {activeView === 'dashboard' && <Dashboard user={user} isGuest={isGuest} onNavigate={handleNavigate} orders={orders} blockchain={blockchain} isMining={isMining} notify={notify} />}
          {activeView === 'network' && <NetworkView />}
          {activeView === 'wallet' && <AgroWallet user={user} isGuest={isGuest} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} onSwap={swapEACforEAT} onEarnEAC={earnEAC} transactions={transactions} notify={notify} />}
          {activeView === 'sustainability' && <Sustainability user={user} onNavigate={handleNavigate} onMintEAT={(v: number) => earnEAC(v, 'RESONANCE_IMPROVE')} notify={notify} />}
          {activeView === 'economy' && <Economy user={user} isGuest={isGuest} onNavigate={handleNavigate} onSpendEAC={spendEAC} vendorProducts={vendorProducts} onPlaceOrder={handlePlaceOrder} projects={projects} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={handleUpdateUser} notify={notify} />}
          {activeView === 'industrial' && <Industrial user={user} industrialUnits={industrialUnits} setIndustrialUnits={setIndustrialUnits} onSpendEAC={spendEAC} onNavigate={handleNavigate} collectives={[]} setCollectives={() => {}} onInitializeLiveProcess={(p) => setLiveProducts([p as any, ...liveProducts])} notify={notify} />}
          {activeView === 'intelligence' && <Intelligence user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} onOpenEvidence={() => setIsEvidenceModalOpen(true)} />}
          {activeView === 'code_of_laws' && <CodeOfLaws user={user} />}
          {activeView === 'chroma_system' && <ChromaSystem user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'agro_calendar' && <AgroCalendar user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'impact' && <Impact user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={earnEAC} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'profile' && <UserProfile user={user} isGuest={isGuest} onUpdate={handleUpdateUser} onLogout={handleLogout} signals={networkSignals} setSignals={setNetworkSignals} onLogin={u => { setUser(u); setIsGuest(false); }} onNavigate={handleNavigate} />}
          {activeView === 'explorer' && <Explorer blockchain={blockchain} isMining={isMining} onPulse={addPulse} user={user} />}
          {activeView === 'community' && <Community user={user} isGuest={isGuest} onContribution={(type, cat) => earnEAC(5, `CONTRIBUTION_${type.toUpperCase()}_${cat.toUpperCase()}`)} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'live_farming' && <LiveFarming user={user} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={earnEAC} onNavigate={handleNavigate} notify={notify} />}
          {activeView === 'tqm' && <TQMGrid user={user} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} onNavigate={handleNavigate} liveProducts={liveProducts} notify={notify} />}
          {activeView === 'crm' && <NexusCRM user={user} onSpendEAC={spendEAC} vendorProducts={vendorProducts} onNavigate={handleNavigate} orders={orders} />}
          {activeView === 'circular' && <CircularGrid user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} notify={notify} />}
          {activeView === 'tools' && <ToolsSection user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onOpenEvidence={(task) => { setIsEvidenceModalOpen(true); }} notify={notify} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} contracts={contracts} setContracts={setContracts} onInitializeLiveProcess={(p) => setLiveProducts([p as any, ...liveProducts])} notify={notify} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} onSpendEAC={spendEAC} projects={projects} onNavigate={handleNavigate} notify={notify} />}
          {activeView === 'agrowild' && <Agrowild user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'research' && <ResearchInnovation user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'biotech_hub' && <Biotechnology user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'permaculture_hub' && <Permaculture user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'cea_portal' && <CEA user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'emergency_portal' && <EmergencyPortal user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'agro_regency' && <AgroRegency user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'intranet' && <IntranetPortal user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'envirosagro_store' && <EnvirosAgroStore user={user} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} onNavigate={handleNavigate} />}
          {activeView === 'media' && <MediaHub user={user} userBalance={user.wallet.balance} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'channelling' && <Channelling user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'info' && <InfoPortal onNavigate={handleNavigate} />}
          {activeView === 'ingest' && <NetworkIngest user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'vendor' && <VendorPortal user={user} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} vendorProducts={vendorProducts} onRegisterProduct={handleRegisterProduct} onNavigate={handleNavigate} />}
          {activeView === 'agro_value_enhancement' && <AgroValueEnhancement user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} liveProducts={liveProducts} orders={orders} />}
          {activeView === 'digital_mrv' && <DigitalMRV user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'registry_handshake' && <RegistryHandshake user={user} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'online_garden' && <OnlineGarden user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} notify={notify} />}
          {activeView === 'farm_os' && <FarmOS user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} initialCode={pendingShellCode} clearInitialCode={() => setPendingShellCode(null)} />}
          {activeView === 'media_ledger' && <MediaLedger user={user} />}
          {activeView === 'agrolang' && <AgroLang user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onExecuteToShell={handleExecuteToShell} />}
          {['animal_world', 'plants_world', 'aqua_portal', 'soil_portal', 'air_portal'].includes(activeView) && (
            <NaturalResources user={user} type={activeView as ViewState} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} />
          )}
        </div>
      </main>

      <EvidenceModal isOpen={isEvidenceModalOpen} onClose={() => setIsEvidenceModalOpen(false)} user={user} onNavigate={handleNavigate} onMinted={(v) => earnEAC(v, 'EVIDENCE_VERIFIED')} />
      <FloatingConsultant user={user} />
      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} isGuest={isGuest} onClose={() => setIsVoiceBridgeOpen(false)} />
      
      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default App;
