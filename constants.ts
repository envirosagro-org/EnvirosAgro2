
import { BadgeCheck, Binary, Binoculars, BoxSelect, Brain, Briefcase, CalendarDays, ClipboardCheck, Clapperboard, Compass, Cpu, Database, Dna, Droplets, Factory, FileDigit, FileStack, FileText, FlaskConical, Flower, Globe, GraduationCap, Handshake, HeartHandshake, History, Info, Layers, LayoutDashboard, Leaf, LifeBuoy, Map as MapIcon, Microscope, Monitor, Mountain, Music, Network, Palette, PawPrint, Recycle, Scale, Scan, Settings, Share2, ShieldPlus, ShoppingBag, Siren, SmartphoneNfc, Store, Terminal, TrendingUp, TreePine, Tv, Users, Wallet, Warehouse, Wheat, Wind, Wrench, Zap } from 'lucide-react';
import { RegistryGroup } from './types';

export const BOOT_LOGS = [
  "INITIALIZING RECAPTCHA APP_CHECK...",
  "ESTABLISHING SECURITY HANDSHAKE...",
  "MAPPING_GEOFENCE_SHARDS [OK]",
  "CALIBRATING_M_CONSTANT_BASE [1.42]",
  "SYNCING_L3_INDUSTRIAL_LEDGER...",
  "ZK_PROOF_ENGINE_BOOT [SUCCESS]",
  "ESTABLISHING_ORACLE_HANDSHAKE...",
  "SEHTI_THRUST_ALIGNED",
  "DATA_CONNECT_L3_SYNC_ACTIVE",
  "NODE_SYNC_FINALIZED"
];

