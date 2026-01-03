
import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  PlusCircle, 
  Activity, 
  BarChart3, 
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
  Search
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
    { id: 'HUB-01', name: 'Nebraska Logistics Hub', type: 'Primary Hub', load: '65%', lat: '40%', lng: '25%', zone: 'Zone 4' },
    { id: 'WH-82', name: 'Nairobi Storage Node', type: 'Warehouse', load: '22%', lat: '65%', lng: '55%', zone: 'Zone 2' },
    { id: 'PORT-04', name: 'Coastal Transit Point', type: 'Port', load: '88%', lat: '35%', lng: '75%', zone: 'Zone 1' },
    { id: 'NODE-C1', name: 'California Supply Relay', type: 'Distribution', load: '45%', lat: '42%', lng: '15%', zone: 'Zone 2' },
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

      {/* Procurement Map Overlay */}
      {showMap && (
        <div className="fixed inset-0 z-[150] flex flex-col animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl"></div>
          
          {/* Map Header */}
          <div className="relative z-10 p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <MapIcon className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Procurement <span className="text-amber-500">Map</span></h2>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4 text-emerald-400" /> Live Logistics Topology
                </p>
              </div>
            </div>
            <button 
              onClick={() => { setShowMap(false); setOptimizationResult(null); setSelectedMapNode(null); }}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90 border border-white/10"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* The Visual Map Area */}
            <div className="flex-1 relative bg-black/20 overflow-hidden cursor-crosshair group">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(251,191,36,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {/* Glowing Connection Lines (Mock) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 150,150 Q 400,100 600,400" stroke="#f59e0b" strokeWidth="1" fill="none" className="animate-pulse" />
                <path d="M 600,400 Q 800,200 900,500" stroke="#f59e0b" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                <path d="M 250,550 Q 500,450 600,400" stroke="#3b82f6" strokeWidth="1" fill="none" />
              </svg>

              {/* Map Nodes */}
              {mapNodes.map((node) => (
                <div 
                  key={node.id} 
                  style={{ top: node.lat, left: node.lng }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/marker"
                >
                  <button 
                    onClick={() => handleNodeOptimization(node)}
                    className={`p-3 rounded-2xl transition-all shadow-2xl relative z-10 border-2 ${selectedMapNode?.id === node.id ? 'bg-amber-500 border-white scale-125' : 'bg-white/5 border-amber-500/40 hover:bg-amber-500/20 hover:scale-110'}`}
                  >
                    {node.type === 'Primary Hub' ? <Navigation className="w-6 h-6 text-white" /> : node.type === 'Warehouse' ? <Box className="w-5 h-5 text-white" /> : <Truck className="w-5 h-5 text-white" />}
                  </button>
                  
                  {/* Label */}
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                    <p className={`text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full border ${selectedMapNode?.id === node.id ? 'bg-amber-500 text-white border-white/20' : 'bg-black/60 text-slate-400 border-white/5 opacity-0 group-hover/marker:opacity-100 transition-opacity'}`}>
                      {node.name}
                    </p>
                  </div>
                  
                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 rounded-2xl animate-ping opacity-20 pointer-events-none ${node.type === 'Primary Hub' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                </div>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-10 left-10 p-6 glass-card rounded-3xl border-white/10 space-y-4 max-w-xs">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Topology Legend</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg"><Navigation className="w-4 h-4 text-amber-500" /></div>
                    <span className="text-[10px] font-bold text-slate-300">Central Ingest Hub</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Box className="w-4 h-4 text-blue-400" /></div>
                    <span className="text-[10px] font-bold text-slate-300">Storage Distribution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg"><Truck className="w-4 h-4 text-emerald-400" /></div>
                    <span className="text-[10px] font-bold text-slate-300">Transit Path (EOS Verified)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Node Intelligence */}
            <div className="w-full lg:w-[450px] border-l border-white/5 bg-black/40 p-8 flex flex-col space-y-8 overflow-y-auto">
               {!selectedMapNode ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group hover:border-amber-500/30 transition-all">
                       <LocateFixed className="w-12 h-12 text-slate-700 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-white uppercase tracking-widest">Identify Node</h4>
                       <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                          Select a logistics node from the topology to run the EOS Route Optimizer.
                       </p>
                    </div>
                 </div>
               ) : (
                 <div className="animate-in slide-in-from-right-4 duration-500 flex flex-col h-full space-y-8">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase rounded tracking-widest border border-amber-500/20">
                             {selectedMapNode.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 uppercase font-black">{selectedMapNode.id}</span>
                       </div>
                       <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedMapNode.name}</h3>
                       <p className="text-slate-400 text-sm italic">"Geospatial link active in {selectedMapNode.zone}."</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 glass-card rounded-3xl border-white/5 space-y-1">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Node Load</p>
                          <p className="text-xl font-mono font-black text-white">{selectedMapNode.load}</p>
                       </div>
                       <div className="p-5 glass-card rounded-3xl border-white/5 space-y-1">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">U-Metric Sync</p>
                          <p className="text-xl font-mono font-black text-emerald-400">STABLE</p>
                       </div>
                    </div>

                    <div className="flex-1 space-y-6">
                       <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Logistics Oracle Insights</h4>
                       </div>

                       <div className="glass-card rounded-[32px] p-8 border-emerald-500/20 bg-emerald-500/5 relative min-h-[250px] flex flex-col">
                          {!optimizationResult && !isOptimizing ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                               <Route className="w-10 h-10 text-slate-700 opacity-40" />
                               <button 
                                onClick={() => handleNodeOptimization(selectedMapNode)}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                               >
                                  Run Logistics Sweep
                               </button>
                            </div>
                          ) : isOptimizing ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                               <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                               <p className="text-emerald-400 font-black text-[9px] uppercase tracking-widest animate-pulse">Calculating EOS Path...</p>
                            </div>
                          ) : (
                            <div className="prose prose-invert max-w-none text-slate-300 text-xs italic leading-relaxed whitespace-pre-line overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                               {optimizationResult?.text}
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex gap-4">
                       <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                          Trace Relay
                       </button>
                       <button className="flex-1 py-5 agro-gradient rounded-3xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-900/40 hover:scale-105 transition-all">
                          Procure Batch
                       </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Keep existing) */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setShowAddProduct(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card p-1 rounded-[44px] border-amber-500/20 overflow-hidden">
              <div className="bg-[#050706] p-12 space-y-8 min-h-[550px] flex flex-col">
                 <button onClick={() => setShowAddProduct(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                 </button>

                 {subStep === 'form' && (
                   <form onSubmit={handleAddProduct} className="space-y-8 animate-in zoom-in duration-300 flex-1">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-amber-500/10 rounded-[28px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl">
                           <Database className="w-10 h-10 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Registry Sync</h3>
                          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Adding Asset to Marketplace Ledger</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Asset Designation</label>
                            <input type="text" required placeholder="e.g. Bio-Regen Fertilizer V4" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-lg font-bold" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Listing Price (EAC)</label>
                               <input type="number" required placeholder="100.00" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono text-xl" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Initial Stock</label>
                               <input type="text" required placeholder="Quantity / Vol" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white" />
                            </div>
                         </div>
                         <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
                            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
                               Registry fees are dynamic. This listing will burn <span className="text-amber-500 font-bold">25.0 EAC</span> from your treasury node to maintain network equilibrium.
                            </p>
                         </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                         {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                         {isSubmitting ? "COMMITING TO LEDGER..." : "EXECUTE REGISTRY LISTING"}
                      </button>
                   </form>
                 )}

                 {subStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-6 animate-in zoom-in duration-700 text-center">
                      <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                         <CheckCircle2 className="w-14 h-14 text-white" />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Registry Synchronized</h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Asset Marketplace Enabled</p>
                      </div>
                      <div className="w-full glass-card p-10 rounded-[48px] border-white/5 bg-emerald-500/5 space-y-4 text-left">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Registry Hash</span>
                            <span className="text-emerald-400 font-mono text-[11px]">0x{Math.random().toString(16).slice(2, 14)}...</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Industrial Sync</span>
                            <span className="text-white font-bold uppercase">MARKET_READY</span>
                         </div>
                      </div>
                      <button onClick={() => setShowAddProduct(false)} className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Return to Inventory</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VendorPortal;
