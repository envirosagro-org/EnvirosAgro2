
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
  // Added missing CheckCircle2 import
  CheckCircle2
} from 'lucide-react';
import { searchAgroTrends, AIResponse, chatWithAgroExpert, getDeFiIntelligence } from '../services/geminiService';

// SEHTI Framework Types
type ThrustType = 'societal' | 'environmental' | 'human' | 'technological' | 'informational';

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
    id: 'terra', name: 'TerraStore', icon: Store, color: 'text-emerald-400', bg: 'bg-emerald-400/10', 
    desc: 'Informational Thrust (I): Decentralized market data and immutable seed storage registries.', 
    action: 'Stock Registry', thrust: 'informational', toolType: 'defi', volume: '50.2M EAC',
    products: [
      { id: 't1', name: 'Premium Seed Equity', price: 5000, type: 'Finance', icon: Coins },
      { id: 't2', name: 'Real-time Market Data API', price: 150, type: 'Service', icon: Database }
    ]
  },
  { 
    id: 'tokenz', name: 'Tokenz', icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-400/10', 
    desc: 'Informational Thrust (I): DeFi information protocols for tokenized agro-assets and carbon.', 
    action: 'Yield Protocol', thrust: 'informational', toolType: 'defi', volume: '120M EAC',
    products: [
      { id: 'tk1', name: 'Harvest Yield Protocol', price: 2500, type: 'Finance', icon: TrendingUp },
      { id: 'tk2', name: 'Agro-Asset Vault Integration', price: 3500, type: 'Finance', icon: Shield }
    ]
  },
];

const THRUST_METADATA: Record<ThrustType, { label: string, icon: any, color: string, description: string, letter: string }> = {
  societal: { letter: 'S', label: 'Societal', icon: Users2, color: 'text-red-400', description: 'Sociological & Anthropological Agriculture.' },
  environmental: { letter: 'E', label: 'Environmental', icon: Leaf, color: 'text-pink-400', description: 'Agricultural Environmental Management.' },
  human: { letter: 'H', label: 'Human', icon: Dna, color: 'text-teal-400', description: 'Human Impact, Health & Psychology.' },
  technological: { letter: 'T', label: 'Technological', icon: Cpu, color: 'text-blue-400', description: 'Modern Agrarian Revolution Innovations.' },
  informational: { letter: 'I', label: 'Informational', icon: Database, color: 'text-emerald-400', description: 'Agricultural Information Technology & Data.' },
};

