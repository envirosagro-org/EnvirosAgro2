
import React, { useState, useEffect } from 'react';
import { 
  Flower2, 
  Music, 
  Heart, 
  Stethoscope, 
  FileJson, 
  Bot, 
  Binoculars, 
  Droplets, 
  Cookie, 
  Store, 
  Baby, 
  Coins,
  ArrowUpRight,
  X,
  Zap,
  Play,
  Download,
  Loader2,
  Globe,
  ExternalLink,
  Shield,
  Activity,
  BarChart3,
  Dna,
  Users2,
  Leaf,
  Settings2,
  Cpu,
  Info,
  TrendingUp,
  Database,
  ShoppingBag,
  CreditCard,
  Layers,
  Sparkles,
  ArrowRightLeft,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  Smartphone,
  ShieldCheck,
  History,
  Repeat,
  Link as LinkIcon,
  Key,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  Warehouse,
  Factory,
  HardHat,
  Container
} from 'lucide-react';
import { searchAgroTrends, AIResponse, chatWithAgroExpert, getDeFiIntelligence } from '../services/geminiService';
import { User } from '../types';

// SEHTI Framework Types
type ThrustType = 'societal' | 'environmental' | 'human' | 'technological' | 'industry';

interface Product {
  id: string;
  name: string;
  price: number;
  type: 'Product' | 'Service' | 'Finance';
  icon: any;
}

interface Brand {
  id: string;
  name: string;
  icon: any;
  color: string;
  bg: string;
  desc: string;
  action: string;
  thrust: ThrustType;
  toolType: 'search' | 'info' | 'utility' | 'defi';
  volume: string;
  products: Product[];
}

const BookOpen = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const Headphones = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

