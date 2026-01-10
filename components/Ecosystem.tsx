
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
      {/* Ecosystem Command Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] relative overflow-hidden flex flex-col justify-between group bg-white/[0.01]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] agro-gradient opacity-[0.08] blur-[120px] -mr-64 -mt-64 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-6 h-6 text-emerald-500" />
              <span className="px-4 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black uppercase rounded-full tracking-[0.3em] border border-white/10">Global Service Mesh Directory</span>
            </div>
            <h2 className="text-7xl font-black text-white mb-8 tracking-tighter italic leading-none">Protocol <span className="text-emerald-400">Terminals</span></h2>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
              Interact with the primary brands powering the EOS ecosystem. Every handshake is audited by the <span className="text-yellow-500">Tokenz Center Gate</span> for network liquidity integrity.
            </p>
          </div>
          <div className="relative z-10 flex gap-10 mt-12 items-center">
            <div className="flex -space-x-4">
              {BRANDS.slice(0, 6).map((B, idx) => (
                <div key={idx} className="w-16 h-16 rounded-[24px] bg-[#050706] border-2 border-white/10 flex items-center justify-center shadow-2xl group hover:z-50 transition-all hover:-translate-y-3 hover:border-emerald-500/50">
                  <B.icon className={`w-8 h-8 ${B.color}`} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center pl-8 border-l border-white/10">
              <p className="text-sm text-white font-black uppercase tracking-widest">{BRANDS.length} ACTIVE PROTOCOLS</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <p className="text-[10px] text-emerald-500/60 font-mono tracking-tighter uppercase">Center Gate Auth: Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Gateway Dashboard */}
        <div className="glass-card p-10 rounded-[56px] border-yellow-500/20 bg-yellow-500/5 space-y-8 flex flex-col justify-center group overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
             <Landmark className="w-48 h-48 text-yellow-500" />
          </div>
          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="p-3 bg-yellow-500 text-black rounded-2xl shadow-xl shadow-yellow-900/20">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Center Gate Status</h3>
              <p className="text-[9px] text-yellow-500/60 font-black uppercase">Institutional Sync: Active</p>
            </div>
          </div>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Total Value Locked (TVL)</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter">$4.2B <span className="text-sm font-bold text-yellow-500">AUM</span></h4>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-yellow-500 w-[92%] animate-pulse shadow-[0_0_15px_#eab308]"></div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <div>
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">EAC/USD Index</p>
                <p className="text-xl font-black text-emerald-400 font-mono">0.852</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Shard Latency</p>
                <p className="text-xl font-black text-white font-mono">12.4ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Mesh */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40">
        <button 
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${filter === 'all' ? 'bg-white/10 text-white shadow-2xl ring-1 ring-white/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          Full Registry
        </button>
        {(Object.keys(THRUST_METADATA) as ThrustType[]).map((thrust) => {
          const meta = THRUST_METADATA[thrust];
          return (
            <button 
              key={thrust}
              onClick={() => setFilter(thrust)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${filter === thrust ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`w-6 h-6 flex items-center justify-center bg-black/40 rounded-lg text-[9px] font-black ${meta.color}`}>{meta.letter}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} onLaunch={launchBrand} />
        ))}
      </div>

      {/* Terminal Details Modal */}
      {activeBrand && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setActiveBrand(null)}></div>
          
          <div className="relative w-full max-w-6xl h-[90vh] glass-card rounded-[56px] flex flex-col overflow-hidden shadow-2xl border-white/10 ring-1 ring-white/20 bg-[#050706]">
            {/* Modal Header */}
            <div className={`p-12 border-b border-white/5 flex items-center justify-between ${activeBrand.bg} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                <activeBrand.icon className={`w-[600px] h-[600px] absolute -right-20 -top-20 ${activeBrand.color}`} />
              </div>
              
              <div className="flex items-center gap-12 relative z-10">
                <div className="relative group">
                  <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-50 transition-opacity ${activeBrand.bg}`}></div>
                  <div className={`w-32 h-32 rounded-[40px] bg-black/60 flex items-center justify-center shadow-2xl border border-white/10 relative z-10 group-hover:rotate-6 transition-transform duration-500 ring-4 ring-white/5`}>
                    <activeBrand.icon className={`w-16 h-16 ${activeBrand.color}`} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <button 
                    onClick={() => setActiveBrand(null)}
                    className="flex items-center gap-3 mb-6 p-2 px-6 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all w-fit group/back active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                    <span>Exit Terminal</span>
                  </button>
                  <div className="flex items-center gap-8">
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none m-0">{activeBrand.name}</h2>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      {activeBrand.thrust} Thrust Protocol
                    </div>
                  </div>
                  <p className="text-slate-400 text-2xl font-medium mt-6 max-w-3xl leading-relaxed italic">"{activeBrand.desc}"</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveBrand(null)}
                className="p-6 bg-white/5 hover:bg-rose-600/20 hover:text-rose-400 rounded-full text-white transition-all hover:rotate-90 border border-white/5 relative z-10"
              >
                <X className="w-12 h-12" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/5 bg-white/[0.02] overflow-x-auto scrollbar-hide px-6">
              {activeBrand.id === 'tokenz' ? (
                <>
                  <button onClick={() => setPortalTab('deposit')} className={`flex-1 min-w-[200px] py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'deposit' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><PlusCircle className="w-4 h-4" /> Node Bridge</div>
                  </button>
                  <button onClick={() => setPortalTab('finance')} className={`flex-1 min-w-[200px] py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'finance' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ArrowDownUp className="w-4 h-4" /> Institutional Swap</div>
                  </button>
                  <button onClick={() => setPortalTab('gateways')} className={`flex-1 min-w-[200px] py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'gateways' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Globe className="w-4 h-4" /> Global Ingress</div>
                  </button>
                </>
              ) : activeBrand.id === 'lilies' ? (
                <>
                  <button onClick={() => setPortalTab('gift')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'gift' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Gift className="w-4 h-4" /> Birth Month Gift</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'market' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Aesthetics Store</div>
                  </button>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'ai' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Bot className="w-4 h-4" /> Oracle Sync</div>
                  </button>
                </>
              ) : activeBrand.thrust === 'industry' ? (
                <>
                  <button onClick={() => setPortalTab('registry')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'registry' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Database className="w-4 h-4" /> Registry Nodes</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> Asset Market</div>
                  </button>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Bot className="w-4 h-4" /> Oracle Sync</div>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><Sparkles className="w-4 h-4" /> {activeBrand.id === 'hearts4agro' ? 'Integrated Care Sweep' : activeBrand.id === 'medicag' ? 'Agro-Medicine & Doctory' : activeBrand.id === 'agromusika' ? 'Frequency Sync' : 'Terminal Intel'}</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-3"><ShoppingBag className="w-4 h-4" /> {activeBrand.id === 'medicag' ? 'Agro-Pharmacopeia' : activeBrand.id === 'agromusika' ? 'Wave Hardware' : 'Services'}</div>
                  </button>
                </>
              )}
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-b from-[#050706] to-black custom-scrollbar">
              {/* Specialized Gift Portal */}
              {activeBrand.id === 'lilies' && portalTab === 'gift' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
                  <div className="glass-card p-16 rounded-[64px] border-pink-500/20 bg-pink-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-12 shadow-3xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                      <Gift className="w-96 h-96 text-pink-400" />
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                      <div className="w-28 h-28 bg-pink-500 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_rgba(236,72,153,0.3)] mx-auto ring-4 ring-white/10 group-hover:rotate-12 transition-transform">
                        <Calendar className="w-14 h-14 text-white" />
                      </div>
                      <div>
                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Zodiac <span className="text-pink-400">Flower Gift</span></h3>
                        <p className="text-slate-400 text-xl font-medium mt-6 max-w-xl mx-auto leading-relaxed">
                          As an EnvirosAgro steward, receive a branded Zodiac Flower from Lilies Around. This shard anchors your birth month to your dossier and grants you <span className="text-pink-400 font-black">100 bonus reputation points</span>.
                        </p>
                      </div>
                    </div>

                    {!user.zodiacFlower ? (
                      <div className="space-y-12 w-full max-w-md relative z-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Select Birth Month</label>
                          <select 
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-10 text-3xl font-black text-white focus:ring-4 focus:ring-pink-500/20 outline-none transition-all appearance-none text-center cursor-pointer shadow-inner"
                          >
                            {Object.keys(ZODIAC_FLOWERS).map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        
                        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[48px] space-y-6 shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className={`text-6xl font-black italic tracking-tighter leading-none ${ZODIAC_FLOWERS[selectedMonth].color}`}>
                              {ZODIAC_FLOWERS[selectedMonth].flower}
                           </div>
                           <p className="text-slate-400 text-lg italic leading-relaxed">"{ZODIAC_FLOWERS[selectedMonth].desc}"</p>
                        </div>

                        <button 
                          onClick={handleClaimZodiacGift}
                          disabled={isClaimingGift}
                          className="w-full py-10 bg-pink-600 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_50px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30"
                        >
                          {isClaimingGift ? <Loader2 className="w-10 h-10 animate-spin" /> : <Sparkles className="w-10 h-10" />}
                          CLAIM BIRTH MONTH GIFT
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-12 animate-in zoom-in duration-700 w-full max-w-md relative z-10">
                        <div className="relative">
                          <div className="w-56 h-56 rounded-full bg-pink-500/10 border-8 border-pink-500/30 flex items-center justify-center mx-auto group">
                            <Flower2 className={`w-32 h-32 ${user.zodiacFlower.color} group-hover:scale-110 transition-transform duration-700`} />
                            <div className="absolute inset-[-20px] border-4 border-dashed border-pink-500/20 rounded-full animate-spin-slow"></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-4xl font-black text-white uppercase tracking-tighter">Your {user.zodiacFlower.flower}</h4>
                           <p className="text-pink-400 text-[11px] font-black uppercase tracking-[0.6em]">ANCHORED TO STEWARD DOSSIER</p>
                        </div>
                        <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[48px] flex items-center gap-8 shadow-2xl">
                           <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg">
                              <Star className="w-8 h-8 text-white fill-white" />
                           </div>
                           <p className="text-sm text-emerald-100 font-bold uppercase tracking-widest text-left leading-relaxed">
                              +100 Rep Points Added. Your steward node is now prioritised for industrial mission recruitment campaigns.
                           </p>
                        </div>
                        <button 
                          onClick={() => setPortalTab('ai')}
                          className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all shadow-xl"
                        >
                           Return to Main Hub
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ... (Market and AI Tab logic remains functionally similar but benefits from the overall UI container improvements) ... */}
              
              {portalTab === 'market' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-right-4 duration-500">
                  {activeBrand.products.map(product => (
                    <div key={product.id} className="glass-card p-12 rounded-[56px] border border-white/5 hover:border-emerald-500/40 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/40 shadow-xl">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                          <product.icon className="w-32 h-32 text-white" />
                       </div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="p-6 rounded-3xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-2xl">
                             <product.icon className={`w-10 h-10 ${activeBrand.color}`} />
                          </div>
                          <span className="px-4 py-2 bg-white/5 text-[9px] font-black uppercase rounded-full tracking-widest border border-white/10 text-slate-500">{product.type}</span>
                       </div>
                       <h4 className="text-3xl font-black text-white mb-10 leading-tight tracking-tighter group-hover:text-emerald-400 transition-colors flex-1 italic">{product.name}</h4>
                       <div className="pt-10 border-t border-white/5 flex items-end justify-between relative z-10">
                          <div>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Protocol Fee</p>
                             <div className="flex items-center gap-3">
                               <p className="text-4xl font-mono font-black text-white">{product.price.toLocaleString()}</p>
                               <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">EAC</span>
                             </div>
                          </div>
                          <button className="p-6 bg-emerald-600 rounded-[28px] text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all hover:scale-110 active:scale-95">
                             <ShoppingBag className="w-8 h-8" />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === 'ai' && (activeBrand.id !== 'tokenz') && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
                   <div className="glass-card p-16 rounded-[64px] border-white/5 bg-white/[0.01] flex flex-col items-center text-center space-y-12 min-h-[500px] justify-center relative shadow-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] to-transparent pointer-events-none"></div>
                      {loading ? (
                        <div className="flex flex-col items-center gap-10">
                           <div className="relative">
                              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Bot className="w-8 h-8 text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <p className="text-emerald-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Syncing Shard Intel...</p>
                        </div>
                      ) : aiResult ? (
                        <div className="w-full text-left space-y-12 animate-in fade-in duration-700">
                           <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                 <Bot className="w-10 h-10 text-emerald-400" />
                              </div>
                              <div>
                                 <h4 className="text-3xl font-black text-white uppercase tracking-widest italic">Oracle Intelligence Shard</h4>
                                 <p className="text-emerald-500/40 text-[10px] font-mono tracking-widest uppercase font-black">{activeBrand.name.toUpperCase()} // EOS_FINAL_v3.2</p>
                              </div>
                           </div>
                           <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-[2.4] text-2xl italic whitespace-pre-line border-l-8 border-emerald-500/10 pl-16 font-medium bg-black/40 p-12 rounded-[56px] shadow-inner">
                              {aiResult.text}
                           </div>
                           <div className="flex justify-center pt-8">
                              <button onClick={() => setAiResult(null)} className="px-16 py-5 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black text-white uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Flush Data Cache</button>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-12">
                           <div className="relative group">
                              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                              <div className="w-32 h-32 rounded-[40px] bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl group-hover:rotate-12 transition-transform duration-700 relative z-10">
                                 <Sparkles className="w-16 h-16 text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="max-w-2xl mx-auto space-y-8">
                              <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Neural <span className="text-emerald-400">Oracle Sync</span></h4>
                              <p className="text-slate-500 text-2xl leading-relaxed italic font-medium">
                                 Invoke the EnvirosAgro™ high-fidelity oracle to analyze brand performance, SID load remediation, or C(a) growth constants for this specific protocol node.
                              </p>
                              <button 
                                onClick={runBrandAction}
                                className="px-16 py-8 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-6 mx-auto group"
                              >
                                 <Zap className="w-10 h-10 fill-current group-hover:animate-pulse" />
                                 INITIALIZE SYSTEM SWEEP
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
      
      {/* Footer Network Integrity */}
      <div className="flex justify-between items-center pt-16 border-t border-white/5 px-4 opacity-40">
        <div className="flex gap-10">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">ZK-REGISTRY_VERIFIED</span>
          </div>
          <div className="flex items-center gap-3">
             <Activity className="w-4 h-4 text-blue-400" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">STABLE_RESONANCE_FIELD</span>
          </div>
        </div>
        <p className="text-[9px] font-mono text-slate-700 font-black uppercase tracking-widest">Active Steward: {user.esin} // {user.location.toUpperCase()}</p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const BrandCard: React.FC<{ brand: Brand; onLaunch: (b: Brand) => void }> = ({ brand, onLaunch }) => (
  <div 
    onClick={() => onLaunch(brand)}
    className="glass-card p-10 rounded-[56px] group hover:border-emerald-500/40 transition-all cursor-pointer relative flex flex-col h-[500px] active:scale-[0.98] duration-300 overflow-hidden bg-white/[0.01] shadow-2xl"
  >
    {/* Animated Gradient Border Overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <div className="flex justify-between items-start mb-10 relative z-10">
      <div className={`w-24 h-24 rounded-[32px] ${brand.bg} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 shadow-2xl border border-white/5`}>
        <brand.icon className={`w-12 h-12 ${brand.color}`} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10 group-hover:border-emerald-500/50 transition-colors">
          {brand.volume}
        </span>
        <div className="flex gap-1">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
        </div>
      </div>
    </div>

    <div className="flex-1 space-y-4 relative z-10">
      <h3 className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic leading-none">
        {brand.name}
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{brand.thrust} THRUST</span>
        <span className="w-1 h-1 rounded-full bg-slate-800"></span>
        <span className="text-[10px] font-bold text-emerald-500/60 font-mono">NODE_ACTIVE_S8</span>
      </div>
      <p className="text-lg text-slate-500 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 group-hover:text-slate-300 transition-all line-clamp-4 pt-4">
        "{brand.desc}"
      </p>
    </div>

    <div className="pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">
           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-white transition-colors">Launch Shard</span>
      </div>
      <div className="flex flex-col items-end">
         <span className="text-[8px] text-slate-700 font-black uppercase mb-1">REGISTRY_STANDING</span>
         <div className="flex gap-1">
            {[0,1,2,3,4].map(i => <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />)}
         </div>
      </div>
    </div>
  </div>
);

export default Ecosystem;
