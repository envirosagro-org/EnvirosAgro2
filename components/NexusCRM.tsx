
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Loader2, 
  Search, 
  ShieldCheck, 
  X, 
  Zap, 
  Briefcase, 
  Database, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Star, 
  HardHat, 
  ShieldAlert, 
  MapPin, 
  ClipboardCheck, 
  Stamp, 
  ArrowRight,
  Activity,
  ArrowUpRight,
  Clock,
  MessagesSquare,
  Sparkles,
  Bot,
  User as UserIcon,
  Globe,
  Settings,
  Shield,
  SearchCode,
  Send,
  Cookie,
  History,
  FileSearch,
  Maximize2,
  Terminal,
  AlertTriangle,
  Fingerprint,
  RotateCcw,
  BadgeCheck,
  LifeBuoy,
  Paperclip,
  Download,
  ShoppingBag,
  ShieldPlus
} from 'lucide-react';
import { User, VendorProduct, ViewState, Order } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface NexusCRMProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  vendorProducts: VendorProduct[];
  onNavigate: (view: ViewState) => void;
  orders: Order[];
}

const BASE_SERVICES = [
  { id: 'SRVC-01', name: 'BIO-COMPOST DELIVERY', provider: 'GREEN SOIL NODES // INPUT SUPPLY', status: 'Verified', category: 'Input Supply', trust: 98, desc: 'Eco-friendly compost delivery with ZK-proven carbon offsets.', cost: 120 },
  { id: 'SRVC-02', name: 'SPECTRAL DRONE AUDITING', provider: 'SKYSCOUT INC // LOGISTICS', status: 'Pending Audit', category: 'Logistics', trust: 75, desc: 'High-altitude multi-spectral soil moisture analysis shards.', cost: 450 },
  { id: 'SRVC-03', name: 'ANCESTRAL SEED VOUCHING', provider: 'BANTU HERITAGE // CONSULTATION', status: 'Verified', category: 'Consultation', trust: 99, desc: 'Verification of lineage-based seed purity and drought resistance.', cost: 85 },
];

