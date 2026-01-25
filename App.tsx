
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Cpu, ShoppingCart, Users, BrainCircuit, Library, Database, Wallet, Leaf, Menu, X, Layers, Radio, ShieldAlert, LogOut, User as UserIcon, Loader2, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Upload, Power, Mic, Coins, Activity, Globe, Share2, Server, Terminal, Shield, ExternalLink, Moon, Sun, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info, Timer, AlertTriangle, Microscope, UserPlus, Handshake, Sprout, Briefcase, PawPrint, UserCircle, BellRing, Settings2, Bot, Fingerprint, Network, Binary, TrendingUp, Maximize, Minimize, Baby, HeartPulse, SearchCode, Command, Play, Newspaper, Film, Pickaxe, HardHat,
  Trash2,
  Inbox,
  CircleDot,
  ShoppingBag,
  TreePine,
  Droplets,
  Mountain,
  Wind,
  LifeBuoy,
  BoxSelect,
  Dna,
  Compass,
  Siren,
  History,
  Infinity,
  Scale,
  FileSignature,
  CalendarDays
} from 'lucide-react';
import { ViewState, User, WorkerProfile, AgroProject, AgroTransaction, FarmingContract, Order, VendorProduct, OrderStatus, RegisteredUnit } from './types';
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
import { syncUserToCloud } from './services/firebaseService';

