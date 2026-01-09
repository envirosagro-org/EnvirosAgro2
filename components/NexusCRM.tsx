
import React, { useState } from 'react';
// Fixed: Added missing MoreHorizontal import and renamed BarChart to avoid any potential collision with recharts
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
  Fingerprint,
  Filter,
  PlusCircle,
  MoreHorizontal,
  ShieldCheck,
  Clock,
  ChevronRight,
  AlertTriangle,
  X,
  Send,
  FileText,
  BarChart as LucideBarChart,
  Layers,
  ArrowRight,
  Coins,
  Download
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  Cell
} from 'recharts';
import { User } from '../types';
import { analyzeCustomerSentiment } from '../services/geminiService';

interface NexusCRMProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const MOCK_CUSTOMERS = [
  { id: 'CUST-882', name: 'Juiezy Cookiez Ltd', esin: 'EA-2024-X821', volume: '14,200 EAC', rep: 98, trust: 94, status: 'VIP', location: 'Omaha, US', lastContact: '12m ago' },
  { id: 'CUST-104', name: 'Nairobi Heritage Grains', esin: 'EA-2023-P991', volume: '8,500 EAC', rep: 92, trust: 88, status: 'Active', location: 'Nairobi, KE', lastContact: '2h ago' },
  { id: 'CUST-042', name: 'Mediterranean Vineyards', esin: 'EA-2024-E112', volume: '45,000 EAC', rep: 96, trust: 91, status: 'Partner', location: 'Valencia, ES', lastContact: '1d ago' },
  { id: 'CUST-091', name: 'Silicon Soil Systems', esin: 'EA-2025-S091', volume: '2,100 EAC', rep: 85, trust: 72, status: 'New', location: 'Palo Alto, US', lastContact: '3d ago' },
];

const MOCK_TICKETS = [
  { id: 'SRV-001', subject: 'Soil pH Audit Request', customer: 'Juiezy Cookiez', priority: 'High', status: 'In-Review', time: '2h ago', category: 'Registry' },
  { id: 'SRV-002', subject: 'Logistics Shard Sync Fail', customer: 'Heritage Grains', priority: 'Medium', status: 'Settled', time: '5h ago', category: 'Logistics' },
  { id: 'SRV-003', subject: 'Batch #882 Quality Dispute', customer: 'Juiezy Cookiez', priority: 'Critical', status: 'Pending', time: '1d ago', category: 'TQM' },
  { id: 'SRV-004', subject: 'New Node Onboarding', customer: 'Silicon Systems', priority: 'Low', status: 'Pending', time: '4d ago', category: 'Support' },
];

const SATISFACTION_DATA = [
  { time: 'Jan', score: 82 }, { time: 'Feb', score: 85 }, { time: 'Mar', score: 84 },
  { time: 'Apr', score: 89 }, { time: 'May', score: 92 }, { time: 'Jun', score: 95 },
];

const THRUST_SATISFACTION = [
  { thrust: 'Societal', val: 88, color: '#f43f5e' },
  { thrust: 'Enviro', val: 94, color: '#10b981' },
  { thrust: 'Human', val: 78, color: '#14b8a6' },
  { thrust: 'Tech', val: 96, color: '#3b82f6' },
  { thrust: 'Industry', val: 92, color: '#8b5cf6' },
];

