
import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  PlusCircle, 
  Activity, 
  ShoppingCart, 
  Truck, 
  Upload, 
  CheckCircle2, 
  X, 
  Loader2, 
  Globe, 
  Database,
  ArrowRight,
  ShieldCheck,
  Tag,
  Leaf,
  Layers,
  Zap,
  Info,
  PackageCheck,
  ClipboardList,
  TrendingUp,
  Map as MapIcon,
  Navigation,
  Box,
  LocateFixed,
  Route,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Radar,
  Link2
} from 'lucide-react';
import { User } from '../types';
import { optimizeSupplyChain, AIResponse } from '../services/geminiService';

interface VendorPortalProps {
  user: User;
}

const VendorPortal: React.FC<VendorPortalProps> = ({ user }) => {
  const [activeView, setActiveView] = useState<'inventory' | 'shipments' | 'ledger'>('inventory');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subStep, setSubStep] = useState<'form' | 'success'>('form');

  // Map States
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<AIResponse | null>(null);
  const [scanPulse, setScanPulse] = useState(0);

  useEffect(() => {
    if (showMap) {
      const interval = setInterval(() => setScanPulse(p => (p + 1) % 100), 100);
      return () => clearInterval(interval);
    }
  }, [showMap]);

  // Vendor Stats
  const stats = [
    { label: "Active Nodes", val: "12", icon: Store, col: "text-amber-500" },
    { label: "Inventory Val.", val: "142K EAC", icon: Package, col: "text-emerald-500" },
    { label: "Order Volume", val: "84 units", icon: ShoppingCart, col: "text-blue-500" },
    { label: "Fulfillment", val: "99.2%", icon: Truck, col: "text-indigo-500" },
  ];

  const activeOrders = [
    { id: 'ORD-842', item: "Bio-Nitrogen Pack x10", zone: "Zone 4 NE", status: "In-Transit", value: "850 EAC", time: "2h ago" },
    { id: 'ORD-912', item: "IoT Soil Sensor Array", zone: "Zone 2 CA", status: "Processing", value: "2,400 EAC", time: "5h ago" },
    { id: 'ORD-104', item: "Regen-Phosphate Bulk", zone: "Zone 1 NY", status: "Out for Delivery", value: "12,400 EAC", time: "8h ago" },
  ];

  const inventoryItems = [
    { name: "Regen-Phosphate Bulk", stock: "450kg", status: "Active", volume: "12,400 EAC", trend: "+4%" },
    { name: "Spectral Drone S-02", stock: "3 Units", status: "Low Stock", volume: "45,000 EAC", trend: "+12%" },
    { name: "Micro-Hydration API", stock: "Infinite", status: "Subscribed", volume: "2,100 EAC", trend: "-2%" },
    { name: "Organic Corn Seed (Lineage)", stock: "1.2 Tons", status: "Active", volume: "8,500 EAC", trend: "+8%" },
  ];

  const mapNodes = [
    { id: 'HUB-01', name: 'Nebraska Logistics Hub', type: 'Primary Hub', load: 65, lat: 30, lng: 60, zone: 'Zone 4' },
    { id: 'WH-82', name: 'Nairobi Storage Node', type: 'Warehouse', load: 22, lat: 65, lng: 55, zone: 'Zone 2' },
    { id: 'PORT-04', name: 'Coastal Transit Point', type: 'Port', load: 88, lat: 35, lng: 75, zone: 'Zone 1' },
    { id: 'NODE-C1', name: 'California Supply Relay', type: 'Distribution', load: 45, lat: 42, lng: 15, zone: 'Zone 2' },
  ];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setSubStep('success');
      setIsSubmitting(false);
    }, 2500);
  };

  const handleNodeOptimization = async (node: any) => {
    setSelectedMapNode(node);
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    const routeData = {
      source: 'Global Registry',
      destination: node.name,
      id: node.id,
      zone: node.zone,
      load: node.load
    };

    const result = await optimizeSupplyChain(routeData);
    setOptimizationResult(result);
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Vendor Hub Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[48px] border-amber-500/20 bg-amber-500/5 relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Store className="w-80 h-80 text-amber-500" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <Store className="w-8 h-8 text-amber-500" />
                 </div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Vendor <span className="text-amber-500">Command</span></h2>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">Manage institutional inventory and supply chain contracts for the EnvirosAgro industrial ledger.</p>
              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={() => { setShowAddProduct(true); setSubStep('form'); }}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                    <PlusCircle className="w-5 h-5" /> Initialize New Registry Entry
                 </button>
                 <button 
                  onClick={() => setShowMap(true)}
                  className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                 >
                    <MapIcon className="w-5 h-5 text-amber-400" /> Procurement Map
                 </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[48px] space-y-4 grid grid-cols-2 gap-4 border-white/5">
           {stats.map((s, i) => (
             <div key={i} className="p-5 glass-card rounded-3xl flex flex-col justify-center items-center text-center space-y-2 group hover:bg-white/5 transition-all">
                <s.icon className={`w-5 h-5 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'inventory', label: 'Inventory Nodes', icon: Package },
          { id: 'shipments', label: 'Supply Chain', icon: Truck },
          { id: 'ledger', label: 'Settlement Ledger', icon: ClipboardList },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeView === 'inventory' && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-left-4 duration-500">
            {inventoryItems.map((item, i) => (
              <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-amber-500/20 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full active:scale-95">
                 <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-amber-500/10 transition-colors">
                       <Tag className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${item.status === 'Low Stock' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>{item.status}</span>
                       <span className="text-[9px] text-slate-600 font-mono mt-1">QTY: {item.stock}</span>
                    </div>
                 </div>
                 
                 <h4 className="text-2xl font-black text-white mb-2 leading-tight tracking-tighter group-hover:text-amber-400 transition-colors flex-1">{item.name}</h4>
                 
                 <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                    <div>
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Contract Value</p>
                       <p className="text-xl font-mono font-black text-white">{item.volume}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-black">
                       <TrendingUp className="w-3 h-3" /> {item.trend}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'shipments' && (
           <div className="lg:col-span-3 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card rounded-[40px] overflow-hidden border-white/5 bg-white/[0.01]">
                 <div className="grid grid-cols-5 p-8 border-b border-white/5 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="col-span-2">Asset & Contract</span>
                    <span>Geo-Target</span>
                    <span>Logistics Pulse</span>
                    <span className="text-right">On-Chain Value</span>
                 </div>
                 <div className="divide-y divide-white/5">
                    {activeOrders.map(order => (
                      <div key={order.id} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group">
                         <div className="col-span-2 flex items-center gap-6">
                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600/10 transition-colors">
                               <PackageCheck className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                               <p className="text-lg font-bold text-white uppercase tracking-tight">{order.item}</p>
                               <p className="text-[10px] text-slate-500 font-mono mt-1">{order.id} // SECURE_RELAY</p>
                            </div>
                         </div>
                         <div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <Globe className="w-3 h-3 text-blue-500" /> {order.zone}
                            </span>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase">
                               <span className="text-blue-400">{order.status}</span>
                               <span className="text-slate-600">82% Sync</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[82%] animate-pulse"></div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-mono font-black text-emerald-400">{order.value}</p>
                            <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">{order.time}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeView === 'ledger' && (
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in duration-500">
             <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-700">
                <ClipboardList className="w-12 h-12 opacity-20" />
             </div>
             <div className="max-w-md space-y-3">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Settlement Ledger</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Immutable historical records of your vendor fulfillment nodes. Synchronize your ESIN to view deep performance audits.</p>
             </div>
             <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sync Auth Node
             </button>
          </div>
        )}
      </div>

      {/* ENHANCED Procurement Map Overlay */}
      {showMap && (
        <div className="fixed inset-0 z-[150] flex flex-col animate-in fade-in duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl"></div>
          
          {/* Scanline Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[160]" style={{ background: 'linear-gradient(transparent 50%, rgba(245,158,11,0.5) 50%)', backgroundSize: '100% 4px' }}></div>

          {/* Map Header */}
          <div className="relative z-[170] p-8 border-b border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Radar className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Procurement <span className="text-amber-500">Telemetry</span></h2>
                <div className="flex items-center gap-3 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Global Sharding Active // Buffer: Optimal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Active Links: {mapNodes.length * 4}
               </div>
               <button onClick={() => setShowMap(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90">
                 <X className="w-10 h-10" />
               </button>
            </div>
          </div>
          
          <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Main Interactive Map Stage */}
            <div className="flex-1 relative bg-black/40 overflow-hidden cursor-crosshair">
               {/* Background Grid and Topography Simulation */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
               <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(245,158,11,0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
               
               {/* Scanning Line */}
               <div className="absolute left-0 right-0 h-1 bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.5)] pointer-events-none z-[165]" style={{ top: `${scanPulse}%` }}></div>

               {/* Simulated Route Sharding Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-[161]">
                  {mapNodes.map((node, i) => (
                     mapNodes.slice(i + 1).map((target, j) => (
                        <line 
                           key={`${i}-${j}`}
                           x1={`${node.lng}%`} y1={`${node.lat}%`}
                           x2={`${target.lng}%`} y2={`${target.lat}%`}
                           stroke="#f59e0b"
                           strokeWidth="0.5"
                           strokeDasharray="4,4"
                           className="animate-pulse"
                        />
                     ))
                  ))}
               </svg>

               {mapNodes.map(node => (
                 <div 
                   key={node.id} 
                   style={{ left: `${node.lng}%`, top: `${node.lat}%` }} 
                   className="absolute -translate-x-1/2 -translate-y-1/2 group/node z-[162]"
                 >
                    <div 
                      onClick={() => handleNodeOptimization(node)}
                      className={`relative p-5 rounded-[24px] cursor-pointer transition-all duration-500 ${selectedMapNode?.id === node.id ? 'bg-amber-500 text-black scale-125 shadow-[0_0_50px_rgba(245,158,11,0.5)] ring-4 ring-amber-500/20' : 'bg-black/60 border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black hover:scale-110'}`}
                    >
                       <LocateFixed className={`w-8 h-8 ${selectedMapNode?.id === node.id ? 'animate-spin-slow' : ''}`} />
                       
                       {/* Node Radar Pulse */}
                       <div className="absolute inset-0 rounded-[24px] border-2 border-amber-500/40 animate-ping opacity-20 pointer-events-none scale-150"></div>
                       
                       {/* Telemetry Label */}
                       <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none whitespace-nowrap z-[180]">
                          <div className="bg-[#0a0a0a] backdrop-blur-2xl border border-amber-500/40 p-5 rounded-[24px] shadow-2xl text-center space-y-2 ring-1 ring-white/10">
                             <p className="text-sm font-black text-white uppercase tracking-tighter italic leading-none">{node.name}</p>
                             <div className="h-px w-full bg-white/10"></div>
                             <p className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">{node.type} // LOAD: {node.load}%</p>
                             <div className="flex justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                   <div key={i} className={`w-1 h-3 rounded-full ${i < (node.load/20) ? 'bg-amber-500' : 'bg-white/10'}`}></div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}

               {/* Map Global Legend Overlay */}
               <div className="absolute bottom-8 left-8 glass-card p-6 rounded-[32px] border-white/5 bg-black/60 backdrop-blur-xl z-[170] space-y-4">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-3">Logistics Infrastructure</h5>
                  <div className="space-y-3">
                     {[
                        { label: 'Primary Ingest Hub', icon: Radar, color: 'text-amber-500' },
                        { label: 'Verified Route Shard', icon: Link2, color: 'text-emerald-500' },
                        { label: 'Satellite Relay Link', icon: Globe, color: 'text-blue-400' },
                     ].map(l => (
                        <div key={l.label} className="flex items-center gap-4 group cursor-default">
                           <l.icon className={`w-4 h-4 ${l.color} group-hover:scale-110 transition-transform`} />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{l.label}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sidebar Telemetry & Optimization Control */}
            <div className="w-full lg:w-[480px] border-l border-white/5 flex flex-col bg-[#050706] z-[170]">
               <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                  {!selectedMapNode ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-30 animate-in fade-in duration-700">
                       <div className="w-32 h-32 rounded-full border-4 border-dashed border-amber-500/20 flex items-center justify-center">
                          <Navigation className="w-16 h-16 text-amber-500 animate-pulse" />
                       </div>
                       <div className="max-w-xs space-y-4">
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Selection <span className="text-amber-500">Lock Required</span></h4>
                          <p className="text-sm text-slate-500 italic leading-relaxed">Probe the procurement grid map to initialize deep-shard logistics optimization.</p>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-12 animate-in slide-in-from-right-6 duration-500">
                       <div className="space-y-6">
                          <button onClick={() => setSelectedMapNode(null)} className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors group">
                             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Deselect Node</span>
                          </button>
                          
                          <div className="flex items-center gap-6">
                             <div className="w-20 h-20 rounded-[32px] bg-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] shrink-0">
                                <Route className="w-10 h-10 text-black" />
                             </div>
                             <div>
                                <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedMapNode.name}</h4>
                                <div className="flex items-center gap-3 mt-4">
                                   <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">{selectedMapNode.id}</span>
                                   <span className="text-slate-700 font-mono text-[10px]">||</span>
                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedMapNode.zone}</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 glass-card rounded-[32px] border-white/5 space-y-2">
                             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Regional Load</p>
                             <p className="text-3xl font-mono font-black text-white">{selectedMapNode.load}%</p>
                          </div>
                          <div className="p-6 glass-card rounded-[32px] border-white/5 space-y-2">
                             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Node Status</p>
                             <p className="text-3xl font-mono font-black text-emerald-400">ACTIVE</p>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="flex items-center justify-between px-2">
                             <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Logistics Oracle v3.2</h5>
                             <Zap className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
                          </div>
                          
                          {isOptimizing ? (
                            <div className="flex flex-col items-center py-16 space-y-8 glass-card rounded-[48px] bg-white/[0.02] border-white/5">
                               <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
                               <div className="text-center space-y-2">
                                  <p className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Calculating Path Shards...</p>
                                  <p className="text-slate-700 font-mono text-[9px]">DECONSTRUCTING ENTROPY_ID: #882_OPT</p>
                               </div>
                            </div>
                          ) : optimizationResult ? (
                            <div className="space-y-8 animate-in zoom-in duration-500">
                               <div className="p-10 glass-card rounded-[48px] bg-white/[0.01] border-l-4 border-l-amber-500/50 relative shadow-2xl">
                                  <div className="absolute top-6 right-8 opacity-20"><Sparkles className="w-8 h-8 text-amber-500" /></div>
                                  <div className="prose prose-invert max-w-none">
                                     <p className="text-slate-300 text-lg leading-loose italic whitespace-pre-line font-medium">
                                        {optimizationResult.text}
                                     </p>
                                  </div>
                               </div>
                               <button className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                  <CheckCircle2 className="w-6 h-6" /> Deploy Optimized Shard
                               </button>
                            </div>
                          ) : (
                            <div className="space-y-8">
                               <div className="p-8 bg-black/40 rounded-[40px] border border-white/5 text-center space-y-4">
                                  <p className="text-slate-500 text-sm italic leading-relaxed">
                                     Invoke the AI Supply Oracle to analyze path density, weather vectors, and m™ resilience signatures for this node.
                                  </p>
                               </div>
                               <button 
                                 onClick={() => handleNodeOptimization(selectedMapNode)}
                                 className="w-full py-8 bg-amber-600 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-900/40 hover:bg-amber-500 transition-all flex items-center justify-center gap-4 group active:scale-95"
                               >
                                  <Radar className="w-6 h-6 group-hover:rotate-45 transition-transform" /> 
                                  Initialize Route Sweep
                               </button>
                            </div>
                          )}
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="p-8 border-t border-white/5 bg-black/40 flex items-center gap-6 group hover:bg-amber-500/5 transition-colors">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-amber-400 transition-colors shrink-0">
                     <Info className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic uppercase font-black tracking-widest">
                     "Network resilience peaks when supply nodes are balanced across regional shards."
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowAddProduct(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.15)] animate-in zoom-in duration-300">
              <div className="p-16 space-y-12 min-h-[650px] flex flex-col">
                 <button onClick={() => setShowAddProduct(false)} className="absolute top-12 right-12 p-4 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 {subStep === 'form' ? (
                   <form onSubmit={handleAddProduct} className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-6">
                         <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl">
                            <Package className="w-12 h-12 text-amber-500" />
                         </div>
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Asset <span className="text-amber-500">Registry Ingest</span></h3>
                         <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Commit a new product or contract node to the industrial supply ledger.</p>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Product Designation</label>
                            <input type="text" required placeholder="e.g. Bio-Phosphate Multi-Pack" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-4 focus:ring-amber-500/20 outline-none transition-all placeholder:text-slate-800" />
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">System Value (EAC)</label>
                               <input type="number" required placeholder="1000" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-mono text-xl focus:ring-4 focus:ring-amber-500/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Node Quantity</label>
                               <input type="text" required placeholder="50 Units" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold focus:ring-4 focus:ring-amber-500/20 outline-none transition-all" />
                            </div>
                         </div>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 mt-6">
                         {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-6 h-6" />}
                         {isSubmitting ? "COMMITING TO SHARDS..." : "AUTHORIZE REGISTRY MINT"}
                      </button>
                   </form>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                         <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping"></div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-6xl font-black text-white uppercase tracking-tighter">Registry <span className="text-emerald-400">Success</span></h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Asset Hash: 0x772_VND_MNT_#{(Math.random()*1000).toFixed(0)}</p>
                      </div>
                      <div className="w-full glass-card p-12 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-6 text-left relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Box className="w-40 h-40 text-emerald-400" /></div>
                         <div className="flex justify-between items-center text-xs relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Shard Status</span>
                            <span className="text-white font-mono font-black text-emerald-400 uppercase">ACTIVE_INGRESS</span>
                         </div>
                         <div className="flex justify-between items-center text-xs relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Trust Vouch</span>
                            <span className="text-white font-black uppercase bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/20 tracking-widest">NODE_VERIFIED</span>
                         </div>
                      </div>
                      <button onClick={() => setShowAddProduct(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl">Return to Terminal</button>
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
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default VendorPortal;
