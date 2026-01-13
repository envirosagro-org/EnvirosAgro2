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
  Download,
  HardHat,
  BadgeCheck,
  ShieldAlert,
  MapPin,
  ClipboardCheck,
  Building2,
  Calendar,
  // Fix: Added missing Star and Database icons
  Star,
  Database
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

const REGISTERED_SERVICES = [
  { id: 'SRVC-01', name: 'Bio-Compost Delivery', provider: 'Green Soil Nodes', status: 'Verified', category: 'Inputs', trust: 98 },
  { id: 'SRVC-02', name: 'Spectral Drone Auditing', provider: 'SkyScout Inc', status: 'Pending Audit', category: 'Analysis', trust: 75 },
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
  
  // Service Registration States
  const [showRegisterService, setShowRegisterService] = useState(false);
  const [regStep, setRegStep] = useState<'form' | 'audit_pending' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Consultation');

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

  const handleRegisterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !serviceProvider.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRegStep('audit_pending');
      onSpendEAC(50, 'AGRO_SERVICE_REGISTRATION_FEE');
    }, 2000);
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-1 md:px-0">
      
      {/* Dynamic CRM Header - Mobile Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="lg:col-span-3 glass-card p-6 md:p-10 rounded-[32px] md:rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <HeartHandshake className="w-64 h-64 md:w-96 md:h-96 text-white" />
           </div>
           <div className="w-24 h-24 md:w-40 md:h-40 rounded-[24px] md:rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-2xl ring-4 ring-white/10 shrink-0">
              <Users className="w-12 h-12 md:w-20 md:h-20 text-white" />
           </div>
           <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-1 md:space-y-2">
                 <span className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-500/10 text-emerald-400 text-[8px] md:text-[10px] font-black uppercase rounded-full tracking-[0.3em] md:tracking-[0.4em] border border-emerald-500/20">RELATIONSHIP_SHARD_V4</span>
                 <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Nexus <span className="text-emerald-400">CRM</span></h2>
              </div>
              <p className="text-slate-400 text-sm md:text-xl leading-relaxed max-w-2xl font-medium px-2 md:px-0">
                 Proactive stakeholder management for EnvirosAgro. Monitor node sentiment, register external agro-services, and anchor stakeholder trust shards.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                 <button 
                  onClick={() => setShowRegisterService(true)}
                  className="px-6 py-4 md:px-10 md:py-5 agro-gradient rounded-2xl md:rounded-3xl text-white font-black text-[10px] md:text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3"
                 >
                    <PlusCircle className="w-4 h-4 md:w-5 md:h-5" /> Register Agro Service
                 </button>
                 <button 
                  onClick={() => setActiveTab('oracle')}
                  className="px-6 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-white font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 md:gap-3"
                 >
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" /> Sentiment Oracle
                 </button>
              </div>
           </div>
        </div>
        
        <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-lg">
           <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
           <div className="space-y-1 relative z-10">
              <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1">Retention Sync</p>
              <h4 className="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter">98.4<span className="text-xl md:text-2xl text-emerald-500">%</span></h4>
           </div>
           <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase text-slate-600">
                 <span>Trust Buffer</span>
                 <span className="text-emerald-400">Stable</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Primary CRM Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto scrollbar-hide p-1 gap-2 md:gap-4 glass-card rounded-[24px] md:rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'management', label: 'Nodes', icon: Users },
          { id: 'satisfaction', label: 'Vitality', icon: Smile },
          { id: 'services', label: 'Services', icon: MessageSquare },
          { id: 'oracle', label: 'Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px] md:min-h-[700px]">
        {activeTab === 'management' && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-left-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 border-b border-white/5 pb-6 px-4">
                <div>
                   <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Registry <span className="text-emerald-400">Directory</span></h3>
                   <p className="text-slate-500 text-xs md:text-sm font-medium mt-2">Management of decentralized identities within your regional cluster.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search ESIN or Alias..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl md:rounded-2xl py-3 pl-10 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {filteredCustomers.map(cust => (
                  <div key={cust.id} className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[44px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-95 cursor-pointer relative overflow-hidden shadow-md">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform">
                        <Fingerprint className="w-24 h-24 text-white" />
                     </div>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 shadow-xl border border-white/10 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                           <span className="text-lg md:text-xl font-black">{cust.name[0]}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest border ${cust.status === 'VIP' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                           {cust.status}
                        </span>
                     </div>
                     <div className="space-y-1 relative z-10">
                        <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-tight">{cust.name}</h4>
                        <p className="text-[8px] md:text-[10px] text-slate-500 font-mono tracking-widest">{cust.esin}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-3 my-6 md:my-8 relative z-10">
                        <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                           <p className="text-[7px] md:text-[8px] text-slate-600 font-black uppercase mb-1">Trust Index</p>
                           <p className="text-base md:text-lg font-mono font-black text-white">{cust.trust}%</p>
                        </div>
                        <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                           <p className="text-[7px] md:text-[8px] text-slate-600 font-black uppercase mb-1">Volume</p>
                           <p className="text-base md:text-lg font-mono font-black text-emerald-400">{cust.volume.split(' ')[0]}K</p>
                        </div>
                     </div>
                     <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                        <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                           <Clock className="w-2.5 h-2.5" /> {cust.lastContact}
                        </p>
                        <button className="p-2 md:p-3 bg-white/5 rounded-lg md:rounded-xl text-slate-500 hover:text-white transition-all shadow-md">
                           <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Services Tab - Mobile Enhanced Grid */}
        {activeTab === 'services' && (
           <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-1 md:px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 gap-4">
                 <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Service <span className="text-blue-400">Registry</span></h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-2">Active agro-services sharded across your regional cluster.</p>
                 </div>
                 <button 
                  onClick={() => setShowRegisterService(true)}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 rounded-xl text-[10px] md:text-xs font-black uppercase text-white shadow-lg active:scale-95"
                 >
                    Register External Service
                 </button>
              </div>

              {/* Service List with Mobile Optimized Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {REGISTERED_SERVICES.map(srv => (
                   <div key={srv.id} className="glass-card p-6 rounded-[24px] md:rounded-[32px] border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-md">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border border-white/10 ${
                            srv.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                         }`}>
                            <Activity className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="text-base md:text-lg font-black text-white uppercase italic leading-none m-0">{srv.name}</h4>
                            <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase mt-1.5">{srv.provider} // {srv.category}</p>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                         <span className={`px-2 py-0.5 rounded text-[7px] md:text-[8px] font-black uppercase border ${
                            srv.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                         }`}>{srv.status}</span>
                         <div className="flex items-center gap-1.5">
                            {/* Fix: Added missing Star icon */}
                            <Star size={10} className="text-blue-400 fill-current" />
                            <span className="text-[10px] font-mono font-black text-white">{srv.trust}%</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Support Shards Table - Compact for Mobile */}
              <div className="glass-card rounded-[24px] md:rounded-[40px] overflow-hidden border-white/5 bg-black/40 mt-8 shadow-xl">
                 <div className="grid grid-cols-3 md:grid-cols-6 p-5 md:p-8 border-b border-white/5 bg-white/5 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="col-span-2">Service Ticket Shard</span>
                    <span className="hidden md:block">Steward</span>
                    <span className="hidden md:block">Category</span>
                    <span className="hidden md:block">Pulse</span>
                    <span className="text-right">Action</span>
                 </div>
                 <div className="divide-y divide-white/5">
                    {MOCK_TICKETS.map(ticket => (
                      <div key={ticket.id} className="grid grid-cols-3 md:grid-cols-6 p-5 md:p-8 hover:bg-white/[0.02] transition-all items-center group">
                         <div className="col-span-2 flex items-center gap-3 md:gap-6">
                            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl transition-all ${
                               ticket.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                               ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                               'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            }`}>
                               <Activity className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                               <p className="text-sm md:text-base font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors truncate">{ticket.subject}</p>
                               <p className="text-[8px] md:text-[9px] text-slate-600 font-mono mt-1 truncate">{ticket.id} // {ticket.customer}</p>
                            </div>
                         </div>
                         <div className="hidden md:flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase truncate">{ticket.customer}</span>
                            <span className="text-[7px] text-slate-600 font-mono">EA-NODE_AUTH</span>
                         </div>
                         <div className="hidden md:block">
                            <span className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-black uppercase text-slate-500 border border-white/10">
                               {ticket.category}
                            </span>
                         </div>
                         <div className="hidden md:block">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md ${
                               ticket.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                               'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                            }`}>
                               {ticket.status}
                            </span>
                         </div>
                         <div className="flex justify-end">
                            <button className="p-2.5 md:p-4 bg-white/5 rounded-lg md:rounded-xl text-slate-500 hover:text-white hover:bg-blue-600 transition-all border border-white/5">
                               <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Oracle Tab */}
        {activeTab === 'oracle' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in duration-500 px-1 md:px-0">
             <div className="glass-card p-8 md:p-16 rounded-[40px] md:rounded-[64px] border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col items-center text-center group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:scale-110 transition-transform">
                   <Sparkles className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] text-emerald-400" />
                </div>
                
                <div className="relative z-10 space-y-8 md:space-y-12 w-full">
                   <div className="space-y-4 md:space-y-6">
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-emerald-500 rounded-[24px] md:rounded-[48px] flex items-center justify-center shadow-3xl mx-auto border-2 md:border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700">
                         <Bot className="w-10 h-10 md:w-16 md:h-16 text-white" />
                      </div>
                      <div>
                         <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Sentiment <span className="text-emerald-400">Oracle</span></h3>
                         <p className="text-slate-400 text-sm md:text-2xl font-medium mt-4 md:mt-6 max-w-3xl mx-auto italic leading-relaxed px-4">
                           "Analyze aggregate stakeholder feedback and identify network trust friction shards."
                         </p>
                      </div>
                   </div>

                   {!oracleReport && !isAnalyzing ? (
                     <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
                        <div className="p-6 md:p-10 bg-black/60 rounded-[32px] md:rounded-[48px] border border-white/10 text-left space-y-4 md:space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40"></div>
                           <p className="text-[8px] md:text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] px-2 md:px-4 border-b border-white/10 pb-4 md:pb-6 flex items-center gap-2 md:gap-3">
                              <MessageCircle size={12} className="text-emerald-400" /> Data Source: Interaction Shards
                           </p>
                           <p className="text-sm md:text-lg text-slate-400 italic px-2 md:px-4 leading-relaxed font-medium">
                             Analysis Scope: Interaction Logs, Registry Vouchers, and Node Purity Multipliers.
                           </p>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                           <button 
                             onClick={handleOracleSweep}
                             className="w-full sm:w-auto px-8 py-5 md:px-16 md:py-8 agro-gradient rounded-2xl md:rounded-[40px] text-white font-black text-[10px] md:text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-6 mx-auto"
                           >
                              <Zap className="w-4 h-4 md:w-8 md:h-8 fill-current" /> Initialize Sweep
                           </button>
                           <p className="text-[8px] md:text-[10px] text-slate-700 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                              <Coins size={10} /> Registry Fee: 20 EAC capital burn
                           </p>
                        </div>
                     </div>
                   ) : isAnalyzing ? (
                     <div className="flex flex-col items-center space-y-8 md:space-y-12 py-12 md:py-16">
                        <div className="relative">
                           <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-emerald-400 animate-spin" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Fingerprint className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 animate-pulse" />
                           </div>
                        </div>
                        <p className="text-emerald-400 font-black text-sm md:text-xl uppercase tracking-[0.4em] md:tracking-[0.5em] animate-pulse italic">Decoding Sentiment Shards...</p>
                     </div>
                   ) : (
                     <div className="w-full text-left space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-10">
                        <div className="p-8 md:p-16 bg-black/80 rounded-[40px] md:rounded-[64px] border border-white/10 shadow-3xl relative overflow-hidden">
                           <div className="flex justify-between items-center mb-8 md:mb-12 pb-4 md:pb-8 border-b border-white/10 relative z-10">
                              <div className="flex items-center gap-4 md:gap-6">
                                 <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <Bot className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                                 </div>
                                 <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest italic leading-none">CX Health Shard</h4>
                              </div>
                              <span className="text-[7px] md:text-[10px] font-mono text-emerald-500/40 uppercase tracking-[0.4em] font-black">ORACLE_STABLE_V4.0</span>
                           </div>
                           
                           <div className="text-slate-200 text-sm md:text-xl leading-relaxed md:leading-[2.2] italic whitespace-pre-line border-l-3 md:border-l-4 border-indigo-500/30 pl-6 md:pl-12 relative z-10 font-medium">
                              {oracleReport}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-16 relative z-10">
                              <div className="p-6 md:p-8 bg-emerald-500/10 rounded-2xl md:rounded-[32px] border border-emerald-500/20 text-center">
                                 <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Sentiment Polarity</p>
                                 <p className="text-2xl md:text-4xl font-black text-emerald-400 font-mono tracking-tighter">POSITIVE</p>
                              </div>
                              <div className="p-6 md:p-8 bg-blue-500/10 rounded-2xl md:rounded-[32px] border border-blue-500/20 text-center">
                                 <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Trust Multiplier</p>
                                 <p className="text-2xl md:text-4xl font-black text-blue-400 font-mono tracking-tighter">1.84x</p>
                              </div>
                              <div className="p-6 md:p-8 bg-indigo-500/10 rounded-2xl md:rounded-[32px] border border-indigo-500/20 text-center">
                                 <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Retention Predict</p>
                                 <p className="text-2xl md:text-4xl font-black text-indigo-400 font-mono tracking-tighter">94%</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
                           <button onClick={() => setOracleReport(null)} className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard Analysis</button>
                           <button className="w-full sm:w-auto px-10 py-5 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3">
                              <Download className="w-4 h-4" /> Export Report Shard
                           </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* External Service Registration Modal */}
      {showRegisterService && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-2 md:p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterService(false)}></div>
           
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[32px] md:rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              <div className="p-6 md:p-16 space-y-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterService(false)} className="absolute top-6 right-6 md:top-12 md:right-12 p-3 md:p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-5 h-5 md:w-8 md:h-8" /></button>
                 
                 {/* Progress Terminal */}
                 <div className="flex gap-2 md:gap-4 mb-2 md:mb-4 shrink-0">
                    {[
                      { l: 'Metadata', s: 'form' },
                      { l: 'Verification', s: 'audit_pending' },
                      { l: 'Anchored', s: 'success' },
                    ].map((step, i) => {
                       const stages = ['form', 'audit_pending', 'success'];
                       const currentIdx = stages.indexOf(regStep);
                       const isActive = i === currentIdx;
                       const isDone = i < currentIdx;
                       return (
                         <div key={step.s} className="flex-1 flex flex-col gap-1 md:gap-2">
                           <div className={`h-1.5 md:h-2 rounded-full transition-all duration-700 ${isDone ? 'bg-emerald-500 shadow-[0_0_100px_#10b981]' : isActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`}></div>
                           <span className={`text-[6px] md:text-[8px] font-black uppercase text-center tracking-widest ${isActive ? 'text-emerald-400' : 'text-slate-700'}`}>{step.l}</span>
                         </div>
                       );
                    })}
                 </div>

                 {regStep === 'form' && (
                   <form onSubmit={handleRegisterService} className="space-y-6 md:space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-3 md:space-y-6">
                         <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/10 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                            <HeartHandshake className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
                         </div>
                         <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0">Service <span className="text-emerald-400">Registry Ingest</span></h3>
                         <p className="text-slate-400 text-xs md:text-lg font-medium leading-relaxed max-w-md mx-auto">Register your consumer-facing agro service. Mandatory physical audit applies.</p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                         <div className="space-y-2 md:space-y-4">
                            <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Service Type</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                               {['Input Supply', 'Logistics', 'Consultation', 'Training'].map(cat => (
                                 <button 
                                   key={cat}
                                   type="button"
                                   onClick={() => setServiceCategory(cat)}
                                   className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex flex-col items-center gap-1 md:gap-2 transition-all ${serviceCategory === cat ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                 >
                                    <div className="text-center">
                                       <p className="text-[7px] md:text-[9px] font-black uppercase truncate w-full">{cat}</p>
                                    </div>
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Service Designation</label>
                               <input 
                                 type="text" 
                                 required 
                                 value={serviceName}
                                 onChange={e => setServiceName(e.target.value)}
                                 placeholder="Service Alias..." 
                                 className="w-full bg-black/60 border border-white/10 rounded-2xl md:rounded-[32px] py-4 md:py-6 px-6 md:px-10 text-lg md:text-2xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800 shadow-inner" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Provider Legal Entity</label>
                               <input 
                                 type="text" 
                                 required 
                                 value={serviceProvider}
                                 onChange={e => setServiceProvider(e.target.value)}
                                 placeholder="Entity Name..." 
                                 className="w-full bg-black/60 border border-white/10 rounded-2xl md:rounded-[32px] py-4 md:py-5 px-6 md:px-10 text-base md:text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800 shadow-inner" 
                               />
                            </div>
                         </div>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[40px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-4 mt-4">
                         {isSubmitting ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
                         {isSubmitting ? "COMMITING SHARD..." : "AUTHORIZE SERVICE INGEST"}
                      </button>
                   </form>
                 )}

                 {regStep === 'audit_pending' && (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-right-6 duration-500 h-full justify-center space-y-10 md:space-y-12">
                       <div className="text-center space-y-4 md:space-y-6">
                          <div className="w-20 h-20 md:w-32 md:h-32 bg-amber-500/10 rounded-[24px] md:rounded-[40px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl relative group">
                             <HardHat className="w-10 h-10 md:w-16 md:h-16 text-amber-500 animate-bounce" />
                             <div className="absolute inset-0 border-2 md:border-4 border-amber-500/20 rounded-[24px] md:rounded-[40px] animate-ping opacity-40"></div>
                       </div>
                       <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-amber-500">Audit Protocol</span></h3>
                       <p className="text-slate-400 text-sm md:text-lg font-medium italic max-w-sm mx-auto leading-relaxed text-center px-4">
                          "Metadata verified. The EnvirosAgro Audit Team has been dispatched to physically evaluate your agro-service facility and compliance shards."
                       </p>
                    </div>

                    <div className="p-6 md:p-8 bg-black/60 rounded-[32px] md:rounded-[48px] border border-white/5 space-y-4 md:space-y-6 shadow-inner">
                       <div className="flex items-center gap-4">
                          <div className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl">
                             <Calendar className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">Verification Window</p>
                             <p className="text-xs md:text-sm font-bold text-white uppercase font-mono tracking-widest">48 - 72 Standard Hours</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl">
                             <MapPin className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">Verification Node</p>
                             <p className="text-xs md:text-sm font-bold text-white uppercase font-mono tracking-widest">{user.location.split(',')[0].toUpperCase()} REGISTRY</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-6">
                       <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-blue-500 shrink-0" />
                       <p className="text-[8px] md:text-[10px] text-blue-200/50 font-bold uppercase tracking-widest leading-relaxed text-left">
                          PROVISIONAL_INGEST: Service entry will remain 'Pending Audit' on the global hub until the physical signature is anchored to the blockchain.
                       </p>
                    </div>

                    <button 
                      onClick={() => setRegStep('success')}
                      className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[48px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-4"
                    >
                       {/* Fix: Added missing Database icon */}
                       <Database size={5} className="w-5 h-5 md:w-6 md:h-6" /> COMMIT PROVISIONAL SHARD
                    </button>
                    </div>
                 )}

                 {regStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-10 md:space-y-16 py-6 md:py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-32 h-32 md:w-48 md:h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                         <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-white group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                      </div>
                      <div className="space-y-2 md:space-y-4">
                         <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Sync <span className="text-emerald-400">Anchored</span></h3>
                         <p className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] font-mono">Registry Ticket: #SRVC-REG-{(Math.random()*1000).toFixed(0)}</p>
                      </div>
                      <div className="w-full glass-card p-6 md:p-12 rounded-3xl md:rounded-[56px] border-white/5 bg-emerald-500/5 space-y-4 md:space-y-6 text-left relative overflow-hidden shadow-xl">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Building2 className="w-24 h-24 md:w-40 md:h-40 text-emerald-400" /></div>
                         <div className="flex justify-between items-center text-[10px] relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Shard Status</span>
                            <span className="text-white font-mono font-black text-xl md:text-3xl text-amber-500 uppercase italic">Awaiting Audit</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] relative z-10 pt-3 md:pt-4 border-t border-white/10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Service Node</span>
                            <span className="text-blue-400 font-black uppercase truncate max-w-[200px]">{serviceName}</span>
                         </div>
                      </div>
                      <button onClick={() => { setShowRegisterService(false); setRegStep('form'); }} className="w-full py-6 md:py-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-[40px] text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry Hub</button>
                   </div>
                 )}
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