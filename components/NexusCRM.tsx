
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
  Star,
  Database,
  Briefcase,
  FileSignature,
  Stamp,
  CheckCircle
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

const INITIAL_CUSTOMERS = [
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

const INITIAL_SERVICES = [
  { id: 'SRVC-01', name: 'Bio-Compost Delivery', provider: 'Green Soil Nodes', status: 'Verified', category: 'Inputs', trust: 98, desc: 'Eco-friendly compost delivery with ZK-proven carbon offsets.' },
  { id: 'SRVC-02', name: 'Spectral Drone Auditing', provider: 'SkyScout Inc', status: 'Pending Audit', category: 'Analysis', trust: 75, desc: 'High-altitude multi-spectral soil moisture analysis shards.' },
];

const NexusCRM: React.FC<NexusCRMProps> = ({ user, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'satisfaction' | 'services' | 'oracle'>('management');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Service Registry State
  const [registeredServices, setRegisteredServices] = useState(INITIAL_SERVICES);
  const [showRegisterService, setShowRegisterService] = useState(false);
  const [regStep, setRegStep] = useState<'form' | 'audit_pending' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Service Registration Form State
  const [serviceName, setServiceName] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Consultation');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');

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
    
    // Simulate API Call
    setTimeout(() => {
      const newService = {
        id: `SRVC-EXT-${Math.floor(Math.random() * 1000)}`,
        name: serviceName,
        provider: serviceProvider,
        status: 'Pending Audit',
        category: serviceCategory,
        trust: 0,
        desc: serviceDesc
      };
      
      setRegisteredServices([newService, ...registeredServices]);
      setIsSubmitting(false);
      setRegStep('audit_pending');
      onSpendEAC(50, 'AGRO_SERVICE_REGISTRATION_FEE');
    }, 2000);
  };

  const filteredCustomers = INITIAL_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-1 md:px-0">
      
      {/* Dynamic CRM Header */}
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
                 Manage stakeholder trust shards. Register your customer-facing agro services for physical verification and global network authorization.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                 <button 
                  onClick={() => setShowRegisterService(true)}
                  className="px-6 py-4 md:px-10 md:py-5 agro-gradient rounded-2xl md:rounded-3xl text-white font-black text-[10px] md:text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3"
                 >
                    <PlusCircle className="w-4 h-4 md:w-5 md:h-5" /> Register Service Shard
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

      {/* Primary CRM Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide p-1 gap-2 md:gap-4 glass-card rounded-[24px] md:rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'management', label: 'Nodes', icon: Users },
          { id: 'services', label: 'Service Registry', icon: Briefcase },
          { id: 'oracle', label: 'Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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
                   <p className="text-slate-500 text-xs md:text-sm font-medium mt-2">Active stakeholders and node profiles in your cluster.</p>
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
                        <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 text-center">
                           <p className="text-[7px] md:text-[8px] text-slate-600 font-black uppercase mb-1">Trust</p>
                           <p className="text-base md:text-lg font-mono font-black text-white">{cust.trust}%</p>
                        </div>
                        <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 text-center">
                           <p className="text-[7px] md:text-[8px] text-slate-600 font-black uppercase mb-1">Vol</p>
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

        {/* Services Tab - Mobile Optimized Registry */}
        {activeTab === 'services' && (
           <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-1 md:px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 gap-4">
                 <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Agro-Service <span className="text-blue-400">Ledger</span></h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-2">Any steward can register consumer services. Subject to physical verification.</p>
                 </div>
                 <button 
                  onClick={() => setShowRegisterService(true)}
                  className="w-full md:w-auto px-8 py-4 agro-gradient rounded-xl text-[10px] md:text-xs font-black uppercase text-white shadow-lg active:scale-95"
                 >
                    <PlusCircle className="w-4 h-4" /> Register New Service
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                 {registeredServices.map(srv => (
                   <div key={srv.id} className="glass-card p-6 md:p-8 rounded-[24px] md:rounded-[44px] border border-white/5 flex flex-col group hover:border-blue-500/30 transition-all shadow-md bg-black/20">
                      <div className="flex items-center justify-between mb-6">
                         <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-white/10 ${
                            srv.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                         }`}>
                            {srv.status === 'Verified' ? <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" /> : <Clock className="w-6 h-6 md:w-8 md:h-8" />}
                         </div>
                         <div className="text-right flex flex-col items-end gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase border tracking-widest ${
                               srv.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{srv.status}</span>
                            <div className="flex items-center gap-1">
                               <Star size={10} className="text-blue-400 fill-current" />
                               <span className="text-[10px] font-mono font-black text-white">{srv.trust}% Trust</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 space-y-2">
                         <h4 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none">{srv.name}</h4>
                         <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{srv.provider} • {srv.category}</p>
                         <p className="text-xs text-slate-400 leading-relaxed italic mt-4 line-clamp-2">"{srv.desc}"</p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                         <span className="text-[8px] font-mono text-slate-700 tracking-tighter uppercase">{srv.id}</span>
                         <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                            View Shard <ArrowRight size={12} />
                         </button>
                      </div>
                   </div>
                 ))}
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
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-emerald-500 rounded-[24px] md:rounded-[48px] flex items-center justify-center shadow-3xl mx-auto border-2 md:border-4 border-white/10">
                         <Bot className="w-10 h-10 md:w-16 md:h-16 text-white" />
                      </div>
                      <div>
                         <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Sentiment <span className="text-emerald-400">Oracle</span></h3>
                         <p className="text-slate-400 text-sm md:text-2xl font-medium mt-4 md:mt-6 max-w-3xl mx-auto italic leading-relaxed px-4">
                           Analyze community feedback and trust multipliers across the regional agro-service mesh.
                         </p>
                      </div>
                   </div>

                   {!oracleReport && !isAnalyzing ? (
                     <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
                        <div className="p-6 md:p-10 bg-black/60 rounded-[32px] md:rounded-[48px] border border-white/10 text-left space-y-4 md:space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40"></div>
                           <p className="text-[8px] md:text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] px-2 md:px-4 border-b border-white/10 pb-4 md:pb-6 flex items-center gap-2 md:gap-3">
                              <MessageCircle size={12} className="text-emerald-400" /> Analysis Source: Multi-Thrust Logs
                           </p>
                           <p className="text-sm md:text-lg text-slate-400 italic px-2 md:px-4 leading-relaxed font-medium">
                             Processing aggregate sentiment shards from validated consumer interactions.
                           </p>
                        </div>
                        <button 
                          onClick={handleOracleSweep}
                          className="w-full sm:w-auto px-8 py-5 md:px-16 md:py-8 agro-gradient rounded-2xl md:rounded-[40px] text-white font-black text-[10px] md:text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 md:gap-6 mx-auto active:scale-95 transition-all"
                        >
                           <Zap className="w-4 h-4 md:w-8 md:h-8 fill-current" /> Initialize Sweep
                        </button>
                     </div>
                   ) : isAnalyzing ? (
                     <div className="flex flex-col items-center space-y-8 md:space-y-12 py-12 md:py-16">
                        <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-emerald-400 animate-spin" />
                        <p className="text-emerald-400 font-black text-sm md:text-xl uppercase tracking-[0.4em] animate-pulse italic">Decoding Trust Shards...</p>
                     </div>
                   ) : (
                     <div className="w-full text-left space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-10">
                        <div className="p-8 md:p-16 bg-black/80 rounded-[40px] md:rounded-[64px] border border-white/10 shadow-3xl relative overflow-hidden">
                           <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 relative z-10">
                              <div className="flex items-center gap-4">
                                 <Bot className="w-6 h-6 text-indigo-400" />
                                 <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest italic leading-none">Consensus Shard</h4>
                              </div>
                              <span className="text-[7px] md:text-[10px] font-mono text-emerald-500/40 uppercase font-black">ORACLE_OK</span>
                           </div>
                           <div className="text-slate-200 text-sm md:text-xl leading-relaxed italic border-l-4 border-indigo-500/30 pl-6 md:pl-12 relative z-10 font-medium whitespace-pre-line">
                              {oracleReport}
                           </div>
                        </div>
                        <button onClick={() => setOracleReport(null)} className="mx-auto block text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Discard Analysis</button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Comprehensive External Service Registration Modal */}
      {showRegisterService && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-2 md:p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterService(false)}></div>
           
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[32px] md:rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              <div className="p-6 md:p-16 space-y-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterService(false)} className="absolute top-6 right-6 md:top-12 md:right-12 p-3 md:p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-5 h-5 md:w-8 md:h-8" /></button>
                 
                 {/* Progress Stepper */}
                 <div className="flex gap-2 md:gap-4 shrink-0">
                    {[
                      { l: 'Metadata', s: 'form' },
                      { l: 'Physical Audit', s: 'audit_pending' },
                      { l: 'Registry Sync', s: 'success' },
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
                      <div className="text-center space-y-3">
                         <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                            <HeartHandshake className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                         </div>
                         <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0">Service <span className="text-emerald-400">Registry Ingest</span></h3>
                         <p className="text-slate-400 text-xs md:text-lg font-medium leading-relaxed max-w-md mx-auto italic">Any node can register an external agro-service. Subject to physical audit protocol.</p>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Category</label>
                               <select value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20">
                                  <option>Input Supply</option>
                                  <option>Logistics</option>
                                  <option>Consultation</option>
                                  <option>Equipment Hire</option>
                                  <option>Processing Shard</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">GPS Node (Loc)</label>
                               <input type="text" required value={serviceLocation} onChange={e => setServiceLocation(e.target.value)} placeholder="e.g. Zone 4 Relay" className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Service Designation</label>
                               <input type="text" required value={serviceName} onChange={e => setServiceName(e.target.value)} placeholder="Service Title..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-lg md:text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800 shadow-inner" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Provider Legal Entity</label>
                               <input type="text" required value={serviceProvider} onChange={e => setServiceProvider(e.target.value)} placeholder="Entity Name..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Service Narrative</label>
                               <textarea required value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} placeholder="Brief description of service output..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white h-24 resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 italic" />
                            </div>
                         </div>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[40px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                         {isSubmitting ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Database className="w-5 h-5 md:w-6 md:h-6" />}
                         {isSubmitting ? "COMMITING SHARD..." : "AUTHORIZE REGISTRY MINT"}
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
                          "Metadata verified. EnvirosAgro team has been dispatched to physically evaluate your agro-service facility and compliance biometrics."
                       </p>
                    </div>

                    <div className="p-6 md:p-8 bg-black/60 rounded-[32px] md:rounded-[48px] border border-white/5 space-y-6 shadow-inner">
                       <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">On-Site Verification Checklist</h5>
                       <div className="grid grid-cols-1 gap-4">
                          {[
                             { l: 'Physical Premise Verification', i: MapPin },
                             { l: 'Agro-Tool Purity Audit', i: ShieldCheck },
                             { l: 'SEHTI Framework Compliance', i: ClipboardCheck },
                             { l: 'Legal Entity Signature Anchor', i: Stamp },
                          ].map((check, i) => (
                             <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300 italic group">
                                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-emerald-400 transition-colors">
                                   <check.i size={14} />
                                </div>
                                {check.l}
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-6">
                       <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-blue-500 shrink-0" />
                       <p className="text-[8px] md:text-[10px] text-blue-200/50 font-bold uppercase tracking-widest leading-relaxed text-left">
                          PROVISIONAL_INGEST: Service node will remain 'Awaiting Audit' on the global hub until the physical signature is anchored to the industrial blockchain.
                       </p>
                    </div>

                    <button 
                      onClick={() => setRegStep('success')}
                      className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[48px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-4"
                    >
                       <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> COMMENCE AUDIT QUEUE
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
                         <p className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] font-mono">Registry Ticket: #SRVC-EXT-{(Math.random()*1000).toFixed(0)}</p>
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
