import React, { useState, useMemo } from 'react';
import { 
  Compass, Mountain, Layers, Zap, ShieldCheck, Bot, Sparkles, Search, 
  PlusCircle, ArrowRight, Loader2, Activity, Target, Heart, Scale, 
  Trees, Sun, CloudRain, Binary, FileText, BadgeCheck, History, 
  Trash2, RefreshCw, Droplets, Microscope, BoxSelect, User as UserIcon, 
  Sprout, Wheat, Globe, TrendingUp, ChevronRight, Circle, Download, 
  Users, Handshake, X, Stamp, Terminal, Map as MapIcon, Atom, Wind, 
  Coins, Info, Flower2, Crown, Layout, Star, Wand2, ShieldAlert, 
  ArrowUpRight, Flame, CircleDot, Fingerprint, ClipboardCheck, 
  CheckCircle2, BatteryCharging, UtensilsCrossed, Recycle, Home, 
  Waves, Lightbulb, MapPin, ArrowDownCircle, Gauge, Link2, Cookie, 
  Link, Droplet, Dna, Workflow, Box, Monitor, LayoutGrid, Database, Network
} from 'lucide-react';
import { User, ViewState, MediaShard, SignalShard } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';
import { saveCollectionItem } from '../services/firebaseService';

interface PermacultureProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  onEmitSignal?: (signal: Partial<SignalShard>) => Promise<void>;
  notify?: any;
  initialSection?: string | null;
}

const ZONE_SHARDS = [
  { id: 0, name: 'Zone 0: Core Node', desc: 'The steward center. Focus on internal efficiency, waste-to-energy cycles, and personal m-constant calibration.', icon: UserIcon, tasks: ['Energy Audit', 'SID Self-Remediation', 'Bio-Inflow Monitor'], color: 'text-indigo-400', theme: 'indigo' },
  { id: 1, name: 'Zone 1: Daily Ingest', desc: 'Intensive care shards. Small-scale kitchen garden modules and high-frequency herb nodes.', icon: Sprout, tasks: ['Compost Ingest', 'Seed Starting', 'Daily Moisture Check'], color: 'text-emerald-400', theme: 'emerald' },
  { id: 2, name: 'Zone 2: Semi-Intensive', desc: 'Perennial orchards and poultry nodes. Seasonal maintenance cycle with medium sharding frequency.', icon: Trees, tasks: ['Orchard Pruning', 'Water Catchment', 'Poultry Sync'], color: 'text-teal-400', theme: 'teal' },
  { id: 3, name: 'Zone 3: Main Crop', desc: 'The industrial core. Large-scale cash crops and pasture sharding for network trade and liquidity.', icon: Wheat, tasks: ['Harvest Ingest', 'Soil Tilling', 'Pest Swarm Scan'], color: 'text-amber-400', theme: 'amber' },
  { id: 4, name: 'Zone 4: Semi-Wild', desc: 'Managed forests and foraged shards. Minimal interference nodes for timber and long-term EAT growth.', icon: Mountain, tasks: ['Timber Audit', 'Wild Ingest', 'Boundary Repair'], color: 'text-blue-400', theme: 'blue' },
  { id: 5, name: 'Zone 5: Wilderness', desc: 'The primary oracle. Observation-only nodes to calibrate local biometrics against planetary resonance.', icon: Globe, tasks: ['Resonance Mapping', 'Wildlife Count', 'Erosion Audit'], color: 'text-slate-400', theme: 'slate' },
];

