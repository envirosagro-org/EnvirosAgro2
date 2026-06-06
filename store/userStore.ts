import { create } from 'zustand';
import { User } from '../types';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: User) => void;
}

const sanitizeUser = (user: User | null): User | null => {
  if (!user) return null;
  return {
    ...user,
    name: user.name || 'Unnamed Steward',
    email: user.email || '',
    esin: user.esin || 'EA-GUEST-VOID-NODE',
    mnemonic: user.mnemonic || 'none',
    regDate: user.regDate || new Date().toISOString(),
    role: user.role || 'STEWARD',
    location: user.location || 'Pending Calibration',
    isReadyForHire: user.isReadyForHire ?? false,
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
      stakedEat: 0,
      stakes: [],
      ...(user.wallet || {})
    },
    metrics: {
      agriculturalCodeU: 0,
      timeConstantTau: 0,
      sustainabilityScore: 0,
      socialImmunity: 0,
      viralLoadSID: 0,
      baselineM: 0,
      ...(user.metrics || {})
    },
    skills: user.skills || {}
  };
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user: sanitizeUser(user) }),
  updateUser: (user) => set({ user: sanitizeUser(user) }),
}));
