
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Star,
  Compass,
  ArrowRightLeft as SwapIcon,
  Palette,
  PencilRuler,
  MessageSquareText,
  Flower,
  LeafyGreen,
  Sun,
  Handshake,
  FileBadge,
  Monitor,
  Bed,
  Utensils,
  Soup,
  HeartHandshake,
  SearchCode,
  CheckCircle,
  FileSearch,
  Scale,
  FileText,
  FileUp,
  Archive,
  ClipboardCheck,
  Upload,
  ClipboardList,
  IceCream,
  UtensilsCrossed,
  Cake,
  GraduationCap,
  ToyBrick,
  Puzzle,
  Gamepad2,
  Rocket,
  BadgeCheck,
  Award,
  Building,
  ChefHat
} from 'lucide-react';
import { searchAgroTrends, AIResponse, runSpecialistDiagnostic } from '../services/geminiService';
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

const ZODIAC_FLOWERS: Record<string, { flower: string; color: string; hex: string; desc: string }> = {
  'January': { flower: 'Carnation', color: 'text-pink-400', hex: '#f472b6', desc: 'Symbolizing fascination and distinction.' },
  'February': { flower: 'Violet', color: 'text-purple-400', hex: '#c084fc', desc: 'Symbolizing faithfulness and wisdom.' },
  'March': { flower: 'Daffodil', color: 'text-yellow-400', hex: '#facc15', desc: 'Symbolizing rebirth and new beginnings.' },
  'April': { flower: 'Daisy', color: 'text-white', hex: '#ffffff', desc: 'Symbolizing innocence and purity.' },
  'May': { flower: 'Lily of the Valley', color: 'text-emerald-200', hex: '#a7f3d0', desc: 'Symbolizing humility and happiness.' },
  'June': { flower: 'Rose', color: 'text-rose-500', hex: '#f43f5e', desc: 'Symbolizing love and passion.' },
  'July': { flower: 'Water Lily', color: 'text-blue-300', hex: '#93c5fd', desc: 'Symbolizing enlightenment and purity.' },
  'August': { flower: 'Poppy', color: 'text-red-500', hex: '#ef4444', desc: 'Symbolizing strength of character.' },
  'September': { flower: 'Morning Glory', color: 'text-indigo-400', hex: '#818cf8', desc: 'Symbolizing affection and mortality.' },
  'October': { flower: 'Cosmos', color: 'text-pink-300', hex: '#f9a8d4', desc: 'Symbolizing order and peace.' },
  'November': { flower: 'Chrysanthemum', color: 'text-orange-400', hex: '#fb923c', desc: 'Symbolizing loyalty and honesty.' },
  'December': { flower: 'Narcissus', color: 'text-blue-100', hex: '#dbeafe', desc: 'Symbolizing respect and faithfulness.' },
};

const BRANDS: Brand[] = [
  { 
    id: 'juizzycookiez', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-orange-500', bg: 'bg-orange-500/10', 
    desc: 'Industry Thrust (I): The premier artisanal agro-food production line. Merging regenerative ingredients into premium consumer goods with 100% batch transparency.', 
    action: 'Recipe Audit', thrust: 'industry', toolType: 'defi', volume: '840K EAC',
    products: [
      { id: 'jc1', name: 'Regen-Batch Cookie Tin', price: 25, type: 'Product', icon: Cookie },
      { id: 'jc2', name: 'Micro-Farm Jam Shard', price: 15, type: 'Product', icon: IceCream },
      { id: 'jc3', name: 'Artisanal Flour Hub', price: 40, type: 'Product', icon: Warehouse }
    ]
  },
  { 
    id: 'childsgrowth', name: "Child's Growth", icon: Baby, color: 'text-sky-400', bg: 'bg-sky-400/10', 
    desc: 'Societal Thrust (S): Nurturing the next generation. Early involvement and development of children through sustainable agriculture and gamified learning.', 
    action: 'Learning Sync', thrust: 'societal', toolType: 'info', volume: '14.2K Nodes',
    products: [
      { id: 'cg1', name: 'Junior Steward Kit', price: 120, type: 'Product', icon: ToyBrick },
      { id: 'cg2', name: 'Heritage Story Module', price: 30, type: 'Service', icon: BookOpen },
      { id: 'cg3', name: 'School-to-Farm Link', price: 250, type: 'Service', icon: GraduationCap }
    ]
  },
  { 
    id: 'lilies', name: 'Lilies Around', icon: Flower2, color: 'text-pink-400', bg: 'bg-pink-400/10', 
    desc: 'Environmental Thrust (E): Specializing in the aesthetics of agriculture through comprehensive landscaping, exterior agro-designs (flower beds and gardens), and architectural farm structures.', 
    action: 'Landscape Audit', thrust: 'environmental', toolType: 'info', volume: '1.2M EAC',
    products: [
      { id: 'l1', name: 'Flower Garden Design', price: 450, type: 'Service', icon: Flower2 },
      { id: 'l2', name: 'Farm Architecture Audit', price: 800, type: 'Service', icon: Home },
      { id: 'l3', name: 'Biodiversity Shard', price: 120, type: 'Product', icon: Leaf },
      { id: 'l4', name: 'Exterior Layout Plan', price: 300, type: 'Service', icon: LayoutGrid }
    ]
  },
  { 
    id: 'agroinpdf', name: 'AgroInPDF', icon: FileJson, color: 'text-orange-400', bg: 'bg-orange-400/10', 
    desc: 'Industry Thrust (I): The official knowledge sharding protocol. Standardizing research, documentation, and technical agricultural lineages into immutable industrial PDF shards.', 
    action: 'Sync Ledger', thrust: 'industry', toolType: 'utility', volume: '14.2K Shards',
    products: [
      { id: 'ap1', name: 'Research Ingest Shard', price: 100, type: 'Service', icon: FileUp },
      { id: 'ap2', name: 'Industrial Doc Bundle', price: 250, type: 'Product', icon: Archive },
      { id: 'ap3', name: 'Registry Peer Review', price: 50, type: 'Service', icon: ClipboardCheck }
    ]
  },
  { 
    id: 'agromusika', name: 'AgroMusika', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-400/10', 
    desc: 'Technological Thrust (T): Pioneer of Plant Wave Technology. We utilize rhythmic m™ Time Signatures to stimulate photosynthesis and soil repair.', 
    action: 'Frequency Audit', thrust: 'technological', toolType: 'utility', volume: '4.8M EAC',
    products: [
      { id: 'm1', name: 'Plant Wave Bio-Emitter', price: 950, type: 'Product', icon: Sprout },
      { id: 'm2', name: '432Hz Core Generator', price: 450, type: 'Product', icon: Zap },
      { id: 'm3', name: 'Rhythmic Yield Tuning', price: 120, type: 'Service', icon: Waves }
    ]
  },
  { 
    id: 'hearts4agro', name: 'Hearts4Agro', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10', 
    desc: 'Societal Thrust (S): Healing the social fabric through SID remediation, animal nursing, and social care protocols for stewards.', 
    action: 'Social Audit', thrust: 'societal', toolType: 'info', volume: '2.5M EAC',
    products: [
      { id: 'h1', name: 'Animal Nursing & Pet Care', price: 350, type: 'Service', icon: Dog },
      { id: 'h2', name: 'Environment Care Shard', price: 250, type: 'Product', icon: Trees },
      { id: 'h3', name: 'Social Care Outreach', price: 400, type: 'Service', icon: Users2 }
    ]
  },
  { 
    id: 'medicag', name: 'MedicAg', icon: Stethoscope, color: 'text-teal-400', bg: 'bg-teal-400/10', 
    desc: 'Human Thrust (H): Pioneering the intersection of Agro-Medicine and Doctory. High-purity medicinal crop protocols and physiological remediation.', 
    action: 'Health Audit', thrust: 'human', toolType: 'info', volume: '15.4M EAC',
    products: [
      { id: 'ma1', name: 'Agro-Medicine Clinic', price: 650, type: 'Service', icon: Stethoscope },
      { id: 'ma2', name: 'Doctory Consult Node', price: 500, type: 'Service', icon: Activity },
      { id: 'ma3', name: 'Medicinal Botanical Batch', price: 1200, type: 'Product', icon: Pill }
    ]
  },
  { 
    id: 'tokenz', name: 'Tokenz', icon: Landmark, color: 'text-yellow-500', bg: 'bg-yellow-500/10', 
    desc: 'Industry Thrust (I): The Center Gate institutional account managing global value ingress, network liquidity, and EAC bridge protocols.', 
    action: 'Institutional Sync', thrust: 'industry', toolType: 'defi', volume: '940M EAC',
    products: [
      { id: 'f1', name: 'Institutional Yield Pool', price: 5000, type: 'Finance', icon: TrendingUp },
      { id: 'f2', name: 'Multi-Sig Escrow Portal', price: 200, type: 'Service', icon: Lock }
    ]
  },
  { 
    id: 'agroboto', name: 'Agroboto', icon: Bot, color: 'text-blue-500', bg: 'bg-blue-500/10', 
    desc: 'Technological Thrust (T): Autonomous hardware and AI-driven soil robotics.', 
    action: 'Bot Diagnostics', thrust: 'technological', toolType: 'utility', volume: '35M EAC',
    products: [
      { id: 'r1', name: 'Weeding Drone X-04', price: 2500, type: 'Product', icon: Bot },
      { id: 'r2', name: 'AI Harvest Schedule', price: 300, type: 'Service', icon: Cpu }
    ]
  }
];

