import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, Factory, Monitor, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2, Signal as SignalIcon, Target,
  Truck, Layers, Map as MapIcon, Compass as CompassIcon, Server, Workflow, ShieldPlus, ChevronLeftCircle, ArrowLeft,
  ChevronRight, ArrowUp, UserCheck, BookOpen, Stamp, Binoculars, Command, Bot, Wand2, Brain, ArrowRight, Home,
  Building, ShieldX, Cpu as CpuIcon, MessageSquare, UserCheck as UserCheckIcon,
  MessageCircle,
  FileBadge,
  ArrowUpRight,
  FileDigit,
  Music,
  GraduationCap,
  Download
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, NotificationType, MediaShard, SignalShard } from './types';
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
import AgroValueEnhancement from './components/AgroValueEnhancement';
import DigitalMRV from './components/DigitalMRV';
import RegistryHandshake from './components/RegistryHandshake';
import OnlineGarden from './components/OnlineGarden';
import FarmOS from './components/FarmOS';
import NetworkView from './components/NetworkView';
import MediaLedger from './components/MediaLedger';
import AgroLang from './components/AgroLang';
import SignalCenter from './components/SignalCenter';
import Sitemap from './components/Sitemap';
import AIAnalyst from './components/AIAnalyst';
import VerificationHUD from './components/VerificationHUD';

import { 
  syncUserToCloud, 
  auth, 
  getStewardProfile, 
  signOutSteward, 
  onAuthStateChanged,
  listenToCollection,
  saveCollectionItem,
  dispatchNetworkSignal,
  markPermanentAction,
  listenToPulse,
  refreshAuthUser
} from './services/firebaseService';
import { chatWithAgroExpert } from './services/geminiService';

export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M100 180C100 180 95 160 100 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 145C100 145 70 140 50 120C30 100 20 80 25 55C30 30 55 20 75 35C85 45 100 30 100 30C100 30 115 45 125 35C145 20 170 30 175 55C180 80 170 100 150 120C130 140 100 145 100 145Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

const BOOT_LOGS = [
  "INITIALIZING SYCAMORE_OS_v6.5...",
  "MAPPING_GEOFENCE_SHARDS [OK]",
  "CALIBRATING_M_CONSTANT_BASE [1.42]",
  "SYNCING_L3_INDUSTRIAL_LEDGER...",
  "ZK_PROOF_ENGINE_BOOT [SUCCESS]",
  "ESTABLISHING_ORACLE_HANDSHAKE...",
  "SEHTI_THRUST_ALIGNED",
  "NODE_SYNC_FINALIZED"
];

// --- CROSS-LEDGER SEARCH DATA ---
const GLOBAL_STEWARD_REGISTRY = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', role: 'Soil Expert', location: 'Nairobi, Kenya', res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', online: true, skills: ['Bantu Soil Sharding', 'Drought Mitigation'] },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', role: 'Genetics Analyst', location: 'Omaha, USA', res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', online: false, skills: ['DNA Sequencing', 'Aura Ingest'] },
  { esin: 'EA-ROBO-9214', name: 'Dr. Orion Bot', role: 'Automation Engineer', location: 'Tokyo Hub', res: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', online: true, skills: ['Agroboto Control', 'Mesh Stability'] },
  { esin: 'EA-LILY-0042', name: 'Aesthetic Rose', role: 'Botanical Architect', location: 'Valencia Shard', res: 99, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', online: true, skills: ['Lilies Design', 'Chroma Calibration'] },
];

const SEARCHABLE_MEDIA_LEDGER = [
  { id: 'MED-COF-01', title: 'Coffee Soil Micronutrient Sharding', type: 'PAPER', source: 'AgroInPDF', desc: 'Technical PDF on high-altitude coffee soil remediation.', icon: FileDigit },
  { id: 'MED-COF-02', title: 'Bantu Coffee Lineage Heritage', type: 'VIDEO', source: 'Cinema Shard', desc: 'Ingest log of ancestral coffee preservation.', icon: Clapperboard },
  { id: 'MED-WAV-03', title: 'Sonic Soil Repair (432Hz)', type: 'AUDIO', source: 'Acoustic Registry', desc: 'Bio-electric frequency for cellular repair.', icon: Music },
  { id: 'MED-RES-04', title: 'Carbon Sequestration Metrics v6', type: 'PAPER', source: 'Research Hub', desc: 'Whitepaper on EOS carbon minting logic.', icon: FileText },
];

const GLOBAL_PROJECTS_MISSIONS = [
  { id: 'MIS-882', name: 'Nairobi Ingest Hub Expansion', budget: '1.2M EAC', thrust: 'Industry', desc: 'Expansion of regional logistics nodes.' },
  { id: 'MIS-104', name: 'Carbon Vault Audit Mission', budget: '450K EAC', thrust: 'Environmental', desc: 'Verified physical audit of bio-char plots.' },
];

const AGROWILD_EXPERIENCES = [
  { id: 'EXP-SAF-01', title: 'Spectral Birding Safari', cost: '150 EAC', node: 'Node_Nairobi_04', desc: 'Multi-spectral binocular tour of wetlands.' },
  { id: 'EXP-WAL-02', title: 'Bantu Botanical Walk', cost: '50 EAC', node: 'Node_Paris_82', desc: 'Lineage forest walk with heritage stewards.' },
];

const LOGISTICS_SHARDS = [
  { id: 'LOG-RAI-01', name: 'Eco-Rail Electric Shard', speed: '48h', cost: '120 EAC', status: 'Active' },
  { id: 'LOG-DRO-02', name: 'Solar Drone Relay', speed: '6h', cost: '450 EAC', status: 'Active' },
];

const LMS_EXAMS_MODULES = [
  { id: 'EXM-882', title: 'EOS Framework Master Exam', reward: '500 EAC', category: 'Vetting', icon: BadgeCheck },
  { id: 'MOD-104', title: 'm-Constant Resilience Theory', reward: '150 EAC', category: 'Technical', icon: GraduationCap },
];

const InitializationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLog(prev => (prev < BOOT_LOGS.length - 1 ? prev + 1 : prev));
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center space-y-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <div className="relative group">
        <div className="w-48 h-48 rounded-[48px] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.2)] animate-pulse relative z-20">
          <SycamoreLogo size={100} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
        </div>
        <div className="absolute inset-[-20px] border-2 border-dashed border-emerald-500/20 rounded-[64px] animate-spin-slow"></div>
      </div>

      <div className="w-full max-md space-y-6 relative z-20 px-6">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex flex-col items-center gap-2">
           <p className="text-[10px] font-mono font-black text-emerald-400/80 uppercase tracking-[0.3em] animate-pulse">
              {BOOT_LOGS[currentLog]}
           </p>
           <p className="text-[8px] font-mono text-slate-700 font-bold uppercase tracking-widest">
              SECURE_BOOT // KERNEL_SYNC: {progress}%
           </p>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30">
        <h1 className="text-xl font-black text-white italic tracking-tighter">Enviros<span className="text-emerald-400">Agro</span></h1>
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest text-center">Planetary Regeneration Grid</p>
      </div>
    </div>
  );
};

