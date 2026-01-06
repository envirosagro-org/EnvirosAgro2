
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
}

export interface EACWallet {
  balance: number;
  tier: 'Seed' | 'Sprout' | 'Harvest';
  lifetimeEarned: number; // Used for "Reputation Score"
}

export interface SustainabilityMetrics {
  agriculturalCodeU: number; 
  timeConstantTau: number;  
  sustainabilityScore: number;
  socialImmunity: number; // 0-100: Resistance to SID
  viralLoadSID: number;   // 0-100: Presence of Social Influenza
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
  progress: number; // 0-100
  roiEstimate: number; // Percentage
  collateralLocked: number;
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
  type: 'Harvest' | 'Audit' | 'Transfer' | 'CarbonMint' | 'ReactionMining' | 'MarketTrade' | 'EvidenceUpload' | 'Reward' | 'Burn';
  farmId: string;
  details: string;
  value: number;
  unit: string;
}

export type ViewState = 'dashboard' | 'wallet' | 'sustainability' | 'economy' | 'industrial' | 'intelligence' | 'community' | 'explorer' | 'ecosystem' | 'media' | 'info' | 'profile' | 'investor' | 'vendor' | 'ingest' | 'tools' | 'channelling';
