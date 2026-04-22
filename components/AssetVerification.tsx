
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, History, RefreshCw, BadgeCheck, ShieldAlert, 
  Search, Filter, ChevronRight, Activity, Clock, 
  Database, Zap, ArrowRight, CheckCircle2, X
} from 'lucide-react';
import { ShardScanner } from './ShardScanner';

interface AssetVerificationProps {
  user: any;
  notify: any;
  initialSection?: string | null;
}

interface ScanRecord {
  id: string;
  assetId: string;
  timestamp: string;
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  type: string;
  origin: string;
}

export const AssetVerification: React.FC<AssetVerificationProps> = ({ user, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'history' | 'sync'>('scanner');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([
    { id: 'SCN-882', assetId: 'UNIT-S1-992', timestamp: new Date().toISOString(), status: 'VERIFIED', type: 'HARDWARE_SHARD', origin: 'Industrial Node S1' },
    { id: 'SCN-881', assetId: 'MOD-P4-001', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'VERIFIED', type: 'SOFTWARE_LOGIC', origin: 'Digital Twin S4' },
    { id: 'SCN-880', assetId: 'BATCH-A2-05', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'FAILED', type: 'PRODUCT_ORIGIN', origin: 'Market Inflow' },
  ]);

  useEffect(() => {
    if (initialSection === 'history') setActiveTab('history');
    if (initialSection === 'sync') setActiveTab('sync');
  }, [initialSection]);

  const handleScanComplete = (data: any) => {
    const newRecord: ScanRecord = {
      id: `SCN-${Math.floor(Math.random() * 1000)}`,
      assetId: data.id,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED',
      type: 'HARDWARE_SHARD',
      origin: 'Remote Handshake'
    };
    setScanHistory(prev => [newRecord, ...prev]);
    notify({
      title: 'SHARD_SYNC_SUCCESS',
      message: `Asset ${data.id} has been anchored to the local registry.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Asset <span className="text-emerald-400">Verification.</span></h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">NODE_ESIN: {user.esin} // REGISTRY_GATE</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {['scanner', 'history', 'sync'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeTab === tab ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl' : 'bg-white/5 text-slate-500 border-transparent hover:bg-white/10'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'scanner' && (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 glass-card p-12 md:p-20 rounded-[48px] border-2 border-dashed border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] animate-pulse"></div>
               
               <div className="relative">
                  <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-emerald-500/20 rounded-[48px] flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                     <Scan size={80} className="text-emerald-500 animate-pulse" />
                  </div>
                  <div className="absolute inset-[-20px] border-2 border-dashed border-emerald-500/10 rounded-[64px] animate-spin-slow"></div>
               </div>

               <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Initialize Hardware Handshake</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-md mx-auto italic">"Align the physical identification shard with the optical registry sensor to anchor the asset to your local node."</p>
               </div>

               <button 
                onClick={() => setIsScannerOpen(true)}
                className="px-12 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10 border-4 border-white/5 ring-[24px] ring-white/5"
               >
                 LAUNCH_DYNAMIC_LENS
               </button>

               <div className="pt-10 grid grid-cols-3 gap-8 w-full max-w-lg opacity-40">
                  <div className="text-center space-y-2">
                    <Activity size={16} className="mx-auto text-slate-500" />
                    <p className="text-[7px] font-black uppercase text-slate-600 tracking-widest">OPTICAL_LINK</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Database size={16} className="mx-auto text-slate-500" />
                    <p className="text-[7px] font-black uppercase text-slate-600 tracking-widest">LEDGER_SYNC</p>
                  </div>
                  <div className="text-center space-y-2">
                    <ShieldAlert size={16} className="mx-auto text-slate-500" />
                    <p className="text-[7px] font-black uppercase text-slate-600 tracking-widest">ZK_VALIDATION</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Verification Strategy</h4>
                  <div className="space-y-4">
                     {[
                       { label: 'Protocols', val: 'V3.2_ENABLED', icon: Zap, col: 'text-amber-400' },
                       { label: 'Latency', val: '14ms', icon: Clock, col: 'text-indigo-400' },
                       { label: 'Success Rate', val: '99.98%', icon: BadgeCheck, col: 'text-emerald-400' }
                     ].map(item => (
                       <div key={item.label} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group cursor-help">
                          <div className="flex items-center gap-3">
                             <item.icon size={14} className={item.col} />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          </div>
                          <span className="text-[10px] font-mono font-black text-white">{item.val}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="glass-card p-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.03] space-y-6">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Safety Protocol</h4>
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">Ensure the hardware shard is clean and the lighting conditions are optimal for the optical sensor array.</p>
                  <div className="flex items-center gap-4 py-4 border-y border-white/5">
                     <ShieldAlert size={20} className="text-amber-500" />
                     <p className="text-[9px] font-black text-white uppercase tracking-widest">WARNING: UNLISTED SHARDS DETECTED</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type="text" placeholder="Filter audit trail..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white placeholder:text-slate-700 focus:border-emerald-500/40 outline-none transition-all" />
               </div>
               <div className="flex gap-2">
                  <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><Filter size={16} /></button>
                  <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">EXPORT_LEDGER</button>
               </div>
            </div>

            <div className="grid gap-4">
               {scanHistory.map(record => (
                 <div key={record.id} className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:translate-x-1 transition-all">
                    <div className="flex items-center gap-6">
                       <div className={`p-4 rounded-2xl border-2 ${record.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                          {record.status === 'VERIFIED' ? <BadgeCheck size={24} /> : <ShieldAlert size={24} />}
                       </div>
                       <div className="space-y-1">
                          <h5 className="text-sm font-black text-white uppercase italic tracking-widest leading-none">{record.assetId}</h5>
                          <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                             <span>ID: {record.id}</span>
                             <span>•</span>
                             <span>{record.type}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic">Origin: {record.origin}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-10">
                       <div className="text-right space-y-1">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{record.status === 'VERIFIED' ? 'SUCCESS' : 'FAILED'}</p>
                          <div className="flex items-center gap-2 text-[9px] text-slate-600 font-mono">
                             <Clock size={10} />
                             {new Date(record.timestamp).toLocaleString()}
                          </div>
                       </div>
                       <button className="p-4 bg-white/5 rounded-2xl text-slate-700 hover:text-white hover:bg-white/10 transition-all group-hover:rotate-45"><ArrowRight size={18} /></button>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'sync' && (
          <motion.div 
            key="sync"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 md:p-20 rounded-[64px] border border-white/5 bg-black/40 text-center space-y-12"
          >
             <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <RefreshCw size={64} className="text-indigo-400 animate-spin-slow" />
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Synchronize Local Ledger</h3>
                <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto italic leading-relaxed">Broadcast verified assets to the global mesh. This will increase your node reputation and confirm the integrity of verified industrial blocks.</p>
             </div>
             <button className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">INITIATE_BROADCAST</button>
             <div className="flex justify-center gap-12 pt-10">
                <div className="space-y-1">
                   <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">PENDING_SHARDS</p>
                   <p className="text-2xl font-mono font-black text-indigo-400">0</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">NODE_HEALTH</p>
                   <p className="text-2xl font-mono font-black text-emerald-400">MAX</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShardScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onVerified={handleScanComplete}
        userEsin={user.esin}
      />
    </div>
  );
};

export default AssetVerification;
