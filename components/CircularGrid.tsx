
import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight, 
  Warehouse, 
  ChevronLeft, 
  Gauge, 
  Thermometer, 
  Cpu, 
  Database, 
  Hammer, 
  HardHat, 
  BadgeCheck, 
  ClipboardCheck, 
  ShieldAlert, 
  Calendar, 
  Lock, 
  Maximize,
  ArrowRight,
  FlaskConical,
  Package,
  Droplets,
  Sprout,
  Wind,
  Terminal,
  FileDigit,
  Fingerprint,
  Scale,
  RefreshCw,
  Tag,
  SearchCode
} from 'lucide-react';
import { User } from '../types';
import { auditRecycledItem, chatWithAgroExpert } from '../services/geminiService';

interface CircularGridProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const RETURN_REG_FEE = 25;

const CIRCULAR_REGISTRY = [
  { id: 'REG-X882', name: 'PIVOT ARM', category: 'MACHINERY', grade: 'A-GRADE', potential: 88, status: 'READY', weight: '1.2 Tons', lastNode: 'Node_Paris_04', impact: '+0.12m', isDecommissioned: true },
  { id: 'REG-B104', name: 'SURPLUS ORGANIC HUSK SHARDS', category: 'BIOLOGICALS', grade: 'B-GRADE', potential: 92, status: 'PROCESSING', weight: '450 kg', lastNode: 'Stwd_Nairobi', impact: '+0.05m', isDecommissioned: false },
  { id: 'REG-T042', name: 'RECLAIMED POLY-DRIP NODE', category: 'PLASTICS', grade: 'Γ-GRADE', potential: 74, status: 'TRANSIT', weight: '200 m', lastNode: 'Global_Alpha', impact: '+0.08m', isDecommissioned: false },
  { id: 'REG-S091', name: 'CRACKED SOLAR CELL SHARD', category: 'HARDWARE', grade: 'Ω-GRADE', potential: 45, status: 'AUDITING', weight: '12 Units', lastNode: 'Node_NY_01', impact: '+0.02m', isDecommissioned: false },
  { id: 'REG-W221', name: 'REFURBISHED HYDRO-PUMP', category: 'MACHINERY', grade: 'A-GRADE', potential: 95, status: 'READY', weight: '85 kg', lastNode: 'Local_Edge_P4', impact: '+0.15m', isDecommissioned: false },
  { id: 'REG-M442', name: 'ALUMINIUM FRAMING HUB', category: 'HARDWARE', grade: 'B-GRADE', potential: 82, status: 'READY', weight: '140 kg', lastNode: 'Node_Paris_04', impact: '+0.10m', isDecommissioned: false },
  { id: 'REG-Z991', name: 'DECOMMISSIONED DRONE CHASSIS', category: 'HARDWARE', grade: 'Γ-GRADE', potential: 60, status: 'AUDITING', weight: '2.4 kg', lastNode: 'Node_SF_12', impact: '+0.04m', isDecommissioned: true },
  { id: 'REG-E441', name: 'BIO-POLYMER MULCH ROLL', category: 'PLASTICS', grade: 'B-GRADE', potential: 88, status: 'READY', weight: '500 m', lastNode: 'Stwd_Berlin', impact: '+0.07m', isDecommissioned: false },
  { id: 'REG-H112', name: 'HARVEST RESIDUE PELLETS', category: 'BIOLOGICALS', grade: 'A-GRADE', potential: 97, status: 'READY', weight: '4 Tons', lastNode: 'Zone_4_NE', impact: '+0.20m', isDecommissioned: false },
];

const REFURBISHED_STORE = [
  { id: 'REF-01', name: 'Refurbished Spectral Drone T-02', price: 1200, originalPrice: 2500, cond: 'Certified', icon: Bot, desc: 'Factory reset drone with new battery shards.', authentic: true },
  { id: 'REF-02', name: 'Soil Sensor Node v1.4 (P-Sync)', price: 150, originalPrice: 400, cond: 'Good', icon: Activity, desc: 'Used moisture array recalibrated for Zone 4.', authentic: true },
  { id: 'REF-03', name: 'Drip Pump Controller Shard', price: 85, originalPrice: 200, cond: 'Functional', icon: Wrench, desc: 'Cleaned and verified mechanical relay.', authentic: true },
  { id: 'REF-04', name: 'Modular Greenhouse Relay', price: 450, originalPrice: 900, cond: 'Excellent', icon: Cpu, desc: 'Climate control node with updated firmware.', authentic: true },
];

