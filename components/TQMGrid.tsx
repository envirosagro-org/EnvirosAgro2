
import React, { useState, useRef, useEffect } from 'react';
// Fix: Added missing Coins import from lucide-react
import { 
  ClipboardCheck, 
  History, 
  Search, 
  ShieldCheck, 
  Activity, 
  FlaskConical, 
  Factory, 
  ChefHat, 
  Loader2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Bot, 
  Sparkles, 
  MapPin, 
  Package, 
  Truck, 
  Star,
  Download,
  Dna,
  Binary,
  Microscope,
  Award,
  Heart,
  ChevronLeft,
  ArrowRight,
  Monitor,
  Shield,
  SearchCode,
  Link2,
  Coins
} from 'lucide-react';
import { User } from '../types';
import { auditProductQuality } from '../services/geminiService';

interface TQMGridProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const MOCK_LIFECYCLE = [
  { stage: 'Production', node: 'Node_Paris_04', date: '2024.05.10', status: 'VERIFIED', icon: Microscope, details: 'Soil organic matter: 6.2% | Purity: 99.8%', lat: 48, lng: 2 },
  { stage: 'Processing', node: 'Industrial_Shard_08', date: '2024.05.15', status: 'VERIFIED', icon: Factory, details: 'Hygienic standard A+ | Batch consistency sync', lat: 40, lng: -74 },
  { stage: 'Logistics', node: 'Supply_Relay_01', date: '2024.05.18', status: 'IN-TRANSIT', icon: Truck, details: 'Temp: 4.2°C | Humidity: 45%', lat: 41, lng: -95 },
  { stage: 'Consumption', node: 'Retail_Point_88', date: 'PENDING', status: 'AWAITING', icon: ChefHat, details: 'Final audit required post-receipt.', lat: 34, lng: -118 },
];

