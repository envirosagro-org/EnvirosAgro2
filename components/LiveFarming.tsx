import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sprout, Activity, CheckCircle2, ArrowRight, Loader2, MapPin, Zap, ThumbsUp, 
  PlusCircle, Monitor, Clock, TrendingUp, Eye, X, Upload, Bot, Factory, 
  Package, Cpu, Layers, ShieldCheck, ShieldAlert, Database, Terminal, 
  Wifi, Scan, Share2, Sparkles, Gauge, Smartphone, Wrench, 
  SmartphoneNfc, ClipboardList, ClipboardCheck, Target, Plus, ArrowUpRight, Stamp, 
  Workflow, Radio, Fingerprint, Info, ChevronRight, LayoutGrid, 
  Trello, Boxes, LineChart, ShoppingCart, Video, Edit3, Briefcase, Users, FlaskConical,
  Search, BadgeCheck, History, Menu, List
} from 'lucide-react';
import { User, LiveAgroProduct, ViewState } from '../types';

interface LiveFarmingProps {
  user: User;
  products: LiveAgroProduct[];
  setProducts: React.Dispatch<React.SetStateAction<LiveAgroProduct[]>>;
  onEarnEAC: (amount: number, reason: string) => void;
  onSaveProduct: (product: LiveAgroProduct) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  notify: any;
  initialSection?: string | null;
}

const STAGES = ['Inception', 'Processing', 'Quality_Audit', 'Finalization', 'Market_Ready'];

