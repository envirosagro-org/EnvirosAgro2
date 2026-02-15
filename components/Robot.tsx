import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bot, 
  Shield, 
  Zap, 
  Network, 
  Loader2, 
  Cpu, 
  Activity, 
  Terminal, 
  Database, 
  Lock, 
  Search, 
  X, 
  CheckCircle2, 
  Radio, 
  Globe, 
  Target, 
  Bug, 
  SmartphoneNfc, 
  ShieldAlert, 
  Fingerprint, 
  Stamp, 
  ArrowRight, 
  Radar, 
  Waves, 
  Wifi, 
  ChevronRight,
  Maximize2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Eye,
  Settings,
  // Added missing Trash2 and Sparkles imports
  Trash2,
  Sparkles
} from 'lucide-react';
import { User, ViewState, SignalShard } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface RobotProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

interface Crawler {
  id: string;
  name: string;
  type: 'SoilProbe' | 'SpectralDrone' | 'HarvesterBot';
  status: 'ACTIVE' | 'MAINTENANCE' | 'SECURITY_LOCK';
  handshake: 'ZK_VERIFIED' | 'PENDING';
  load: number;
  battery: number;
  threatLevel: number;
}

const INITIAL_FLEET: Crawler[] = [
  { id: 'BOT-8821', name: 'Probe Alpha-1', type: 'SoilProbe', status: 'ACTIVE', handshake: 'ZK_VERIFIED', load: 42, battery: 88, threatLevel: 2 },
  { id: 'BOT-1042', name: 'Scout Delta', type: 'SpectralDrone', status: 'ACTIVE', handshake: 'ZK_VERIFIED', load: 78, battery: 45, threatLevel: 5 },
  { id: 'BOT-4420', name: 'Harvester Core', type: 'HarvesterBot', status: 'MAINTENANCE', handshake: 'PENDING', load: 0, battery: 12, threatLevel: 0 },
];

