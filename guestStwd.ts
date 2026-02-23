
import { User } from './types';

export const GUEST_STWD: User = {
  name: 'GUEST STEWARD',
  email: 'guest@envirosagro.org',
  esin: 'EA-GUEST-VOID-NODE',
  mnemonic: 'none',
  regDate: new Date().toLocaleDateString(),
  role: 'OBSERVER',
  location: 'GLOBAL MESH NODE',
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
    stakedEat: 0
  },
  metrics: {
    agriculturalCodeU: 0,
    timeConstantTau: 0,
    sustainabilityScore: 0,
    socialImmunity: 0,
    viralLoadSID: 0,
    baselineM: 0
  },
  skills: {},
  isReadyForHire: false,
  completedActions: [],
  settings: {
    notificationsEnabled: true,
    privacyMode: 'Public',
    autoSync: true,
    biometricLogin: false,
    theme: 'Dark'
  }
};