const BRANDS: Brand[] = [
  { 
    id: 'hearts', name: 'Hearts4Agro', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10', 
    desc: 'Societal Thrust (S): Global farmer welfare and sociological agriculture rooted in community traditions.', 
    action: 'Community Audit', thrust: 'societal', toolType: 'info', volume: '1.2M EAC',
    products: [
      { id: 'h1', name: 'Farmer Welfare Fund Contribution', price: 100, type: 'Finance', icon: Heart },
      { id: 'h2', name: 'Community Audit Report', price: 250, type: 'Service', icon: FileJson }
    ]
  },
  { 
    id: 'childs', name: 'ChildsGrowth', icon: Baby, color: 'text-purple-400', bg: 'bg-purple-400/10', 
    desc: 'Societal Thrust (S): Education and cultural transmission for the next generation of agro-stewards.', 
    action: 'Lineage Sync', thrust: 'societal', toolType: 'info', volume: '850K EAC',
    products: [
      { id: 'c1', name: 'Junior Agro-Curriculum Pack', price: 50, type: 'Product', icon: BookOpen },
      { id: 'c2', name: 'Mentorship Session', price: 300, type: 'Service', icon: Users2 }
    ]
  },
  { 
    id: 'lilies', name: 'Lilies Around', icon: Flower2, color: 'text-pink-400', bg: 'bg-pink-400/10', 
    desc: 'Environmental Thrust (E): Stewardship of biodiversity and sustainable resource management.', 
    action: 'Eco-Guard Audit', thrust: 'environmental', toolType: 'search', volume: '4.5M EAC',
    products: [
      { id: 'l1', name: 'Endangered Seed Vault Access', price: 1200, type: 'Product', icon: Leaf },
      { id: 'l2', name: 'Eco-Certification Audit', price: 500, type: 'Service', icon: Shield }
    ]
  },
  { 
    id: 'cookies', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-amber-500', bg: 'bg-amber-500/10', 
    desc: 'Environmental Thrust (E): Zero-carbon consumer goods production and supply chain regeneration.', 
    action: 'CO2 Footprint', thrust: 'environmental', toolType: 'info', volume: '2.1M EAC',
    products: [
      { id: 'ck1', name: 'Carbon-Neutral Batch Reserve', price: 45, type: 'Product', icon: Cookie },
      { id: 'ck2', name: 'Supply Chain Carbon Audit', price: 1500, type: 'Service', icon: Activity }
    ]
  },
  { 
    id: 'medic', name: 'MedicAg', icon: Stethoscope, color: 'text-teal-400', bg: 'bg-teal-400/10', 
    desc: 'Human Thrust (H): Agriculture meets psychology and health. Pharmaceutical-grade botanical systems.', 
    action: 'Bio-active Scan', thrust: 'human', toolType: 'search', volume: '3.8M EAC',
    products: [
      { id: 'm1', name: 'Medicinal Botanical Strains', price: 800, type: 'Product', icon: Flower2 },
      { id: 'm2', name: 'Farm-to-Pharma Consultation', price: 2000, type: 'Service', icon: Stethoscope }
    ]
  },
  { 
    id: 'scout', name: 'SkyScout', icon: Binoculars, color: 'text-blue-400', bg: 'bg-blue-400/10', 
    desc: 'Technological Thrust (T): High-fidelity monitoring via satellite, drone, and AI/ML yield forecasting.', 
    action: 'Orbital Scan', thrust: 'technological', toolType: 'search', volume: '12.4M EAC',
    products: [
      { id: 's1', name: 'Orbital Heatmap (Zone 4)', price: 350, type: 'Product', icon: Globe },
      { id: 's2', name: 'Drone Surveillance Mission', price: 1200, type: 'Service', icon: Binoculars }
    ]
  },
  { 
    id: 'musika', name: 'AgroMusika', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/10', 
    desc: 'Technological Thrust (T): Precision bio-telemetry using scientific audio resonance frequencies.', 
    action: 'Sonic Analysis', thrust: 'technological', toolType: 'utility', volume: '1.4M EAC',
    products: [
      { id: 'ms1', name: '432Hz Soil Resilience Loop', price: 25, type: 'Product', icon: Music },
      { id: 'ms2', name: 'Custom Sonic Calibration', price: 600, type: 'Service', icon: Headphones }
    ]
  },
  { 
    id: 'terra', name: 'TerraStore', icon: Warehouse, color: 'text-emerald-400', bg: 'bg-emerald-400/10', 
    desc: 'Industry Thrust (I): Large-scale storage solutions and decentralized physical asset registries.', 
    action: 'Registry Audit', thrust: 'industry', toolType: 'defi', volume: '50.2M EAC',
    products: [
      { id: 't1', name: 'Bulk Grain Storage (ZK-Verified)', price: 5000, type: 'Finance', icon: Container },
      { id: 't2', name: 'Industrial Supply Chain API', price: 150, type: 'Service', icon: Database }
    ]
  },
  { 
    id: 'tokenz', name: 'Tokenz', icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-400/10', 
    desc: 'Industry Thrust (I): Institutional DeFi protocol for tokenized industrial agro-assets.', 
    action: 'Liquidity Pool', thrust: 'industry', toolType: 'defi', volume: '120M EAC',
    products: [
      { id: 'tk1', name: 'Institutional Yield Protocol', price: 2500, type: 'Finance', icon: TrendingUp },
      { id: 'tk2', name: 'Multi-Sig Escrow Node', price: 3500, type: 'Finance', icon: Shield }
    ]
  },
];

const THRUST_METADATA: Record<ThrustType, { label: string, icon: any, color: string, description: string, letter: string }> = {
  societal: { letter: 'S', label: 'Societal', icon: Users2, color: 'text-red-400', description: 'Sociological & Anthropological Agriculture.' },
  environmental: { letter: 'E', label: 'Environmental', icon: Leaf, color: 'text-pink-400', description: 'Agricultural Environmental Management.' },
  human: { letter: 'H', label: 'Human', icon: Dna, color: 'text-teal-400', description: 'Human Impact, Health & Psychology.' },
  technological: { letter: 'T', label: 'Technological', icon: Cpu, color: 'text-blue-400', description: 'Modern Agrarian Revolution Innovations.' },
  industry: { letter: 'I', label: 'Industry', icon: Factory, color: 'text-emerald-400', description: 'Agricultural Industry Optimization & Blockchain Registries.' },
};

