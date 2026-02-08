
export interface LinkedProvider {
  id: string;
  type: 'Mobile' | 'Bank' | 'Web3' | 'Card' | 'PayPal' | 'Visa' | 'Mastercard';
  name: string;
  accountFragment: string;
  status: 'Active' | 'Pending' | 'Verification_Required';
  lastSync: string;
}

export interface VerificationMeta {
  method: 'QR_SCAN' | 'NFC_TAP' | 'GEO_LOCK' | 'DOC_INGEST' | 'IOT_HANDSHAKE';
  verifiedAt: string;
  deviceSecretHash?: string;
  geoPolygon?: [number, number][];
  coordinates?: { lat: number; lng: number };
  proofDocumentUrl?: string;
  confidenceScore?: number;
}

export interface AgroResource {
  id: string;
  category: 'HARDWARE' | 'LAND' | 'INFRASTRUCTURE';
  type: string;
  name: string;
  status: 'PROVISIONAL' | 'VERIFIED' | 'REVOKED';
  capabilities: string[];
  verificationMeta: VerificationMeta;
}

export interface User {
  name: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Not Specified';
  esin: string;
  mnemonic: string;
  regDate: string;
  avatar?: string;
  bio?: string;
  role: string;
  location: string;
  wallet: EACWallet;
  metrics: SustainabilityMetrics;
  skills: Record<string, number>;
  isReadyForHire: boolean;
  completedActions?: string[]; // Permanent, non-repeatable backend actions
  settings?: {
    notificationsEnabled: boolean;
    privacyMode: 'Public' | 'Private' | 'Consensus_Only';
    autoSync: boolean;
    biometricLogin: boolean;
    theme: 'Dark' | 'High_Resonance';
  };
  resources?: AgroResource[];
  zodiacFlower?: {
    month: string;
    flower: string;
    color: string;
    hex: string;
    pointsAdded: boolean;
  };
}

export interface EACWallet {
  balance: number;
  eatBalance: number;
  stakedEat?: number;
  exchangeRate: number;
  bonusBalance: number;
  tier: 'Seed' | 'Sprout' | 'Harvest';
  lifetimeEarned: number;
  linkedProviders: LinkedProvider[];
  lastSyncDate?: string;
  miningStreak?: number;
  pendingSocialHarvest?: number;
}

export interface SustainabilityMetrics {
  agriculturalCodeU: number;
  timeConstantTau: number;
  sustainabilityScore: number;
  socialImmunity: number;
  viralLoadSID: number;
  baselineM: number;
}

export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'Seed' | 'Input' | 'Tool' | 'Technology' | 'Logistics' | 'Produce' | 'Service';
  supplierEsin: string;
  supplierName: string;
  supplierType: 'REVERSE_RETURN' | 'RAW_MATERIALS' | 'FINISHED_PRODUCTS' | 'SERVICE_PROVIDER';
  status: 'PROVISIONAL' | 'AWAITING_AUDIT' | 'AUTHORIZED' | 'REVOKED';
  image?: string;
  timestamp: string;
  thrust?: string;
}

export type OrderStatus = 
  | 'ORD_PLACED' 
  | 'AVAILABILITY_VERIFIED'
  | 'ORD_VERIFIED' 
  | 'PAYMENT_HELD' 
  | 'LOGISTICS_PEND' 
  | 'DISPATCHED' 
  | 'DELIVERED' 
  | 'COMPLETED';

export interface Order {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  itemImage?: string;
  cost: number;
  status: OrderStatus;
  supplierEsin: string;
  customerEsin: string;
  timestamp: string;
  trackingHash: string;
  sourceTab: 'market' | 'circular' | 'store' | 'agrowild';
  logisticsNode?: string;
  logisticProviderId?: string;
  logisticCost?: number;
  isReceiptIssued?: boolean;
  isPrnSigned?: boolean;
}

export interface AgroProject {
  id: string;
  name: string;
  adminEsin: string;
  description: string;
  thrust: 'Societal' | 'Environmental' | 'Human' | 'Technological' | 'Industry';
  status: 'Ideation' | 'Verification' | 'Funding' | 'Execution' | 'Closure';
  totalCapital: number;
  fundedAmount: number;
  batchesClaimed: number;
  totalBatches: number;
  progress: number;
  roiEstimate: number;
  collateralLocked: number;
  profitsAccrued: number;
  investorShareRatio: number;
  performanceIndex: number;
  memberCount: number;
  isPreAudited: boolean;
  isPostAudited: boolean;
}

export interface AgroBlock {
  hash: string;
  prevHash: string;
  timestamp: string;
  transactions: AgroTransaction[];
  validator: string;
  status: 'Confirmed' | 'Pending' | 'Mining';
}

