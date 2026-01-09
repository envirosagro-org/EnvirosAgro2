
import React, { useState, useRef } from 'react';
import { 
  Recycle, 
  RotateCcw, 
  PackageSearch, 
  Trash2, 
  Wrench, 
  Loader2, 
  ShieldCheck, 
  Coins, 
  Zap, 
  ArrowUpRight, 
  MapPin, 
  Search, 
  Filter, 
  X, 
  Box, 
  PlusCircle, 
  Activity, 
  Globe, 
  Truck, 
  History, 
  Sparkles, 
  Bot, 
  Download,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Layers,
  Archive,
  ShoppingCart,
  // Added missing icons
  ChevronRight,
  Warehouse
} from 'lucide-react';
import { User } from '../types';
import { auditRecycledItem } from '../services/geminiService';

interface CircularGridProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const REFURBISHED_STORE = [
  { id: 'REF-01', name: 'Refurbished Spectral Drone T-02', price: 1200, originalPrice: 2500, cond: 'Certified', icon: Bot, desc: 'Factory reset drone with new battery shards.' },
  { id: 'REF-02', name: 'Soil Sensor Node v1.4 (P-Sync)', price: 150, originalPrice: 400, cond: 'Good', icon: Activity, desc: 'Used moisture array recalibrated for Zone 4.' },
  { id: 'REF-03', name: 'Drip Pump Controller Shard', price: 85, originalPrice: 200, cond: 'Functional', icon: Wrench, desc: 'Cleaned and verified mechanical relay.' },
];

const CIRCULAR_HUBS = [
  { id: 'HUB-NY-01', name: 'Empire Recycling Node', zone: 'Zone 1 NY', load: '45%', lat: '40.7128', lng: '-74.0060' },
  { id: 'HUB-NE-04', name: 'Midwest Refurbish Shard', zone: 'Zone 4 NE', load: '12%', lat: '41.2565', lng: '-95.9345' },
  { id: 'HUB-CA-02', name: 'Palo Alto Silicon Compost', zone: 'Zone 2 CA', load: '82%', lat: '37.4419', lng: '-122.1430' },
];

