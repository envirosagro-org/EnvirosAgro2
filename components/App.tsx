// This root App.tsx is the primary node orchestrator.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Layers, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, OrderStatus, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction } from '../types';
import Dashboard from './Dashboard';
import Sustainability from './Sustainability';
import Economy from './Economy';
import Industrial from './Industrial';
import Intelligence from './Intelligence';
import Community from './Community';
import Explorer from './Explorer';
import Ecosystem from './Ecosystem';
import MediaHub from './MediaHub';
import InfoPortal from './InfoPortal';
import Login from './Login';
import AgroWallet from './AgroWallet';
import UserProfile from './UserProfile';
import InvestorPortal from './InvestorPortal';
import VendorPortal from './VendorPortal';
import NetworkIngest from './NetworkIngest';
import ToolsSection from './ToolsSection';
import LiveVoiceBridge from './LiveVoiceBridge';
import Channelling from './Channelling';
import EvidenceModal from './EvidenceModal';
import CircularGrid from './CircularGrid';
import NexusCRM from './NexusCRM';
import TQMGrid from './TQMGrid';
import ResearchInnovation from './ResearchInnovation';
import LiveFarming from './LiveFarming';
import ContractFarming from './ContractFarming';
import Agrowild from './Agrowild';
import FloatingConsultant from './FloatingConsultant';
import Impact from './Impact';
import NaturalResources from './NaturalResources';
import IntranetPortal from './IntranetPortal';
import EnvirosAgroStore from './EnvirosAgroStore';
import CEA from './CEA';
import Biotechnology from './Biotechnology';
import Permaculture from './Permaculture';
import EmergencyPortal from './EmergencyPortal';
import AgroRegency from './AgroRegency';
import CodeOfLaws from './CodeOfLaws';
import AgroCalendar from './AgroCalendar';
import ChromaSystem from './ChromaSystem';
import AgroValueEnhancement from './AgroValueEnhancement';
import DigitalMRV from './DigitalMRV';
import RegistryHandshake from './RegistryHandshake';
import OnlineGarden from './OnlineGarden';
import FarmOS from './FarmOS';
import NetworkView from './NetworkView';
import { 
  syncUserToCloud, 
  auth, 
  getStewardProfile, 
  signOutSteward, 
  broadcastPulse, 
  listenForGlobalEchoes, 
  saveCollectionItem, 
  fetchCollection,
  onAuthStateChanged 
} from '../services/firebaseService';
import { createGenesisBlock, mineBlock, VALIDATORS } from '../services/blockchainService';

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
  const [syncError, setSyncError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Command & Strategy': true
  });

  // BLOCKCHAIN STATE
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [mempool, setMempool] = useState<AgroTransaction[]>([]);
  const [isMining, setIsMining] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  
  const [localPulses, setLocalPulses] = useState<string[]>(["Node sequence initialized.", "Registry synchronized locally."]);
  const [globalEchoes, setGlobalEchoes] = useState<any[]>([]);

  const pulseMarquee = useMemo(() => {
    const echoes = globalEchoes.map(e => `[${e.esin?.split('-')[1] || 'UNKN'}] ${e.message}`);
    const blockUpdates = blockchain.length > 0 ? [`Block #${blockchain.length + 428812} finalized by ${blockchain[0].validator}`] : [];
    return [...blockUpdates, ...localPulses, ...echoes].join(' • ');
  }, [localPulses, globalEchoes, blockchain]);

  const addPulse = useCallback((msg: string) => {
    setLocalPulses(prev => [msg, ...prev].slice(0, 5));
    if (user && !isGuest) broadcastPulse(user.esin, msg);
  }, [user, isGuest]);

  const [transactions, setTransactions] = useState<AgroTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([
    {
      id: 'VPR-882',
      name: 'Regenerative Maize Shards v4',
      description: 'High-resilience m-constant verified seeds for Zone 4 Nebraska. Physically verified.',
      price: 45,
      stock: 1200,
      category: 'Seed',
      thrust: 'Environmental',
      supplierEsin: 'EA-SUPP-X1',
      supplierName: 'Green Root Node',
      supplierType: 'RAW_MATERIALS',
      status: 'AUTHORIZED',
      timestamp: '2d ago',
      image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400'
    }
  ]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([
    { id: 'UNIT-LOG-01', type: 'LOGISTICS', name: 'Nairobi Relay Hub', location: 'Zone 2 Hub', capacity: '24 Units', status: 'ACTIVE', efficiency: 98 },
    { id: 'UNIT-WH-02', type: 'WAREHOUSING', name: 'Central Grain Shard', location: 'Zone 4 Nebraska', capacity: '1.2M Tons', status: 'ACTIVE', efficiency: 92 },
    { id: 'UNIT-MFG-03', type: 'MANUFACTURING', name: 'Bio-Nitrogen Plant', location: 'Silicon Soil', capacity: '500kg/h', status: 'AUDITING', efficiency: 85 },
  ]);
  const [contracts, setContracts] = useState<FarmingContract[]>([
    { 
      id: 'CTR-842', 
      investorEsin: 'EA-INV-01', 
      investorName: 'Neo-Agro Capital', 
      productType: 'Maize Farming Node', 
      requiredLand: '50-100 Hectares', 
      requiredLabour: '20 Steward Units', 
      budget: 50000, 
      status: 'Open', 
      applications: [],
      capitalIngested: false
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
  const [networkSignals, setNetworkSignals] = useState<SignalShard[]>([
    { 
      id: 'SIG-001', 
      type: 'system', 
      title: 'Registry Ingest Success', 
      message: 'Center Gate has synchronized your node metrics to the global shard.', 
      timestamp: '10m ago', 
      read: false, 
      priority: 'high' 
    }
  ]);

  // LEDGER COMMITMENT ENGINE
  const commitToBlockchain = useCallback(async (txs: AgroTransaction[]) => {
    setIsMining(true);
    const lastBlock = blockchain[0] || await createGenesisBlock();
    const validator = VALIDATORS[Math.floor(Math.random() * VALIDATORS.length)];
    
    // Artificial mining delay
    await new Promise(r => setTimeout(r, 2500));
    
    const newBlock = await mineBlock(lastBlock, txs, validator);
    setBlockchain(prev => [newBlock, ...prev]);
    setIsMining(false);
    addPulse(`Registry block ${newBlock.hash.substring(0, 8)} finalized by ${validator}`);
  }, [blockchain, addPulse]);

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

  const loadRegistryShards = useCallback(async (stewardEsin: string) => {
    setIsCloudSynced(false);
    setSyncError(null);
    try {
        const [p, o, v, c, t, s] = await Promise.all([
            fetchCollection('projects'),
            fetchCollection('orders'),
            fetchCollection('products'),
            fetchCollection('contracts'),
            fetchCollection('transactions'),
            fetchCollection('signals')
        ]);
        
        if (p.length) setProjects(p as any);
        if (o.length) setOrders(o as any);
        if (v.length) setVendorProducts(prev => [...prev, ...v] as any);
        if (c.length) setContracts(c as any);
        if (t.length) setTransactions(t as any);
        if (s.length) setNetworkSignals(s as any);

        // Load Chain from local or mock initial state
        const genesis = await createGenesisBlock();
        setBlockchain([genesis]);

        setIsCloudSynced(true);
    } catch (e: any) {
        console.error("Cloud Registry sync failure:", e.message);
        setIsCloudSynced(true); 
    }
  }, []);

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
    setTransactions(prev => [newTx, ...prev]);
    
    // INTEGRATION: PUSH TO BLOCKCHAIN ENGINE
    pushToMempool(newTx);

    if (user && !isGuest) {
        try {
            await saveCollectionItem('transactions', { ...newTx, stewardEsin: user.esin, timestamp: Date.now() });
        } catch (e) {
            console.warn("Transaction anchored locally.");
        }
    }
    return newTx;
  }, [user, isGuest, pushToMempool]);

  const earnEAC = useCallback(async (baseAmount: number, reason: string) => {
    if (!user) return;
    const multiplier = user.metrics.timeConstantTau / 8.5; 
    const streakDays = user.wallet.miningStreak || 1;
    const streakBonus = Math.min(2.0, 1 + (streakDays * 0.05));
    const finalAmount = Math.ceil(baseAmount * multiplier * streakBonus);
    const today = new Date().toISOString().split('T')[0];

    await anchorTransaction({ 
      type: 'Reward', 
      details: `${reason} [m-Scalar x${multiplier.toFixed(2)}] [Streak x${streakBonus.toFixed(2)}]`, 
      value: finalAmount, 
      unit: 'EAC' 
    });
    
    handleUpdateUser({ 
      ...user, 
      wallet: { 
        ...user.wallet, 
        balance: user.wallet.balance + finalAmount,
        lifetimeEarned: user.wallet.lifetimeEarned + finalAmount,
        lastSyncDate: today
      } 
    });
    addPulse(`Registry reward: +${finalAmount} EAC for ${reason}`);
  }, [user, handleUpdateUser, anchorTransaction, addPulse]);

  // UNIFIED MINING LOGIC
  const handleQueueMiningHarvest = useCallback((reactionPressure: number, sentimentAlpha: number) => {
    const multiplier = user.metrics.timeConstantTau / 8.5;
    const reward = Math.floor(reactionPressure * sentimentAlpha * multiplier * 10); // Scaled reward
    
    handleUpdateUser({
      ...user,
      wallet: {
        ...user.wallet,
        pendingSocialHarvest: (user.wallet.pendingSocialHarvest || 0) + reward
      }
    });
    addPulse(`Reaction Mining: ${reward} EAC queued for harvest.`);
  }, [user, handleUpdateUser, addPulse]);

  const handleClaimSocialHarvest = useCallback(async () => {
    const amount = user.wallet.pendingSocialHarvest || 0;
    if (amount <= 0) return;

    await anchorTransaction({
      type: 'ReactionMining',
      details: 'SOCIAL_HARVEST_ANCHOR',
      value: amount,
      unit: 'EAC'
    });

    handleUpdateUser({
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        lifetimeEarned: user.wallet.lifetimeEarned + amount,
        pendingSocialHarvest: 0
      }
    });
    addPulse(`Harvest Success: ${amount.toFixed(0)} EAC anchored to node.`);
  }, [user, handleUpdateUser, anchorTransaction, addPulse]);

  const swapEACforEAT = async (eatAmount: number) => {
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
    await anchorTransaction({ type: 'NodeSwap', details: 'EAC to EAT conversion', value: eatAmount, unit: 'EAT' });
    return true;
  };

  const spendEAC = async (amount: number, reason: string) => {
    if (!user) return false;
    const totalAvailable = user.wallet.balance + user.wallet.bonusBalance;
    if (totalAvailable < amount) return false;
    await anchorTransaction({ type: 'Burn', details: reason, value: -amount, unit: 'EAC' });
    let newBonus = user.wallet.bonusBalance;
    let newBalance = user.wallet.balance;
    if (newBonus >= amount) {
      newBonus -= amount;
    } else {
      const remaining = amount - newBonus;
      newBonus = 0;
      newBalance -= remaining;
    }
    handleUpdateUser({ ...user, wallet: { ...user.wallet, balance: newBalance, bonusBalance: newBonus } });
    addPulse(`Capital sharded: -${amount} EAC for ${reason}`);
    return true;
  };

  const handlePlaceOrder = async (orderData: Partial<Order>) => {
    if (!user) return;
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
    setOrders(prev => [newOrder, ...prev]);
    
    // PUSH TO LEDGER
    await anchorTransaction({
        type: 'MarketTrade',
        details: `Procurement: ${newOrder.itemName}`,
        value: newOrder.cost,
        unit: 'EAC'
    });

    if (!isGuest) {
      try {
          await saveCollectionItem('orders', newOrder);
      } catch (e) {
          console.warn("Order committed locally.");
      }
    }
    await spendEAC(newOrder.cost, `PROCURING_${newOrder.itemName}`);
    addPulse(`Procurement Handshake initiated for ${newOrder.itemName}`);
    return newOrder;
  };

  const handleUpdateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, meta?: any) => {
    setOrders(prev => {
      const newOrders = prev.map(o => o.id === orderId ? { ...o, status, ...meta } : o);
      const updatedOrder = newOrders.find(o => o.id === orderId);
      if (updatedOrder && !isGuest) {
        saveCollectionItem('orders', updatedOrder).catch(() => {});
      }
      return newOrders;
    });
  }, [isGuest]);

  const handleRegisterProduct = useCallback(async (product: VendorProduct) => {
    setVendorProducts(prev => [product, ...prev]);
    if (!isGuest) {
      try {
          await saveCollectionItem('products', product);
      } catch (e) {}
    }
    addPulse(`New asset registered: ${product.name}`);
  }, [addPulse, isGuest]);

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (isBooting) setIsBooting(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(null, async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          const profile = await getStewardProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
            setIsGuest(false);
            loadRegistryShards(profile.esin);
          }
        } catch (e) {}
      } else {
        // Fallback to local storage or guest
        const savedUser = localStorage.getItem('agro_steward');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setIsGuest(parsed.esin.startsWith('EA-GUEST'));
        } else {
          setUser(GUEST_STWD);
          setIsGuest(true);
        }
      }
      setIsBooting(false);
      clearTimeout(safetyTimeout);
    });
    const unsubEchoes = listenForGlobalEchoes(setGlobalEchoes);
    return () => { unsubscribe(); unsubEchoes(); clearTimeout(safetyTimeout); };
  }, [loadRegistryShards, isBooting]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to exit the current node session?")) {
      signOutSteward();
      localStorage.removeItem('agro_steward');
      setUser(GUEST_STWD);
      setIsGuest(true);
      setActiveView('dashboard');
    }
  };

  const handleNavigate = (newView: ViewState) => {
    setActiveView(newView);
    setIsMobileMenuOpen(false);
    const group = registryNodes.find(g => g.items.some(i => i.id === newView));
    if (group) {
      setExpandedGroups(prev => ({ ...prev, [group.category]: true }));
    }
  };

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const registryNodes = [
    { 
      category: 'Command & Strategy', 
      items: [
        { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
        { id: 'network', name: 'Network Topology', icon: NetworkIcon },
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
        { id: 'media', name: 'Media Hub', icon: Tv },
        { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
        { id: 'info', name: 'Portal Info', icon: Info }
      ]
    }
  ];

  const SidebarContent = ({ forceLabel = false }: { forceLabel?: boolean }) => (
    <>
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 relative bg-black/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-12 h-12 agro-gradient rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/10 group-hover:rotate-6 transition-transform">
            <Layers className="text-white w-7 h-7" />
          </div>
          {(isSidebarOpen || forceLabel) && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
               <span className="text-2xl font-black uppercase tracking-tighter italic whitespace-nowrap block leading-none">Enviros<span className="text-emerald-400">Agro</span></span>
               <span className="text-[7px] font-black tracking-[0.6em] text-slate-500 uppercase ml-0.5">Industrial OS</span>
            </div>
          )}
        </div>
        {isMobile && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 mt-6 space-y-4 px-4 overflow-y-auto custom-scrollbar pb-10">
        {registryNodes.map((group, idx) => {
          const isExpanded = expandedGroups[group.category];
          const hasActiveInGroup = group.items.some(item => item.id === activeView);

          return (
            <div key={idx} className="space-y-1">
               {(isSidebarOpen || forceLabel) ? (
                 <button 
                  onClick={() => toggleGroup(group.category)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all group/header"
                 >
                    <h5 className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors ${isExpanded || hasActiveInGroup ? 'text-emerald-400' : 'text-slate-300 group-hover/header:text-slate-100'}`}>
                      {group.category}
                    </h5>
                    <ChevronDown size={12} className={`text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                 </button>
               ) : (
                 <div className="h-px bg-white/5 mx-4 my-4" />
               )}
               
               <div className={`space-y-1 overflow-hidden transition-all duration-500 ${isExpanded || !isSidebarOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                 {group.items.map((item) => (
                   <button 
                     key={item.id} 
                     onClick={() => handleNavigate(item.id as ViewState)} 
                     className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group ${activeView === item.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}
                   >
                     <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                     {(isSidebarOpen || forceLabel) && <span className="font-black text-[9px] uppercase tracking-[0.2em] truncate">{item.name}</span>}
                   </button>
                 ))}
               </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5 space-y-4 bg-black/20">
        {isGuest && (
          <button 
            onClick={() => handleNavigate('profile')}
            className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-500 transition-all border border-white/10"
          >
            <UserPlus size={16} /> AUTHORIZE NODE
          </button>
        )}
        <button onClick={() => { setIsVoiceBridgeOpen(true); if(isMobile) setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-5 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
          <Mic size={18} /> {(isSidebarOpen || forceLabel) && <span>ORACLE VOICE</span>}
        </button>
      </div>
    </>
  );

  if (isBooting) return (
    <div className="fixed inset-0 z-[500] bg-[#050706] flex items-center justify-center overflow-hidden">
      <div className="text-center space-y-8 animate-in fade-in duration-1000">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] bg-black/60 border-2 border-emerald-500/30 flex items-center justify-center mx-auto relative animate-float shadow-2xl">
          <Layers className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">ENVIROS<span className="text-emerald-400">AGRO OS</span></h1>
        <div className="w-56 md:w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-emerald-500/60 animate-boot-progress"></div>
        </div>
        <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest animate-pulse">Synchronizing Registry Shards...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#050706] text-slate-200">
      <div className="scanline"></div>
      
      <aside className={`hidden lg:flex ${isSidebarOpen ? 'w-80' : 'w-24'} glass-card border-r border-white/5 flex flex-col z-50 transition-all duration-500 relative bg-black/60 backdrop-blur-3xl`}>
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-80 bg-[#050706] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-300">
            <SidebarContent forceLabel />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative flex flex-col bg-[#050706]">
        <header className="flex justify-between items-center sticky top-0 bg-black/60 backdrop-blur-3xl z-40 py-4 px-4 md:px-8 border-b border-white/5 h-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => isMobile ? setIsMobileMenuOpen(true) : setIsSidebarOpen(!isSidebarOpen)} 
              className="p-3 bg-white/[0.03] rounded-2xl text-emerald-500 border border-white/10 shadow-lg"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2 text-center">
              {activeView.replace(/_/g, ' ').toUpperCase()} <span className="text-emerald-400">SHARD</span>
            </h1>
            {isGuest ? (
               <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mt-1">
                  <ShieldAlert size={10} className="text-amber-400" />
                  <span className="text-[7px] font-black uppercase text-amber-400 tracking-widest">DRAFT NODE / GUEST</span>
               </div>
            ) : isCloudSynced ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mt-1">
                    <ShieldCheck size={10} className="text-emerald-400" />
                    <span className="text-[7px] font-black uppercase text-emerald-400 tracking-widest">Registry Anchored</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mt-1 animate-pulse">
                    <Loader2 size={10} className="text-blue-400 animate-spin" />
                    <span className="text-[7px] font-black uppercase text-blue-400 tracking-widest">Synchronizing Shards</span>
                </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <div className="flex items-center gap-2">
                <button onClick={() => handleNavigate('profile')} className="flex items-center gap-3 p-1.5 glass-card rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-emerald-600/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-base font-black text-emerald-500 overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                  </div>
                </button>
                {!isGuest && (
                  <button 
                    onClick={handleLogout}
                    className="p-3 hover:bg-rose-600/10 text-rose-500 rounded-2xl border border-white/10 bg-white/[0.03] transition-all" 
                    title="Logout session"
                  >
                    <LogOut size={18} />
                  </button>
                )}
             </div>
          </div>
        </header>

        {/* Global Pulse Ticker */}
        <div 
          onClick={() => handleNavigate('explorer')}
          className="bg-emerald-500/5 border-y border-white/5 p-2 px-8 overflow-hidden shrink-0 cursor-pointer hover:bg-emerald-500/10 transition-colors"
          title="Open Pulse Explorer"
        >
           <div className="flex items-center gap-4">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <div className="whitespace-nowrap animate-marquee text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest">
                 {pulseMarquee}
              </div>
           </div>
        </div>

        {/* MINING OVERLAY */}
        {isMining && (
            <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500 pointer-events-none">
                <div className="relative">
                    <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">Neural Finality Sequence...</p>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Anchoring mempool shards to block #{blockchain.length + 428812}</p>
                </div>
            </div>
        )}

        <div className="p-4 md:p-10 flex-1 relative max-w-[1920px] mx-auto w-full">
          {activeView === 'dashboard' && <Dashboard user={user} isGuest={isGuest} onNavigate={handleNavigate} orders={orders} blockchain={blockchain} isMining={isMining} />}
          {activeView === 'network' && <NetworkView />}
          {activeView === 'wallet' && <AgroWallet user={user} isGuest={isGuest} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} onSwap={swapEACforEAT} onEarnEAC={earnEAC} projects={projects} onClaimSocialHarvest={handleClaimSocialHarvest} transactions={transactions} blockchain={blockchain} isMining={isMining} />}
          {activeView === 'sustainability' && <Sustainability user={user} isGuest={isGuest} onMintEAT={(v: number) => earnEAC(v, 'RESONANCE_IMPROVE')} />}
          {activeView === 'economy' && <Economy user={user} isGuest={isGuest} onNavigate={handleNavigate} onSpendEAC={spendEAC} onEarnEAC={earnEAC} vendorProducts={vendorProducts} onPlaceOrder={handlePlaceOrder} projects={projects} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={handleUpdateUser} />}
          {activeView === 'industrial' && <Industrial user={user} isGuest={isGuest} industrialUnits={industrialUnits} setIndustrialUnits={setIndustrialUnits} onSpendEAC={spendEAC} onNavigate={handleNavigate} collectives={[]} setCollectives={() => {}} onInitializeLiveProcess={(p) => setLiveProducts([p as any, ...liveProducts])} />}
          {activeView === 'intelligence' && <Intelligence user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} onOpenEvidence={() => setIsEvidenceModalOpen(true)} />}
          {activeView === 'code_of_laws' && <CodeOfLaws user={user} />}
          {activeView === 'chroma_system' && <ChromaSystem user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'agro_calendar' && <AgroCalendar user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'impact' && <Impact user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'ecosystem' && <Ecosystem user={user} isGuest={isGuest} onDeposit={earnEAC} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'profile' && <UserProfile user={user} isGuest={isGuest} onUpdate={handleUpdateUser} onLogout={handleLogout} signals={networkSignals} setSignals={setNetworkSignals} onLogin={u => { setUser(u); setIsGuest(false); }} />}
          {activeView === 'explorer' && <Explorer blockchain={blockchain} isMining={isMining} onPulse={addPulse} user={user} isGuest={isGuest} />}
          {activeView === 'community' && <Community user={user} isGuest={isGuest} onContribution={() => earnEAC(5, 'CONTRIBUTION')} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'live_farming' && <LiveFarming user={user} isGuest={isGuest} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'tqm' && <TQMGrid user={user} isGuest={isGuest} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} onNavigate={handleNavigate} liveProducts={liveProducts} />}
          {activeView === 'crm' && <NexusCRM user={user} isGuest={isGuest} onSpendEAC={spendEAC} vendorProducts={vendorProducts} onNavigate={handleNavigate} orders={orders} />}
          {activeView === 'circular' && <CircularGrid user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'tools' && <ToolsSection user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onOpenEvidence={(task) => { setIsEvidenceModalOpen(true); }} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} isGuest={isGuest} onSpendEAC={spendEAC} onNavigate={handleNavigate} contracts={contracts} setContracts={setContracts} onInitializeLiveProcess={(p) => setLiveProducts([p as any, ...liveProducts])} />}
          {activeView === 'investor' && <InvestorPortal user={user} isGuest={isGuest} onUpdate={handleUpdateUser} onSpendEAC={spendEAC} projects={projects} onNavigate={handleNavigate} />}
          {activeView === 'agrowild' && <Agrowild user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'research' && <ResearchInnovation user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'biotech_hub' && <Biotechnology user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'permaculture_hub' && <Permaculture user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'cea_portal' && <CEA user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'emergency_portal' && <EmergencyPortal user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'agro_regency' && <AgroRegency user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'intranet' && <IntranetPortal user={user} isGuest={isGuest} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'envirosagro_store' && <EnvirosAgroStore user={user} isGuest={isGuest} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} />}
          {activeView === 'media' && <MediaHub user={user} isGuest={isGuest} userBalance={user.wallet.balance} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'channelling' && <Channelling user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'info' && <InfoPortal />}
          {activeView === 'ingest' && <NetworkIngest user={user} isGuest={isGuest} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'vendor' && <VendorPortal user={user} isGuest={isGuest} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} vendorProducts={vendorProducts} onRegisterProduct={handleRegisterProduct} />}
          {activeView === 'agro_value_enhancement' && <AgroValueEnhancement user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'digital_mrv' && <DigitalMRV user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'registry_handshake' && <RegistryHandshake user={user} isGuest={isGuest} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'online_garden' && <OnlineGarden user={user} isGuest={isGuest} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onNavigate={handleNavigate} onQueueHarvest={handleQueueMiningHarvest} />}
          {activeView === 'farm_os' && <FarmOS user={user} isGuest={isGuest} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {['animal_world', 'plants_world', 'aqua_portal', 'soil_portal', 'air_portal'].includes(activeView) && (
            <NaturalResources user={user} isGuest={isGuest} type={activeView as ViewState} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />
          )}
        </div>
      </main>

      <EvidenceModal isOpen={isEvidenceModalOpen} isGuest={isGuest} onClose={() => setIsEvidenceModalOpen(false)} user={user} onMinted={(v) => earnEAC(v, 'EVIDENCE_VERIFIED')} onNavigate={handleNavigate} />
      <FloatingConsultant user={user} isGuest={isGuest} />
      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} isGuest={isGuest} onClose={() => setIsVoiceBridgeOpen(false)} />
    </div>
  );
};

export default App;