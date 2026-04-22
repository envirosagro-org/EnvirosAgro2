import React, { useState } from 'react';
import { toast } from 'sonner';
// Fallback for db and auth if they are used elsewhere, but for this component 
// we will stick to a state-driven industrial UI to ensure consistency with the app.
// import { db, auth } from '../src/firebase'; 
import { 
  Server, Cpu, Activity, Zap, ShieldCheck, 
  Search, Plus, Settings, Trash2, RefreshCw,
  Binary, Terminal, Layers, Network, Gauge,
  Wifi, Bluetooth, Cable, Radio, Box, 
  Settings2, Info, ChevronRight, Share2,
  HardDrive, Monitor, Microchip, Database, X, Globe
} from 'lucide-react';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';

interface HardwareNode {
  id: string;
  name: string;
  type: 'CORE_NODE' | 'SENSOR_ARRAY' | 'SWARM_ASSET' | 'GATEWAY';
  protocol: 'CAN' | 'LORAWAN' | 'MQTT' | 'ETHERNET';
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  battery?: number;
  lastSeen: string;
}

const MOCK_NODES: HardwareNode[] = [
  { id: 'NODE-042', name: 'Alpha-Flow Sensor', type: 'SENSOR_ARRAY', protocol: 'LORAWAN', status: 'ONLINE', battery: 88, lastSeen: '2m' },
  { id: 'NODE-088', name: 'Delta Gate V2', type: 'GATEWAY', protocol: 'ETHERNET', status: 'ONLINE', lastSeen: '4s' },
  { id: 'NODE-101', name: 'Swarm-B1 Unit', type: 'SWARM_ASSET', protocol: 'CAN', status: 'SYNCING', battery: 42, lastSeen: '1m' },
];

