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
  uid: string;
  createdAt: string;
  name: string;
  email: string;
  esin: string;
  mnemonic: string;
  regDate: string;
  avatar?: string;
  role: string;
  location: string;
  countryCode?: string;
  lineNumber?: string;
  isPhoneVerified?: boolean;
  isGuest?: boolean; // New: Flag for internal/offline users
  wallet: EACWallet;
  metrics: SustainabilityMetrics;
  skills: Record<string, number>;
  isReadyForHire: boolean;
  zodiacFlower?: {
    month: string;
    flower: string;
    color: string;
    hex?: string;
    pointsAdded: boolean;
  };
  resources?: AgroResource[];
}

export interface EACWallet {
<<<<<<< HEAD
  balance: number; // EAC - "The Cash" (Utility)
  eatBalance: number; // EAT - "The Gold" (Equity/Asset)
  stakedEat?: number; // EAT currently locked for yield
  exchangeRate: number; // Personalized EAC -> EAT rate based on 'm'
  bonusBalance: number; // Non-withdrawable registration incentives
=======
  balance: number;
  eatBalance: number;
  exchangeRate: number;
  bonusBalance: number;
>>>>>>> aa13def (update)
  tier: 'Seed' | 'Sprout' | 'Harvest';
  lifetimeEarned: number;
  linkedProviders: LinkedProvider[];
  lastSyncDate?: string;
  miningStreak?: number;
  pendingSocialHarvest?: number;
  resonanceDrift?: number; // Real-time fluctuation of m-constant stability
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
  thrust: 'Societal' | 'Environmental' | 'Human' | 'Technological' | 'Industry';
  supplierEsin: string;
  supplierName: string;
  supplierType: 'REVERSE_RETURN' | 'RAW_MATERIALS' | 'FINISHED_PRODUCTS' | 'SERVICE_PROVIDER';
  status: 'PROVISIONAL' | 'AWAITING_AUDIT' | 'AUTHORIZED' | 'REVOKED';
  image?: string;
  timestamp: string;
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
  logisticsNode?: string;
  supplierEsin: string;
  customerEsin: string;
  logisticProviderId?: string;
  logisticCost?: number;
  timestamp: string;
  trackingHash: string;
  isReceiptIssued: boolean;
  isPrnSigned: boolean;
  receiptUrl?: string;
  sourceTab: 'market' | 'circular' | 'store' | 'agrowild';
}

export interface LogisticProvider {
  id: string;
  name: string;
  mResonance: number;
  sustainabilityScore: number;
  costEAC: number;
  speed: string;
  status: 'ACTIVE' | 'IDLE';
}

export interface RegisteredUnit {
  id: string;
  type: 'LOGISTICS' | 'WAREHOUSING' | 'MANUFACTURING' | 'TRANSFORMATION';
  name: string;
  location: string;
  capacity: string;
  status: 'ACTIVE' | 'AUDITING' | 'IDLE';
  efficiency: number;
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
  image?: string;
  isAuthentic: boolean;
  auditStatus: 'Pending' | 'In-Progress' | 'Verified' | 'Rejected';
  tasks?: string[];
  telemetryNodes?: string[];
}

export interface FarmingContract {
  id: string;
  investorEsin: string;
  investorName: string;
  productType: string;
  requiredLand: string;
  requiredLabour: string;
  budget: number;
  status: 'Open' | 'Auditing' | 'Active' | 'Settled';
  applications: ContractApplication[];
  capitalIngested: boolean;
}

export interface ContractApplication {
  id: string;
  farmerEsin: string;
  farmerName: string;
  landResources: string;
  labourCapacity: string;
  auditStatus: 'Pending' | 'Field_Inspection' | 'Physically_Verified' | 'Rejected';
  paymentEscrowed: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  authorEsin: string;
  abstract: string;
  content: string;
  thrust: string;
  status: 'Draft' | 'Peer-Review' | 'Registered' | 'Invention';
  impactScore: number;
  rating: number;
  eacRewards: number;
  timestamp: string;
  iotDataUsed?: boolean;
  externalDataHashes?: string[];
}

export interface WorkerProfile {
  id: string;
  name: string;
  skills: string[];
  sustainabilityRating: number;
  verifiedHours: number;
  isOpenToWork: boolean;
  lifetimeEAC: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  thrust: string;
  esinSign: string;
}

export interface AgroProject {
  id: string;
  name: string;
  adminEsin: string;
  collectiveId?: string;
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

export type ViewState = 
  | 'dashboard' 
  | 'wallet' 
  | 'sustainability' 
  | 'economy' 
  | 'industrial' 
  | 'intelligence' 
  | 'community' 
  | 'explorer' 
  | 'ecosystem' 
  | 'media' 
  | 'info' 
  | 'profile' 
  | 'investor' 
  | 'vendor' 
  | 'ingest' 
  | 'tools' 
  | 'channelling' 
  | 'circular' 
  | 'crm' 
  | 'tqm' 
  | 'research' 
  | 'live_farming' 
  | 'contract_farming' 
  | 'agrowild' 
  | 'impact'
  | 'animal_world'
  | 'plants_world'
  | 'aqua_portal'
  | 'soil_portal'
  | 'air_portal'
  | 'intranet'
  | 'cea_portal'
  | 'biotech_hub'
  | 'permaculture_hub'
  | 'emergency_portal'
  | 'agro_regency'
  | 'code_of_laws'
  | 'agro_calendar'
  | 'chroma_system'
  | 'envirosagro_store'
  | 'agro_value_enhancement'
  | 'digital_mrv'
  | 'registry_handshake'
  | 'online_garden'
  | 'farm_os'
  | 'network';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationShard {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}