const GUEST_STWD: User = {
  name: 'GUEST STEWARD',
  email: 'guest@envirosagro.org',
  esin: 'EA-GUEST-VOID-NODE',
  mnemonic: 'none',
  regDate: new Date().toLocaleDateString(),
  role: 'OBSERVER',
  location: 'GLOBAL MESH NODE',
  wallet: {
    balance: 0,
    eatBalance: 0,
    exchangeRate: 1.0,
    bonusBalance: 0,
    tier: 'Seed',
    lifetimeEarned: 0,
    linkedProviders: [],
    miningStreak: 0,
    lastSyncDate: new Date().toISOString().split('T')[0],
    pendingSocialHarvest: 0,
    stakedEat: 0
  },
  metrics: {
    agriculturalCodeU: 0,
    timeConstantTau: 0,
    sustainabilityScore: 0,
    socialImmunity: 0,
    viralLoadSID: 0,
    baselineM: 0
  },
  skills: {},
  isReadyForHire: false,
  completedActions: []
};

export interface RegistryItem {
  id: string;
  name: string;
  icon: any;
  sections?: { id: string; label: string; desc?: string }[];
}

export interface RegistryGroup {
  category: string;
  items: RegistryItem[];
}

const REGISTRY_NODES: RegistryGroup[] = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard, sections: [{id: 'metrics', label: 'Node Metrics'}, {id: 'oracle', label: 'Oracle Hub'}, {id: 'path', label: 'Strategic Path'}] },
      { id: 'ai_analyst', name: 'Neural Analyst', icon: Brain },
      { id: 'profile', name: 'Steward Profile', icon: UserIcon },
      { id: 'network_signals', name: 'Signal Terminal', icon: SignalIcon, sections: [{id: 'terminal', label: 'Inbound Feed'}, {id: 'ledger', label: 'Signal History'}] },
      { id: 'network', name: 'Network Topology', icon: NetworkIcon },
      { id: 'farm_os', name: 'Farm OS', icon: Binary, sections: [{id: 'kernel', label: 'Kernel Stack'}, {id: 'hardware', label: 'Hardware Monitor'}, {id: 'shell', label: 'System Shell'}] },
      { id: 'impact', name: 'Network Impact', icon: TrendingUp, sections: [{id: 'whole', label: 'Vitality'}, {id: 'carbon', label: 'Carbon Ledger'}, {id: 'thrusts', label: 'Resonance'}] },
      { id: 'sustainability', name: 'Sustainability Shard', icon: Leaf },
      { id: 'intelligence', name: 'Science Oracle', icon: Microscope, sections: [{id: 'twin', label: 'Digital Twin'}, {id: 'simulator', label: 'EOS Physics'}, {id: 'telemetry', label: 'IoT Ingest'}, {id: 'trends', label: 'Trend Ingest'}, {id: 'eos_ai', label: 'Expert Oracle'}] },
      { id: 'explorer', name: 'Registry Explorer', icon: Database, sections: [{id: 'blocks', label: 'Blocks'}, {id: 'ledger', label: 'Tx Ledger'}, {id: 'consensus', label: 'Quorum'}, {id: 'settlement', label: 'Finality'}] },
      { id: 'sitemap', name: 'Global Sitemap', icon: MapIcon },
      { id: 'info', name: 'Hub Info', icon: Info, sections: [{id: 'about', label: 'About'}, {id: 'security', label: 'Security'}, {id: 'legal', label: 'Legal'}, {id: 'faq', label: 'FAQ'}] }
    ]
  },
  {
    category: 'Missions & Capital',
    items: [
      { id: 'contract_farming', name: 'Contract Farming', icon: Handshake, sections: [{id: 'browse', label: 'Missions'}, {id: 'deployments', label: 'Deployments'}] },
      { id: 'investor', name: 'Investor Portal', icon: Briefcase, sections: [{id: 'opportunities', label: 'Vetting'}, {id: 'portfolio', label: 'Portfolio'}, {id: 'analytics', label: 'Analytics'}] },
      { id: 'agrowild', name: 'Agrowild', icon: Binoculars, sections: [{id: 'conservancy', label: 'Protected Nodes'}, {id: 'tourism', label: 'Eco-Tourism'}] },
      { id: 'community', name: 'Steward Community', icon: Users, sections: [{id: 'shards', label: 'Social Shards'}, {id: 'lms', label: 'Knowledge Base'}] }
    ]
  },
  {
    category: 'Value & Production',
    items: [
      { id: 'agro_value_enhancement', name: 'Value Forge', icon: FlaskConical, sections: [{id: 'synthesis', label: 'Asset Synthesis'}, {id: 'optimization', label: 'Process Tuning'}] },
      { id: 'wallet', name: 'Treasury Node', icon: Wallet, sections: [{id: 'treasury', label: 'Utility'}, {id: 'staking', label: 'Staking'}, {id: 'swap', label: 'Swap'}] },
      { id: 'economy', name: 'Market Cloud', icon: Globe, sections: [{id: 'catalogue', label: 'Asset Ledger'}] },
      { id: 'vendor', name: 'Vendor Command', icon: Warehouse },
      { id: 'industrial', name: 'Industrial Cloud', icon: Factory, sections: [{id: 'facilities', label: 'Nodes'}, {id: 'workers', label: 'Talent'}] },
      { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers },
      { id: 'envirosagro_store', name: 'Official Org Store', icon: Store }
    ]
  },
  {
    category: 'Operations & Trace',
    items: [
      { id: 'online_garden', name: 'Online Garden', icon: Flower, sections: [{id: 'bridge', label: 'Telemetry Bridge'}, {id: 'shards', label: 'Shard Manager'}, {id: 'mining', label: 'Extraction'}] },
      { id: 'digital_mrv', name: 'Digital MRV', icon: Scan, sections: [{id: 'land_select', label: 'Geofence'}, {id: 'ingest', label: 'Evidence Ingest'}] },
      { id: 'ingest', name: 'Data Ingest', icon: Cable },
      { id: 'live_farming', name: 'Inflow Control', icon: Monitor, sections: [{id: 'lifecycle', label: 'Pipeline'}] },
      { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck, sections: [{id: 'orders', label: 'Shipments'}, {id: 'trace', label: 'Traceability'}] },
      { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake, sections: [{id: 'directory', label: 'Directory'}, {id: 'support', label: 'Support'}] },
      { id: 'circular', name: 'Circular Grid', icon: Recycle, sections: [{id: 'market', label: 'Refurbished Store'}] },
      { id: 'tools', name: 'Industrial Tools', icon: Wrench, sections: [{id: 'kanban', label: 'Kanban'}, {id: 'sigma', label: 'Six Sigma'}] }
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
    category: 'Network Governance',
    items: [
      { id: 'intranet', name: 'Intranet Hub', icon: ShieldPlus },
      { id: 'emergency_portal', name: 'Emergency Command', icon: Siren },
      { id: 'agro_regency', name: 'Agro Regency', icon: History },
      { id: 'code_of_laws', name: 'Code of Laws', icon: Scale },
      { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays },
      { id: 'chroma_system', name: 'Chroma-SEHTI', icon: Palette },
      { id: 'agrolang', name: 'AgroLang IDE', icon: Code2 },
      { id: 'research', name: 'Invention Ledger', icon: Zap },
      { id: 'registry_handshake', name: 'Node Handshake', icon: QrCode },
      { id: 'biotech_hub', name: 'Biotech Hub', icon: Dna },
      { id: 'permaculture_hub', name: 'Permaculture Hub', icon: Compass },
      { id: 'cea_portal', name: 'CEA Portal', icon: BoxSelect },
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 }
    ]
  }
];

