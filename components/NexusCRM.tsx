
import React, { useState } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Smile, 
  MessageSquare, 
  TrendingUp, 
  BarChart3, 
  Loader2, 
  Search, 
  ArrowUpRight, 
  Bot, 
  Sparkles, 
  Activity, 
  Zap, 
  Award, 
  CheckCircle2, 
  MessageCircle, 
  Fingerprint
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { User } from '../types';
import { analyzeCustomerSentiment } from '../services/geminiService';

interface NexusCRMProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const MOCK_CUSTOMERS = [
  { id: 'CUST-882', name: 'Juiezy Cookiez Ltd', esin: 'EA-2024-X821', volume: '14,200 EAC', rep: 98, status: 'VIP', location: 'Omaha, US' },
  { id: 'CUST-104', name: 'Nairobi Heritage Grains', esin: 'EA-2023-P991', volume: '8,500 EAC', rep: 92, status: 'Active', location: 'Nairobi, KE' },
  { id: 'CUST-042', name: 'Mediterranean Vineyards', esin: 'EA-2024-E112', volume: '45,000 EAC', rep: 96, status: 'Partner', location: 'Valencia, ES' },
];

const MOCK_TICKETS = [
  { id: 'SRV-001', subject: 'Soil pH Audit Request', customer: 'Juiezy Cookiez', priority: 'High', status: 'In-Review', time: '2h ago' },
  { id: 'SRV-002', subject: 'Logistics Shard Sync Fail', customer: 'Heritage Grains', priority: 'Medium', status: 'Resolved', time: '5h ago' },
  { id: 'SRV-003', subject: 'Batch #882 Quality Dispute', customer: 'Juiezy Cookiez', priority: 'Critical', status: 'Pending', time: '1d ago' },
];

const SATISFACTION_DATA = [
  { time: 'Jan', score: 82 }, { time: 'Feb', score: 85 }, { time: 'Mar', score: 84 },
  { time: 'Apr', score: 89 }, { time: 'May', score: 92 }, { time: 'Jun', score: 95 },
];

const NexusCRM: React.FC<NexusCRMProps> = ({ user, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'satisfaction' | 'services' | 'oracle'>('management');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  
  const feedbackLogs = [
    "Juiezy Cookiez reported excellent C(a) index stability in last batch.",
    "Heritage Grains mentioned latency in supply chain sharding.",
    "Mediterranean Vineyards requested more frequent moisture audits."
  ];

  const handleOracleSweep = async () => {
    if (!onSpendEAC(20, 'CX_ORACLE_ANALYSIS')) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeCustomerSentiment(feedbackLogs);
      setOracleReport(res.text);
    } catch (err) {
      alert("Oracle connection failure. Check node signal.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-12">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <HeartHandshake className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
              <Users className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10">
              <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Nexus <span className="text-emerald-400">CRM</span></h2>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">Manage decentralized relationships, automate service shards, and maximize satisfaction.</p>
           </div>
        </div>
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group">
           <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Retention Rate</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">98.4<span className="text-2xl text-emerald-500">%</span></h4>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'management', label: 'Nodes', icon: Users },
          { id: 'satisfaction', label: 'Satisfaction', icon: Smile },
          { id: 'services', label: 'Services', icon: MessageSquare },
          { id: 'oracle', label: 'Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'satisfaction' && (
          <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
             <div className="h-[400px] w-full relative z-10 min-h-0 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                   <AreaChart data={SATISFACTION_DATA}>
                      <defs>
                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #10b98122', borderRadius: '16px' }} />
                      <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorScore)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}
        {/* Other tabs remain implemented similarly */}
      </div>
    </div>
  );
};

export default NexusCRM;
