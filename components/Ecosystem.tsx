import React, { useState, useEffect, useMemo } from 'react';
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
  Container,
  Microscope,
  Waves,
  Grape,
  Radar,
  Lock,
  BookOpen,
  ArrowDownUp,
  CreditCard as CardIcon,
  Cable,
  Fingerprint
} from 'lucide-react';
import { searchAgroTrends, AIResponse, chatWithAgroExpert, getDeFiIntelligence } from '../services/geminiService';
import { User } from '../types';

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

const BRANDS: Brand[] = [
  { 
    id: 'lilies', name: 'Lilies Around', icon: Flower2, color: 'text-pink-400', bg: 'bg-pink-400/10', 
    desc: 'Environmental Thrust (E): Preserving floral biodiversity and ecosystem aesthetics through regenerative gardening.', 
    action: 'Flora Audit', thrust: 'environmental', toolType: 'info', volume: '1.2M EAC',
    products: [
      { id: 'l1', name: 'Pollinator Support Kit', price: 85, type: 'Product', icon: Leaf },
      { id: 'l2', name: 'Biodiversity Certification', price: 200, type: 'Service', icon: ShieldCheck }
    ]
  },
  { 
    id: 'agromusika', name: 'AgroMusika', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/10', 
    desc: 'Technological Thrust (T): Scientific frequency modulators for crop stimulation and soil molecular repair.', 
    action: 'Sonic Sweep', thrust: 'technological', toolType: 'utility', volume: '4.8M EAC',
    products: [
      { id: 'm1', name: '432Hz Core Emitter', price: 450, type: 'Product', icon: Zap },
      { id: 'm2', name: 'Rhythmic Yield Tuning', price: 120, type: 'Service', icon: Waves }
    ]
  },
  { 
    id: 'hearts4agro', name: 'Hearts4Agro', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10', 
    desc: 'Societal Thrust (S): Community-driven support and emotional wellness for global smallholder networks.', 
    action: 'Impact Sync', thrust: 'societal', toolType: 'info', volume: '2.5M EAC',
    products: [
      { id: 'h1', name: 'Steward Support Grant', price: 500, type: 'Finance', icon: Heart },
      { id: 'h2', name: 'Village Hub Blueprint', price: 150, type: 'Service', icon: Users2 }
    ]
  },
  { 
    id: 'medicag', name: 'MedicAg', icon: Stethoscope, color: 'text-teal-400', bg: 'bg-teal-400/10', 
    desc: 'Human Thrust (H): High-purity agricultural standards for the pharmaceutical and nutraceutical sectors.', 
    action: 'Purity Audit', thrust: 'human', toolType: 'info', volume: '15.4M EAC',
    products: [
      { id: 'ma1', name: 'ISO-Bio Lab Vouch', price: 1200, type: 'Service', icon: Microscope },
      { id: 'ma2', name: 'Medicinal Grade Extract', price: 850, type: 'Product', icon: Droplets }
    ]
  },
  { 
    id: 'agroinpdf', name: 'AgroInPDF', icon: FileJson, color: 'text-orange-400', bg: 'bg-orange-400/10', 
    desc: 'Industry Thrust (I): The standard protocol for sharding and distributing agricultural research data.', 
    action: 'Shard Extract', thrust: 'industry', toolType: 'info', volume: '10.2M EAC',
    products: [
      { id: 'pdf1', name: 'Yield Data Digest', price: 50, type: 'Product', icon: Database },
      { id: 'pdf2', name: 'Research Shard Storage', price: 150, type: 'Service', icon: Layers }
    ]
  },
  { 
    id: 'agroboto', name: 'Agroboto', icon: Bot, color: 'text-blue-500', bg: 'bg-blue-500/10', 
    desc: 'Technological Thrust (T): Autonomous hardware and AI-driven soil maintenance robotics.', 
    action: 'Bot Diagnostics', thrust: 'technological', toolType: 'utility', volume: '35M EAC',
    products: [
      { id: 'r1', name: 'Weeding Drone X-04', price: 2500, type: 'Product', icon: Bot },
      { id: 'r2', name: 'AI Harvest Schedule', price: 300, type: 'Service', icon: Cpu }
    ]
  },
  { 
    id: 'skyscout', name: 'SkyScout', icon: Binoculars, color: 'text-blue-400', bg: 'bg-blue-400/10', 
    desc: 'Technological Thrust (T): Hyper-spectral satellite monitoring and real-time U-Code performance tracking.', 
    action: 'Spectral Sync', thrust: 'technological', toolType: 'search', volume: '120M EAC',
    products: [
      { id: 's1', name: 'Global Thermal Stream', price: 5000, type: 'Finance', icon: Globe },
      { id: 's2', name: 'Local Ingest Relay', price: 400, type: 'Product', icon: Radar }
    ]
  },
  { 
    id: 'aquaflow', name: 'AquaFlow', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-400/10', 
    desc: 'Environmental Thrust (E): Smart irrigation grids and ZK-verified groundwater preservation tools.', 
    action: 'Flow Predict', thrust: 'environmental', toolType: 'utility', volume: '22M EAC',
    products: [
      { id: 'w1', name: 'Hydration Node P3', price: 950, type: 'Product', icon: Settings2 },
      { id: 'w2', name: 'Water Usage Audit', price: 150, type: 'Service', icon: Activity }
    ]
  },
  { 
    id: 'cookies', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-amber-500', bg: 'bg-amber-500/10', 
    desc: 'Industry Thrust (I): The premier marketplace for high-value value-added regenerative agro-products.', 
    action: 'Trade Analysis', thrust: 'industry', toolType: 'search', volume: '8.4M EAC',
    products: [
      { id: 'j1', name: 'Organic Batch Release', price: 250, type: 'Finance', icon: ShoppingBag },
      { id: 'j2', name: 'Vendor Shelf Vouch', price: 100, type: 'Service', icon: Store }
    ]
  },
  { 
    id: 'terrastore', name: 'TerraStore', icon: Store, color: 'text-emerald-400', bg: 'bg-emerald-400/10', 
    desc: 'Industry Thrust (I): Decentralized warehousing and industrial logistics sharding for global transit.', 
    action: 'Route Optimize', thrust: 'industry', toolType: 'utility', volume: '62M EAC',
    products: [
      { id: 't1', name: 'Climate-Stable Storage', price: 400, type: 'Service', icon: Warehouse },
      { id: 't2', name: 'Logistics Node Permit', price: 2000, type: 'Finance', icon: Container }
    ]
  },
  { 
    id: 'childsgrowth', name: 'ChildsGrowth', icon: Baby, color: 'text-yellow-400', bg: 'bg-yellow-400/10', 
    desc: 'Societal Thrust (S): Education and legacy systems for the next generation of planetary stewards.', 
    action: 'Legacy Map', thrust: 'societal', toolType: 'info', volume: '0.8M EAC',
    products: [
      { id: 'cg1', name: 'Stewardship Course', price: 20, type: 'Product', icon: BookOpen },
      { id: 'cg2', name: 'Junior Node License', price: 50, type: 'Service', icon: ShieldCheck }
    ]
  },
  { 
    id: 'tokenz', name: 'Tokenz', icon: Coins, color: 'text-yellow-500', bg: 'bg-yellow-500/10', 
    desc: 'Industry Thrust (I): The primary liquidity engine for tokenized agro-equity and network settlements.', 
    action: 'Finance Oracle', thrust: 'industry', toolType: 'defi', volume: '940M EAC',
    products: [
      { id: 'f1', name: 'Institutional Yield Pool', price: 5000, type: 'Finance', icon: TrendingUp },
      { id: 'f2', name: 'Multi-Sig Escrow Portal', price: 200, type: 'Service', icon: Lock }
    ]
  }
];