const GlobalSearch: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (v: ViewState, section?: string) => void; vendorProducts: VendorProduct[] }> = ({ isOpen, onClose, onNavigate, vendorProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiDeepSuggestion, setAiDeepSuggestion] = useState<{ view: string; section?: string; explanation: string; stewardEsin?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchTerm('');
      setAiDeepSuggestion(null);
    }
  }, [isOpen]);

  const handleAiDeepQuery = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    setAiDeepSuggestion(null);
    
    try {
      const sitemapContext = REGISTRY_NODES.map(g => 
        `Group: ${g.category}\n${g.items.map(i => `- ${i.name} (id: ${i.id}): ${i.sections?.map(s => s.label).join(', ')}`).join('\n')}`
      ).join('\n\n');

      const socialContext = GLOBAL_STEWARD_REGISTRY.map(s => 
        `- Steward: ${s.name} (ESIN: ${s.esin}), Role: ${s.role}, Skills: ${s.skills.join(', ')}`
      ).join('\n');

      const ledgerContext = `
      - Media Shards: ${SEARCHABLE_MEDIA_LEDGER.map(m => m.title).join(', ')}
      - Missions: ${GLOBAL_PROJECTS_MISSIONS.map(m => m.name).join(', ')}
      - Experiences: ${AGROWILD_EXPERIENCES.map(e => e.title).join(', ')}
      - Logistics: ${LOGISTICS_SHARDS.map(l => l.name).join(', ')}
      - Community Exams/Modules: ${LMS_EXAMS_MODULES.map(e => e.title).join(', ')}
      - Market Products: ${vendorProducts.map(p => p.name).join(', ')}
      `;

      const prompt = `Act as the EnvirosAgro Navigation and Multi-Ledger Oracle. Based on the following sitemap, steward registry, and ledger indices, recommend EXACTLY ONE shard, section, or ledger entry that best answers the user's query.
      
      Registry Sitemap: ${sitemapContext}
      Social Steward Registry: ${socialContext}
      Industrial Ledgers Index: ${ledgerContext}
      
      User Query: "${searchTerm}"
      
      Return your answer in plain text with this EXACT format:
      REASON: [Why this is relevant in the context of EnvirosAgro's multi-ledger architecture]
      VIEW: [The shard id or portal name]
      SECTION: [The section id if applicable, otherwise 'all']
      STEWARD_ESIN: [If recommending a person, provide their ESIN here, otherwise omit]`;

      const res = await chatWithAgroExpert(prompt, []);
      const reason = res.text.match(/REASON:\s*(.*)/i)?.[1] || "Deep semantic match found in registry.";
      const view = res.text.match(/VIEW:\s*([a-z_0-9]+)/i)?.[1] || "dashboard";
      const section = res.text.match(/SECTION:\s*([a-z_0-9]+)/i)?.[1];
      const stewardEsin = res.text.match(/STEWARD_ESIN:\s*(EA-[A-Z0-9-]+)/i)?.[1];
      
      setAiDeepSuggestion({ view, section: section === 'all' ? undefined : section, explanation: reason, stewardEsin });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return { shards: [], stewards: [], assets: [], knowledge: [], infrastructure: [] };
    const term = searchTerm.toLowerCase();
    
    // 1. Sitemap Shards
    const shards: any[] = [];
    REGISTRY_NODES.forEach(group => {
      group.items.forEach(item => {
        if (item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term) || group.category.toLowerCase().includes(term)) {
          shards.push({ ...item, category: group.category, matchedSections: item.sections?.filter(s => s.label.toLowerCase().includes(term)) });
        }
      });
    });

    // 2. Stewards & Workers
    const stewards = GLOBAL_STEWARD_REGISTRY.filter(s => 
      s.name.toLowerCase().includes(term) || s.esin.toLowerCase().includes(term) || s.role.toLowerCase().includes(term) || s.skills.some(sk => sk.toLowerCase().includes(term))
    );

    // 3. Industrial Assets (Market + Circular)
    const assets = [
      ...vendorProducts.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)),
      ...AGROWILD_EXPERIENCES.filter(e => e.title.toLowerCase().includes(term) || e.desc.toLowerCase().includes(term))
    ];

    // 4. Knowledge & Media (PDFs, Exams, Reports)
    const knowledge = [
      ...SEARCHABLE_MEDIA_LEDGER.filter(m => m.title.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term) || m.source.toLowerCase().includes(term)),
      ...LMS_EXAMS_MODULES.filter(e => e.title.toLowerCase().includes(term) || e.category.toLowerCase().includes(term))
    ];

    // 5. Infrastructure & Missions (Logistics + Projects)
    const infrastructure = [
      ...LOGISTICS_SHARDS.filter(l => l.name.toLowerCase().includes(term)),
      ...GLOBAL_PROJECTS_MISSIONS.filter(m => m.name.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term))
    ];

    return { shards: shards.slice(0, 5), stewards: stewards.slice(0, 5), assets: assets.slice(0, 5), knowledge: knowledge.slice(0, 5), infrastructure: infrastructure.slice(0, 5) };
  }, [searchTerm, vendorProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-start justify-center p-4 pt-10 md:pt-20 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl glass-card rounded-[48px] border-2 border-emerald-500/30 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] flex flex-col h-[85vh]">
        <div className="p-8 md:p-10 border-b border-white/10 flex items-center gap-6 shrink-0">
          <Search className="w-8 h-8 text-emerald-400" />
          <input 
            ref={inputRef}
            type="text" 
            value={searchTerm} 
            onChange={e => { setSearchTerm(e.target.value); setAiDeepSuggestion(null); }}
            onKeyDown={e => e.key === 'Enter' && handleAiDeepQuery()}
            placeholder="Search Shards, PDFs, Stewards or Missions..."
            className="flex-1 bg-transparent border-none outline-none text-2xl md:text-3xl text-white placeholder:text-stone-900 font-bold italic"
          />
          <button onClick={handleAiDeepQuery} disabled={isAiSearching || !searchTerm.trim()} className="p-5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 rounded-3xl transition-all shadow-xl group">
             {isAiSearching ? <Loader2 className="animate-spin text-white w-8 h-8" /> : <Sparkles className="text-emerald-400 group-hover:text-white w-8 h-8" />}
          </button>
          <button onClick={onClose} className="p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-2xl"><X size={28} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-black/40 space-y-12">
           {aiDeepSuggestion && (
             <div className="p-8 md:p-10 bg-indigo-900/10 border-2 border-indigo-500/30 rounded-[48px] animate-in slide-in-from-top-4 duration-500 space-y-8 relative overflow-hidden group/sugg">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/sugg:rotate-12 transition-transform"><Bot size={120} className="text-indigo-400" /></div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl"><Sparkles size={24} className="text-white" /></div>
                   <h5 className="text-lg font-black text-indigo-400 uppercase tracking-widest italic">Multi-Ledger AI Match</h5>
                </div>
                <div className="space-y-6 border-l-4 border-indigo-600/40 pl-8 relative z-10">
                   <p className="text-slate-300 italic text-xl md:text-2xl leading-relaxed">{aiDeepSuggestion.explanation}</p>
                   <button 
                     onClick={() => { onNavigate(aiDeepSuggestion.view as ViewState, aiDeepSuggestion.section); onClose(); }}
                     className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3"
                   >
                      Navigate to {aiDeepSuggestion.view.toUpperCase()} Shard <ArrowRight size={16} />
                   </button>
                </div>
             </div>
           )}

           {searchTerm.trim() === '' ? (
             <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 space-y-8">
                <LucideIcons.Command size={100} className="text-slate-500 animate-float" />
                <div className="space-y-2">
                  <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">SEARCH_MATRIX</p>
                  <p className="text-sm font-bold uppercase tracking-widest italic text-slate-500">Query ledgers, media, stewards, or industrial logic</p>
                </div>
             </div>
           ) : (
             <div className="space-y-16">
                {/* 1. STEWARDS RESULTS */}
                {filteredResults.stewards.length > 0 && (
                   <div className="space-y-6">
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] px-4 border-b border-white/5 pb-4 italic">Social_Steward_Registry</p>
                      <div className="grid gap-4">
                         {filteredResults.stewards.map(steward => (
                            <div key={steward.esin} className="glass-card p-6 md:p-8 rounded-[40px] border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99]">
                               <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                                  <div className="relative shrink-0">
                                     <div className="w-20 h-20 rounded-[28px] overflow-hidden border-2 border-white/10 group-hover:border-indigo-500 transition-all shadow-xl">
                                        <img src={steward.avatar} className="w-full h-full object-cover" alt="" />
                                     </div>
                                     <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${steward.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{steward.name}</h4>
                                     <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">{steward.role} // {steward.esin}</p>
                                  </div>
                               </div>
                               <div className="flex gap-3 relative z-10 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 justify-center md:justify-end">
                                  <button onClick={() => { onNavigate('profile'); onClose(); }} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl" title="Profile View"><UserIcon size={20} /></button>
                                  <button className="p-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:text-white transition-all shadow-xl" title="Direct Message"><LucideIcons.MessageCircle size={20} /></button>
                                  <button onClick={() => { onNavigate('contract_farming'); onClose(); }} className="p-4 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 rounded-2xl text-emerald-400 hover:text-white transition-all shadow-xl" title="Initiate Contract"><LucideIcons.FileBadge size={20} /></button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* 2. KNOWLEDGE & MEDIA (PDFs, Exams) */}
                {filteredResults.knowledge.length > 0 && (
                   <div className="space-y-6">
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] px-4 border-b border-white/5 pb-4 italic">Knowledge_&_Media_Ledger</p>
                      <div className="grid gap-4">
                         {filteredResults.knowledge.map((item: any) => (
                            <div key={item.id} className="glass-card p-6 md:p-8 rounded-[40px] border-white/5 hover:border-blue-500/40 bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99]">
                               <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                  <div className="p-5 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:rotate-6 transition-all shadow-inner">
                                     <item.icon size={32} />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                     <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">{item.source || item.category} // {item.id}</p>
                                  </div>
                               </div>
                               <div className="flex gap-4 relative z-10 shrink-0">
                                  <button onClick={() => { onNavigate(item.reward ? 'community' : 'media_ledger'); onClose(); }} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                                     {item.type === 'PAPER' ? <Download size={16} /> : <Zap size={16} />} 
                                     {item.type === 'PAPER' ? 'Access PDF' : item.category === 'Vetting' ? 'Start Exam' : 'Enter Shard'}
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* 3. INDUSTRIAL ASSETS (Market, Agrowild) */}
                {filteredResults.assets.length > 0 && (
                   <div className="space-y-6">
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] px-4 border-b border-white/5 pb-4 italic">Industrial_Asset_Quorum</p>
                      <div className="grid gap-4">
                         {filteredResults.assets.map((item: any) => (
                            <div key={item.id} className="glass-card p-6 md:p-8 rounded-[40px] border-white/5 hover:border-emerald-500/40 bg-black/60 transition-all group flex flex-col items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99] md:flex-row">
                               <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                  <div className="w-20 h-20 rounded-[28px] overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-transform">
                                     <img src={item.thumb || item.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div className="space-y-1">
                                     <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-emerald-400 transition-colors">{item.name || item.title}</h4>
                                     <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">{item.price || item.cost} EAC // {item.id}</p>
                                  </div>
                               </div>
                               <button onClick={() => { onNavigate(item.node ? 'agrowild' : 'economy'); onClose(); }} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                                  <ShoppingCart size={16} /> Procure Asset Shard
                               </button>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* 4. SITEMAP NODES */}
                {filteredResults.shards.length > 0 && (
                   <div className="space-y-6">
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] px-4 border-b border-white/5 pb-4 italic">Registry_Shards</p>
                      <div className="grid gap-2">
                        {filteredResults.shards.map(res => (
                          <div key={res.id} className="w-full">
                            <button onClick={() => { onNavigate(res.id as ViewState); onClose(); }} className="w-full p-6 md:p-8 hover:bg-indigo-600/10 rounded-[32px] border-2 border-transparent hover:border-indigo-500/30 bg-black/20 flex items-center justify-between group transition-all">
                               <div className="flex items-center gap-8 text-left">
                                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-xl">
                                     <res.icon size={28} className="text-slate-400 group-hover:text-white" />
                                  </div>
                                  <div>
                                     <h4 className="text-2xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors m-0 tracking-tight">{res.name}</h4>
                                     <p className="text-[11px] text-slate-600 font-mono mt-2 uppercase tracking-widest font-black italic">{res.category}</p>
                                  </div>
                               </div>
                               <ArrowUpRight size={24} className="text-slate-800 group-hover:text-indigo-400 transition-all" />
                            </button>
                          </div>
                        ))}
                      </div>
                   </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [viewSection, setViewSection] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  
  // Vector History Tracking
  const [history, setHistory] = useState<{view: ViewState, section: string | null}[]>([]);
  const touchStartPos = useRef<number | null>(null);

  const [projects, setProjects] = useState<AgroProject[]>([]);
  const [contracts, setContracts] = useState<FarmingContract[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [transactions, setTransactions] = useState<AgroTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationShard[]>([]);
  const [mediaShards, setMediaShards] = useState<MediaShard[]>([]);
  const [signals, setSignals] = useState<SignalShard[]>([]);
  const [pulseMessage, setPulseMessage] = useState('Registry synchronized. No anomalies detected.');
  
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<any | null>(null);
  const [osInitialCode, setOsInitialCode] = useState<string | null>(null);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showZenithButton, setShowZenithButton] = useState(false);

  useEffect(() => {
    if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsGlobalSearchOpen(prev => !prev); }
      if (e.key === 'Escape') setIsGlobalSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollProgress((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100);
    setShowZenithButton(target.scrollTop > 400);
  };

  const scrollToTop = () => mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleResize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsSidebarOpen(isLg);
      if (isLg) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isVerified = fbUser.emailVerified || fbUser.providerData?.some(p => p.providerId === 'phone');
        if (isVerified) {
          const profile = await getStewardProfile(fbUser.uid);
          if (profile) setUser(profile);
        } else {
          setUser(null);
          if (view !== 'auth') setView('auth');
        }
      } else {
        setUser(null);
      }
    });
  }, [view]);

  useEffect(() => {
    const unsubProjects = listenToCollection('projects', setProjects);
    const unsubContracts = listenToCollection('contracts', setContracts);
    const unsubOrders = listenToCollection('orders', setOrders);
    const unsubProducts = listenToCollection('products', setVendorProducts);
    const unsubUnits = listenToCollection('industrial_units', setIndustrialUnits);
    const unsubLive = listenToCollection('live_products', setLiveProducts);
    const unsubTx = listenToCollection('transactions', setTransactions);
    const unsubSignals = listenToCollection('signals', setSignals);
    const unsubMedia = listenToCollection('media_ledger', setMediaShards);
    const unsubPulse = listenToPulse(setPulseMessage);

    return () => {
      unsubProjects(); unsubContracts(); unsubOrders(); unsubProducts();
      unsubUnits(); unsubLive(); unsubTx(); unsubSignals(); unsubPulse();
      unsubMedia();
    };
  }, [user]);

  const emitSignal = useCallback(async (signalData: Partial<SignalShard>) => {
    const signal = await dispatchNetworkSignal(signalData);
    if (signal) {
      const popupLayer = signal.dispatchLayers.find(l => l.channel === 'POPUP');
      if (popupLayer) {
        const id = Math.random().toString(36).substring(7);
        setNotifications(prev => [{
          id, type: signal.priority === 'critical' ? 'error' : signal.priority === 'high' ? 'warning' : 'info',
          title: signal.title, message: signal.message, duration: 6000,
          actionLabel: signal.actionLabel, actionIcon: signalData.actionIcon
        }, ...prev]);
      }
    }
  }, []);

  const handleSpendEAC = async (amount: number, reason: string): Promise<boolean> => {
    if (!user) { setView('auth'); return false; }
    if (user.wallet.balance < amount) {
      emitSignal({ title: 'INSUFFICIENT_FUNDS', message: `Need ${amount} EAC for ${reason}.`, priority: 'high', type: 'commerce', origin: 'MANUAL' });
      return false;
    }
    const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance - amount } };
    const syncOk = await syncUserToCloud(updatedUser);
    if (!syncOk) return false;
    setUser(updatedUser);
    const newTx: AgroTransaction = { id: `TX-${Date.now()}`, type: 'Transfer', farmId: user.esin, details: reason, value: -amount, unit: 'EAC' };
    await saveCollectionItem('transactions', newTx);
    emitSignal({ title: 'TREASURY_SETTLEMENT', message: `Node sharded ${amount} EAC for ${reason}.`, priority: 'medium', type: 'ledger_anchor', origin: 'TREASURY', actionIcon: 'Coins' });
    return true;
  };

  const handleEarnEAC = async (amount: number, reason: string) => {
    if (!user) return;
    const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance + amount, lifetimeEarned: (user.wallet.lifetimeEarned || 0) + amount } };
    const syncOk = await syncUserToCloud(updatedUser);
    if (!syncOk) return;
    setUser(updatedUser);
    const newTx: AgroTransaction = { id: `TX-${Date.now()}`, type: 'Reward', farmId: user.esin, details: reason, value: amount, unit: 'EAC' };
    await saveCollectionItem('transactions', newTx);
  };

  const handlePerformPermanentAction = async (actionKey: string, reward?: number, reason?: string) => {
    if (!user || user.completedActions?.includes(actionKey)) return false;
    const ok = await markPermanentAction(actionKey);
    if (ok && reward && reason) await handleEarnEAC(reward, reason);
    return ok;
  };

  const handleLogout = async () => { await signOutSteward(); setUser(null); setView('dashboard'); };
  
  const navigate = useCallback((v: ViewState, section?: string, pushToHistory = true) => {
    if (pushToHistory && v !== view) {
      setHistory(prev => [...prev, { view: view, section: viewSection }]);
    }
    setView(v);
    setViewSection(section || null);
    setIsMobileMenuOpen(false);
  }, [view, viewSection]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const lastVector = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      navigate(lastVector.view, lastVector.section || undefined, false);
      emitSignal({
        title: 'VECTOR_RETROGRADE',
        message: `Returning to ${lastVector.view.toUpperCase()} shard.`,
        priority: 'low',
        type: 'system',
        origin: 'MANUAL',
        actionIcon: 'ArrowLeft'
      });
    } else if (view !== 'dashboard') {
      navigate('dashboard', undefined, false);
    }
  }, [history, view, navigate, emitSignal]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartPos.current === null) return;
    const touchEndPos = e.changedTouches[0].clientX;
    const diff = touchStartPos.current - touchEndPos;
    // Swipe left = diff > threshold
    if (diff > 80) {
      goBack();
    }
    touchStartPos.current = null;
  };

  const renderView = () => {
    const currentUser = user || GUEST_STWD;
    const isGuest = !user;

    switch (view) {
      case 'auth': return <Login onLogin={(u) => { setUser(u); setView('dashboard'); }} />;
      case 'dashboard': return <Dashboard onNavigate={navigate} user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
      case 'sustainability': return <Sustainability user={currentUser} onNavigate={navigate} onMintEAT={handleEarnEAC} />;
      case 'economy': return <Economy user={currentUser} isGuest={isGuest} onSpendEAC={handleSpendEAC} onNavigate={navigate} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} projects={projects} notify={emitSignal} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={setUser!} initialSection={viewSection} />;
      case 'wallet': return <AgroWallet user={currentUser} isGuest={isGuest} onNavigate={navigate} onUpdateUser={setUser!} onSwap={async (eat) => { handleEarnEAC(0, 'SWAP_EAT'); return true; }} onEarnEAC={handleEarnEAC} notify={emitSignal} transactions={transactions} initialSection={viewSection} />;
      case 'intelligence': return <Intelligence user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onOpenEvidence={() => setIsEvidenceOpen(true)} initialSection={viewSection} />;
      case 'community': return <Community user={currentUser} isGuest={isGuest} onContribution={() => {}} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'explorer': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} />;
      case 'ecosystem': return <Ecosystem user={currentUser} onDeposit={handleEarnEAC} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'industrial': return <Industrial user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} industrialUnits={industrialUnits} notify={emitSignal} collectives={[]} setCollectives={() => {}} onSaveProject={(p) => saveCollectionItem('projects', p)} setIndustrialUnits={() => {}} initialSection={viewSection} />;
      case 'profile': return <UserProfile user={currentUser} isGuest={isGuest} onUpdate={setUser!} onNavigate={navigate} signals={signals} setSignals={setSignals} notify={emitSignal} onLogin={() => setView('auth')} onLogout={handleLogout} onPermanentAction={handlePerformPermanentAction} initialSection={viewSection} />;
      case 'channelling': return <Channelling user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'media': return <MediaHub user={currentUser} userBalance={currentUser.wallet.balance} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'crm': return <NexusCRM user={currentUser} onSpendEAC={handleSpendEAC} vendorProducts={vendorProducts} onNavigate={navigate} orders={orders} initialSection={viewSection} />;
      case 'tqm': return <TQMGrid user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} liveProducts={liveProducts} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'circular': return <CircularGrid user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} onNavigate={navigate} initialSection={viewSection} />;
      case 'tools': return <ToolsSection user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onOpenEvidence={(t) => { setActiveTaskForEvidence(t); setIsEvidenceOpen(true); }} tasks={[]} onSaveTask={(t) => saveCollectionItem('tasks', t)} notify={emitSignal} initialSection={viewSection} />;
      case 'research': return <ResearchInnovation user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'live_farming': return <LiveFarming user={currentUser} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={handleEarnEAC} onSaveProduct={(p) => saveCollectionItem('live_products', p)} onNavigate={navigate} notify={emitSignal} initialSection={viewSection} />;
      case 'contract_farming': return <ContractFarming user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} contracts={contracts} setContracts={setContracts} onSaveContract={(c) => saveCollectionItem('contracts', c)} />;
      case 'agrowild': return <Agrowild user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onPlaceOrder={(o) => saveCollectionItem('orders', o)} vendorProducts={vendorProducts} />;
      case 'investor': return <InvestorPortal user={currentUser} onUpdate={setUser!} onSpendEAC={handleSpendEAC} projects={projects} onNavigate={navigate} initialSection={viewSection} />;
      case 'impact': return <Impact user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'animal_world': return <NaturalResources user={currentUser} type="animal_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'plants_world': return <NaturalResources user={currentUser} type="plants_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'aqua_portal': return <NaturalResources user={currentUser} type="aqua_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'soil_portal': return <NaturalResources user={currentUser} type="soil_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'air_portal': return <NaturalResources user={currentUser} type="air_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'intranet': return <IntranetPortal user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'cea_portal': return <CEA user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'biotech_hub': return <Biotechnology user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'permaculture_hub': return <Permaculture user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'emergency_portal': return <EmergencyPortal user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'agro_regency': return <AgroRegency user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'code_of_laws': return <CodeOfLaws user={currentUser} />;
      /* Fixed: replaced currentTime with currentUser */
      case 'agro_calendar': return <AgroCalendar user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} onNavigate={navigate} />;
      case 'chroma_system': return <ChromaSystem user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'envirosagro_store': return <EnvirosAgroStore user={currentUser} onSpendEAC={handleSpendEAC} onPlaceOrder={(o) => saveCollectionItem('orders', o)} />;
      case 'agro_value_enhancement': return <AgroValueEnhancement user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} liveProducts={liveProducts} orders={orders} onNavigate={navigate} initialSection={viewSection} />;
      case 'digital_mrv': return <DigitalMRV user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onUpdateUser={setUser!} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'registry_handshake': return <RegistryHandshake user={currentUser} onUpdateUser={setUser!} onNavigate={navigate} />;
      case 'online_garden': return <OnlineGarden user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} notify={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} initialSection={viewSection} />;
      case 'farm_os': return <FarmOS user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} initialCode={osInitialCode} clearInitialCode={() => setOsInitialCode(null)} initialSection={viewSection} />;
      case 'network_signals': return <SignalCenter user={currentUser} signals={signals} setSignals={setSignals} onNavigate={navigate} initialSection={viewSection} />;
      case 'network': return <NetworkView />;
      case 'media_ledger': return <MediaLedger user={currentUser} shards={mediaShards} />;
      case 'agrolang': return <AgroLang user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onEmitSignal={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} initialSection={viewSection} />;
      case 'sitemap': return <Sitemap nodes={REGISTRY_NODES} onNavigate={navigate} />;
      case 'ai_analyst': return <AIAnalyst />;
      case 'vendor': return <VendorPortal user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} vendorProducts={vendorProducts} onRegisterProduct={(p) => { setVendorProducts(prev => [p, ...prev]); saveCollectionItem('products', p); }} initialSection={viewSection} />;
      case 'ingest': return <NetworkIngest user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'info': return <InfoPortal onNavigate={navigate} />;
      default: return <Dashboard onNavigate={navigate} user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
    }
  };

  if (isBooting) return <InitializationScreen onComplete={() => setIsBooting(false)} />;

  return (
    <div 
      className="min-h-screen bg-[#050706] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden animate-in fade-in duration-1000"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fixed top-0 left-0 right-0 z-[1000] h-8 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 h-full shrink-0">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">NETWORK_PULSE</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-[9px] text-emerald-500/80 font-mono font-black uppercase tracking-widest">
            {pulseMessage} • {new Date().toISOString()} • STABILITY: 1.42x • CONSENSUS: 100% • 
          </div>
        </div>
      </div>

      <div className={`fixed top-8 left-0 bottom-0 z-[250] bg-black/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'} ${isMobileMenuOpen ? 'w-80 translate-x-0' : ''}`}>
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
                <SycamoreLogo size={32} className="text-black" />
             </div>
             {(isSidebarOpen || isMobileMenuOpen) && (
               <div className="animate-in fade-in slide-in-from-left-2">
                 <h1 className="text-xl font-black text-white italic tracking-tighter leading-none">Enviros<span className="text-emerald-400">Agro</span></h1>
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Registry</p>
               </div>
             )}
           </div>
           {isMobileMenuOpen && <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white"><X size={20} /></button>}
        </div>

        <nav className="px-4 py-8 space-y-10">
           {REGISTRY_NODES.map((group) => (
             <div key={group.category} className="space-y-4">
                {(isSidebarOpen || isMobileMenuOpen) && <p className={`px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600`}>{group.category}</p>}
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button key={item.id} onClick={() => navigate(item.id as ViewState)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${view === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                      <item.icon size={18} className={view === item.id ? 'text-white' : 'text-slate-500'} />
                      {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[10px] font-bold uppercase tracking-widest text-left leading-none">{item.name}</span>}
                    </button>
                  ))}
                </div>
             </div>
           ))}
        </nav>
      </div>

      <main ref={mainContentRef} onScroll={handleScroll} className={`transition-all duration-500 pt-14 pb-32 h-screen overflow-y-auto custom-scrollbar relative ${isSidebarOpen ? 'lg:pl-80 pr-4 lg:pr-10' : 'lg:pl-24 pr-4 lg:pr-10'} pl-4`}>
        <div className="fixed top-8 left-0 right-0 z-[200] h-1 pointer-events-none">
          <div className="h-full bg-emerald-500 shadow-[0_0:15px_#10b981] transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%`, marginLeft: isSidebarOpen ? '20rem' : '5rem' }}></div>
        </div>

        <header className="flex justify-between items-center mb-8 sticky top-0 bg-[#050706]/90 backdrop-blur-xl py-4 z-[150] px-2 -mx-2 border-b border-white/5">
           <div className="flex items-center gap-4 overflow-hidden">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0">{isSidebarOpen ? <ChevronLeft size={20}/> : <Menu size={20}/>}</button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0"><Menu size={20}/></button>
              <div className="space-y-0.5 truncate max-w-[150px] sm:max-w-none">
                 <h2 className="text-base sm:text-xl font-black text-white uppercase italic tracking-tighter truncate leading-tight">{view.replace(/_/g, ' ')}</h2>
                 <p className="text-[7px] sm:text-[9px] text-slate-600 font-mono tracking-widest uppercase truncate">SYNC: {user ? 'ANCHORED' : 'OBSERVER'}</p>
              </div>
           </div>
           
           <div className="flex-1 max-w-md mx-6 hidden md:block">
              <button onClick={() => setIsGlobalSearchOpen(true)} className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-slate-500 hover:border-emerald-500/40 hover:bg-white/10 transition-all group shadow-inner">
                 <div className="flex items-center gap-3">
                    <Search size={16} className="group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Search Multi-Ledger Registry...</span>
                 </div>
                 <div className="flex items-center gap-1.5 opacity-40">
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono">⌘</span>
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono">K</span>
                 </div>
              </button>
           </div>

           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button onClick={() => setIsGlobalSearchOpen(true)} className="md:hidden p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><Search size={18} className="text-slate-400" /></button>
              {user && <button onClick={() => setView('wallet')} className="px-3 sm:px-4 py-2 sm:py-2.5 glass-card rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 hover:bg-emerald-500/10 transition-all group"><Coins size={14} className="text-emerald-400 group-hover:rotate-12 transition-transform" /><span className="text-[10px] sm:text-xs font-mono font-black text-white">{(user?.wallet.balance || 0).toFixed(0)}</span></button>}
              <button onClick={() => setView('profile')} className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl border-2 transition-all shadow-xl overflow-hidden ${user ? 'border-white/10 bg-slate-800' : 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'}`}>
                 {user ? (<><div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-white/20 bg-black/40">{user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon size={14} className="text-slate-500 m-auto mt-1 sm:mt-2" />}</div><span className="text-9px font-black text-white hidden sm:block truncate max-w-[80px]">{user.name.split(' ')[0]}</span></>) : (<><UserPlus size={16} className="text-emerald-400" /><span className="text-[9px] font-black uppercase text-emerald-400">Sync</span></>)}
              </button>
           </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          {renderView()}
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 pb-10 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500 px-4">
           <div className="flex items-center gap-4">
              <SycamoreLogo size={24} className="text-emerald-500" />
              <div className="text-left">
                 <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">Enviros<span className="text-emerald-400">Agro</span></p>
                 <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Planetary Regeneration Grid</p>
              </div>
           </div>
           
           <div className="flex flex-wrap justify-center gap-8">
              {[
                { id: 'dashboard', label: 'Command' },
                { id: 'wallet', label: 'Treasury' },
                { id: 'economy', label: 'Market' },
                { id: 'intelligence', label: 'Oracle' },
                { id: 'impact', label: 'Impact' },
                { id: 'sitemap', label: 'Matrix' },
                { id: 'info', label: 'Safety' }
              ].map(link => (
                <button 
                  key={link.id} 
                  onClick={() => navigate(link.id as ViewState)} 
                  className="text-[8px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-[0.3em] transition-colors"
                >
                  {link.label}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[7px] text-slate-700 font-mono uppercase font-black">ZK_SYSTEM_OK</span>
              </div>
              <p className="text-[8px] text-slate-700 font-mono uppercase tracking-widest">© 2025 EA_ROOT_NODE</p>
           </div>
        </footer>

        {showZenithButton && <button onClick={scrollToTop} className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 p-4 sm:p-5 agro-gradient rounded-2xl sm:rounded-3xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all z-[400] border-2 border-white/20 animate-in fade-in zoom-in duration-300"><LucideIcons.ArrowUp size={24} /></button>}
      </main>

      <div className="fixed top-24 right-4 sm:right-10 z-[500] space-y-4 max-w-[280px] sm:max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-3xl flex items-start gap-3 sm:gap-4 pointer-events-auto animate-in slide-in-from-right duration-500 ${n.type === 'error' ? 'bg-rose-950/80 border-rose-500/30 text-rose-500' : n.type === 'warning' ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' : 'bg-black/95 border-emerald-500/20 text-emerald-400'}`}>
            {n.type === 'error' ? <ShieldAlert className="shrink-0 mt-1" /> : <LucideIcons.Info className="shrink-0 mt-1" />}
            <div className="flex-1 space-y-1"><h5 className="text-[10px] font-black uppercase tracking-widest">{n.title}</h5><p className="text-[10px] italic text-slate-300 leading-tight">{n.message}</p></div>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-slate-500 hover:text-white"><X size={14}/></button>
          </div>
        ))}
      </div>

      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} onNavigate={navigate} vendorProducts={vendorProducts} />
      <EvidenceModal isOpen={isEvidenceOpen} onClose={() => setIsEvidenceOpen(false)} user={user || GUEST_STWD} onMinted={handleEarnEAC} onNavigate={navigate} taskToIngest={activeTaskForEvidence} />
      <LiveVoiceBridge isOpen={false} isGuest={!user} onClose={() => {}} />
      <FloatingConsultant user={user || GUEST_STWD} onNavigate={navigate} />
    </div>
  );
};

export default App;