export const GLOBAL_STEWARD_REGISTRY = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', role: 'Soil Expert', location: 'Nairobi, Kenya', res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', online: true, skills: ['Bantu Soil Sharding', 'Drought Mitigation'] },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', role: 'Genetics Analyst', location: 'Omaha, USA', res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', online: false, skills: ['DNA Sequencing', 'Aura Ingest'] },
  { esin: 'EA-ROBO-9214', name: 'Dr. Orion Bot', role: 'Automation Engineer', location: 'Tokyo Hub', res: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', online: true, skills: ['Agroboto Control', 'Mesh Stability'] },
  { esin: 'EA-LILY-0042', name: 'Aesthetic Rose', role: 'Botanical Architect', location: 'Valencia Shard', res: 99, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', online: true, skills: ['Lilies Design', 'Chroma Calibration'] },
];

export const SEARCHABLE_MEDIA_LEDGER = [
  { id: 'MED-COF-01', title: 'Coffee Soil Micronutrient Sharding', type: 'PAPER', source: 'AgroInPDF', desc: 'Technical PDF on high-altitude coffee soil remediation.', icon: FileDigit },
  { id: 'MED-COF-02', title: 'Bantu Coffee Lineage Heritage', type: 'VIDEO', source: 'Cinema Shard', desc: 'Ingest log of ancestral coffee preservation.', icon: Clapperboard },
  { id: 'MED-WAV-03', title: 'Sonic Soil Repair (432Hz)', type: 'AUDIO', source: 'Acoustic Registry', desc: 'Bio-electric frequency for cellular repair.', icon: Music },
  { id: 'MED-RES-04', title: 'Carbon Sequestration Metrics v6', type: 'PAPER', source: 'Research Hub', desc: 'Whitepaper on EOS carbon minting logic.', icon: FileText },
];

export const GLOBAL_PROJECTS_MISSIONS = [
  { id: 'MIS-882', name: 'Nairobi Ingest Hub Expansion', budget: '1.2M EAC', thrust: 'Industry', desc: 'Expansion of regional logistics nodes.' },
  { id: 'MIS-104', name: 'Carbon Vault Audit mission', budget: '450K EAC', thrust: 'Environmental', desc: 'Verified physical audit of bio-char plots.' },
];

export const ITEM_CATEGORY_EXPERIENCES = [
  { id: 'EXP-SAF-01', title: 'Spectral Birding Safari', cost: '150 EAC', node: 'Node_Nairobi_04', desc: 'Multi-spectral binocular tour of wetlands.' },
  { id: 'EXP-WAL-02', title: 'Bantu Botanical Walk', cost: '50 EAC', node: 'Node_Paris_82', desc: 'Lineage forest walk with heritage stewards.' },
];

export const LOGISTICS_SHARDS = [
  { id: 'LOG-RAI-01', name: 'Eco-Rail Electric Shard', speed: '48h', cost: '120 EAC', status: 'Active' },
  { id: 'LOG-DRO-02', name: 'Solar Drone Relay', speed: '6h', cost: '450 EAC', status: 'Active' },
];

export const LMS_EXAMS_MODULES = [
  { id: 'EXM-882', title: 'EOS Framework Master Exam', reward: '500 EAC', category: 'Vetting', icon: BadgeCheck },
  { id: 'MOD-104', title: 'm-Constant Resilience Theory', reward: '150 EAC', category: 'Technical', icon: GraduationCap },
];

export const RECOMMENDED_SEARCHES = [
  { label: 'Market Cloud', icon: Globe, query: 'economy' },
  { label: 'Carbon Credits', icon: Wind, query: 'carbon' },
  { label: 'Steward Alpha', icon: Users, query: 'Steward Alpha' },
  { label: 'Soil Analysis', icon: Microscope, query: 'soil' },
  { label: 'Agro OS Kernel', icon: Binary, query: 'farm_os' },
  { label: 'Bantu Seeds', icon: TreePine, query: 'bantu' },
  { label: 'Registry Map', icon: MapIcon, query: 'sitemap' },
];

export const REGISTRY_NODES: RegistryGroup[] = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard, sections: [{id: 'metrics', label: 'Node Metrics'}, {id: 'oracle', label: 'Oracle Hub'}, {id: 'path', label: 'Strategic Path'}] },
      { id: 'mesh_protocol', name: 'Mesh Protocol', icon: Network, sections: [{id: 'topology', label: 'Network Topology'}, {id: 'commits', label: 'Block Shards'}, {id: 'mempool', label: 'Inbound Mempool'}] },
      { id: 'sustainability', name: 'Sustainability Shard', icon: Leaf },
      { id: 'ai_analyst', name: 'Neural Analyst', icon: Brain },
      { id: 'settings', name: 'System Settings', icon: Settings, sections: [{id: 'display', label: 'UI Display'}, {id: 'privacy', label: 'Security Shards'}] },
      { id: 'profile', name: 'Steward Profile', icon: Users, sections: [{id: 'dossier', label: 'Personal Registry'}, {id: 'card', label: 'Identity Shard'}, {id: 'celestial', label: 'Birth Resonance'}] },
      { id: 'explorer', name: 'Monitoring Hub', icon: Database, sections: [{id: 'terminal', label: 'Signal Terminal'}, {id: 'blocks', label: 'Blocks'}, {id: 'ledger', label: 'Tx Ledger'}, {id: 'consensus', label: 'Quorum'}, {id: 'settlement', label: 'Finality'}] },
      { id: 'farm_os', name: 'Farm OS', icon: Binary, sections: [{id: 'kernel', label: 'Kernel Stack'}, {id: 'ide', label: 'AgroLang IDE'}, {id: 'shell', label: 'System Shell'}] },
      { id: 'impact', name: 'Network Impact', icon: TrendingUp, sections: [{id: 'whole', label: 'Vitality'}, {id: 'carbon', label: 'Carbon Ledger'}, {id: 'thrusts', label: 'Resonance'}] },
      { id: 'intelligence', name: 'Science Oracle', icon: Microscope, sections: [{id: 'twin', label: 'Digital Twin'}, {id: 'simulator', label: 'EOS Physics'}, {id: 'eos_ai', label: 'Expert Oracle'}] },
      { id: 'sitemap', name: 'Registry Matrix', icon: MapIcon },
      { id: 'info', name: 'Hub Info', icon: Info, sections: [{id: 'about', label: 'About'}, {id: 'security', label: 'Security'}, {id: 'legal', label: 'Legal'}, {id: 'faq', label: 'FAQ'}] }
    ]
  },
  {
    category: 'Missions & Capital',
    items: [
      { id: 'contract_farming', name: 'Contract Farming', icon: Handshake, sections: [{id: 'browse', label: 'Missions'}, {id: 'deployments', label: 'Deployments'}] },
      { id: 'investor', name: 'Investor Portal', icon: Briefcase, sections: [{id: 'opportunities', label: 'Vetting'}, {id: 'portfolio', label: 'Portfolio'}, {id: 'analytics', label: 'Analytics'}] },
      { id: 'agrowild', name: 'Agrowild', icon: Binoculars, sections: [{id: 'conservancy', label: 'Protected Nodes'}, {id: 'tourism', label: 'Eco-Tourism'}] },
      { id: 'community', name: 'Steward Community', icon: Users, sections: [{id: 'social', label: 'Social Mesh'}, {id: 'shards', label: 'Social Shards'}, {id: 'lms', label: 'Knowledge Base'}] }
    ]
  },
  {
    category: 'Value & Production',
    items: [
      { id: 'industrial', name: 'Industrial Cloud', icon: Factory, sections: [{id: 'bridge', label: 'Registry Bridge'}, {id: 'sync', label: 'Process Sync'}, {id: 'path', label: 'Analyzer'}] },
      { id: 'agro_value_enhancement', name: 'Value Forge', icon: FlaskConical, sections: [{id: 'synthesis', label: 'Asset Synthesis'}, {id: 'optimization', label: 'Process Tuning'}] },
      { id: 'wallet', name: 'Agro Wallet Hub', icon: Wallet, sections: [{id: 'treasury', label: 'Utility'}, {id: 'calibrations', label: 'Cost Calibration'}, {id: 'staking', label: 'Staking'}, {id: 'swap', label: 'Swap'}] },
      { id: 'economy', name: 'Market Center', icon: Globe, sections: [{id: 'catalogue', label: 'Registry Assets'}, {id: 'infrastructure', label: 'Industrial Nodes'}, {id: 'forecasting', label: 'Demand Matrix'}] },
      { id: 'vendor', name: 'Vendor Command', icon: Warehouse },
      { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers },
      { id: 'envirosagro_store', name: 'Official Org Store', icon: Store }
    ]
  },
  {
    category: 'Operations & Trace',
    items: [
      { id: 'online_garden', name: 'Online Garden', icon: Flower, sections: [{id: 'bridge', label: 'Telemetry Bridge'}, {id: 'shards', label: 'Shard Manager'}, {id: 'mining', label: 'Extraction'}] },
      { id: 'digital_mrv', name: 'Digital MRV', icon: Scan, sections: [{id: 'land_select', label: 'Geofence'}, {id: 'ingest', label: 'Evidence Ingest'}] },
      { id: 'ingest', name: 'Data Inflow Hub', icon: LifeBuoy, sections: [{id: 'handshake', label: 'Node Pairing'}, {id: 'streams', label: 'Registry Keys'}, {id: 'vault', label: 'Evidence Vault'}] },
      { id: 'live_farming', name: 'Inflow Control', icon: Monitor, sections: [{id: 'lifecycle', label: 'Pipeline'}] },
      { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck, sections: [{id: 'orders', label: 'Shipments'}, {id: 'trace', label: 'Traceability'}] },
      { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake, sections: [{id: 'directory', label: 'Directory'}, {id: 'support', label: 'Support'}] },
      { id: 'circular', name: 'Circular Grid', icon: Recycle, sections: [{id: 'market', label: 'Refurbished Store'}] },
      { id: 'tools', name: 'Industrial Tools', icon: Wrench, sections: [{id: 'kanban', label: 'Kanban'}, {id: 'sigma', label: 'Six Sigma'}] },
      { id: 'robot', name: 'Swarm Command', icon: Wheat, sections: [{id: 'registry', label: 'Fleet Registry'}, {id: 'security', label: 'Intranet Security'}] },
      { id: 'node_manager', name: 'Node Manager', icon: Cpu, sections: [{id: 'overview', label: 'Node Overview'}] },

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
      { id: 'research', name: 'Invention Ledger', icon: Zap },
      { id: 'biotech_hub', name: 'Biotech Hub', icon: Dna },
      { id: 'permaculture_hub', name: 'Permaculture Hub', icon: Compass },
      { id: 'cea_portal', name: 'CEA Portal', icon: BoxSelect },
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
      { id: 'registry_handshake', name: 'Registry Handshake', icon: SmartphoneNfc }
    ]
  }
];
