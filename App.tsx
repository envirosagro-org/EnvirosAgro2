// This root App.tsx is the primary node orchestrator.
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Layers, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, PawPrint as AnimalIcon, Tv, LogOut, Warehouse
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, OrderStatus, RegisteredUnit } from './types';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const [orders, setOrders] = useState<Order[]>([]);
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

  const [projects] = useState<AgroProject[]>([
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

  const handleNavigate = (newView: ViewState) => {
    setActiveView(newView);
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
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, meta?: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...meta } : o));
  };

  const handleRegisterProduct = (product: VendorProduct) => {
    setVendorProducts(prev => [product, ...prev]);
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
      </div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  const registryNodes = [
    { 
      category: 'Command & Strategy', 
      items: [
        { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
        { id: 'impact', name: 'Network Impact', icon: TrendingUp },
        { id: 'code_of_laws', name: 'Code of Laws', icon: Scale },
        { id: 'chroma_system', name: 'Chroma-SEHTI', icon: Palette },
        { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays },
        { id: 'intelligence', name: 'Science Oracle', icon: Microscope },
        { id: 'explorer', name: 'Registry Explorer', icon: Database }
      ]
    },
    {
      category: 'Natural Resources',
      items: [
        { id: 'animal_world', name: 'Animal World', icon: AnimalIcon },
        { id: 'plants_world', name: 'Plants World', icon: Sprout },
        { id: 'aqua_portal', name: 'Aqua Portal', icon: Droplets },
        { id: 'soil_portal', name: 'Soil Portal', icon: Mountain },
        { id: 'air_portal', name: 'Air Portal', icon: Wind }
      ]
    },
    { 
      category: 'Value & Economy', 
      items: [
        { id: 'wallet', name: 'Treasury Node', icon: Wallet },
        { id: 'economy', name: 'Market Cloud', icon: Globe },
        { id: 'industrial', name: 'Industrial Cloud', icon: Briefcase },
        { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers }
      ]
    },
    {
      category: 'Operations & Trace',
      items: [
        { id: 'live_farming', name: 'Product Processing', icon: Wheat },
        { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck },
        { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake },
        { id: 'circular', name: 'Circular Grid', icon: Recycle }
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

      <div className="flex-1 mt-6 space-y-8 px-4 overflow-y-auto custom-scrollbar pb-10">
        {registryNodes.map((group, idx) => (
          <div key={idx} className="space-y-3">
             {(isSidebarOpen || forceLabel) && (
               <div className="flex items-center gap-2 px-3 opacity-60">
                 <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{group.category}</h5>
               </div>
             )}
             <div className="space-y-1">
               {group.items.map((item) => (
                 <button 
                   key={item.id} 
                   onClick={() => handleNavigate(item.id as ViewState)} 
                   className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group ${activeView === item.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}
                 >
                   <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                   {(isSidebarOpen || forceLabel) && <span className="font-black text-[10px] uppercase tracking-[0.2em] truncate">{item.name}</span>}
                 </button>
               ))}
             </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 space-y-4 bg-black/20">
        <button onClick={() => { setIsVoiceBridgeOpen(true); if(isMobile) setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-5 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
          <Mic size={18} /> {(isSidebarOpen || forceLabel) && <span>ORACLE VOICE</span>}
        </button>
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

          <div className="flex-1 flex justify-center">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
              {activeView.replace(/_/g, ' ').toUpperCase()} <span className="text-emerald-400">SHARD</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <div className="flex items-center gap-2">
                <button onClick={() => handleNavigate('profile')} className="flex items-center gap-3 p-1.5 glass-card rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-emerald-600/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-base font-black text-emerald-500">{user.name[0]}</div>
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-3 hover:bg-rose-600/10 text-rose-500 rounded-2xl border border-white/10 bg-white/[0.03] transition-all" 
                  title="Logout session"
                >
                  <LogOut size={18} />
                </button>
             </div>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 relative max-w-[1920px] mx-auto w-full">
          {activeView === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} orders={orders} />}
          {activeView === 'wallet' && <AgroWallet user={user} onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} onSwap={swapEACforEAT} projects={projects} />}
          {activeView === 'sustainability' && <Sustainability user={user} onMintEAT={(v: number) => earnEAC(v, 'RESONANCE_IMPROVE')} />}
          {activeView === 'economy' && <Economy user={user} onNavigate={handleNavigate} onSpendEAC={spendEAC} onEarnEAC={earnEAC} vendorProducts={vendorProducts} onPlaceOrder={handlePlaceOrder} projects={projects} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={handleUpdateUser} />}
          {activeView === 'industrial' && <Industrial user={user} industrialUnits={industrialUnits} setIndustrialUnits={setIndustrialUnits} onSpendEAC={spendEAC} onNavigate={handleNavigate} collectives={[]} setCollectives={() => {}} />}
          {activeView === 'intelligence' && <Intelligence userBalance={user.wallet.balance} onSpendEAC={spendEAC} onOpenEvidence={() => setIsEvidenceModalOpen(true)} />}
          {activeView === 'code_of_laws' && <CodeOfLaws user={user} />}
          {activeView === 'chroma_system' && <ChromaSystem user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'agro_calendar' && <AgroCalendar user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'impact' && <Impact user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'ecosystem' && <Ecosystem user={user} onDeposit={earnEAC} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />}
          {activeView === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} signals={networkSignals} setSignals={setNetworkSignals} />}
          {activeView === 'explorer' && <Explorer />}
          {activeView === 'community' && <Community user={user} onContribution={() => earnEAC(5, 'CONTRIBUTION')} onSpendEAC={spendEAC} onEarnEAC={earnEAC} />}
          {activeView === 'live_farming' && <LiveFarming user={user} onEarnEAC={earnEAC} onNavigate={handleNavigate} />}
          {activeView === 'tqm' && <TQMGrid user={user} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />}
          {activeView === 'crm' && <NexusCRM user={user} onSpendEAC={spendEAC} vendorProducts={vendorProducts} onNavigate={handleNavigate} orders={orders} />}
          {activeView === 'circular' && <CircularGrid user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'contract_farming' && <ContractFarming user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} contracts={contracts} setContracts={setContracts} />}
          {activeView === 'investor' && <InvestorPortal user={user} onUpdate={handleUpdateUser} onSpendEAC={spendEAC} projects={projects} onNavigate={handleNavigate} />}
          {activeView === 'agrowild' && <Agrowild user={user} onSpendEAC={spendEAC} onEarnEAC={earnEAC} onNavigate={handleNavigate} onPlaceOrder={handlePlaceOrder} vendorProducts={vendorProducts} />}
          {activeView === 'research' && <ResearchInnovation user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'biotech_hub' && <Biotechnology user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'permaculture_hub' && <Permaculture user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'cea_portal' && <CEA user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'emergency_portal' && <EmergencyPortal user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'agro_regency' && <AgroRegency user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'intranet' && <IntranetPortal user={user} onSpendEAC={spendEAC} onNavigate={handleNavigate} />}
          {activeView === 'envirosagro_store' && <EnvirosAgroStore user={user} onSpendEAC={spendEAC} onPlaceOrder={handlePlaceOrder} />}
          {activeView === 'media' && <MediaHub user={user} userBalance={user.wallet.balance} onSpendEAC={spendEAC} />}
          {activeView === 'channelling' && <Channelling user={user} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />}
          {activeView === 'info' && <InfoPortal />}
          {activeView === 'ingest' && <NetworkIngest onSpendEAC={spendEAC} />}
          {activeView === 'vendor' && <VendorPortal user={user} onSpendEAC={spendEAC} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} vendorProducts={vendorProducts} onRegisterProduct={handleRegisterProduct} />}
          {['animal_world', 'plants_world', 'aqua_portal', 'soil_portal', 'air_portal'].includes(activeView) && (
            <NaturalResources user={user} type={activeView} onEarnEAC={earnEAC} onSpendEAC={spendEAC} />
          )}
        </div>
      </main>

      <EvidenceModal isOpen={isEvidenceModalOpen} onClose={() => setIsEvidenceModalOpen(false)} user={user} onMinted={(v) => earnEAC(v, 'EVIDENCE_VERIFIED')} />
      <FloatingConsultant user={user} />
    </div>
  );
};

export default App;