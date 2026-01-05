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
  Fingerprint,
  Landmark,
  ShieldAlert,
  ArrowLeftRight,
  DollarSign,
  Brain,
  Flame
} from 'lucide-react';
import { searchAgroTrends, AIResponse, analyzeTokenzFinance } from '../services/geminiService';
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
    desc: 'Environmental Thrust (E): Preserving floral biodiversity and C(a)™ Agro Code aesthetics through regenerative gardening.', 
    action: 'Flora Audit', thrust: 'environmental', toolType: 'info', volume: '1.2M EAC',
    products: [
      { id: 'l1', name: 'Pollinator Support Kit', price: 85, type: 'Product', icon: Leaf },
      { id: 'l2', name: 'Biodiversity Certification', price: 200, type: 'Service', icon: ShieldCheck }
    ]
  },
  { 
    id: 'agromusika', name: 'AgroMusika', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/10', 
    desc: 'Technological Thrust (T): Scientific rhythmic m™ Time Signatures for crop stimulation and soil molecular repair.', 
    action: 'Sonic Sweep', thrust: 'technological', toolType: 'utility', volume: '4.8M EAC',
    products: [
      { id: 'm1', name: '432Hz Core Emitter', price: 450, type: 'Product', icon: Zap },
      { id: 'm2', name: 'Rhythmic Yield Tuning', price: 120, type: 'Service', icon: Waves }
    ]
  },
  { 
    id: 'hearts4agro', name: 'Hearts4Agro', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10', 
    desc: 'Societal Thrust (S): Healing the social fabric through SID (Social Influenza Disease) remediation and intergenerational trauma clearing for EnvirosAgro™ smallholders.', 
    action: 'SID Remediation', thrust: 'societal', toolType: 'info', volume: '2.5M EAC',
    products: [
      { id: 'h1', name: 'Trauma Clearing Hub', price: 500, type: 'Finance', icon: Brain },
      { id: 'h2', name: 'Social Immunity Vouch', price: 150, type: 'Service', icon: ShieldCheck }
    ]
  },
  { 
    id: 'medicag', name: 'MedicAg', icon: Stethoscope, color: 'text-teal-400', bg: 'bg-teal-400/10', 
    desc: 'Human Thrust (H): Scientific physiological remediation of SID-induced stress and high-purity medicinal agricultural standards for worker longevity.', 
    action: 'H-Thrust Analysis', thrust: 'human', toolType: 'info', volume: '15.4M EAC',
    products: [
      { id: 'ma1', name: 'Anxiety Relief Batch #82', price: 1200, type: 'Service', icon: Microscope },
      { id: 'ma2', name: 'Neural Health Extract', price: 850, type: 'Product', icon: Droplets }
    ]
  },
  { 
    id: 'agroinpdf', name: 'AgroInPDF', icon: FileJson, color: 'text-orange-400', bg: 'bg-orange-400/10', 
    desc: 'Industry Thrust (I): The standard protocol for sharding and distributing EnvirosAgro™ research data.', 
    action: 'Shard Extract', thrust: 'industry', toolType: 'info', volume: '10.2M EAC',
    products: [
      { id: 'pdf1', name: 'Yield Data Digest', price: 50, type: 'Product', icon: Database },
      { id: 'pdf2', name: 'Research Shard Storage', price: 150, type: 'Service', icon: Layers }
    ]
  },
  { 
    id: 'agroboto', name: 'Agroboto', icon: Bot, color: 'text-blue-500', bg: 'bg-blue-500/10', 
    desc: 'Technological Thrust (T): Autonomous hardware and AI-driven C(a)™ Agro Code soil robotics.', 
    action: 'Bot Diagnostics', thrust: 'technological', toolType: 'utility', volume: '35M EAC',
    products: [
      { id: 'r1', name: 'Weeding Drone X-04', price: 2500, type: 'Product', icon: Bot },
      { id: 'r2', name: 'AI Harvest Schedule', price: 300, type: 'Service', icon: Cpu }
    ]
  },
  { 
    id: 'skyscout', name: 'SkyScout', icon: Binoculars, color: 'text-blue-400', bg: 'bg-blue-400/10', 
    desc: 'Technological Thrust (T): Hyper-spectral satellite monitoring and real-time C(a)™ performance tracking.', 
    action: 'Spectral Sync', thrust: 'technological', toolType: 'search', volume: '120M EAC',
    products: [
      { id: 's1', name: 'Global Thermal Stream', price: 5000, type: 'Finance', icon: Globe },
      { id: 's2', name: 'Local Ingest Relay', price: 400, type: 'Product', icon: Radar }
    ]
  },
  { 
    id: 'aquaflow', name: 'AquaFlow', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-400/10', 
    desc: 'Environmental Thrust (E): Smart irrigation grids and ZK-verified m™ Constant preservation tools.', 
    action: 'Flow Predict', thrust: 'environmental', toolType: 'utility', volume: '22M EAC',
    products: [
      { id: 'w1', name: 'Hydration Node P3', price: 950, type: 'Product', icon: Settings2 },
      { id: 'w2', name: 'Water Usage Audit', price: 150, type: 'Service', icon: Activity }
    ]
  },
  { 
    id: 'cookies', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-amber-500', bg: 'bg-amber-500/10', 
    desc: 'Industry Thrust (I): The marketplace for high-value C(a)™ verified value-added agro-products.', 
    action: 'Trade Analysis', thrust: 'industry', toolType: 'search', volume: '8.4M EAC',
    products: [
      { id: 'j1', name: 'Organic Batch Release', price: 250, type: 'Finance', icon: ShoppingBag },
      { id: 'j2', name: 'Vendor Shelf Vouch', price: 100, type: 'Service', icon: Store }
    ]
  },
  { 
    id: 'terrastore', name: 'TerraStore', icon: Store, color: 'text-emerald-400', bg: 'bg-emerald-400/10', 
    desc: 'Industry Thrust (I): Decentralized warehousing and industrial Five Thrusts™ logistics sharding.', 
    action: 'Route Optimize', thrust: 'industry', toolType: 'utility', volume: '62M EAC',
    products: [
      { id: 't1', name: 'Climate-Stable Storage', price: 400, type: 'Service', icon: Warehouse },
      { id: 't2', name: 'Logistics Node Permit', price: 2000, type: 'Finance', icon: Container }
    ]
  },
  { 
    id: 'childsgrowth', name: 'ChildsGrowth', icon: Baby, color: 'text-yellow-400', bg: 'bg-yellow-400/10', 
    desc: 'Societal Thrust (S): Education and legacy systems for next-gen EnvirosAgro™ stewards.', 
    action: 'Legacy Map', thrust: 'societal', toolType: 'info', volume: '0.8M EAC',
    products: [
      { id: 'cg1', name: 'Stewardship Course', price: 20, type: 'Product', icon: BookOpen },
      { id: 'cg2', name: 'Junior Node License', price: 50, type: 'Service', icon: ShieldCheck }
    ]
  },
  { 
    id: 'tokenz', name: 'Tokenz', icon: Landmark, color: 'text-yellow-500', bg: 'bg-yellow-500/10', 
    desc: 'Industry Thrust (I): The Center Gate institutional account managing global value ingress and network liquidity.', 
    action: 'Institutional Sync', thrust: 'industry', toolType: 'defi', volume: '940M EAC',
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
  const [portalTab, setPortalTab] = useState<'ai' | 'market' | 'finance' | 'gateways' | 'bridge' | 'deposit' | 'registry'>('ai');

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

  const handleExecuteDeposit = async () => {
    if (!esinSign) {
      alert("ESIN AUTH REQUIRED: Please sign with your Social Identification Number.");
      return;
    }
    setIsDepositing(true);
    
    // Consult Institutional Oracle for System Value Integration
    const handshakeData = {
      gateway: selectedGateway,
      amount: depositAmount,
      currency: 'USD',
      user: user.esin,
      ca_code: user.metrics.agriculturalCodeU
    };

    const oracleRes = await analyzeTokenzFinance(handshakeData);
    setAiResult(oracleRes);
    
    setTimeout(() => {
      onDeposit(Number(depositAmount), selectedGateway);
      setIsDepositing(false);
      alert(`CENTER GATE SETTLED: Institutional account synchronized. ${depositAmount} EAC minted.`);
    }, 3000);
  };

  const handleExecuteSwap = async () => {
    if (!esinSign) {
      alert("SIGNATURE REQUIRED: Authorized ESIN needed to commit market swap.");
      return;
    }
    setIsSwapping(true);
    const transaction = {
      type: 'Institutional Swap',
      pair: `EAC/${swapAsset}`,
      amount: swapInAmount,
      source: 'Tokenz Central Gate'
    };
    const res = await analyzeTokenzFinance(transaction);
    setAiResult(res);
    setIsSwapping(false);
    alert(`SWAP EXECUTED: Transaction routed through institutional node.`);
  };

  const runBrandAction = async () => {
    if (!activeBrand) return;
    setLoading(true);
    let query = "";
    
    if (activeBrand.id === 'tokenz') {
      query = `Generate an institutional report for the Center Gate regarding current EAC/FIAT liquidity and network reserve status.`;
    } else if (activeBrand.id === 'hearts4agro') {
      query = `Analyze current regional SID (Social Influenza Disease) load. How are "Language Vectors" and intergenerational trauma nodes impacting Social Immunity in the ${user.location} zone? Suggest remediation for the Societal (S) Thrust.`;
    } else if (activeBrand.id === 'medicag') {
      query = `Assess the physiological impact of SID-induced pathogens (hypertension, anxiety) on agricultural workers. How can high-purity medicinal crop protocols improve the Human (H) Thrust and boost C(a)™ Agro Code efficiency?`;
    } else {
      switch(activeBrand.thrust) {
        case 'societal': query = `Latest research on community-centric farming and the Five Thrusts™ societal impact for brand ${activeBrand.name}.`; break;
        case 'environmental': query = `Sustainability metrics for ${activeBrand.name} within the Five Thrusts™ environmental framework.`; break;
        case 'human': query = `Intersection of health and agriculture related to the mission of ${activeBrand.name}.`; break;
        case 'technological': query = `Emerging tech and AI precision monitoring for the ${activeBrand.name} protocol.`; break;
        case 'industry': query = `Industrial scaling and blockchain logistics for ${activeBrand.name}.`; break;
        default: query = `Strategy report for ${activeBrand.name} within EOS.`;
      }
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
            <span className="px-4 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black uppercase rounded-full tracking-[0.3em] border border-white/10">EnvirosAgro™ Network Brands</span>
            <h2 className="text-6xl font-black text-white mt-6 mb-8 tracking-tighter italic">Brand <span className="text-emerald-400">Terminals</span></h2>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
              Interact with the primary brands powering the EOS ecosystem. The <span className="text-yellow-500">Tokenz Institutional Account</span> acts as the Center Gate for all financial value.
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
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Center Gate Auth: Online
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-8 flex flex-col justify-center group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
             <Landmark className="w-40 h-40 text-yellow-500" />
          </div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-yellow-500/20 rounded-xl">
               <ShieldCheck className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Institutional Gateway</h3>
          </div>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">System Value (Tokenz Reserves)</p>
              <h4 className="text-5xl font-mono font-black text-white">$4.2B <span className="text-xs font-bold text-yellow-500">AUM</span></h4>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 w-[92%] animate-pulse shadow-[0_0_10px_#eab308]"></div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">EAC/USD Parity</p>
                <p className="text-lg font-black text-emerald-400">1 : 0.852</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Bridge Latency</p>
                <p className="text-lg font-black text-white">12.4ms</p>
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
                      {activeBrand.id === 'tokenz' ? 'Central Institutional Account' : activeBrand.id === 'hearts4agro' ? 'SID Remediation Portal' : `Market Volume: ${activeBrand.volume}`}
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
                    <div className="flex items-center justify-center gap-3"><PlusCircle className="w-4 h-4" /> Node Bridge</div>
                  </button>
                  <button onClick={() => setPortalTab('finance')} className={`flex-1 min-w-[200px] py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'finance' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ArrowDownUp className="w-4 h-4" /> Institutional Swap</div>
                  </button>
                  <button onClick={() => setPortalTab('gateways')} className={`flex-1 min-w-[200px] py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'gateways' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Cable className="w-4 h-4" /> Global Ingress</div>
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
                    <div className="flex items-center justify-center gap-3"><Sparkles className="w-4 h-4" /> {activeBrand.id === 'hearts4agro' || activeBrand.id === 'medicag' ? 'SID Diagnostics' : 'Terminal Intel'}</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Services</div>
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-b from-[#050706] to-black">
              {activeBrand.id === 'tokenz' && portalTab === 'deposit' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-10">
                         <div className="glass-card p-12 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                               <ShieldAlert className="w-64 h-64 text-yellow-500" />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-4 bg-yellow-500 text-black rounded-3xl shadow-xl shadow-yellow-900/40">
                                  <Lock className="w-10 h-10" />
                                </div>
                               <div>
                                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Center Gate <span className="text-yellow-500">Node Bridge</span></h3>
                                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Institutional handshakes via ZK-handshake protocol</p>
                               </div>
                            </div>
                            <div className="space-y-8 relative z-10">
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Primary Ingress Rail</label>
                                  <div className="grid grid-cols-2 gap-4">
                                     {['M-Pesa Direct', 'Institutional Stripe', 'Binance Institutional', 'Crypto Bridge'].map(gate => (
                                       <button key={gate} onClick={() => setSelectedGateway(gate)} className={`p-6 rounded-[32px] border text-xs font-bold transition-all text-left flex items-center gap-4 ${selectedGateway === gate ? 'bg-yellow-500 border-white text-black shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                                          <div className={`p-4 rounded-2xl ${selectedGateway === gate ? 'bg-black/20' : 'bg-white/5'}`}><Smartphone className="w-6 h-6" /></div>
                                          <div>
                                             <p className="font-black uppercase tracking-tight">{gate}</p>
                                             <p className={`text-[8px] font-bold ${selectedGateway === gate ? 'text-black/60' : 'text-slate-600'}`}>0.2% SETTLEMENT FEE</p>
                                          </div>
                                       </button>
                                     ))}
                                  </div>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Ingress Value (Fiat)</label>
                                     <div className="relative group">
                                        <div className="absolute inset-0 bg-yellow-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                        <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[32px] py-10 px-10 text-5xl font-mono text-white focus:ring-8 focus:ring-yellow-500/10 outline-none transition-all relative z-10" />
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl z-10">USD</div>
                                     </div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                     <ArrowLeftRight className="w-10 h-10 text-yellow-500 mb-4 animate-pulse" />
                                     <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">EAC Mint Estimate</p>
                                        <p className="text-5xl font-mono font-black text-emerald-400">≈ {(Number(depositAmount) * optimizedYield).toFixed(1)}</p>
                                     </div>
                                  </div>
                               </div>

                               <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Authorized ESIN Signature</label>
                                  <div className="relative">
                                     <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                                     <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/40 border border-white/10 rounded-[32px] py-6 pl-16 pr-10 text-white font-mono uppercase tracking-[0.2em] focus:ring-4 focus:ring-yellow-500/40 outline-none transition-all" />
                                  </div>
                               </div>

                               <button onClick={handleExecuteDeposit} disabled={isDepositing || !esinSign} className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30">
                                  {isDepositing ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                                  {isDepositing ? "BRIDGE INITIALIZING..." : "EXECUTE CENTER GATE HANDSHAKE"}
                                </button>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 space-y-10">
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3"><Zap className="w-4 h-4 fill-current" /> Institutional Yield Multiplier</h4>
                            <div className="space-y-8">
                               <div className="p-8 bg-black/40 rounded-3xl border border-white/5 flex justify-between items-center">
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-bold text-slate-500 uppercase">C(a) Index</p>
                                     <p className="text-2xl font-mono font-black text-white">{user.metrics.agriculturalCodeU}</p>
                                  </div>
                                  <div className="space-y-1 text-right">
                                     <p className="text-[10px] font-bold text-slate-500 uppercase">Resilience m</p>
                                     <p className="text-2xl font-mono font-black text-white">{user.metrics.timeConstantTau}</p>
                                  </div>
                               </div>
                               <div className="space-y-2 text-center">
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Calculated System Ratio</p>
                                  <div className="flex items-end justify-center gap-3">
                                     <span className="text-7xl font-black text-white font-mono tracking-tighter">{optimizedYield}</span>
                                     <span className="text-emerald-400 font-black text-2xl mb-2">X</span>
                                  </div>
                               </div>
                               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-[10px] text-slate-400 leading-relaxed italic text-center">
                                  "Institutional value is anchored to node resilience. High m™ constant ensures premium bridge rates."
                               </div>
                            </div>
                         </div>

                         <div className="glass-card p-10 rounded-[40px] border-indigo-500/20 bg-indigo-500/5 space-y-6">
                            <div className="flex items-center gap-3">
                               <Bot className="w-6 h-6 text-indigo-400" />
                               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Gateway Intelligence</h4>
                            </div>
                            <div className="custom-scrollbar overflow-y-auto max-h-[150px] pr-2">
                               {aiResult ? (
                                 <div className="text-[11px] text-slate-300 italic leading-relaxed whitespace-pre-line animate-in fade-in duration-700">
                                    {aiResult.text}
                                 </div>
                               ) : (
                                 <p className="text-[11px] text-slate-500 italic leading-relaxed"> Handshake with the Center Gate to view live institutional bridge telemetry and system value audits. </p>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'finance' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-10">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                                     <ArrowDownUp className="w-6 h-6 text-yellow-500" />
                                  </div>
                                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Institutional <span className="text-yellow-500">Swap</span></h3>
                               </div>
                               <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                               <div className="bg-black/60 p-8 rounded-[32px] border border-white/5 space-y-4 relative">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Institutional Asset (In)</span>
                                     <span className="text-[10px] font-mono text-emerald-500">Balance: {user.wallet.balance.toFixed(2)} EAC</span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <input type="number" value={swapInAmount} onChange={e => setSwapInAmount(e.target.value)} className="flex-1 bg-transparent text-5xl font-mono text-white outline-none" />
                                     <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"><Coins className="w-5 h-5 text-black" /></div>
                                        <span className="text-lg font-black text-white">EAC</span>
                                     </div>
                                  </div>
                               </div>

                               <div className="flex justify-center -my-8 relative z-10">
                                  <button className="w-16 h-16 bg-yellow-500 rounded-3xl border-4 border-[#050706] flex items-center justify-center text-black hover:rotate-180 transition-transform duration-700 shadow-2xl shadow-yellow-900/40">
                                     <ArrowDownUp className="w-8 h-8" />
                                  </button>
                               </div>

                               <div className="bg-black/60 p-8 rounded-[32px] border border-white/5 space-y-4">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Settlement Asset (Out)</span>
                                     <span className="text-[10px] font-mono text-blue-400">System Value: 1 EAC ≈ 0.85 {swapAsset}</span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <input type="number" disabled value={(Number(swapInAmount) * 0.85).toFixed(2)} className="flex-1 bg-transparent text-5xl font-mono text-slate-300 outline-none" />
                                     <select value={swapAsset} onChange={e => setSwapAsset(e.target.value)} className="flex items-center gap-2 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 outline-none text-lg font-black text-white appearance-none cursor-pointer hover:bg-white/10 transition-all">
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
                               {isSwapping ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowLeftRight className="w-6 h-6" />}
                               {isSwapping ? "VERIFYING LIQUIDITY POOL..." : "SETTLE INSTITUTIONAL SWAP"}
                            </button>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-8 bg-black/40">
                            <div className="flex items-center gap-4">
                               <Activity className="w-8 h-8 text-yellow-500" />
                               <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">System <span className="text-yellow-500">Values</span></h4>
                            </div>
                            <div className="space-y-6">
                               {[
                                 { label: 'Network Depth', val: '1.24B EAC', icon: Layers, col: 'text-blue-400' },
                                 { label: 'EAC Yield Floor', val: '4.25%', icon: TrendingUp, col: 'text-emerald-400' },
                                 { label: 'Fiat Reserve Ratio', val: '1:1.2', icon: DollarSign, col: 'text-amber-400' },
                               ].map(val => (
                                 <div key={val.label} className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                       <val.icon className={`w-5 h-5 ${val.col}`} />
                                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{val.label}</span>
                                    </div>
                                    <span className="text-lg font-mono font-black text-white">{val.val}</span>
                                 </div>
                               ))}
                            </div>
                            <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex items-center gap-6">
                               <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                               </div>
                               <p className="text-xs text-emerald-300 font-medium leading-relaxed italic">"EnvirosAgro finance is collateralized by verified carbon-capture scientific nodes."</p>
                            </div>
                         </div>
                         <div className="glass-card p-10 rounded-[48px] bg-indigo-500/5 border-indigo-500/10 flex flex-col relative overflow-hidden group min-h-[300px]">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                               <Bot className="w-40 h-40 text-indigo-400" />
                            </div>
                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10"><Bot className="w-5 h-5" /> Institutional Oracle</h4>
                            <div className="flex-1 relative z-10 custom-scrollbar overflow-y-auto pr-2">
                               {aiResult ? (
                                 <div className="text-[11px] text-slate-300 italic leading-loose whitespace-pre-line animate-in slide-in-from-right-2">
                                    {aiResult.text}
                                 </div>
                               ) : (
                                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <Sparkles className="w-10 h-10 text-slate-700 opacity-20" />
                                    <p className="text-[11px] text-slate-600 font-medium italic">Handshake required for live financial analysis.</p>
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'gateways' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-8">
                         <div className="glass-card p-12 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 space-y-10">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <Cable className="w-10 h-10 text-yellow-500" />
                                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Global <span className="text-yellow-500">Ingress Rails</span></h3>
                               </div>
                               <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 shadow-lg">Link External account</button>
                            </div>

                            <div className="space-y-6">
                               {[
                                 { name: 'M-Pesa Node', status: 'Institutional Sync', sync: '100%', balance: '$452,000.00', icon: Smartphone, col: 'text-emerald-400', depth: 'HIGH' },
                                 { name: 'Institutional Stripe', status: 'Center Gate Handshake', sync: '100%', balance: '$12,400,000.00', icon: CardIcon, col: 'text-blue-400', depth: 'V.HIGH' },
                                 { name: 'Binance Pay Relay', status: 'Pending Multi-Sig', sync: '12%', balance: '$0.00', icon: Globe, col: 'text-amber-500', depth: 'LOW' },
                                 { name: 'Mastercard Institutional', status: 'Audit Mode', sync: '84%', balance: '$1,200,000.00', icon: Banknote, col: 'text-slate-500', depth: 'MEDIUM' },
                               ].map((rail, idx) => (
                                 <div key={idx} className="p-10 bg-black/60 rounded-[40px] border border-white/5 hover:border-yellow-500/20 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-yellow-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-10 relative z-10">
                                       <div className={`w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-black`}>
                                          <rail.icon className={`w-10 h-10 ${rail.col} group-hover:text-black transition-colors`} />
                                       </div>
                                       <div>
                                          <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{rail.name}</p>
                                          <div className="flex items-center gap-4 mt-3">
                                             <span className={`text-[10px] font-black uppercase tracking-widest ${rail.status === 'Pending Multi-Sig' ? 'text-amber-500' : 'text-emerald-500'}`}>{rail.status}</span>
                                             <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                                             <span className="text-[10px] font-mono text-slate-500 font-bold">NODE_DEPTH: {rail.depth}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-right relative z-10">
                                       <p className="text-2xl font-mono font-black text-white mb-1">{rail.balance}</p>
                                       <div className="flex items-center gap-3 justify-end text-[10px] font-black text-yellow-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                          MANAGE GATEWAY <ChevronRight className="w-4 h-4" />
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="glass-card p-12 rounded-[56px] bg-gradient-to-br from-yellow-600/10 to-transparent border-yellow-500/20 flex flex-col items-center text-center space-y-8">
                            <div className="relative">
                               <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                               <div className="w-24 h-24 bg-yellow-500 rounded-[32px] flex items-center justify-center shadow-2xl relative z-10 group hover:rotate-12 transition-transform">
                                  <Lock className="w-12 h-12 text-black" />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Biometric Ingress</h4>
                               <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium italic">"Secure institutional rails with hardware-encrypted ESIN handshakes."</p>
                            </div>
                            <button className="w-full py-6 bg-yellow-600 rounded-[32px] text-black font-black text-sm uppercase tracking-[0.3em] shadow-xl hover:bg-yellow-500 transition-all active:scale-95">Configure Hardware Lock</button>
                         </div>
                         
                         <div className="p-10 glass-card rounded-[48px] border-white/5 space-y-6 bg-black/40">
                            <div className="flex items-center gap-4">
                               <History className="w-6 h-6 text-slate-500" />
                               <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Institutional Handshake Log</h4>
                            </div>
                            <div className="space-y-6">
                               {[0,1,2].map(i => (
                                 <div key={i} className="flex justify-between items-center group">
                                    <div className="space-y-1">
                                       <p className="text-[10px] font-black text-white uppercase group-hover:text-yellow-500 transition-colors">{i === 0 ? 'M-Pesa Ingress' : i === 1 ? 'Stripe Settlement' : 'ZK-Bridge Auth'}</p>
                                       <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">TS_HANDSHAKE_{Math.random().toString(36).substring(7).toUpperCase()}</p>
                                    </div>
                                    <span className="text-sm font-mono font-black text-emerald-500">+$24,000.00</span>
                                 </div>
                               ))}
                            </div>
                            <button className="w-full py-4 text-[9px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Request full Audit Shard</button>
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
                              {activeBrand.id === 'hearts4agro' ? <Flame className="w-10 h-10 text-rose-400" /> : <Bot className="w-10 h-10 text-emerald-400" />}
                              <div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{activeBrand.id === 'hearts4agro' || activeBrand.id === 'medicag' ? 'Pathogen Analysis' : 'Terminal Intel'}</h4>
                                 <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest">{activeBrand.name.toUpperCase()} // Five Thrusts™ SHARD</p>
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
                              {activeBrand.id === 'hearts4agro' ? <Flame className="w-10 h-10 text-rose-400" /> : activeBrand.id === 'medicag' ? <Brain className="w-10 h-10 text-teal-400" /> : <Sparkles className="w-10 h-10 text-emerald-400" />}
                           </div>
                           <div className="max-w-md mx-auto space-y-4">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-emerald-400">Terminal</span></h4>
                              <p className="text-slate-500 text-lg leading-relaxed">
                                 {activeBrand.id === 'hearts4agro' ? 'Invoke the SID Oracle to analyze intergenerational social pathogens and trauma vectors.' : 
                                  activeBrand.id === 'medicag' ? 'Analyze the biological link between social thrust pathogens and steward physiological health.' :
                                  `Invoke the EnvirosAgro™ oracle to generate strategic insights for the ${activeBrand.name} protocol.`}
                              </p>
                              <button 
                                onClick={runBrandAction}
                                className="px-12 py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto"
                              >
                                 <Zap className="w-6 h-6 fill-current" />
                                 {activeBrand.id === 'hearts4agro' || activeBrand.id === 'medicag' ? 'RUN PATHOGEN SWEEP' : 'RUN ORACLE SWEEP'}
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