const THRUST_METADATA: Record<ThrustType, { label: string, icon: any, color: string, description: string, letter: string }> = {
  societal: { letter: 'S', label: 'Societal', icon: Users2, color: 'text-rose-400', description: 'Sociological & Anthropological Agriculture.', thrust: 'societal' } as any,
  environmental: { letter: 'E', label: 'Environmental', icon: Leaf, color: 'text-emerald-400', description: 'Agricultural Environmental Management.', thrust: 'environmental' } as any,
  human: { letter: 'H', label: 'Human', icon: Dna, color: 'text-teal-400', description: 'Human Impact, Health & Psychology.', thrust: 'human' } as any,
  technological: { letter: 'T', label: 'Technological', icon: Cpu, color: 'text-blue-400', description: 'Modern Agrarian Revolution Innovations.', thrust: 'technological' } as any,
  industry: { letter: 'I', label: 'Industry', icon: Factory, color: 'text-purple-400', description: 'Agricultural Industry Optimization & Blockchain Registries.', thrust: 'industry' } as any,
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
  const [portalTab, setPortalTab] = useState<'ai' | 'market' | 'finance' | 'gateways' | 'bridge' | 'deposit' | 'registry' | 'gift' | 'architecture' | 'floriculture' | 'nursing' | 'hospitality' | 'knowledge' | 'education' | 'batch_ledger' | 'recipes'>('ai');

  const [esinSign, setEsinSign] = useState('');
  
  // Architecture Lab States
  const [archType, setArchType] = useState<'Warehouse' | 'Poultry' | 'Landscaping' | 'Flower Garden' | 'Hydroponics' | 'Vertical Farming' | 'Urban Farming'>('Hydroponics');
  const [archScale, setArchScale] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [archSpecs, setArchSpecs] = useState('');
  const [isGeneratingArch, setIsGeneratingArch] = useState(false);
  const [archBlueprint, setArchBlueprint] = useState<string | null>(null);

  // Floriculture States
  const [floriTab, setFloriTab] = useState<'farming' | 'heritage' | 'perception'>('farming');
  const [selectedFlower, setSelectedFlower] = useState('Bantu Lily');
  const [isSyncingHeritage, setIsSyncingHeritage] = useState(false);

  // Hearts4Agro Specialized States
  const [nursingReport, setNursingReport] = useState<string | null>(null);
  const [hospitalitySpecs, setHospitalitySpecs] = useState('');
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [hospitalityOutput, setHospitalityOutput] = useState<string | null>(null);

  // AgroInPDF Specialized States
  const [knowledgeTab, setKnowledgeTab] = useState<'archive' | 'ingest'>('archive');
  const [isIngestingPDF, setIsIngestingPDF] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  // Juiezy Cookiez States
  const [batchId, setBatchId] = useState('JC-B-842');
  const [isAuditingFood, setIsAuditingFood] = useState(false);
  const [foodReport, setFoodReport] = useState<string | null>(null);
  const [recipeFocus, setRecipeFocus] = useState('Regenerative Snacks');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [recipeResult, setRecipeResult] = useState<string | null>(null);

  // Child's Growth States
  const [childAge, setChildAge] = useState('6');
  const [learningFocus, setLearningFocus] = useState('Seedling Biomes');
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);

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
  const [isGeneratingBadge, setIsGeneratingBadge] = useState(false);

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
      setPortalTab('floriculture');
    } else if (brand.id === 'hearts4agro') {
      setPortalTab('nursing');
    } else if (brand.id === 'agroinpdf') {
      setPortalTab('knowledge');
    } else if (brand.id === 'juizzycookiez') {
      setPortalTab('batch_ledger');
    } else if (brand.id === 'childsgrowth') {
      setPortalTab('education');
    } else if (brand.thrust === 'industry') {
      setPortalTab('registry');
    } else {
      setPortalTab('ai');
    }
  };

  const runFoodAudit = async () => {
    setIsAuditingFood(true);
    setFoodReport(null);
    try {
      const prompt = `Act as a Juiezy Cookiez Quality Auditor. Verify the TQM shard for batch ${batchId}. Trace ingredients from regenerative farms and confirm industrial compliance.`;
      const res = await runSpecialistDiagnostic("Food Quality", prompt);
      setFoodReport(res.text);
    } catch (e) {
      alert("Food Audit Oracle Offline.");
    } finally {
      setIsAuditingFood(false);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsGeneratingRecipe(true);
    setRecipeResult(null);
    try {
      const prompt = `Act as a Juiezy Cookiez Sustainable Executive Chef. Generate an industrial-scale agro food recipe focused on ${recipeFocus}. 
      Ingredients to emphasize: ${recipeIngredients || 'Regenerative Bantu Grains, Heritage Honeys, and climate-resilient pulses.'}
      Include:
      1. Sustainable Sourcing (How it aligns with EnvirosAgro's Environmental (E) Thrust)
      2. Step-by-step Batch Process
      3. Nutritional Shard (Human (H) Thrust analysis)
      4. TQM Traceability Guide (Ensuring quality from Farm to Consumer).`;
      const res = await runSpecialistDiagnostic("Sustainable Agro-Cuisine", prompt);
      setRecipeResult(res.text);
    } catch (e) {
      alert("Recipe Synthesis Interrupted. Node out of sync.");
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const handleGenerateLesson = async () => {
    setIsGeneratingLesson(true);
    setLessonPlan(null);
    try {
      const prompt = `Generate a Junior Steward lesson plan for a ${childAge}-year-old. Focus: ${learningFocus}. Use fun, engaging, and agrarian-centric language. Include a small 'Handshake Mission' for them to earn 1 Reputation Shard.`;
      const res = await runSpecialistDiagnostic("Junior Stewardship", prompt);
      setLessonPlan(res.text);
    } catch (e) {
      alert("Learning Hub Sync Interrupted.");
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const handleIngestPDF = () => {
    setIsIngestingPDF(true);
    setIngestSuccess(false);
    setTimeout(() => {
       setIsIngestingPDF(false);
       setIngestSuccess(true);
       alert("KNOWLEDGE SHARD MINTED: Documentation anchored to industrial registry.");
    }, 2500);
  };

  const handleGenerateArchitecture = async () => {
    setIsGeneratingArch(true);
    setArchBlueprint(null);
    try {
      const prompt = `Act as an EnvirosAgro Sustainable Architect. Generate a high-fidelity architectural blueprint shard for a ${archScale} scale ${archType} design. 
      User specific requirements: ${archSpecs || 'No specific requirements, use general sustainable agro-architectural standards.'}
      Include:
      1. Structural Concept (Sustainable materials like recycled steel or timber)
      2. Ecosystem Integration (How it aligns with SEHTI thrusts, specifically modern farming efficiency)
      3. Utility Specs (Solar placement, water reclamation/nutrient circulation, passive thermal sync)
      4. m-Constant Impact (Predicted durability and resilience shard).
      Use professional architectural and modern agricultural terminology.`;
      const res = await runSpecialistDiagnostic("Agro-Architecture", prompt);
      setArchBlueprint(res.text);
    } catch (e) {
      alert("Blueprint Synthesis Interrupted. Check node signal.");
    } finally {
      setIsGeneratingArch(false);
    }
  };

  const handleGenerateHospitality = async () => {
    setIsGeneratingMenu(true);
    setHospitalityOutput(null);
    try {
       const prompt = `Act as a Hearts4Agro Hospitality & Catering Specialist. Generate an institutional hospitality and nutrient catering plan. 
       Specs: ${hospitalitySpecs || 'General high-wellness catering for mixed livestock.'}
       Include:
       1. Lodging Layout (Hospitality node design for comfort and social care)
       2. Nutrient catering menu (SEHTI-aligned ingredients for health thrust)
       3. Wellness Shard activities for animal social immunity.
       Use a caring and professional tone.`;
       const res = await runSpecialistDiagnostic("Animal Hospitality", prompt);
       setHospitalityOutput(res.text);
    } catch (e) {
       alert("Hospitality Sync Interrupted.");
    } finally {
       setIsGeneratingMenu(false);
    }
  };

  const runNursingAudit = async () => {
    setLoading(true);
    setNursingReport(null);
    try {
       const prompt = `Analyze animal nursing home requirements for a cluster in ${user.location}. Focus on geriatric animal care, recovery shards, and societal trust impact. Use EOS logic.`;
       const res = await runSpecialistDiagnostic("Animal Nursing", prompt);
       setNursingReport(res.text);
    } catch (e) {
       alert("Nursing Oracle Offline.");
    } finally {
       setLoading(false);
    }
  };

  const handleHeritageSync = () => {
    setIsSyncingHeritage(true);
    setTimeout(() => {
      setIsSyncingHeritage(false);
      alert(`${selectedFlower.toUpperCase()} HERITAGE ANCHORED: Biological lineage recorded on the Environmental registry. +50 reputation shards earned.`);
    }, 2500);
  };

  const downloadBadgeImage = async () => {
    if (!user.zodiacFlower) return;
    setIsGeneratingBadge(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050706';
    ctx.fillRect(0, 0, 1000, 1000);

    const gradient = ctx.createRadialGradient(500, 500, 0, 500, 500, 500);
    gradient.addColorStop(0, '#10b98111');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 1000);

    ctx.beginPath();
    ctx.arc(500, 500, 400, 0, Math.PI * 2);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#10b98122';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(500, 500, 380, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    ctx.font = 'black 40px Arial';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    
    ctx.beginPath();
    ctx.arc(500, 500, 150, 0, Math.PI * 2);
    ctx.fillStyle = (user.zodiacFlower.hex || '#10b981') + '22';
    ctx.fill();
    
    ctx.font = 'bold 120px serif';
    ctx.fillStyle = user.zodiacFlower.hex || '#10b981';
    ctx.fillText('❁', 500, 540);

    ctx.font = 'black 40px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(user.name.toUpperCase(), 500, 720);
    
    ctx.font = 'bold 35px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText(user.esin, 500, 780);

    ctx.font = 'black 25px Arial';
    ctx.fillStyle = '#444';
    ctx.fillText('ENVIROSAGRO REGISTRY SHARD // ZODIAC GIFT', 500, 850);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `EnvirosAgro_Badge_${user.zodiacFlower.flower}.png`;
    link.href = dataUrl;
    link.click();
    
    setIsGeneratingBadge(false);
  };

  const handleExecuteDeposit = async () => {
    if (!esinSign) {
      alert("ESIN AUTH REQUIRED: Please sign with your Social Identification Number.");
      return;
    }
    setIsDepositing(true);
    
    setTimeout(() => {
      onDeposit(Number(depositAmount), selectedGateway);
      setIsDepositing(false);
      alert(`NODE BRIDGE SETTLED: Institutional account synchronized. ${depositAmount} EAC minted.`);
      setPortalTab('ai');
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
        hex: flowerData.hex,
        pointsAdded: true
      }
    };

    await onUpdateUser(updatedUser);
    setIsClaimingGift(false);
    alert(`BIRTH MONTH GIFT: Claimed your ${flowerData.flower} shard! +100 reputation points added.`);
  };

  const handleExecuteSwap = async () => {
    if (!esinSign) {
      alert("SIGNATURE REQUIRED: Authorized ESIN needed to commit market swap.");
      return;
    }
    setIsSwapping(true);
    
    setTimeout(() => {
      setIsSwapping(false);
      alert(`SWAP EXECUTED: Transaction routed through institutional node. ${swapAsset} reserved in Cloud Vault.`);
      setPortalTab('ai');
    }, 3000);
  };

  const runBrandAction = async () => {
    if (!activeBrand) return;
    setLoading(true);
    let query = "";
    
    if (activeBrand.id === 'tokenz') {
      query = `Generate an institutional report for the Center Gate regarding current EAC/FIAT liquidity and network reserve status.`;
    } else if (activeBrand.id === 'hearts4agro') {
      query = `Analyze current regional SID (Social Influenza Disease) load for ${user.location}.`;
    } else if (activeBrand.id === 'medicag') {
      query = `Conduct a Human (H) Thrust analysis for ${user.location}. Focus on Agro-Medicine purity.`;
    } else if (activeBrand.id === 'lilies') {
      query = `Provide a landscape design audit for agricultural aesthetics in ${user.location}.`;
    } else if (activeBrand.id === 'agromusika') {
      query = `Analyze bio-electric responses for crops in ${user.location} under Plant Wave Technology protocols.`;
    } else if (activeBrand.id === 'agroinpdf') {
      query = `Generate a technical audit of current knowledge sharding density in ${user.location}.`;
    } else if (activeBrand.id === 'juizzycookiez') {
      query = `Perform a quality audit for the latest cookie batch at Juiezy Cookiez.`;
    } else if (activeBrand.id === 'childsgrowth') {
      query = `Suggest a new early agrarian curriculum module for regional children's nodes.`;
    } else {
      query = `Strategy report for ${activeBrand.name} within EOS framework.`;
    }
    const result = await searchAgroTrends(query);
    setAiResult(result);
    setLoading(false);
  };

  const BrandCard: React.FC<{ brand: Brand; onLaunch: (b: Brand) => void }> = ({ brand, onLaunch }) => (
    <div 
      onClick={() => onLaunch(brand)}
      className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] group hover:border-emerald-500/40 transition-all cursor-pointer relative flex flex-col h-[400px] md:h-[500px] active:scale-[0.98] duration-300 overflow-hidden bg-white/[0.01] shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="flex justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[20px] md:rounded-[32px] ${brand.bg} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 shadow-2xl border border-white/5`}>
          <brand.icon className={`w-8 h-8 md:w-12 md:h-12 ${brand.color}`} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-3 md:px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest border border-white/10 group-hover:border-emerald-500/50 transition-colors">
            {brand.volume}
          </span>
          <div className="flex gap-1">
            {[0,1,2].map(i => <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 md:space-y-4 relative z-10">
        <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic leading-none">
          {brand.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{brand.thrust} THRUST</span>
          <span className="w-1 h-1 rounded-full bg-slate-800"></span>
          <span className="text-[8px] md:text-[10px] font-bold text-emerald-500/60 font-mono">NODE_ACTIVE_S8</span>
        </div>
        <p className="text-sm md:text-lg text-slate-500 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 group-hover:text-slate-300 transition-all line-clamp-3 md:line-clamp-4 pt-2 md:pt-4">
          "{brand.desc}"
        </p>
      </div>

      <div className="pt-6 md:pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">
             <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:text-white transition-colors">Launch Shard</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[6px] md:text-[8px] text-slate-700 font-black uppercase mb-1">REGISTRY_STANDING</span>
           <div className="flex gap-0.5 md:gap-1">
              {[0,1,2,3,4].map(i => <Star key={i} className="w-2 md:w-2.5 h-2 md:h-2.5 text-amber-500 fill-amber-500" />)}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass-card p-8 md:p-12 rounded-[40px] md:rounded-[56px] relative overflow-hidden flex flex-col justify-between group bg-white/[0.01]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] agro-gradient opacity-[0.08] blur-[120px] -mr-64 -mt-64 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Layers className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
              <span className="px-3 md:px-4 py-1.5 bg-white/5 text-slate-400 text-[8px] md:text-[10px] font-black uppercase rounded-full tracking-[0.2em] md:tracking-[0.3em] border border-white/10">Global Service Mesh Directory</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-8 tracking-tighter italic leading-none">Protocol <span className="text-emerald-400">Terminals</span></h2>
            <p className="text-slate-400 text-sm md:text-xl leading-relaxed max-w-2xl font-medium">
              Interact with the primary brands powering the EOS ecosystem. Every handshake is audited by the <span className="text-yellow-500">Tokenz Center Gate</span>.
            </p>
          </div>
          <div className="relative z-10 flex gap-6 md:gap-10 mt-8 md:mt-12 items-center">
            <div className="flex -space-x-3 md:-space-x-4">
              {BRANDS.slice(0, 5).map((B, idx) => (
                <div key={idx} className="w-10 h-10 md:w-16 md:h-16 rounded-[12px] md:rounded-[24px] bg-[#050706] border border-white/10 flex items-center justify-center shadow-2xl group hover:z-50 transition-all hover:-translate-y-2 hover:border-emerald-500/50">
                  <B.icon className={`w-5 h-5 md:w-8 md:h-8 ${B.color}`} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center pl-4 md:pl-8 border-l border-white/10">
              <p className="text-[10px] md:text-sm text-white font-black uppercase tracking-widest">{BRANDS.length} ACTIVE NODES</p>
              <div className="flex items-center gap-2 md:gap-3 mt-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <p className="text-[8px] md:text-[10px] text-emerald-500/60 font-mono tracking-tighter uppercase">Center Gate Auth: Online</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 md:p-10 rounded-[40px] md:rounded-[56px] border-yellow-500/20 bg-yellow-500/5 space-y-6 md:space-y-8 flex flex-col justify-center group overflow-hidden relative shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
             <Landmark className="w-32 h-32 md:w-48 md:h-48 text-yellow-500" />
          </div>
          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="p-2.5 bg-yellow-500 text-black rounded-xl shadow-xl shadow-yellow-900/20">
               <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Center Gate Status</h3>
              <p className="text-[8px] md:text-[9px] text-yellow-500/60 font-black uppercase">Institutional Sync: Active</p>
            </div>
          </div>
          <div className="space-y-4 md:space-y-6 relative z-10">
            <div>
              <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 md:mb-2">Total Value Locked (TVL)</p>
              <h4 className="text-4xl md:text-6xl font-mono font-black text-white tracking-tighter">$4.2B <span className="text-xs md:text-sm font-bold text-yellow-500">AUM</span></h4>
            </div>
            <div className="h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-yellow-500 w-[92%] animate-pulse shadow-[0_0_15px_#eab308]"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-6 border-t border-white/5">
              <div>
                <p className="text-[8px] md:text-[9px] text-slate-600 font-black uppercase mb-0.5 md:mb-1">EAC/USD Index</p>
                <p className="text-lg md:text-xl font-black text-emerald-400 font-mono">0.852</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] text-slate-600 font-black uppercase mb-0.5 md:mb-1">Shard Latency</p>
                <p className="text-lg md:text-xl font-black text-white font-mono">12.4ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:gap-4 p-1 md:p-2 glass-card rounded-2xl md:rounded-[32px] w-full overflow-x-auto scrollbar-hide border border-white/5 bg-black/40">
        <button 
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-6 md:px-10 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white/10 text-white shadow-2xl ring-1 ring-white/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          Full Registry
        </button>
        {(Object.keys(THRUST_METADATA) as ThrustType[]).map((thrust) => {
          const meta = THRUST_METADATA[thrust];
          return (
            <button 
              key={thrust}
              onClick={() => setFilter(thrust)}
              className={`flex items-center gap-2 md:gap-3 px-5 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all whitespace-nowrap ${filter === thrust ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-black/40 rounded-lg text-[8px] md:text-[9px] font-black ${meta.color}`}>{meta.letter}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} onLaunch={launchBrand} />
        ))}
      </div>

      {activeBrand && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setActiveBrand(null)}></div>
          
          <div className="relative w-full max-w-6xl h-full md:h-[90vh] glass-card rounded-none md:rounded-[56px] flex flex-col overflow-hidden shadow-2xl border-white/10 ring-1 ring-white/20 bg-[#050706]">
            <div className={`p-6 md:p-12 border-b border-white/5 flex items-center justify-between ${activeBrand.bg} relative overflow-hidden shrink-0`}>
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                <activeBrand.icon className={`w-32 h-32 md:w-[600px] md:h-[600px] absolute -right-4 md:-right-20 -top-4 md:-top-20 ${activeBrand.color}`} />
              </div>
              
              <div className="flex items-center gap-4 md:gap-12 relative z-10">
                <div className="relative group hidden sm:block">
                  <div className={`absolute inset-0 blur-3xl opacity-20 group-hover:opacity-50 transition-opacity ${activeBrand.bg}`}></div>
                  <div className={`w-16 h-16 md:w-32 md:h-32 rounded-xl md:rounded-[40px] bg-black/60 flex items-center justify-center shadow-2xl border border-white/10 relative z-10 group-hover:rotate-6 transition-transform duration-500 ring-4 ring-white/5`}>
                    <activeBrand.icon className={`w-8 h-8 md:w-16 md:h-16 ${activeBrand.color}`} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <button 
                    onClick={() => setActiveBrand(null)}
                    className="flex items-center gap-2 mb-2 md:mb-6 p-1.5 md:p-2 px-4 md:px-6 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 hover:text-white transition-all w-fit group/back active:scale-95"
                  >
                    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 group-hover/back:-translate-x-1 transition-transform" />
                    <span>Exit Terminal</span>
                  </button>
                  <div className="flex items-center gap-4 md:gap-8">
                    <h2 className="text-2xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none m-0">{activeBrand.name}</h2>
                    <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[7px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 whitespace-nowrap">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      {activeBrand.thrust} Thrust
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveBrand(null)}
                className="p-3 md:p-6 bg-white/5 hover:bg-rose-600/20 hover:text-rose-400 rounded-full text-white transition-all hover:rotate-90 border border-white/5 relative z-10"
              >
                <X className="w-6 h-6 md:w-12 md:h-12" />
              </button>
            </div>

            <div className="flex border-b border-white/5 bg-white/[0.02] overflow-x-auto scrollbar-hide px-4 md:px-6 shrink-0">
              {activeBrand.id === 'tokenz' ? (
                <>
                  <button onClick={() => setPortalTab('deposit')} className={`flex-1 min-w-[120px] md:min-w-[200px] py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'deposit' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> Node Bridge</div>
                  </button>
                  <button onClick={() => setPortalTab('finance')} className={`flex-1 min-w-[120px] md:min-w-[200px] py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'finance' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ArrowDownUp className="w-3.5 h-3.5 md:w-4 md:h-4" /> Institutional Swap</div>
                  </button>
                  <button onClick={() => setPortalTab('gateways')} className={`flex-1 min-w-[120px] md:min-w-[200px] py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'gateways' ? 'border-yellow-500 text-white bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><Globe className="w-3.5 h-3.5 md:w-4 md:h-4" /> Global Ingress</div>
                  </button>
                </>
              ) : activeBrand.id === 'juizzycookiez' ? (
                <>
                  <button onClick={() => setPortalTab('batch_ledger')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'batch_ledger' ? 'border-orange-500 text-white bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><FileText className="w-3.5 h-3.5 md:w-4 md:h-4" /> Batch Ledger</div>
                  </button>
                  <button onClick={() => setPortalTab('recipes')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'recipes' ? 'border-orange-500 text-white bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ChefHat className="w-3.5 h-3.5 md:w-4 md:h-4" /> Agro-Recipes</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'market' ? 'border-orange-500 text-white bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Agro-Food Shop</div>
                  </button>
                </>
              ) : activeBrand.id === 'childsgrowth' ? (
                <>
                  <button onClick={() => setPortalTab('education')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'education' ? 'border-sky-500 text-white bg-sky-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4" /> Learning Hub</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'market' ? 'border-sky-500 text-white bg-sky-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ToyBrick className="w-3.5 h-3.5 md:w-4 md:h-4" /> Steward Toys</div>
                  </button>
                </>
              ) : activeBrand.id === 'lilies' ? (
                <>
                  <button onClick={() => setPortalTab('floriculture')} className={`flex-1 min-w-[140px] py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'floriculture' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><Flower className="w-3.5 h-3.5 md:w-4 md:h-4" /> Floriculture Terminal</div>
                  </button>
                  <button onClick={() => setPortalTab('architecture')} className={`flex-1 min-w-[140px] py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'architecture' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><PencilRuler className="w-3.5 h-3.5 md:w-4 md:h-4" /> Architecture Lab</div>
                  </button>
                  <button onClick={() => setPortalTab('gift')} className={`flex-1 min-w-[140px] py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'gift' ? 'border-pink-500 text-white bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><Gift className="w-3.5 h-3.5 md:w-4 md:h-4" /> Birth Month Gift</div>
                  </button>
                </>
              ) : activeBrand.id === 'hearts4agro' ? (
                <>
                  <button onClick={() => setPortalTab('nursing')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'nursing' ? 'border-rose-500 text-white bg-rose-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><HeartPulse className="w-3.5 h-3.5 md:w-4 md:h-4" /> Animal Nursing</div>
                  </button>
                  <button onClick={() => setPortalTab('hospitality')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'hospitality' ? 'border-rose-500 text-white bg-rose-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><Utensils className="w-3.5 h-3.5 md:w-4 md:h-4" /> Hospitality & Catering</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'market' ? 'border-rose-500 text-white bg-rose-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Store</div>
                  </button>
                </>
              ) : activeBrand.id === 'agroinpdf' ? (
                <>
                  <button onClick={() => setPortalTab('knowledge')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'knowledge' ? 'border-orange-500 text-white bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><FileJson className="w-3.5 h-3.5 md:w-4 md:h-4" /> Knowledge Registry</div>
                  </button>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'ai' ? 'border-orange-500 text-white bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Oracle Sync</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'market' ? 'border-orange-500 text-white bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Assets</div>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPortalTab('ai')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'ai' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Oracle Sync</div>
                  </button>
                  <button onClick={() => setPortalTab('market')} className={`flex-1 py-4 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all border-b-2 md:border-b-4 ${portalTab === 'market' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}>
                    <div className="flex items-center justify-center gap-2 md:gap-3"><ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Assets</div>
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-gradient-to-b from-[#050706] to-black custom-scrollbar">
              
              {/* JUIEZY COOKIEZ TERMINALS */}
              {activeBrand.id === 'juizzycookiez' && portalTab === 'batch_ledger' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5 space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-orange-500/20 bg-orange-500/5 space-y-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                               <Cookie className="w-64 h-64 text-white" />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-4 bg-orange-600 rounded-3xl shadow-xl">
                                  <UtensilsCrossed className="w-8 h-8 text-white" />
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-white uppercase italic">Batch <span className="text-orange-400">Registry</span></h3>
                                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">Food-to-Farm Traceability</p>
                               </div>
                            </div>
                            <div className="space-y-6 relative z-10">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Batch Identification</label>
                                  <input 
                                     type="text" 
                                     value={batchId}
                                     onChange={e => setBatchId(e.target.value)}
                                     className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-lg focus:ring-4 focus:ring-orange-500/20 outline-none transition-all"
                                  />
                               </div>
                               <button 
                                 onClick={runFoodAudit}
                                 disabled={isAuditingFood}
                                 className="w-full py-6 bg-orange-600 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                               >
                                  {isAuditingFood ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                                  INITIALIZE TQM AUDIT
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7">
                         <div className="glass-card rounded-[56px] min-h-[600px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                            <div className="absolute inset-0 opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                            {isAuditingFood ? (
                               <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                                  <Loader2 className="w-20 h-20 text-orange-500 animate-spin" />
                                  <p className="text-orange-400 font-black text-sm uppercase tracking-[0.6em] animate-pulse italic">Tracing Ingredients...</p>
                               </div>
                            ) : foodReport ? (
                               <div className="p-10 md:p-14 space-y-10 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
                                  <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                                     <Sparkles className="w-6 h-6 text-orange-400" />
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Batch <span className="text-orange-400">Authenticity Shard</span></h4>
                                  </div>
                                  <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l-4 border-orange-500/20 pl-8 font-medium bg-white/[0.01] p-10 rounded-[48px]">
                                     {foodReport}
                                  </div>
                                  <div className="flex justify-center gap-6">
                                     <div className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                        <BadgeCheck className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[10px] font-black text-emerald-400 uppercase">99.8% Purity Verified</span>
                                     </div>
                                  </div>
                               </div>
                            ) : (
                               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                                  <div className="w-40 h-40 rounded-[48px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center relative">
                                     <Cake className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-[5s]" />
                                     <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                  </div>
                                  <div className="max-w-xs space-y-3">
                                     <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Food Ledger Archive</h4>
                                     <p className="text-slate-500 text-sm italic leading-relaxed">Enter a batch ID to trace the regenerative origin of Juiezy Cookiez ingredients.</p>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeBrand.id === 'juizzycookiez' && portalTab === 'recipes' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5 space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-orange-500/20 bg-orange-500/5 space-y-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                               <ChefHat className="w-64 h-64 text-white" />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-4 bg-orange-600 rounded-3xl shadow-xl">
                                  <ChefHat className="w-8 h-8 text-white" />
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-white uppercase italic">Agro <span className="text-orange-400">Recipes</span></h3>
                                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">Sustainable Culinary Synthesis</p>
                               </div>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Culinary Focus</label>
                                  <select 
                                     value={recipeFocus}
                                     onChange={e => setRecipeFocus(e.target.value)}
                                     className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
                                  >
                                     <option>Regenerative Snacks</option>
                                     <option>Heritage Grains Baking</option>
                                     <option>Zero-Waste Preservation</option>
                                     <option>Bio-Nutrient Shard Bowls</option>
                                     <option>Plant-Wave Fermentations</option>
                                  </select>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 flex items-center gap-2">
                                     <Sprout size={12} className="text-orange-400" /> Emphasize Ingredients
                                  </label>
                                  <textarea 
                                     value={recipeIngredients}
                                     onChange={e => setRecipeIngredients(e.target.value)}
                                     placeholder="e.g. Bantu Honey, Sorghum Flour, Baobab powder..."
                                     className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-white text-xs h-32 focus:ring-2 focus:ring-orange-500/40 outline-none transition-all placeholder:text-slate-800 italic font-medium resize-none shadow-inner"
                                  />
                               </div>
                               <button 
                                 onClick={handleGenerateRecipe}
                                 disabled={isGeneratingRecipe}
                                 className="w-full py-8 bg-orange-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                               >
                                  {isGeneratingRecipe ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 fill-current" />}
                                  SYNTHESIZE RECIPE SHARD
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7">
                         <div className="glass-card rounded-[56px] min-h-[600px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                            <div className="absolute inset-0 opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                            {isGeneratingRecipe ? (
                               <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                                  <div className="relative">
                                     <Loader2 className="w-20 h-20 text-orange-500 animate-spin" />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <Bot className="w-8 h-8 text-orange-400" />
                                     </div>
                                  </div>
                                  <p className="text-orange-400 font-black text-sm uppercase tracking-[0.6em] animate-pulse italic">Crafting Agro-Cuisine...</p>
                               </div>
                            ) : recipeResult ? (
                               <div className="p-10 md:p-14 space-y-10 animate-in slide-in-from-right-6 duration-700 overflow-y-auto custom-scrollbar">
                                  <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                                     <ChefHat className="w-6 h-6 text-orange-400" />
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Industrial <span className="text-orange-400">Recipe Blueprint</span></h4>
                                  </div>
                                  <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l-4 border-orange-500/20 pl-8 font-medium bg-white/[0.01] p-10 rounded-[48px] shadow-inner">
                                     {recipeResult}
                                  </div>
                                  <div className="flex justify-center gap-8">
                                     <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                        <Download className="w-4 h-4" /> Export PDF Shard
                                     </button>
                                     <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                        <Database className="w-4 h-4" /> Anchor to Heritage
                                     </button>
                                  </div>
                               </div>
                            ) : (
                               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                                  <div className="w-48 h-48 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center relative">
                                     <ChefHat className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-[5s]" />
                                     <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                  </div>
                                  <div className="max-w-xs space-y-3 px-4">
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Recipe Terminal</h4>
                                     <p className="text-slate-500 text-sm italic leading-relaxed">Define focus and core sustainable ingredients to synthesize institutional agro-food recipe shards.</p>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* CHILD'S GROWTH TERMINAL */}
              {activeBrand.id === 'childsgrowth' && portalTab === 'education' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5 space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-sky-500/20 bg-sky-500/5 space-y-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                               <Baby className="w-64 h-64 text-white" />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-4 bg-sky-600 rounded-3xl shadow-xl">
                                  <GraduationCap className="w-8 h-8 text-white" />
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-white uppercase italic">Learning <span className="text-sky-400">Node</span></h3>
                                  <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mt-1">Steward Early Development</p>
                               </div>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Junior Steward Age</label>
                                  <select 
                                     value={childAge}
                                     onChange={e => setChildAge(e.target.value)}
                                     className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-sky-500/20 transition-all"
                                  >
                                     <option value="4">4 Years (Sprout Stage)</option>
                                     <option value="6">6 Years (Leaf Stage)</option>
                                     <option value="8">8 Years (Stem Stage)</option>
                                     <option value="10">10 Years (Bloom Stage)</option>
                                  </select>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Development Focus</label>
                                  <select 
                                     value={learningFocus}
                                     onChange={e => setLearningFocus(e.target.value)}
                                     className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-sky-500/20 transition-all"
                                  >
                                     <option>Seedling Biomes</option>
                                     <option>Insect Friends</option>
                                     <option>Soil Magic</option>
                                     <option>Rain Cycle Song</option>
                                  </select>
                               </div>
                               <button 
                                 onClick={handleGenerateLesson}
                                 disabled={isGeneratingLesson}
                                 className="w-full py-8 bg-sky-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                               >
                                  {isGeneratingLesson ? <Loader2 className="w-6 h-6 animate-spin" /> : <Puzzle className="w-6 h-6 fill-current" />}
                                  SYNTHESIZE LESSON SHARD
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7">
                         <div className="glass-card rounded-[56px] min-h-[600px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                            <div className="absolute inset-0 opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                            {isGeneratingLesson ? (
                               <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                                  <div className="relative">
                                     <Loader2 className="w-20 h-20 text-sky-500 animate-spin" />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <Bot className="w-8 h-8 text-sky-400" />
                                     </div>
                                  </div>
                                  <p className="text-sky-400 font-black text-sm uppercase tracking-[0.6em] animate-pulse italic">Creating Fun Learning Shards...</p>
                               </div>
                            ) : lessonPlan ? (
                               <div className="p-10 md:p-14 space-y-10 animate-in slide-in-from-right-6 duration-700 overflow-y-auto custom-scrollbar">
                                  <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                                     <Rocket className="w-6 h-6 text-sky-400" />
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mission: <span className="text-sky-400">Junior Steward</span></h4>
                                  </div>
                                  <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l-4 border-sky-500/20 pl-8 font-medium bg-white/[0.01] p-10 rounded-[48px] shadow-inner">
                                     {lessonPlan}
                                  </div>
                                  <div className="flex justify-center gap-8">
                                     <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                        <Gamepad2 className="w-4 h-4" /> Start Activity
                                     </button>
                                     <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                        <Award className="w-4 h-4" /> Earn Achievement
                                     </button>
                                  </div>
                               </div>
                            ) : (
                               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                                  <div className="w-48 h-48 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center relative">
                                     <Puzzle className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-[5s]" />
                                     <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                  </div>
                                  <div className="max-w-xs space-y-3 px-4">
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Junior Terminal</h4>
                                     <p className="text-slate-500 text-sm italic leading-relaxed">Select age and focus parameters to synthesize specialized early agrarian development shards.</p>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* AGROINPDF KNOWLEDGE REGISTRY */}
              {activeBrand.id === 'agroinpdf' && portalTab === 'knowledge' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                   <div className="flex justify-between items-center bg-orange-500/5 border border-orange-500/10 p-2 rounded-[32px] w-fit mx-auto lg:mx-0">
                    {[
                      { id: 'archive', label: 'Knowledge Archive', icon: Archive },
                      { id: 'ingest', label: 'Shard Ingest', icon: FileUp },
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setKnowledgeTab(t.id as any)}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${knowledgeTab === t.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/40' : 'text-slate-500 hover:text-white'}`}
                      >
                        <t.icon className="w-4 h-4" /> {t.label}
                      </button>
                    ))}
                  </div>

                  {knowledgeTab === 'archive' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {[
                         { title: 'Soil Biome Lineage v4', hash: '0x882_PDF_01', type: 'Technical', grade: 'A+' },
                         { title: 'Ancestral Irrigation Logic', hash: '0x882_PDF_42', type: 'Historical', grade: 'S' },
                         { title: 'Spectral Drone Calibration', hash: '0x882_PDF_12', type: 'Operational', grade: 'A' },
                       ].map(doc => (
                         <div key={doc.hash} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 hover:border-orange-500/30 transition-all group flex flex-col h-full shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                               <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                  <FileText size={24} />
                               </div>
                               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">{doc.type}</span>
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight italic group-hover:text-orange-400 transition-colors flex-1">{doc.title}</h4>
                            <p className="text-[10px] text-slate-600 font-mono mt-4 mb-8">{doc.hash}</p>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                               <div className="text-center bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg">
                                  <p className="text-[7px] font-black text-orange-400 uppercase leading-none mb-1">Quality</p>
                                  <p className="text-lg font-black text-white leading-none">{doc.grade}</p>
                               </div>
                               <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-orange-600 transition-all border border-white/5">
                                  <Download size={16} />
                                </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}

                  {knowledgeTab === 'ingest' && (
                    <div className="max-w-2xl mx-auto glass-card p-12 rounded-[56px] border-orange-500/20 bg-orange-500/5 space-y-10 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><FileUp size={240} /></div>
                       <div className="text-center space-y-6 relative z-10">
                          <div className="w-24 h-24 bg-orange-500 rounded-[32px] flex items-center justify-center shadow-2xl mx-auto ring-4 ring-white/5">
                             <Upload className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Knowledge <span className="text-orange-400">Ingest</span></h3>
                          <p className="text-slate-400 text-lg italic leading-relaxed">"Commit technical research or documentation shards to the global industrial registry for m-constant verification."</p>
                       </div>

                       <div className="space-y-6 relative z-10">
                          <div className="p-10 border-4 border-dashed border-white/10 rounded-[48px] bg-black/40 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/[0.02] transition-all group min-h-[300px]">
                             {isIngestingPDF ? (
                               <div className="flex flex-col items-center gap-6">
                                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                                  <p className="text-orange-400 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Sharding PDF...</p>
                               </div>
                             ) : ingestSuccess ? (
                               <div className="flex flex-col items-center gap-6 animate-in zoom-in">
                                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-900/40"><CheckCircle2 size={32} /></div>
                                  <p className="text-white font-black text-sm uppercase tracking-widest">COMMIT_FINALIZED_0x882</p>
                                  <button onClick={() => setIngestSuccess(false)} className="text-[10px] text-orange-400 font-black uppercase tracking-widest border-b border-orange-500/40">Sync another shard</button>
                               </div>
                             ) : (
                               <>
                                  <FileText className="w-14 h-14 text-slate-700 group-hover:text-orange-400 group-hover:scale-110 transition-all mb-4" />
                                  <p className="text-xl font-black text-white uppercase tracking-tight">Drop Document Shard</p>
                                  <p className="text-slate-600 text-xs mt-2 uppercase font-black tracking-widest">PDF // JSON // MD</p>
                               </>
                             )}
                          </div>
                          {!ingestSuccess && !isIngestingPDF && (
                            <button onClick={handleIngestPDF} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                               <Key size={18} /> AUTHORIZE REGISTRY MINT
                            </button>
                          )}
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* HEARTS4AGRO SPECIALIZED TERMINALS */}
              {activeBrand.id === 'hearts4agro' && portalTab === 'nursing' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5 space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-rose-500/20 bg-rose-500/5 space-y-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                               <Bed className="w-64 h-64 text-white" />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-4 bg-rose-500 rounded-3xl shadow-xl">
                                  <HeartPulse className="w-8 h-8 text-white" />
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-white uppercase italic">Nursing <span className="text-rose-400">Hub</span></h3>
                                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">Geriatric & Recuperative Node</p>
                               </div>
                            </div>
                            <div className="space-y-6 relative z-10">
                               <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-2">Active Care Shards</p>
                                  <div className="space-y-3">
                                     {['Senior Cattle Recovery', 'Avian Post-Viral Sync', 'Trauma Remediation'].map(n => (
                                       <div key={n} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-rose-500/10 transition-colors">
                                          <span className="text-xs font-bold text-slate-300">{n}</span>
                                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                               <button 
                                 onClick={runNursingAudit}
                                 disabled={loading}
                                 className="w-full py-6 bg-rose-600 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                               >
                                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                                  INITIALIZE CARE AUDIT
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7">
                         <div className="glass-card rounded-[56px] min-h-[600px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                            <div className="absolute inset-0 opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                            {loading ? (
                               <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-pulse">
                                  <div className="relative">
                                     <Loader2 className="w-20 h-20 text-rose-500 animate-spin" />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <Heart className="w-8 h-8 text-rose-400" />
                                     </div>
                                  </div>
                                  <p className="text-rose-400 font-black text-sm uppercase tracking-[0.6em]">Syncing Medical Ledger...</p>
                               </div>
                            ) : nursingReport ? (
                               <div className="p-10 md:p-14 space-y-10 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
                                  <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                                     <Sparkles className="w-6 h-6 text-rose-400" />
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Steward <span className="text-rose-400">Nursing Strategy</span></h4>
                                  </div>
                                  <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l-4 border-rose-500/20 pl-8 font-medium bg-white/[0.01] p-10 rounded-[48px]">
                                     {nursingReport}
                                  </div>
                                  <div className="flex justify-center gap-6">
                                     <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Download Shard</button>
                                     <button className="px-10 py-4 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-2xl">Deploy Recovery Node</button>
                                  </div>
                               </div>
                            ) : (
                               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                                  <div className="w-40 h-40 rounded-[48px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center relative">
                                     <Bed className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-[5s]" />
                                     <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                  </div>
                                  <div className="max-w-xs space-y-3">
                                     <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Nursing Archive</h4>
                                     <p className="text-slate-500 text-sm italic leading-relaxed">Initialize a Care Audit to generate a specialized animal nursing strategy for your node.</p>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeBrand.id === 'hearts4agro' && portalTab === 'hospitality' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5 space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-rose-500/20 bg-rose-500/5 space-y-10 shadow-2xl">
                            <div className="flex items-center gap-4">
                               <div className="p-4 bg-rose-600 rounded-3xl shadow-xl">
                                  <Utensils className="w-8 h-8 text-white" />
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-white uppercase italic">Hospitality <span className="text-rose-400">Node</span></h3>
                                  <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">Catering & Nutrient Synthesis</p>
                               </div>
                            </div>
                            
                            <div className="space-y-6">
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6 flex items-center gap-2">
                                     <MessageSquareText size={12} className="text-rose-400" /> Catering Specifications
                                  </label>
                                  <textarea 
                                     value={hospitalitySpecs}
                                     onChange={e => setHospitalitySpecs(e.target.value)}
                                     placeholder="e.g. High-performance poultry nutrition, Geriatric horse lodging design..."
                                     className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-rose-500/20 outline-none transition-all h-48 resize-none placeholder:text-slate-800 shadow-inner"
                                  />
                               </div>
                               <button 
                                 onClick={handleGenerateHospitality}
                                 disabled={isGeneratingMenu || !hospitalitySpecs.trim()}
                                 className="w-full py-8 bg-rose-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-rose-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                               >
                                  {isGeneratingMenu ? <Loader2 className="w-6 h-6 animate-spin" /> : <Soup className="w-6 h-6 fill-current" />}
                                  SYNTHESIZE HOSPITALITY SHARD
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7">
                         <div className="glass-card rounded-[56px] min-h-[600px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                            <div className="absolute inset-0 opacity-[0.01] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                            {isGeneratingMenu ? (
                               <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                                  <Loader2 className="w-20 h-20 text-rose-500 animate-spin" />
                                  <p className="text-rose-400 font-black text-sm uppercase tracking-[0.6em] animate-pulse">Designing Menu Shards...</p>
                               </div>
                            ) : hospitalityOutput ? (
                               <div className="p-10 md:p-14 space-y-10 animate-in slide-in-from-right-6 duration-700 overflow-y-auto custom-scrollbar">
                                  <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                                     <Sparkles className="w-6 h-6 text-rose-400" />
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Hospitality <span className="text-rose-400">Blueprint</span></h4>
                                  </div>
                                  <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l-4 border-rose-500/20 pl-8 font-medium bg-white/[0.01] p-10 rounded-[48px] shadow-2xl">
                                     {hospitalityOutput}
                                  </div>
                                  <div className="flex justify-center gap-8">
                                     <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95 shadow-xl">
                                        <Download className="w-4 h-4" /> Export Menu Shard
                                     </button>
                                     <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                        <HeartHandshake className="w-4 h-4" /> Commit to Societal Registry
                                     </button>
                                  </div>
                               </div>
                            ) : (
                               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                                  <div className="w-48 h-48 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center relative">
                                     <Soup className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-[5s]" />
                                     <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                  </div>
                                  <div className="max-w-xs space-y-3 px-4">
                                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Nutrient Terminal</h4>
                                     <p className="text-slate-500 text-sm italic leading-relaxed">"Select catering parameters to synthesize institutional hospitality shards for your animal nodes."</p>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* LILIES AROUND ARCHITECTURE LAB */}
              {activeBrand.id === 'lilies' && portalTab === 'architecture' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                      <div className="lg:col-span-5 space-y-8">
                         <div className="glass-card p-8 md:p-10 rounded-[40px] border-pink-500/20 bg-pink-500/5 space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-pink-500 rounded-2xl shadow-xl">
                                  <PencilRuler className="w-6 h-6 text-white" />
                               </div>
                               <h3 className="text-xl md:text-2xl font-black text-white uppercase italic">Design <span className="text-pink-400">Lab</span></h3>
                            </div>
                            
                            <div className="space-y-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Design Category</label>
                                  <div className="grid grid-cols-2 gap-3">
                                     {['Warehouse', 'Poultry', 'Landscaping', 'Flower Garden', 'Hydroponics', 'Vertical Farming', 'Urban Farming'].map(t => (
                                       <button 
                                         key={t}
                                         onClick={() => setArchType(t as any)}
                                         className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${archType === t ? 'bg-pink-600 border-white text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                       >
                                         <div className="flex flex-col items-center gap-2">
                                            {t === 'Warehouse' ? <Warehouse size={16} /> : 
                                             t === 'Poultry' ? <Home size={16} /> : 
                                             t === 'Landscaping' ? <Trees size={16} /> : 
                                             t === 'Flower Garden' ? <Flower2 size={16} /> :
                                             t === 'Hydroponics' ? <Droplets size={16} /> :
                                             t === 'Vertical Farming' ? <Layers size={16} /> :
                                             <Building size={16} />}
                                            <span className="truncate w-full px-1">{t}</span>
                                         </div>
                                       </button>
                                     ))}
                                  </div>
                               </div>

                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Target Scale</label>
                                  <div className="flex gap-2 p-1 glass-card rounded-2xl bg-black/40">
                                     {['Small', 'Medium', 'Large'].map(s => (
                                       <button 
                                         key={s}
                                         onClick={() => setArchScale(s as any)}
                                         className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${archScale === s ? 'bg-white/10 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
                                       >
                                         {s}
                                       </button>
                                     ))}
                                  </div>
                               </div>

                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 flex items-center gap-2">
                                    <MessageSquareText size={12} className="text-pink-400" />
                                    Detailed Specifications
                                  </label>
                                  <textarea 
                                    value={archSpecs}
                                    onChange={(e) => setArchSpecs(e.target.value)}
                                    placeholder="Describe your design needs (e.g. 'Hydroponic nutrient relay system', 'Vertical farm for urban rooftop'...)"
                                    className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white text-xs h-32 focus:ring-2 focus:ring-pink-500/40 outline-none transition-all placeholder:text-slate-800 italic font-medium resize-none shadow-inner"
                                  />
                               </div>

                               <div className="p-6 bg-pink-500/5 border border-pink-500/10 rounded-3xl space-y-4">
                                  <div className="flex items-center gap-3">
                                     <Sparkles className="w-5 h-5 text-pink-400" />
                                     <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest">Sustainable Parameters</p>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
                                        <span>Solar Ready</span>
                                        <span className="text-emerald-400">ENABLED</span>
                                     </div>
                                     <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
                                        <span>Thermal Sync</span>
                                        <span className="text-emerald-400">ENABLED</span>
                                     </div>
                                  </div>
                               </div>

                               <button 
                                 onClick={handleGenerateArchitecture}
                                 disabled={isGeneratingArch}
                                 className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all mt-4 disabled:opacity-30"
                               >
                                  {isGeneratingArch ? <Loader2 className="w-6 h-6 animate-spin" /> : <Palette className="w-6 h-6" />}
                                  {isGeneratingArch ? "Synthesizing Shard..." : "GENERATE BLUEPRINT"}
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-7 flex flex-col h-full">
                         <div className="glass-card rounded-[48px] bg-white/[0.01] border border-white/5 flex-1 flex flex-col overflow-hidden shadow-3xl min-h-[500px]">
                            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                     <Compass className="w-6 h-6 animate-spin-slow" />
                                  </div>
                                  <span className="text-sm font-black text-white uppercase tracking-widest italic">Industrial <span className="text-pink-400">Drafting Mesh</span></span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Ready</span>
                               </div>
                            </div>
                            
                            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative">
                               {isGeneratingArch ? (
                                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10 space-y-8">
                                    <div className="relative">
                                       <Loader2 className="w-20 h-20 text-pink-500 animate-spin" />
                                       <div className="absolute inset-0 flex items-center justify-center">
                                          <Bot className="w-8 h-8 text-pink-400 animate-pulse" />
                                       </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                       <p className="text-pink-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Mapping Geometry...</p>
                                       <p className="text-slate-600 font-mono text-xs">CALCULATING M™ RESILIENCE_V4</p>
                                    </div>
                                 </div>
                               ) : archBlueprint ? (
                                 <div className="space-y-10 animate-in fade-in duration-700">
                                    <div className="p-10 bg-black/60 rounded-[40px] border-l-8 border-pink-500/50 shadow-2xl relative overflow-hidden group">
                                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><PencilRuler className="w-64 h-64 text-white" /></div>
                                       <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5 relative z-10">
                                          <Sparkles className="w-6 h-6 text-pink-400" />
                                          <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Blueprint Shard: {archType}</h4>
                                       </div>
                                       <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed md:leading-[2.2] italic whitespace-pre-line border-l-2 border-white/5 pl-8 font-medium relative z-10">
                                          {archBlueprint}
                                       </div>
                                    </div>
                                    <div className="flex justify-center gap-6">
                                       <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                                          <Download className="w-5 h-5" /> Export PDF Shard
                                       </button>
                                       <button className="px-10 py-4 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                                          <Database className="w-5 h-5" /> Commit to Registry
                                       </button>
                                    </div>
                                 </div>
                               ) : (
                                 <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                                    <div className="w-48 h-48 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden">
                                       <Compass className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-[5s]" />
                                       <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                    </div>
                                    <div className="max-w-xs">
                                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Architecture Lab</h4>
                                       <p className="text-slate-500 text-sm italic mt-2 leading-relaxed">"Select a prototype category and define your specific requirements to initialize the synthesis lab."</p>
                                    </div>
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* FLORICULTURE TERMINAL */}
              {activeBrand.id === 'lilies' && portalTab === 'floriculture' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-500">
                  <div className="flex justify-between items-center bg-pink-500/5 border border-pink-500/10 p-2 rounded-[32px] w-fit mx-auto lg:mx-0">
                    {[
                      { id: 'farming', label: 'Growth Lifecycle', icon: Sprout },
                      { id: 'heritage', label: 'Heritage Ledger', icon: History },
                      { id: 'perception', label: 'Social Perception', icon: MessageSquareText },
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setFloriTab(t.id as any)}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${floriTab === t.id ? 'bg-pink-600 text-white shadow-xl shadow-pink-900/40' : 'text-slate-500 hover:text-white'}`}
                      >
                        <t.icon className="w-4 h-4" /> {t.label}
                      </button>
                    ))}
                  </div>

                  {floriTab === 'farming' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card p-10 rounded-[48px] border-pink-500/20 bg-pink-500/5 text-center space-y-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform"><Sun className="w-40 h-40 text-pink-400" /></div>
                           <p className="text-[10px] text-pink-400 font-black uppercase tracking-[0.4em] relative z-10">Global Bloom Velocity</p>
                           <h3 className="text-7xl font-black text-white font-mono tracking-tighter relative z-10">14.2<span className="text-xl text-emerald-500">%</span></h3>
                           <div className="space-y-4 relative z-10 pt-4 border-t border-white/5">
                              <div className="flex justify-between text-[9px] font-black uppercase">
                                 <span className="text-slate-500">Node Sync</span>
                                 <span className="text-emerald-400">OPTIMAL</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-pink-500 animate-pulse" style={{ width: '84%' }}></div>
                              </div>
                           </div>
                        </div>
                        <div className="p-8 glass-card rounded-[40px] border-white/5 space-y-6 bg-black/40">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><Monitor size={14} className="text-pink-400" /> Active Bloom Nodes</h4>
                           <div className="space-y-4">
                              {['Zone 4 Rose Hub', 'Highland Orchid Shard', 'Coastal Lily Relay'].map(n => (
                                <div key={n} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                   <span className="text-xs font-bold text-slate-300">{n}</span>
                                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>

                      <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col justify-center min-h-[500px] shadow-3xl">
                        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                        <div className="text-center space-y-10 relative z-10">
                           <div className="w-48 h-48 rounded-full border-8 border-pink-500/10 flex items-center justify-center mx-auto relative group">
                              <Flower className="w-20 h-20 text-pink-400 animate-pulse group-hover:scale-125 transition-transform duration-700" />
                              <div className="absolute inset-[-15px] border-4 border-dashed border-pink-500/20 rounded-full animate-spin-slow"></div>
                           </div>
                           <div className="max-w-md mx-auto space-y-4">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Lifecycle Ingest</h4>
                              <p className="text-slate-400 text-lg leading-relaxed italic font-medium">"Syncing UV resonance shards and moisture biometrics for high-purity floral output."</p>
                           </div>
                           <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all">INITIALIZE BLOOM SYNC</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {floriTab === 'heritage' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {[
                           { name: 'Bantu Sun-Lily', rarity: 'Native', esin: 'EA-LINEAGE-01', desc: 'Ancient lineage shard used for social harmony audits.' },
                           { name: 'Highland Moss-Rose', rarity: 'Rare', esin: 'EA-LINEAGE-42', desc: 'Biological buffer shard for high-altitude soil repair.' },
                           { name: 'Glacial Bloom', rarity: 'Endangered', esin: 'EA-LINEAGE-88', desc: 'Thermal resilience pioneer found in permafrost nodes.' },
                         ].map(f => (
                           <div key={f.name} onClick={() => setSelectedFlower(f.name)} className={`glass-card p-10 rounded-[48px] border-2 transition-all group flex flex-col h-full active:scale-95 cursor-pointer overflow-hidden relative ${selectedFlower === f.name ? 'border-pink-500/40 bg-pink-500/5 shadow-2xl' : 'border-white/5 bg-black/40'}`}>
                              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Flower2 size={120} /></div>
                              <div className="flex justify-between items-start mb-10">
                                 <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-pink-600 transition-colors ${selectedFlower === f.name ? 'bg-pink-600 text-white shadow-xl' : 'text-slate-600'}`}>
                                    <FileBadge size={28} />
                                 </div>
                                 <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{f.rarity}</span>
                              </div>
                              <h4 className="text-2xl font-black text-white uppercase tracking-tight italic group-hover:text-pink-400 transition-colors leading-none m-0">{f.name}</h4>
                              <p className="text-[10px] text-pink-400/60 font-mono tracking-widest mt-2">{f.esin}</p>
                              <p className="text-sm text-slate-400 italic mt-6 leading-relaxed flex-1 group-hover:text-slate-200 transition-colors">"{f.desc}"</p>
                              <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">Audit Shard</span>
                                 <ArrowRight size={16} className="text-slate-800 group-hover:translate-x-1 transition-transform group-hover:text-pink-400" />
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
                            <History className="w-96 h-96 text-indigo-400" />
                         </div>
                         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                            <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                               <Dna className="w-16 h-16 text-white" />
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Lineage Anchoring</h4>
                               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Commit biological heritage shards to the global environmental registry.</p>
                            </div>
                         </div>
                         <button 
                           onClick={handleHeritageSync}
                           disabled={isSyncingHeritage}
                           className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all relative z-10 disabled:opacity-50"
                         >
                            {isSyncingHeritage ? <Loader2 className="animate-spin" /> : "ANCHORED SYNC"}
                         </button>
                      </div>
                    </div>
                  )}

                  {floriTab === 'perception' && (
                    <div className="space-y-10 animate-in zoom-in duration-500 max-w-4xl mx-auto">
                       <div className="text-center space-y-6">
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Social <span className="text-pink-400">Resonance</span></h3>
                          <p className="text-slate-400 text-xl font-medium italic">"Floriculture is the language of human perception. Tag your shards to boost Societal (S) Thrust."</p>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {[
                            { label: 'Gratitude', points: '+12 Rep', icon: Heart },
                            { label: 'Resilience', points: '+18 Rep', icon: ShieldCheck },
                            { label: 'Heritage', points: '+24 Rep', icon: History },
                            { label: 'Growth', points: '+10 Rep', icon: Sprout },
                          ].map(t => (
                            <button key={t.label} className="glass-card p-10 rounded-[44px] border border-white/5 hover:border-pink-500/40 hover:bg-pink-500/5 transition-all flex flex-col items-center gap-4 group active:scale-95 shadow-xl">
                               <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-2xl">
                                  <t.icon size={28} />
                               </div>
                               <div className="text-center">
                                  <h4 className="text-lg font-black text-white uppercase tracking-tight italic">{t.label}</h4>
                                  <p className="text-[10px] text-pink-400 font-bold uppercase mt-1">{t.points}</p>
                               </div>
                            </button>
                          ))}
                       </div>

                       <div className="p-12 glass-card rounded-[56px] border-emerald-500/20 bg-emerald-500/5 flex items-center gap-10">
                          <div className="p-4 bg-emerald-500 text-white rounded-3xl shadow-xl">
                             <Handshake size={32} />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Consensus Vetting</h4>
                             <p className="text-slate-400 text-lg italic leading-relaxed">Community-vetted flower arrangements earn an additional 15% EAC trade bonus.</p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* TOKENZ SPECIALIZED INTERFACES */}
              {activeBrand.id === 'tokenz' && portalTab === 'deposit' && (
                <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="glass-card p-8 md:p-10 rounded-[40px] border-yellow-500/20 bg-yellow-500/5 space-y-8">
                     <div className="text-center space-y-2">
                        <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic">Node <span className="text-yellow-500">Bridge</span></h4>
                        <p className="text-slate-400 text-xs md:text-sm font-medium">Synchronize FIAT value into native EAC shards.</p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Bridge Gateway</label>
                           <div className="grid grid-cols-2 gap-3">
                              {['M-Pesa Direct', 'Bank Relay', 'Card Bridge', 'Crypto Ingress'].map(g => (
                                <button 
                                  key={g} 
                                  onClick={() => setSelectedGateway(g)}
                                  className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedGateway === g ? 'bg-yellow-500 border-white text-black shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                >
                                  {g}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Handshake Amount (USD)</label>
                           <input 
                             type="number" 
                             value={depositAmount}
                             onChange={e => setDepositAmount(e.target.value)}
                             className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 md:py-8 px-8 md:px-10 text-4xl md:text-6xl font-mono text-white text-center focus:ring-4 focus:ring-yellow-500/20 outline-none transition-all" 
                           />
                           <div className="flex justify-between items-center px-4">
                              <p className="text-[8px] text-slate-600 font-black uppercase">Institutional Exchange</p>
                              <p className="text-sm font-mono text-yellow-500 font-black">≈ {(Number(depositAmount) * 1.15).toFixed(0)} EAC</p>
                           </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6 text-center block">Social ID Signature</label>
                           <div className="relative">
                              <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                              <input 
                                type="text" 
                                value={esinSign}
                                onChange={e => setEsinSign(e.target.value)}
                                placeholder="EA-XXXX-XXXX-XXXX"
                                className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 pl-16 pr-10 text-white font-mono uppercase tracking-[0.2em] focus:ring-4 focus:ring-yellow-500/20 outline-none transition-all" 
                              />
                           </div>
                        </div>

                        <button 
                          onClick={handleExecuteDeposit}
                          disabled={isDepositing || !esinSign}
                          className="w-full py-8 md:py-10 agro-gradient rounded-[40px] text-white font-black text-sm md:text-base uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95 transition-all mt-6"
                        >
                           {isDepositing ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                           {isDepositing ? "BRIDGE SYNCING..." : "COMMIT NODE DEPOSIT"}
                        </button>
                     </div>
                  </div>
                  
                  <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl flex items-center gap-6">
                     <ShieldCheck className="w-8 h-8 text-yellow-500 shrink-0" />
                     <p className="text-[9px] md:text-[10px] text-yellow-200/50 font-bold uppercase tracking-widest leading-relaxed">
                        Center Gate: Instant settlement enabled for verified steward nodes. 0.2% bridge fee applied to support network maintenance.
                     </p>
                  </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'finance' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                   <div className="glass-card p-8 md:p-12 rounded-[40px] md:rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-10">
                      <div className="flex justify-between items-center px-4">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                               <SwapIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic">Institutional <span className="text-indigo-400">Swap</span></h3>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] text-slate-600 font-black uppercase">Liquidity Shard</p>
                            <p className="text-xs font-mono font-bold text-white">EAC/USDC_LP</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="p-8 bg-black/60 rounded-[32px] border border-white/10 group focus-within:border-indigo-500/40 transition-all">
                            <div className="flex justify-between items-center mb-6">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">You Swap</span>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Balance: 4,281 EAC</span>
                            </div>
                            <div className="flex items-center gap-6">
                               <input 
                                 type="number" 
                                 value={swapInAmount}
                                 onChange={e => setSwapInAmount(e.target.value)}
                                 className="bg-transparent text-4xl md:text-5xl font-mono font-black text-white w-full outline-none" 
                               />
                               <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 shrink-0">
                                  <Coins className="w-5 h-5 text-emerald-400" />
                                  <span className="text-sm font-black text-white">EAC</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex justify-center -my-6 relative z-10">
                            <button className="p-4 bg-[#050706] border border-white/10 rounded-full text-indigo-400 shadow-xl hover:rotate-180 transition-transform duration-500 active:scale-90">
                               <ArrowDownUp className="w-6 h-6" />
                            </button>
                         </div>

                         <div className="p-8 bg-black/60 rounded-[32px] border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">You Receive</span>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-4xl md:text-5xl font-mono font-black text-slate-400 w-full">≈ {(Number(swapInAmount) * 0.84).toFixed(2)}</div>
                               <select 
                                 value={swapAsset}
                                 onChange={e => setSwapAsset(e.target.value)}
                                 className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-black text-white appearance-none outline-none cursor-pointer"
                               >
                                  <option>USDC</option>
                                  <option>USDT</option>
                                  <option>BTC_SHARD</option>
                                  <option>AGRO_GOV</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="p-8 space-y-4">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-600">Slippage Tolerance</span>
                            <span className="text-indigo-400">0.5% (STABLE)</span>
                         </div>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-600">Bridge Routing</span>
                            <span className="text-white">Tokenz_Central_Gate_Primary</span>
                         </div>
                      </div>

                      <button 
                        onClick={handleExecuteSwap}
                        disabled={isSwapping}
                        className="w-full py-8 md:py-10 bg-indigo-600 rounded-[40px] text-white font-black text-sm md:text-base uppercase tracking-[0.4em] shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6"
                      >
                         {isSwapping ? <Loader2 className="w-6 h-6 animate-spin" /> : <SwapIcon className="w-6 h-6" />}
                         {isSwapping ? "EXECUTING ORDER..." : "INITIALIZE INSTITUTIONAL SWAP"}
                      </button>
                   </div>
                </div>
              )}

              {activeBrand.id === 'tokenz' && portalTab === 'gateways' && (
                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[
                        { name: 'Omaha Central Hub', zone: 'Zone 4 NE', status: 'Optimal', throughput: '12.4 TB/h', load: 45, icon: Radar, color: 'text-amber-500' },
                        { name: 'Nairobi Edge Node', zone: 'Zone 8 KE', status: 'Stable', throughput: '4.8 TB/h', load: 12, icon: Globe, color: 'text-blue-400' },
                        { name: 'Valencia Marine Relay', zone: 'Zone 1 ES', status: 'Syncing', throughput: '32.1 TB/h', load: 88, icon: Waves, color: 'text-cyan-400' },
                      ].map((gw, i) => (
                        <div key={i} className="glass-card p-8 rounded-[44px] border border-white/5 space-y-8 group hover:border-indigo-500/30 transition-all flex flex-col relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                              <gw.icon className="w-40 h-40 text-white" />
                           </div>
                           <div className="flex justify-between items-start relative z-10">
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                 <gw.icon className={`w-8 h-8 ${gw.color}`} />
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md ${
                                gw.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                gw.status === 'Stable' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                              }`}>
                                 {gw.status}
                              </span>
                           </div>
                           <div className="flex-1 space-y-1 relative z-10">
                              <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">{gw.name}</h4>
                              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{gw.zone} INGRESS POINT</p>
                           </div>
                           <div className="space-y-4 relative z-10">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                 <span className="text-slate-600">Throughput</span>
                                 <span className="text-white font-mono">{gw.throughput}</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full bg-indigo-500 transition-all duration-[2s]`} style={{ width: `${gw.load}%` }}></div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="p-16 glass-card rounded-[64px] border-blue-500/20 bg-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                         <Network className="w-96 h-96 text-blue-400" />
                      </div>
                      <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                         <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                            <Cable className="w-16 h-16 text-white" />
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Global Data Ingress</h4>
                            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-md:text-sm max-w-md">Synchronized telemetry from 14 independent regional bridge gateways.</p>
                         </div>
                      </div>
                      <div className="text-center md:text-right relative z-10 shrink-0">
                         <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">TOTAL_SYNC_NODES</p>
                         <p className="text-6xl font-mono font-black text-white tracking-tighter">4,281</p>
                         <button className="mt-6 flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase hover:text-white transition-all mx-auto md:ml-auto md:mr-0">
                            View Mesh Topology <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {/* GIFT PORTAL */}
              {activeBrand.id === 'lilies' && portalTab === 'gift' && (
                <div className="max-w-xl mx-auto space-y-12 animate-in zoom-in duration-500">
                  <div className="glass-card p-10 md:p-16 rounded-[48px] md:rounded-[64px] border-pink-500/20 bg-pink-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-3xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                      <Gift className="w-96 h-96 text-pink-400" />
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                      <div className="w-20 h-20 md:w-28 md:h-28 bg-pink-500 rounded-3xl md:rounded-[32px] flex items-center justify-center shadow-[0_0_80px_rgba(236,72,153,0.3)] mx-auto ring-4 ring-white/10">
                        <Calendar className="w-10 h-10 md:w-14 md:h-14 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Zodiac <span className="text-pink-400">Gift</span></h3>
                        <p className="text-slate-400 text-sm md:text-xl font-medium mt-4 md:mt-6 leading-relaxed">
                          receive a branded Zodiac Flower from Lilies Around. grants you <span className="text-pink-400 font-black">100 bonus reputation points</span>.
                        </p>
                      </div>
                    </div>

                    {!user.zodiacFlower ? (
                      <div className="space-y-10 w-full max-sm:max-w-md relative z-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Select Birth Month</label>
                          <select 
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 md:py-8 px-10 text-2xl md:text-3xl font-black text-white focus:ring-4 focus:ring-pink-500/20 outline-none transition-all appearance-none text-center cursor-pointer shadow-inner"
                          >
                            {Object.keys(ZODIAC_FLOWERS).map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        
                        <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[48px] space-y-6 shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className={`text-4xl md:text-6xl font-black italic tracking-tighter leading-none ${ZODIAC_FLOWERS[selectedMonth].color}`}>
                              {ZODIAC_FLOWERS[selectedMonth].flower}
                           </div>
                           <p className="text-slate-400 text-sm md:text-lg italic leading-relaxed">"{ZODIAC_FLOWERS[selectedMonth].desc}"</p>
                        </div>

                        <button 
                          onClick={handleClaimZodiacGift}
                          disabled={isClaimingGift}
                          className="w-full py-8 md:py-10 bg-pink-600 rounded-3xl md:rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_50px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30"
                        >
                          {isClaimingGift ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />}
                          CLAIM BIRTH MONTH GIFT
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-12 animate-in zoom-in duration-700 w-full max-sm:max-w-md relative z-10">
                        <div className="relative">
                          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-pink-500/10 border-8 border-pink-500/30 flex items-center justify-center mx-auto group">
                            <Flower2 className={`w-24 h-24 md:w-32 md:h-32 ${user.zodiacFlower.color} group-hover:scale-110 transition-transform duration-700`} />
                            <div className="absolute inset-[-20px] border-4 border-dashed border-pink-500/20 rounded-full animate-spin-slow"></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Your {user.zodiacFlower.flower}</h4>
                           <p className="text-pink-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em]">ANCHORED TO STEWARD DOSSIER</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 w-full">
                          <button 
                            onClick={downloadBadgeImage}
                            disabled={isGeneratingBadge}
                            className="w-full py-5 md:py-6 agro-gradient rounded-2xl md:rounded-[32px] text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                             {isGeneratingBadge ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                             Download Digital Badge
                          </button>
                          <button 
                            onClick={() => setPortalTab('ai')}
                            className="w-full py-5 md:py-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-[32px] text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all shadow-xl"
                          >
                             Return to Main Hub
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {portalTab === 'market' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 animate-in slide-in-from-right-4 duration-500">
                  {activeBrand.products.map(product => (
                    <div key={product.id} className="glass-card p-8 md:p-12 rounded-[40px] md:rounded-[56px] border border-white/5 hover:border-emerald-500/40 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/40 shadow-xl">
                       <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                          <product.icon className="w-24 h-24 md:w-32 md:h-32 text-white" />
                       </div>
                       <div className="flex justify-between items-start mb-8 md:mb-10 relative z-10">
                          <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-2xl">
                             <product.icon className={`w-8 h-8 md:w-10 md:h-10 ${activeBrand.color}`} />
                          </div>
                          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 text-[7px] md:text-[9px] font-black uppercase rounded-full tracking-widest border border-white/10 text-slate-500">{product.type}</span>
                       </div>
                       <h4 className="text-xl md:text-3xl font-black text-white mb-6 md:mb-10 leading-tight tracking-tighter group-hover:text-emerald-400 transition-colors flex-1 italic">{product.name}</h4>
                       <div className="pt-6 md:pt-10 border-t border-white/5 flex items-end justify-between relative z-10">
                          <div>
                             <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 md:mb-2">Protocol Fee</p>
                             <div className="flex items-center gap-2 md:gap-3">
                               <p className="text-2xl md:text-4xl font-mono font-black text-white">{product.price.toLocaleString()}</p>
                               <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">EAC</span>
                             </div>
                          </div>
                          <button className="p-4 md:p-6 bg-emerald-600 rounded-2xl md:rounded-[28px] text-white shadow-xl hover:bg-emerald-500 transition-all hover:scale-110 active:scale-95">
                             <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {portalTab === 'ai' && (activeBrand.id !== 'tokenz') && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
                   <div className="glass-card p-8 md:p-16 rounded-[40px] md:rounded-[64px] border-white/5 bg-white/[0.01] flex flex-col items-center text-center space-y-8 md:space-y-12 min-h-[400px] md:min-h-[500px] justify-center relative shadow-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] to-transparent pointer-events-none"></div>
                      {loading ? (
                        <div className="flex flex-col items-center gap-8 md:gap-10">
                           <div className="relative">
                              <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-emerald-500 animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Bot className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <p className="text-emerald-400 font-black text-sm md:text-xl uppercase tracking-[0.4em] md:tracking-[0.5em] animate-pulse italic">Syncing Shard Intel...</p>
                        </div>
                      ) : aiResult ? (
                        <div className="w-full text-left space-y-8 md:space-y-12 animate-in fade-in duration-700">
                           <div className="flex items-center gap-4 md:gap-6 border-b border-white/5 pb-8 md:pb-10">
                              <div className="p-3 md:p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                 <Bot className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                              </div>
                              <div>
                                 <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest italic">Oracle Intelligence Shard</h4>
                                 <p className="text-emerald-500/40 text-[8px] md:text-[10px] font-mono tracking-widest uppercase font-black">{activeBrand.name.toUpperCase()} // EOS_FINAL_v3.2</p>
                              </div>
                           </div>
                           <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed md:leading-[2.4] text-base md:text-2xl italic whitespace-pre-line border-l-4 md:border-l-8 border-emerald-500/10 pl-6 md:pl-16 font-medium bg-black/40 p-6 md:p-12 rounded-[32px] md:rounded-[56px] shadow-inner">
                              {aiResult.text}
                           </div>
                           <div className="flex justify-center pt-4 md:pt-8">
                              <button onClick={() => setAiResult(null)} className="px-10 md:px-16 py-4 md:py-5 bg-white/5 border border-white/10 rounded-[24px] md:rounded-3xl text-[9px] md:text-[11px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Flush Data Cache</button>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-8 md:space-y-12">
                           <div className="relative group">
                              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl group-hover:rotate-12 transition-transform duration-700 relative z-10">
                                 <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Neural <span className="text-emerald-400">Oracle Sync</span></h4>
                              <p className="text-slate-500 text-sm md:text-2xl leading-relaxed italic font-medium">
                                 Invoke the EnvirosAgro™ high-fidelity oracle to analyze performance shards for this protocol node.
                              </p>
                              <button 
                                onClick={runBrandAction}
                                className="px-10 md:px-16 py-6 md:py-8 agro-gradient rounded-3xl md:rounded-[48px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 md:gap-6 mx-auto group"
                              >
                                 <Zap className="w-6 h-6 md:w-10 md:h-10 fill-current group-hover:animate-pulse" />
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
      
      <div className="flex flex-col md:flex-row justify-between items-center pt-10 md:pt-16 border-t border-white/5 px-4 opacity-40 gap-6">
        <div className="flex gap-6 md:gap-10">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
             <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">ZK-REGISTRY_VERIFIED</span>
          </div>
          <div className="flex items-center gap-3">
             <Shield className="w-4 h-4 text-blue-400" />
             <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">STABLE_RESONANCE_FIELD</span>
          </div>
        </div>
        <p className="text-[8px] md:text-[9px] font-mono text-slate-700 font-black uppercase tracking-widest">Active Steward: {user.esin} // {user.location.toUpperCase()}</p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Ecosystem;