const CircularGrid: React.FC<CircularGridProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeView, setActiveView] = useState<'returns' | 'market' | 'analytics' | 'hubs'>('returns');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnStep, setReturnStep] = useState<'form' | 'audit' | 'success'>('form');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditText, setAuditText] = useState<string | null>(null);
  
  // Return Form State
  const [assetName, setAssetName] = useState('');
  const [assetUsage, setAssetUsage] = useState('24 Months');
  const [assetCondition, setAssetCondition] = useState('Functional');
  const [mintValue, setMintValue] = useState(0);

  const stats = [
    { label: "Landfilled Diverted", val: "14.2 Tons", icon: Leaf, col: "text-emerald-400" },
    { label: "Circular EAC Minted", val: "42.8K EAC", icon: Coins, col: "text-amber-500" },
    { label: "Active Return Shards", val: "128 Nodes", icon: RotateCcw, col: "text-blue-400" },
    { label: "Refurb Success Rate", val: "94%", icon: ShieldCheck, col: "text-indigo-400" },
  ];

  const handleReturnInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setReturnStep('audit');
    setIsAuditing(true);
    
    try {
      const usageData = { usage: assetUsage, declaredCondition: assetCondition, esin: user.esin };
      const res = await auditRecycledItem(assetName, usageData);
      setAuditText(res.text);
      // Mock parsing reward from text or randomizing
      setMintValue(Math.floor(Math.random() * 40) + 10);
    } catch (err) {
      alert("Oracle Audit Failed. Check node connection.");
    } finally {
      setIsAuditing(false);
    }
  };

  const finalizeReturn = () => {
    onEarnEAC(mintValue, 'ASSET_RECYCLING_CREDIT');
    setReturnStep('success');
  };

  const buyRefurbished = (item: any) => {
    if (onSpendEAC(item.price, `PURCHASE_REFURB_${item.id}`)) {
      alert(`PURCHASE SUCCESS: ${item.name} has been allocated to node ${user.esin}. Shipment tracking initialized on industrial shard.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Recycle className="w-80 h-80 text-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-900/40">
                    <Recycle className="w-10 h-10 text-white" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Circular <span className="text-emerald-400">Grid</span></h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Reverse Supply Chain Protocol Active
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium italic">
                "Promoting recycling, reusing, and refurbishing to maximize agricultural m-Constant efficiency and minimize environmental friction."
              </p>
              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={() => { setShowReturnModal(true); setReturnStep('form'); }}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                 >
                    <RotateCcw className="w-5 h-5" /> Initialize Reverse Ingest
                 </button>
                 <button 
                  onClick={() => setActiveView('market')}
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                 >
                    <ShoppingCart className="w-5 h-5" /> Refurbished Market
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between">
           {stats.map((s, i) => (
             <div key={i} className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-2 group hover:border-emerald-500/20 transition-all">
                <s.icon className={`w-6 h-6 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1 glass-card rounded-[24px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'returns', label: 'Reverse Ingest', icon: RotateCcw },
          { id: 'market', label: 'Refurbished Store', icon: PackageSearch },
          { id: 'analytics', label: 'Circular Impact', icon: Activity },
          { id: 'hubs', label: 'Processing Hubs', icon: MapPin },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeView === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Views */}
      <div className="min-h-[500px]">
        {activeView === 'returns' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Active <span className="text-emerald-400">Return Shards</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Assets currently moving through the reverse logistics pipeline.</p>
                </div>
                <div className="flex gap-4">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input type="text" placeholder="Search return hash..." className="bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { id: 'RET-842', item: 'Used Soil Array S1', status: 'In-Transit', hub: 'Empire Node', time: '12h ago', eac: '24.50' },
                  { id: 'RET-911', item: 'Drone Wing (Structural)', status: 'Auditing', hub: 'Palo Alto Shard', time: '1h ago', eac: '12.00' },
                  { id: 'RET-004', item: 'Irrigation Relay C-04', status: 'Accepted', hub: 'Midwest Shard', time: '3d ago', eac: '85.40' },
                ].map((ret, i) => (
                  <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 group hover:border-emerald-500/30 transition-all flex flex-col h-full active:scale-95">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                           <Truck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                           ret.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                           ret.status === 'Auditing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                           'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                           {ret.status}
                        </span>
                     </div>
                     <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">{ret.item}</h4>
                     <p className="text-[10px] text-slate-500 font-mono tracking-widest flex items-center gap-2">
                        {ret.id} <span className="text-slate-800">|</span> {ret.hub.toUpperCase()}
                     </p>
                     
                     <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
                        <div>
                           <p className="text-[8px] text-slate-600 font-black uppercase">Pending Credit</p>
                           <p className="text-xl font-mono font-black text-emerald-400">{ret.eac} EAC</p>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{ret.time}</p>
                     </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => { setShowReturnModal(true); setReturnStep('form'); }}
                  className="glass-card p-10 rounded-[44px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/40 transition-all group active:scale-95"
                >
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shadow-2xl">
                      <PlusCircle className="w-8 h-8 text-slate-700 group-hover:text-emerald-400" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter">New Return Ingest</h4>
                      <p className="text-slate-500 text-xs italic">De-clutter your farm and earn shards.</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {activeView === 'market' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Second-Life <span className="text-blue-400">Market</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Verified refurbished hardware at up to 60% system discount.</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                   <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none">Seed-Tier Exclusive Pricing Active</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {REFURBISHED_STORE.map(item => (
                  <div key={item.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/20">
                     <div className="flex justify-between items-start mb-8">
                        <div className="p-5 rounded-[24px] bg-white/5 group-hover:bg-blue-600/10 transition-colors">
                           <item.icon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-right">
                           <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded tracking-widest border border-blue-500/20">{item.cond}</span>
                           <p className="text-[10px] text-slate-500 font-mono mt-2 font-black tracking-widest">SAVE {Math.round((1 - item.price/item.originalPrice)*100)}%</p>
                        </div>
                     </div>
                     
                     <div className="flex-1">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors mb-4 italic">{item.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{item.desc}"</p>
                     </div>

                     <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Shard Cost</p>
                           <div className="flex items-center gap-3">
                              <p className="text-3xl font-mono font-black text-white">{item.price.toLocaleString()}</p>
                              <p className="text-xs font-black text-slate-500 line-through">{item.originalPrice.toLocaleString()} EAC</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => buyRefurbished(item)}
                          className="px-8 py-4 bg-blue-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 active:scale-90"
                        >
                           Initialize <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeView === 'hubs' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
             <div className="glass-card rounded-[56px] overflow-hidden relative min-h-[600px] border-white/5 bg-black group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200')] bg-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-[8s]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050706] to-transparent"></div>
                
                <div className="relative z-10 p-12 space-y-8 flex flex-col h-full">
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Regional <span className="text-amber-500">Reverse Hubs</span></h3>
                         <p className="text-slate-400 text-lg max-w-xl">Processing and auditing returned industrial shards for the global registry.</p>
                      </div>
                      <div className="flex gap-4">
                         <div className="p-4 bg-black/60 rounded-3xl border border-white/10 text-center">
                            <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Total Capacity</p>
                            <p className="text-xl font-mono font-black text-amber-500">84 TB/h</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 relative">
                      {CIRCULAR_HUBS.map(hub => (
                        <div key={hub.id} style={{ top: hub.lat === '40.7128' ? '30%' : hub.lat === '41.2565' ? '45%' : '70%', left: hub.lng === '-74.0060' ? '60%' : hub.lng === '-95.9345' ? '40%' : '20%' }} className="absolute group/hub">
                           <div className="relative p-4 bg-amber-500 rounded-2xl shadow-2xl animate-pulse cursor-pointer group-hover/hub:scale-125 transition-transform z-10">
                              <Warehouse className="w-6 h-6 text-black" />
                           </div>
                           <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/hub:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20">
                              <div className="bg-black/80 backdrop-blur-md border border-amber-500/40 p-4 rounded-2xl shadow-2xl text-center">
                                 <p className="text-xs font-black text-white uppercase tracking-tight">{hub.name}</p>
                                 <p className="text-[10px] text-amber-400 font-mono mt-1">Load: {hub.load} // Active</p>
                              </div>
                           </div>
                           <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-xl opacity-20 group-hover/hub:opacity-50 animate-ping"></div>
                        </div>
                      ))}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {CIRCULAR_HUBS.map(hub => (
                        <div key={hub.id} className="p-8 bg-black/60 border border-white/5 rounded-[32px] group hover:border-amber-500/20 transition-all">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-bold text-white uppercase">{hub.id}</h4>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           </div>
                           <p className="text-xs text-slate-500 uppercase font-black mb-6">{hub.zone}</p>
                           <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase">
                                 <span>Processing Load</span>
                                 <span className="text-amber-500">{hub.load}</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b] opacity-60" style={{ width: hub.load }}></div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeView === 'analytics' && (
           <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-10 animate-in zoom-in duration-500">
             <div className="relative">
                <div className="w-40 h-40 rounded-[56px] bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-2xl relative z-10 group hover:rotate-12 transition-transform duration-700">
                   <Activity className="w-16 h-16 text-emerald-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute inset-[-20px] rounded-full border border-white/5 animate-spin-slow"></div>
             </div>
             <div className="max-w-md space-y-4">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Circular <span className="text-emerald-400">Impact Ledger</span></h4>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic">"Every return shard strengthens the m-Constant by reduces ecological entropy."</p>
             </div>
             <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="glass-card p-10 rounded-[40px] border-white/5 text-center space-y-2">
                   <p className="text-[10px] text-slate-500 font-black uppercase">Carbon Shards Offset</p>
                   <p className="text-4xl font-mono font-black text-emerald-400">842.5 <span className="text-xs">Tons</span></p>
                </div>
                <div className="glass-card p-10 rounded-[40px] border-white/5 text-center space-y-2">
                   <p className="text-[10px] text-slate-500 font-black uppercase">Resource Velocity</p>
                   <p className="text-4xl font-mono font-black text-blue-400">1.82x</p>
                </div>
             </div>
             <button className="px-12 py-5 agro-gradient rounded-3xl text-xs font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all">
                Generate Full Impact Shard
             </button>
          </div>
        )}
      </div>

      {/* Return Ingest Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowReturnModal(false)}></div>
           
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300">
              <div className="p-16 space-y-12 min-h-[700px] flex flex-col">
                 <button onClick={() => setShowReturnModal(false)} className="absolute top-12 right-12 p-4 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 {/* Progress */}
                 <div className="flex gap-3 mb-4">
                    {[1,2,3].map(s => (
                      <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-1000 ${
                        (returnStep === 'form' && s === 1) || 
                        (returnStep === 'audit' && s <= 2) || 
                        (returnStep === 'success') ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-white/10'
                      }`}></div>
                    ))}
                 </div>

                 {returnStep === 'form' && (
                   <form onSubmit={handleReturnInitiate} className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-6">
                         <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                            <RotateCcw className="w-12 h-12 text-emerald-400" />
                         </div>
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Reverse <span className="text-emerald-400">Ingest Form</span></h3>
                         <p className="text-slate-400 text-lg font-medium">Declare item specifics to initialize the Oracle audit.</p>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Asset Designation</label>
                            <input 
                              type="text" 
                              required 
                              value={assetName}
                              onChange={e => setAssetName(e.target.value)}
                              placeholder="e.g. Spectral Sensor X-882" 
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800" 
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Service Cycle</label>
                               <select 
                                value={assetUsage}
                                onChange={e => setAssetUsage(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-emerald-500/20"
                               >
                                  <option>0-12 Months</option>
                                  <option>12-24 Months</option>
                                  <option>24-48 Months</option>
                                  <option>48+ Months</option>
                               </select>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Visual Integrity</label>
                               <select 
                                value={assetCondition}
                                onChange={e => setAssetCondition(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-emerald-500/20"
                               >
                                  <option>Functional</option>
                                  <option>Damaged Shard</option>
                                  <option>Mechanical Fail</option>
                                  <option>End of Life</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <button type="submit" className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 mt-6">
                         <Zap className="w-6 h-6 fill-current" /> Initialize Oracle Audit
                      </button>
                   </form>
                 )}

                 {returnStep === 'audit' && (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-right-6 duration-500">
                       {isAuditing ? (
                         <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center">
                            <div className="relative">
                               <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                               <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                  <Bot className="w-20 h-20 text-emerald-400 animate-pulse" />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Circular <span className="text-emerald-400">Auditor</span></h3>
                               <p className="text-emerald-500/60 font-mono text-sm animate-pulse uppercase tracking-[0.4em]">Deconstructing physical entropy...</p>
                            </div>
                         </div>
                       ) : (
                         <div className="space-y-10 flex-1 flex flex-col h-full">
                            <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                               <div className="w-16 h-16 bg-blue-500/10 rounded-[28px] flex items-center justify-center border border-blue-500/20 shadow-2xl shrink-0">
                                  <Archive className="w-8 h-8 text-blue-400" />
                               </div>
                               <div>
                                  <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Refurbishment <span className="text-blue-400">Report</span></h4>
                                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                                     <ShieldCheck className="w-3 h-3" /> Audit Shard 0x771_SYNC
                                  </p>
                               </div>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-4">
                               <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-4 border-l-blue-500/50">
                                  <p className="text-slate-300 text-lg leading-loose italic whitespace-pre-line">
                                     {auditText}
                                  </p>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div className="p-8 glass-card rounded-[32px] border-emerald-500/20 bg-emerald-500/5 space-y-2 text-center">
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recycle Credit</p>
                                  <p className="text-4xl font-mono font-black text-emerald-400">+{mintValue.toFixed(1)} <span className="text-sm">EAC</span></p>
                               </div>
                               <div className="p-8 glass-card rounded-[32px] border-blue-500/20 bg-blue-500/5 space-y-2 text-center">
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pillar Impact</p>
                                  <p className="text-4xl font-mono font-black text-blue-400">+8.5</p>
                               </div>
                            </div>

                            <button 
                              onClick={finalizeReturn}
                              className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                               <CheckCircle2 className="w-8 h-8" /> Authorize Reverse Ingest
                            </button>
                         </div>
                       )}
                    </div>
                 )}

                 {returnStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                         <Recycle className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping"></div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-6xl font-black text-white uppercase tracking-tighter">Reverse Ingest <span className="text-emerald-400">Success</span></h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Asset Unlinked from Node Registry // Credit Minted</p>
                      </div>
                      <div className="w-full glass-card p-12 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-6 text-left relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><ArrowUpRight className="w-40 h-40 text-emerald-400" /></div>
                         <div className="flex justify-between items-center text-xs relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Circular Shard Minted</span>
                            <span className="text-white font-mono font-black text-3xl text-emerald-400">+{mintValue.toFixed(1)} EAC</span>
                         </div>
                         <div className="flex justify-between items-center text-xs relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Steward Resilience</span>
                            <span className="text-white font-black uppercase bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/20 tracking-widest">STABLE_PULSE</span>
                         </div>
                      </div>
                      <button onClick={() => setShowReturnModal(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl">Return to Circular Grid</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CircularGrid;
