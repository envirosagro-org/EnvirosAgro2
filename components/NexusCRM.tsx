
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Smile, 
  MessageSquare, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Loader2, 
  Search, 
  Filter, 
  PlusCircle, 
  X, 
  ArrowUpRight, 
  Bot, 
  Sparkles, 
  Activity, 
  Zap, 
  Award, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  Phone,
  LayoutGrid,
  ClipboardList,
  Fingerprint
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
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
  
  // Feedback Log for Analysis
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
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-12">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <HeartHandshake className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
              <Users className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10">
              <div>
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">Nexus_CRM_Protocol_V3</span>
                 <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Nexus <span className="text-emerald-400">CRM</span></h2>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                The centralized steward-to-customer bridge. Manage decentralized relationships, automate service shards, and maximize satisfaction through the Five Thrusts framework.
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group">
           <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Customer Retention Rate</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">98.4<span className="text-2xl text-emerald-500">%</span></h4>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Trust Shards</span>
                 <span className="text-emerald-400">1,240 / 1,500</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '82%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'management', label: 'Node Management', icon: Users },
          { id: 'satisfaction', label: 'Satisfaction Pulse', icon: Smile },
          { id: 'services', label: 'Service Grid', icon: MessageSquare },
          { id: 'oracle', label: 'Sentiment Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {activeTab === 'management' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Customer <span className="text-emerald-400">Nodes</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Verified wholesale and retail entities anchored to your steward registry.</p>
                </div>
                <div className="relative group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                   <input type="text" placeholder="Search customer ID..." className="bg-black/60 border border-white/10 rounded-[32px] py-4 pl-16 pr-8 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-sm" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_CUSTOMERS.map(cust => (
                  <div key={cust.id} className="glass-card p-10 rounded-[56px] border border-white/5 group hover:border-emerald-500/30 transition-all active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20">
                     <div className="flex justify-between items-start mb-10">
                        <div className="p-5 rounded-[24px] bg-white/5 group-hover:bg-emerald-600/10 transition-colors">
                           <Fingerprint className="w-8 h-8 text-emerald-400" />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${cust.status === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                           {cust.status}
                        </span>
                     </div>
                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors mb-2 italic">{cust.name}</h4>
                     <p className="text-[10px] text-slate-500 font-mono tracking-widest mb-10">{cust.esin} // {cust.location}</p>
                     
                     <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[8px] text-slate-600 font-black uppercase">Lifetime Volume</p>
                              <p className="text-xl font-mono font-black text-white">{cust.volume}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] text-slate-600 font-black uppercase">Trust Index</p>
                              <p className="text-xl font-mono font-black text-emerald-400">{cust.rep}%</p>
                           </div>
                        </div>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-emerald-600 transition-all shadow-xl">
                           Manage Node
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'satisfaction' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                   <div className="flex justify-between items-center mb-12 relative z-10">
                      <div>
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Satisfaction <span className="text-emerald-400">Pulse</span></h3>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Historical Net Promoter Score (NPS)</p>
                      </div>
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] text-center">
                         <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Avg Rating</p>
                         <p className="text-4xl font-mono font-black text-emerald-400">4.92</p>
                      </div>
                   </div>

                   <div className="h-[400px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={SATISFACTION_DATA}>
                            <defs>
                               <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #10b98122', borderRadius: '16px' }} />
                            <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorScore)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-600/5 space-y-10 group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
                         <Activity className="w-40 h-40 text-indigo-400" />
                      </div>
                      <h4 className="text-xl font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-4 italic relative z-10">
                         <BarChart3 className="w-6 h-6" /> CX Analytics
                      </h4>
                      <div className="space-y-8 relative z-10">
                         {[
                           { label: 'Issue Resolution', val: 94, col: 'bg-emerald-500' },
                           { label: 'Delivery Integrity', val: 99, col: 'bg-blue-500' },
                           { label: 'Interaction Clarity', val: 88, col: 'bg-indigo-500' },
                         ].map(r => (
                           <div key={r.label} className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <span>{r.label}</span>
                                 <span className="text-white">{r.val}%</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full ${r.col}`} style={{ width: `${r.val}%` }}></div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[56px] bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-center items-center text-center space-y-6 group cursor-pointer hover:bg-emerald-500/10 transition-all">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-[32px] flex items-center justify-center border border-emerald-500/20 shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                         <Award className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Steward of Service</h4>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Active Multiplier: +1.4x EAC</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Service <span className="text-blue-400">Grid</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Manage support shards and industrial service requests from customer nodes.</p>
                </div>
                <div className="flex gap-4">
                   <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center min-w-[120px]">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Open Shards</p>
                      <p className="text-2xl font-mono font-black text-blue-400">02</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                {MOCK_TICKETS.map(ticket => (
                  <div key={ticket.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group bg-black/20">
                     <div className="flex items-center gap-8">
                        <div className={`p-6 rounded-[28px] ${ticket.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-slate-500'} group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors`}>
                           <MessageCircle className="w-8 h-8" />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{ticket.subject}</h4>
                           <div className="flex items-center gap-4 mt-3">
                              <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">{ticket.id} // {ticket.customer.toUpperCase()}</p>
                              <span className={`px-3 py-0.5 rounded text-[8px] font-black uppercase border ${ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{ticket.status}</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-10">
                        <div>
                           <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Response Clock</p>
                           <p className="text-sm font-mono font-black text-white">{ticket.time}</p>
                        </div>
                        <button className="p-6 rounded-full bg-white/5 border border-white/10 text-white hover:bg-blue-600 transition-all shadow-xl active:scale-90">
                           <ArrowUpRight className="w-6 h-6" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'oracle' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-16 rounded-[64px] border-indigo-500/20 bg-indigo-900/5 relative overflow-hidden flex flex-col items-center text-center group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
                   <Sparkles className="w-[500px] h-[500px] text-indigo-400" />
                </div>
                
                <div className="relative z-10 space-y-10 w-full">
                   <div className="space-y-6">
                      <div className="w-32 h-32 bg-indigo-500 rounded-[48px] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700">
                         <Bot className="w-16 h-16 text-white" />
                      </div>
                      <div>
                         <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Sentiment <span className="text-indigo-400">Oracle</span></h3>
                         <p className="text-slate-400 text-xl font-medium mt-4 max-w-2xl mx-auto italic">
                           "Analyze customer interaction shards to optimize the Experience (CX) vector for your farm node."
                         </p>
                      </div>
                   </div>

                   {!oracleReport && !isAnalyzing ? (
                     <div className="space-y-8 animate-in fade-in duration-700">
                        <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 text-left space-y-4 max-w-2xl mx-auto shadow-inner">
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4 border-b border-white/5 pb-4">Awaiting Signal Ingest</p>
                           <p className="text-sm text-slate-400 italic px-4 leading-relaxed">
                             Analysis pool: 42 Interaction Shards, 12 Feedback Logs, 3 Service Resolutions.
                           </p>
                        </div>
                        <button 
                          onClick={handleOracleSweep}
                          className="px-16 py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto"
                        >
                           <Zap className="w-6 h-6 fill-current" /> Initialize CX Sweep
                        </button>
                        <p className="text-[10px] text-slate-600 font-black uppercase">Cost: 20 EAC per session</p>
                     </div>
                   ) : isAnalyzing ? (
                     <div className="flex flex-col items-center space-y-8 py-10">
                        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
                        <div className="space-y-2">
                           <p className="text-indigo-400 font-black text-sm uppercase tracking-[0.4em] animate-pulse">Deconstructing Sentiment Shards...</p>
                           <p className="text-slate-600 font-mono text-[10px]">Processing feedback cycle #2024.06.12</p>
                        </div>
                     </div>
                   ) : (
                     <div className="w-full text-left space-y-10 animate-in fade-in duration-700">
                        <div className="p-12 bg-black/60 rounded-[56px] border-l-8 border-indigo-500/50 shadow-2xl relative">
                           <div className="absolute top-6 right-10 text-[9px] font-black text-indigo-500/40 uppercase tracking-widest">GEMINI_3_FLASH_ORACLE</div>
                           <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line border-white/5 pl-4">
                              {oracleReport}
                           </div>
                        </div>
                        <div className="flex justify-center gap-6">
                           <button onClick={() => setOracleReport(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Clear Analysis</button>
                           <button className="px-12 py-5 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center gap-3 active:scale-95">
                              <CheckCircle2 className="w-5 h-5" /> Download CX Shard
                           </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NexusCRM;
