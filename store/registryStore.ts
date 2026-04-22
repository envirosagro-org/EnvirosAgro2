import { create } from 'zustand';
import { 
  FarmingContract, Order, VendorProduct, RegisteredUnit, 
  LiveAgroProduct, HoodConnection, MediaShard, Task, 
  ValueBlueprint, Proposal, Vote, CarbonCredit 
} from '../types';

interface RegistryStore {
  contracts: FarmingContract[];
  setContracts: (contracts: FarmingContract[]) => void;
  
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  
  vendorProducts: VendorProduct[];
  setVendorProducts: (products: VendorProduct[]) => void;
  
  industrialUnits: RegisteredUnit[];
  setIndustrialUnits: (units: RegisteredUnit[]) => void;
  
  liveProducts: LiveAgroProduct[];
  setLiveProducts: (products: LiveAgroProduct[]) => void;
  
  hoodConnections: HoodConnection[];
  setHoodConnections: (connections: HoodConnection[]) => void;
  
  mediaShards: MediaShard[];
  setMediaShards: (shards: MediaShard[]) => void;
  
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  
  blueprints: ValueBlueprint[];
  setBlueprints: (blueprints: ValueBlueprint[]) => void;
  
  proposals: Proposal[];
  setProposals: (proposals: Proposal[]) => void;
  
  votes: Vote[];
  setVotes: (votes: Vote[]) => void;
  
  carbonCredits: CarbonCredit[];
  setCarbonCredits: (credits: CarbonCredit[]) => void;
  listCredit: (id: string, price: number) => void;
  buyCredit: (id: string, buyerEsin: string) => void;
  mintCredit: (credit: CarbonCredit) => void;
}

export const useRegistryStore = create<RegistryStore>((set) => ({
  contracts: [],
  setContracts: (contracts) => set({ contracts }),
  
  orders: [],
  setOrders: (orders) => set({ orders }),
  
  vendorProducts: [],
  setVendorProducts: (vendorProducts) => set({ vendorProducts }),
  
  industrialUnits: [],
  setIndustrialUnits: (industrialUnits) => set({ industrialUnits }),
  
  liveProducts: [],
  setLiveProducts: (liveProducts) => set({ liveProducts }),
  
  hoodConnections: [],
  setHoodConnections: (hoodConnections) => set({ hoodConnections }),
  
  mediaShards: [],
  setMediaShards: (mediaShards) => set({ mediaShards }),
  
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  
  blueprints: [],
  setBlueprints: (blueprints) => set({ blueprints }),
  
  proposals: [],
  setProposals: (proposals) => set({ proposals }),
  
  votes: [],
  setVotes: (votes) => set({ votes }),
  
  carbonCredits: [],
  setCarbonCredits: (carbonCredits) => set({ carbonCredits }),
  listCredit: (id, price) => set((state) => ({
    carbonCredits: state.carbonCredits.map(c => 
      c.id === id ? { ...c, listedPrice: price, listingStatus: 'LISTED' } : c
    )
  })),
  buyCredit: (id, buyerEsin) => set((state) => ({
    carbonCredits: state.carbonCredits.map(c => 
      c.id === id ? { ...c, stewardEsin: buyerEsin, listingStatus: 'SOLD' } : c
    )
  })),
  mintCredit: (credit) => set((state) => ({
    carbonCredits: [credit, ...state.carbonCredits]
  })),
}));
