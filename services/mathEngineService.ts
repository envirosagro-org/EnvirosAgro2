import { User, SustainabilityMetrics } from '../types';
import { calculateMConstant } from '../systemFunctions';
import { syncUserToCloud } from './firebaseService';

/**
 * ENVIROSAGRO MATHEMATICAL ENGINE
 * Automates the continuous calculation of sustainability metrics,
 * network resonance (m-constant), and the Agricultural Code (C(a)).
 */

export const runMathEngineTick = async (user: User, updateUserState: (u: User) => void): Promise<void> => {
  try {
    if (!user || !user.metrics) return;

    const currentMetrics = user.metrics;
    
    // 1. Calculate new m-constant based on current C(a) and environmental defaults
    // Dn = 0.92 (Network Density), In = 0.78 (Ingest Rate), S = 0.12 (Stress)
    const newMConstant = calculateMConstant(0.92, 0.78, currentMetrics.agriculturalCodeU, 0.12);
    
    // 2. Update Agricultural Code (C(a)) based on m-constant resonance
    // If m > 1.0, Ca grows. If m < 1.0, Ca decays slightly.
    const growthFactor = (newMConstant - 1.0) * 0.005; 
    let newCa = currentMetrics.agriculturalCodeU + growthFactor;
    newCa = Math.max(0.5, Math.min(newCa, 10.0)); // Bound Ca between 0.5 and 10.0
    
    // 3. Update Sustainability Score based on Ca and m
    let newScore = currentMetrics.sustainabilityScore + (newMConstant > 1.2 ? 0.1 : -0.05);
    newScore = Math.max(0, Math.min(newScore, 100));
    
    // 4. Update Social Immunity and Viral Load (SID)
    let newImmunity = currentMetrics.socialImmunity + (newScore > 80 ? 0.1 : -0.05);
    newImmunity = Math.max(0, Math.min(newImmunity, 100));
    
    let newViralLoad = currentMetrics.viralLoadSID - (newImmunity > 50 ? 0.2 : -0.1);
    newViralLoad = Math.max(0, Math.min(newViralLoad, 100));
    
    const updatedMetrics: SustainabilityMetrics = {
      ...currentMetrics,
      agriculturalCodeU: Number(newCa.toFixed(4)),
      timeConstantTau: Number(newMConstant.toFixed(4)),
      sustainabilityScore: Number(newScore.toFixed(2)),
      socialImmunity: Number(newImmunity.toFixed(2)),
      viralLoadSID: Number(newViralLoad.toFixed(2)),
      baselineM: currentMetrics.baselineM
    };
    
    const updatedUser: User = {
      ...user,
      metrics: updatedMetrics
    };

    // Update local state
    updateUserState(updatedUser);

    // Sync to cloud (fire-and-forget to avoid blocking)
    await syncUserToCloud(updatedUser);
  } catch (error) {
    console.error("Error running math engine tick:", error);
    // Not re-throwing here because this is a background tick, 
    // but we should ensure it doesn't crash the app.
  }
};