const THRUST_METADATA: Record<ThrustType, { label: string, icon: any, color: string, description: string, letter: string }> = {
  societal: { letter: 'S', label: 'Societal', icon: Users2, color: 'text-rose-400', description: 'Sociological & Anthropological Agriculture.' },
  environmental: { letter: 'E', label: 'Environmental', icon: Leaf, color: 'text-emerald-400', description: 'Agricultural Environmental Management.' },
  human: { letter: 'H', label: 'Human', icon: Dna, color: 'text-teal-400', description: 'Human Impact, Health & Psychology.' },
  technological: { letter: 'T', label: 'Technological', icon: Cpu, color: 'text-blue-400', description: 'Modern Agrarian Revolution Innovations.' },
  industry: { letter: 'I', label: 'Industry', icon: Factory, color: 'text-purple-400', description: 'Agricultural Industry Optimization & Blockchain Registries.' },
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
  const [portalTab, setPortalTab] = useState<'ai' | 'market' | 'finance' | 'gateways' | 'deposit' | 'registry'>('ai');

  const [esinSign, setEsinSign] = useState('');
  
  // Swap States
  const [swapInAmount, setSwapInAmount] = useState('100');
  const [swapAsset, setSwapAsset] = useState('USDT');
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Deposit States
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedGateway, setSelectedGateway] = useState('M-Pesa Direct');
  const [isDepositing, setIsDepositing] = useState(false);
  const [optimizedYield, setOptimizedYield] = useState(1.0);

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  useEffect(() => {
    const ca = user.metrics.agriculturalCodeU || 1.0;
    const m = user.metrics.timeConstantTau || 1.0;
    const multiplier = 1 + (Math.log10(ca * m + 1) / 5);
    setOptimizedYield(Number(multiplier.toFixed(4)));
  }, [user]);

  const launchBrand = (brand: Brand) => {
    setActiveBrand(brand);
    setAiResult(null);
    if (brand.id === 'tokenz') {
      setPortalTab('deposit');
    } else if (brand.thrust === 'industry') {
      setPortalTab('registry');
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
      setEsinSign('');
    }, 2500);
  };

  const handleExecuteSwap = async () => {
    if (!esinSign) {
      alert("SIGNATURE REQUIRED: Authorized ESIN needed to commit market swap.");
      return;
    }
    setIsSwapping(true);
    const transaction = {
      type: 'Swap',
      pair: `EAC/${swapAsset}`,
      amount: swapInAmount,
      source: 'Node Treasury'
    };
    const res = await getDeFiIntelligence(transaction);
    setAiResult(res);
    setIsSwapping(false);
    alert(`SWAP EXECUTED: Transaction enqueued for ZK-Rollup settlement.`);
  };

  const runBrandAction = async () => {
    if (!activeBrand) return;
    setLoading(true);
    let query = "";
    switch(activeBrand.thrust) {
      case 'societal': query = `Latest research on community-centric farming and the SEHTI societal impact for brand ${activeBrand.name}.`; break;
      case 'environmental': query = `Sustainability metrics for ${activeBrand.name} within the SEHTI environmental framework.`; break;
      case 'human': query = `Intersection of health and agriculture related to the mission of ${activeBrand.name}.`; break;
      case 'technological': query = `Emerging tech and AI precision monitoring for the ${activeBrand.name} protocol.`; break;
      case 'industry': query = `Industrial scaling and blockchain logistics for ${activeBrand.name}.`; break;
      default: query = `Strategy report for ${activeBrand.name} within EOS.`;
    }
    const result = await searchAgroTrends(query);
    setAiResult(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[48px] relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] agro-gradient opacity-[0.08] blur-[120px] -mr-64 -mt-64 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black uppercase rounded-full tracking-[0.3em] border border-white/10">Network Brands</span>
            <h2 className="text-6xl font-black text-white mt-6 mb-8 tracking-tighter italic">Brand <span className="text-emerald-400">Terminals</span></h2>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
              Interact with the primary brands powering the EOS ecosystem. From automated robotics to specialized liquidity pools, synchronize your node with verified industry leaders.
            </p>
          </div>
          <div className="relative z-10 flex gap-6 mt-12">
            <div className="flex -space-x-4">
              {BRANDS.slice(0, 6).map((B, idx) => (
                <div key={idx} className="w-14 h-14 rounded-2xl bg-[#050706] border-2 border-white/10 flex items-center justify-center shadow-2xl group hover:z-50 transition-all hover:-translate-y-2">
                  <B.icon className={`w-6 h-6 ${B.color}`} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center pl-4 border-l border-white/10">
              <p className="text-sm text-white font-black uppercase tracking-widest">{BRANDS.length} ACTIVE PROTOCOLS</p>
              <p className="text-[10px] text-emerald-500/60 font-mono tracking-tighter uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Network Health: Nominal
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-8 flex flex-col justify-center group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
             <TrendingUp className="w-40 h-40 text-yellow-500" />
          </div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
               <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Liquidity</h3>
          </div>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Total Shard Value (TSV)</p>
              <h4 className="text-5xl font-mono font-black text-white">1.24B <span className="text-xs font-bold text-yellow-500">EAC</span></h4>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 w-[84%] animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Average Yield</p>
                <p className="text-lg font-black text-emerald-400">+14.2%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Steward Nodes</p>
                <p className="text-lg font-black text-white">4,812</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] w-fit border border-white/5">
        <button 
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${filter === 'all' ? 'bg-white/10 text-white shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          All Terminals
        </button>
        {(Object.keys(THRUST_METADATA) as ThrustType[]).map((thrust) => {
          const meta = THRUST_METADATA[thrust];
          return (
            <button 
              key={thrust}
              onClick={() => setFilter(thrust)}
              className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${filter === thrust ? (thrust === 'industry' ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-white/10') + ' text-white shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`w-6 h-6 flex items-center justify-center bg-black/40 rounded-lg text-[10px] font-black ${meta.color}`}>{meta.letter}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} onLaunch={launchBrand} />
        ))}
      </div>

      {activeBrand && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setActiveBrand(null)}></div>
          
          <div className="relative w-full max-w-6xl h-[90vh] glass-card rounded-[56px] flex flex-col overflow-hidden shadow-2xl border-white/10 ring-1 ring-white/20 bg-[#050706]">
            <div className={`p-12 border-b border-white/5 flex items-center justify-between ${activeBrand.bg}`}>
              <div className="flex items-center gap-10">
                <div className="relative group">
                  <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-50 transition-opacity ${activeBrand.bg}`}></div>
                  <div className={`w-24 h-24 rounded-[32px] bg-black/60 flex items-center justify-center shadow-2xl border border-white/10 relative z-10 group-hover:rotate-6 transition-transform duration-500`}>
                    <activeBrand.icon className={`w-12 h-12 ${activeBrand.color}`} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-6">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{activeBrand.name}</h2>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Market Volume: {activeBrand.volume}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xl font-medium mt-2 max-w-2xl leading-relaxed">{activeBrand.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveBrand(null)}
                className="p-5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90 border border-white/5"
              >
                <X className="w-10 h-10" />
              </button>
            </div>

            <div className="flex border-b border-white/5 bg-white/[0.02] overflow-x-auto scrollbar-hide px-6">
              {activeBrand.id === 'tokenz' ? (
                <>
                  <button onClick={() => setPortalTab('deposit')} className={`flex-1 min-w-[200px] py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'deposit' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><PlusCircle className="w-4 h-4" /> Node Deposit</div>
                  </button>
                  <button onClick={() => setPortalTab('finance')} className={`flex-1 min-w-[200px] py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'finance' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ArrowDownUp className="w-4 h-4" /> Market Swap</div>
                  </button>
                  <button onClick={() => setPortalTab('gateways')} className={`flex-1 min-w-[200px] py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'gateways' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Cable className="w-4 h-4" /> Payment Rails</div>
                  </button>
                </>
              ) : activeBrand.thrust === 'industry' ? (
                <>
                  <button onClick={() => setPortalTab('registry')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'registry' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Database className="w-4 h-4" /> Registry Nodes</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Asset Market</div>
                  </button>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Bot className="w-4 h-4" /> Oracle Sync</div>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Sparkles className="w-4 h-4" /> Terminal Intel</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Services</div>
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-b from-[#050706] to-black">
              {activeBrand.id === 'tokenz' && portalTab === 'deposit' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-10">
                         <div className="glass-card p-12 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-10">
                            <div className="flex items-center gap-4">
                               <PlusCircle className="w-8 h-8 text-yellow-500" />
                               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Tokenz <span className="text-yellow-500">Gateway</span></h3>
                            </div>
                            <div className="space-y-8">
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Select Ingress Gateway</label>
                                  <div className="grid grid-cols-2 gap-4">
                                     {['M-Pesa Node', 'Stripe Bridge', 'Binance Pay Relay', 'Crypto Connect'].map(gate => (
                                       <button key={gate} onClick={() => setSelectedGateway(gate)} className={`p-5 rounded-[24px] border text-xs font-bold transition-all text-left flex items-center gap-4 ${selectedGateway === gate ? 'bg-yellow-500 border-white text-black shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                                          <div className={`p-3 rounded-xl ${selectedGateway === gate ? 'bg-black/20' : 'bg-white/5'}`}><Smartphone className="w-5 h-5" /></div>
                                          {gate}
                                       </button>
                                     ))}
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Amount (FIAT Proxy)</label>
                                  <div className="relative">
                                     <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[32px] py-12 px-10 text-6xl font-mono text-white focus:ring-8 focus:ring-yellow-500/10 outline-none transition-all" />
                                     <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl">USD</div>
                                  </div>
                               </div>
                               <div className="p-8 bg-black/40 rounded-[32px] border border-white/10 flex justify-between items-center group">
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-black text-slate-500 uppercase">EAC Asset Release</p>
                                      <p className="text-3xl font-mono font-black text-emerald-400">≈ {(Number(depositAmount) * optimizedYield).toFixed(2)} EAC</p>
                                   </div>
                                   <div className="p-4 bg-emerald-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                                      <RefreshCw className="w-6 h-6 text-emerald-500" />
                                   </div>
                               </div>
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Sign With ESIN</label>
                                  <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-mono uppercase tracking-[0.2em] focus:ring-4 focus:ring-yellow-500/40 outline-none transition-all" />
                               </div>
                               <button onClick={handleExecuteDeposit} disabled={isDepositing || !esinSign} className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30">
                                  {isDepositing ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                                  {isDepositing ? "SETTLING..." : "COMMIT SETTLEMENT"}
                                </button>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                               <Sparkles className="w-32 h-32 text-emerald-500" />
                            </div>
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2"><Sparkles className="w-4 h-4" /> EOS Multiplier</h4>
                            <div className="space-y-8">
                               <div className="space-y-2">
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Yield Ratio</p>
                                  <div className="flex items-end gap-3">
                                     <span className="text-6xl font-black text-white font-mono tracking-tighter">{optimizedYield}</span>
                                     <span className="text-emerald-400 font-black text-2xl mb-2">X</span>
                                  </div>
                               </div>
                               <p className="text-xs text-slate-400 leading-relaxed italic">"Calculated via C(a) and Resilience (m) indices."</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'finance' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-10">
                            <div className="flex items-center justify-between">
                               <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Open Market <span className="text-yellow-500">Swap</span></h3>
                               <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                               <div className="bg-black/60 p-8 rounded-[32px] border border-white/5 space-y-4 relative">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sell Assets</span>
                                     <span className="text-[10px] font-mono text-emerald-500">Balance: {user.wallet.balance.toFixed(2)} EAC</span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <input type="number" value={swapInAmount} onChange={e => setSwapInAmount(e.target.value)} className="flex-1 bg-transparent text-4xl font-mono text-white outline-none" />
                                     <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"><Coins className="w-4 h-4 text-black" /></div>
                                        <span className="text-sm font-black text-white">EAC</span>
                                     </div>
                                  </div>
                               </div>

                               <div className="flex justify-center -my-6 relative z-10">
                                  <button className="w-12 h-12 bg-yellow-500 rounded-2xl border-4 border-[#050706] flex items-center justify-center text-black hover:rotate-180 transition-transform duration-500 shadow-xl">
                                     <ArrowDownUp className="w-6 h-6" />
                                  </button>
                               </div>

                               <div className="bg-black/60 p-8 rounded-[32px] border border-white/5 space-y-4">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Receive Assets</span>
                                     <span className="text-[10px] font-mono text-blue-400">Rate: 1 EAC ≈ 0.85 {swapAsset}</span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <input type="number" disabled value={(Number(swapInAmount) * 0.85).toFixed(2)} className="flex-1 bg-transparent text-4xl font-mono text-slate-300 outline-none" />
                                     <select value={swapAsset} onChange={e => setSwapAsset(e.target.value)} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 outline-none text-sm font-black text-white appearance-none cursor-pointer">
                                        <option>USDT</option>
                                        <option>ETH</option>
                                        <option>SOL</option>
                                        <option>BTC</option>
                                     </select>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Node Authorization (ESIN)</label>
                               <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-mono uppercase tracking-[0.2em] focus:ring-4 focus:ring-yellow-500/40 outline-none" />
                            </div>

                            <button onClick={handleExecuteSwap} disabled={isSwapping || !esinSign} className="w-full py-8 bg-yellow-600 rounded-[32px] text-black font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-4 disabled:opacity-30">
                               {isSwapping ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowDownUp className="w-6 h-6" />}
                               {isSwapping ? "CALCULATING SLIPPAGE..." : "EXECUTE SWAP"}
                            </button>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                               <Activity className="w-4 h-4 text-yellow-500" /> Market Intelligence
                            </h4>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center py-4 border-b border-white/5">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Output</span>
                                  <span className="text-sm font-mono text-white">{(Number(swapInAmount) * 0.85).toFixed(4)} {swapAsset}</span>
                               </div>
                               <div className="flex justify-between items-center py-4 border-b border-white/5">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Network Fee</span>
                                  <span className="text-sm font-mono text-slate-400">0.05 EAC</span>
                               </div>
                               <div className="flex justify-between items-center py-4">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">ZK-Bridge Time</span>
                                  <span className="text-sm font-mono text-emerald-400">≈ 12 Seconds</span>
                               </div>
                            </div>
                            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                               </div>
                               <p className="text-[10px] text-blue-300 font-medium leading-relaxed italic">"Assets are bridged via ZK-Rollups ensuring privacy and instant cross-chain liquidity."</p>
                            </div>
                         </div>
                         <div className="glass-card p-10 rounded-[48px] bg-emerald-500/5 border-emerald-500/10">
                            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Liquidity Depth</h4>
                            <div className="h-24 flex items-end justify-between gap-1">
                               {[40,65,55,90,75,45,85,60,95,70,50,100].map((h, i) => (
                                 <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                               ))}
                            </div>
                            <p className="text-[9px] text-slate-500 mt-4 text-center uppercase font-black">POOL_HEALTH: STABLE // LIQ_ID: 0x882</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'gateways' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-8">
                         <div className="glass-card p-12 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-10">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <Cable className="w-8 h-8 text-yellow-500" />
                                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Payment <span className="text-yellow-500">Rails</span></h3>
                               </div>
                               <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10">Add Rail</button>
                            </div>

                            <div className="space-y-4">
                               {[
                                 { name: 'M-Pesa Direct', status: 'Linked', sync: '100%', balance: '$452.00', icon: Smartphone, col: 'text-emerald-400' },
                                 { name: 'Stripe Institutional', status: 'Configured', sync: '100%', balance: '$12,400.00', icon: CardIcon, col: 'text-blue-400' },
                                 { name: 'Binance Pay Relay', status: 'Pending Auth', sync: '0%', balance: '$0.00', icon: Globe, col: 'text-amber-500' },
                                 { name: 'Mastercard Cloud', status: 'Legacy Node', sync: '84%', balance: '$1,200.00', icon: Banknote, col: 'text-slate-500' },
                               ].map((rail, idx) => (
                                 <div key={idx} className="p-8 bg-black/60 rounded-[32px] border border-white/5 hover:border-yellow-500/20 transition-all flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                       <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                          <rail.icon className={`w-7 h-7 ${rail.col}`} />
                                       </div>
                                       <div>
                                          <p className="text-lg font-bold text-white uppercase tracking-tight">{rail.name}</p>
                                          <div className="flex items-center gap-3 mt-1">
                                             <span className={`text-[9px] font-black uppercase tracking-widest ${rail.status === 'Pending Auth' ? 'text-amber-500' : 'text-emerald-500'}`}>{rail.status}</span>
                                             <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                             <span className="text-[9px] font-mono text-slate-500">Sync: {rail.sync}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-sm font-mono text-slate-400 mb-1">{rail.balance}</p>
                                       <div className="flex items-center gap-2 text-[9px] font-black text-yellow-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                          Config Rail <Settings2 className="w-3 h-3" />
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[48px] bg-white/[0.02] border-white/5 flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-yellow-500/10 rounded-[32px] flex items-center justify-center border border-yellow-500/20">
                               <Fingerprint className="w-10 h-10 text-yellow-500" />
                            </div>
                            <div>
                               <h4 className="text-xl font-bold text-white uppercase tracking-widest leading-tight">Biometric Rail Access</h4>
                               <p className="text-slate-500 text-xs mt-2 leading-relaxed">Secure your financial ingress nodes with ZK-biometric hardware signatures.</p>
                            </div>
                            <button className="w-full py-4 bg-yellow-600 rounded-2xl text-black font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-yellow-500 transition-all">Setup Biometric Lock</button>
                         </div>
                         
                         <div className="p-8 glass-card rounded-[40px] border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                               <History className="w-4 h-4 text-slate-500" />
                               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rail Activity</h4>
                            </div>
                            <div className="space-y-4">
                               {[0,1,2].map(i => (
                                 <div key={i} className="flex justify-between items-center text-[10px]">
                                    <span className="text-slate-400 font-bold">Ingress: {i === 0 ? 'M-Pesa' : 'Stripe'}</span>
                                    <span className="text-emerald-500 font-mono">+$240.00</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Default Content Render (Marketplace etc.) */}
              {portalTab === 'market' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
                  {activeBrand.products.map(product => (
                    <div key={product.id} className="glass-card p-10 rounded-[40px] border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col h-full active:scale-95">
                       <div className="flex justify-between items-start mb-8">
                          <div className="p-5 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                             <product.icon className={`w-8 h-8 ${activeBrand.color}`} />
                          </div>
                          <span className="px-3 py-1 bg-white/5 text-[9px] font-black uppercase rounded tracking-widest border border-white/10 text-slate-500">{product.type}</span>
                       </div>
                       <h4 className="text-2xl font-black text-white mb-8 leading-tight tracking-tighter group-hover:text-emerald-400 transition-colors flex-1">{product.name}</h4>
                       <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                          <div>
                             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Asset Value</p>
                             <p className="text-2xl font-mono font-black text-white">{product.price.toLocaleString()} <span className="text-xs font-bold text-emerald-500">EAC</span></p>
                          </div>
                          <button className="p-4 bg-emerald-600 rounded-2xl text-white shadow-xl hover:bg-emerald-500 transition-all hover:scale-110 active:scale-95">
                             <ShoppingBag className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === 'ai' && (
                <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in duration-500">
                   <div className="glass-card p-12 rounded-[48px] border-white/5 bg-white/[0.01] flex flex-col items-center text-center space-y-10 min-h-[400px] justify-center relative">
                      {loading ? (
                        <div className="flex flex-col items-center gap-6">
                           <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                           <p className="text-emerald-400 font-black text-sm uppercase tracking-[0.4em] animate-pulse">Syncing Brand Intelligence...</p>
                        </div>
                      ) : aiResult ? (
                        <div className="w-full text-left space-y-10 animate-in fade-in duration-700">
                           <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                              <Bot className="w-10 h-10 text-emerald-400" />
                              <div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Terminal Intel</h4>
                                 <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest">{activeBrand.name.toUpperCase()} // SEHTI SHARD</p>
                              </div>
                           </div>
                           <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-loose text-lg italic whitespace-pre-line border-l-4 border-emerald-500/20 pl-10">
                              {aiResult.text}
                           </div>
                           <button onClick={() => setAiResult(null)} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Clear Stream</button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                           <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                              <Sparkles className="w-10 h-10 text-emerald-400" />
                           </div>
                           <div className="max-w-md mx-auto space-y-4">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-emerald-400">Terminal</span></h4>
                              <p className="text-slate-500 text-lg leading-relaxed">Invoke the Gemini oracle to generate strategic insights for the {activeBrand.name} protocol.</p>
                              <button 
                                onClick={runBrandAction}
                                className="px-12 py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto"
                              >
                                 <Zap className="w-6 h-6 fill-current" />
                                 RUN ORACLE SWEEP
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BrandCard: React.FC<{ brand: Brand; onLaunch: (b: Brand) => void }> = ({ brand, onLaunch }) => (
  <div 
    onClick={() => onLaunch(brand)}
    className="glass-card p-10 rounded-[44px] group hover:border-emerald-500/30 transition-all cursor-pointer relative flex flex-col h-full active:scale-95 duration-300 overflow-hidden bg-white/[0.02]"
  >
    <div className={`w-20 h-20 rounded-[32px] ${brand.bg} flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500 shadow-2xl border border-white/5`}>
      <brand.icon className={`w-10 h-10 ${brand.color}`} />
    </div>
    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">
      {brand.name}
    </h3>
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">{brand.volume}</span>
      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{brand.thrust} THRUST</span>
    </div>
    <p className="text-sm text-slate-400 leading-relaxed mb-10 flex-1 font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
      "{brand.desc}"
    </p>
    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">Access Terminal</span>
      <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
      </div>
    </div>
  </div>
);

export default Ecosystem;