const TQMGrid: React.FC<TQMGridProps> = ({ user, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'management' | 'oracle' | 'standards'>('trace');
  const [traceId, setTraceId] = useState('BCH-842-EOS');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [highlightStage, setHighlightStage] = useState<number | null>(null);
  
  const handleTrace = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Node Sync: Batch ${traceId} located on the Industrial Ledger.`);
  };

  const handleQualityOracle = async () => {
    if (!onSpendEAC(30, 'TQM_ORACLE_AUDIT')) return;
    setIsAuditing(true);
    try {
      const res = await auditProductQuality(traceId, MOCK_LIFECYCLE);
      setAuditReport(res.text);
    } catch (err) {
      alert("Oracle connection failure. Shard missing.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <ClipboardCheck className="w-80 h-80 text-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-900/40">
                    <ClipboardCheck className="w-10 h-10 text-white" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">TQM <span className="text-emerald-400">Grid</span></h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Total Quality Management Active
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-xl font-medium">
                Ensuring farmers, processors, and consumers enjoy premium agricultural integrity through end-to-end blockchain tracking and scientific audits.
              </p>
              <form onSubmit={handleTrace} className="flex gap-4 pt-4">
                 <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type="text" 
                      value={traceId}
                      onChange={e => setTraceId(e.target.value)}
                      placeholder="Enter Batch ID (e.g. BCH-842-EOS)" 
                      className="w-full bg-black/60 border border-white/10 rounded-[32px] py-5 pl-16 pr-6 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-mono tracking-widest text-sm" 
                    />
                 </div>
                 <button type="submit" className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Trace ID
                 </button>
              </form>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between group overflow-hidden relative">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <div className="text-center space-y-2">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Quality Multiplier</p>
              <h4 className="text-6xl font-mono font-black text-white">1.94<span className="text-lg text-emerald-500">x</span></h4>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Purity Shards</span>
                 <span className="text-emerald-400">99.8%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '99%' }}></div>
              </div>
              <p className="text-[9px] text-slate-500 italic text-center uppercase tracking-widest font-black opacity-40">Protocol v3.2_Purity</p>
           </div>
        </div>
      </div>

      {/* Sub-Nav */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40">
        {[
          { id: 'trace', label: 'Lifecycle Trace', icon: History },
          { id: 'management', label: 'Quality Controls', icon: Activity },
          { id: 'oracle', label: 'TQM Oracle', icon: Bot },
          { id: 'standards', label: 'Registry Standards', icon: ShieldCheck },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setAuditReport(null); }}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Views */}
      <div className="min-h-[600px]">
        {activeTab === 'trace' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Batch <span className="text-emerald-400">Traceability Shard</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Immutable journey of Batch {traceId} from Genesis to Delivery.</p>
                </div>
                <div className="hidden md:flex gap-4">
                   <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">REGISTRY_LOCKED</p>
                   </div>
                </div>
             </div>

             <div className="relative space-y-16 py-10">
                {/* Connecting Line */}
                <div className="absolute left-[39px] top-20 bottom-20 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-indigo-500 opacity-20"></div>

                {MOCK_LIFECYCLE.map((log, i) => (
                  <div key={i} className="flex gap-10 group" onMouseEnter={() => setHighlightStage(i)} onMouseLeave={() => setHighlightStage(null)}>
                     <div className="relative z-10">
                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center border-4 border-[#050706] shadow-2xl transition-all group-hover:scale-110 ${
                          highlightStage === i ? 'scale-125 ring-8 ring-emerald-500/20' : ''
                        } ${
                          log.status === 'VERIFIED' ? 'bg-emerald-600' : 
                          log.status === 'IN-TRANSIT' ? 'bg-blue-600' : 'bg-slate-800'
                        }`}>
                           <log.icon className="w-10 h-10 text-white" />
                        </div>
                     </div>
                     <div className={`flex-1 glass-card p-10 rounded-[48px] border-2 transition-all flex flex-col md:flex-row justify-between gap-8 ${
                        highlightStage === i ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5'
                     }`}>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{log.stage}</h4>
                              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                log.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                log.status === 'IN-TRANSIT' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                'bg-white/5 text-slate-500 border-white/10'
                              }`}>{log.status}</span>
                           </div>
                           <div className="flex gap-6 items-center">
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase font-black">
                                 <Monitor size={12} /> {log.node}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase font-black">
                                 <History size={12} /> {log.date}
                              </div>
                           </div>
                           <p className="text-lg text-slate-400 italic leading-relaxed mt-6 pl-6 border-l-2 border-white/5 group-hover:border-emerald-500/20 transition-all">"{log.details}"</p>
                        </div>
                        <div className="flex flex-col justify-between items-end shrink-0 gap-6">
                           <div className="flex gap-2">
                              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                                 <ShieldCheck className="w-8 h-8 text-emerald-400" />
                              </div>
                              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600/10 transition-colors">
                                 <Activity className="w-8 h-8 text-blue-400" />
                              </div>
                           </div>
                           <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white">
                              Open Node Dossier <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'management' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in duration-500">
              <div className="lg:col-span-1 space-y-8">
                 <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 space-y-10 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                       <Microscope className="w-48 h-48 text-emerald-400" />
                    </div>
                    <div className="w-16 h-16 bg-emerald-600 rounded-[24px] flex items-center justify-center shadow-2xl relative z-10">
                       <FlaskConical className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none relative z-10">Production Control</h4>
                    <div className="space-y-6 pt-4 border-t border-white/10 relative z-10">
                       {[
                         { label: 'Soil Organic Shard', val: 98, col: 'bg-emerald-400' },
                         { label: 'Water Purity v2', val: 92, col: 'bg-blue-400' },
                         { label: 'Zero-Pesticide Vouch', val: 100, col: 'bg-indigo-400' },
                       ].map(c => (
                         <div key={c.label} className="space-y-3 group/row">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 group-hover/row:text-white transition-colors">
                               <span>{c.label}</span>
                               <span className="font-mono text-emerald-400">{c.val}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                               <div className={`h-full ${c.col} transition-all duration-[2s] shadow-[0_0_10px_current]`} style={{ width: `${c.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] bg-white/[0.02] border border-white/5 space-y-6 group hover:bg-white/5 transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-emerald-400 transition-colors">
                       <Package className="w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-white uppercase tracking-widest italic leading-tight">Inventory Health Sync</h4>
                       <p className="text-slate-500 text-xs mt-4 italic leading-relaxed">"Continuous thermal & humidity telemetry sharding with regional logistics hubs."</p>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 space-y-10 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><History className="w-64 h-64 text-white" /></div>
                 <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-emerald-500/10 rounded-2xl">
                          <Activity className="w-8 h-8 text-emerald-400" />
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-widest italic">Quality <span className="text-emerald-400">Pulse Logs</span></h3>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">24H_BLOCK</button>
                    </div>
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    {[
                      { node: 'Node_Paris_04', msg: 'Batch BCH-842 purity test PASSED (99.8% organic match)', time: '12m ago', level: 'SUCCESS' },
                      { node: 'Industrial_Shard_08', msg: 'Facility hygiene audit scheduled for Cycle_T-12', time: '1h ago', level: 'PENDING' },
                      { node: 'Logistics_Relay_NY', msg: 'Temperature spike detected in Shard_Container_04', time: '5h ago', level: 'WARNING' },
                      { node: 'Consumer_Feedback', msg: 'Product freshness rated 5/5 by 142 unique ESINs', time: '1d ago', level: 'SUCCESS' },
                    ].map((log, i) => (
                      <div key={i} className="p-8 bg-black/60 rounded-[32px] border border-white/10 flex items-center justify-between group hover:bg-white/[0.04] transition-all cursor-pointer">
                         <div className="flex items-center gap-8">
                            <div className={`w-3.5 h-3.5 rounded-full shadow-[0_0_12px_current] ${log.level === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500' : log.level === 'WARNING' ? 'text-amber-500 bg-amber-500 animate-pulse' : 'text-blue-500 bg-blue-500'}`}></div>
                            <div>
                               <p className="text-slate-200 font-bold text-lg tracking-tight leading-none mb-2">{log.msg}</p>
                               <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em] font-black">{log.node} // {log.time}</p>
                            </div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <ArrowRight className="w-5 h-5 text-emerald-500" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'oracle' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-16 rounded-[64px] border-emerald-500/20 bg-emerald-900/5 relative overflow-hidden flex flex-col items-center text-center group shadow-[0_0_100px_rgba(16,185,129,0.05)]">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
                   <Sparkles className="w-[500px] h-[500px] text-emerald-400" />
                </div>
                
                <div className="relative z-10 space-y-12 w-full">
                   <div className="space-y-6">
                      <div className="w-32 h-32 bg-emerald-500 rounded-[48px] flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700">
                         <Bot className="w-16 h-16 text-white" />
                      </div>
                      <div>
                         <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Quality <span className="text-emerald-400">Oracle</span></h3>
                         <p className="text-slate-400 text-2xl font-medium mt-6 max-w-3xl mx-auto italic leading-relaxed">
                           "Analyze the cumulative lifecycle shards of any registry asset to prove 100% industrial integrity."
                         </p>
                      </div>
                   </div>

                   {!auditReport && !isAuditing ? (
                     <div className="space-y-10 animate-in fade-in duration-700">
                        <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 text-left space-y-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40"></div>
                           <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] px-4 border-b border-white/10 pb-6 flex items-center gap-3">
                              <SearchCode size={14} className="text-emerald-400" /> Audit Target: {traceId}
                           </p>
                           <p className="text-lg text-slate-400 italic px-4 leading-relaxed font-medium">
                             Scope: Production m™ Constant, Facility Compliance Shards, Logistics Thermal Logs, and Consumer Feedback Tokens.
                           </p>
                        </div>
                        <div className="space-y-6">
                           <button 
                             onClick={handleQualityOracle}
                             className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 mx-auto group"
                           >
                              <Zap className="w-8 h-8 fill-current group-hover:animate-pulse" /> Initialize Deep-Shard Audit
                           </button>
                           <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                              <Coins size={12} /> Registry Fee: 30 EAC capital burn
                           </p>
                        </div>
                     </div>
                   ) : isAuditing ? (
                     <div className="flex flex-col items-center space-y-12 py-16">
                        <div className="relative">
                           <Loader2 className="w-24 h-24 text-emerald-400 animate-spin" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Binary className="w-10 h-10 text-emerald-400 animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-emerald-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Synchronizing Lifecycle Shards...</p>
                           <div className="flex justify-center gap-1">
                              {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-6 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                           </div>
                           <p className="text-slate-600 font-mono text-xs uppercase font-black mt-4">Processing production blocks #{(Math.random()*1000).toFixed(0)}_A to #{(Math.random()*1000).toFixed(0)}_Z</p>
                        </div>
                     </div>
                   ) : (
                     <div className="w-full text-left space-y-12 animate-in fade-in duration-700">
                        <button 
                          onClick={() => setAuditReport(null)}
                          className="flex items-center gap-3 mb-4 p-4 px-8 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all w-fit group/back active:scale-90"
                        >
                          <ChevronLeft className="w-6 h-6 group-hover/back:-translate-x-1 transition-transform" />
                          <span className="text-xs font-black uppercase tracking-widest">Back to Registry Terminal</span>
                        </button>
                        
                        <div className="p-16 bg-black/80 rounded-[64px] border border-white/10 shadow-3xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Shield className="w-96 h-96 text-emerald-400" /></div>
                           <div className="flex justify-between items-center mb-10 pb-8 border-b border-white/10 relative z-10">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Sparkles className="w-8 h-8 text-emerald-400" />
                                 </div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Consensus Result</h4>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-500/40 uppercase tracking-[0.4em] font-black">GEMINI_3_FLASH_V1_AUDIT</span>
                           </div>
                           <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-xl leading-[2.2] italic whitespace-pre-line border-l-4 border-emerald-500/30 pl-12 relative z-10 font-medium">
                              {auditReport}
                           </div>
                           <div className="mt-12 flex justify-end relative z-10">
                              <div className="p-6 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20 text-center px-12">
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Final Grade Shard</p>
                                 <p className="text-6xl font-black text-emerald-400 font-mono tracking-tighter">A+</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex justify-center gap-8">
                           <button onClick={() => setAuditReport(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-95">Discard Analysis</button>
                           <button className="px-16 py-6 bg-emerald-600 rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 flex items-center gap-4 hover:bg-emerald-500 transition-all active:scale-95">
                              <Download className="w-6 h-6" /> Export TQM Shard (PDF)
                           </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'standards' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="space-y-4">
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Industrial <span className="text-blue-400">Quality Standards</span></h3>
                <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-4xl">"Registry governance for TQM compliance ensures global interoperability and node-trust within the EnvirosAgro ecosystem."</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: "Standard Purity v3.2", thrust: "Environmental", icon: Dna, desc: "Minimum 98% organic biome match for all registry produce. Mandatory soil DNA sharding every 30 days via Satellite Relay." },
                  { title: "Cold Chain Relay v1.1", thrust: "Industrial", icon: Binary, desc: "Temperature variance must not exceed 2.4% during logistics. ZK-Telemetry sync required at every regional node bridge." },
                  { title: "Fair Social Care v2.0", thrust: "Societal", icon: Heart, desc: "Mandatory worker wellness audits. ESIN nodes with SID load over 40% must initialize immediate remediation before batch release." },
                  { title: "Digital Twin Sync v4.0", thrust: "Technological", icon: Activity, desc: "Real-time biometrics for high-value crops. Bio-electric resonance signatures must be recorded in the Archive Ledger daily." },
                ].map((s, i) => (
                  <div key={i} className="glass-card p-12 rounded-[56px] border-2 border-white/5 bg-black/20 group hover:border-blue-500/30 transition-all flex flex-col justify-between active:scale-[0.98]">
                     <div className="space-y-8">
                        <div className="flex justify-between items-start">
                           <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center shadow-2xl group-hover:bg-blue-600/10 transition-colors border border-white/10 group-hover:rotate-6 transition-transform">
                              <s.icon className="w-10 h-10 text-blue-400" />
                           </div>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 py-1.5 bg-white/5 rounded-full border border-white/10">{s.thrust} THRUST</span>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-none italic">{s.title}</h4>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium italic">"{s.desc}"</p>
                     </div>
                     <div className="mt-12 flex justify-between items-center pt-10 border-t border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Mandate Protocol</span>
                        </div>
                        <button className="p-5 rounded-[24px] bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-90 shadow-xl">
                           <Link2 className="w-6 h-6" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-16 glass-card rounded-[64px] bg-emerald-600/5 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
                   <Award className="w-96 h-96 text-emerald-400" />
                </div>
                <div className="flex items-center gap-10 relative z-10">
                   <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                      <Award className="w-16 h-16 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Steward of Quality</h4>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Earn the global quality shard by maintaining 100% compliance across 5 consecutive crop cycles.</p>
                   </div>
                </div>
                <div className="text-center md:text-right relative z-10 shrink-0">
                   <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">REWARD POOL RESERVE</p>
                   <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">12,500 <span className="text-2xl font-bold">EAC</span></p>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4">Node Payout: Immediate</p>
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

export default TQMGrid;
