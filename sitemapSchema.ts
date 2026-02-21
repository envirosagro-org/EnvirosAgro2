
import { 
  LayoutDashboard, ShoppingCart, Wallet, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, Factory, Monitor, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2, Signal as SignalIcon, Target,
  Truck, Layers, Map as MapIcon, Compass as CompassIcon, Server, Workflow, ShieldPlus, ChevronLeftCircle, ArrowLeft,
  ChevronRight, ArrowUp, UserCheck, BookOpen, Stamp, Binoculars, Command, Bot, Wand2, Brain, ArrowRight, Home,
  Building, ShieldX, ScanLine,
  MapPin,
  Download,
  FileDigit,
  Music,
  GraduationCap,
  ArrowUpRight,
  ShoppingBag,
  Sparkle,
  Mail,
  BellRing,
  Settings,
  CheckCircle2,
  Video,
  Clock,
  SearchCode,
  LayoutGrid,
  Calculator,
  Lock,
  Network,
  SmartphoneNfc
} from 'lucide-react';
import { ViewState } from './types';

export interface SitemapNode {
  id: ViewState;
  name: string;
  icon: any;
  path: string;
  category: string;
  vector: string;
  url: string;
  sections?: { id: string; label: string; vector: string; url: string }[];
}

export const SITEMAP_SCHEMA: SitemapNode[] = [
  { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard, path: '/dashboard', category: 'Command & Strategy', vector: '[1.1]', url: 'https://envirosagro.org/dashboard', sections: [{id: 'metrics', label: 'Node Metrics', vector: '[1.1.1]', url: 'https://envirosagro.org/dashboard/metrics'}, {id: 'oracle', label: 'Oracle Hub', vector: '[1.1.2]', url: 'https://envirosagro.org/dashboard/oracle'}, {id: 'path', label: 'Strategic Path', vector: '[1.1.3]', url: 'https://envirosagro.org/dashboard/path'}] },
  { id: 'ai_analyst', name: 'Neural Analyst', icon: Brain, path: '/ai-analyst', category: 'Command & Strategy', vector: '[1.2]', url: 'https://envirosagro.org/ai_analyst' },
  { id: 'settings', name: 'System Settings', icon: Settings, path: '/settings', category: 'Command & Strategy', vector: '[1.3]', url: 'https://envirosagro.org/settings', sections: [{id: 'display', label: 'UI Display', vector: '[1.3.1]', url: 'https://envirosagro.org/settings/display'}, {id: 'privacy', label: 'Security Shards', vector: '[1.3.2]', url: 'https://envirosagro.org/settings/privacy'}] },
  { id: 'profile', name: 'Steward Profile', icon: UserIcon, path: '/profile', category: 'Command & Strategy', vector: '[1.4]', url: 'https://envirosagro.org/profile', sections: [{id: 'dossier', label: 'Personal Registry', vector: '[1.4.1]', url: 'https://envirosagro.org/profile/dossier'}, {id: 'card', label: 'Identity Shard', vector: '[1.4.2]', url: 'https://envirosagro.org/profile/card'}, {id: 'celestial', label: 'Birth Resonance', vector: '[1.4.3]', url: 'https://envirosagro.org/profile/celestial'}] },
  { id: 'network_signals', name: 'Signal Terminal', icon: SignalIcon, path: '/network-signals', category: 'Command & Strategy', vector: '[1.5]', url: 'https://envirosagro.org/network_signals', sections: [{id: 'terminal', label: 'Inbound Feed', vector: '[1.5.1]', url: 'https://envirosagro.org/network_signals/terminal'}, {id: 'ledger', label: 'Signal History', vector: '[1.5.2]', url: 'https://envirosagro.org/network_signals/ledger'}] },
  { id: 'farm_os', name: 'Farm OS', icon: Binary, path: '/farm-os', category: 'Command & Strategy', vector: '[1.7]', url: 'https://envirosagro.org/farm_os', sections: [{id: 'kernel', label: 'Kernel Stack', vector: '[1.7.1]', url: 'https://envirosagro.org/farm_os/kernel'}, {id: 'hardware', label: 'Hardware Monitor', vector: '[1.7.2]', url: 'https://envirosagro.org/farm_os/hardware'}, {id: 'shell', label: 'System Shell', vector: '[1.7.3]', url: 'https://envirosagro.org/farm_os/shell'}] },
  { id: 'impact', name: 'Network Impact', icon: TrendingUp, path: '/impact', category: 'Command & Strategy', vector: '[1.8]', url: 'https://envirosagro.org/impact', sections: [{id: 'whole', label: 'Vitality', vector: '[1.8.1]', url: 'https://envirosagro.org/impact/whole'}, {id: 'carbon', label: 'Carbon Ledger', vector: '[1.8.2]', url: 'https://envirosagro.org/impact/carbon'}, {id: 'thrusts', label: 'Resonance', vector: '[1.8.3]', url: 'https://envirosagro.org/impact/thrusts'}] },
  { id: 'intelligence', name: 'Science Oracle', icon: Microscope, path: '/intelligence', category: 'Command & Strategy', vector: '[1.10]', url: 'https://envirosagro.org/intelligence', sections: [{id: 'twin', label: 'Digital Twin', vector: '[1.10.1]', url: 'https://envirosagro.org/intelligence/twin'}, {id: 'simulator', label: 'EOS Physics', vector: '[1.10.2]', url: 'https://envirosagro.org/intelligence/simulator'}, {id: 'eos_ai', label: 'Expert Oracle', vector: '[1.10.6]', url: 'https://envirosagro.org/intelligence/eos_ai'}] },
  { id: 'explorer', name: 'Registry Explorer', icon: Database, path: '/explorer', category: 'Command & Strategy', vector: '[1.11]', url: 'https://envirosagro.org/explorer' },
  { id: 'sitemap', name: 'Registry Matrix', icon: MapIcon, path: '/sitemap', category: 'Command & Strategy', vector: '[1.12]', url: 'https://envirosagro.org/sitemap' },
  { id: 'info', name: 'Hub Info', icon: Info, path: '/info', category: 'Command & Strategy', vector: '[1.13]', url: 'https://envirosagro.org/info' },
  { id: 'contract_farming', name: 'Contract Farming', icon: Handshake, path: '/contract-farming', category: 'Missions & Capital', vector: '[2.1]', url: 'https://envirosagro.org/contract_farming', sections: [{id: 'browse', label: 'Missions', vector: '[2.1.1]', url: 'https://envirosagro.org/contract_farming/browse'}, {id: 'deployments', label: 'Deployments', vector: '[2.1.2]', url: 'https://envirosagro.org/contract_farming/deployments'}] },
  { id: 'investor', name: 'Investor Portal', icon: Briefcase, path: '/investor', category: 'Missions & Capital', vector: '[2.2]', url: 'https://envirosagro.org/investor', sections: [{id: 'opportunities', label: 'Vetting', vector: '[2.2.1]', url: 'https://envirosagro.org/investor/opportunities'}, {id: 'portfolio', label: 'Portfolio', vector: '[2.2.2]', url: 'https://envirosagro.org/investor/portfolio'}] },
  { id: 'agrowild', name: 'Agrowild', icon: Binoculars, path: '/agrowild', category: 'Missions & Capital', vector: '[2.3]', url: 'https://envirosagro.org/agrowild', sections: [{id: 'conservancy', label: 'Protected Nodes', vector: '[2.3.1]', url: 'https://envirosagro.org/agrowild/conservancy'}, {id: 'tourism', label: 'Eco-Tourism', vector: '[2.3.2]', url: 'https://envirosagro.org/agrowild/tourism'}] },
  { id: 'community', name: 'Steward Community', icon: Users, path: '/community', category: 'Missions & Capital', vector: '[2.4]', url: 'https://envirosagro.org/community', sections: [{id: 'social', label: 'Social Mesh', vector: '[2.4.1]', url: 'https://envirosagro.org/community/social'}, {id: 'lms', label: 'Knowledge Base', vector: '[2.4.3]', url: 'https://envirosagro.org/community/lms'}] },
  { id: 'industrial', name: 'Industrial Cloud', icon: Factory, path: '/industrial', category: 'Value & Production', vector: '[3.1]', url: 'https://envirosagro.org/industrial', sections: [{id: 'bridge', label: 'Registry Bridge', vector: '[3.1.1]', url: 'https://envirosagro.org/industrial/bridge'}, {id: 'sync', label: 'Process Sync', vector: '[3.1.2]', url: 'https://envirosagro.org/industrial/sync'}] },
  { id: 'agro_value_enhancement', name: 'Value Forge', icon: FlaskConical, path: '/value-forge', category: 'Value & Production', vector: '[3.2]', url: 'https://envirosagro.org/agro_value_enhancement', sections: [{id: 'synthesis', label: 'Asset Synthesis', vector: '[3.2.1]', url: 'https://envirosagro.org/agro_value_enhancement/synthesis'}] },
  { id: 'wallet', name: 'Treasury Node', icon: Wallet, path: '/wallet', category: 'Value & Production', vector: '[3.3]', url: 'https://envirosagro.org/wallet', sections: [{id: 'treasury', label: 'Utility', vector: '[3.3.1]', url: 'https://envirosagro.org/wallet/treasury'}, {id: 'staking', label: 'Staking', vector: '[3.3.2]', url: 'https://envirosagro.org/wallet/staking'}] },
  { id: 'economy', name: 'Market Center', icon: Globe, path: '/economy', category: 'Value & Production', vector: '[3.4]', url: 'https://envirosagro.org/economy', sections: [{id: 'catalogue', label: 'Registry Assets', vector: '[3.4.1]', url: 'https://envirosagro.org/economy/catalogue'}] },
  { id: 'vendor', name: 'Vendor Command', icon: Warehouse, path: '/vendor', category: 'Value & Production', vector: '[3.5]', url: 'https://envirosagro.org/vendor' },
  { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers, path: '/ecosystem', category: 'Value & Production', vector: '[3.6]', url: 'https://envirosagro.org/ecosystem' },
  { id: 'online_garden', name: 'Online Garden', icon: Flower, path: '/online-garden', category: 'Operations & Trace', vector: '[4.1]', url: 'https://envirosagro.org/online_garden', sections: [{id: 'bridge', label: 'Telemetry Bridge', vector: '[4.1.1]', url: 'https://envirosagro.org/online_garden/bridge'}, {id: 'mining', label: 'Extraction', vector: '[4.1.3]', url: 'https://envirosagro.org/online_garden/mining'}] },
  { id: 'digital_mrv', name: 'Digital MRV', icon: Scan, path: '/mrv', category: 'Operations & Trace', vector: '[4.2]', url: 'https://envirosagro.org/digital_mrv', sections: [{id: 'land_select', label: 'Geofence', vector: '[4.2.1]', url: 'https://envirosagro.org/digital_mrv/land_select'}, {id: 'ingest', label: 'Evidence Ingest', vector: '[4.2.2]', url: 'https://envirosagro.org/digital_mrv/ingest'}] },
  { id: 'ingest', name: 'Data Ingest', icon: Cable, path: '/ingest', category: 'Operations & Trace', vector: '[4.3]', url: 'https://envirosagro.org/ingest' },
  { id: 'live_farming', name: 'Inflow Control', icon: Monitor, path: '/live-farming', category: 'Operations & Trace', vector: '[4.4]', url: 'https://envirosagro.org/live_farming' },
  { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck, path: '/tqm', category: 'Operations & Trace', vector: '[4.5]', url: 'https://envirosagro.org/tqm', sections: [{id: 'orders', label: 'Shipments', vector: '[4.5.1]', url: 'https://envirosagro.org/tqm/orders'}, {id: 'trace', label: 'Traceability', vector: '[4.5.2]', url: 'https://envirosagro.org/tqm/trace'}] },
  { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake, path: '/crm', category: 'Operations & Trace', vector: '[4.6]', url: 'https://envirosagro.org/crm' },
  { id: 'circular', name: 'Circular Grid', icon: Recycle, path: '/circular', category: 'Operations & Trace', vector: '[4.7]', url: 'https://envirosagro.org/circular' },
  { id: 'tools', name: 'Industrial Tools', icon: Wrench, path: '/tools', category: 'Operations & Trace', vector: '[4.8]', url: 'https://envirosagro.org/tools' },
  { id: 'robot', name: 'Swarm Command', icon: Bot, path: '/robot', category: 'Operations & Trace', vector: '[4.9]', url: 'https://envirosagro.org/robot' },
  { id: 'animal_world', name: 'Animal World', icon: PawPrint, path: '/natural-resources/animals', category: 'Natural Resources', vector: '[5.1]', url: 'https://envirosagro.org/animal_world' },
  { id: 'plants_world', name: 'Plants World', icon: TreePine, path: '/natural-resources/plants', category: 'Natural Resources', vector: '[5.2]', url: 'https://envirosagro.org/plants_world' },
  { id: 'aqua_portal', name: 'Aqua Portal', icon: Droplets, path: '/natural-resources/aqua', category: 'Natural Resources', vector: '[5.3]', url: 'https://envirosagro.org/aqua_portal' },
  { id: 'soil_portal', name: 'Soil Portal', icon: Mountain, path: '/natural-resources/soil', category: 'Natural Resources', vector: '[5.4]', url: 'https://envirosagro.org/soil_portal' },
  { id: 'air_portal', name: 'Air Portal', icon: Wind, path: '/natural-resources/air', category: 'Natural Resources', vector: '[5.5]', url: 'https://envirosagro.org/air_portal' },
  { id: 'intranet', name: 'Intranet Hub', icon: ShieldPlus, path: '/intranet', category: 'Network Governance', vector: '[6.1]', url: 'https://envirosagro.org/intranet' },
  { id: 'emergency_portal', name: 'Emergency Command', icon: Siren, path: '/emergency', category: 'Network Governance', vector: '[6.2]', url: 'https://envirosagro.org/emergency_portal' },
  { id: 'agro_regency', name: 'Agro Regency', icon: History, path: '/regency', category: 'Network Governance', vector: '[6.3]', url: 'https://envirosagro.org/agro_regency' },
  { id: 'code_of_laws', name: 'Code of Laws', icon: Scale, path: '/laws', category: 'Network Governance', vector: '[6.4]', url: 'https://envirosagro.org/code_of_laws' },
  { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays, path: '/calendar', category: 'Network Governance', vector: '[6.5]', url: 'https://envirosagro.org/agro_calendar' },
  { id: 'chroma_system', name: 'Chroma-SEHTI', icon: Palette, path: '/chroma', category: 'Network Governance', vector: '[6.6]', url: 'https://envirosagro.org/chroma_system' },
  { id: 'agrolang', name: 'AgroLang IDE', icon: Code2, path: '/agrolang', category: 'Network Governance', vector: '[6.7]', url: 'https://envirosagro.org/agrolang' },
  { id: 'research', name: 'Invention Ledger', icon: Zap, path: '/research', category: 'Network Governance', vector: '[6.8]', url: 'https://envirosagro.org/research' },
  { id: 'registry_handshake', name: 'Node Handshake', icon: SmartphoneNfc, path: '/handshake', category: 'Network Governance', vector: '[6.9]', url: 'https://envirosagro.org/registry_handshake' },
  { id: 'biotech_hub', name: 'Biotech Hub', icon: Dna, path: '/biotech', category: 'Network Governance', vector: '[6.10]', url: 'https://envirosagro.org/biotech_hub' },
  { id: 'media_ledger', name: 'Media Ledger', icon: FileStack, path: '/media-ledger', category: 'Network Governance', vector: '[6.13]', url: 'https://envirosagro.org/media_ledger' },
  { id: 'media', name: 'Media Hub', icon: Tv, path: '/media', category: 'Network Governance', vector: '[6.14]', url: 'https://envirosagro.org/media' }
];