export const HardwareRegistry: React.FC = () => {
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<HardwareNode['type']>('SENSOR_ARRAY');
  const [nodes, setNodes] = useState<HardwareNode[]>(MOCK_NODES);
  const [isAdding, setIsAdding] = useState(false);

  const registerHardware = () => {
    if (!deviceId || !deviceName) {
      toast.error('Identity_Shield_Required: Please provide full node metadata.');
      return;
    }
    
    const newNode: HardwareNode = {
      id: deviceId,
      name: deviceName,
      type: deviceType,
      protocol: 'CAN',
      status: 'SYNCING',
      lastSeen: 'just now',
      battery: 100
    };

    setNodes([newNode, ...nodes]);
    setDeviceId('');
    setDeviceName('');
    setIsAdding(false);
    toast.success('Hardware shard anchored. Initializing handshake...');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full text-left">
      <SEO title="Mesh Hardware Depot" description="EnvirosAgro Hardware Registry: Register and manage industrial IoT nodes, drones, and sensor arrays." />
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Mesh <span className="text-amber-400">Depot</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Hardware_Shard_Registry_v5.1</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Network size={14} className="text-amber-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">ActiveNodes</p>
                 <p className="text-xs font-black text-white">{nodes.filter(n => n.status === 'ONLINE').length} / {nodes.length}</p>
              </div>
           </div>
           <button 
             onClick={() => setIsAdding(!isAdding)}
             className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all"
           >
              {isAdding ? <X size={14} /> : <Plus size={14} />} {isAdding ? 'CANCEL_PROTOCOL' : 'ANCHOR_NODE'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Registration Form / HUD Info */}
        <div className="lg:col-span-1 space-y-6">
           <AnimatePresence mode="wait">
              {isAdding ? (
                 <motion.div 
                   key="form"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="glass-card p-8 rounded-[40px] border border-amber-500/20 bg-black/60 shadow-3xl text-left space-y-6"
                 >
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Hardware_Identity</label>
                       <input 
                         value={deviceId}
                         onChange={(e) => setDeviceId(e.target.value)}
                         placeholder="ID-SHARD-001..." 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Node_Alias</label>
                       <input 
                         value={deviceName}
                         onChange={(e) => setDeviceName(e.target.value)}
                         placeholder="NORTH-FIELD-DRONE..." 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Unit_Classification</label>
                       <select 
                         value={deviceType}
                         onChange={(e) => setDeviceType(e.target.value as any)}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono appearance-none"
                       >
                          <option value="CORE_NODE" className="bg-slate-900">CORE_NODE</option>
                          <option value="SENSOR_ARRAY" className="bg-slate-900">SENSOR_ARRAY</option>
                          <option value="SWARM_ASSET" className="bg-slate-900">SWARM_ASSET</option>
                          <option value="GATEWAY" className="bg-slate-900">GATEWAY</option>
                       </select>
                    </div>

                    <button 
                      onClick={registerHardware}
                      className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-[24px] font-black text-[9px] uppercase tracking-[0.2em] shadow-xl transition-all"
                    >
                       EXECUTE_HANDSHAKE
                    </button>
                 </motion.div>
              ) : (
                 <motion.div 
                   key="stats"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="glass-card p-10 rounded-[40px] border border-white/10 bg-black/60 shadow-3xl text-left space-y-8"
                 >
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-white italic truncate uppercase tracking-tighter">Topology_Stats</h3>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Hardware_Resonance_Overview</p>
                    </div>

                    <div className="space-y-6">
                       {[
                         { label: 'LoRaWAN Reach', val: 92, color: 'text-indigo-400' },
                         { label: 'CAN-Bus Integrity', val: 98, color: 'text-emerald-400' },
                         { label: 'Battery Capacity (Avg)', val: 74, color: 'text-amber-400' },
                       ].map((stat, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-500">
                               <span>{stat.label}</span>
                               <span className="text-white">{stat.val}%</span>
                            </div>
                            <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                               <div className={`h-full ${stat.color.replace('text-', 'bg-')}`} style={{ width: `${stat.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="p-6 bg-white/5 rounded-[24px] border border-white/5 space-y-4">
                       <p className="text-[10px] text-slate-400 italic leading-relaxed uppercase tracking-widest font-bold">
                          "Mesh integrity verified across 4 square kilometers. Latency: 12ms."
                       </p>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

           <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-xl text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <Terminal size={24} />
              </div>
              <h4 className="text-sm font-black text-white uppercase italic leading-none">Diagnostic CLI</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                 "Directly interface with local nodes via the encrypted industrial command terminal."
              </p>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">OPEN_CLI_TERMINAL</button>
           </div>
        </div>

        {/* Main Depot Registry */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 shadow-3xl text-left">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                       <Cpu size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic truncate uppercase tracking-tighter">Hardware_Registry</h3>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active_Mesh_Assets</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {['ALL', 'ONLINE', 'OFFLINE'].map(f => (
                      <button key={f} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[8px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">{f}</button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <AnimatePresence>
                    {nodes.map((node) => (
                      <motion.div 
                        key={node.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-card p-6 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                      >
                         <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform ${node.status === 'ONLINE' ? 'text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-slate-600'}`}>
                                  {node.type === 'CORE_NODE' && <Database size={24} />}
                                  {node.type === 'SENSOR_ARRAY' && <Microchip size={24} />}
                                  {node.type === 'SWARM_ASSET' && <Monitor size={24} />}
                                  {node.type === 'GATEWAY' && <HardDrive size={24} />}
                               </div>
                               <div>
                                  <h4 className="text-sm font-black text-white uppercase italic tracking-widest truncate max-w-[120px]">{node.name}</h4>
                                  <p className="text-[8px] font-mono text-slate-500 uppercase">{node.id} • {node.protocol}</p>
                               </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : node.status === 'SYNCING' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                                  <span className="text-[7px] font-black text-white/60 uppercase">{node.status}</span>
                               </div>
                               {node.battery !== undefined && (
                                 <div className="flex items-center gap-1.5 text-slate-600">
                                    <div className="w-4 h-2 border border-current rounded-sm relative px-[1px]">
                                       <div className="h-full bg-current rounded-sm" style={{ width: `${node.battery}%` }} />
                                       <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-[1px] h-1 bg-current" />
                                    </div>
                                    <span className="text-[7px] font-black">{node.battery}%</span>
                                 </div>
                               )}
                            </div>
                         </div>

                         <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">LastSeen: {node.lastSeen}</span>
                            <div className="flex gap-2">
                               <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all"><Settings2 size={12} /></button>
                               <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 transition-all"><Trash2 size={12} /></button>
                            </div>
                         </div>
                         <div className="absolute top-0 left-0 h-full w-1 bg-amber-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {nodes.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-slate-700 opacity-40">
                   <Monitor size={64} className="mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">No_Hardware_Assets_Registered</p>
                </div>
              )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-10 rounded-[48px] border border-blue-500/20 bg-blue-500/5 space-y-6 shadow-xl text-left">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-[28px] bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
                       <Wifi size={24} />
                    </div>
                    <span className="text-[8px] font-mono text-blue-400 font-black">SCANNING...</span>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase italic leading-none">Auto-Sync Protocol</h4>
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
                    "Detecting new local industrial hardware shards via Bluetooth Mesh and LoRaWAN gateways."
                 </p>
                 <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all">START_OMNI_SCAN</button>
              </div>

              <div className="glass-card p-10 rounded-[48px] border border-emerald-500/20 bg-emerald-500/5 space-y-6 shadow-xl text-left">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-[28px] bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <Globe size={24} />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 font-black">MESH_STABLE</span>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase italic leading-none">Network Visualizer</h4>
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
                    "Visualize the hardware shard connections and data flows in real-time across your industrial sector."
                 </p>
                 <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all">LAUNCH_NODE_MAP</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareRegistry;