const CIRCULAR_HUBS = [
  { id: 'HUB-NY-01', name: 'Empire Recycling Node', zone: 'Zone 1 NY', load: 45, lat: '40.7128', lng: '-74.0060', health: 98, throughput: '12 TB/h', items: 1420 },
  { id: 'HUB-NE-04', name: 'Midwest Refurbish Shard', zone: 'Zone 4 NE', load: 12, lat: '41.2565', lng: '-95.9345', health: 99, throughput: '4 TB/h', items: 850 },
  { id: 'HUB-CA-02', name: 'Palo Alto Silicon Compost', zone: 'Zone 2 CA', load: 82, lat: '37.4419', lng: '-122.1430', health: 92, throughput: '32 TB/h', items: 4500 },
];

const REVERSE_CATEGORIES = [
  { id: 'Hardware', icon: Cpu, label: 'IoT & Hardware', desc: 'Sensors, Drones, Hubs', actions: ['Refurbish', 'Reuse'] },
  { id: 'Plastics', icon: Droplets, label: 'Farm Plastics', desc: 'Irrigation, Mulch, Liners', actions: ['Recycle'] },
  { id: 'Biologicals', icon: Sprout, label: 'Bio-Materials', desc: 'Waste, Husks, Organic', actions: ['Recycle'] },
  { id: 'Packaging', icon: Box, label: 'Asset Packaging', desc: 'Tins, Bags, Containers', actions: ['Reuse', 'Recycle'] },
  { id: 'Tools', icon: Wrench, label: 'Steward Tools', desc: 'Mechanical, Handheld', actions: ['Refurbish', 'Reuse'] },
  { id: 'Machinery', icon: Hammer, label: 'Machinery', desc: 'Pumps, Motors, Sprayers', actions: ['Refurbish', 'Reuse'] },
  { id: 'Textiles', icon: Wind, label: 'Agro-Textiles', desc: 'Shade Nets, Covers', actions: ['Recycle'] },
];