interface EcosystemProps {
  user: User;
  onDeposit: (amount: number, gateway: string) => void;
}

const Ecosystem: React.FC<EcosystemProps> = ({ user, onDeposit }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [portalTab, setPortalTab] = useState<'ai' | 'market' | 'finance' | 'gateways' | 'bridge' | 'deposit' | 'registry'>('ai');

  // Tokenz Specific State
  const [exchangePair, setExchangePair] = useState('EAC/USD');
  const [amountIn, setAmountIn] = useState('1000');
  const [esinSign, setEsinSign] = useState('');
  const [isExchangeLoading, setIsExchangeLoading] = useState(false);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<string[]>([]);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  // Deposit State
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedGateway, setSelectedGateway] = useState('M-Pesa Direct');
  const [isDepositing, setIsDepositing] = useState(false);
  const [optimizedYield, setOptimizedYield] = useState(1.0);

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  // Framework optimization logic for EAC Minting
  useEffect(() => {
    const ca = user.metrics.agriculturalCodeU || 1.0;
    const m = user.metrics.timeConstantTau || 1.0;
    const multiplier = 1 + (Math.log10(ca * m + 1) / 5);
    setOptimizedYield(Number(multiplier.toFixed(4)));
  }, [user]);

  const launchBrand = (brand: Brand) => {
    setActiveBrand(brand);
    setAiResult(null);
    if (brand.thrust === 'industry') {
      setPortalTab(brand.id === 'tokenz' ? 'finance' : 'registry');
    } else {
      setPortalTab('ai');
    }
  };

  const handleExecuteDeposit = () => {
    if (!esinSign) {
      alert("ESIN AUTH REQUIRED: Please sign with your Social Identification Number.");
      return;
    }
    setIsDepositing(true);
    setTimeout(() => {
      onDeposit(Number(depositAmount), selectedGateway);
      setIsDepositing(false);
      alert(`DEPOSIT SUCCESS: ${depositAmount} EAC minted and optimized at ${optimizedYield}x efficiency.`);
    }, 2500);
  };

  const runBrandAction = async () => {
    if (!activeBrand) return;
    setLoading(true);
    
    let query = "";
    switch(activeBrand.thrust) {
      case 'societal': query = `Latest research on anthropological agriculture, community roles in farming, and the SEHTI societal thrust impact.`; break;
      case 'environmental': query = `Global environmental management standards for regenerative farming and biodiversity stewardship.`; break;
      case 'human': query = `The intersection of agriculture, health, and human psychology in the context of regenerative cultivation.`; break;
      case 'technological': query = `Emerging technological innovations in agriculture: IoT, drones, and AI yield forecasting for SEHTI.`; break;
      case 'industry': query = `Industrial optimization strategies, blockchain supply chain management, and large-scale agricultural data registries.`; break;
      default: query = `Innovative updates for the ${activeBrand.thrust} thrust within the SEHTI framework.`;
    }

    const result = await searchAgroTrends(query);
    setAiResult(result);
    setLoading(false);
  };

  const handleEacExchange = async () => {
    if (!esinSign) {
      alert("SIGNATURE REQUIRED: Authorized ESIN needed to commit financial settlement.");
      return;
    }
    setIsExchangeLoading(true);
    const transaction = {
      type: 'Swap',
      pair: exchangePair,
      amount: amountIn,
      source: 'EAC Registry Wallet'
    };
    const res = await getDeFiIntelligence(transaction);
    setAiResult(res);
    setIsExchangeLoading(false);
  };

  const startWithdrawal = () => {
    if (!withdrawalAddress) {
      alert("DESTINATION ERROR: Please provide a valid external wallet address or IBAN.");
      return;
    }
    setIsBridgeActive(true);
    setBridgeStatus(['Initializing Bridge Relay...', 'Constructing ZK-Proof...', 'Synchronizing with Validator Nodes...']);
    
    setTimeout(() => setBridgeStatus(prev => [...prev, 'Cross-Chain Handshake Established.', 'Verifying Asset Liquidity Pool...']), 2000);
    setTimeout(() => setBridgeStatus(prev => [...prev, 'Transaction Signed (ESIN Auth).', 'Broadcasting to External Chain...']), 4000);
    setTimeout(() => {
      setIsBridgeActive(false);
      alert("WITHDRAWAL SUCCESSFUL: EAC has been dispatched across the EnvirosAgro Bridge. Check your external wallet in ~5 mins.");
    }, 6500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Portfolio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[40px] relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-96 h-96 agro-gradient opacity-10 blur-[100px] -mr-48 -mt-48 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded tracking-widest border border-emerald-500/20">The SEHTI Ecosystem</span>
            <h2 className="text-5xl font-black text-white mt-4 mb-6 leading-tight">Brand <span className="text-emerald-400">Registry</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Access decentralized services across the five SEHTI thrusts. From community welfare to industrial scale blockchain registries, synchronize your steward node with global agro-brands.
            </p>
          </div>
          <div className="relative z-10 flex gap-4 mt-8">
            <div className="flex -space-x-2">
              {BRANDS.slice(0, 5).map((B, idx) => (
                <div key={idx} className="w-12 h-12 rounded-full bg-[#050706] border-2 border-white/5 flex items-center justify-center shadow-lg group hover:z-50 transition-all">
                  <B.icon className={`w-5 h-5 ${B.color}`} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center pl-4">
              <p className="text-xs text-white font-bold">{BRANDS.length} Active Protocols</p>
              <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">Cross-Thrust Sync: Active</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] border-amber-500/20 bg-amber-500/5 space-y-6 flex flex-col justify-center group overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Network Liquidity</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total Staked Value (TVL)</p>
              <h4 className="text-4xl font-mono font-black text-white">425.8M <span className="text-xs font-bold text-amber-500">EAC</span></h4>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[78%] animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Global APY</p>
                <p className="text-sm font-bold text-emerald-400">14.2%</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Industrial Nodes</p>
                <p className="text-sm font-bold text-white">1,248</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thrust Filter */}
      <div className="flex flex-wrap gap-3 p-1 glass-card rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          All Channels
        </button>
        {(Object.keys(THRUST_METADATA) as ThrustType[]).map((thrust) => {
          const meta = THRUST_METADATA[thrust];
          return (
            <button 
              key={thrust}
              onClick={() => setFilter(thrust)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === thrust ? (thrust === 'industry' ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-white/10') + ' text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className="w-5 h-5 flex items-center justify-center bg-black/20 rounded-md text-[10px] font-black">{meta.letter}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} onLaunch={launchBrand} />
        ))}
      </div>

      {/* Modal - Brand Portal */}
      {activeBrand && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setActiveBrand(null)}></div>
          
          <div className="relative w-full max-w-6xl h-[90vh] glass-card rounded-[40px] flex flex-col overflow-hidden shadow-2xl border-white/10 ring-1 ring-white/20 bg-[#050706]">
            {/* Modal Header */}
            <div className={`p-10 border-b border-white/5 flex items-center justify-between ${activeBrand.bg}`}>
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${activeBrand.bg}`}></div>
                  <div className={`w-20 h-20 rounded-3xl bg-black/60 flex items-center justify-center shadow-2xl border border-white/10 relative z-10`}>
                    <activeBrand.icon className={`w-10 h-10 ${activeBrand.color}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{activeBrand.name} <span className={activeBrand.thrust === 'industry' ? 'text-emerald-400' : 'text-yellow-500'}>{activeBrand.thrust === 'industry' ? 'Industry' : 'Terminal'}</span></h2>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Volume: {activeBrand.volume}
                    </span>
                  </div>
                  <p className="text-slate-400 text-lg font-medium mt-1">{activeBrand.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveBrand(null)}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Portal Tab Navigation */}
            <div className="flex border-b border-white/5 bg-white/[0.02] overflow-x-auto scrollbar-hide">
              {activeBrand.id === 'tokenz' ? (
                <>
                  <button onClick={() => setPortalTab('deposit')} className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'deposit' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><PlusCircle className="w-4 h-4" /> Initiate Deposit</div>
                  </button>
                  <button onClick={() => setPortalTab('finance')} className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'finance' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ArrowRightLeft className="w-4 h-4" /> Exchange</div>
                  </button>
                  <button onClick={() => setPortalTab('gateways')} className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'gateways' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Smartphone className="w-4 h-4" /> Gateways</div>
                  </button>
                  <button onClick={() => setPortalTab('bridge')} className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'bridge' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ArrowUpCircle className="w-4 h-4" /> Bridge</div>
                  </button>
                </>
              ) : activeBrand.thrust === 'industry' ? (
                <>
                  <button onClick={() => setPortalTab('registry')} className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'registry' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Database className="w-4 h-4" /> Industry Registry</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Procurement</div>
                  </button>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Bot className="w-4 h-4" /> Industry Oracle</div>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Sparkles className="w-4 h-4" /> Node Intelligence</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Procurement</div>
                  </button>
                </>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-b from-[#050706] to-black">
              
              {/* Tokenz Deposit Tab */}
              {activeBrand.id === 'tokenz' && portalTab === 'deposit' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                       <div className="glass-card p-10 rounded-[40px] border-yellow-500/20 bg-yellow-500/5">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Initiate <span className="text-yellow-500">Deposit</span></h3>
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Select Payment Rail</label>
                                <div className="grid grid-cols-2 gap-3">
                                   {['M-Pesa Direct', 'Stripe Institutional', 'Binance Pay', 'PayPal World'].map(gate => (
                                     <button key={gate} onClick={() => setSelectedGateway(gate)} className={`p-4 rounded-2xl border text-xs font-bold transition-all text-left flex items-center gap-3 ${selectedGateway === gate ? 'bg-yellow-500 border-white text-black shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                                        <div className={`p-2 rounded-lg ${selectedGateway === gate ? 'bg-black/20' : 'bg-white/5'}`}><Smartphone className="w-4 h-4" /></div>
                                        {gate}
                                     </button>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Deposit Amount (FIAT Equivalent)</label>
                                <div className="relative">
                                   <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-3xl py-10 px-8 text-5xl font-mono text-white focus:ring-4 focus:ring-yellow-500/10 outline-none" />
                                   <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 font-black">USD</div>
                                </div>
                             </div>
                             <div className="p-6 bg-black/40 rounded-3xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                   <span className="text-[10px] font-black text-slate-500 uppercase">Estimated EAC Yield</span>
                                   <span className="text-xl font-mono font-black text-emerald-400">≈ {(Number(depositAmount) * optimizedYield).toFixed(2)} EAC</span>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Authorize Signature (ESIN)</label>
                                <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono uppercase tracking-widest focus:ring-2 focus:ring-yellow-500/40 outline-none" />
                             </div>
                             <button onClick={handleExecuteDeposit} disabled={isDepositing || !esinSign} className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                                {isDepositing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                                {isDepositing ? "PROCESSING PAYMENT..." : "INITIATE OPTIMIZED DEPOSIT"}
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
                          <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles className="w-4 h-4" /> EOS EAC Optimizer</h4>
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <p className="text-[9px] text-slate-500 font-bold uppercase">Dynamic Multiplier</p>
                                <div className="flex items-end gap-2"><span className="text-5xl font-black text-white font-mono">{optimizedYield}</span><span className="text-emerald-400 font-black mb-1">X</span></div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tokenz Exchange Tab */}
              {activeBrand.id === 'tokenz' && portalTab === 'finance' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="glass-card p-10 rounded-[40px] border-yellow-500/20 bg-yellow-500/5 space-y-8">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">EAC <span className="text-yellow-500">Swap</span></h3>
                       <div className="space-y-6">
                          <div className="p-6 bg-black/60 rounded-3xl border border-white/10 space-y-4">
                             <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">From</div>
                             <div className="flex justify-between items-center">
                                <input type="number" value={amountIn} onChange={e => setAmountIn(e.target.value)} className="bg-transparent text-4xl font-mono text-white outline-none w-1/2" />
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                   <Coins className="w-4 h-4 text-emerald-400" />
                                   <span className="text-sm font-bold text-white">EAC</span>
                                </div>
                             </div>
                             <div className="text-[10px] text-slate-600 font-bold uppercase px-2">Balance: {user.wallet.balance.toFixed(2)} EAC</div>
                          </div>

                          <div className="flex justify-center -my-3 relative z-10">
                             <button className="p-3 bg-yellow-500 rounded-2xl text-black shadow-xl hover:rotate-180 transition-transform"><ArrowDownCircle className="w-6 h-6" /></button>
                          </div>

                          <div className="p-6 bg-black/60 rounded-3xl border border-white/10 space-y-4">
                             <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">To</div>
                             <div className="flex justify-between items-center">
                                <div className="text-4xl font-mono text-slate-500">≈ {(Number(amountIn) * 0.85).toFixed(2)}</div>
                                <select value={exchangePair} onChange={e => setExchangePair(e.target.value)} className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-sm font-bold text-white outline-none">
                                   <option>EAC/USD</option>
                                   <option>EAC/KSH</option>
                                   <option>EAC/EUR</option>
                                   <option>EAC/BTC</option>
                                </select>
                             </div>
                          </div>

                          <button onClick={handleEacExchange} disabled={isExchangeLoading} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                             {isExchangeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Repeat className="w-5 h-5" />}
                             {isExchangeLoading ? "ANALYZING LIQUIDITY..." : "COMMIT EXCHANGE"}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6 flex flex-col justify-center min-h-[300px]">
                          <div className="flex items-center gap-3">
                             <Bot className="w-6 h-6 text-emerald-400" />
                             <h4 className="text-xs font-black text-white uppercase tracking-widest">Tokenz DeFi Oracle</h4>
                          </div>
                          {aiResult ? (
                            <div className="prose prose-invert max-w-none text-slate-400 text-xs italic leading-relaxed whitespace-pre-line animate-in fade-in duration-500">
                               {aiResult.text}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                               <Activity className="w-12 h-12 text-slate-800 animate-pulse" />
                               <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Awaiting Exchange Commitment</p>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tokenz Gateways Tab */}
              {activeBrand.id === 'tokenz' && portalTab === 'gateways' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { name: 'M-Pesa Direct', region: 'East Africa', speed: 'Instant', fee: '1.2%', icon: Smartphone, col: 'text-emerald-500' },
                      { name: 'Institutional SWIFT', region: 'Global', speed: '24-48 Hours', fee: '45 EAC Flat', icon: Banknote, col: 'text-blue-500' },
                      { name: 'Binance Pay Relay', region: 'Web3', speed: 'Instant', fee: '0.5%', icon: LinkIcon, col: 'text-yellow-500' },
                      { name: 'Stripe Institutional', region: 'US/EU', speed: 'Instant', fee: '2.9% + 30 EAC', icon: CreditCard, col: 'text-indigo-500' },
                    ].map(gate => (
                      <div key={gate.name} className="glass-card p-8 rounded-[40px] border-white/5 hover:border-white/20 transition-all group flex items-center gap-6">
                         <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${gate.col}`}>
                            <gate.icon className="w-8 h-8" />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                               <h4 className="text-lg font-bold text-white uppercase">{gate.name}</h4>
                               <span className="text-[8px] font-black text-emerald-400 uppercase">{gate.speed}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{gate.region} Rail • {gate.fee} Processing Fee</p>
                         </div>
                         <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tokenz Bridge Tab */}
              {activeBrand.id === 'tokenz' && portalTab === 'bridge' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in duration-500">
                  <div className="glass-card p-12 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-8">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                     
                     <div className="w-24 h-24 agro-gradient rounded-full flex items-center justify-center shadow-2xl relative z-10 group">
                        <ArrowUpCircle className={`w-12 h-12 text-white transition-transform ${isBridgeActive ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                     </div>

                     <div className="space-y-4 relative z-10">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">External <span className="text-yellow-500">Bridge</span></h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">Withdraw EAC to external non-custodial wallets or banking institutions via ZK-Proof relay.</p>
                     </div>

                     {!isBridgeActive ? (
                       <div className="w-full max-w-md space-y-6 relative z-10">
                          <div className="space-y-2 text-left">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Destination Address / IBAN</label>
                             <input type="text" value={withdrawalAddress} onChange={e => setWithdrawalAddress(e.target.value)} placeholder="0x... or International Bank Number" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono text-sm focus:ring-2 focus:ring-yellow-500/40 outline-none" />
                          </div>
                          <button onClick={startWithdrawal} className="w-full py-6 bg-yellow-500 rounded-[32px] text-black font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-yellow-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                             INITIALIZE WITHDRAWAL
                          </button>
                       </div>
                     ) : (
                       <div className="w-full max-w-md space-y-8 relative z-10 py-4 animate-in fade-in duration-700">
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                             <div className="h-full bg-yellow-500 animate-bridge-progress"></div>
                          </div>
                          <div className="space-y-3">
                             {bridgeStatus.map((status, i) => (
                               <div key={i} className="flex items-center gap-3 text-xs font-mono animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i*0.1}s` }}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                  <span className="text-slate-300 uppercase">{status}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}

                     <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center gap-6 relative z-10 w-full">
                        <ShieldCheck className="w-8 h-8 text-yellow-500" />
                        <div className="text-left">
                           <h4 className="text-xs font-bold text-white uppercase">ZK-Rollup Protocol</h4>
                           <p className="text-[10px] text-slate-500 leading-relaxed uppercase">Withdrawals are batched every 15 minutes to minimize network gas fees and maximize privacy.</p>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* Industry Registry Tab */}
              {activeBrand.thrust === 'industry' && portalTab === 'registry' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Container className="w-6 h-6" /></div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Asset Storage</h4>
                      <p className="text-xs text-slate-500 leading-relaxed italic">Manage physical agricultural assets linked to your ESIN node on the industrial blockchain.</p>
                    </div>
                    <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400"><HardHat className="w-6 h-6" /></div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Infrastructure</h4>
                      <p className="text-xs text-slate-500 leading-relaxed italic">Verified industrial equipment and facility registries for large-scale operations.</p>
                    </div>
                    <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Factory className="w-6 h-6" /></div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Processing</h4>
                      <p className="text-xs text-slate-500 leading-relaxed italic">Monitor the industrial processing chain from field to factory with immutable data logs.</p>
                    </div>
                  </div>
                  <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Registry <span className="text-emerald-400">Node Sync</span></h3>
                      <button className="px-6 py-2 bg-emerald-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">Export JSON Ledger</button>
                    </div>
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="p-6 bg-black/40 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-emerald-500/40 transition-all">
                          <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 font-mono text-xs">#0{i}</div>
                            <div>
                              <p className="text-sm font-bold text-white uppercase group-hover:text-emerald-400">Industrial Asset #{Math.floor(Math.random()*9000)+1000}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Block: {(Math.random()*1000000).toFixed(0)} • Confirmed</p>
                            </div>
                          </div>
                          <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Brand AI Content */}
              {portalTab === 'ai' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
                  <div className="glass-card p-12 rounded-[48px] min-h-[500px] flex flex-col relative group overflow-hidden border-white/5">
                    {!aiResult && !loading ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12">
                        <div className="relative">
                          <div className={`absolute inset-0 blur-3xl rounded-full scale-150 animate-pulse ${activeBrand.bg}`}></div>
                          <activeBrand.icon className={`w-28 h-28 ${activeBrand.color} relative z-10 opacity-20`} />
                        </div>
                        <div className="max-w-md space-y-4">
                          <h4 className="text-2xl font-bold text-white uppercase tracking-widest italic">Invoke {activeBrand.thrust} Node</h4>
                          <p className="text-slate-500 text-sm leading-relaxed">Requesting grounded intelligence from the EOS decentralized oracle network for the {activeBrand.thrust} thrust.</p>
                          <button onClick={runBrandAction} className="px-12 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all">
                            INITIALIZE {activeBrand.action.toUpperCase()}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-in fade-in duration-700">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                          <div className="flex items-center gap-4">
                            <Activity className="w-6 h-6 text-emerald-400" />
                            <h4 className="text-xl font-bold text-white uppercase tracking-widest">{activeBrand.action} Report</h4>
                          </div>
                        </div>
                        <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-loose text-lg whitespace-pre-line bg-black/40 p-12 rounded-[40px] border border-white/10 italic">
                          {aiResult?.text}
                        </div>
                      </div>
                    )}
                    {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050706]/80 backdrop-blur-md z-20">
                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                        <p className="text-emerald-400 font-bold mt-6 animate-pulse uppercase tracking-[0.2em] text-sm">Synchronizing Industry Integrals...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Standard Brand Marketplace Tab */}
              {portalTab === 'market' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeBrand.products.map((product) => (
                      <div key={product.id} className="glass-card p-10 rounded-[48px] group hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col border border-white/5 bg-white/[0.01]">
                        <div className="flex justify-between items-start mb-8">
                          <div className="p-5 bg-white/5 rounded-3xl group-hover:bg-emerald-500/10 transition-colors">
                            <product.icon className="w-8 h-8 text-emerald-400" />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${product.type === 'Finance' ? 'bg-amber-500/10 text-amber-500' : product.type === 'Service' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {product.type}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">{product.name}</h4>
                        <p className="text-xs text-slate-500 mb-10 leading-relaxed font-medium">Standard industrial contract for decentralized {product.type.toLowerCase()} fulfillment within the {activeBrand.name} {activeBrand.thrust} network.</p>
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Procurement Price</p>
                            <p className="text-2xl font-mono font-black text-white">{product.price} <span className="text-xs text-emerald-500">EAC</span></p>
                          </div>
                          <button className="px-10 py-4 bg-emerald-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:scale-105 transition-all">
                            Procure Node
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bridge-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-bridge-progress {
          animation: bridge-progress 6.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

// Internal BrandCard component
const BrandCard: React.FC<{ brand: Brand; onLaunch: (b: Brand) => void }> = ({ brand, onLaunch }) => (
  <div 
    onClick={() => onLaunch(brand)}
    className="glass-card p-8 rounded-[32px] group hover:border-emerald-500/30 transition-all cursor-pointer relative flex flex-col h-full active:scale-95 duration-200 overflow-hidden bg-white/[0.01]"
  >
    <div className={`w-16 h-16 rounded-2xl ${brand.bg} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-xl border border-white/5`}>
      <brand.icon className={`w-8 h-8 ${brand.color}`} />
    </div>
    
    <h3 className="text-xl font-black text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">
      {brand.name}
    </h3>
    
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[10px] font-mono text-emerald-500 font-bold">{brand.volume}</span>
      <div className="w-1 h-1 rounded-full bg-slate-700"></div>
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{brand.thrust} THRUST</span>
    </div>
    
    <p className="text-xs text-slate-400 leading-relaxed mb-8 flex-1 font-medium">
      {brand.desc}
    </p>
    
    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Open Portal</span>
      <div className="p-2 rounded-full bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
      </div>
    </div>
  </div>
);

export default Ecosystem;
