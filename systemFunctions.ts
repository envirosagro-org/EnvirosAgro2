
import { SustainabilityMetrics, User } from './types';

export const calculateAgroCode = (x: number, r: number, n: number): number => {
  if (r === 1) return x * n + 1;
  return x * ((Math.pow(r, n) - 1) / (r - 1)) + 1;
};

export const calculateMConstant = (dn: number, in_val: number, ca: number, s: number): number => {
  const stress = Math.max(s, 0.001);
  return Math.sqrt((dn * in_val * ca) / stress);
};

export const calculateSustainabilityScore = (m: number): number => Math.min(100, (m / 1.42) * 100);

/**
 * AgroLang 1.0 Runtime Parser
 * Actually executes code shards to update node state.
 */
export const executeAgroLangShard = (code: string, user: User): Partial<User> => {
  const lines = code.split('\n');
  const updates: Partial<User> = { metrics: { ...user.metrics }, wallet: { ...user.wallet } };
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('//')) return;

    // Logic: Bio.apply_freq(target: 432Hz) -> Boost m-constant
    if (cleanLine.includes('Bio.apply_freq')) {
      const match = cleanLine.match(/target:\s*(\d+)Hz/);
      if (match && match[1] === '432') {
        updates.metrics!.sustainabilityScore = Math.min(100, updates.metrics!.sustainabilityScore + 5);
      }
    }

    // Logic: Net.bridge_external(...) -> Increase tier confidence
    if (cleanLine.includes('Net.bridge_external')) {
      updates.wallet!.exchangeRate = Number((updates.wallet!.exchangeRate + 0.01).toFixed(3));
    }

    // Logic: COMMIT_SHARD -> Mint small reward
    if (cleanLine.includes('COMMIT_SHARD')) {
      updates.wallet!.balance += 10;
    }
  });

  return updates;
};

export const generateShardHash = async (data: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(data + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
};

export const mintCarbonShard = (biomass: number, confidence: number) => {
  const MINT_RATE = 100;
  return { value: Math.floor(biomass * MINT_RATE * confidence), unit: 'EAC' };
};
