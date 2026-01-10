
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
  Flame,
  LayoutGrid,
  Map as MapIcon,
  Dog,
  Trees,
  HeartPulse,
  Home,
  Syringe,
  Pill,
  ShieldPlus,
  Thermometer,
  Sprout,
  ArrowDown,
  Settings,
  CircleDollarSign,
  Network,
  Radio,
  Wifi,
  Signal,
  ChevronLeft,
  Calendar,
  Gift,
  Star
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

const ZODIAC_FLOWERS: Record<string, { flower: string; color: string; desc: string }> = {
  'January': { flower: 'Carnation', color: 'text-pink-400', desc: 'Symbolizing fascination and distinction.' },
  'February': { flower: 'Violet', color: 'text-purple-400', desc: 'Symbolizing faithfulness and wisdom.' },
  'March': { flower: 'Daffodil', color: 'text-yellow-400', desc: 'Symbolizing rebirth and new beginnings.' },
  'April': { flower: 'Daisy', color: 'text-white', desc: 'Symbolizing innocence and purity.' },
  'May': { flower: 'Lily of the Valley', color: 'text-emerald-200', desc: 'Symbolizing humility and happiness.' },
  'June': { flower: 'Rose', color: 'text-rose-500', desc: 'Symbolizing love and passion.' },
  'July': { flower: 'Water Lily', color: 'text-blue-300', desc: 'Symbolizing enlightenment and purity.' },
  'August': { flower: 'Poppy', color: 'text-red-500', desc: 'Symbolizing strength of character.' },
  'September': { flower: 'Morning Glory', color: 'text-indigo-400', desc: 'Symbolizing affection and mortality.' },
  'October': { flower: 'Cosmos', color: 'text-pink-300', desc: 'Symbolizing order and peace.' },
  'November': { flower: 'Chrysanthemum', color: 'text-orange-400', desc: 'Symbolizing loyalty and honesty.' },
  'December': { flower: 'Narcissus', color: 'text-blue-100', desc: 'Symbolizing respect and faithfulness.' },
};