const NexusCRM: React.FC<NexusCRMProps> = ({ user, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'satisfaction' | 'services' | 'oracle'>('management');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  
  const feedbackLogs = [
    "Juiezy Cookiez reported excellent C(a) index stability in last batch.",
    "Heritage Grains mentioned latency in supply chain sharding.",
    "Mediterranean Vineyards requested more frequent moisture audits.",
    "Silicon Soil Systems is struggling with initial ESIN binding latency."
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

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Dynamic CRM Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-12">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <HeartHandshake className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
              <Users className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">RELATIONSHIP_SHARD_V4</span>
                 <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Nexus <span className="text-emerald-400">CRM</span></h2>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                 Proactive stakeholder management for the EnvirosAgro network. Monitor node sentiment, resolve service shards, and anchor stakeholder trust.
              </p>
              <div className="flex gap-4 pt-2">
                 <button 
                  onClick={() => setShowCreateTicket(true)}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                    <PlusCircle className="w-5 h-5" /> New Service Shard
                 </button>
                 <button 
                  onClick={() => setActiveTab('oracle')}
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                 >
                    <Bot className="w-5 h-5 text-emerald-400" /> Sentiment Oracle
                 </button>
              </div>
           </div>
        </div>
        
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Retention Sync</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">98.4<span className="text-2xl text-emerald-500">%</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Trust Buffer</span>
                 <span className="text-emerald-400">Stable</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Primary CRM Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'management', label: 'Steward Nodes', icon: Users },
          { id: 'satisfaction', label: 'Network Vitality', icon: Smile },
          { id: 'services', label: 'Service Shards', icon: MessageSquare },
          { id: 'oracle', label: 'CX Sentiment Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeTab === 'management' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Registry <span className="text-emerald-400">Directory</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Management of decentralized identities within your regional cluster.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search ESIN or Alias..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredCustomers.map(cust => (
                  <div key={cust.id} className="glass-card p-8 rounded-[44px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-95 cursor-pointer relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                        <Fingerprint className="w-32 h-32 text-white" />
                     </div>
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 shadow-xl border border-white/10 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                           <span className="text-xl font-black">{cust.name[0]}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${cust.status === 'VIP' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                           {cust.status}
                        </span>
                     </div>
                     <div className="space-y-1 relative z-10">
                        <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{cust.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest">{cust.esin}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4 my-8 relative z-10">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Trust Index</p>
                           <p className="text-lg font-mono font-black text-white">{cust.trust}%</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Volume</p>
                           <p className="text-lg font-mono font-black text-emerald-400">{cust.volume.split(' ')[0]}K</p>
                        </div>
                     </div>
                     <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                        <p className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-2">
                           <Clock className="w-3 h-3" /> Sync: {cust.lastContact}
                        </p>
                        <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                           <ArrowUpRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setShowCreateTicket(true)}
                  className="glass-card p-10 rounded-[44px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/40 transition-all group active:scale-95 min-h-[350px]"
                >
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shadow-2xl">
                      <PlusCircle className="w-8 h-8 text-slate-700 group-hover:text-emerald-400" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Sync New Node</h4>
                      <p className="text-slate-500 text-xs italic max-w-xs mx-auto">Manually bind a new ESIN signature to your cluster.</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {activeTab === 'satisfaction' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Aggregate Satisfaction Chart */}
                <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                   <div className="flex justify-between items-center relative z-10 mb-12 px-4">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-emerald-500/10 rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-emerald-400" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Network <span className="text-emerald-400">Sentiment Velocity</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Steward Interaction Index (Rolling 6M)</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-600 font-black uppercase">Aggregate U-SAT</p>
                         <p className="text-4xl font-mono font-black text-white">95.2<span className="text-xl text-emerald-500">%</span></p>
                      </div>
                   </div>

                   <div className="h-[400px] w-full relative z-10 min-h-0 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <AreaChart data={SATISFACTION_DATA}>
                            <defs>
                               <linearGradient id="colorSat" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #10b98122', borderRadius: '16px', padding: '12px' }} />
                            <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorSat)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Thrust-Based Satisfaction */}
                <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border-white/5 bg-black/40 flex flex-col shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                      <LucideBarChart className="w-64 h-64 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-10 italic flex items-center gap-3 px-2 relative z-10">
                      <Layers className="w-5 h-5 text-indigo-400" /> SEHTI <span className="text-indigo-400">Pillar Health</span>
                   </h3>
                   <div className="flex-1 min-h-0 min-w-0 relative z-10">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <RechartsBarChart data={THRUST_SATISFACTION} layout="vertical">
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis type="category" dataKey="thrust" stroke="rgba(255,255,255,0.4)" fontSize={10} width={70} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="val" radius={[0, 10, 10, 0]} barSize={20}>
                               {THRUST_SATISFACTION.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                               ))}
                            </Bar>
                         </RechartsBarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 text-[10px] text-slate-500 leading-relaxed italic text-center relative z-10">
                      "High T-Thrust satisfaction indicates successful precision drone deployment across the cluster."
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'services' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-8">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Service <span className="text-blue-400">Shards</span></h3>
                    <p className="text-slate-500 text-sm mt-1">Proactive dispute and resolution tracking for cluster stewards.</p>
                 </div>
                 <div className="flex gap-4">
                    <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">24H_BLOCK</button>
                    <button className="px-6 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-900/40">Active Filter</button>
                 </div>
              </div>

              <div className="glass-card rounded-[40px] overflow-hidden border-white/5 bg-black/40">
                 <div className="grid grid-cols-6 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="col-span-2">Service Context</span>
                    <span>Steward Alias</span>
                    <span>Category</span>
                    <span>System Pulse</span>
                    <span className="text-right">Action</span>
                 </div>
                 <div className="divide-y divide-white/5">
                    {MOCK_TICKETS.map(ticket => (
                      <div key={ticket.id} className="grid grid-cols-6 p-8 hover:bg-white/[0.02] transition-all items-center group">
                         <div className="col-span-2 flex items-center gap-6">
                            <div className={`p-4 rounded-2xl shadow-xl transition-all group-hover:scale-110 ${
                               ticket.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-rose-900/10' : 
                               ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                               'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            }`}>
                               <Activity className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{ticket.subject}</p>
                               <p className="text-[10px] text-slate-600 font-mono mt-1">{ticket.id} // T-{ticket.time}</p>
                            </div>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-tight">{ticket.customer}</span>
                            <span className="text-[9px] text-slate-600 font-mono">EA-NODE_AUTH</span>
                         </div>
                         <div>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-500 border border-white/10">
                               {ticket.category}
                            </span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${
                               ticket.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                               ticket.status === 'In-Review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                               'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                            }`}>
                               {ticket.status}
                            </span>
                         </div>
                         <div className="flex justify-end">
                            <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-blue-600 transition-all active:scale-90 shadow-xl border border-white/5">
                               <ArrowRight className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'oracle' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-16 rounded-[64px] border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col items-center text-center group shadow-[0_0_100px_rgba(16,185,129,0.05)]">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
                   <Sparkles className="w-[500px] h-[500px] text-emerald-400" />
                </div>
                
                <div className="relative z-10 space-y-12 w-full">
                   <div className="space-y-6">
                      <div className="w-32 h-32 bg-emerald-500 rounded-[48px] flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700">
                         <Bot className="w-16 h-16 text-white" />
                      </div>
                      <div>
                         <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Sentiment <span className="text-emerald-400">Oracle</span></h3>
                         <p className="text-slate-400 text-2xl font-medium mt-6 max-w-3xl mx-auto italic leading-relaxed">
                           "Invoke the Gemini 3 Pro oracle to analyze aggregate stakeholder feedback and identify network trust friction."
                         </p>
                      </div>
                   </div>

                   {!oracleReport && !isAnalyzing ? (
                     <div className="space-y-10 animate-in fade-in duration-700">
                        <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 text-left space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40"></div>
                           <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] px-4 border-b border-white/10 pb-6 flex items-center gap-3">
                              <MessageCircle size={14} className="text-emerald-400" /> Data Source: Cluster Interaction Shards
                           </p>
                           <p className="text-lg text-slate-400 italic px-4 leading-relaxed font-medium">
                             Analysis Scope: Interaction Logs, Support Tickets, Reaction Mining Consensus, and Node Purity Multipliers.
                           </p>
                        </div>
                        <div className="space-y-6">
                           <button 
                             onClick={handleOracleSweep}
                             className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 mx-auto group"
                           >
                              <Zap className="w-8 h-8 fill-current group-hover:animate-pulse" /> Initialize Sentiment Sweep
                           </button>
                           <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                              <Coins size={12} /> Registry Fee: 20 EAC capital burn
                           </p>
                        </div>
                     </div>
                   ) : isAnalyzing ? (
                     <div className="flex flex-col items-center space-y-12 py-16">
                        <div className="relative">
                           <Loader2 className="w-24 h-24 text-emerald-400 animate-spin" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-emerald-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Decoding Sentiment Shards...</p>
                           <div className="flex justify-center gap-1">
                              {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-6 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="w-full text-left space-y-12 animate-in fade-in duration-700 pb-10">
                        <div className="p-16 bg-black/80 rounded-[64px] border border-white/10 shadow-3xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><HeartHandshake className="w-96 h-96 text-emerald-400" /></div>
                           <div className="flex justify-between items-center mb-12 pb-8 border-b border-white/10 relative z-10">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <Bot className="w-8 h-8 text-indigo-400" />
                                 </div>
                                 <h4 className="text-3xl font-black text-white uppercase tracking-widest italic">CX <span className="text-indigo-400">Health Report</span></h4>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-500/40 uppercase tracking-[0.4em] font-black">ORACLE_STABLE_V4.0</span>
                           </div>
                           
                           <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-xl leading-[2.2] italic whitespace-pre-line border-l-4 border-indigo-500/30 pl-12 relative z-10 font-medium">
                              {oracleReport}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative z-10">
                              <div className="p-8 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20 text-center">
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Sentiment Polarity</p>
                                 <p className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">POSITIVE</p>
                              </div>
                              <div className="p-8 bg-blue-500/10 rounded-[32px] border border-blue-500/20 text-center">
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Trust Multiplier</p>
                                 <p className="text-4xl font-black text-blue-400 font-mono tracking-tighter">1.84x</p>
                              </div>
                              <div className="p-8 bg-indigo-500/10 rounded-[32px] border border-indigo-500/20 text-center">
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Retention Predict</p>
                                 <p className="text-4xl font-black text-indigo-400 font-mono tracking-tighter">94%</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex justify-center gap-8">
                           <button onClick={() => setOracleReport(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-95">Discard Analysis</button>
                           <button className="px-16 py-6 bg-indigo-600 rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-indigo-900/40 flex items-center gap-4 hover:bg-indigo-500 transition-all active:scale-95">
                              <Download className="w-6 h-6" /> Export Reputation Shard
                           </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Create Ticket Modal Interface (Mock) */}
      {showCreateTicket && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setShowCreateTicket(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card p-1 rounded-[56px] border-blue-500/30 overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-in zoom-in duration-300">
              <div className="bg-[#050706] p-16 space-y-12">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/40">
                          <PlusCircle className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Create <span className="text-blue-400">Service Shard</span></h3>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Steward Support Interface v4.2</p>
                       </div>
                    </div>
                    <button onClick={() => setShowCreateTicket(false)} className="p-4 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 </div>

                 <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); setShowCreateTicket(false); alert("SERVICE SHARD MINTED: Ticket committed to registry."); }}>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Shard Description</label>
                       <input type="text" required placeholder="Brief summary of the friction..." className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Shard Target</label>
                          <select className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-blue-500/20">
                             <option>Registry Node</option>
                             <option>Logistics Relay</option>
                             <option>Market Settlement</option>
                             <option>T-Thrust Calibration</option>
                          </select>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Priority Level</label>
                          <select className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-blue-500/20">
                             <option>Low</option>
                             <option>Medium</option>
                             <option>High</option>
                             <option>Critical Shard</option>
                          </select>
                       </div>
                    </div>

                    <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] flex items-center gap-8">
                       <ShieldCheck className="w-10 h-10 text-blue-400 shrink-0" />
                       <p className="text-xs text-slate-400 italic leading-relaxed">
                          "All service request shards are ZK-verified for steward privacy and committed to the industrial archive ledger."
                       </p>
                    </div>

                    <button type="submit" className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6">
                       <Send className="w-8 h-8" /> AUTHORIZE SHARD MINT
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NexusCRM;