export interface AgroTransaction {
  id: string;
  type: 'Harvest' | 'Audit' | 'Transfer' | 'CarbonMint' | 'ReactionMining' | 'MarketTrade' | 'EvidenceUpload' | 'Reward' | 'Burn' | 'Recycle' | 'Dividend' | 'TokenzMint' | 'NodeSwap' | 'Gateway_Deposit' | 'Gateway_Withdrawal';
  farmId: string;
  details: string;
  value: number;
  unit: 'EAC' | 'EAT' | 'CO2e' | 'kg' | 'pH' | 'USD' | 'KES' | 'ETH' | 'm';
}

export interface MediaShard {
  id: string;
  title: string;
  type: 'VIDEO' | 'AUDIO' | 'PAPER' | 'ORACLE' | 'POST' | 'INGEST';
  source: string;
  author: string;
  authorEsin: string;
  timestamp: string;
  hash: string;
  mImpact: string;
  size: string;
  thumb?: string;
  content?: string;
  downloadUrl?: string;
}

export type ViewState = 
  | 'dashboard' | 'wallet' | 'sustainability' | 'economy' | 'industrial' 
  | 'intelligence' | 'community' | 'explorer' | 'ecosystem' | 'media' 
  | 'info' | 'profile' | 'investor' | 'vendor' | 'ingest' | 'tools' 
  | 'channelling' | 'circular' | 'crm' | 'tqm' | 'research' 
  | 'live_farming' | 'contract_farming' | 'agrowild' | 'impact'
  | 'animal_world' | 'plants_world' | 'aqua_portal' | 'soil_portal' | 'air_portal'
  | 'intranet' | 'cea_portal' | 'biotech_hub' | 'permaculture_hub' | 'emergency_portal'
  | 'agro_regency' | 'code_of_laws' | 'agro_calendar' | 'chroma_system'
  | 'envirosagro_store' | 'agro_value_enhancement' | 'digital_mrv' | 'registry_handshake'
  | 'online_garden' | 'farm_os' | 'network_signals' | 'media_ledger' | 'agrolang'
  | 'network' | 'sitemap' | 'auth';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface DispatchChannel {
  channel: 'EMAIL' | 'PHONE' | 'INBOX' | 'POPUP';
  status: 'PENDING' | 'SENT' | 'FAILED' | 'READ';
  timestamp?: string;
}

export interface SignalShard {
  id: string;
  type: 'system' | 'engagement' | 'network' | 'commerce' | 'pulse' | 'task' | 'liturgical' | 'ledger_anchor';
  origin: 'MANUAL' | 'CALENDAR' | 'ORACLE' | 'EXTERNAL' | 'TREASURY' | 'CARBON' | 'TRACE';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  actionIcon?: string; // Stored as a string name for the DB
  aiRemark?: string;
  dispatchLayers: DispatchChannel[];
  meta?: {
    target?: ViewState;
    payload?: any;
    ledgerContext?: 'TREASURY' | 'CARBON' | 'REVENUE' | 'RESOLUTION' | 'INVENTION' | 'SOCIAL';
  };
}

export interface FarmingContract {
  id: string;
  investorEsin: string;
  investorName: string;
  productType: string;
  requiredLand: string;
  requiredLabour: string;
  budget: number;
  status: 'Open' | 'Closed' | 'In_Progress';
  applications: ContractApplication[];
  capitalIngested: boolean;
}

export interface ContractApplication {
  id: string;
  farmerEsin: string;
  farmerName: string;
  landResources: string;
  labourCapacity: string;
  auditStatus: 'Pending' | 'Verified' | 'Rejected';
  paymentEscrowed: number;
}

export interface RegisteredUnit {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'ACTIVE' | 'AUDITING' | 'INACTIVE';
}

export interface LiveAgroProduct {
  id: string;
  stewardEsin: string;
  stewardName: string;
  productType: string;
  category: 'Produce' | 'Manufactured' | 'Input';
  stage: 'Inception' | 'Processing' | 'Quality_Audit' | 'Finalization' | 'Market_Ready';
  progress: number;
  votes: number;
  location: string;
  timestamp: string;
  lastUpdate: string;
  isAuthentic: boolean;
  auditStatus: string;
  tasks?: string[];
  telemetryNodes?: string[];
}

export interface NotificationShard {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  actionIcon?: any;
}

export interface WorkerProfile {
  id: string;
  name: string;
  esin: string;
  skills: string[];
  sustainabilityRating: number;
  verifiedHours: number;
  isOpenToWork: boolean;
  lifetimeEAC: number;
  efficiency: number;
  avatar: string;
  location: string;
}

export interface LogisticProvider {
  id: string;
  name: string;
  mResonance: number;
  sustainabilityScore: number;
  costEAC: number;
  speed: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  authorEsin: string;
  abstract: string;
  content: string;
  thrust: string;
  status: string;
  impactScore: number;
  rating: number;
  eacRewards: number;
  timestamp: string;
  iotDataUsed: boolean;
}
