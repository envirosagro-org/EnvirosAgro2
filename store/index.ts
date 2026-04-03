import { create } from 'zustand';
import { User, ViewState, AgroTransaction, AgroProject, ShardCostCalibration, SignalShard, RegistryGroup, RegistryItem, AgroBlock, StewardPosition, Election, Proposal } from '../types';
import { REGISTRY_NODES } from '../constants/registry';

const findMatrixIndex = (v: ViewState, section: string | null): string | undefined => {
  let index: string | undefined;
  REGISTRY_NODES.forEach((group: RegistryGroup, dIdx: number) => {
    group.items.forEach((item: RegistryItem, eIdx: number) => {
      if (item.id === v) {
        if (!section) {
          index = `[${dIdx + 1}.${eIdx + 1}]`;
        } else {
          const sIdx = item.sections?.findIndex((s: {id: string}) => s.id === section);
          if (sIdx !== undefined && sIdx !== -1) {
            index = `[${dIdx + 1}.${eIdx + 1}.${sIdx + 1}]`;
          }
        }
      }
    });
  });
  return index;
};

export interface RegistrationState {
  step: number;
  data: {
    name?: string;
    email?: string;
    password?: string;
    farmName?: string;
    farmSize?: string;
    mainCrop?: string;
    location?: string;
  };
}

interface AppState {
  registrationState: RegistrationState | null;
  setRegistrationState: (state: RegistrationState | null) => void;
  updateRegistrationData: (data: Partial<RegistrationState['data']>) => void;
  nextRegistrationStep: () => void;
  prevRegistrationStep: () => void;

  vendorRegistrationState: any | null;
  setVendorRegistrationState: (state: any | null) => void;

  handshakeRegistrationState: any | null;
  setHandshakeRegistrationState: (state: any | null) => void;

  missionRegistrationState: any | null;
  setMissionRegistrationState: (state: any | null) => void;

  liveFarmingRegistrationState: any | null;
  setLiveFarmingRegistrationState: (state: any | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: User) => void;
  
  view: ViewState;
  setView: (view: ViewState) => void;
  
  viewSection: string | null;
  setViewSection: (section: string | null) => void;
  