const Ecosystem: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [portalTab, setPortalTab] = useState<'ai' | 'market' | 'finance' | 'gateways' | 'bridge'>('ai');

  // Tokenz Specific State
  const [exchangePair, setExchangePair] = useState('EAC/USD');
  const [amountIn, setAmountIn] = useState('1000');
  const [esinSign, setEsinSign] = useState('');
  const [isExchangeLoading, setIsExchangeLoading] = useState(false);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<string[]>([]);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  const launchBrand = (brand: Brand) => {
    setActiveBrand(brand);
    setAiResult(null);
    setPortalTab(brand.id === 'tokenz' ? 'finance' : 'ai');
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
      case 'informational': query = `Advancements in agricultural data systems, blockchain registries, and informational industrial optimization.`; break;
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
              Access decentralized services across the five SEHTI thrusts. From community welfare to industrial DeFi, synchronize your steward node with global agro-brands.
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
                <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">DeFi Nodes</p>
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === thrust ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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

      {/* Modal - Brand Portal (Specialized for Tokenz DeFi) */}
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
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{activeBrand.name} <span className="text-yellow-500 font-black">Terminal</span></h2>
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
                  <button 
                    onClick={() => setPortalTab('finance')}
                    className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'finance' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <ArrowRightLeft className="w-4 h-4" /> Exchange & Liquidity
                    </div>
                  </button>
                  <button 
                    onClick={() => setPortalTab('gateways')}
                    className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'gateways' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Smartphone className="w-4 h-4" /> Payment Gateways
                    </div>
                  </button>
                  <button 
                    onClick={() => setPortalTab('bridge')}
                    className={`flex-1 min-w-[200px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'bridge' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <ArrowUpCircle className="w-4 h-4" /> External Bridge
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setPortalTab('ai')}
                    className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Sparkles className="w-4 h-4" /> Node Intelligence
                    </div>
                  </button>
                  <button 
                    onClick={() => setPortalTab('market')}
                    className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <ShoppingBag className="w-4 h-4" /> Procurement & Finance
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-b from-[#050706] to-black">
              
              {/* Tokenz Exchange Portal */}
              {activeBrand.id === 'tokenz' && portalTab === 'finance' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-10 rounded-[40px] border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden">
                       <div className="flex justify-between items-center mb-10">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Swap <span className="text-yellow-500">Engine</span></h3>
                          <div className="flex gap-2">
                             {['EAC/USD', 'EAC/KES', 'EAC/BTC', 'EAC/ETH'].map(p => (
                               <button 
                                key={p}
                                onClick={() => setExchangePair(p)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${exchangePair === p ? 'bg-yellow-500 text-black shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                               >
                                 {p}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="relative group">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"><Coins className="w-5 h-5 text-emerald-400" /></div>
                                <span className="text-sm font-black text-white uppercase tracking-widest">EAC</span>
                             </div>
                             <input 
                              type="number" 
                              value={amountIn}
                              onChange={e => setAmountIn(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-3xl py-12 pl-28 pr-10 text-5xl font-mono text-white focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all" 
                             />
                          </div>

                          <div className="flex justify-center -my-8 relative z-10">
                             <button className="p-5 bg-yellow-500 rounded-3xl shadow-2xl shadow-yellow-900/60 hover:rotate-180 transition-all duration-700 active:scale-90"><ArrowRightLeft className="w-8 h-8 text-black" /></button>
                          </div>

                          <div className="relative group">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30"><Banknote className="w-5 h-5 text-blue-400" /></div>
                                <span className="text-sm font-black text-white uppercase tracking-widest">{exchangePair.split('/')[1]}</span>
                             </div>
                             <div className="w-full bg-black/40 border border-white/5 rounded-3xl py-12 pl-28 pr-10 text-5xl font-mono text-slate-500 italic">
                               ≈ {(Number(amountIn) * (exchangePair.includes('KES') ? 130.42 : exchangePair.includes('BTC') ? 0.0000018 : 0.8524)).toLocaleString()}
                             </div>
                          </div>
                       </div>

                       <div className="mt-12 p-8 bg-black/60 rounded-[32px] border border-white/10 space-y-6">
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 font-bold uppercase tracking-widest">Slippage Tolerance</span>
                             <span className="text-emerald-400 font-mono">0.02% (Low)</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 font-bold uppercase tracking-widest">Registry Fee</span>
                             <span className="text-white font-mono">2.50 EAC</span>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Authorize Signature (ESIN)</label>
                             <div className="relative">
                               <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
                               <input 
                                type="text"
                                placeholder="EA-XXXX-XXXX-XXXX"
                                value={esinSign}
                                onChange={e => setEsinSign(e.target.value)}
                                className="w-full bg-black/80 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-mono uppercase tracking-widest focus:ring-2 focus:ring-yellow-500/40 outline-none transition-all" 
                               />
                             </div>
                          </div>
                          <button 
                           onClick={handleEacExchange}
                           disabled={isExchangeLoading}
                           className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                             {isExchangeLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Repeat className="w-6 h-6" />}
                             {isExchangeLoading ? "PROCESS SETTLEMENT..." : "EXECUTE SWAP & LIQUIDATE"}
                          </button>
                       </div>
                    </div>

                    {aiResult && (
                      <div className="glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 animate-in slide-in-from-left-4 duration-500">
                         <div className="flex items-center gap-3 mb-6">
                            <Bot className="w-8 h-8 text-emerald-400" />
                            <h4 className="text-xl font-bold text-white uppercase tracking-tighter">DeFi Oracle Opinion</h4>
                         </div>
                         <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line border-l-2 border-emerald-500/20 pl-8">
                            {aiResult.text}
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                     <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                           <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Registry Sync</h4>
                           <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] text-slate-600 font-black uppercase mb-1">EAC Real-World Price</p>
                              <h4 className="text-3xl font-mono font-black text-white">$1.18 <span className="text-[10px] text-emerald-400 font-bold ml-2">+2.4%</span></h4>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-600 font-black uppercase mb-1">24h Registry Volume</p>
                              <h4 className="text-2xl font-mono font-black text-slate-300">12.4M EAC</h4>
                           </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 space-y-4 text-center">
                           <ShieldCheck className="w-12 h-12 text-yellow-500 mx-auto opacity-40" />
                           <p className="text-[10px] text-slate-500 leading-relaxed italic uppercase">"All DeFi settlements are cross-verified by 12 institutional validator nodes."</p>
                        </div>
                     </div>

                     <div className="p-8 glass-card rounded-[40px] bg-indigo-600/5 border-indigo-500/20 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                           <TrendingUp className="w-5 h-5 text-indigo-400" />
                           <h5 className="font-bold text-white uppercase tracking-widest text-xs">Staking Yield</h5>
                        </div>
                        <p className="text-3xl font-black text-white font-mono">14.2% <span className="text-[10px] text-slate-500 uppercase tracking-widest">APY</span></p>
                        <button className="w-full py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40">
                           Stake Registry Credits
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {/* Tokenz Payment Gateways Tab */}
              {activeBrand.id === 'tokenz' && portalTab === 'gateways' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                   {[
                     { name: 'M-Pesa Direct', provider: 'Safaricom', type: 'Mobile Money', icon: Smartphone, col: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Direct EAC settlement to mobile currency. Optimized for Zone 2 hubs.' },
                     { name: 'Stripe Institutional', provider: 'Global Bank', type: 'Credit/Bank Rail', icon: CreditCard, col: 'text-indigo-400', bg: 'bg-indigo-400/10', desc: 'Enterprise-grade fiat on/off ramp for industrial stewards.' },
                     { name: 'Binance Pay', provider: 'Binance', type: 'Crypto-Rail', icon: Zap, col: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Lightning-fast crypto settlement via the EOS ZK-Relay.' },
                     { name: 'PayPal World', provider: 'PayPal', type: 'Digital Wallet', icon: Globe, col: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Global retail-friendly liquidity bridge for agro-products.' },
                     { name: 'SEPA Bridge', provider: 'EU Banking', type: 'Fiat Rail', icon: Banknote, col: 'text-teal-400', bg: 'bg-teal-400/10', desc: 'Direct clearing for Euro-zone agricultural cooperatives.' },
                     { name: 'USDC Vault', provider: 'Circle', type: 'Stablecoin', icon: Shield, col: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Hedge against volatility by anchoring EAC to institutional USDC.' },
                   ].map((gate) => (
                     <div key={gate.name} className="glass-card p-10 rounded-[48px] border-white/5 hover:border-yellow-500/30 transition-all group flex flex-col h-full relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                           <div className={`p-5 rounded-3xl ${gate.bg} group-hover:scale-110 transition-transform`}>
                              <gate.icon className={`w-8 h-8 ${gate.col}`} />
                           </div>
                           <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-widest border border-white/10 group-hover:border-yellow-500/20 group-hover:text-yellow-500">
                              Ready
                           </span>
                        </div>
                        <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">{gate.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{gate.provider} // {gate.type}</p>
                        <p className="text-xs text-slate-400 leading-relaxed flex-1 italic">"{gate.desc}"</p>
                        <div className="pt-8 border-t border-white/5 flex gap-4">
                           <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Link Account</button>
                           <button className="p-4 bg-yellow-500 rounded-2xl text-black hover:scale-110 transition-transform shadow-xl shadow-yellow-900/40"><ArrowRight className="w-5 h-5" /></button>
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {/* Tokenz Withdrawal & Bridge Tab */}
              {activeBrand.id === 'tokenz' && portalTab === 'bridge' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in duration-500">
                   <div className="glass-card p-12 rounded-[56px] border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-8">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform">
                         <LinkIcon className="w-80 h-80 text-yellow-500" />
                      </div>
                      
                      <div className="w-24 h-24 bg-yellow-500/10 rounded-[32px] flex items-center justify-center border border-yellow-500/30 shadow-2xl relative z-10">
                         <ArrowUpCircle className="w-12 h-12 text-yellow-500" />
                      </div>

                      <div className="space-y-3 relative z-10">
                         <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Cross-Chain <span className="text-yellow-500">Bridge</span></h2>
                         <p className="text-slate-400 text-lg max-w-lg leading-relaxed">Liquidate your EAC registry balance to external Web3 wallets or SWIFT-compliant bank accounts.</p>
                      </div>

                      <div className="w-full space-y-6 relative z-10">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 text-left">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Withdraw Amount (EAC)</label>
                               <input 
                                type="number" 
                                placeholder="500.00"
                                className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-8 text-2xl font-mono text-white focus:ring-2 focus:ring-yellow-500/40 outline-none" 
                               />
                            </div>
                            <div className="space-y-2 text-left">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Destination Chain/Rail</label>
                               <select className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-8 text-lg font-bold text-white focus:ring-2 focus:ring-yellow-500/40 outline-none appearance-none">
                                  <option>Ethereum Mainnet (0x)</option>
                                  <option>Polygon POS (0x)</option>
                                  <option>Bitcoin SegWit (bc1)</option>
                                  <option>M-Pesa Payout (+254)</option>
                                  <option>SWIFT/SEPA (IBAN)</option>
                               </select>
                            </div>
                         </div>

                         <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Target Address / Identifier</label>
                            <div className="relative">
                               <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                               <input 
                                type="text"
                                value={withdrawalAddress}
                                onChange={e => setWithdrawalAddress(e.target.value)}
                                placeholder="0x... / user@ens / +254..."
                                className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-white font-mono focus:ring-2 focus:ring-yellow-500/40 outline-none" 
                               />
                            </div>
                         </div>

                         {isBridgeActive ? (
                           <div className="p-10 glass-card rounded-[40px] bg-[#0a1510] border border-emerald-500/20 text-left space-y-6">
                              <div className="flex items-center gap-4">
                                 <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                                 <h4 className="text-xl font-bold text-white uppercase tracking-widest">Transmitting Bridge Packets</h4>
                              </div>
                              <div className="space-y-3">
                                 {bridgeStatus.map((s, i) => (
                                   <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left duration-300">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      <span className="text-xs font-mono text-slate-400">{s}</span>
                                   </div>
                                 ))}
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full agro-gradient w-full animate-bridge-progress"></div>
                              </div>
                           </div>
                         ) : (
                           <button 
                            onClick={startWithdrawal}
                            className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/60 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                           >
                              <Zap className="w-6 h-6 fill-current" /> Open Withdrawal Relay
                           </button>
                         )}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-6">
                         <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                            <h4 className="font-bold text-white uppercase tracking-widest text-sm">Security Audit</h4>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed">
                            "The EOS Bridge utilizes ZK-Rollups to ensure atomicity. If a withdrawal fails on the destination rail, EAC is automatically rolled back to your registry node treasury."
                         </p>
                      </div>
                      <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-6">
                         <div className="flex items-center gap-3">
                            <History className="w-6 h-6 text-blue-400" />
                            <h4 className="font-bold text-white uppercase tracking-widest text-sm">Recent Activity</h4>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-slate-400 font-mono">0x842...1C32</span>
                               <span className="text-emerald-400 font-black">SETTLED</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-slate-400 font-mono">+254 7XX XXX 01</span>
                               <span className="text-emerald-400 font-black">SETTLED</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Standard Brand Content (Non-Tokenz) */}
              {activeBrand.id !== 'tokenz' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                  <div className="lg:col-span-3 space-y-8">
                    {portalTab === 'ai' ? (
                      <div className="glass-card p-10 rounded-[40px] min-h-[500px] flex flex-col relative group overflow-hidden border-white/5">
                        {!aiResult && !loading ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12">
                            <div className="relative">
                              <div className={`absolute inset-0 blur-3xl rounded-full scale-150 animate-pulse ${activeBrand.bg}`}></div>
                              <activeBrand.icon className={`w-28 h-28 ${activeBrand.color} relative z-10 opacity-20`} />
                            </div>
                            <div className="max-w-md space-y-4">
                              <h4 className="text-2xl font-bold text-white uppercase tracking-widest">Invoke {activeBrand.thrust} Node</h4>
                              <p className="text-slate-500 text-sm leading-relaxed">
                                Requesting grounded intelligence from the EOS decentralized oracle network.
                              </p>
                              <button 
                                onClick={runBrandAction}
                                className="px-10 py-5 agro-gradient rounded-2xl text-white font-black text-sm shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all"
                              >
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
                            <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-loose text-lg whitespace-pre-line bg-white/[0.01] p-10 rounded-3xl border border-white/5">
                              {aiResult?.text}
                            </div>
                          </div>
                        )}
                        {loading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050706]/80 backdrop-blur-md z-20">
                            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                            <p className="text-emerald-400 font-bold mt-6 animate-pulse uppercase tracking-[0.2em] text-sm">Synchronizing SEHTI Integrals...</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeBrand.products.map((product) => (
                            <div key={product.id} className="glass-card p-8 rounded-[32px] group hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col border border-white/5">
                              <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                                  <product.icon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${product.type === 'Finance' ? 'bg-amber-500/10 text-amber-500' : product.type === 'Service' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                  {product.type}
                                </span>
                              </div>
                              <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
                              <p className="text-xs text-slate-500 mb-8 leading-relaxed">Standard contract for decentralized {product.type.toLowerCase()} fulfillment within the {activeBrand.name} network.</p>
                              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Price</p>
                                  <p className="text-xl font-mono font-black text-white">{product.price} <span className="text-xs text-emerald-500">EAC</span></p>
                                </div>
                                <button className="px-6 py-3 bg-emerald-600 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all">
                                  Procure
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Sidebar Portal Tools */}
                  <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[32px] space-y-6">
                      <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3">Node Treasury</h5>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Active TVL</p>
                          <p className="text-2xl font-mono font-black text-white">{activeBrand.volume}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Total Minted Equity</p>
                          <p className="text-2xl font-mono font-black text-emerald-400">14,200 UNITS</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card p-8 rounded-[32px] bg-blue-500/5 border-blue-500/10 space-y-4">
                      <CreditCard className="w-10 h-10 text-blue-400 mx-auto" />
                      <h5 className="font-bold text-white text-center">Settlement Node</h5>
                      <p className="text-xs text-slate-400 text-center leading-relaxed italic">
                        All transactions in this portal are settled instantly on the EnvirosAgro Registry.
                      </p>
                      <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        View Ledger History
                      </button>
                    </div>
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

// Internal Card Component
const BrandCard: React.FC<{ brand: Brand; onLaunch: (b: Brand) => void }> = ({ brand, onLaunch }) => (
  <div 
    onClick={() => onLaunch(brand)}
    className="glass-card p-8 rounded-[32px] group hover:border-emerald-500/30 transition-all cursor-pointer relative flex flex-col h-full active:scale-95 duration-200 overflow-hidden"
  >
    <div className={`w-16 h-16 rounded-2xl ${brand.bg} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-xl border border-white/5`}>
      <brand.icon className={`w-8 h-8 ${brand.color}`} />
    </div>
    
    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
      {brand.name}
    </h3>
    
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[10px] font-mono text-emerald-500 font-bold">{brand.volume}</span>
      <div className="w-1 h-1 rounded-full bg-slate-700"></div>
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{brand.products.length} Protocols</span>
    </div>
    
    <p className="text-xs text-slate-400 leading-relaxed mb-8 flex-1">
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
