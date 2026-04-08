import React, { useState, useEffect, useMemo } from 'react';
import { spatialService, Plot } from '../services/spatialService';
import { User } from '../types';
import { 
  TrendingUp, 
  Leaf, 
  Zap, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  BarChart3, 
  Target, 
  Cpu, 
  Share2, 
  Lock, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Database, 
  Network, 
  ArrowRightLeft,
  FileCheck2,
  Coins,
  Gauge
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface DigitalMRVProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => Promise<void>;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onUpdateUser: (u: User) => void;
  onNavigate: (view: any, action?: string | null) => void;
  onEmitSignal: (signal: any) => void;
}

interface Settlement {
  id: string;
  plotId: string;
  amount: number;
  status: 'PENDING' | 'VERIFIED' | 'SETTLED';
  timestamp: number;
  evidenceHash: string;
}

const DigitalMRV: React.FC<DigitalMRVProps> = ({ user, onEarnEAC, onSpendEAC, onUpdateUser, onNavigate, onEmitSignal }) => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SETTLEMENTS' | 'NETWORK' | 'DASHBOARD'>('OVERVIEW');

  useEffect(() => {
    if (user.esin) {
      spatialService.getPlots(user.esin).then(setPlots).catch(console.error);
    }
  }, [user.esin]);

  // Mock Settlements
  useEffect(() => {
    if (selectedPlot?.id) {
      const mockSettlements: Settlement[] = [
        { id: 'SET-001', plotId: selectedPlot.id, amount: 12.5, status: 'SETTLED', timestamp: Date.now() - 86400000 * 2, evidenceHash: '0xabc...123' },
        { id: 'SET-002', plotId: selectedPlot.id, amount: 8.2, status: 'VERIFIED', timestamp: Date.now() - 86400000, evidenceHash: '0xdef...456' },
        { id: 'SET-003', plotId: selectedPlot.id, amount: 15.0, status: 'PENDING', timestamp: Date.now(), evidenceHash: '0xghi...789' },
      ];
      setSettlements(mockSettlements);
    }
  }, [selectedPlot]);

  const stats = useMemo(() => {
    return {
      totalCarbon: 1245.8,
      activePlots: plots.length,
      pendingSettlements: settlements.filter(s => s.status !== 'SETTLED').length,
      totalEAC: settlements.reduce((acc, s) => acc + s.amount, 0).toFixed(1)
    };
  }, [plots, settlements]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Carbon Stock', value: `${stats.totalCarbon}t`, icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Active GIS Plots', value: stats.activePlots, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'EAC Credits Minted', value: stats.totalEAC, icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Network Integrity', value: '99.9%', icon: ShieldCheck, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plot Selection Sidebar */}
        <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-6">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Select GIS Plot</h4>
          <div className="space-y-3">
            {plots.map(plot => (
              <button
                key={plot.id}
                onClick={() => setSelectedPlot(plot)}
                className={`w-full p-4 rounded-2xl border transition-all text-left ${selectedPlot?.id === plot.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-black text-white uppercase tracking-tight">{plot.name}</div>
                  <ChevronRight size={14} className={selectedPlot?.id === plot.id ? 'text-white' : 'text-slate-500'} />
                </div>
                <div className="text-[10px] font-mono text-emerald-400">{plot.id?.slice(0, 8)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {selectedPlot ? (
            <div className="space-y-8">
              {/* Tabs */}
              <div className="flex bg-black/40 border border-white/10 rounded-2xl p-1 w-fit">
                {[
                  { id: 'OVERVIEW', label: 'Overview', icon: Activity },
                  { id: 'DASHBOARD', label: 'Live Dashboard', icon: Gauge },
                  { id: 'SETTLEMENTS', label: 'Auto-Settlements', icon: FileCheck2 },
                  { id: 'NETWORK', label: 'Data Mesh', icon: Network },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                  >
                    <tab.icon size={14} /> {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'OVERVIEW' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Soil Carbon Density</h5>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { t: 'Jan', v: 45 }, { t: 'Feb', v: 52 }, { t: 'Mar', v: 48 }, { t: 'Apr', v: 61 }, { t: 'May', v: 55 }, { t: 'Jun', v: 67 }
                            ]}>
                              <defs>
                                <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="t" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                              <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#colorV)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biomass Growth Index</h5>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { t: 'P1', v: 85 }, { t: 'P2', v: 72 }, { t: 'P3', v: 91 }, { t: 'P4', v: 64 }, { t: 'P5', v: 78 }
                            ]}>
                              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                                {[0, 1, 2, 3, 4].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                                ))}
                              </Bar>
                              <XAxis dataKey="t" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'DASHBOARD' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-black/60 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                          <Activity className="text-emerald-400 animate-pulse" size={32} />
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500/10" />
                            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="226" strokeDashoffset={226 * (1 - 0.84)} className="text-emerald-500" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white">84%</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Resonance Sync</p>
                        </div>
                      </div>

                      <div className="bg-black/60 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 flex items-center justify-center relative">
                          <Zap className="text-blue-400" size={32} />
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-500/10" />
                            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="226" strokeDashoffset={226 * (1 - 0.92)} className="text-blue-500" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white">92%</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Efficiency α</p>
                        </div>
                      </div>

                      <div className="bg-black/60 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 flex items-center justify-center relative">
                          <TrendingUp className="text-amber-400" size={32} />
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-amber-500/10" />
                            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="226" strokeDashoffset={226 * (1 - 0.76)} className="text-amber-500" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white">76%</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Yield Momentum</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Live Telemetry Shards</h4>
                      <div className="space-y-4">
                        {[
                          { node: 'INGEST_01', val: '42.4 kg/m²', status: 'NOMINAL', time: '2s ago' },
                          { node: 'MESH_NODE_7', val: '12.1% Moisture', status: 'NOMINAL', time: '5s ago' },
                          { node: 'ORACLE_SYNC', val: '0.02 Drift', status: 'OPTIMIZING', time: '12s ago' }
                        ].map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <div>
                                <p className="text-[10px] font-mono text-white tracking-widest">{log.node}</p>
                                <p className="text-xs font-bold text-slate-400">{log.val}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{log.status}</p>
                              <p className="text-[8px] font-mono text-slate-600 mt-1">{log.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'SETTLEMENTS' && (
                  <motion.div
                    key="settlements"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                          <Lock className="text-emerald-400" size={24} />
                        </div>
                        <div>
                          <h5 className="text-sm font-black text-white uppercase tracking-tight">Smart Contract Auto-Settlement</h5>
                          <p className="text-[10px] text-slate-500">Automated EAC payments triggered by verified MRV milestones.</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-400">Active</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Contract Status</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {settlements.map(s => (
                        <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              s.status === 'SETTLED' ? 'bg-emerald-500/20 text-emerald-400' : 
                              s.status === 'VERIFIED' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {s.status === 'SETTLED' ? <CheckCircle2 size={20} /> : s.status === 'VERIFIED' ? <ShieldCheck size={20} /> : <Clock size={20} />}
                            </div>
                            <div>
                              <div className="text-xs font-black text-white uppercase tracking-tight">{s.amount} EAC</div>
                              <div className="text-[10px] font-mono text-slate-500">{s.evidenceHash}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${
                              s.status === 'SETTLED' ? 'text-emerald-400' : 
                              s.status === 'VERIFIED' ? 'text-blue-400' : 'text-amber-400'
                            }`}>{s.status}</div>
                            <div className="text-[10px] text-slate-500">{new Date(s.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'NETWORK' && (
                  <motion.div
                    key="network"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8 h-80 relative overflow-hidden flex items-center justify-center">
                      {/* Mock Mesh Visualization */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-500 rounded-full animate-ping" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/50 rounded-full" />
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="flex gap-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                              <Cpu className="text-blue-400" size={32} />
                            </div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Robot Node</div>
                          </div>
                          <div className="flex items-center">
                            <motion.div 
                              animate={{ x: [0, 100, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="w-4 h-4 bg-emerald-400 rounded-lg shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                            />
                            <div className="w-32 h-px bg-blue-500/30" />
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center">
                              <Database className="text-fuchsia-400" size={32} />
                            </div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Ledger Shard</div>
                          </div>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="text-xs font-black text-white uppercase tracking-tight">Evidence Shard Propagation</div>
                          <div className="text-[10px] text-slate-500 font-mono">SHARD_ID: 0x77...992 | LATENCY: 24ms</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                        <Share2 className="text-blue-400" size={18} />
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-tight">Mesh Nodes</div>
                          <div className="text-[10px] text-slate-500">12 Active Relay Nodes</div>
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                        <ArrowRightLeft className="text-emerald-400" size={18} />
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-tight">Throughput</div>
                          <div className="text-[10px] text-slate-500">1.2 MB/s Evidence Stream</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-12 bg-white/5 border border-white/5 rounded-[40px]">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <Target className="text-slate-700" size={40} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">No Plot Selected</h4>
                <p className="text-xs text-slate-500">Select a GIS plot from the sidebar to view its Digital MRV pipeline.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalMRV;
