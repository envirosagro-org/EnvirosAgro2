
import React, { useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, Activity, 
  ShieldCheck, Zap, Database, RefreshCw, ArrowUpRight, 
  ArrowDownRight, Calculator, Scale, Percent, Landmark,
  Leaf, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { ShardCostCalibration } from '../types';
import { HenIcon } from './Icons';
import { SEO } from './SEO';

interface FinancialReport {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  taxLiability: number;
  breakEvenPoint: number;
  costOptimizationScore: number;
}

interface Transaction {
  id: string;
  type: 'COST' | 'REVENUE' | 'TAX' | 'PAYMENT' | 'SWAP' | 'STAKE';
  category: string;
  amount: number;
  description: string;
  timestamp: number;
}

interface CostAccountingDashboardProps {
  user: any;
  transactions?: any[];
  costAudit?: ShardCostCalibration | null;
  onRunAudit?: () => Promise<string>;
  oracleAdvice?: string | null;
}

const CostAccountingDashboard: React.FC<CostAccountingDashboardProps> = ({ 
  user,
  transactions: incomingTransactions = [],
  costAudit, 
  onRunAudit,
  oracleAdvice 
}) => {
  const [filter, setFilter] = useState<'All' | 'COST' | 'REVENUE' | 'TAX' | 'PAYMENT' | 'SWAP' | 'STAKE'>('All');
  const [sort, setSort] = useState<'Newest' | 'Oldest' | 'HighAmount' | 'LowAmount'>('Newest');

  // Missing component states
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredTransactions = transactions
    .filter(t => filter === 'All' || t.type === filter)
    .sort((a, b) => {
      if (sort === 'Newest') return b.timestamp - a.timestamp;
      if (sort === 'Oldest') return a.timestamp - b.timestamp;
      if (sort === 'HighAmount') return b.amount - a.amount;
      if (sort === 'LowAmount') return a.amount - b.amount;
      return 0;
    });

  const fetchData = async () => {
    try {
      const eacBalance = user?.wallet?.balance || 0;
      
      const totalRevenue = (incomingTransactions || []).filter((t: any) => t.value > 0).reduce((acc: number, t: any) => acc + t.value, 0);
      const totalCosts = Math.abs((incomingTransactions || []).filter((t: any) => t.value < 0).reduce((acc: number, t: any) => acc + t.value, 0));

      const mockReport: FinancialReport = {
        totalRevenue,
        totalCosts,
        netProfit: totalRevenue - totalCosts,
        taxLiability: totalRevenue * 0.1,
        breakEvenPoint: 450.5,
        costOptimizationScore: 88
      };
      
      setReport(mockReport);
      setWalletBalance(eacBalance);
      setTransactions((incomingTransactions || []).map((t: any) => ({
        id: t.id,
        type: t.value > 0 ? 'REVENUE' : 'COST',
        category: t.type || 'General',
        amount: Math.abs(t.value),
        description: t.details || 'Blockchain Transaction',
        timestamp: Date.now() // Mock timestamp as it's not in the type
      })));
    } catch (error) {
      console.error("Failed to fetch accounting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Synchronizing Financial Shards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Cost Accounting" description="EnvirosAgro Cost Accounting: Real-time managerial accounting and cost optimization engine." />
      {/* Header */}
      <div className="glass-card p-6 md:p-10 rounded-3xl border border-emerald-500/10 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em]">Financial Oracle v8.2</span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Cost <span className="text-emerald-400">Accounting</span></h2>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center space-y-1 shadow-lg">
          <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">System Treasury</p>
          <h3 className="text-3xl font-mono font-black text-white italic">
            ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: report?.totalRevenue, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Costs', value: report?.totalCosts, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Net Profit', value: report?.netProfit, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Tax Liability', value: report?.taxLiability, icon: Landmark, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 bg-black/40 space-y-4 hover:border-white/10 transition-all shadow-lg">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-mono font-black text-white italic">
                ${stat.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase italic">Flow</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={transactions.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis stroke="#ffffff20" fontSize={9} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="#10b98120" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Ledger */}
          <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40">
            <h3 className="text-sm font-black text-white uppercase italic mb-4">Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  <Virtuoso
                    style={{ height: '300px', width: '100%' }}
                    data={filteredTransactions}
                    itemContent={(i, tx) => (
                      <tr key={tx.id} className="text-[10px] text-slate-400">
                        <td className="p-2">{tx.description}</td>
                        <td className="p-2 text-right">{tx.amount.toFixed(2)}</td>
                      </tr>
                    )}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Optimization Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-black/40 space-y-6 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase italic">Agro Optimization</h3>
            <button onClick={onRunAudit} className="w-full py-3 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all">RE-CALIBRATE</button>
          </div>
          {/* Break-Even Analysis */}
          <div className="glass-card p-6 rounded-3xl border border-blue-500/20 bg-black/40 space-y-4 shadow-xl">
             <h3 className="text-sm font-black text-white uppercase italic">Break-Even Analysis</h3>
             <p className="text-xl font-mono font-black text-white italic">{report?.breakEvenPoint.toFixed(2)} Units</p>
          </div>
        </div>
      </div>
      {/* Transaction Ledger */}
      <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-white uppercase italic">Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              <Virtuoso
                style={{ height: '300px', width: '100%' }}
                data={filteredTransactions}
                itemContent={(i, tx) => (
                  <tr key={tx.id} className="text-[10px] text-slate-400">
                    <td className="p-2">{tx.description}</td>
                    <td className="p-2 text-right">{tx.amount.toFixed(2)}</td>
                  </tr>
                )}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default CostAccountingDashboard;
