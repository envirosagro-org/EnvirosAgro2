
import { GoogleGenAI } from "@google/genai";
import { generateAlphanumericId } from '../systemFunctions';

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

class CostAccountingEngine {
  private transactions: Transaction[] = [];
  private walletBalance: number = 100000; // Initial system treasury
  private aiUsage: { tokens: number; cost: number } = { tokens: 0, cost: 0 };
  
  // Pricing Constants (Simulated in EAC/USD equivalent)
  private readonly AI_COST_PER_1K_TOKENS = 0.0005; 
  private readonly ORACLE_BASE_COST = 5;
  private readonly ANCHORING_BASE_COST = 2;
  private readonly REGISTRATION_FEE = 50;
  private readonly TAX_RATE = 0.15; // 15% tax

  constructor() {
    // Load initial state if needed
  }

  public recordTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    try {
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
    } catch (error) {
      console.error("Error recording transaction:", error);
      throw new Error("Failed to record transaction");
    }
  }

  public async accountAIUsage(tokens: number, model: string) {
    try {
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
    } catch (error) {
      console.error("Error accounting AI usage:", error);
      throw new Error("Failed to account AI usage");
    }
  }

  public generatePayment(category: Transaction['category'], baseAmount: number, description: string) {
    try {
      // Cost Optimization Logic
      const optimizedAmount = this.optimizeCost(baseAmount, category);
      
      return this.recordTransaction({
        type: 'PAYMENT',
        category,
        amount: optimizedAmount,
        description: `System Payment: ${description}`,
        metadata: { originalAmount: baseAmount }
      });
    } catch (error) {
      console.error("Error generating payment:", error);
      throw new Error("Failed to generate payment");
    }
  }

  private optimizeCost(amount: number, category: Transaction['category']): number {
    // Simple optimization logic: 
    // If balance is low, try to reduce costs by 10%
    // If high usage, apply bulk discount
    let optimized = amount;
    if (this.walletBalance < 1000) {
      optimized *= 0.9;
    }
    return optimized;
  }

  public getFinancialReport(): FinancialReport {
    try {
    const totalRevenue = this.transactions
      .filter(t => t.type === 'REVENUE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalCosts = this.transactions
      .filter(t => t.type === 'COST' || t.type === 'PAYMENT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const taxLiability = totalRevenue * this.TAX_RATE;
    const netProfit = totalRevenue - totalCosts - taxLiability;
    
    // Break-even = Fixed Costs / (Revenue per unit - Variable cost per unit)
    // Simplified for this engine
    const breakEvenPoint = totalCosts > 0 ? (totalCosts / (totalRevenue / (this.transactions.length || 1))) : 0;

    return {
      totalRevenue,
      totalCosts,
      netProfit,
      taxLiability,
      breakEvenPoint,
      costOptimizationScore: 85 // Simulated score
    };
    } catch (error) {
      console.error("Error generating financial report:", error);
      throw new Error("Failed to generate financial report");
    }
  }

  public async runAIOptimization() {
    try {
      // This would call Agro Lang to analyze transactions and suggest optimizations
      // For now, we simulate the background process
      console.log("Running Agro Lang Cost Optimization...");
    } catch (error) {
      console.error("Error running AI optimization:", error);
      throw new Error("Failed to run AI optimization");
    }
  }

  public getTransactions() {
    return this.transactions;
  }

  public getWalletBalance() {
    return this.walletBalance;
  }
}

export const costAccountingEngine = new CostAccountingEngine();
