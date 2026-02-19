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
  TableProperties, Shield, ClipboardList as ClipboardListIcon, Boxes as BoxesIcon,
  ArrowDownCircle, SearchCode
} from 'lucide-react';
import { User, LiveAgroProduct, ViewState, AgroResource, ValueBlueprint, Task, RegisteredUnit } from '../types';

interface LiveFarmingProps {
  user: User;
  products: LiveAgroProduct[];
  setProducts: React.Dispatch<React.SetStateAction<LiveAgroProduct[]>>;
  onEarnEAC: (amount: number, reason: string) => void;
  onSaveProduct: (product: LiveAgroProduct) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  notify: any;
  initialSection?: string | null;
  onSaveTask: (task: Partial<Task>) => void;
  blueprints: ValueBlueprint[];
  industrialUnits: RegisteredUnit[];
}

const LiveFarming: React.FC<LiveFarmingProps> = ({ user, products, onSaveProduct, onNavigate, notify, initialSection, onSaveTask, blueprints, industrialUnits }) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'terminal'>('ledger');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);
  const [isLinkingResource, setIsLinkingResource] = useState<string | null>(null);
  const [isSourcing, setIsSourcing] = useState(false);

  // New Asset Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Produce' as const });

  // New Task Form
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Standard', thrust: 'Industry' });

  // Shard Linker State
  const [showShardLinker, setShowShardLinker] = useState(false);
  const [linkerContext, setLinkerContext] = useState<{label: string, icon: any, target: string, action?: string, sourceLedger: string} | null>(null);

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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !selectedAssetId) return;
    
    const task: Partial<Task> = {
      id: `TSK-${Date.now()}`,
      title: newTask.title,
      priority: newTask.priority,
      thrust: newTask.thrust,
      status: 'Inception',
      timestamp: new Date().toISOString(),
      stewardEsin: user.esin,
      assetId: selectedAssetId
    };

    onSaveTask(task);
    setShowTaskModal(false);
    setNewTask({ title: '', priority: 'Standard', thrust: 'Industry' });
    notify({ title: 'TASK_REGISTERED', message: `Process shard ${task.id} added to Kanban.`, type: 'success' });
  };

  const handleSourceBlueprint = async (bp: ValueBlueprint) => {
    if (!selectedAssetId) return;
    setIsSourcing(true);
    
    for (const step of bp.value_process_steps) {
      const task: Partial<Task> = {
        id: `TSK-${Date.now()}-${step.step_order}`,
        title: step.operation,
        priority: 'High',
        thrust: 'Industry',
        status: 'Inception',
        timestamp: new Date().toISOString(),
        stewardEsin: user.esin,
        assetId: selectedAssetId,
        blueprintId: bp.blueprint_id,
        description: `Source from Blueprint: ${bp.blueprint_id}. Est Duration: ${step.duration_hours}h`
      };
      onSaveTask(task);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setIsSourcing(false);
    notify({ title: 'PROCESS_INGESTED', message: `${bp.value_process_steps.length} tasks sharded to Kanban.`, type: 'success' });
  };

  const handleLinkResource = (resId: string, name: string) => {
    if (!selectedAsset) return;
    const updated = {
      ...selectedAsset,
      telemetryNodes: [...(selectedAsset.telemetryNodes || []), resId],
      progress: Math.min(100, selectedAsset.progress + 10)
    };
    onSaveProduct(updated as LiveAgroProduct);
    setShowShardLinker(false);
    notify({ 
      title: 'SHARD_ASSOCIATED', 
      message: `${name} linked with ${selectedAsset.id} for ${linkerContext?.label || 'process'}.`, 
      type: 'success',
      actionIcon: 'Link2'
    });
    
    // Auto-Task registration on successful sharding
    onSaveTask({
      id: `TSK-LINK-${Date.now()}`,
      title: `Finalize Association: ${name}`,
      priority: 'High',
      thrust: 'Industry',
      status: 'Processing',
      timestamp: new Date().toISOString(),
      stewardEsin: user.esin,
      assetId: selectedAsset.id,
      description: `Verify handshake with sourced ledger item ${resId}.`
    });
  };

  const handleTriggerTool = (tool: any) => {
    if (!selectedAsset) return;
    setLinkerContext(tool);
    setShowShardLinker(true);
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      
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
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
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
                   <button onClick={() => setShowAddModal(true)} className="p-2 bg-emerald-600 rounded-xl text-white shadow-xl hover:scale-110 transition-all" title="Register New Asset"><Plus size={18}/></button>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {myAssets.map(asset => (
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
                    </button>
                  ))}
                </div>
              </div>

              {selectedAsset && blueprints.length > 0 && (
                <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-900/5 space-y-8 shadow-xl animate-in fade-in">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <Zap className="text-blue-400" />
                      <h4 className="text-lg font-black text-white uppercase italic tracking-widest">Process Sourcing</h4>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">Ingest from Value Forge</p>
                   <div className="space-y-3">
                      {blueprints.map(bp => (
                        <button 
                          key={bp.blueprint_id}
                          onClick={() => handleSourceBlueprint(bp)}
                          disabled={isSourcing}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                        >
                           <div className="text-left">
                              <p className="text-xs font-black uppercase">{bp.input_material.name}</p>
                              <p className="text-[8px] font-mono opacity-60">Delta: +{bp.projected_value_delta}%</p>
                           </div>
                           <ArrowDownCircle size={16} />
                        </button>
                      ))}
                   </div>
                </div>
              )}
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
                           <button onClick={() => setShowTaskModal(true)} className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-emerald-500 active:scale-95 transition-all">
                              <PlusCircle size={16} /> New Kanban Task
                           </button>
                        </div>
                     </div>

                     {/* STRATEGIC TOOLING HUB */}
                     <div className="space-y-8 relative z-10 pt-10 border-t border-white/5">
                        <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] italic mb-8">STRATEGIC_TOOLING_HUB</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                           {[
                              { label: 'Ingest Evidence', icon: Upload, target: 'digital_mrv', action: 'ingest', col: 'text-blue-400', sourceLedger: 'RESOURCE' },
                              { label: 'Registry Handshake', icon: SmartphoneNfc, target: 'registry_handshake', col: 'text-indigo-400', sourceLedger: 'RESOURCE' },
                              { label: 'Network Ingest', icon: Wifi, target: 'ingest', col: 'text-teal-400', sourceLedger: 'RESOURCE' },
                              { label: 'Live Broadcast', icon: Video, target: 'media', action: 'PROCESS_STREAM', col: 'text-rose-500', sourceLedger: 'RESOURCE' },
                              { label: 'Value Analysis', icon: FlaskConical, target: 'agro_value_enhancement', action: 'synthesis', col: 'text-fuchsia-400', sourceLedger: 'VALUE' },
                              { label: 'Mission Sync', icon: Briefcase, target: 'contract_farming', col: 'text-amber-500', sourceLedger: 'RESOURCE' },
                              { label: 'Collective Hub', icon: Users, target: 'community', action: 'shards', col: 'text-indigo-400', sourceLedger: 'RESOURCE' },
                              { label: 'Industrial Pair', icon: Factory, target: 'industrial', action: 'bridge', col: 'text-slate-400', sourceLedger: 'INDUSTRIAL' },
                              { label: 'TQM Audit', icon: ClipboardCheck, target: 'tqm', col: 'text-emerald-500', sourceLedger: 'RESOURCE' },
                           ].map((tool, i) => (
                              <button 
                                 key={i}
                                 onClick={() => handleTriggerTool(tool)}
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

      {/* SHARD LINKER MODAL: INTEGRATED ACROSS ALL STRATEGIC TOOLS */}
      {showShardLinker && selectedAsset && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowShardLinker(false)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-[0_0_200px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl">
                       <Workflow size={40} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Shard <span className="text-indigo-400">Linker</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[11px] tracking-[0.5em] uppercase mt-4 italic">ASSOCIATE_ASSET_FOR_{linkerContext?.label.toUpperCase().replace(/ /g, '_')}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowShardLinker(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar bg-black/40 space-y-12">
                 <div className="p-10 bg-indigo-600/5 rounded-[56px] border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-inner">
                    <div className="text-left space-y-2">
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter m-0">In-Process: {selectedAsset.productType}</h4>
                       <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{selectedAsset.id}</p>
                    </div>
                    <button 
                      onClick={() => onNavigate(linkerContext?.target as ViewState, linkerContext?.action)}
                      className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all flex items-center gap-3 border-2 border-white/10 ring-8 ring-white/5"
                    >
                       <PlusCircle size={20} /> Register New {linkerContext?.sourceLedger === 'VALUE' ? 'Blueprint' : linkerContext?.sourceLedger === 'INDUSTRIAL' ? 'Unit' : 'Asset'}
                    </button>
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-4 px-6 border-b border-white/5 pb-4">
                       <Monitor size={20} className="text-blue-400" />
                       <h4 className="text-xl font-black text-white uppercase italic tracking-widest">
                          {linkerContext?.sourceLedger === 'INDUSTRIAL' ? 'Industrial Units' : 
                           linkerContext?.sourceLedger === 'VALUE' ? 'Value Blueprints' : 
                           'Registry Shards'}
                       </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Context-Aware Sourcing Logic */}
                       {linkerContext?.sourceLedger === 'INDUSTRIAL' ? (
                          industrialUnits.length === 0 ? (
                            <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                               <Factory size={64} className="text-slate-700 animate-pulse" />
                               <p className="text-xl font-black uppercase tracking-widest">No active units found</p>
                            </div>
                          ) : (
                            industrialUnits.map(unit => (
                              <div 
                                key={unit.id} 
                                onClick={() => handleLinkResource(unit.id, unit.name)}
                                className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Factory size={200} /></div>
                                <div className="flex justify-between items-start relative z-10">
                                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-blue-400 group-hover/asset:scale-110 transition-all">
                                      <Factory size={24} />
                                   </div>
                                   <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{unit.status}</span>
                                </div>
                                <div className="relative z-10">
                                   <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{unit.name}</h5>
                                   <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{unit.id} // {unit.type}</p>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                                   ASSOCIATE_UNIT <ArrowRight size={14} />
                                </div>
                             </div>
                            ))
                          )
                       ) : linkerContext?.sourceLedger === 'VALUE' ? (
                          blueprints.length === 0 ? (
                            <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                               <FlaskConical size={64} className="text-slate-700 animate-pulse" />
                               <p className="text-xl font-black uppercase tracking-widest">No active blueprints found</p>
                            </div>
                          ) : (
                            blueprints.map(bp => (
                              <div 
                                key={bp.blueprint_id} 
                                onClick={() => handleLinkResource(bp.blueprint_id, bp.input_material.name)}
                                className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><FlaskConical size={200} /></div>
                                <div className="flex justify-between items-start relative z-10">
                                   <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-fuchsia-400 group-hover/asset:scale-110 transition-all">
                                      <Zap size={24} />
                                   </div>
                                   <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{bp.status}</span>
                                </div>
                                <div className="relative z-10">
                                   <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{bp.input_material.name}</h5>
                                   <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{bp.blueprint_id} // Δ +{bp.projected_value_delta}%</p>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                                   ASSOCIATE_BLUEPRINT <ArrowRight size={14} />
                                </div>
                             </div>
                            ))
                          )
                       ) : (
                          /* Fallback to general resources */
                          user.resources && user.resources.length > 0 ? (
                             user.resources.map(res => (
                                <div 
                                   key={res.id} 
                                   onClick={() => handleLinkResource(res.id, res.name)}
                                   className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                                >
                                   <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Database size={200} /></div>
                                   <div className="flex justify-between items-start relative z-10">
                                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${res.category === 'LAND' ? 'text-emerald-400' : 'text-blue-400'} group-hover/asset:scale-110 transition-transform`}>
                                         {res.category === 'LAND' ? <MapPin size={24} /> : <SmartphoneNfc size={24} />}
                                      </div>
                                      <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{res.status}</span>
                                   </div>
                                   <div className="relative z-10">
                                      <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{res.name}</h5>
                                      <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{res.id} // {res.category}</p>
                                   </div>
                                   <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                                      ASSOCIATE_SHARD <ArrowRight size={14} />
                                   </div>
                                </div>
                             ))
                          ) : (
                             <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                                <SearchCode size={64} className="text-slate-700 animate-pulse" />
                                <p className="text-xl font-black uppercase tracking-widest">No local shards found</p>
                             </div>
                          )
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 bg-black/95 text-center shrink-0 z-20">
                 <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.8em] italic">INDUSTRIAL_LINKING_PROTOCOL v6.5 // secured shard</p>
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

      {/* NEW KANBAN TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowTaskModal(false)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2">
              <div className="p-10 border-b border-white/5 bg-indigo-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl"><ClipboardListIcon size={32} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Register <span className="text-indigo-400">Task</span></h3>
                    </div>
                 </div>
                 <button onClick={() => setShowTaskModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateTask} className="p-10 space-y-8 bg-black/40">
                 <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Task Title</label>
                    <input type="text" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Nutrient Shard Injection" className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/20" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Priority</label>
                       <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-bold appearance-none outline-none">
                          <option>Standard</option>
                          <option>High</option>
                          <option>Critical</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Pillar</label>
                       <select value={newTask.thrust} onChange={e => setNewTask({...newTask, thrust: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-bold appearance-none outline-none">
                          <option>Industry</option>
                          <option>Environmental</option>
                          <option>Technological</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl">
                    ANCHOR TASK SHARD
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
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default LiveFarming;