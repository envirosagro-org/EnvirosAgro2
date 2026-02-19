
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sprout, Activity, CheckCircle2, ArrowRight, Loader2, MapPin, Zap, ThumbsUp, 
  PlusCircle, Monitor, Clock, TrendingUp, Eye, X, Upload, Bot, Factory, 
  Package, Cpu, Layers, ShieldCheck, ShieldAlert, Database, Terminal, 
  Wifi, Scan, Share2, Sparkles, Gauge, Smartphone, Wrench, 
  SmartphoneNfc, ClipboardList, ClipboardCheck, Target, Plus, ArrowUpRight, Stamp, 
  Workflow, Radio, Fingerprint, Info, ChevronRight, LayoutGrid, 
  Trello, Boxes, LineChart, ShoppingBag, Video, Edit3, Briefcase, Users, FlaskConical,
  Search, BadgeCheck, History, Menu, List, CheckCircle, AlertTriangle, Hammer, Link2,
  TableProperties, Shield
} from 'lucide-react';
import { User, LiveAgroProduct, ViewState, AgroResource } from '../types';

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

const LiveFarming: React.FC<LiveFarmingProps> = ({ user, products, onSaveProduct, onNavigate, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'terminal'>('ledger');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);
  const [isLinkingResource, setIsLinkingResource] = useState<string | null>(null);

  // New Asset Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Produce' as const });

  // Filter products where the user is the owner
  const myAssets = useMemo(() => products.filter(p => p.stewardEsin === user.esin), [products, user.esin]);
  
  // Currently selected asset in Management Terminal
  const selectedAsset = useMemo(() => 
    products.find(p => p.id === selectedAssetId), 
  [products, selectedAssetId]);

  useEffect(() => {
    if (initialSection) {
      if (initialSection === 'ledger' || initialSection === 'terminal') {
        setActiveTab(initialSection as any);
      } else {
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
      tasks: ['Biometric Handshake', 'Moisture Sync', 'Initial Inflow Audit', 'Geofence Verification'],
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

  const handleLinkResource = (resource: AgroResource) => {
    if (!selectedAsset) return;
    const updated = {
      ...selectedAsset,
      telemetryNodes: [...(selectedAsset.telemetryNodes || []), resource.id],
      progress: Math.min(100, selectedAsset.progress + 10)
    };
    onSaveProduct(updated as LiveAgroProduct);
    setIsLinkingResource(null);
    notify({ 
      title: 'SHARD_LINKED', 
      message: `${resource.name} associated with ${selectedAsset.id}.`, 
      type: 'success',
      actionIcon: 'Link2'
    });
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

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto">
      
      {/* 1. Header & Section Control */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 px-4">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <Factory size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Live <span className="text-emerald-400">Farming</span></h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1">Industrial_Finality_Monitor // v6.5</p>
          </div>
        </div>

        <div className="flex p-1.5 glass-card bg-black/40 rounded-3xl border border-white/5">
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ledger' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            Processing Ledger
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'terminal' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            Management Terminal
          </button>
        </div>
      </div>

      <div className="min-h-[700px] px-4">
        {activeTab === 'ledger' ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map(asset => (
                <div key={asset.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 shadow-3xl group relative overflow-hidden flex flex-col h-[520px]">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[12s]"><Database size={250} /></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-emerald-400">
                      {asset.category === 'Produce' ? <Sprout size={28} /> : <Factory size={28} />}
                    </div>
                    <div className="text-right">
                       <span className={`px-4 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest`}>
                          {asset.stage.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight">{asset.productType}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Steward: {asset.stewardName}</p>
                    <div className="pt-6 space-y-4">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
                          <span>Processing Alpha</span>
                          <span className="text-white font-mono">{asset.progress}%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${asset.progress}%` }}></div>
                       </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                    <button onClick={() => handleVouch(asset.id)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-emerald-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <ThumbsUp size={14} /> Vouch Shard
                    </button>
                    <button onClick={() => { setSelectedAssetId(asset.id); setActiveTab('terminal'); }} className="p-3 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-3xl">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Owned <span className="text-indigo-400">Assets</span></h4>
                   <button onClick={() => setShowAddModal(true)} className="p-2 bg-emerald-600 rounded-xl text-white shadow-xl hover:scale-110 transition-all"><Plus size={18}/></button>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {myAssets.map(asset => (
                    <button 
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedAssetId === asset.id ? 'bg-indigo-600 border-white text-white shadow-xl' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20'}`}
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
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              {!selectedAsset ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-10 group opacity-40">
                  <Monitor size={140} className="text-slate-500" />
                  <p className="text-3xl font-black uppercase tracking-[0.5em] italic">COMMAND_STANDBY</p>
                </div>
              ) : (
                <div className="space-y-10 animate-in zoom-in duration-500">
                  {/* Protocol Notice */}
                  <div className="p-8 rounded-[48px] bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                       <Info size={24} />
                    </div>
                    <div className="space-y-2 relative z-10">
                       <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Protocol Notice</h4>
                       <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                          "Asset qualification requires successful sharding of physical evidence and an industrial system audit. Market publish is restricted until finality."
                       </p>
                    </div>
                  </div>

                  <div className="glass-card p-12 md:p-14 rounded-[64px] border-2 border-white/10 bg-black/60 relative overflow-hidden shadow-3xl">
                     <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
                        <div className="flex items-center gap-8">
                           <div className="w-24 h-24 rounded-[36px] bg-indigo-600 shadow-2xl flex items-center justify-center text-white border-4 border-white/10 animate-float overflow-hidden relative">
                              <Edit3 size={44} className="relative z-10" />
                              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                                {selectedAsset.productType}
                              </h3>
                              <p className="text-[10px] text-slate-500 font-mono tracking-[0.6em] mt-3 uppercase italic font-black">COMMAND_ID: {selectedAsset.id}</p>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                           <div className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${selectedAsset.isPhysicallyVerified ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400' : 'bg-black/60 border-white/10 text-slate-700'}`}>
                              {selectedAsset.isPhysicallyVerified ? <ShieldCheck size={14}/> : <Info size={14}/>}
                              PHYSICAL_VERIFIED
                           </div>
                           <div className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${selectedAsset.isSystemAudited ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400' : 'bg-black/60 border-white/10 text-slate-700'}`}>
                              {selectedAsset.isSystemAudited ? <BadgeCheck size={14}/> : <Info size={14}/>}
                              SYSTEM_AUDITED
                           </div>
                        </div>
                     </div>

                     {/* STRATEGIC TOOLING HUB */}
                     <div className="space-y-8 relative z-10 pt-10 border-t border-white/5">
                        <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] italic mb-8">STRATEGIC_TOOLING_HUB</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                                 onClick={() => {
                                    if (tool.label.includes('Ingest') || tool.label.includes('Handshake')) {
                                       setIsLinkingResource(tool.label);
                                    } else {
                                       onNavigate(tool.target as ViewState, tool.action);
                                    }
                                 }}
                                 className="p-10 bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[48px] flex flex-col items-center text-center gap-5 transition-all group active:scale-95 shadow-xl"
                              >
                                 <tool.icon size={36} className={`${tool.col} group-hover:scale-110 transition-transform`} />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{tool.label}</span>
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="mt-16 p-10 bg-indigo-900/10 border-2 border-indigo-500/20 rounded-[64px] flex flex-col items-center justify-center gap-12 shadow-4xl relative overflow-hidden">
                        <div className="flex items-center gap-10 relative z-10 text-center flex-col sm:flex-row">
                           <div className="w-24 h-24 rounded-[40px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl animate-float shrink-0 ring-8 ring-indigo-500/5">
                              <Bot size={48} />
                           </div>
                           <div className="text-left space-y-2">
                              <h5 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Qualification Gate</h5>
                              <p className="text-slate-500 text-[11px] uppercase font-black italic tracking-[0.4em]">MANDATORY_REGISTRY_VERIFICATION</p>
                           </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full max-w-2xl">
                           <button 
                             onClick={() => triggerMandatoryCheck('verify')}
                             disabled={selectedAsset.isPhysicallyVerified || isProcessingAction === 'verify'}
                             className={`flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all border-2 ${
                               selectedAsset.isPhysicallyVerified ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600'
                             }`}
                           >
                              {isProcessingAction === 'verify' ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>}
                              {selectedAsset.isPhysicallyVerified ? 'PHYSICAL_VERIFIED' : 'PHYSICAL VERIFY'}
                           </button>
                           <button 
                             onClick={() => triggerMandatoryCheck('audit')}
                             disabled={selectedAsset.isSystemAudited || isProcessingAction === 'audit'}
                             className={`flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all border-2 ${
                               selectedAsset.isSystemAudited ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600'
                             }`}
                           >
                              {isProcessingAction === 'audit' ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>}
                              {selectedAsset.isSystemAudited ? 'SYSTEM_AUDITED' : 'SYSTEM AUDIT'}
                           </button>
                        </div>
                     </div>

                     <div className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center relative z-10 gap-10">
                        <div className="text-center md:text-left space-y-4">
                           <p className="text-[12px] text-slate-700 font-black uppercase tracking-[0.6em] italic leading-none">INDUSTRIAL_READINESS</p>
                           <div className="flex items-baseline gap-4 justify-center md:justify-start">
                              <p className="text-9xl font-mono font-black text-emerald-400 leading-none m-0 p-0">{selectedAsset.progress}</p>
                              <span className="text-5xl font-black text-white italic font-sans m-0">%</span>
                              <span className="text-4xl text-emerald-900 font-black italic ml-2">α</span>
                           </div>
                        </div>
                        <button 
                           disabled={!selectedAsset.isPhysicallyVerified || !selectedAsset.isSystemAudited}
                           className={`px-24 py-12 rounded-full font-black text-xl uppercase tracking-[0.8em] shadow-[0_0_120px_rgba(0,0,0,0.5)] flex items-center justify-center gap-10 transition-all border-4 ${
                              selectedAsset.isPhysicallyVerified && selectedAsset.isSystemAudited 
                              ? 'agro-gradient text-white hover:scale-[1.02] active:scale-95 ring-[32px] ring-emerald-500/5 border-white/20' 
                              : 'bg-black border-white/5 text-slate-800 cursor-not-allowed grayscale'
                           }`}
                        >
                           <ArrowUpRight size={44} /> PUBLISHED
                        </button>
                     </div>
                  </div>

                  <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 space-y-12 shadow-4xl">
                     <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                        <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/30 text-indigo-400">
                           <TableProperties size={28} />
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Tasks <span className="text-indigo-400">In-Thread</span></h4>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        {(selectedAsset.tasks || []).map((task, i) => (
                           <div key={i} className="p-10 bg-black/80 border-2 border-white/5 rounded-[40px] flex items-center justify-between group/task hover:border-emerald-500/30 transition-all">
                              <div className="flex items-center gap-8">
                                 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                                    <Target size={24} />
                                 </div>
                                 <div className="space-y-1">
                                    <h5 className="text-2xl font-black text-slate-300 uppercase italic tracking-tight">{task}</h5>
                                    <p className="text-[10px] text-slate-700 font-mono uppercase tracking-[0.2em]">VERIFICATION_PENDING // 0x882A</p>
                                 </div>
                              </div>
                              <div className="p-4 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-xl">
                                 <CheckCircle size={24} />
                              </div>
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

      {/* METADATA LINKING MODAL */}
      {isLinkingResource && selectedAsset && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsLinkingResource(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-[0_0_200px_rgba(0,0,0,0.9)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 border-b border-white/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl">
                       <Link2 size={40} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Link <span className="text-indigo-400">Metadata</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[11px] tracking-[0.6em] uppercase mt-4 italic">ORACLE_ASSET_INGEST // {isLinkingResource}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsLinkingResource(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar space-y-12 bg-black/40">
                 <div className="text-center space-y-6">
                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Registry <span className="text-indigo-400">Handshake</span></h4>
                    <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">"Select registered industrial metadata to directly link with this live inflow thread."</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {user.resources && user.resources.length > 0 ? (
                      user.resources.map(res => (
                        <div 
                           key={res.id}
                           onClick={() => handleLinkResource(res)}
                           className="p-10 glass-card rounded-[56px] border-2 border-white/5 bg-black/60 hover:border-indigo-500/40 transition-all group/res flex flex-col items-center text-center space-y-8 shadow-2xl relative cursor-pointer"
                        >
                           <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${res.category === 'LAND' ? 'text-emerald-400' : 'text-blue-400'}`}>
                              {res.category === 'LAND' ? <MapPin size={40} /> : <SmartphoneNfc size={40} />}
                           </div>
                           <div>
                              <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">{res.name}</h5>
                              <p className="text-[10px] text-slate-700 font-mono font-bold mt-2 uppercase tracking-[0.3em]">{res.id} // {res.category}</p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-32 text-center opacity-20 flex flex-col items-center gap-10">
                         <Boxes size={120} className="text-slate-600" />
                         <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">NO_SHARDS_FOUND</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* NEW ASSET REGISTRATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowAddModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2">
              <div className="p-10 border-b border-white/5 bg-emerald-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl"><PlusCircle size={32} /></div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter m-0 leading-none">Register <span className="text-emerald-400">Flow</span></h3>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateAsset} className="p-12 space-y-8 bg-black/40">
                 <div className="space-y-3 px-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Asset Designation</label>
                    <input type="text" required value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} placeholder="e.g. High-Yield Maize" className="w-full bg-black border border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-stone-900 italic" />
                 </div>
                 <button type="submit" className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5">
                    {isProcessingAction === 'creating' ? <Loader2 size={24} className="animate-spin mx-auto" /> : "INITIALIZE INDUSTRIAL THREAD"}
                 </button>
              </form>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LiveFarming;
