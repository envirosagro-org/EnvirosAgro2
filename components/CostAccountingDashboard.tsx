
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
  type: 'COST' | 'REVENUE' | 'TAX' | 'PAYMENT';
  category: string;
  amount: number;
  description: string;
  timestamp: number;
}

interface CostAccountingDashboardProps {
  costAudit?: ShardCostCalibration | null;
  onRunAudit?: () => Promise<string>;
  oracleAdvice?: string | null;
}

const CostAccountingDashboard: React.FC<CostAccountingDashboardProps> = ({ 
  costAudit, 
  onRunAudit,
  oracleAdvice 
}) => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Mocking data as we are in a decentralized frontend-only mode.
      // In a production environment, these would be fetched from a secure backend.
      
      const mockReport: FinancialReport = {
        totalRevenue: 124500.50,
        totalCosts: 84200.25,
        netProfit: 40300.25,
        taxLiability: 12045.00,
        breakEvenPoint: 450.5,
        costOptimizationScore: 88
      };
      
      const mockTransactions: Transaction[] = [
        { id: 'TX-001', type: 'REVENUE', category: 'Harvest', amount: 15000, description: 'Bantu Coffee Batch #882', timestamp: Date.now() - 86400000 * 5 },
        { id: 'TX-002', type: 'COST', category: 'Logistics', amount: 2400, description: 'Eco-Rail Shard Delivery', timestamp: Date.now() - 86400000 * 4 },
        { id: 'TX-003', type: 'REVENUE', category: 'Carbon', amount: 8500, description: 'Mugumo Carbon Minting v6', timestamp: Date.now() - 86400000 * 3 },
        { id: 'TX-004', type: 'COST', category: 'Maintenance', amount: 1200, description: 'Oracle Node Calibration', timestamp: Date.now() - 86400000 * 2 },
        { id: 'TX-005', type: 'REVENUE', category: 'Services', amount: 3200, description: 'Agro Lang Deep Query Fee', timestamp: Date.now() - 86400000 * 1 }
      ];
      
      setReport(mockReport);
      setWalletBalance(542000.75);
      setTransactions(mockTransactions);
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      <SEO title="Cost Accounting" description="EnvirosAgro Cost Accounting: Real-time managerial accounting and cost optimization engine." />
      {/* Header */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/10 bg-black/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="space-y-4 relative z-10 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em]">Financial Oracle v8.2</span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Cost <span className="text-emerald-400">Accounting</span></h2>
          </div>
          <p className="text-slate-400 text-lg font-medium italic max-w-2xl">
            Real-time managerial accounting and cost optimization engine. Managing the EnvirosAgro treasury and Agro Lang resource allocation.
          </p>
        </div>
        
        <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center space-y-2 min-w-[280px] shadow-3xl">
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">System Treasury</p>
          <h3 className="text-5xl font-mono font-black text-white tracking-tighter italic">
            ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> SECURE_LEDGER_LINK
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: report?.totalRevenue, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Costs', value: report?.totalCosts, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Net Profit', value: report?.netProfit, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Tax Liability', value: report?.taxLiability, icon: Landmark, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[40px] border-white/5 bg-black/40 space-y-6 hover:border-white/10 transition-all group shadow-xl">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner group-hover:rotate-6 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-mono text-slate-700 font-black uppercase">AUDIT_OK</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-mono font-black text-white italic">
                ${stat.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue vs Cost Chart */}
        <div className="lg:col-span-8 glass-card p-10 rounded-[56px] border-white/5 bg-black/40 space-y-8 shadow-3xl">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
                <Activity size={20} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Operational <span className="text-indigo-400">Flow</span></h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">Costs</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactions.slice(-20)}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  hide 
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Optimization Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <HenIcon size={160} />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
                  <Zap size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Agro Lang <span className="text-emerald-400">Optimization</span></h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Optimization Score</span>
                    <span className="text-emerald-400">{report?.costOptimizationScore}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${report?.costOptimizationScore}%` }}></div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Leaf size={16} className="text-amber-400" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Neural Recommendation</p>
                  </div>
                  <p className="text-xs text-slate-400 italic leading-relaxed">
                    {oracleAdvice || "System detected high-frequency EnvirosAgro Agro Lang sharding. Applying 12% bulk discount to next 500 transactions to optimize treasury liquidity."}
                  </p>
                </div>

                <button 
                  onClick={onRunAudit}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <RefreshCw size={14} /> RE-CALIBRATE COSTS
                </button>
              </div>
            </div>
          </div>

          {/* Economic Calibrator Integration */}
          {costAudit && (
            <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-950/5 space-y-6 shadow-3xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
                  <Scale size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Economic <span className="text-indigo-400">Calibrator</span></h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">m-Constant</span>
                  <span className="text-lg font-mono font-black text-indigo-400">x{costAudit.mConstant.toFixed(2)}</span>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Calibrated Shard Price</p>
                  <p className="text-4xl font-mono font-black text-white">{costAudit.calibratedCost} <span className="text-sm">EAC</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Break-Even Analysis */}
          <div className="glass-card p-10 rounded-[56px] border-blue-500/20 bg-black/40 space-y-6 shadow-3xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Scale size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Break-Even <span className="text-blue-400">Analysis</span></h3>
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-mono font-black text-white italic">
                {report?.breakEvenPoint.toFixed(2)}
                <span className="text-sm text-slate-500 ml-2 uppercase tracking-widest">Units</span>
              </p>
              <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Current operational volume required to cover all system costs including EnvirosAgro Agro Lang and Oracle anchoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="glass-card p-10 rounded-[56px] border-white/5 bg-black/40 space-y-8 shadow-3xl">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-600/20 rounded-xl text-slate-400">
              <Database size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Financial <span className="text-slate-400">Ledger</span></h3>
          </div>
          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">
            Export Audit Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">TX_ID</th>
                <th className="pb-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                <th className="pb-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                <th className="pb-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                <th className="pb-6 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 block h-[400px]">
              <Virtuoso
                style={{ height: '100%', width: '100%' }}
                data={transactions.slice().reverse()}
                itemContent={(i, tx) => (
                  <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors flex w-full">
                    <td className="py-6 px-4 font-mono text-[10px] text-slate-500 w-1/5">{tx.id}</td>
                    <td className="py-6 px-4 w-1/5">
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/5">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-xs text-slate-400 italic w-1/5">{tx.description}</td>
                    <td className={`py-6 px-4 text-right font-mono font-black w-1/5 ${tx.type === 'REVENUE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'REVENUE' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-6 px-4 text-right w-1/5">
                      <span className="flex items-center justify-end gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        <ShieldCheck size={12} /> ANCHORED
                      </span>
                    </td>
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
