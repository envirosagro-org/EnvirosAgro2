
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Satellite, Zap, ShieldCheck, Bot, Sparkles, 
  Layers, Binary, Target, Globe, Loader2, Stamp, 
  Fingerprint, Wind, CheckCircle2, Sprout, RefreshCw, Terminal, 
  Activity, MapPin, Smartphone, Star, ArrowLeftCircle, Wrench, 
  SmartphoneNfc, Plus, ArrowRight, Download, Monitor, History,
  Compass, BadgeCheck, Pickaxe, Database, Leaf, Boxes as BoxesIcon,
  LayoutGrid, Trash2, Cpu as CpuIcon, TreePine, Crown, TrendingUp,
  Hash, ShieldAlert, Workflow, ScanLine, Atom, Box, Link2, Search,
  Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { User, ViewState, AgroResource } from '../types';
import { analyzeMiningYield, detectAnomalousDrift } from '../services/geminiService';
import { streamLiveTelemetry, updateLiveTelemetry } from '../services/firebaseService';

interface OnlineGardenProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  onExecuteToShell?: (code: string) => void;
  notify: any;
  initialSection?: string | null;
}

const shardCardBaseStyle = "glass-card p-12 rounded-[72px] border-2 transition-all flex flex-col justify-between shadow-3xl bg-black/40 relative overflow-hidden h-[720px] group cursor-pointer active:scale-[0.98] duration-300";
const iconContainerStyle = (color: string) => `p-6 rounded-3xl bg-white/5 border border-white/10 ${color} shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all`;

const ResourceShard: React.FC<{
  resource: AgroResource;
  isSelected: boolean;
  onSelect: () => void;
  onExecute: (code: string) => void;
}> = ({ resource, isSelected, onSelect, onExecute }) => {
  const genesisHash = useMemo(() => `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}_GENESIS`, []);
  const currentHash = useMemo(() => `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}_THREAD`, []);

  const getOptimizationCode = () => {
    return resource.category === 'LAND' ? `// OPTIMIZE_LAND_SHARD\nSEQUENCE Recalibrate_Plot { Bio.calibrate_substrate(); COMMIT_SHARD(); }` : `// OPTIMIZE_HARDWARE\nSEQUENCE Tune_Telemetry { Bot.execute_diagnostic(); COMMIT_SHARD(); }`;
  };

  return (
    <div className={`${shardCardBaseStyle} ${isSelected ? 'border-emerald-500 ring-8 ring-emerald-500/5' : 'border-white/5 hover:border-white/20'}`} onClick={onSelect}>
      <div className="flex justify-between items-start mb-12 relative z-10">
         <div className={iconContainerStyle(resource.category === 'LAND' ? 'text-emerald-400' : 'text-blue-400')}>
            {resource.category === 'LAND' ? <TreePine size={40} /> : <Smartphone size={40} />}
         </div>
         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl ${resource.category === 'LAND' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
           {resource.category}
         </span>
      </div>
      <div className="flex-1 space-y-8 relative z-10">
         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{resource.name}</h4>
         <div className="p-6 bg-black/80 rounded-[44px] border border-white/5 space-y-4 shadow-inner text-[9px] font-mono">
            <p>GENESIS: {genesisHash}</p>
            <p className="text-emerald-500">THREAD: {currentHash}</p>
         </div>
      </div>
      <div className="mt-12 pt-10 border-t border-white/5 flex gap-4 relative z-10">
         <button onClick={(e) => { e.stopPropagation(); onExecute(getOptimizationCode()); }} className="flex-1 py-6 agro-gradient rounded-[32px] text-[10px] font-black uppercase tracking-widest text-white shadow-3xl">Commit to OS</button>
      </div>
    </div>
  );
};

const OnlineGarden: React.FC<OnlineGardenProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, onExecuteToShell, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'shards' | 'mining' | 'roadmap'>('bridge');
  const [liveData, setLiveData] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [driftAlert, setDriftAlert] = useState<string | null>(null);
  
  // Added missing selectedShardId state to fix component error
  const [selectedShardId, setSelectedShardId] = useState<string | null>(null);

  // Added missing handleExecuteOS function to fix component error
  const handleExecuteOS = (code: string) => {
    if (onExecuteToShell) onExecuteToShell(code);
    onNavigate('farm_os' as ViewState);
  };

  useEffect(() => {
    if (user.esin) {
      const unsub = streamLiveTelemetry(user.esin, async (data) => {
        setLiveData(data);
        if (data.soil_moisture < 20 || data.temperature > 35) {
          const audit = await detectAnomalousDrift(data);
          if (audit.json?.has_drift) setDriftAlert(audit.json.remediation);
        }
      });
      return () => unsub();
    }
  }, [user.esin]);

  const handleManualInflow = async () => {
    setIsSyncing(true);
    const newData = { soil_moisture: 45 + Math.random() * 20, temperature: 22 + Math.random() * 5 };
    await updateLiveTelemetry(user.esin, newData);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleStartMining = async (type: 'carbon' | 'reaction') => {
    setIsMining(true);
    try {
      await analyzeMiningYield({ type, node_id: user.esin });
      onEarnEAC(type === 'carbon' ? 50 : 25, `${type.toUpperCase()}_MINING_COMPLETE`);
    } finally { setIsMining(false); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      <div className="flex p-1.5 glass-card bg-black/40 rounded-3xl border border-white/5 w-fit mx-auto lg:mx-0">
        {['bridge', 'shards', 'mining', 'roadmap'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="min-h-[800px]">
        {activeTab === 'bridge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                   <div className="flex items-center gap-6">
                      <Satellite size={32} className="text-blue-400" />
                      <h3 className="text-3xl font-black text-white uppercase italic">Live <span className="text-blue-400">Telemetry Ingest</span></h3>
                   </div>
                   <button onClick={handleManualInflow} disabled={isSyncing} className="p-3 bg-white/5 rounded-full text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                      {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                   </button>
                </div>
                {driftAlert && (
                  <div className="p-8 bg-rose-950/20 border-2 border-rose-500/40 rounded-3xl animate-pulse flex items-center gap-6">
                    <ShieldAlert className="text-rose-500 w-10 h-10" />
                    <div><p className="text-[10px] font-black uppercase text-rose-500">ANOMALOUS_DRIFT_DETECTED</p><p className="text-slate-200 text-sm italic">{driftAlert}</p></div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 shadow-inner text-center space-y-2">
                      <p className="text-[11px] text-slate-500 uppercase font-black">Soil Moisture Shard</p>
                      <p className="text-6xl font-mono font-black text-white">{liveData?.soil_moisture?.toFixed(1) || '0.0'}%</p>
                   </div>
                   <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 shadow-inner text-center space-y-2">
                      <p className="text-[11px] text-slate-500 uppercase font-black">Atmospheric Temp</p>
                      <p className="text-6xl font-mono font-black text-white">{liveData?.temperature?.toFixed(1) || '0.0'}°C</p>
                   </div>
                </div>
             </div>
          </div>
        )}
        {activeTab === 'shards' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {user.resources?.map(res => (
                <ResourceShard key={res.id} resource={res} isSelected={selectedShardId === res.id} onSelect={() => setSelectedShardId(res.id)} onExecute={handleExecuteOS} />
              ))}
           </div>
        )}
      </div>
      <style>{` .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); } @keyframes scan { from { top: -100%; } to { top: 100%; } } .animate-scan { animation: scan 3s linear infinite; } `}</style>
    </div>
  );
};

export default OnlineGarden;