const LiveFarming: React.FC<LiveFarmingProps> = ({ user, products, onSaveProduct, onNavigate, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'terminal'>('ledger');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);

  // New Asset Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Produce' as const });

  // Filter products where the user is the owner
  const myAssets = useMemo(() => products.filter(p => p.stewardEsin === user.esin), [products, user.esin]);
  
  // Currently selected asset in Management Terminal
  const selectedAsset = useMemo(() => 
    products.find(p => p.id === selectedAssetId), 
  [products, selectedAssetId]);

  // Vector Routing Logic: Pick up product ID from navigation
  useEffect(() => {
    if (initialSection) {
      if (initialSection === 'ledger' || initialSection === 'terminal') {
        setActiveTab(initialSection as any);
      } else {
        // Assume initialSection is a Product ID
        setSelectedAssetId(initialSection);
        setActiveTab('terminal');
      }
    }
  }, [initialSection]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name.trim()) return;
    setIsProcessingAction('creating');
    
    const id = `LIVE-${Math.floor(Math.random() * 9000 + 1000)}`;
    const product: LiveAgroProduct = {
      id,
      stewardEsin: user.esin,
      stewardName: user.name,
      productType: newAsset.name,
      category: newAsset.category,
      stage: 'Inception',
      progress: 0,
      votes: 0,
      location: user.location,
      timestamp: new Date().toLocaleTimeString(),
      lastUpdate: 'Just now',
      isAuthentic: false,
      auditStatus: 'Awaiting Ingest',
      tasks: ['Biometric Handshake', 'Moisture Sync'],
      telemetryNodes: [],
      marketStatus: 'Forecasting',
      vouchYieldMultiplier: 1.0,
      evidenceCount: 0,
      isBroadcasting: false,
      isPhysicallyVerified: false,
      isSystemAudited: false
    };

    setTimeout(() => {
      onSaveProduct(product);
      setIsProcessingAction(null);
      setShowAddModal(false);
      setNewAsset({ name: '', category: 'Produce' });
      setSelectedAssetId(id);
      setActiveTab('terminal');
      notify({ title: 'ASSET_INITIALIZED', message: `Industrial thread ${id} anchored to node.`, type: 'success' });
    }, 1200);
  };

  const triggerMandatoryCheck = (type: 'verify' | 'audit') => {
    if (!selectedAsset) return;
    setIsProcessingAction(type);
    
    setTimeout(() => {
      const updated = { 
        ...selectedAsset, 
        [type === 'verify' ? 'isPhysicallyVerified' : 'isSystemAudited']: true,
        progress: Math.min(100, selectedAsset.progress + 25),
        stage: selectedAsset.progress + 25 >= 100 ? 'Finalization' : selectedAsset.stage
      };
      onSaveProduct(updated as LiveAgroProduct);
      setIsProcessingAction(null);
      notify({ 
        title: type === 'verify' ? 'PHYSICAL_VERIFIED' : 'SYSTEM_AUDIT_OK', 
        message: `Industrial shard ${selectedAsset.id} passed qualification.`, 
        type: 'success' 
      });
    }, 2000);
  };

  const handleVouch = (id: string) => {
    const asset = products.find(p => p.id === id);
    if (!asset) return;
    const updated = { ...asset, votes: asset.votes + 1 };
    onSaveProduct(updated);
    notify({ title: 'RESONANCE_VOUCH', message: `Sharding social energy to ${asset.id}.`, type: 'info' });
  };

  const handlePublishToMarket = () => {
    if (!selectedAsset) return;
    const updated = { ...selectedAsset, stage: 'Market_Ready', marketStatus: 'Ready', progress: 100 };
    onSaveProduct(updated as LiveAgroProduct);
    notify({ title: 'MARKET_PUBLISHED', message: `Asset ${selectedAsset.id} is now live in the Market Cloud.`, type: 'success' });
    onNavigate('economy', 'catalogue');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      
      {/* 1. Header & Section Control */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 px-4">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-float">
            <Factory size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Live <span className="text-emerald-400">Processing</span></h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1">Industrial_Finality_Monitor // v6.5</p>
          </div>
        </div>

        <div className="flex p-1.5 glass-card bg-black/40 rounded-3xl border border-white/5 shadow-2xl">
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutGrid size={16} /> Processing Ledger
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'terminal' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            <Monitor size={16} /> Management Terminal
          </button>
        </div>
      </div>

      <div className="min-h-[700px] px-4">
        {activeTab === 'ledger' ? (
          /* SECTION: ASSETS PROCESSING LEDGER (Public View) */
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
            <div className="flex justify-between items-center px-4">
               <div className="flex items-center gap-4">
                  <Activity className="text-emerald-400" />
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic">Global_Inflow_Registry</span>
               </div>
               <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input type="text" placeholder="Search Industrial Threads..." className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full py-40 text-center opacity-20 italic font-black uppercase tracking-widest">Awaiting Registry Inflow...</div>
              ) : products.map(asset => (
                <div key={asset.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 shadow-3xl group relative overflow-hidden flex flex-col h-[520px]">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[12s]"><Database size={250} /></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:rotate-6 transition-all text-emerald-400">
                      {asset.category === 'Produce' ? <Sprout size={28} /> : <Factory size={28} />}
                    </div>
                    <div className="text-right">
                       <span className={`px-4 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl`}>
                          {asset.stage.replace('_', ' ')}
                       </span>
                       <p className="text-[10px] text-slate-700 font-mono mt-2 font-bold">{asset.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors">{asset.productType}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Steward: {asset.stewardName}</p>
                    
                    <div className="pt-6 space-y-4">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
                          <span>Processing Alpha</span>
                          <span className="text-white font-mono">{asset.progress}%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-1000" style={{ width: `${asset.progress}%` }}></div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
                     <div className="p-4 bg-black/60 border border-white/5 rounded-2xl text-center space-y-1 shadow-inner">
                        <p className="text-[8px] text-slate-700 font-black uppercase">Vouches</p>
                        <p className="text-lg font-mono font-black text-emerald-400">{asset.votes}</p>
                     </div>
                     <div className="p-4 bg-black/60 border border-white/5 rounded-2xl text-center space-y-1 shadow-inner">
                        <p className="text-[8px] text-slate-700 font-black uppercase">Evidence</p>
                        <p className="text-lg font-mono font-black text-blue-400">{asset.evidenceCount || 0}</p>
                     </div>
                     <div className="p-4 bg-black/60 border border-white/5 rounded-2xl text-center space-y-1 shadow-inner">
                        <p className="text-[8px] text-slate-700 font-black uppercase">Broadcast</p>
                        <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${asset.isBroadcasting ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_#e11d48]' : 'bg-slate-800'}`}></div>
                     </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                    <button 
                      onClick={() => handleVouch(asset.id)}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl"
                    >
                      <ThumbsUp size={14} /> Vouch Shard
                    </button>
                    <button 
                      onClick={() => { setSelectedAssetId(asset.id); setActiveTab('terminal'); }}
                      className="p-3 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                      title="Inspect Details"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* SECTION: MANAGEMENT TERMINAL (Owner View) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
            
            {/* Sidebar: Owned Asset Selector */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-3xl">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Owned <span className="text-indigo-400">Assets</span></h4>
                   <button 
                    onClick={() => setShowAddModal(true)} 
                    className="p-2 bg-emerald-600 rounded-xl text-white shadow-xl hover:scale-110 transition-all"
                   >
                    <Plus size={18}/>
                   </button>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {myAssets.length === 0 ? (
                    <div className="py-20 text-center opacity-20 italic text-xs uppercase tracking-widest flex flex-col items-center gap-4">
                       <Boxes size={48} />
                       No Active Flows
                    </div>
                  ) : myAssets.map(asset => (
                    <button 
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedAssetId === asset.id ? 'bg-indigo-600 border-white text-white shadow-xl scale-105' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${selectedAssetId === asset.id ? 'text-white' : 'text-indigo-400'}`}>
                            {asset.category === 'Produce' ? <Sprout size={20} /> : <Factory size={20} />}
                         </div>
                         <div>
                            <p className="text-sm font-black uppercase italic leading-none">{asset.productType}</p>
                            <p className="text-[9px] font-mono opacity-50 mt-1 uppercase">{asset.id} // {asset.progress}%</p>
                         </div>
                      </div>
                      {asset.isPhysicallyVerified && asset.isSystemAudited && (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-10 rounded-[48px] border border-blue-500/20 bg-blue-500/5 space-y-4 shadow-xl">
                 <div className="flex items-center gap-3">
                    <Info size={16} className="text-blue-400" />
                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Notice</h5>
                 </div>
                 <p className="text-xs text-slate-500 italic leading-relaxed">
                    "Asset qualification requires successful sharding of physical evidence and an industrial system audit. Market publish is restricted until finality."
                 </p>
              </div>
            </div>

            {/* Main Command Console */}
            <div className="lg:col-span-8">
              {!selectedAsset ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 group opacity-40">
                  <div className="relative">
                    <Monitor size={140} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-1000" />
                    <div className="absolute inset-[-30px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                  </div>
                  <p className="text-3xl font-black uppercase tracking-[0.5em] italic">COMMAND_STANDBY</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in zoom-in duration-500">
                  {/* Asset Identity HUD */}
                  <div className="glass-card p-10 md:p-12 rounded-[64px] border-2 border-white/10 bg-black/60 relative overflow-hidden shadow-3xl">
                     <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8 relative z-10">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 rounded-[28px] bg-indigo-600 shadow-2xl flex items-center justify-center text-white border-4 border-white/10 animate-float">
                              <Edit3 size={32} />
                           </div>
                           <div>
                              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{selectedAsset.productType}</h3>
                              <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-2 uppercase italic font-bold">COMMAND_ID: {selectedAsset.id}</p>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                           <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${selectedAsset.isPhysicallyVerified ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400' : 'bg-rose-600/10 border-rose-500/30 text-rose-500'}`}>
                              {selectedAsset.isPhysicallyVerified ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                              PHYSICAL_VERIFIED
                           </div>
                           <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${selectedAsset.isSystemAudited ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400' : 'bg-rose-600/10 border-rose-500/40 text-rose-500'}`}>
                              {selectedAsset.isSystemAudited ? <BadgeCheck size={12}/> : <History size={12}/>}
                              SYSTEM_AUDITED
                           </div>
                        </div>
                     </div>

                     {/* STRATEGIC TOOLING HUB - Grid of 9 Routing Triggers */}
                     <div className="space-y-6 relative z-10 pt-10 border-t border-white/5">
                        <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] px-4 italic mb-6">STRATEGIC_TOOLING_HUB</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {[
                              { label: 'Ingest Evidence', icon: Upload, target: 'digital_mrv', action: 'ingest', col: 'text-blue-400' },
                              { label: 'Registry Handshake', icon: SmartphoneNfc, target: 'registry_handshake', col: 'text-indigo-400' },
                              { label: 'Network Ingest', icon: Wifi, target: 'ingest', col: 'text-teal-400' },
                              { label: 'Live Broadcast', icon: Video, target: 'media', action: 'PROCESS_STREAM', col: 'text-rose-500' },
                              { label: 'Value Analysis', icon: FlaskConical, target: 'agro_value_enhancement', action: 'synthesis', col: 'text-fuchsia-400' },
                              { label: 'Mission Sync', icon: Briefcase, target: 'contract_farming', col: 'text-amber-500' },
                              { label: 'Collective Hub', icon: Users, target: 'community', action: 'shards', col: 'text-indigo-400' },
                              { label: 'Industrial Pair', icon: Factory, target: 'industrial', action: 'bridge', col: 'text-slate-400' },
                              { label: 'TQM Audit', icon: ClipboardCheck, target: 'tqm', col: 'text-emerald-500' },
                           ].map((tool, i) => (
                              <button 
                                 key={i}
                                 onClick={() => onNavigate(tool.target as ViewState, tool.action)}
                                 className="p-6 bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[32px] flex flex-col items-center text-center gap-4 transition-all group active:scale-95 shadow-lg relative overflow-hidden"
                              >
                                 <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 <tool.icon size={24} className={`${tool.col} group-hover:scale-110 transition-transform relative z-10`} />
                                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white relative z-10">{tool.label}</span>
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* QUALIFICATION GATE TRIGGERS (Mandatory) */}
                     <div className="mt-12 p-8 bg-indigo-950/20 border-2 border-indigo-500/20 rounded-[56px] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none"><Sparkles size={200} className="text-indigo-400" /></div>
                        <div className="flex items-center gap-8 relative z-10">
                           <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-xl"><Bot size={32} /></div>
                           <div className="text-left space-y-1">
                              <h5 className="text-xl font-black text-white uppercase italic m-0">Qualification Gate</h5>
                              <p className="text-slate-500 text-[9px] uppercase font-bold italic tracking-widest">MANDATORY_REGISTRY_VERIFICATION</p>
                           </div>
                        </div>
                        <div className="flex gap-4 relative z-10">
                           <button 
                             onClick={() => triggerMandatoryCheck('verify')}
                             disabled={selectedAsset.isPhysicallyVerified || isProcessingAction === 'verify'}
                             className={`px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${
                               selectedAsset.isPhysicallyVerified ? 'bg-emerald-600 text-white' : 'bg-black border border-white/10 text-slate-400 hover:text-white hover:border-indigo-400'
                             }`}
                           >
                              {isProcessingAction === 'verify' ? <Loader2 size={14} className="animate-spin"/> : selectedAsset.isPhysicallyVerified ? <CheckCircle2 size={14}/> : <Monitor size={14}/>}
                              Physical Verify
                           </button>
                           <button 
                             onClick={() => triggerMandatoryCheck('audit')}
                             disabled={selectedAsset.isSystemAudited || isProcessingAction === 'audit'}
                             className={`px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${
                               selectedAsset.isSystemAudited ? 'bg-emerald-600 text-white' : 'bg-black border border-white/10 text-slate-400 hover:text-white hover:border-indigo-400'
                             }`}
                           >
                              {isProcessingAction === 'audit' ? <Loader2 size={14} className="animate-spin"/> : selectedAsset.isSystemAudited ? <CheckCircle2 size={14}/> : <ClipboardCheck size={14}/>}
                              System Audit
                           </button>
                        </div>
                     </div>

                     {/* PUBLISH TRIGGER */}
                     <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic leading-none">Industrial Readiness</p>
                           <p className="text-3xl font-mono font-black text-emerald-400 leading-none">{selectedAsset.progress}% α</p>
                        </div>
                        <button 
                           onClick={handlePublishToMarket}
                           disabled={!selectedAsset.isPhysicallyVerified || !selectedAsset.isSystemAudited || selectedAsset.stage === 'Market_Ready'}
                           className={`px-16 py-8 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(0,0,0,0.4)] flex items-center justify-center gap-6 transition-all border-4 border-white/10 ${
                              selectedAsset.isPhysicallyVerified && selectedAsset.isSystemAudited && selectedAsset.stage !== 'Market_Ready'
                              ? 'agro-gradient text-white hover:scale-105 active:scale-95 ring-[16px] ring-emerald-500/5' 
                              : 'bg-white/5 text-slate-800 border-white/5 cursor-not-allowed grayscale'
                           }`}
                        >
                           <ArrowUpRight size={28} /> {selectedAsset.stage === 'Market_Ready' ? 'PUBLISHED' : 'PUBLISH TO MARKET'}
                        </button>
                     </div>
                  </div>

                  {/* Task Registry for selected asset */}
                  <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                     <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                        <Trello size={24} className="text-indigo-400" />
                        <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Tasks <span className="text-indigo-400">In-Thread</span></h4>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(selectedAsset.tasks || []).map((task, i) => (
                           <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                 <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">{task}</span>
                              </div>
                              <CheckCircle2 size={16} className="text-emerald-500/40" />
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NEW ASSET REGISTRATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowAddModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2 flex flex-col">
              <div className="p-10 border-b border-white/5 bg-emerald-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl"><PlusCircle size={32} /></div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Register <span className="text-emerald-400">Flow</span></h3>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateAsset} className="p-12 space-y-8 bg-black/40">
                 <div className="space-y-3 px-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Asset Designation</label>
                    <input 
                       type="text" required value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                       placeholder="e.g. High-Yield Maize Inflow..." 
                       className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                    />
                 </div>
                 <div className="space-y-3 px-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Category</label>
                    <div className="grid grid-cols-2 gap-4">
                       {['Produce', 'Manufactured'].map(cat => (
                          <button 
                             key={cat} type="button" onClick={() => setNewAsset({ ...newAsset, category: cat as any })}
                             className={`p-6 rounded-[32px] border-2 transition-all text-xs font-black uppercase tracking-widest ${newAsset.category === cat ? 'bg-emerald-600 border-white text-white scale-105 shadow-2xl' : 'bg-black/60 border-white/5 text-slate-600 hover:border-white/20'}`}
                          >
                             {cat}
                          </button>
                       ))}
                    </div>
                 </div>
                 <button 
                   type="submit"
                   disabled={isProcessingAction === 'creating' || !newAsset.name}
                   className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5"
                 >
                    {isProcessingAction === 'creating' ? <Loader2 size={24} className="animate-spin mx-auto" /> : "INITIALIZE INDUSTRIAL THREAD"}
                 </button>
              </form>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LiveFarming;