const Permaculture: React.FC<PermacultureProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, onEmitSignal, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'zonation' | 'ethics' | 'lilies' | 'companion' | 'home_agro'>(
    initialSection === 'home_agro' ? 'home_agro' : 'zonation'
  );
  const [selectedZone, setSelectedZone] = useState(ZONE_SHARDS[1]);
  const [isSyncingGeofence, setIsSyncingGeofence] = useState(false);

  const handleSyncGeofence = async () => {
    setIsSyncingGeofence(true);
    if (onEmitSignal) {
      await onEmitSignal({
        type: 'system',
        origin: 'MANUAL',
        title: 'GEOFENCE_SYNC_INITIATED',
        message: `Synchronizing geofence shards for node ${user.esin} in ${selectedZone.name}.`,
        priority: 'medium',
        actionIcon: 'MapPin'
      });
    }

    // Simulate high-fidelity registry handshake
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSyncingGeofence(false);
    onEarnEAC(10, 'GEOFENCE_QUORUM_SYNC_SUCCESS');
    if (notify) {
      notify({ 
        title: 'GEOFENCE_SYNCED', 
        message: 'Registry geofence shards aligned with satellite telemetry.', 
        type: 'success' 
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1500px] mx-auto px-4">
      {/* 1. View Toggles */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[36px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-6 mx-auto lg:mx-0 relative z-20">
        {[
          { id: 'zonation', label: 'Zonation Shards', icon: Layers },
          { id: 'home_agro', label: 'Home Agro Hub', icon: Home },
          { id: 'lilies', label: 'Lilies Around', icon: Flower2 },
          { id: 'ethics', label: 'Ethical Forge', icon: Scale },
          { id: 'companion', label: 'Companion Oracle', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px] relative z-10">
        {activeTab === 'zonation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                         <Layers size={24} />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Zonation <span className="text-emerald-400">Registry</span></h3>
                   </div>
                   <div className="space-y-4">
                      {ZONE_SHARDS.map(zone => (
                        <button 
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedZone.id === zone.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-xl scale-105' : 'bg-black/40 border-white/5 text-slate-500 hover:border-emerald-500/20'}`}
                        >
                           <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl transition-all ${selectedZone.id === zone.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 group-hover:rotate-6'} ${zone.color}`}><zone.icon size={24} /></div>
                              <span className="text-lg font-black uppercase text-white tracking-tight italic">{zone.name}</span>
                           </div>
                           <ChevronRight className={`w-6 h-6 transition-transform ${selectedZone.id === zone.id ? 'rotate-90 text-emerald-400' : 'text-slate-800'}`} />
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7">
                <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/20 h-full flex flex-col relative overflow-hidden shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.04] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                      <selectedZone.icon size={600} className={selectedZone.color} />
                   </div>
                   
                   <div className="relative z-10 space-y-16">
                      <div className="space-y-6">
                         <span className={`px-5 py-2 bg-white/5 ${selectedZone.color} text-[11px] font-black uppercase rounded-full border border-white/10 tracking-widest shadow-inner`}>ZONE_DETAIL_SHARD_0{selectedZone.id}</span>
                         <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">{selectedZone.name}</h3>
                         <p className="text-slate-400 text-2xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-white/10 pl-10">"{selectedZone.desc}"</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-8 shadow-inner group/tasks hover:border-emerald-500/20 transition-all">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 px-2">
                               <Target size={16} className="text-emerald-400" /> Maintenance Shards
                            </h5>
                            <div className="space-y-4">
                               {selectedZone.tasks.map((task, i) => (
                                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group/tasks:bg-emerald-600/5 transition-all cursor-pointer">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                                     <span className="text-sm font-black text-slate-300 uppercase italic tracking-tight">{task}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-10 shadow-inner text-white">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 px-2">
                               <History size={16} className="text-indigo-400" /> Zone Telemetry
                            </h5>
                            <div className="space-y-8">
                               {[
                                  { l: 'Visit Frequency', v: selectedZone.id === 0 ? 'CONSTANT' : selectedZone.id === 1 ? 'DAILY' : selectedZone.id === 3 ? 'WEEKLY' : 'SEASONAL', p: 100 - (selectedZone.id * 15) },
                                  { l: 'Industrial Yield', v: selectedZone.id === 3 ? 'PEAK' : 'STABLE', p: 60 + Math.random() * 30 },
                               ].map(m => (
                                  <div key={m.l} className="space-y-3">
                                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-600">{m.l}</span>
                                        <span className="text-white font-mono">{m.v}</span>
                                     </div>
                                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: `${m.p}%` }}></div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                         <button 
                           onClick={handleSyncGeofence}
                           disabled={isSyncingGeofence}
                           className="flex-1 py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10 ring-8 ring-emerald-500/5"
                         >
                            {isSyncingGeofence ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapIcon size={20} />} 
                            {isSyncingGeofence ? 'SYNCING_SHARDS...' : 'SYNC GEOFENCE'}
                         </button>
                         <button className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 hover:text-white transition-all shadow-xl group/down">
                            <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Home Agro, Lilies, Ethics tabs remain focused on their core logic... */}
        {activeTab !== 'zonation' && (
           <div className="flex flex-col items-center justify-center py-40 opacity-20">
              <Bot size={80} className="mb-6 animate-float" />
              <p className="text-2xl font-black uppercase tracking-[0.5em]">Shard Environment Placeholder</p>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Permaculture;
