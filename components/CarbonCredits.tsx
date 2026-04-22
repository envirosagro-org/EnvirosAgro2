import React, { useState, useMemo } from 'react';
import { CarbonCredit, User, LiveAgroProduct } from '../types';
import { 
  Leaf, CheckCircle2, AlertCircle, TrendingUp, ShoppingCart, 
  PlusCircle, Search, Filter, ArrowUpRight, Gauge, 
  Wind, Zap, ShieldCheck, History, BarChart3, Globe,
  Scan, Info, ArrowRight, Wallet, History as HistoryIcon,
  BoxSelect, SmartphoneNfc as SmartphoneNfcIcon, Lock, Settings, Copy
} from 'lucide-react';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';
import { SectionTabs } from './SectionTabs';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { useUiStore } from '../store/uiStore';

interface CarbonCreditsProps {
  user: User;
  carbonCredits: CarbonCredit[];
  liveProducts: LiveAgroProduct[];
  onListCredit: (id: string, price: number) => void;
  onBuyCredit: (id: string, buyerEsin: string) => void;
  onMintCredit: (credit: CarbonCredit) => void;
  onNavigate: any;
}

const CarbonCredits: React.FC<CarbonCreditsProps> = ({ 
  user, 
  carbonCredits, 
  liveProducts, 
  onListCredit, 
  onBuyCredit, 
  onMintCredit,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'holdings' | 'marketplace' | 'minting'>('holdings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState(1);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [mintAmount, setMintAmount] = useState(100);
  const { setIsScannerOpen } = useUiStore();

  const myCredits = useMemo(() => 
    carbonCredits.filter(c => c.stewardEsin === user.esin), 
  [carbonCredits, user.esin]);

  const marketCredits = useMemo(() => 
    carbonCredits.filter(c => c.stewardEsin !== user.esin && c.listingStatus === 'LISTED'), 
  [carbonCredits, user.esin]);

  const filteredMarket = marketCredits.filter(c => {
    const product = liveProducts.find(p => p.id === c.assetId);
    return product?.productType.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = {
    totalOffset: myCredits.reduce((acc, c) => acc + c.amount, 0),
    verifiedOffset: myCredits.filter(c => c.verificationStatus === 'VERIFIED').reduce((acc, c) => acc + c.amount, 0),
    tradingVolume: 124500, // Simulated
    marketFloor: 12.5      // Simulated EAC
  };

  const chartData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 61 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 67 },
    { name: 'Sun', value: 72 },
  ];

  const handleMint = () => {
    if (!selectedAssetId) return;
    
    const newCredit: CarbonCredit = {
      id: `CC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      assetId: selectedAssetId,
      stewardEsin: user.esin,
      amount: mintAmount,
      verificationStatus: 'PENDING',
      timestamp: new Date().toISOString(),
      listingStatus: 'UNLISTED'
    };

    onMintCredit(newCredit);
    toast.success('Carbon Credit Minted. Pending verification protocol.');
    setIsMinting(false);
    setMintingStep(1);
  };

  const handleBuy = (id: string, price: number) => {
    if (user.wallet.balance < price) {
      toast.error('Insufficient EAC balance.');
      return;
    }
    onBuyCredit(id, user.esin);
    toast.success('Carbon Credit acquired and anchored.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Carbon Credits Forge" description="EnvirosAgro Carbon Credit Marketplace: Mint, trade, and verify industrial carbon offsets." />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Carbon <span className="text-emerald-400">Market</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Settlement_Hub_v4.2</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'EAC_FLOOR', val: '$12.50', icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'MY_TOTAL', val: `${stats.totalOffset}t`, icon: Leaf, color: 'text-white' },
            { label: 'MESH_NODES', val: '412', icon: Globe, color: 'text-indigo-400' },
            { label: 'ENERGY_RES', val: '99.4%', icon: Zap, color: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-3 rounded-xl border border-white/5 bg-white/5 text-center shadow-inner">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <s.icon size={10} className={s.color} />
                 <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">{s.label}</span>
              </div>
              <p className="text-xs font-black text-white">{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <SectionTabs 
            tabs={[
              { id: 'holdings', label: 'My Shards', icon: HistoryIcon },
              { id: 'marketplace', label: 'Market Feed', icon: ShoppingCart },
              { id: 'minting', label: 'Mint Credits', icon: PlusCircle }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            variant="glass"
          />

          <AnimatePresence mode="wait">
            {activeTab === 'holdings' && (
              <motion.div 
                key="holdings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {myCredits.length === 0 ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl opacity-50">
                    <Wind size={48} className="mb-4 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest italic">Inventory_Empty</p>
                  </div>
                ) : (
                  myCredits.map(credit => {
                    const product = liveProducts.find(p => p.id === credit.assetId);
                    return (
                      <div key={credit.id} className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 hover:bg-white/5 transition-all group overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                           <Leaf size={80} className="text-emerald-500" />
                        </div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                               <Leaf size={18} className="text-emerald-400" />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white uppercase italic truncate max-w-[150px]">{product?.productType || 'Unknown Asset'}</h4>
                               <p className="text-[8px] text-slate-500 font-mono tracking-widest">{credit.id}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border ${credit.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                            {credit.verificationStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                           <div className="space-y-1">
                              <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Quantity</p>
                              <p className="text-xl font-black text-white">{credit.amount}<span className="text-xs text-slate-500 ml-1 italic leading-none">tCO2e</span></p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Origin_Mesh</p>
                              <p className="text-[10px] font-bold text-slate-300 flex items-center justify-end gap-1.5"><Globe size={10} className="text-indigo-400" /> Nairobi-04</p>
                           </div>
                        </div>

                        <div className="flex gap-2">
                           <button className="flex-1 py-3 bg-white/5 hover:bg-white border border-white/5 hover:border-white text-slate-400 hover:text-black rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">VIEW_EVIDENCE</button>
                           {credit.listingStatus !== 'LISTED' && (
                             <button onClick={() => onListCredit(credit.id, 150)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all">LIST_FOR_SALE</button>
                           )}
                           {credit.listingStatus === 'LISTED' && (
                             <div className="flex-1 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center italic">LISTED @ 150 EAC</div>
                           )}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === 'marketplace' && (
              <motion.div 
                key="marketplace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="SEARCH_CO2_SHARDS..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-inner"><Filter size={18} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMarket.map(credit => {
                    const product = liveProducts.find(p => p.id === credit.assetId);
                    return (
                      <div key={credit.id} className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 hover:bg-white/5 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                           <div className="space-y-1">
                              <h4 className="text-md font-black text-white uppercase italic">{product?.productType || 'Industrial Biomass'}</h4>
                              <p className="text-[8px] text-indigo-400 font-mono tracking-widest uppercase">Verified Authority: EA-ALPH-04</p>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-emerald-400 tracking-tighter">{credit.listedPrice} <span className="text-[10px] text-slate-500">EAC</span></p>
                              <p className="text-[7px] text-slate-600 font-black uppercase">Current_Quote</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl mb-6 shadow-inner border border-white/5">
                           <div className="flex items-center gap-3">
                              <Wind className="text-slate-500" size={16} />
                              <div>
                                 <p className="text-[8px] text-slate-500 font-black uppercase">Potency</p>
                                 <p className="text-xs font-black text-white">{credit.amount} tCO2e</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] text-slate-500 font-black uppercase">Node_Resonance</p>
                              <p className="text-xs font-black text-indigo-400">94.2%</p>
                           </div>
                        </div>

                        <button 
                          onClick={() => handleBuy(credit.id, credit.listedPrice || 0)}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3"
                        >
                           ACQUIRE_SHARD <ArrowRight size={14} />
                        </button>
                      </div>
                    );
                  })}
                  {filteredMarket.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-30 italic text-xs font-black uppercase tracking-widest border border-dashed border-white/10 rounded-3xl">No listings in current vector frequency.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'minting' && (
              <motion.div 
                key="minting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div className="glass-card p-10 rounded-[40px] border border-indigo-500/20 bg-black/60 relative overflow-hidden shadow-3xl">
                   {/* Step Visualizer */}
                   <div className="flex items-center justify-between mb-12 relative">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
                      {[1, 2, 3].map(step => (
                        <div 
                          key={step} 
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 ${mintingStep >= step ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-black border-white/10 text-slate-700'}`}
                        >
                           <span className="text-xs font-black font-mono">{step}</span>
                        </div>
                      ))}
                   </div>

                   {mintingStep === 1 && (
                     <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        <div className="text-center space-y-2">
                           <h3 className="text-xl font-black text-white uppercase italic">Select Base Asset</h3>
                           <p className="text-[10px] text-slate-500 font-bold max-w-sm mx-auto uppercase tracking-widest">Identify the industrial process generating verifiable offsets.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {liveProducts.map(p => (
                             <button 
                               key={p.id}
                               onClick={() => setSelectedAssetId(p.id)}
                               className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${selectedAssetId === p.id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-inner' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'}`}
                             >
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAssetId === p.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                                      <BoxSelect size={20} />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest">{p.productType}</p>
                                      <p className="text-[7px] font-mono opacity-50">{p.id}</p>
                                   </div>
                                </div>
                                {selectedAssetId === p.id && <CheckCircle2 size={16} className="text-indigo-400" />}
                             </button>
                           ))}
                        </div>
                        <button 
                          disabled={!selectedAssetId}
                          onClick={() => setMintingStep(2)}
                          className="w-full py-5 bg-white text-black disabled:bg-slate-800 disabled:text-slate-600 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                        >
                           PROCEED_TO_CALIBRATION
                        </button>
                     </div>
                   )}

                   {mintingStep === 2 && (
                     <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        <div className="text-center space-y-2">
                           <h3 className="text-xl font-black text-white uppercase italic">Verifiable Calibration</h3>
                           <p className="text-[10px] text-slate-500 font-bold max-w-sm mx-auto uppercase tracking-widest">Adjust the carbon sequestration potency for this batch.</p>
                        </div>
                        
                        <div className="space-y-6">
                           <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                              <div className="flex justify-between items-center px-2">
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Amount (tonnes)</span>
                                 <span className="text-lg font-black text-indigo-400 font-mono tracking-tighter">{mintAmount} tCO2e</span>
                              </div>
                              <input 
                                type="range" 
                                min="10" 
                                max="1000" 
                                value={mintAmount} 
                                onChange={e => setMintAmount(parseInt(e.target.value))}
                                className="w-full accent-indigo-500 bg-white/5 h-2 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                 {[100, 250, 500].map(val => (
                                   <button 
                                     key={val} 
                                     onClick={() => setMintAmount(val)} 
                                     className="py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[8px] font-black text-slate-400 hover:text-white transition-all uppercase"
                                   >
                                     {val}T
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4">
                              <ShieldCheck className="text-amber-500 shrink-0" size={20} />
                              <p className="text-[9px] text-amber-500/80 italic font-medium leading-relaxed uppercase tracking-widest">
                                Physical shard verification via global scanner REQUIRED for final finality.
                              </p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button onClick={() => setMintingStep(1)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 transition-all">Back</button>
                           <button onClick={() => setMintingStep(3)} className="flex-1 py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/20">FINALIZE_PROTOCOL</button>
                        </div>
                     </div>
                   )}

                   {mintingStep === 3 && (
                     <div className="space-y-10 animate-in slide-in-from-right duration-500 flex flex-col items-center">
                        <div className="text-center space-y-2">
                           <h3 className="text-xl font-black text-white uppercase italic">Execute Anchor</h3>
                           <p className="text-[10px] text-slate-500 font-bold max-w-sm mx-auto uppercase tracking-widest">Connect hardware shard to verify ground-truth evidence.</p>
                        </div>

                        <div className="w-56 h-56 rounded-[56px] border-4 border-dashed border-indigo-500/20 flex items-center justify-center relative group">
                           <Scan size={80} className="text-slate-800 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-700" />
                           <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500/30 animate-scan"></div>
                           <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-[56px] animate-pulse"></div>
                        </div>

                        <div className="w-full space-y-4">
                           <button 
                             onClick={() => setIsScannerOpen(true)}
                             className="w-full py-6 bg-white/5 border-2 border-indigo-500/40 hover:bg-indigo-600 hover:border-indigo-600 rounded-[32px] text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-4 group"
                           >
                              VERIFY_ASSET_SHARD <SmartphoneNfcIcon size={18} className="group-hover:rotate-12 transition-transform" />
                           </button>
                           
                           <button 
                             onClick={handleMint}
                             className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-[12px] uppercase tracking-widest shadow-2xl active:scale-95"
                           >
                              COMMENCE_MINTING_SHARD
                           </button>
                        </div>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <ShieldCheck size={20} />
                      </div>
                      <div>
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Verification</p>
                         <p className="text-[10px] font-black text-white italic">Level_04 (Anchored)</p>
                      </div>
                   </div>
                   <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                         <Zap size={20} />
                      </div>
                      <div>
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Potency</p>
                         <p className="text-[10px] font-black text-white italic">High_Resonance</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Analytics */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="glass-card p-8 rounded-[32px] border border-white/10 bg-black/40 space-y-6 shadow-3xl">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                   <BarChart3 size={16} className="text-indigo-400" /> Matrix_Analytics
                </h3>
                <span className="text-[8px] font-mono text-slate-600">v4.0.2</span>
             </div>

             <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                         <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }} />
                   </AreaChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                   <Leaf size={120} />
                </div>
             </div>

             <div className="space-y-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                   <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                      <span>Total Carbon Offset</span>
                      <span className="text-white">{stats.totalOffset} Tons</span>
                   </div>
                   <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Efficiency</p>
                      <p className="text-sm font-black text-white">92.4%</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Impact Score</p>
                      <p className="text-sm font-black text-indigo-400">88/100</p>
                   </div>
                </div>
             </div>

             <button className="w-full py-4 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-2xl text-[8px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                DOWNLOAD_AUDIT_LEDGER <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>

          <div className="glass-card p-8 rounded-[32px] border border-emerald-500/20 bg-emerald-500/5 space-y-4 shadow-xl">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Sparkles size={22} className="text-emerald-400" />
             </div>
             <div>
                <h4 className="text-sm font-black text-white uppercase italic">Impact Staking</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed uppercase tracking-widest">
                   Lock your carbon shards to anchor network stability and earn high-resonance EAC rewards.
                </p>
             </div>
             <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">START_STAKING_FLOW</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 1"/>
    <path d="m19 3-1 1"/>
    <path d="m5 21 1-1"/>
    <path d="m19 21-1-1"/>
  </svg>
);

export default CarbonCredits;
