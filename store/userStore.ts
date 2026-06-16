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
      balance: user.wallet?.balance ?? 0,
      eatBalance: user.wallet?.eatBalance ?? 0,
      exchangeRate: user.wallet?.exchangeRate ?? 1.0,
      bonusBalance: user.wallet?.bonusBalance ?? 0,
      tier: user.wallet?.tier ?? 'Seed',
      lifetimeEarned: user.wallet?.lifetimeEarned ?? 0,
      linkedProviders: user.wallet?.linkedProviders ?? [],
      miningStreak: user.wallet?.miningStreak ?? 0,
      lastSyncDate: user.wallet?.lastSyncDate ?? new Date().toISOString().split('T')[0],
      pendingSocialHarvest: user.wallet?.pendingSocialHarvest ?? 0,
      stakedEat: user.wallet?.stakedEat ?? 0,
      stakes: user.wallet?.stakes ?? [],
    },
    metrics: {
      agriculturalCodeU: user.metrics?.agriculturalCodeU ?? 0,
      timeConstantTau: user.metrics?.timeConstantTau ?? 0,
      sustainabilityScore: user.metrics?.sustainabilityScore ?? 0,
      socialImmunity: user.metrics?.socialImmunity ?? 0,
      viralLoadSID: user.metrics?.viralLoadSID ?? 0,
      baselineM: user.metrics?.baselineM ?? 0,
    },
    skills: user.skills || {}
  };
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user: sanitizeUser(user) }),
  updateUser: (user) => set({ user: sanitizeUser(user) }),
}));