const BRANDS: Brand[] = [
  { 
    id: 'lilies', name: 'Lilies Around', icon: Flower2, color: 'text-pink-400', bg: 'bg-pink-400/10', 
    desc: 'Environmental Thrust (E): Specializing in the aesthetics of agriculture through comprehensive landscaping, exterior agro-designs (flower beds and gardens), and architectural farm structures. We bridge nature and engineering through aesthetic stewardship.', 
    action: 'Landscape Audit', thrust: 'environmental', toolType: 'info', volume: '1.2M EAC',
    products: [
      { id: 'l1', name: 'Flower Garden Design', price: 450, type: 'Service', icon: Flower2 },
      { id: 'l2', name: 'Farm Architecture Audit', price: 800, type: 'Service', icon: Home },
      { id: 'l3', name: 'Biodiversity Shard', price: 120, type: 'Product', icon: Leaf },
      { id: 'l4', name: 'Exterior Layout Plan', price: 300, type: 'Service', icon: LayoutGrid }
    ]
  },
  { 
    id: 'agromusika', name: 'AgroMusika', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/10', 
    desc: 'Technological Thrust (T): Pioneer of Plant Wave Technology. We utilize scientific rhythmic m™ Time Signatures and bio-electric frequency stimulation to stimulate crop photosynthesis and soil molecular repair.', 
    action: 'Frequency Audit', thrust: 'technological', toolType: 'utility', volume: '4.8M EAC',
    products: [
      { id: 'm1', name: 'Plant Wave Bio-Emitter', price: 950, type: 'Product', icon: Sprout },
      { id: 'm2', name: '432Hz Core Generator', price: 450, type: 'Product', icon: Zap },
      { id: 'm3', name: 'Rhythmic Yield Tuning', price: 120, type: 'Service', icon: Waves }
    ]
  },
  { 
    id: 'hearts4agro', name: 'Hearts4Agro', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10', 
    desc: 'Societal Thrust (S): Healing the social fabric through SID remediation, animal nursing and pet care, environment care, and social care protocols for the EnvirosAgro™ community.', 
    action: 'Social Audit', thrust: 'societal', toolType: 'info', volume: '2.5M EAC',
    products: [
      { id: 'h1', name: 'Animal Nursing & Pet Care', price: 350, type: 'Service', icon: Dog },
      { id: 'h2', name: 'Environment Care Shard', price: 250, type: 'Product', icon: Trees },
      { id: 'h3', name: 'Social Care Outreach', price: 400, type: 'Service', icon: Users2 },
      { id: 'h4', name: 'SID Trauma Clearing', price: 500, type: 'Finance', icon: Brain },
      { id: 'h5', name: 'Pet Wellness Relay', price: 150, type: 'Service', icon: HeartPulse }
    ]
  },
  { 
    id: 'medicag', name: 'MedicAg', icon: Stethoscope, color: 'text-teal-400', bg: 'bg-teal-400/10', 
    desc: 'Human Thrust (H): Pioneering the intersection of Agro-Medicine and Doctory. We specialize in high-purity medicinal crop protocols and steward physiological remediation (Agro-Doctory) to boost worker longevity.', 
    action: 'Health Audit', thrust: 'human', toolType: 'info', volume: '15.4M EAC',
    products: [
      { id: 'ma1', name: 'Agro-Medicine Clinic', price: 650, type: 'Service', icon: Stethoscope },
      { id: 'ma2', name: 'Doctory Consult Node', price: 500, type: 'Service', icon: Activity },
      { id: 'ma3', name: 'Medicinal Botanical Batch', price: 1200, type: 'Product', icon: Pill },
      { id: 'ma4', name: 'High-Purity Serum Shard', price: 850, type: 'Product', icon: Syringe },
      { id: 'ma5', name: 'Steward Wellness Vouch', price: 200, type: 'Finance', icon: ShieldPlus }
    ]
  },
  { 
    id: 'agroinpdf', name: 'AgroInPDF', icon: FileJson, color: 'text-orange-400', bg: 'bg-orange-400/10', 
    desc: 'Industry Thrust (I): The primary protocol for sharding Knowledge Shards and technical research papers into the Archive Ledger. We power the intellectual capital of the EnvirosAgro network.', 
    action: 'Archive Shard Export', thrust: 'industry', toolType: 'info', volume: '10.2M EAC',
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
  onUpdateUser: (user: User) => Promise<void>;
}

const Ecosystem: React.FC<EcosystemProps> = ({ user, onDeposit, onUpdateUser }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [portalTab, setPortalTab] = useState<'ai' | 'market' | 'finance' | 'gateways' | 'bridge' | 'deposit' | 'registry' | 'gift'>('ai');

  const [esinSign, setEsinSign] = useState('');
  
  // Swap States
  const [swapInAmount, setSwapInAmount] = useState('1000');
  const [swapAsset, setSwapAsset] = useState('USDC');
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Deposit States
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedGateway, setSelectedGateway] = useState('M-Pesa Direct');
  const [isDepositing, setIsDepositing] = useState(false);
  const [optimizedYield, setOptimizedYield] = useState(1.0);

  // Zodiac Gift States
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [isClaimingGift, setIsClaimingGift] = useState(false);

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
    } else if (brand.id === 'lilies') {
      setPortalTab('gift');
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

  const handleClaimZodiacGift = async () => {
    if (user.zodiacFlower) {
      alert("GIFT CLAIMED: You already have your Zodiac Flower shard anchored to your node.");
      return;
    }

    setIsClaimingGift(true);
    const flowerData = ZODIAC_FLOWERS[selectedMonth];
    
    // Calculate points: 100 points towards worker status
    const points = 100;
    
    const updatedUser: User = {
      ...user,
      wallet: {
        ...user.wallet,
        lifetimeEarned: user.wallet.lifetimeEarned + points
      },
      skills: {
        ...user.skills,
        'Floral Stewardship': (user.skills['Floral Stewardship'] || 0) + points
      },
      zodiacFlower: {
        month: selectedMonth,
        flower: flowerData.flower,
        color: flowerData.color,
        pointsAdded: true
      }
    };

    await onUpdateUser(updatedUser);
    setIsClaimingGift(false);
    alert(`BIRTH MONTH GIFT: Claimed your ${flowerData.flower} shard! +${points} reputation points added to your steward dossier.`);
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
    
    setTimeout(() => {
      setIsSwapping(false);
      alert(`SWAP EXECUTED: Transaction routed through institutional node. ${swapAsset} reserved in Cloud Vault.`);
    }, 3000);
  };

  const runBrandAction = async () => {
    if (!activeBrand) return;
    setLoading(true);
    let query = "";
    
    if (activeBrand.id === 'tokenz') {
      query = `Generate an institutional report for the Center Gate regarding current EAC/FIAT liquidity and network reserve status.`;
    } else if (activeBrand.id === 'hearts4agro') {
      query = `Analyze current regional SID (Social Influenza Disease) load. Include impacts on animal nursing/pet care, environment care, and social care in the ${user.location} zone. How can these integrated social care protocols boost regional immunity?`;
    } else if (activeBrand.id === 'medicag') {
      query = `Conduct a Human (H) Thrust analysis for ${user.location}. Focus on "Agro-Medicine" (high-purity pharmaceutical crops) and "Agro-Doctory" (physiological steward health audits). Assess the biological link between social thrust pathogens and steward physiological health.`;
    } else if (activeBrand.id === 'lilies') {
      query = `Provide a comprehensive design audit for agricultural aesthetics, focusing on exterior landscaping, flower beds/gardens, and farm structure architecture for the ${user.location} zone. How does aesthetic stewardship impact the Environmental (E) Thrust?`;
    } else if (activeBrand.id === 'agromusika') {
      query = `Analyze bio-electric responses for crops in ${user.location} under Plant Wave Technology protocols. How do 432Hz and ultrasonic frequency modulations impact C(a)™ efficiency and soil molecular repair?`;
    } else if (activeBrand.id === 'agroinpdf') {
      query = `How does the AgroInPDF™ protocol secure industrial agricultural Knowledge Shards and research papers? Analyze its integration with the decentralized Archive Ledger and the impact of I-Thrust sharding on network reputation.`;
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
                <div className="flex flex-col">
                  <button 
                    onClick={() => setActiveBrand(null)}
                    className="flex items-center gap-2 mb-4 p-2 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all w-fit group/back"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Ecosystem</span>
                  </button>
                  <div className="flex items-center gap-6">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{activeBrand.name}</h2>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      {activeBrand.id === 'tokenz' ? 'Central Institutional Account' : activeBrand.id === 'hearts4agro' ? 'Social Care Portal' : activeBrand.id === 'medicag' ? 'Agro-Medicine & Doctory' : activeBrand.id === 'agromusika' ? 'Frequency Sync' : activeBrand.id === 'agroinpdf' ? 'Knowledge Sharding' : 'Terminal Intel'}
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
                    <div className="flex items-center justify-center gap-3"><Globe className="w-4 h-4" /> Global Ingress</div>
                  </button>
                </>
              ) : activeBrand.id === 'lilies' ? (
                <>
                  <button onClick={() => setPortalTab('gift')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'gift' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Gift className="w-4 h-4" /> Birth Month Gift</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'market' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Aesthetics Store</div>
                  </button>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'ai' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Bot className="w-4 h-4" /> Oracle Sync</div>
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
                    <div className="flex items-center justify-center gap-3"><Sparkles className="w-4 h-4" /> {activeBrand.id === 'hearts4agro' ? 'Integrated Care Sweep' : activeBrand.id === 'medicag' ? 'Agro-Medicine & Doctory' : activeBrand.id === 'agromusika' ? 'Frequency Sync' : 'Terminal Intel'}</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> {activeBrand.id === 'medicag' ? 'Agro-Pharmacopeia' : activeBrand.id === 'agromusika' ? 'Wave Hardware' : 'Services'}</div>
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-b from-[#050706] to-black">
              {activeBrand.id === 'lilies' && portalTab === 'gift' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
                  <div className="glass-card p-12 rounded-[56px] border-pink-500/20 bg-pink-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-10">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                      <Gift className="w-64 h-64 text-pink-400" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="w-24 h-24 bg-pink-500 rounded-[32px] flex items-center justify-center shadow-2xl mx-auto ring-4 ring-white/10">
                        <Calendar className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Zodiac <span className="text-pink-400">Flower Gift</span></h3>
                        <p className="text-slate-400 text-lg font-medium mt-4 max-w-xl mx-auto">
                          As an EnvirosAgro steward, receive a branded Zodiac Flower from Lilies Around. This shard anchors your birth month to your dossier and grants you 100 worker eligibility points.
                        </p>
                      </div>
                    </div>

                    {!user.zodiacFlower ? (
                      <div className="space-y-10 w-full max-w-md relative z-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Birth Month</label>
                          <select 
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-pink-500/20 outline-none transition-all appearance-none text-center cursor-pointer"
                          >
                            {Object.keys(ZODIAC_FLOWERS).map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        
                        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-4">
                           <div className={`text-5xl font-black italic tracking-tighter ${ZODIAC_FLOWERS[selectedMonth].color}`}>
                              {ZODIAC_FLOWERS[selectedMonth].flower}
                           </div>
                           <p className="text-slate-400 text-sm italic">"{ZODIAC_FLOWERS[selectedMonth].desc}"</p>
                        </div>

                        <button 
                          onClick={handleClaimZodiacGift}
                          disabled={isClaimingGift}
                          className="w-full py-8 bg-pink-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                        >
                          {isClaimingGift ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />}
                          CLAIM BIRTH MONTH GIFT
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-10 animate-in zoom-in duration-700 w-full max-w-md relative z-10">
                        <div className="w-48 h-48 rounded-full bg-pink-500/10 border-4 border-pink-500/30 flex items-center justify-center mx-auto relative group">
                          <Flower2 className={`w-24 h-24 ${user.zodiacFlower.color} group-hover:scale-110 transition-transform duration-500`} />
                          <div className="absolute inset-[-10px] border-2 border-dashed border-pink-500/20 rounded-full animate-spin-slow"></div>
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Your {user.zodiacFlower.flower}</h4>
                           <p className="text-pink-400 text-[10px] font-black uppercase tracking-[0.4em]">ANCHORED TO DOSSIER</p>
                        </div>
                        <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] flex items-center gap-6">
                           <Star className="w-10 h-10 text-emerald-400 fill-emerald-400/20" />
                           <p className="text-xs text-emerald-100 font-bold uppercase tracking-widest text-left">
                              +100 Rep Points Added. Your steward node is now more visible for industrial mission recruitment.
                           </p>
                        </div>
                        <button 
                          onClick={() => setPortalTab('ai')}
                          className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all"
                        >
                           Return to Terminal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-500 space-y-10">
                   <div className="glass-card p-12 rounded-[56px] border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                         <ArrowDownUp className="w-64 h-64 text-yellow-400" />
                      </div>
                      
                      <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                         <div className="w-16 h-16 bg-yellow-500/10 rounded-3xl flex items-center justify-center border border-yellow-500/20 shadow-2xl">
                            <ArrowDownUp className="w-8 h-8 text-yellow-500" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Institutional <span className="text-yellow-500">Swap</span></h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Direct Settlement via Center Gate Protocol</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="p-8 bg-black/40 border border-white/10 rounded-[32px] space-y-4 relative group">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                               <span>Sell</span>
                               <span>Balance: {user.wallet.balance.toFixed(2)} EAC</span>
                            </div>
                            <div className="flex items-center gap-6">
                               <input type="number" value={swapInAmount} onChange={e => setSwapInAmount(e.target.value)} className="flex-1 bg-transparent text-5xl font-mono font-black text-white outline-none" />
                               <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                  <Coins className="w-6 h-6 text-emerald-500" />
                                  <span className="text-lg font-black text-white uppercase">EAC</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex justify-center -my-6 relative z-10">
                            <div className="p-4 bg-yellow-500 rounded-2xl shadow-xl shadow-yellow-900/40 text-black hover:rotate-180 transition-transform cursor-pointer">
                               <ArrowDown className="w-6 h-6" />
                            </div>
                         </div>

                         <div className="p-8 bg-black/40 border border-white/10 rounded-[32px] space-y-4 relative group">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                               <span>Buy</span>
                               <span>Est. Rate: 1 EAC = 0.85 {swapAsset}</span>
                            </div>
                            <div className="flex items-center gap-6">
                               <p className="flex-1 text-5xl font-mono font-black text-white">{(Number(swapInAmount) * 0.852).toFixed(2)}</p>
                               <select value={swapAsset} onChange={e => setSwapAsset(e.target.value)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-lg font-black text-white uppercase outline-none appearance-none cursor-pointer">
                                  <option>USDC</option>
                                  <option>USDT</option>
                                  <option>EURT</option>
                                  <option>BTC_INST</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/5">
                         <div className="p-6 bg-white/5 rounded-3xl space-y-2">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Price Impact</p>
                            <p className="text-lg font-mono font-black text-emerald-400">&lt; 0.01%</p>
                         </div>
                         <div className="p-6 bg-white/5 rounded-3xl space-y-2">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Settlement Time</p>
                            <p className="text-lg font-mono font-black text-white">~4.2s</p>
                         </div>
                      </div>

                      <div className="mt-8 p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Authorized ESIN Signature</label>
                          <div className="relative">
                             <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                             <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/40 border border-white/10 rounded-[32px] py-6 pl-16 pr-10 text-white font-mono uppercase tracking-[0.2em] focus:ring-4 focus:ring-yellow-500/40 outline-none transition-all" />
                          </div>
                      </div>

                      <button 
                        onClick={handleExecuteSwap}
                        disabled={isSwapping || !esinSign}
                        className="w-full py-8 bg-yellow-500 rounded-[32px] text-black font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-yellow-900/40 hover:scale-[1.02] active:scale-95 transition-all mt-8 flex items-center justify-center gap-4 disabled:opacity-30"
                      >
                         {isSwapping ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                         {isSwapping ? "INITIALIZING SETTLEMENT..." : "EXECUTE INSTITUTIONAL SWAP"}
                      </button>
                   </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'gateways' && (
                <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-500 space-y-10">
                   <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                         <Globe className="w-64 h-64 text-emerald-400" />
                      </div>
                      
                      <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-10">
                         <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                            <Network className="w-8 h-8 text-emerald-400" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Global <span className="text-emerald-400">Ingest Terminals</span></h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Institutional Connectivity Registry</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {[
                           { id: 'NG-LAG-01', location: 'Lagos, Nigeria', type: 'High Throughput', status: 'Active', ping: '12ms', icon: Signal },
                           { id: 'US-NEB-04', location: 'Omaha, USA', type: 'Core Registry Node', status: 'Active', ping: '8ms', icon: Wifi },
                           { id: 'KE-NAI-02', location: 'Nairobi, Kenya', type: 'Local Bridge', status: 'Maintenance', ping: '45ms', icon: Radio },
                           { id: 'SG-SIN-08', location: 'Singapore Hub', type: 'Institutional Relay', status: 'Active', ping: '15ms', icon: Globe },
                         ].map(node => (
                           <div key={node.id} className="p-8 bg-black/40 border border-white/10 rounded-[32px] space-y-6 group hover:border-emerald-500/30 transition-all">
                              <div className="flex justify-between items-start">
                                 <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl ${node.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                                       <node.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                       <h4 className="text-lg font-bold text-white uppercase tracking-tight">{node.location}</h4>
                                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{node.id}</p>
                                    </div>
                                 </div>
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${node.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                    {node.status}
                                 </span>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase">
                                    <span>Signal Latency</span>
                                    <span className="text-white font-mono">{node.ping}</span>
                                 </div>
                                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${node.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-50`} style={{ width: node.status === 'Active' ? '92%' : '15%' }}></div>
                                 </div>
                              </div>
                              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                                 Link Terminal Node <ChevronRight className="w-3 h-3" />
                              </button>
                           </div>
                         ))}
                      </div>

                      <div className="mt-12 p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] flex items-center gap-8 group">
                         <div className="w-16 h-16 rounded-[24px] bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:rotate-12 transition-transform">
                            <Activity className="w-8 h-8" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-lg font-bold text-white uppercase tracking-widest mb-1">Global Ingress Logic</h4>
                            <p className="text-xs text-slate-400 italic">"Terminals are optimized for the highest m™ resilience signatures. Connecting through a High Throughput node reduces bridge settlement time by 15%."</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

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

              {portalTab === 'ai' && (activeBrand.id !== 'tokenz') && (
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
                              {activeBrand.id === 'hearts4agro' ? <HeartPulse className="w-10 h-10 text-rose-400" /> : activeBrand.id === 'medicag' ? <Stethoscope className="w-10 h-10 text-teal-400" /> : activeBrand.id === 'agromusika' ? <Waves className="w-10 h-10 text-indigo-400" /> : activeBrand.id === 'agroinpdf' ? <FileJson className="w-10 h-10 text-orange-400" /> : <Bot className="w-10 h-10 text-emerald-400" />}
                              <div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{activeBrand.id === 'hearts4agro' ? 'Integrated Care Sweep' : activeBrand.id === 'medicag' ? 'Physiological Audit' : activeBrand.id === 'agromusika' ? 'Plant Wave Synthesis' : activeBrand.id === 'agroinpdf' ? 'Knowledge Shard Audit' : 'Terminal Intel'}</h4>
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
                              {activeBrand.id === 'hearts4agro' ? <Dog className="w-10 h-10 text-rose-400" /> : activeBrand.id === 'medicag' ? <Stethoscope className="w-10 h-10 text-teal-400" /> : activeBrand.id === 'lilies' ? <Home className="w-10 h-10 text-pink-400" /> : activeBrand.id === 'agromusika' ? <Sprout className="w-10 h-10 text-indigo-400" /> : activeBrand.id === 'agroinpdf' ? <FileJson className="w-10 h-10 text-orange-400" /> : <Sparkles className="w-10 h-10 text-emerald-400" />}
                           </div>
                           <div className="max-w-md mx-auto space-y-4">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-emerald-400">Terminal</span></h4>
                              <p className="text-slate-500 text-lg leading-relaxed">
                                 {activeBrand.id === 'hearts4agro' ? 'Invoke the Integrated Care Oracle to analyze animal nursing, social outreach, and environment health vectors.' : 
                                  activeBrand.id === 'medicag' ? 'Conduct a Human (H) Thrust session. Assess steward physiological health, analyze SID stress load, and optimize Agro-Medicine output.' :
                                  activeBrand.id === 'lilies' ? 'Initialize an aesthetic agro-audit for your zone. Covers gardens, structural farm architecture, and floral landscaping.' :
                                  activeBrand.id === 'agromusika' ? 'Synchronize with the Plant Wave Oracle to analyze bio-electric crop response and tune molecular frequencies.' :
                                  activeBrand.id === 'agroinpdf' ? 'Access the AgroInPDF™ Knowledge Oracle to analyze research sharding efficiency and I-Thrust ledger performance.' :
                                  `Invoke the EnvirosAgro™ oracle to generate strategic insights for the ${activeBrand.name} protocol.`}
                              </p>
                              <button 
                                onClick={runBrandAction}
                                className="px-12 py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto"
                              >
                                 <Zap className="w-6 h-6 fill-current" />
                                 {activeBrand.id === 'hearts4agro' ? 'RUN INTEGRATED CARE SWEEP' : activeBrand.id === 'medicag' ? 'RUN AGRO-DOCTORING AUDIT' : activeBrand.id === 'lilies' ? 'RUN AESTHETIC AUDIT' : activeBrand.id === 'agromusika' ? 'INITIALIZE WAVE SYNC' : activeBrand.id === 'agroinpdf' ? 'INITIALIZE KNOWLEDGE AUDIT' : 'RUN ORACLE SWEEP'}
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
