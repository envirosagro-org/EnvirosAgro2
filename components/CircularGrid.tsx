
import React, { useState } from 'react';
import { 
  Recycle, 
  RotateCcw, 
  PackageSearch, 
  Wrench, 
  ShieldCheck, 
  Search, 
  Archive, 
  ShoppingCart, 
  ChevronRight, 
  Activity, 
  Binary, 
  BadgeCheck,
  Bot
} from 'lucide-react';
import { User, Order, VendorProduct } from '../types';

interface CircularGridProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  // Fix: changed onSpendEAC to return Promise<boolean> to match async implementation in App.tsx
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onPlaceOrder: (order: Partial<Order>) => void;
  vendorProducts: VendorProduct[];
}

const CircularGrid: React.FC<CircularGridProps> = ({ user, onEarnEAC, onSpendEAC, onPlaceOrder, vendorProducts }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'registry' | 'repair'>('market');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sourcing circular items exclusively from vendorProducts where supplierType is REVERSE_RETURN
  const circularItems = vendorProducts.filter(p => p.supplierType === 'REVERSE_RETURN');

  const buyRefurbished = (item: VendorProduct) => {
    if (confirm(`INITIALIZE PROCUREMENT: Anchor ${item.name} into the second-life ledger for ${item.price} EAC?`)) {
      onPlaceOrder({
        itemId: item.id,
        itemName: item.name,
        itemType: 'Refurbished ' + item.category,
        itemImage: item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400',
        cost: item.price,
        supplierEsin: item.supplierEsin,
        sourceTab: 'circular'
      });
      alert(`PROCUREMENT PIPELINE INJECTED: Shard successfully registered via Circular Grid. Navigate to TQM Hub to monitor verification.`);
    }
  };

  const filteredItems = circularItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-0">
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
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Circular <span className="text-emerald-400">Grid</span></h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Second-Life Industrial Shards
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
                "Promoting asset circularity to maximize global m™ resilience. All items sourced from the verified Reverse/Return Vendor Registry."
              </p>
           </div>
        </div>
        
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-lg relative overflow-hidden">
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Refurbished Shards</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter">
                {circularItems.length}
              </h4>
           </div>
           <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Reverse Supply Sync: OK
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4 md:ml-4">
        {[
          { id: 'market', label: 'Refurbished Store', icon: PackageSearch },
          { id: 'registry', label: 'Circular Ledger', icon: Archive },
          { id: 'repair', label: 'Repair Assist', icon: Wrench },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px] px-4 md:px-0">
        {activeTab === 'market' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 px-4">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Second-Life <span className="text-blue-400">Inventory</span></h3>
                   <p className="text-slate-500 text-sm font-medium italic">High-integrity industrial assets sourced from the Reverse/Return Registry.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search circular shards..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                  <div key={item.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/20 shadow-xl">
                     <div className="h-48 relative overflow-hidden rounded-3xl mb-8 bg-black/40">
                        {item.image ? (
                           <img src={item.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt={item.name} />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center opacity-20">
                              <Recycle size={64} />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 shadow-lg backdrop-blur-md">
                           <BadgeCheck size={12} />
                           <span className="text-[8px] font-black uppercase">Verified Second-Life</span>
                        </div>
                     </div>
                     
                     <div className="flex-1 relative z-10 space-y-4">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors m-0 italic">{item.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 line-clamp-3">"{item.description}"</p>
                        <div className="flex gap-2">
                           <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/20">{item.category}</span>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-white/5 flex items-end justify-between relative z-10">
                        <div className="space-y-1">
                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Shard Value</p>
                           <p className="text-3xl font-mono font-black text-white">{item.price} <span className="text-sm">EAC</span></p>
                        </div>
                        <button 
                          onClick={() => buyRefurbished(item)}
                          className="px-10 py-5 bg-blue-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-90"
                        >
                           <ShoppingCart size={18} /> Initialize
                        </button>
                     </div>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                   <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-20 border-2 border-dashed border-white/5 rounded-[48px] bg-black/20">
                      <Archive size={48} className="text-slate-600" />
                      <p className="text-lg font-black uppercase tracking-widest text-white">No Reverse/Return Assets Registered</p>
                      <p className="text-xs italic">"Suppliers must register circular assets via the Supplier Command center."</p>
                   </div>
                )}
             </div>
          </div>
        )}
        
        {activeTab !== 'market' && (
           <div className="py-40 text-center opacity-20 border-2 border-dashed border-white/5 rounded-[56px] italic uppercase tracking-[0.4em]">
              Circular Shard Registry Standby.
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

export default CircularGrid;
