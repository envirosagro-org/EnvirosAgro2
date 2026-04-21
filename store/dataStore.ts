import { create } from 'zustand';
import { AgroTransaction, AgroProject, SignalShard, AgroBlock, StewardPosition, Election, Proposal } from '../types';

export interface EcosystemState {
  p1: number;
  p2: number;
  p3: number;
  isAnchored: boolean;
}

interface DataStore {
  signals: SignalShard[];
  setSignals: (signals: SignalShard[]) => void;
  markSignalAsRead: (id: string) => void;
  dispatchSignal: (sig: Omit<SignalShard, 'id' | 'timestamp' | 'read'>) => void;

  transactions: AgroTransaction[];
  setTransactions: (transactions: AgroTransaction[]) => void;

  projects: AgroProject[];
  setProjects: (projects: AgroProject[]) => void;

  mempool: any[];
  setMempool: (mempool: any[]) => void;

  blockchain: AgroBlock[];
  setBlockchain: (blocks: AgroBlock[]) => void;

  costAudit: any | null;
  setCostAudit: (audit: any | null) => void;

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

  ecosystemState: EcosystemState;
  updateEcosystemState: (state: Partial<EcosystemState>) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  signals: [],
  setSignals: (signals) => set({ signals }),
  markSignalAsRead: (id) => set((state) => ({
    signals: state.signals.map(s => s.id === id ? { ...s, read: true } : s)
  })),
  dispatchSignal: (sig) => {
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
  setCostAudit: (costAudit) => set({ costAudit }),

  stewardPositions: [],
  setStewardPositions: (stewardPositions) => set({ stewardPositions }),

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