const CircularGrid: React.FC<CircularGridProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'returns' | 'market' | 'repair' | 'hubs'>('registry');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnStep, setReturnStep] = useState<'form' | 'audit' | 'physical_req' | 'success'>('form');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditText, setAuditText] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Repair Assistant State
  const [repairInput, setRepairInput] = useState('');
  const [repairStrategy, setRepairStrategy] = useState<string | null>(null);
  const [isSynthesizingRepair, setIsSynthesizingRepair] = useState(false);

  // Return Form State
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('Hardware');
  const [assetUsage, setAssetUsage] = useState('24 Months');
  const [assetCondition, setAssetCondition] = useState('Functional');
  const [mintValue, setMintValue] = useState(0);

  const stats = [
    { label: "Waste Diverted", val: "14.2 Tons", icon: Leaf, col: "text-emerald-400" },
    { label: "Circular EAC Minted", val: "42.8K EAC", icon: Coins, col: "text-amber-500" },
    { label: "Active Return Shards", val: "128 Nodes", icon: RotateCcw, col: "text-blue-400" },
    { label: "Refurb Success Rate", val: "94%", icon: ShieldCheck, col: "text-indigo-400" },
  ];

  const handleReturnInitiate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!onSpendEAC(RETURN_REG_FEE, 'REVERSE_INGEST_REGISTRATION_FEE')) {
      alert("LIQUIDITY ERROR: Insufficient EAC for return registration fee.");
      return;
    }

    setReturnStep('audit');
    setIsAuditing(true);
    
    try {
      const usageData = { 
        category: assetCategory,
        usage: assetUsage, 
        declaredCondition: assetCondition, 
        esin: user.esin 
      };
      const res = await auditRecycledItem(assetName, usageData);
      setAuditText(res.text);
      setMintValue(Math.floor(Math.random() * 40) + 10);
    } catch (err) {
      alert("Oracle Audit Failed. Check node connection.");
      setReturnStep('form');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleRepairAssistant = async () => {
    if (!repairInput.trim()) return;
    setIsSynthesizingRepair(true);
    setRepairStrategy(null);
    try {
       const prompt = `Act as an EnvirosAgro Refurbishment Specialist. Provide a technical repair strategy for the following agricultural hardware fault: "${repairInput}". Focus on restoring m™ constant resilience and industrial reuse compliance.`;
       const res = await chatWithAgroExpert(prompt, []);
       setRepairStrategy(res.text);
    } catch (e) {
       alert("Repair Oracle Interrupted. Check registry signal.");
    } finally {
       setIsSynthesizingRepair(false);
    }
  };

  const finalizeReturnRequest = () => {
    setReturnStep('physical_req');
  };

  const commitToLedger = () => {
    onEarnEAC(mintValue, 'ASSET_RECYCLING_PROVISIONAL');
    setReturnStep('success');
  };

  const buyRefurbished = (item: any) => {
    if (onSpendEAC(item.price, `PURCHASE_REFURB_${item.id}`)) {
      alert(`PURCHASE SUCCESS: ${item.name} has been allocated to node ${user.esin}. Shipment tracking initialized on industrial shard.`);
    }
  };

  const filteredRegistry = CIRCULAR_REGISTRY.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col justify-between shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Recycle className="w-80 h-80 text-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-900/40">
                    <Recycle className="w-10 h-10 text-white" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Circular <span className="text-emerald-400">Hub</span></h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Zero-Waste Protocol V4.2
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
                "Promoting recycling, reusing, and refurbishing to maximize m™ resilience. Every asset in this registry is physically verified before second-life release."
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <button 
                  onClick={() => { setShowReturnModal(true); setReturnStep('form'); }}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                 >
                    <RotateCcw className="w-5 h-5" /> Initialize Return
                 </button>
                 <button 
                  onClick={() => setActiveTab('market')}
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                 >
                    <ShoppingCart className="w-5 h-5" /> Second-Life Store
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between">
           {stats.map((s, i) => (
             <div key={i} className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-2 group hover:border-emerald-500/20 transition-all shadow-lg">
                <s.icon className={`w-6 h-6 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'registry', label: 'Circular Ledger', icon: Archive },
          { id: 'returns', label: 'Reverse Ingest', icon: RotateCcw },
          { id: 'market', label: 'Second-Life Store', icon: PackageSearch },
          { id: 'repair', label: 'Repair Assistant', icon: Hammer },
          { id: 'hubs', label: 'Registry Hubs', icon: MapPin },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setSelectedHub(null); }}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Views */}
      <div className="min-h-[700px]">
        {activeTab === 'registry' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 px-4">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Global <span className="text-emerald-400">Circular Ledger</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Immutable registry of reclaimed industrial assets and bio-materials.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search ledger shards..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-mono"
                   />
                </div>
             </div>

             <div className="glass-card rounded-[40px] overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
                <div className="grid grid-cols-12 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <span className="col-span-5">ASSET IDENTITY SHARD</span>
                   <span className="col-span-2">MATERIAL CATEGORY</span>
                   <span className="col-span-1">GRADE</span>
                   <span className="col-span-2 text-center">RESILIENCE IMPACT</span>
                   <span className="col-span-2 text-right">REGISTRY STATUS</span>
                </div>
                <div className="divide-y divide-white/5">
                   {filteredRegistry.map(asset => (
                      <div key={asset.id} className="grid grid-cols-12 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer">
                         {/* Asset Identity Shard */}
                         <div className="col-span-5 flex items-center gap-8">
                            <div className="p-4 rounded-3xl bg-white/5 group-hover:bg-emerald-600/10 transition-all border border-white/5 shadow-xl relative overflow-hidden">
                               <Package className="w-10 h-10 text-emerald-400 relative z-10" />
                               <div className="absolute inset-0 bg-emerald-400 opacity-5 animate-pulse"></div>
                            </div>
                            <div className="space-y-1">
                               {asset.isDecommissioned && (
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">DECOMMISSIONED</p>
                               )}
                               <p className="text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-none italic">{asset.name}</p>
                               <p className="text-[11px] text-slate-600 font-mono mt-3 font-bold">
                                  {asset.id} <span className="text-slate-800 mx-2">//</span> PREV_NODE: <span className="text-slate-400">{asset.lastNode}</span>
                               </p>
                            </div>
                         </div>

                         {/* Material Category */}
                         <div className="col-span-2">
                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-inner">{asset.category}</span>
                         </div>

                         {/* Grade */}
                         <div className="col-span-1">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                               asset.grade.includes('A') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                               asset.grade.includes('B') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                               'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>{asset.grade}</span>
                         </div>

                         {/* Resilience Impact */}
                         <div className="col-span-2 text-center flex flex-col items-center">
                            <span className="text-3xl font-mono font-black text-emerald-400 tracking-tighter">{asset.impact}</span>
                            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">M™ RESONANCE BOOST</span>
                         </div>

                         {/* Registry Status */}
                         <div className="col-span-2 flex justify-end items-center gap-6">
                            <div className="flex flex-col items-end">
                               <div className="relative flex items-center justify-center">
                                  <div className={`px-5 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest border backdrop-blur-md min-w-[100px] text-center ${
                                     asset.status === 'READY' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 
                                     asset.status === 'PROCESSING' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 animate-pulse' : 
                                     'bg-amber-600/20 text-amber-400 border-amber-500/40'
                                  }`}>
                                     {asset.status}
                                  </div>
                               </div>
                            </div>
                            <button className="p-4 bg-white/5 rounded-2xl text-slate-700 hover:text-white border border-white/5 transition-all active:scale-90 shadow-xl">
                               <Maximize className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   ))}
                   {filteredRegistry.length === 0 && (
                      <div className="p-24 text-center space-y-4 opacity-30">
                         <SearchCode size={64} className="mx-auto text-slate-500" />
                         <p className="text-2xl font-black uppercase tracking-widest italic text-white">No matches in current ledger shard</p>
                      </div>
                   )}
                </div>
                <div className="p-10 bg-black/60 border-t border-white/10 flex justify-between items-center px-14">
                   <div className="flex items-center gap-6">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 shadow-xl"><ShieldCheck size={24} className="text-emerald-400" /></div>
                      <div>
                         <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em]">Registry Integrity Status</p>
                         <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">Validated Registry Shards: {filteredRegistry.length} // Sync Cycle: 12A</p>
                      </div>
                   </div>
                   <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 shadow-2xl group">
                      Request Full Archive Sync <History size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 px-4">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Reverse <span className="text-emerald-400">Ingest Queue</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Monitoring return authenticity across the regional logistics mesh.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { id: 'RET-842', item: 'Used Soil Array S1', status: 'Physically Verified', hub: 'Empire Node', time: '12h ago', eac: '24.50', authentic: true },
                  { id: 'RET-911', item: 'Drone Wing Shard', status: 'Pending Physical Audit', hub: 'Palo Alto Shard', time: '1h ago', eac: '12.00', authentic: false },
                  { id: 'RET-004', item: 'Irrigation Relay C-04', status: 'Physically Verified', hub: 'Midwest Shard', time: '3d ago', eac: '85.40', authentic: true },
                ].map((ret, i) => (
                  <div key={i} className={`glass-card p-8 rounded-[40px] border-2 transition-all flex flex-col h-full active:scale-95 shadow-lg group relative overflow-hidden ${ret.authentic ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : 'border-white/5 bg-black/20'}`}>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`p-4 rounded-2xl ${ret.authentic ? 'bg-emerald-600/10 text-emerald-400' : 'bg-white/5 text-slate-600'} transition-colors`}>
                           <Truck className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                              ret.authentic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                           }`}>
                              {ret.status}
                           </span>
                           {ret.authentic && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40">
                                 <BadgeCheck size={10} />
                                 <span className="text-[7px] font-black uppercase">Authentic</span>
                              </div>
                           )}
                        </div>
                     </div>
                     <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors italic">{ret.item}</h4>
                     <p className="text-[10px] text-slate-500 font-mono tracking-widest flex items-center gap-2">
                        {ret.id} <span className="text-slate-800">|</span> {ret.hub.toUpperCase()}
                     </p>
                     
                     <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end relative z-10">
                        <div>
                           <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Return Credit</p>
                           <p className={`text-xl font-mono font-black ${ret.authentic ? 'text-emerald-400' : 'text-slate-400'}`}>{ret.eac} EAC</p>
                        </div>
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                           <Maximize className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => { setShowReturnModal(true); setReturnStep('form'); }}
                  className="glass-card p-10 rounded-[44px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/40 transition-all group active:scale-95 shadow-xl bg-black/40"
                >
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shadow-2xl ring-1 ring-white/5">
                      <PlusCircle className="w-8 h-8 text-slate-700 group-hover:text-emerald-400" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Initialize New Return</h4>
                      <p className="text-slate-500 text-xs italic max-w-[200px] mx-auto leading-relaxed">Initiate the multi-stage authenticity sharding process.</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 px-4">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Second-Life <span className="text-blue-400">Registry</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Institutional hardware verified by physical audit for secure network reuse.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                   <BadgeCheck className="w-5 h-5 text-emerald-400" />
                   <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-none">100% Physically Audited Stock</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {REFURBISHED_STORE.map(item => (
                  <div key={item.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/20 shadow-xl">
                     <div className="absolute top-4 right-6 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 shadow-lg backdrop-blur-md">
                           <BadgeCheck size={12} />
                           <span className="text-[8px] font-black uppercase">Physically Verified</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-5 rounded-[24px] bg-white/5 group-hover:bg-blue-600/10 transition-colors shadow-2xl">
                           <item.icon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-right pt-2">
                           <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded tracking-widest border border-blue-500/20">{item.cond}</span>
                           <p className="text-[10px] text-slate-500 font-mono mt-2 font-black tracking-widest">SAVE {Math.round((1 - item.price/item.originalPrice)*100)}%</p>
                        </div>
                     </div>
                     
                     <div className="flex-1 relative z-10">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors mb-4 italic leading-none">{item.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{item.desc}"</p>
                     </div>

                     <div className="pt-8 border-t border-white/5 flex items-end justify-between relative z-10">
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Protocol Cost</p>
                           <div className="flex items-center gap-3">
                              <p className="text-3xl font-mono font-black text-white">{item.price.toLocaleString()}</p>
                              <p className="text-xs font-black text-slate-500 line-through">{item.originalPrice.toLocaleString()} EAC</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => buyRefurbished(item)}
                          className="px-8 py-4 bg-blue-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 active:scale-90"
                        >
                           Swap EAC <ChevronRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'repair' && (
           <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in duration-500">
              <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Hammer className="w-96 h-96 text-white" />
                 </div>
                 
                 <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="p-5 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-900/40">
                       <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Repair <span className="text-emerald-400">Assistant Shard</span></h3>
                       <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] mt-2">EOS_MAINTENANCE_ORACLE v3.2</p>
                    </div>
                 </div>

                 {!repairStrategy ? (
                   <div className="space-y-10 relative z-10 animate-in fade-in duration-700">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Describe Hardware Friction</label>
                         <textarea 
                            value={repairInput}
                            onChange={e => setRepairInput(e.target.value)}
                            placeholder="Explain the fault in your spectral drone or sensor array..."
                            className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all h-48 resize-none placeholder:text-slate-800 shadow-inner"
                         />
                      </div>
                      <button 
                        onClick={handleRepairAssistant}
                        disabled={isSynthesizingRepair || !repairInput.trim()}
                        className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                      >
                         {isSynthesizingRepair ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {isSynthesizingRepair ? "Synthesizing Shard..." : "GENERATE REPAIR STRATEGY"}
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-10 relative z-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="p-10 glass-card rounded-[48px] bg-black/80 border-l-8 border-emerald-500/5 prose prose-invert max-w-none shadow-3xl">
                         <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                            <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Oracle Verdict</h4>
                         </div>
                         <div className="text-slate-300 text-lg leading-loose italic whitespace-pre-line font-medium border-l-2 border-white/5 pl-8">
                            {repairStrategy}
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => setRepairStrategy(null)} className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">New Fault Probe</button>
                         <button className="flex-[2] py-6 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all">
                            <CheckCircle2 className="w-6 h-6" /> Commit Refurbishment Shard
                         </button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'hubs' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
             {selectedHub ? (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                   <button onClick={() => setSelectedHub(null)} className="flex items-center gap-2 p-2 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all group/back">
                      <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub Directory</span>
                   </button>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 space-y-10 relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Warehouse className="w-64 h-64 text-white" /></div>
                         <div className="flex items-center gap-6 relative z-10">
                            <div className="p-4 bg-emerald-500 rounded-3xl shadow-xl ring-4 ring-white/5">
                               <Warehouse className="w-10 h-10 text-white" />
                            </div>
                            <div>
                               <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">{selectedHub.name}</h3>
                               <p className="text-emerald-500/60 font-mono text-[10px] tracking-[0.3em] uppercase mt-2">{selectedHub.id} // {selectedHub.zone} // Hub Secured</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-3 gap-8 relative z-10 pt-10 border-t border-white/10">
                            <div><p className="text-[9px] text-slate-500 uppercase font-black mb-1">Health Index</p><p className="text-2xl font-mono font-black text-white">{selectedHub.health}%</p></div>
                            <div><p className="text-[9px] text-slate-500 uppercase font-black mb-1">Throughput</p><p className="text-2xl font-mono font-black text-emerald-400">{selectedHub.throughput}</p></div>
                            <div><p className="text-[9px] text-slate-500 uppercase font-black mb-1">Node Load</p><p className="text-2xl font-mono font-black text-blue-400">{selectedHub.load}%</p></div>
                         </div>
                         <div className="space-y-4 pt-10">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Gauge className="w-4 h-4 text-emerald-400" /> Operational Efficiency Pulse</h4>
                            <div className="h-4 bg-black/40 rounded-full border border-white/5 overflow-hidden p-1 shadow-inner">
                               <div className="h-full agro-gradient rounded-full shadow-[0_0_15px_#10b981]" style={{ width: `${selectedHub.health}%` }}></div>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-6 shadow-xl">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Live Hub Telemetry</h4>
                            <div className="space-y-4">
                               {[
                                 { l: 'Core Thermal', v: '22.4°C', i: Thermometer },
                                 { l: 'Sync Latency', v: '12ms', i: Activity },
                                 { l: 'Ledger State', v: 'LOCKED', i: Database },
                               ].map(t => (
                                 <div key={t.l} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-3"><t.i className="w-4 h-4 text-emerald-400" /><span className="text-[10px] font-bold text-white uppercase">{t.l}</span></div>
                                    <span className="text-xs font-mono font-black text-slate-400">{t.v}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="glass-card rounded-[56px] overflow-hidden relative min-h-[600px] border-white/5 bg-black group shadow-2xl">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200')] bg-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-[8s]"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-[#050706]/40 to-transparent"></div>
                   
                   <div className="relative z-10 p-12 space-y-8 flex flex-col h-full">
                      <div className="flex justify-between items-start">
                         <div className="space-y-2">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Regional <span className="text-amber-500">Reverse Hubs</span></h3>
                            <p className="text-slate-400 text-lg max-xl:text-sm font-medium">Processing and auditing returned industrial shards for the global second-life market.</p>
                         </div>
                         <div className="flex gap-4">
                            <div className="p-6 bg-black/60 rounded-3xl border border-white/10 text-center shadow-xl">
                               <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Global Shard Volume</p>
                               <p className="text-3xl font-mono font-black text-amber-500">842 TB/y</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex-1 relative h-96">
                         {CIRCULAR_HUBS.map(hub => (
                           <div key={hub.id} style={{ top: hub.lat === '40.7128' ? '30%' : hub.lat === '41.2565' ? '45%' : '70%', left: hub.lng === '-74.0060' ? '60%' : hub.lng === '-95.9345' ? '40%' : '20%' }} className="absolute group/hub">
                              <div 
                                onClick={() => setSelectedHub(hub)}
                                className="relative p-5 bg-amber-500 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-pulse cursor-pointer group-hover/hub:scale-125 transition-transform z-10 border-4 border-black"
                              >
                                 <Warehouse className="w-8 h-8 text-black" />
                              </div>
                              <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/hub:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20">
                                 <div className="bg-black border border-amber-500/40 p-6 rounded-[32px] shadow-2xl text-center space-y-1">
                                    <p className="text-sm font-black text-white uppercase tracking-tighter italic">{hub.name}</p>
                                    <p className="text-[10px] text-amber-400 font-mono mt-1 font-black">Sync: OK // LOAD: {hub.load}%</p>
                                 </div>
                              </div>
                              <div className="absolute inset-0 bg-amber-500 rounded-3xl blur-2xl opacity-20 group-hover/hub:opacity-50 animate-ping"></div>
                           </div>
                         ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                         {CIRCULAR_HUBS.map(hub => (
                           <div key={hub.id} onClick={() => setSelectedHub(hub)} className="p-8 bg-black/60 border border-white/5 rounded-[40px] group hover:border-amber-500/40 transition-all cursor-pointer shadow-xl">
                              <div className="flex justify-between items-center mb-4">
                                 <h4 className="text-xl font-black text-white uppercase italic">{hub.id}</h4>
                                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                              </div>
                              <p className="text-[10px] text-slate-500 uppercase font-black mb-6 tracking-widest">{hub.zone} NODE</p>
                              <div className="space-y-3">
                                 <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase">
                                    <span>Shard Throughput</span>
                                    <span className="text-amber-500">{hub.load}%</span>
                                 </div>
                                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-amber-500 shadow-[0_0_100px_#f59e0b] transition-all duration-[2s]`} style={{ width: `${hub.load}%` }}></div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}
      </div>

      {/* Return Ingest Modal - ENHANCED FOR MOBILE */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowReturnModal(false)}></div>
           
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[32px] md:rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              <div className="p-6 md:p-16 space-y-6 md:space-y-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowReturnModal(false)} className="absolute top-6 right-6 md:top-12 md:right-12 p-3 md:p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-5 h-5 md:w-8 md:h-8" /></button>
                 
                 {/* Progress Terminal - Mobile Scaled */}
                 <div className="flex gap-2 mb-2 md:mb-4">
                    {[
                      { l: 'Ingest', s: 'form' },
                      { l: 'Audit', s: 'audit' },
                      { l: 'Eval', s: 'physical_req' },
                      { l: 'Final', s: 'success' },
                    ].map((step, i) => {
                       const stages = ['form', 'audit', 'physical_req', 'success'];
                       const currentIdx = stages.indexOf(returnStep);
                       const isActive = i === currentIdx;
                       const isDone = i < currentIdx;
                       return (
                         <div key={step.s} className="flex-1 flex flex-col gap-1 md:gap-2">
                           <div className={`h-1.5 md:h-2 rounded-full transition-all duration-700 ${isDone ? 'bg-emerald-500' : isActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`}></div>
                           <span className={`text-[6px] md:text-[7px] font-black uppercase text-center tracking-widest ${isActive ? 'text-emerald-400' : 'text-slate-700'}`}>{step.l}</span>
                         </div>
                       );
                    })}
                 </div>

                 {returnStep === 'form' && (
                   <form onSubmit={handleReturnInitiate} className="space-y-6 md:space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-3 md:space-y-6">
                         <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/10 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                            <RotateCcw className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
                         </div>
                         <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0">Asset <span className="text-emerald-400">Return Ingest</span></h3>
                         <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto">Commit your hardware node back to the registry for second-life sharding.</p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                         <div className="space-y-3 md:space-y-4">
                            <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Reverse Category</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                               {REVERSE_CATEGORIES.slice(0, 4).map(cat => (
                                 <button 
                                   key={cat.id}
                                   type="button"
                                   onClick={() => setAssetCategory(cat.id)}
                                   className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border flex flex-col items-center gap-1 md:gap-2 transition-all ${assetCategory === cat.id ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                 >
                                    <cat.icon size={16} />
                                    <div className="text-center">
                                       <p className="text-[8px] md:text-[9px] font-black uppercase truncate w-full">{cat.label}</p>
                                    </div>
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-3 md:space-y-4">
                            <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Asset Designation</label>
                            <input 
                              type="text" 
                              required 
                              value={assetName}
                              onChange={e => setAssetName(e.target.value)}
                              placeholder="Asset Description..." 
                              className="w-full bg-black/60 border border-white/10 rounded-2xl md:rounded-[32px] py-4 md:py-6 px-6 md:px-10 text-lg md:text-2xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800 shadow-inner font-mono" 
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2 md:space-y-4">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Cycle</label>
                               <select 
                                value={assetUsage}
                                onChange={e => setAssetUsage(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-xl md:rounded-[32px] py-3 md:py-6 px-4 md:px-10 text-sm md:text-base text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner"
                               >
                                  <option>0-6 Mo</option>
                                  <option>6-12 Mo</option>
                                  <option>12-24 Mo</option>
                                  <option>24+ Mo</option>
                               </select>
                            </div>
                            <div className="space-y-2 md:space-y-4">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 md:px-6">Integrity</label>
                               <select 
                                value={assetCondition}
                                onChange={e => setAssetCondition(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-xl md:rounded-[32px] py-3 md:py-6 px-4 md:px-10 text-sm md:text-base text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner"
                               >
                                  <option>Functional</option>
                                  <option>Degraded</option>
                                  <option>Faulty</option>
                                  <option>End Life</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Coins className="text-emerald-500" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">Registry Fee</span>
                         </div>
                         <span className="text-xl font-mono font-black text-emerald-500">{RETURN_REG_FEE} EAC</span>
                      </div>

                      <button type="submit" className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[40px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                         <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" /> Initialize {assetCategory} Audit
                      </button>
                   </form>
                 )}

                 {returnStep === 'audit' && (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-right-6 duration-500 h-full">
                       {isAuditing ? (
                         <div className="flex-1 flex flex-col items-center justify-center space-y-8 md:space-y-12 py-10 text-center">
                            <div className="relative">
                               <div className="absolute inset-[-15px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                               <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                  <Bot className="w-14 h-14 md:w-20 md:h-20 text-emerald-400 animate-pulse" />
                               </div>
                            </div>
                            <div className="space-y-2 md:space-y-4">
                               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Digital <span className="text-emerald-400">Auditor</span></h3>
                               <p className="text-emerald-500/60 font-mono text-[10px] md:text-sm animate-pulse uppercase tracking-[0.2em] md:tracking-[0.4em]">Analyzing {assetCategory.toLowerCase()} shards...</p>
                            </div>
                         </div>
                       ) : (
                         <div className="space-y-6 md:space-y-8 flex-1 flex flex-col h-full">
                            <div className="flex items-center gap-4 md:gap-6 border-b border-white/5 pb-6 md:pb-10">
                               <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-xl md:rounded-[28px] flex items-center justify-center border border-blue-500/20 shadow-2xl shrink-0">
                                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                               </div>
                               <div>
                                  <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Digital <span className="text-blue-400">Sync Complete</span></h4>
                                  <p className="text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1 font-mono">
                                     <ShieldCheck className="w-2 h-2 md:w-3 md:h-3" /> Oracle Verified
                                  </p>
                               </div>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-2 md:pr-4">
                               <div className="p-6 md:p-10 bg-black/60 rounded-3xl md:rounded-[48px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-4 border-l-blue-500/50">
                                  <p className="text-slate-300 text-sm md:text-lg leading-relaxed italic whitespace-pre-line font-medium">
                                     {auditText}
                                  </p>
                               </div>
                            </div>

                            <div className="p-4 md:p-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl md:rounded-[40px] flex items-center gap-4 md:gap-8">
                               <AlertTriangle className="w-6 h-6 md:w-10 md:h-10 text-blue-400 shrink-0" />
                               <p className="text-[8px] md:text-[10px] text-blue-200/50 font-black uppercase leading-relaxed tracking-widest text-left">
                                  REGISTRY_LOCK: Final settlement requires a physical evaluation by the EnvirosAgro team.
                                </p>
                            </div>

                            <button 
                              onClick={finalizeReturnRequest}
                              className="w-full py-5 md:py-8 bg-blue-600 rounded-2xl md:rounded-[40px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 md:gap-4 active:scale-95"
                            >
                               <ChevronRight className="w-6 h-6 md:w-8 md:h-8" /> Physical Evaluation
                            </button>
                         </div>
                       )}
                    </div>
                 )}

                 {returnStep === 'physical_req' && (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-right-6 duration-500 h-full justify-center space-y-8 md:space-y-12">
                       <div className="text-center space-y-4 md:space-y-6">
                          <div className="w-20 h-20 md:w-32 md:h-32 bg-amber-500/10 rounded-[24px] md:rounded-[40px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl relative">
                             <HardHat className="w-10 h-10 md:w-16 md:h-16 text-amber-500 animate-bounce" />
                             <div className="absolute inset-0 border-2 md:border-4 border-amber-500/20 rounded-[24px] md:rounded-[40px] animate-ping opacity-40"></div>
                       </div>
                       <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-amber-500">Validation</span></h3>
                       <p className="text-slate-400 text-sm md:text-lg font-medium italic max-sm:text-sm max-w-sm mx-auto leading-relaxed text-center px-4">
                          "Metadata verified. Stewards have been dispatched to verify your {assetCategory.toLowerCase()} biometrics."
                       </p>
                    </div>

                    <div className="p-6 md:p-8 bg-black/60 rounded-3xl md:rounded-[48px] border border-white/5 space-y-4 md:space-y-6 shadow-inner">
                       <div className="flex items-center gap-4">
                          <div className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl">
                             <Calendar className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Audit Window</p>
                             <p className="text-xs md:sm font-bold text-white uppercase font-mono tracking-widest">48 - 72 Hours</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-6">
                       <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-amber-500 shrink-0" />
                       <p className="text-[8px] md:text-[10px] text-amber-200/50 font-bold uppercase tracking-widest leading-relaxed text-left">
                          PROVISIONAL_MINT: {mintValue.toFixed(1)} EAC will be 'ESCROW_LOCKED' until signature commitment.
                       </p>
                    </div>

                    <button 
                      onClick={commitToLedger}
                      className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[48px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 md:gap-4"
                    >
                       <Database className="w-5 h-5 md:w-6 md:h-6" /> COMMIT PROVISIONAL SHARD
                    </button>
                    </div>
                 )}

                 {returnStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-10 md:space-y-16 py-6 md:py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-32 h-32 md:w-48 md:h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                         <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-white group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                      </div>
                      <div className="space-y-2 md:space-y-4">
                         <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">Provisional <span className="text-emerald-400">Sync</span></h3>
                         <p className="text-emerald-50 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] font-mono">Return Hash: 0x772_PROV_{Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
                      </div>
                      <div className="w-full glass-card p-6 md:p-12 rounded-3xl md:rounded-[56px] border-white/5 bg-emerald-500/5 space-y-4 md:space-y-6 text-left relative overflow-hidden shadow-xl">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Activity className="w-24 h-24 md:w-40 md:h-40 text-emerald-400" /></div>
                         <div className="flex justify-between items-center text-[10px] relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Escrowed Credit</span>
                            <span className="text-white font-mono font-black text-2xl md:text-3xl text-emerald-400">+{mintValue.toFixed(1)} EAC</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] relative z-10 pt-3 md:pt-4 border-t border-white/10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Category</span>
                            <span className="text-blue-400 font-black uppercase">{assetCategory}</span>
                         </div>
                      </div>
                      <button onClick={() => setShowReturnModal(false)} className="w-full py-6 md:py-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-[40px] text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
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