export interface SignalShard {
  id: string;
  type: 'system' | 'engagement' | 'network' | 'commerce';
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
  const [subAction, setSubAction] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [showSignalDropdown, setShowSignalDropdown] = useState(false);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Central Registry State
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([
    {
      id: 'VPR-882',
      name: 'Regenerative Maize Shards v4',
      description: 'High-resilience m-constant verified seeds for Zone 4 Nebraska. physically verified.',
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
    },
    { 
      id: 'CTR-112', 
      investorEsin: 'EA-INV-02', 
      investorName: 'Global Shard Fund', 
      productType: 'Spectral Wheat Export', 
      requiredLand: '200 Hectares', 
      requiredLabour: '50 Steward Units', 
      budget: 120000, 
      status: 'Auditing', 
      applications: [],
      capitalIngested: true
    },
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

  useEffect(() => {
    const bootTimer = setTimeout(() => setIsBooting(false), 2000);
    document.documentElement.classList.add('dark');
    const savedUser = localStorage.getItem('agro_steward');
    if (savedUser) setUser(JSON.parse(savedUser));
    return () => clearTimeout(bootTimer);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to exit the current node session?")) {
      localStorage.removeItem('agro_steward');
      setUser(null);
      setActiveView('dashboard');
    }
  };

  const handleNavigate = (newView: ViewState, action: string | null = null) => {
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

  const handleRegisterProduct = (product: VendorProduct) => {
    setVendorProducts(prev => [product, ...prev]);
    const auditSignal: SignalShard = {
      id: `SIG-AUD-${product.id}`,
      type: 'system',
      title: 'Industrial Audit Triggered',
      message: `Supplier ${product.supplierName} registered ${product.name}. Site verification required for commercial sharding.`,
      timestamp: 'Just now',
      read: false,
      priority: 'high',
      actionLabel: 'AUDIT REGISTRY',
      actionIcon: ClipboardCheck
    };
    setNetworkSignals(prev => [auditSignal, ...prev]);
  };

  const handlePlaceOrder = (orderData: Partial<Order>) => {
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

    const receiptSignal: SignalShard = {
      id: `SIG-RCT-${newOrder.id}`,
      type: 'commerce',
      title: 'Commerce Registry Initialized',
      message: `Procurement flow for ${newOrder.itemName} committed. Shard anchored to node ${user.esin}.`,
      timestamp: 'Just now',
      read: false,
      priority: 'medium',
      actionLabel: 'DOWNLOAD RECEIPT',
      actionIcon: CheckCircle2,
      meta: { orderId: newOrder.id }
    };
    setNetworkSignals(prev => [receiptSignal, ...prev]);
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, meta?: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...meta } : o));
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
  const markSignalRead = (id: string) => setNetworkSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  const clearAllSignals = () => { setNetworkSignals([]); setShowSignalDropdown(false); };

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
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const registryNodes = [
    { 
      category: 'Command Hub', 
      items: [
        { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
        { id: 'impact', name: 'Network Impact', icon: TrendingUp },
        { id: 'code_of_laws', name: 'Code of Laws', icon: Scale },
        { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays },
        { id: 'intelligence', name: 'Science Oracle', icon: Microscope },
        { id: 'biotech_hub', name: 'Genetic Hub', icon: Dna },
        { id: 'research', name: 'Research Forge', icon: BrainCircuit }
      ]
    },
    { 
      category: 'Commerce & Value', 
      items: [
        { id: 'wallet', name: 'Treasury Node', icon: Wallet },
        { id: 'economy', name: 'Market Cloud', icon: Globe },
        { id: 'investor', name: 'Investor Portal', icon: Landmark },
        { id: 'contract_farming', name: 'Mission Escrow', icon: Briefcase },
        { id: 'vendor', name: 'Supplier Command', icon: Store },
        { id: 'envirosagro_store', name: 'Official Store', icon: ShoppingBag },
        { id: 'circular', name: 'Circular Grid', icon: Recycle }
      ]
    },
    {
      category: 'Resource Portals',
      items: [
        { id: 'animal_world', name: 'Animal World', icon: PawPrint },
        { id: 'plants_world', name: 'Plants World', icon: TreePine },
        { id: 'permaculture_hub', name: 'Permaculture Hub', icon: Compass },
        { id: 'cea_portal', name: 'CEA Indoor Optimization', icon: BoxSelect },
        { id: 'aqua_portal', name: 'Aqua Portal', icon: Droplets },
        { id: 'soil_portal', name: 'Soil Portal', icon: Mountain },
        { id: 'air_portal', name: 'Air Portal', icon: Wind }
      ]
    },
    { 
      category: 'Operational Registry', 
      items: [
        { id: 'industrial', name: 'Industrial Cloud', icon: HardHat },
        { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck },
        { id: 'emergency_portal', name: 'Emergency & Alerts', icon: Siren },
        { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake },
        { id: 'ingest', name: 'Network Ingest', icon: Cable },
        { id: 'tools', name: 'Node Tools', icon: Wrench }
      ]
    },
    { 
      category: 'Ecosystem Hub', 
      items: [
        { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers },
        { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
        { id: 'media', name: 'Media Hub', icon: Film },
        { id: 'agrowild', name: 'Agrowild Hub', icon: PawPrint },
        { id: 'live_farming', name: 'Live Processing', icon: Sprout },
        { id: 'community', name: 'Learning Hub', icon: Library }
      ]
    },
    { 
      category: 'Node Identity', 
      items: [
        { id: 'agro_regency', name: 'Agro Regency', icon: History },
        { id: 'explorer', name: 'Ledger Explorer', icon: Database },
        { id: 'info', name: 'Governance', icon: ShieldAlert },
        { id: 'intranet', name: 'HQ Intranet', icon: ShieldCheck },
        { id: 'profile', name: 'Node Dossier', icon: UserIcon }
      ]
    }
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 relative bg-black/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-12 h-12 agro-gradient rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/10 group-hover:rotate-6 transition-transform">
            <Leaf className="text-white w-7 h-7" />
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
               <span className="text-2xl font-black uppercase tracking-tighter italic whitespace-nowrap block leading-none">Enviros<span className="text-emerald-400">Agro</span></span>
               <span className="text-[7px] font-black tracking-[0.6em] text-slate-500 uppercase ml-0.5">Industrial OS</span>
            </div>
          )}
        </div>
        {!isMobile && (
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all hover:bg-emerald-600/10 border border-transparent hover:border-emerald-500/20">
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>

      <div className="flex-1 mt-6 space-y-8 px-4 overflow-y-auto custom-scrollbar pb-10">
        {registryNodes.map((group, idx) => (
          <div key={idx} className="space-y-3">
             {isSidebarOpen && (
               <div className="flex items-center gap-2 px-3 opacity-60 group/header">
                 <CircleDot size={8} className="text-emerald-500" />
                 <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{group.category}</h5>
               </div>
             )}
             <div className="space-y-1">
               {group.items.map((item) => {
                 const isActive = activeView === item.id;
                 return (
                   <button 
                     key={item.id} 
                     onClick={() => handleNavigate(item.id as ViewState)} 
                     className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative ${isActive ? 'bg-emerald-600 text-white shadow-[0_10px_20px_rgba(5,150,105,0.3)] ring-1 ring-white/20' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}
                   >
                     <div className={`shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                     </div>
                     {isSidebarOpen && (
                       <span className={`font-black text-[10px] uppercase tracking-[0.2em] truncate transition-all ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                         {item.name}
                       </span>
                     )}
                     {isActive && <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_100px_#fff]"></div>}
                   </button>
                 );
               })}
             </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 space-y-4 bg-black/20">
        {isSidebarOpen && user && (
           <div className="glass-card p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Node Online</span>
                 </div>
                 <span className="text-[8px] font-mono text-emerald-500/60 font-black">ZK_SYNC_OK</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-emerald-500 border border-white/5">
                    {user.name[0]}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white truncate">{user.name.toUpperCase()}</p>
                    <p className="text-[7px] font-mono text-slate-600 truncate">{user.esin}</p>
                 </div>
              </div>
           </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={() => setIsVoiceBridgeOpen(true)} className="w-full flex items-center justify-center gap-3 p-5 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(5,150,105,0.25)] hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative">
            <Mic size={18} className="relative z-10 group-hover:scale-110 transition-transform" /> 
            {isSidebarOpen && <span className="relative z-10">ORACLE VOICE</span>}
          </button>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-3 p-4 bg-rose-950/30 border border-rose-500/20 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all group active:scale-95"
          >
            <X size={18} className="text-rose-500 group-hover:text-white group-hover:rotate-90 transition-transform" />
            {isSidebarOpen && <span>EXIT NODE</span>}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#050706] text-slate-200">
      <div className="scanline"></div>
      <aside className={`hidden lg:flex ${isSidebarOpen ? 'w-80' : 'w-24'} glass-card border-r border-white/5 flex flex-col z-50 transition-all duration-500 relative bg-black/60 backdrop-blur-3xl`}>
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-[320px] glass-card border-r border-white/10 bg-[#050706] flex flex-col animate-in slide-in-from-left duration-300 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
             <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative flex flex-col bg-[#050706]">
        <header className="flex justify-between items-center sticky top-0 bg-black/60 backdrop-blur-3xl z-40 py-4 px-4 md:px-8 border-b border-white/5 shadow-xl">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                 if (isMobile) setIsMobileMenuOpen(true);
                 else setIsSidebarOpen(!isSidebarOpen);
              }} 
              className="p-3.5 bg-white/[0.03] rounded-2xl text-emerald-500 border border-white/10 shadow-lg active:scale-90 transition-all hover:bg-white/[0.08] hover:border-emerald-500/30"
            >
              <Menu size={20} />
            </button>
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
               <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-white truncate drop-shadow-md">
                 {activeView.replace(/_/g, ' ')} <span className="text-emerald-400">Shard</span>
               </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowSignalDropdown(!showSignalDropdown)} className={`p-3 rounded-2xl border transition-all relative ${showSignalDropdown ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#0B0F0D] border-white/10 text-slate-500 hover:text-white hover:bg-white/5'}`}>
                <Bell size={20} />
                {unreadSignals.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xl border-2 border-[#050706] animate-pulse">{unreadSignals.length}</span>}
              </button>
              {showSignalDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSignalDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-[350px] rounded-[32px] border border-white/10 bg-[#0B0F0D] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] z-50 overflow-hidden animate-in zoom-in duration-300">
                    <div className="p-5 bg-emerald-600/10 border-b border-white/5 flex justify-between items-center">
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Radio size={14} className="text-emerald-400" /> Network Signals</h4>
                      <button onClick={clearAllSignals} className="text-[9px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest">Clear All</button>
                    </div>
                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                      {networkSignals.map(sig => {
                        const Icon = sig.actionIcon || Radio;
                        return (
                          <div key={sig.id} onClick={() => markSignalRead(sig.id)} className={`p-6 hover:bg-white/[0.03] transition-all cursor-pointer relative ${!sig.read ? 'bg-emerald-500/[0.02]' : 'opacity-60'}`}>
                            {!sig.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>}
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
                                <Icon size={18} />
                              </div>
                              <div className="flex-1 space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-[11px] font-black text-white uppercase tracking-tight">{sig.title}</h5>
                                  <span className="text-[8px] font-mono text-slate-600">{sig.timestamp}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">"{sig.message}"</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => handleNavigate('profile')} className="flex items-center gap-3 p-1.5 glass-card rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-emerald-600/10 transition-all hover:border-emerald-500/30 group">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-base font-black text-emerald-500 group-hover:scale-105 transition-transform">{user.name[0]}</div>
              <div className="hidden md:block pr-3">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">{user.name}</p>
                 <p className="text-[8px] font-mono text-emerald-500/60 font-black">NODE_AUTHORIZED</p>
              </div>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 relative max-w-[1920px] mx-auto w-full overflow-x-hidden">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} orders={orders} />}
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} onSwap={swapEACforEAT} projects={projects} />}
          {activeView === 'sustainability' && <Sustainability user={user} onMintEAT={(v: number) => earnEAC(v, 'RESONANCE_IMPROVE')} />}
          {activeView === 'economy' && <Economy user={user} onNavigate={handleNavigate} onSpendEAC={spendEAC} onEarnEAC={earnEAC} vendorProducts={vendorProducts} onPlaceOrder={handlePlaceOrder} projects={projects} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={handleUpdateUser} />}
          {activeView === 'industrial' && <Industrial user={user} industrialUnits={industrialUnits} setIndustrialUnits={setIndustrialUnits} onSpendEAC={spendEAC} onNavigate={handleNavigate} collectives={collectives} setCollectives={setCollectives} pendingAction={subAction} clearAction={() => setSubAction(null)} />}
          {activeView === 'intelligence' && <Intelligence userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
          {activeView === 'code_of_laws' && <CodeOfLaws user={user} />}
          {activeView === 'agro_calendar' && <AgroCalendar user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'biotech_hub' && <Biotechnology user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'research' && <ResearchInnovation user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} pendingAction={subAction} clearAction={() => setSubAction(null)} />}
          {activeView === 'impact' && <Impact user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'vendor' && <VendorPortal user={user} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} vendorProducts={vendorProducts} onRegisterProduct={handleRegisterProduct} />}
          {activeView === 'tqm' && <TQMGrid user={user} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />}
          {activeView === 'circular' && <CircularGrid user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} signals={networkSignals} setSignals={setNetworkSignals} />}
          {activeView === 'community' && <Community user={user} onContribution={() => earnEAC(5, 'CONTRIB')} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={earnEAC} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'media' && <MediaHub user={user} userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
          {activeView === 'channelling' && <Channelling user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'intranet' && <IntranetPortal user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'envirosagro_store' && <EnvirosAgroStore user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onPlaceOrder={handlePlaceOrder} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} onSpendEAC={spendEAC} projects={projects} pendingAction={subAction} clearAction={() => setSubAction(null)} onNavigate={handleNavigate} />}
          {activeView === 'cea_portal' && <CEA user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'permaculture_hub' && <Permaculture user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'emergency_portal' && <EmergencyPortal user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'agro_regency' && <AgroRegency user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'animal_world' && <NaturalResources user={user} type="animal_world" onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'plants_world' && <NaturalResources user={user} type="plants_world" onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'aqua_portal' && <NaturalResources user={user} type="aqua_portal" onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'soil_portal' && <NaturalResources user={user} type="soil_portal" onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'air_portal' && <NaturalResources user={user} type="air_portal" onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'crm' && <NexusCRM user={user} onSpendEAC={spendEAC} vendorProducts={vendorProducts} onNavigate={handleNavigate} orders={orders} />}
          {activeView === 'ingest' && <NetworkIngest onSpendEAC={spendEAC} />}
          {activeView === 'tools' && <ToolsSection user={user} onSpendEAC={spendEAC} pendingAction={subAction} clearAction={() => setSubAction(null)} />}
          {activeView === 'agrowild' && <Agrowild user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'live_farming' && <LiveFarming user={user} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} contracts={contracts} setContracts={setContracts} />}
          {activeView === 'info' && <InfoPortal />}
        </div>
      </main>

      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} onClose={() => setIsVoiceBridgeOpen(false)} />
      <FloatingConsultant user={user} />
      <EvidenceModal isOpen={isEvidenceModalOpen} onClose={() => setIsEvidenceModalOpen(false)} user={user} onMinted={(v: number) => earnEAC(v, 'MANUAL_MINT')} />
    </div>
  );
};

export default App;