const NexusCRM: React.FC<NexusCRMProps> = ({ user, onSpendEAC, vendorProducts = [], onNavigate, orders = [] }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'support' | 'after_sales' | 'ledger'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Support Chat State
  const [supportInput, setSupportInput] = useState('');
  const [supportChat, setSupportChat] = useState<{role: 'user' | 'bot', text: string, time: string}[]>([
    { role: 'bot', text: "Nexus Support Node active. Describe the industrial friction or service anomaly you are encountering.", time: 'Now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [supportChat, isTyping]);

  // Dynamically derived services from Vendor Registry
  const registeredServices = useMemo(() => {
    const dynamicServices = vendorProducts
      .filter(p => p.category === 'Service' && !p.name.toLowerCase().includes('tour'))
      .map(p => ({
        id: p.id,
        name: p.name.toUpperCase(),
        provider: `${p.supplierName.toUpperCase()} // ${p.supplierType.replace('_', ' ')}`,
        status: p.status === 'AUTHORIZED' ? 'Verified' : 'Pending Audit',
        category: 'Industrial Service',
        trust: p.status === 'AUTHORIZED' ? 95 : 40,
        desc: p.description,
        cost: p.price
      }));
    return [...BASE_SERVICES, ...dynamicServices];
  }, [vendorProducts]);

  const filteredServices = registeredServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // After-Sales: Actual orders that are services
  const activeServiceOrders = orders.filter(o => 
    o.customerEsin === user.esin && 
    (o.itemType.toLowerCase().includes('service') || o.itemType.toLowerCase().includes('audit') || o.itemType.toLowerCase().includes('consultation'))
  );

  const handleSupportSend = async () => {
    if (!supportInput.trim() || isTyping) return;
    const msg = supportInput.trim();
    setSupportInput('');
    setSupportChat(prev => [...prev, { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    try {
      const response = await chatWithAgroExpert(msg, supportChat.map(c => ({ role: c.role === 'bot' ? 'model' : 'user', parts: [{ text: c.text }] })));
      setSupportChat(prev => [...prev, { role: 'bot', text: response.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e) {
      setSupportChat(prev => [...prev, { role: 'bot', text: "Protocol sync error. Oracle handshake failed.", time: 'Error' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAcquireShard = (srv: any) => {
    onNavigate('economy'); // Proceed to procurement
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 max-w-[1200px] mx-auto px-4 md:px-0">
      
      {/* 1. Steward Support Rank Card - Redesigned based on screenshot */}
      <div className="flex justify-center px-4">
        <div className="glass-card w-full max-w-2xl p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-black/40 flex flex-col items-center text-center space-y-6 shadow-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
           <div className="space-y-1 relative z-10">
              <p className="text-[11px] md:text-xs text-slate-500 font-black uppercase tracking-[0.4em] mb-2 italic">STEWARD SUPPORT RANK</p>
              <h4 className="text-[100px] md:text-[140px] font-mono font-black text-emerald-400 tracking-tighter leading-none m-0 p-0 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">A+</h4>
           </div>
           <div className="flex gap-2 relative z-10 pb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={32} className="text-amber-500 fill-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />)}
           </div>
        </div>
      </div>

      {/* 2. Navigation Tab Shards - Screenshot Redesign */}
      <div className="flex flex-wrap justify-center gap-4 px-4">
        <div className="flex flex-wrap gap-2 md:gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-4 md:px-8">
          {[
            { id: 'directory', label: 'SERVICE SHARDS', icon: Globe },
            { id: 'after_sales', label: 'ACTIVE ENGAGEMENTS', icon: Clock },
            { id: 'support', label: 'SUPPORT TERMINAL', icon: ShoppingBag },
            { id: 'ledger', label: 'RESOLUTION LEDGER', icon: RotateCcw },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[700px] space-y-12">
        {/* TAB: SERVICE SHARDS (DIRECTORY) */}
        {activeTab === 'directory' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col items-center text-center space-y-6 px-4">
                <div className="w-full">
                    <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                      INSTITUTIONAL <span className="text-indigo-400">SERVICES</span>
                    </h3>
                    <p className="text-slate-500 text-lg md:text-xl font-medium mt-4 italic opacity-80">"Provisioning specialized industrial shards from vetted organizational nodes."</p>
                </div>
                <div className="relative group w-full max-w-3xl pt-4">
                    <Search className="absolute left-8 top-[calc(50%+8px)] -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Filter by service name or provider node..." 
                      className="w-full bg-black/60 border-2 border-white/10 rounded-full py-6 md:py-8 pl-20 pr-12 text-xl md:text-2xl text-white focus:outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-stone-900 italic shadow-inner" 
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12 px-4 max-w-5xl mx-auto">
                  {filteredServices.map(srv => (
                    <div key={srv.id} className="glass-card p-10 md:p-14 rounded-[64px] border-2 border-white/5 flex flex-col group hover:border-indigo-500/30 transition-all shadow-3xl bg-black/40 relative overflow-hidden">
                      {/* Database Watermark Background - Based on screenshot */}
                      <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <Database size={280} className="text-white" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-12 relative z-10">
                          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-black/40 border-2 flex items-center justify-center transition-all ${
                            srv.status === 'Verified' ? 'border-emerald-500/30 text-emerald-500 group-hover:border-emerald-500' : 'border-amber-500/30 text-amber-500 group-hover:border-amber-500 animate-pulse'
                          }`}>
                            {srv.status === 'Verified' ? <ShieldCheck size={44} /> : <Clock size={44} />}
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-xl transition-all ${
                                srv.status === 'Verified' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-600/10 text-amber-400 border-amber-500/20'
                            }`}>{srv.status.toUpperCase()}</span>
                            <p className="text-[11px] text-slate-700 font-mono mt-2 uppercase font-black tracking-widest">{srv.id}</p>
                          </div>
                      </div>

                      <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors m-0 tracking-tighter drop-shadow-2xl">{srv.name}</h4>
                          <p className="text-[11px] md:text-[12px] text-slate-600 font-black uppercase tracking-[0.3em] italic leading-tight">{srv.provider}</p>
                          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed italic mt-10 opacity-80 group-hover:opacity-100 transition-opacity max-w-3xl font-medium">"{srv.desc}"</p>
                      </div>

                      <div className="mt-16 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center sm:items-end justify-between relative z-10 gap-8">
                          <div className="space-y-4 text-center sm:text-left">
                             <div className="flex items-center justify-center sm:justify-start gap-3">
                                <Star size={20} className="text-amber-500 fill-amber-500" />
                                <span className="text-[13px] md:text-sm font-mono font-black text-white tracking-widest">{srv.trust}% TRUST</span>
                             </div>
                             <p className="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter m-0">{srv.cost} <span className="text-2xl md:text-3xl text-emerald-400 italic font-sans ml-1">EAC</span></p>
                          </div>
                          <div className="relative group/btn w-full sm:w-auto">
                            <button 
                              onClick={() => handleAcquireShard(srv)}
                              className="w-full sm:w-auto px-12 md:px-16 py-7 md:py-8 bg-emerald-600 hover:bg-emerald-500 rounded-[32px] text-[13px] md:text-sm font-black text-white uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-emerald-500/5"
                            >
                               ACQUIRE SHARD <ArrowUpRight size={28} />
                            </button>
                            <div className="absolute inset-[-8px] border-2 border-emerald-400/30 rounded-[40px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity animate-pulse"></div>
                          </div>
                      </div>
                    </div>
                  ))}
              </div>
           </div>
        )}

        {/* Other Tabs follow existing refined style... */}
        {activeTab === 'after_sales' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-10 px-4">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Engagement <span className="text-emerald-400">Monitoring</span></h3>
                    <p className="text-slate-500 text-base mt-2 font-medium italic">"Tracking the performance and lifecycle of your provisioned service shards."</p>
                 </div>
                 <div className="p-6 bg-emerald-600/5 border border-emerald-500/20 rounded-[32px] text-center shadow-xl">
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-1">Active Services</p>
                    <p className="text-4xl font-mono font-black text-white">{activeServiceOrders.length}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {activeServiceOrders.length === 0 ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                       <History size={80} className="text-slate-600 animate-pulse" />
                       <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active Engagement Shards detected.</p>
                       <button onClick={() => setActiveTab('directory')} className="px-10 py-5 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Browse Registry</button>
                    </div>
                 ) : (
                    activeServiceOrders.map(order => (
                       <div key={order.id} className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 shadow-3xl group relative overflow-hidden flex flex-col">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><History size={200} /></div>
                          <div className="flex justify-between items-start mb-10">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                   <Clock size={28} className="animate-spin-slow" />
                                </div>
                                <div>
                                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{order.itemName}</h4>
                                   <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-[0.4em]">SHARD_ID: {order.id}</p>
                                </div>
                             </div>
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                             }`}>{order.status.replace(/_/g, ' ')}</span>
                          </div>

                          <div className="space-y-6 flex-1">
                             <div className="p-8 bg-black rounded-[40px] border border-white/5 space-y-4 shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                                   <span>Execution Node</span>
                                   <span className="text-white">{order.supplierEsin}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                                   <span>Capital Locked</span>
                                   <span className="text-emerald-400 font-mono">{order.cost} EAC</span>
                                </div>
                             </div>
                             <div className="space-y-3 pt-4">
                                <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                                   <span>SLA Compliance</span>
                                   <span className="text-white">99.2%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: '99%' }}></div>
                                </div>
                             </div>
                          </div>

                          <div className="mt-12 pt-10 border-t border-white/5 flex gap-4">
                             <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">Audit Shard</button>
                             <button onClick={() => setActiveTab('support')} className="flex-1 py-5 bg-indigo-600 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                                <MessagesSquare size={16} /> Contact Node
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        )}

        {activeTab === 'support' && (
           <div className="max-w-6xl mx-auto flex flex-col h-[750px] glass-card rounded-[64px] border border-white/5 bg-black/40 overflow-hidden shadow-3xl animate-in zoom-in duration-500 px-4 md:px-0 mx-4">
              <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl group overflow-hidden">
                       <Bot size={40} className="group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Governance <span className="text-indigo-400">Support Shard</span></h3>
                       <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_SUPPORT_TERMINAL // REAL-TIME ORACLE LINK</p>
                    </div>
                 </div>
                 <div className="hidden md:flex flex-col items-end gap-2">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Oracle Sync: Stable</span>
                    <span className="text-[10px] font-mono text-slate-600">ID: EA_RES_SUPPORT_{Math.floor(Math.random()*1000)}</span>
                 </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-black/20">
                 {supportChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                       <div className={`flex flex-col gap-3 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-3 mb-1 px-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
                                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{msg.role === 'user' ? user.name : 'NEXUS_ORACLE'}</span>
                          </div>
                          <div className={`p-8 rounded-[40px] text-base leading-relaxed shadow-2xl relative overflow-hidden ${
                             msg.role === 'user' 
                               ? 'bg-indigo-600 text-white rounded-tr-none' 
                               : 'glass-card border border-white/10 rounded-tl-none italic bg-black/80 text-slate-200'
                          }`}>
                             {msg.role === 'bot' && <div className="absolute top-0 right-0 p-4 opacity-[0.02]"><Sparkles size={100} /></div>}
                             <p className="relative z-10 whitespace-pre-line font-medium">{msg.text}</p>
                          </div>
                          <span className="text-[9px] font-mono text-slate-700 px-6 font-bold">{msg.time}</span>
                       </div>
                    </div>
                 ))}
                 {isTyping && (
                    <div className="flex justify-start">
                       <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] rounded-tl-none flex gap-3 shadow-inner">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-10 border-t border-white/5 bg-black/90 px-4 md:px-10">
                 <div className="relative max-w-5xl mx-auto group">
                    <textarea 
                      value={supportInput}
                      onChange={e => setSupportInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSupportSend())}
                      placeholder="Input support signal (e.g. 'Node m-constant drift detected', 'SLA violation in Shard #882')..."
                      className="w-full bg-white/5 border border-white/10 rounded-[40px] py-8 pl-10 pr-28 text-lg text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 resize-none h-32 shadow-inner italic" 
                    />
                    <button 
                      onClick={handleSupportSend}
                      disabled={isTyping || !supportInput.trim()}
                      className="absolute right-6 bottom-6 p-6 bg-indigo-600 rounded-[32px] text-white shadow-3xl hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-90 ring-4 ring-indigo-500/5 group-hover:scale-105"
                    >
                       <Send size={28} />
                    </button>
                 </div>
                 <div className="mt-6 flex justify-between items-center px-10">
                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">Official Governance Protocol v5.0 // Secured Shard</p>
                    <div className="flex gap-4">
                       <button className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-2">
                          <Paperclip size={12} /> Attach Log Shard
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'ledger' && (
           <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 px-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-10 px-4 gap-6">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Resolution <span className="text-emerald-400">Ledger</span></h3>
                    <p className="text-slate-500 text-base mt-2 font-medium italic">"Immutable record of industrial friction resolutions and node settlements."</p>
                 </div>
                 <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all shadow-md">
                    <Download size={16} /> Export Audit Archive
                 </button>
              </div>

              <div className="glass-card rounded-[48px] overflow-hidden border border-white/5 bg-black/40 shadow-3xl">
                 <div className="grid grid-cols-5 p-10 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    <span className="col-span-2">Resolution Shard</span>
                    <span>Pillar Anchor</span>
                    <span>Settlement Date</span>
                    <span className="text-right">Ledger Auth</span>
                 </div>
                 <div className="divide-y divide-white/5">
                    {[
                       { id: 'RES-882-01', title: 'SLA Discrepancy Resolved', type: 'Industrial', date: '2d ago', node: 'Node_Paris_04', result: 'COMPLETED' },
                       { id: 'RES-104-42', title: 'Telemetry Drift Adjusted', type: 'Technological', date: '1w ago', node: 'Stwd_Nairobi', result: 'SETTLED' },
                       { id: 'RES-091-88', title: 'Vouch Identity Recovery', type: 'Societal', date: '2w ago', node: 'Global_Alpha', result: 'COMPLETED' },
                    ].map((res, i) => (
                       <div key={i} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer">
                          <div className="col-span-2 flex items-center gap-8">
                             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                <BadgeCheck size={24} className="text-emerald-400" />
                             </div>
                             <div>
                                <p className="text-xl font-black text-white uppercase italic tracking-tight leading-none">{res.title}</p>
                                <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase font-black">{res.id}</p>
                             </div>
                          </div>
                          <div>
                             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">{res.type}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono italic">{res.date} // {res.node}</div>
                          <div className="flex justify-end pr-4">
                             <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/20 transition-all">
                                <ShieldCheck size={20} />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              
              <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none"><Stamp size={400} /></div>
                 <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse border-2 border-white/10 shrink-0">
                       <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Zero-Friction Resolution</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-lg:text-sm max-w-lg mx-auto md:mx-0">All resolutions are cryptographically signed and stored on the permanent EOS registry, ensuring no node is left without institutional recourse.</p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0">
                    <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">TOTAL_SOLVED_SHARDS</p>
                    <p className="text-7xl font-mono font-black text-white tracking-tighter">1,426</p>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
      `}</style>
    </div>
  );
};

export default NexusCRM;