  navigate: (v: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
  goBack: () => void;
  goForward: () => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (isOpen: boolean) => void;
  
  isInboxOpen: boolean;
  setIsInboxOpen: (isOpen: boolean) => void;
  
  signals: SignalShard[];
  setSignals: (signals: SignalShard[]) => void;
  markSignalAsRead: (id: string) => void;
  emitSignal: (sig: Omit<SignalShard, 'id' | 'timestamp' | 'read'>) => void;
  
  transactions: AgroTransaction[];
  setTransactions: (transactions: AgroTransaction[]) => void;
  
  projects: AgroProject[];
  setProjects: (projects: AgroProject[]) => void;
  
  mempool: any[];
  setMempool: (mempool: any[]) => void;

  blockchain: AgroBlock[];
  setBlockchain: (blocks: AgroBlock[]) => void;
  
  costAudit: ShardCostCalibration | null;
  setCostAudit: (audit: ShardCostCalibration | null) => void;

  stewardPositions: StewardPosition[];
  setStewardPositions: (positions: StewardPosition[]) => void;

  elections: Election[];
  setElections: (elections: Election[]) => void;
  applyForElection: (electionId: string, stewardEsin: string, stewardName: string, manifesto: string) => void;
  voteInElection: (electionId: string, candidateId: string, stewardEsin: string) => void;

  proposals: Proposal[];
  setProposals: (proposals: Proposal[]) => void;
  createProposal: (proposal: Proposal) => void;
  updateProposalStatus: (proposalId: string, status: Proposal['status']) => void;

  multimediaParams: { prompt?: string; type?: string; autoGenerate?: boolean } | null;
  setMultimediaParams: (params: { prompt?: string; type?: string; autoGenerate?: boolean } | null) => void;

  generateShareUrl: (v?: ViewState, section?: string | null, id?: string | null) => string;

  // Ecosystem Synchronization State
  ecosystemState: {
    p1: number;
    p2: number;
    p3: number;
    isAnchored: boolean;
  };
  updateEcosystemState: (state: Partial<AppState['ecosystemState']>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  registrationState: null,
  setRegistrationState: (state) => set({ registrationState: state }),
  updateRegistrationData: (data) => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      data: { ...state.registrationState.data, ...data }
    } : { step: 1, data }
  })),
  nextRegistrationStep: () => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      step: state.registrationState.step + 1
    } : null
  })),
  prevRegistrationStep: () => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      step: Math.max(1, state.registrationState.step - 1)
    } : null
  })),

  vendorRegistrationState: null,
  setVendorRegistrationState: (state) => set({ vendorRegistrationState: state }),

  handshakeRegistrationState: null,
  setHandshakeRegistrationState: (state) => set({ handshakeRegistrationState: state }),

  missionRegistrationState: null,
  setMissionRegistrationState: (state) => set({ missionRegistrationState: state }),

  liveFarmingRegistrationState: null,
  setLiveFarmingRegistrationState: (state) => set({ liveFarmingRegistrationState: state }),

  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updatedUser) => set({ user: updatedUser }),
  
  view: 'dashboard',
  setView: (view) => set({ view }),
  
  viewSection: null,
  setViewSection: (section) => set({ viewSection: section }),
  
  navigate: (v, section, pushToHistory = true, params = null) => {
    const state = get();
    const index = findMatrixIndex(v, section || null);
    
    if (pushToHistory) {
      // Sync URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('view', v);
      if (section) {
        newUrl.searchParams.set('section', section);
      } else {
        newUrl.searchParams.delete('section');
      }
      if (params?.id) {
        newUrl.searchParams.set('id', params.id);
      } else {
        newUrl.searchParams.delete('id');
      }
      window.history.pushState({ view: v, section, params }, '', newUrl.toString());
    } else {
      // Sync URL without pushing to history
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('view', v);
      if (section) {
        newUrl.searchParams.set('section', section);
      } else {
        newUrl.searchParams.delete('section');
      }
      if (params?.id) {
        newUrl.searchParams.set('id', params.id);
      } else {
        newUrl.searchParams.delete('id');
      }
      window.history.replaceState({ view: v, section, params }, '', newUrl.toString());
    }
    
    set({
      view: v,
      viewSection: section || null,
      multimediaParams: v === 'multimedia_generator' ? params : state.multimediaParams,
      isMobileMenuOpen: false,
      isInboxOpen: false,
      isGlobalSearchOpen: false
    });

    if (window.innerWidth < 1024) {
      set({ isSidebarOpen: false });
    }
    
    state.emitSignal({
      title: 'VECTOR_SHIFT',
      message: `Resolved route to ${index || v.toUpperCase()}.`,
      priority: 'low',
      type: 'system',
      origin: 'ORACLE',
      actionIcon: 'ChevronRight',
      dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
    });
  },
  
  goBack: () => {
    window.history.back();
  },
  
  goForward: () => {
    window.history.forward();
  },
  
  isSidebarOpen: true,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  isGlobalSearchOpen: false,
  setIsGlobalSearchOpen: (isOpen) => set({ isGlobalSearchOpen: isOpen }),
  
  isInboxOpen: false,
  setIsInboxOpen: (isOpen) => set({ isInboxOpen: isOpen }),
  
  signals: [],
  setSignals: (signals) => set({ signals }),
  markSignalAsRead: (id) => set((state) => ({
    signals: state.signals.map(s => s.id === id ? { ...s, read: true } : s)
  })),
  emitSignal: (sig) => {
    const newSig: SignalShard = {
      ...sig,
      id: `SIG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    set((state) => ({
      signals: [newSig, ...state.signals].slice(0, 50)
    }));
  },
  
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  
  projects: [],
  setProjects: (projects) => set({ projects }),

  mempool: [],
  setMempool: (mempool) => set({ mempool }),

  blockchain: [],
  setBlockchain: (blockchain) => set({ blockchain }),
  
  costAudit: null,
  setCostAudit: (audit) => set({ costAudit: audit }),

  stewardPositions: [],
  setStewardPositions: (positions) => set({ stewardPositions: positions }),

  elections: [],
  setElections: (elections) => set({ elections }),
  applyForElection: (electionId, stewardEsin, stewardName, manifesto) => set((state) => ({
    elections: state.elections.map(e => e.id === electionId ? {
      ...e,
      candidates: [...e.candidates, { id: `CAND-${Date.now()}`, stewardEsin, stewardName, manifesto, votes: 0, reputation: 0, contributions: [], skills: [] }]
    } : e)
  })),
  voteInElection: (electionId, candidateId, stewardEsin) => set((state) => ({
    elections: state.elections.map(e => e.id === electionId ? {
      ...e,
      candidates: e.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
    } : e)
  })),

  proposals: [],
  setProposals: (proposals) => set({ proposals }),
  createProposal: (proposal) => set((state) => ({ proposals: [...state.proposals, proposal] })),
  updateProposalStatus: (proposalId, status) => set((state) => ({
    proposals: state.proposals.map(p => p.id === proposalId ? { ...p, status } : p)
  })),

  multimediaParams: null,
  setMultimediaParams: (params) => set({ multimediaParams: params }),
  
  generateShareUrl: (v, section, id) => {
    const state = get();
    const view = v || state.view;
    const sec = section !== undefined ? section : state.viewSection;
    
    const url = new URL(window.location.origin);
    url.searchParams.set('view', view);
    if (sec) url.searchParams.set('section', sec);
    if (id) url.searchParams.set('id', id);
    
    return url.toString();
  },

  ecosystemState: {
    p1: 1.2,
    p2: 8.5,
    p3: 0.5,
    isAnchored: false,
  },
  updateEcosystemState: (newState) => set((state) => ({
    ecosystemState: { ...state.ecosystemState, ...newState }
  })),
}));