const Robot: React.FC<RobotProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'security' | 'terminal' | 'radar'>('registry');
  const [fleet, setFleet] = useState<Crawler[]>(INITIAL_FLEET);
  const [packetLogs, setPacketLogs] = useState<any[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  const terminalRef = useRef<HTMLDivElement>(null);

  // Packet Stream Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ['BOT-8821', 'BOT-1042', 'EXTERNAL_IP', 'ORACLE_RELAY'];
      const actions = ['GET_GEOMAP', 'PUSH_TELEMETRY', 'AUTH_HANDSHAKE', 'M2M_SYNC'];
      const newPacket = {
        id: `PKT-${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
        time: new Date().toLocaleTimeString(),
        src: sources[Math.floor(Math.random() * sources.length)],
        act: actions[Math.floor(Math.random() * actions.length)],
        risk: Math.random() > 0.95 ? 'CRITICAL' : Math.random() > 0.8 ? 'MEDIUM' : 'LOW'
      };
      setPacketLogs(prev => [newPacket, ...prev].slice(0, 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const selectedBot = useMemo(() => fleet.find(b => b.id === selectedBotId), [fleet, selectedBotId]);

  const handleNeuralAudit = async () => {
    if (isAuditing) return;
    const fee = 20;
    if (!await onSpendEAC(fee, 'SWARM_SECURITY_NEURAL_AUDIT')) return;

    setIsAuditing(true);
    setAuditReport(null);

    try {
      const logSample = packetLogs.slice(0, 5).map(p => `[${p.time}] ${p.src}: ${p.act} (RISK: ${p.risk})`).join('\n');
      const prompt = `Act as the EnvirosAgro Cyber-Security Oracle. Analyze this crawler packet stream for Node ${user.esin}:\n\n${logSample}\n\nIdentify anomalies, potential SID injections, or unverified M2M handshakes. Provide a technical remediation shard.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setAuditReport(res.text);
      onEarnEAC(10, 'SECURITY_THREAT_IDENTIFIED');
    } catch (e) {
      setAuditReport("ORACLE_SYNC_ERROR: Security buffer parity failed.");
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleBotLock = (id: string) => {
    setFleet(prev => prev.map(b => {
      if (b.id === id) {
        const newStatus = b.status === 'SECURITY_LOCK' ? 'ACTIVE' : 'SECURITY_LOCK';
        return { ...b, status: newStatus as any };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Swarm HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Bot size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Fleet Resonance</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">94.2<span className="text-xl text-indigo-500 ml-1 italic">%</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Swarm v2.4</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Active Sync</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-rose-500/20 bg-rose-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><ShieldAlert size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.5em]">Threat Vectors</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">{packetLogs.filter(p => p.risk === 'CRITICAL').length}</h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Intranet Guard</span>
              <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest">Locked Down</span>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[56px] border border-white/10 bg-black/40 flex items-center justify-between shadow-3xl">
           <div className="space-y-6 flex-1 px-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Swarm <span className="text-indigo-400">Command</span> Terminal</h3>
              <p className="text-slate-500 text-base italic font-medium leading-relaxed max-sm:text-sm max-w-sm hidden sm:block">"Monitoring autonomous crawlers and securing the M2M handshake layer against industrial espionage."</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('security')}
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-3"
                >
                  <Shield size={18} /> Emergency Lock
                </button>
              </div>
           </div>
           <div className="w-40 h-40 hidden md:flex items-center justify-center relative shrink-0">
              <div className="absolute inset-0 border-4 border-dashed border-indigo-500/10 rounded-full animate-spin-slow"></div>
              <Activity size={64} className="text-indigo-500/30" />
           </div>
        </div>
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-10 relative z-20">
        {[
          { id: 'registry', label: 'Fleet Registry', icon: Database },
          { id: 'security', label: 'Security Firewall', icon: Lock },
          { id: 'terminal', label: 'Packet Monitor', icon: Terminal },
          { id: 'radar', label: 'Swarm Radar', icon: Radar },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px] relative z-10">
        
        {/* VIEW: FLEET REGISTRY */}
        {activeTab === 'registry' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {fleet.map(bot => (
                  <div key={bot.id} className={`glass-card p-10 rounded-[64px] border-2 transition-all group flex flex-col justify-between h-[550px] shadow-3xl relative overflow-hidden active:scale-[0.99] ${bot.status === 'SECURITY_LOCK' ? 'bg-rose-950/10 border-rose-500/40' : 'bg-black/40 border-white/5 hover:border-indigo-500/40'}`}>
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Bot size={300} /></div>
                     
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner group-hover:rotate-6 transition-all ${bot.status === 'SECURITY_LOCK' ? 'text-rose-500' : 'text-indigo-400'}`}>
                           <Bot size={32} />
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl ${
                             bot.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                             bot.status === 'MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             'bg-rose-600/20 text-rose-500 border-rose-500/40 animate-pulse'
                           }`}>{bot.status}</span>
                           <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{bot.id}</p>
                        </div>
                     </div>

                     <div className="space-y-4 relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{bot.name}</h4>
                        <div className="flex items-center gap-3">
                           <Cpu size={14} className="text-slate-500" />
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{bot.type}</p>
                        </div>
                     </div>

                     <div className="space-y-6 pt-10 border-t border-white/5 relative z-10">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                              <span>Computational Load</span>
                              <span className="text-indigo-400 font-mono">{bot.load}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-1000" style={{ width: `${bot.load}%` }}></div>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                              <span>Battery Reservoir</span>
                              <span className="text-emerald-400 font-mono">{bot.battery}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000" style={{ width: `${bot.battery}%` }}></div>
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                        <button 
                          onClick={() => toggleBotLock(bot.id)}
                          className={`flex-1 py-5 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 border-2 ${
                            bot.status === 'SECURITY_LOCK' ? 'bg-indigo-600 text-white border-white/20' : 'bg-rose-950/20 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white'
                          }`}
                        >
                           {bot.status === 'SECURITY_LOCK' ? 'RELEASE_SHARD' : 'ISOLATE_NODE'}
                        </button>
                        <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all"><Maximize2 size={20}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW: PACKET MONITOR */}
        {activeTab === 'terminal' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[700px] relative">
                 <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-14">
                    <div className="flex items-center gap-6">
                       <Terminal className="w-8 h-8 text-indigo-400" />
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Packet <span className="text-indigo-400">Stream</span></h3>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                          <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">INGEST_RATE: 124 pkts/s</span>
                       </div>
                       {/* Fixed: Use Trash2 imported from lucide-react */}
                       <button onClick={() => setPacketLogs([])} className="p-3 bg-white/5 rounded-xl text-slate-700 hover:text-rose-500 transition-all"><Trash2 size={20}/></button>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[13px] bg-black/40 p-10 space-y-6">
                    {packetLogs.map((log, i) => (
                       <div key={i} className={`flex items-center gap-8 p-5 rounded-2xl border transition-all hover:bg-white/[0.02] animate-in slide-in-from-right-2 ${
                         log.risk === 'CRITICAL' ? 'bg-rose-600/10 border-rose-500/40 text-rose-500' : 'bg-white/[0.01] border-white/[0.03] text-slate-500'
                       }`}>
                          <span className="text-slate-800 font-bold shrink-0">[{log.time}]</span>
                          <span className="font-bold w-28 shrink-0 truncate">@{log.src}</span>
                          <span className="flex-1 italic tracking-tight">{log.act}</span>
                          <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${log.risk === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-indigo-500 opacity-20'}`}></div>
                             <span className="text-[9px] font-black uppercase tracking-widest w-16 text-right">{log.risk}</span>
                          </div>
                       </div>
                    ))}
                    {packetLogs.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <Activity size={100} className="animate-pulse" />
                        <p className="text-2xl font-black uppercase tracking-[0.5em] mt-8">AWAITING_INGEST</p>
                      </div>
                    )}
                 </div>

                 <div className="p-10 border-t border-white/5 bg-black/90 flex justify-between items-center px-14">
                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       QUORUM_VERIFIED_TRAFFIC
                    </div>
                    <button 
                      onClick={handleNeuralAudit}
                      disabled={isAuditing}
                      className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ring-white/5"
                    >
                       {isAuditing ? <Loader2 size={18} className="animate-spin" /> : <Bot size={18} />}
                       NEURAL_TRAFFIC_AUDIT
                    </button>
                 </div>
              </div>

              {auditReport && (
                 <div className="animate-in slide-in-from-bottom-10 duration-1000">
                    <div className="p-12 md:p-16 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 shadow-3xl border-l-[24px] border-l-indigo-600 relative overflow-hidden group/audit text-left">
                       {/* Fixed: Use Sparkles imported from lucide-react */}
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/audit:scale-110 transition-transform duration-[15s]"><Sparkles size={800} className="text-indigo-400" /></div>
                       <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                          <div className="flex items-center gap-8">
                             <Bot className="w-14 h-14 text-indigo-400 animate-pulse" />
                             <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Security Audit Verdict</h4>
                          </div>
                          <button onClick={() => setAuditReport(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-white transition-all"><X size={24}/></button>
                       </div>
                       <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-10 border-l-2 border-white/10">
                          {auditReport}
                       </div>
                       <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                          <div className="flex items-center gap-8">
                             <Fingerprint size={48} className="text-indigo-400" />
                             <div className="text-left">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">SHARD_ID</p>
                                <p className="text-xl font-mono text-white italic">0xHS_SEC_#{(Math.random()*1000).toFixed(0)}</p>
                             </div>
                          </div>
                          <button className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">ANCHOR TO SECURITY LEDGER</button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* VIEW: SWARM RADAR */}
        {activeTab === 'radar' && (
           <div className="flex items-center justify-center py-20 animate-in zoom-in duration-1000 h-full min-h-[600px]">
              <div className="relative w-[500px] h-[500px]">
                 {/* Radar Circles */}
                 <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
                 <div className="absolute inset-[100px] border-2 border-indigo-500/10 rounded-full"></div>
                 <div className="absolute inset-[200px] border-2 border-indigo-500/5 rounded-full"></div>
                 
                 {/* Sweeping Line */}
                 <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent origin-left animate-spin-slow"></div>

                 {/* Nodes */}
                 {fleet.map((bot, i) => (
                    <div 
                      key={bot.id}
                      className="absolute w-6 h-6 -ml-3 -mt-3 group cursor-pointer transition-all duration-700"
                      style={{ 
                        left: `${20 + (i * 25)}%`, 
                        top: `${30 + (i * 20)}%`,
                        filter: bot.status === 'SECURITY_LOCK' ? 'hue-rotate(320deg)' : 'none'
                      }}
                      onClick={() => setSelectedBotId(bot.id)}
                    >
                       <div className={`w-full h-full rounded-full border-2 border-white shadow-2xl animate-pulse ${bot.status === 'SECURITY_LOCK' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                       <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          <span className="text-[10px] font-black text-white uppercase italic">{bot.name}</span>
                       </div>
                    </div>
                 ))}

                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff] z-10"></div>
                    <div className="absolute inset-[-40px] border-4 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Robot;