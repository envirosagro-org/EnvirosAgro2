import { SustainabilityMetrics, ShardCostCalibration } from "../../types";
import { calculateMConstant, generateAlphanumericId } from '../../systemFunctions';

/**
 * ENVIROSAGRO COST ACCOUNTING ORACLE
 * Logic: C_s = (C_b / m) * (1 + S_load)
 */

export interface Transaction {
  id: string;
  type: 'COST' | 'REVENUE' | 'TAX' | 'PAYMENT';
  category: 'EA_AI_API' | 'ORACLE' | 'ANCHORING' | 'REGISTRATION' | 'PRODUCTION' | 'SALES';
  amount: number;
  description: string;
  timestamp: number;
  metadata?: any;
}

export interface FinancialReport {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  taxLiability: number;
  breakEvenPoint: number;
  costOptimizationScore: number;
}

class CostAccountingService {
  private static instance: CostAccountingService;
  private transactions: Transaction[] = [];
  private walletBalance: number = 100000;
  private aiUsage: { tokens: number; cost: number } = { tokens: 0, cost: 0 };
  
  private readonly AI_COST_PER_1K_TOKENS = 0.0005; 
  private readonly TAX_RATE = 0.15;

  private constructor() {}

  public static getInstance(): CostAccountingService {
    if (!CostAccountingService.instance) {
      CostAccountingService.instance = new CostAccountingService();
    }
    return CostAccountingService.instance;
  }

  public calibrateShardCost(
    baseCost: number, 
    metrics: SustainabilityMetrics, 
    loadFactor: number = 0.05
  ): number {
    try {
      const m = calculateMConstant(0.92, 0.78, metrics.agriculturalCodeU, 0.12);
      const resonanceMultiplier = 1 / Math.max(m, 0.5);
      const stressMultiplier = 1 + loadFactor;
      return Math.ceil(baseCost * resonanceMultiplier * stressMultiplier);
    } catch (error) {
      console.error("Error calibrating shard cost:", error);
      return baseCost;
    }
  }

  public calibrateMintingYield(
    baseReward: number,
    metrics: SustainabilityMetrics
  ): number {
    try {
      const m = calculateMConstant(0.92, 0.78, metrics.agriculturalCodeU, 0.12);
      const ca = metrics.agriculturalCodeU;
      return Math.floor(baseReward * m * ca);
    } catch (error) {
      console.error("Error calibrating minting yield:", error);
      return baseReward;
    }
  }

  public getFullCostAudit(
    baseCost: number, 
    metrics: SustainabilityMetrics
  ): ShardCostCalibration {
    const m = calculateMConstant(0.92, 0.78, metrics.agriculturalCodeU, 0.12);
    const calibrated = this.calibrateShardCost(baseCost, metrics);
    
    return {
      shardId: `ACC-AUDIT-${Date.now()}`,
      baseCost,
      calibratedCost: calibrated,
      mConstant: m,
      caFactor: metrics.agriculturalCodeU,
      sehtiBonus: m > 1.42 ? 15 : 0,
      stressPenalty: m < 1.0 ? 25 : 0,
      finalYield: this.calibrateMintingYield(100, metrics)
    };
  }

  public recordTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: `TX-${generateAlphanumericId(7)}`,
      timestamp: Date.now()
    };
    this.transactions.push(newTransaction);
    if (newTransaction.type === 'REVENUE') {
      this.walletBalance += newTransaction.amount;
    } else {
      this.walletBalance -= newTransaction.amount;
    }
    return newTransaction;
  }

  public async accountAIUsage(tokens: number, model: string) {
    const cost = (tokens / 1000) * this.AI_COST_PER_1K_TOKENS;
    this.aiUsage.tokens += tokens;
    this.aiUsage.cost += cost;
    this.recordTransaction({
      type: 'COST',
      category: 'EA_AI_API',
      amount: cost,
      description: `Agro Lang Usage: ${model} (${tokens} tokens)`,
      metadata: { tokens, model }
    });
  }

  public generatePayment(category: Transaction['category'], baseAmount: number, description: string) {
    let amount = baseAmount;
    if (this.walletBalance < 1000) amount *= 0.9;
    
    return this.recordTransaction({
      type: 'PAYMENT',
      category,
      amount,
      description: `System Payment: ${description}`,
      metadata: { originalAmount: baseAmount }
    });
  }

  public getFinancialReport(): FinancialReport {
    const totalRevenue = this.transactions.filter(t => t.type === 'REVENUE').reduce((sum, t) => sum + t.amount, 0);
    const totalCosts = this.transactions.filter(t => t.type === 'COST' || t.type === 'PAYMENT').reduce((sum, t) => sum + t.amount, 0);
    const taxLiability = totalRevenue * this.TAX_RATE;
    const netProfit = totalRevenue - totalCosts - taxLiability;
    const breakEvenPoint = totalCosts > 0 ? (totalCosts / (totalRevenue / (this.transactions.length || 1))) : 0;

    return {
      totalRevenue,
      totalCosts,
      netProfit,
      taxLiability,
      breakEvenPoint,
      costOptimizationScore: 85
    };
  }

  public getTransactions() { return this.transactions; }
  public getWalletBalance() { return this.walletBalance; }
}

export const costAccountingService = CostAccountingService.getInstance();
