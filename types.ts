
export interface LinkedProvider {
  id: string;
  type: 'Mobile' | 'Bank' | 'Web3' | 'Card';
  name: string;
  accountFragment: string;
  status: 'Active' | 'Pending' | 'Verification_Required';
  lastSync: string;
}

export interface User {
  name: string;
  email: string;
  esin: string; // EnvirosAgro Social Identification Number
  mnemonic: string; // 12-word recovery phrase
  regDate: string;
  avatar?: string;
  role: string;
  location: string;
  countryCode?: string;
  lineNumber?: string;
  isPhoneVerified?: boolean;
  wallet: EACWallet;
  metrics: SustainabilityMetrics;
  skills: Record<string, number>; // Maps category (e.g., 'Hydroponics') to points
  isReadyForHire: boolean;
  zodiacFlower?: {
    month: string;
    flower: string;
    color: string;
    hex?: string;
    pointsAdded: boolean;
  };
}

export interface EACWallet {
  balance: number; // EAC - "The Cash" (Utility)
  eatBalance: number; // EAT - "The Gold" (Equity/Asset)
  exchangeRate: number; // Personalized EAC -> EAT rate based on 'm'
  bonusBalance: number; // Non-withdrawable registration incentives
  tier: 'Seed' | 'Sprout' | 'Harvest';
  lifetimeEarned: number; // Used for "Reputation Score"
  linkedProviders: LinkedProvider[];
}

export interface SustainabilityMetrics {
  agriculturalCodeU: number; // C(a)
  timeConstantTau: number;  // m-constant
  sustainabilityScore: number;
  socialImmunity: number; // 0-100: Resistance to SID
  viralLoadSID: number;   // 0-100: Presence of Social Influenza
  baselineM: number; // Historical m-constant for Delta EAT calculation
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
  isAuthentic: boolean; // Result of Physical Audit
  auditStatus: 'Pending' | 'In-Progress' | 'Verified' | 'Rejected';
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
  capitalIngested: boolean; // Whether investor has released resources
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
  impactScore: number; // 0-100
  rating: number; // 1-5
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
  collectiveId?: string; // Optional: Project led by a social collective
  description: string;
  thrust: 'Societal' | 'Environmental' | 'Human' | 'Technological' | 'Industry';
  status: 'Ideation' | 'Verification' | 'Funding' | 'Execution' | 'Closure';
  totalCapital: number;
  fundedAmount: number;
  batchesClaimed: number;
  totalBatches: number;
  progress: number; // 0-100
  roiEstimate: number; // Percentage
  collateralLocked: number;
  profitsAccrued: number; // Total EAC profits generated by project
  investorShareRatio: number; // Percentage (e.g. 0.15 for 15%)
  performanceIndex: number; // 0-100 based on collective feedback
  memberCount: number; // Number of collective members backing the project
  isPreAudited: boolean; // New: Physical Audit before public listing
  isPostAudited: boolean; // New: Physical Audit after capital requisition
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
  unit: 'EAC' | 'EAT' | 'CO2e' | 'kg' | 'pH' | 'USD' | 'KES' | 'ETH';
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
  | 'agro_value_enhancement';
