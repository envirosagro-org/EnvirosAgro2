
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  Upload, 
  Award, 
  Coins, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Filter, 
  Tag, 
  ArrowUpRight, 
  Info,
  Clock,
  ShieldCheck,
  LayoutGrid,
  Wallet,
  Activity,
  Key,
  X,
  Loader2
} from 'lucide-react';
import { User } from '../types';

interface EconomyProps {
  user: User;
  onMint?: () => void;
}

const MARKET_PRODUCTS = [
  { id: 1, name: 'S-Thrust: Community Heritage Data', price: 450, category: 'Societal', rating: 4.8, description: 'Aggregated anthropological data on Bantu farming lineages.' },
  { id: 2, name: 'H-Thrust: Wellness Masterclass', price: 1200, category: 'Human', rating: 4.9, description: 'Psychology of soil: Training on the mental wellness of agro-stewards.' },
  { id: 3, name: 'Verified Carbon Credits (10t)', price: 850, category: 'Environmental', rating: 5.0, description: 'Immutable carbon offsets from high-resilience regenerative farms.' },
  { id: 4, name: 'T-Thrust: Drone Spectral Pack', price: 2500, category: 'Technological', rating: 4.7, description: 'High-fidelity sensor data for precision yield forecasting.' },
  { id: 5, name: 'I-Thrust: Inventory API Access', price: 320, category: 'Informational', rating: 4.6, description: 'Real-time supply chain data nodes for market integration.' },
  { id: 6, name: 'Agro-Profile Visibility Boost', price: 150, category: 'Service', rating: 4.5, description: 'Increase your U-Score visibility across the Industrial Cloud for 7 days.' },
];

const Economy: React.FC<EconomyProps> = ({ user, onMint }) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'marketplace'>('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Signature Verification Modal
  const [signingProduct, setSigningProduct] = useState<any>(null);
  const [esinSignature, setEsinSignature] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = MARKET_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInitializeProduct = (product: any) => {
    setSigningProduct(product);
  };

  const handleFinalizeTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (esinSignature.toUpperCase() !== user.esin.toUpperCase()) {
      alert("Invalid ESIN Signature. Authentication failed.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      alert(`Transaction Successful! ${signingProduct.name} has been allocated to node ${user.esin}. Settlement recorded on EOS Ledger.`);
      setIsProcessing(false);
      setSigningProduct(null);
      setEsinSignature('');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Signature Modal */}
      {signingProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setSigningProduct(null)}></div>
           <div className="relative z-10 w-full max-w-md glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-950/20 shadow-2xl">
              <div className="text-center mb-8 space-y-4">
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Key className="w-8 h-8 text-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Sign Settlement</h3>
                 <p className="text-slate-400 text-xs leading-relaxed">
                   Enter your <strong>EnvirosAgro Social ID (ESIN)</strong> to authorize this {signingProduct.price} EAC transaction.
                 </p>
              </div>

              <form onSubmit={handleFinalizeTransaction} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">ESIN Signature</label>
                    <input 
                      type="text"
                      required
                      value={esinSignature}
                      onChange={(e) => setEsinSignature(e.target.value)}
                      placeholder="EA-XXXX-XXXX-XXXX"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                 </div>

                 <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setSigningProduct(null)}
                      className="flex-1 py-4 bg-white/5 rounded-2xl text-slate-400 font-bold text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="flex-[2] py-4 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                       {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                       {isProcessing ? "SIGNING..." : "FINALIZE TRANSACTION"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          <Wallet className="w-4 h-4" /> Finance & Mining
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'marketplace' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          <ShoppingBag className="w-4 h-4" /> Agro-Marketplace
        </button>
      </div>

      {activeTab === 'finance' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
          {/* Wallet Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-[32px] bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                <Coins className="w-24 h-24 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl">
                    <Coins className="text-emerald-400 w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">Node: {user.esin.split('-')[2]}</span>
                </div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Registry Liquidity</p>
                <h3 className="text-4xl font-black text-white font-mono">{user.wallet.balance.toFixed(2)} <span className="text-sm font-bold text-emerald-500">EAC</span></h3>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-[32px] space-y-6">
              <h4 className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Mining Activity
              </h4>
              <div className="space-y-4">
                 {[
                   { icon: Zap, label: "Reaction Mining", val: "+12.4 EAC", sub: "Verified 3 research nodes", col: "text-amber-500" },
                   { icon: Upload, label: "Evidence Upload", val: "+45.0 EAC", sub: "Batch #842 certified", col: "text-blue-500" },
                 ].map((act, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                      <div className="flex gap-3">
                         <act.icon className={`w-5 h-5 ${act.col}`} />
                         <div>
                            <p className="text-xs font-bold text-white leading-tight">{act.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 uppercase font-black">{act.sub}</p>
                         </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">{act.val}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="glass-card p-8 rounded-[32px] bg-blue-600/5 border-blue-500/20 flex flex-col justify-between">
              <div>
                <h4 className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Upload-to-Earn</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"Mint EAC tokens by submitting scientific evidence of regenerative growth."</p>
              </div>
              <button 
                onClick={onMint}
                className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                MINT NEW EVIDENCE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card p-8 rounded-[40px] border-white/5">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Treasury Performance
                  </h3>
                  <div className="flex gap-2">
                     <span className="text-[10px] font-black text-slate-500 uppercase px-3 py-1 bg-white/5 rounded-full border border-white/5">Weekly Pulse</span>
                  </div>
               </div>
               <div className="h-64 flex items-end justify-between gap-4 px-4">
                  {[45, 60, 42, 85, 55, 75, 90, 65, 80, 70, 95, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/5 rounded-t-xl relative group hover:bg-emerald-500/20 transition-all cursor-crosshair">
                       <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 rounded-t-xl transition-all duration-1000 group-hover:bg-emerald-400" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-8 px-4 text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em] font-black">
                  <span>TIMESTAMP_START</span>
                  <span>SYNC_POINT</span>
                  <span>TIMESTAMP_END</span>
               </div>
            </div>

            <div className="glass-card p-8 rounded-[40px] bg-emerald-500/5 border-emerald-500/10">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
                 <Zap className="w-5 h-5 text-emerald-400 fill-current" /> Reaction Mining
               </h3>
               <div className="space-y-5">
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-4">"Validate high-resilience research nodes to strengthen network consensus."</p>
                  {[
                    { user: "@BioGreen", activity: "Soil pH Research", val: "High Science", eac: 2.5 },
                    { user: "@AgroDoc", activity: "Pest Diagnostic Log", val: "Critical Data", eac: 4.0 },
                    { user: "@FarmDev", activity: "Irrigation Blueprint", val: "Community Asset", eac: 1.8 },
                  ].map((m, i) => (
                    <div key={i} className="p-5 bg-black/40 rounded-3xl border border-white/5 space-y-4 group hover:border-emerald-500/40 transition-all">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-widest">{m.user}</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-black">+{m.eac} EAC</span>
                       </div>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">{m.activity} • <span className="text-slate-400 font-black">{m.val}</span></p>
                       <div className="flex gap-2 pt-2">
                          <button className="flex-1 py-2 bg-emerald-600/10 text-emerald-400 text-[10px] font-black rounded-xl border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest">VERIFY</button>
                          <button className="flex-1 py-2 bg-rose-600/10 text-rose-400 text-[10px] font-black rounded-xl border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest">REFUTE</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
          {/* Marketplace Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by registry node or thrust..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-700"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex gap-1 p-1 glass-card rounded-2xl">
                {['All', 'Societal', 'Environmental', 'Human', 'Technological', 'Informational'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div key={item.id} className="glass-card rounded-[40px] p-8 group hover:border-emerald-500/30 transition-all relative overflow-hidden flex flex-col h-full active:scale-[0.98]">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-4 bg-emerald-600 rounded-2xl shadow-2xl shadow-emerald-900/40 transform -rotate-12 group-hover:rotate-0 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    {item.category} THRUST
                  </span>
                </div>
                
                <h4 className="text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight tracking-tighter">
                  {item.name}
                </h4>

                <p className="text-xs text-slate-500 leading-loose mb-8 flex-1 font-medium">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 mb-10 bg-white/[0.02] w-fit px-4 py-2 rounded-2xl border border-white/5">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-amber-400' : 'text-slate-800'}`} />
                  ))}
                  <span className="text-[10px] text-slate-500 font-black ml-2 uppercase tracking-widest">{item.rating} Consensus</span>
                </div>

                <div className="flex items-end justify-between pt-8 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Contract Valuation</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-mono font-black text-white">{item.price}</span>
                      <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">EAC</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleInitializeProduct(item)}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/20 transition-all active:scale-95"
                  >
                    Initialize
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Market Integrity Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-white/5 gap-8">
             <div className="flex gap-12">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-emerald-400" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">ZK-Verified Signing</span>
                </div>
                <div className="flex items-center gap-3">
                   <Clock className="w-5 h-5 text-blue-500" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Instant P2P Settlement</span>
                </div>
             </div>
             <p className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.2em] font-black">
                Active Steward ID: {user.esin}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Economy;
