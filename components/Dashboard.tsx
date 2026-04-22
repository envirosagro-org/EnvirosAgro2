import React, { useState, useEffect } from 'react';
import { useDeviceSensors } from '../hooks/useDeviceSensors';
import { iotService } from '../services/iotService';
import { SycamoreLogo } from './Icons';
// Added missing icons for environmental thrust, human heart resonance, registry connectivity, system config and ledger layers
import { 
  ShieldCheck, Zap, Globe, Activity, Cpu, Binary, 
  Coins, Users, ArrowRight, BrainCircuit, 
  TrendingUp, Fingerprint, Lock, Sprout, Briefcase, Database, Wallet, Pickaxe, History, Package, Trello,
  LayoutGrid, ArrowUpRight, ShoppingBag, Radio, Signal, Eye, ChevronRight,
  Gem, Landmark, PlayCircle, BookOpen, Lightbulb, CheckCircle2,
  AlertCircle, Target, Waves, ShieldAlert, UserPlus, AlertTriangle,
  Loader2, Atom, Network, Gauge, Leaf, Heart, Wifi, Settings, Layers
} from 'lucide-react';
import { ViewState, User, Order, AgroBlock } from '../types';
import { HenIcon } from './Icons';
import IdentityCard from './IdentityCard';
import { ShareButton } from './ShareButton';
import { NavigationLink } from './NavigationLink';

import { useAppNavigation } from '../hooks/useAppNavigation';
import { SEO } from './SEO';
import { AIOracle } from './AIOracle';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: User;
  isGuest: boolean;
  orders?: Order[];
  blockchain?: AgroBlock[];
  mempool?: any[];
  isMining?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, isGuest, orders = [], blockchain = [], mempool = [], isMining = false }) => {
  const { batteryLevel, isCharging, connectionType, isOnline } = useDeviceSensors();
  const { navigate } = useAppNavigation();
  const onNavigate = navigate;
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const [networkDrift, setNetworkDrift] = useState(0.02);
  const [isIoTActive, setIsIoTActive] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([
    { id: 'alt-1', type: 'CRITICAL', msg: 'Node EA-42 reporting 15% drop in Resonance', time: '2m ago' },
    { id: 'alt-2', type: 'INFO', msg: 'New Bounty Shard: 500 EAC for Sonic Soil Repair', time: '15m ago' },
  ]);
  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);

  const toggleIoT = () => {
    if (isIoTActive) {
      iotService.stopSimulation();
    } else {
      iotService.startOldSimulation((amount: number, reason: string) => console.log(`Reward: ${amount}, Reason: ${reason}`));
    }
    setIsIoTActive(!isIoTActive);
  };

  useEffect(() => {
    iotService.startOldSimulation((amount: number, reason: string) => console.log(`Reward: ${amount}, Reason: ${reason}`));
    const driftInterval = setInterval(() => {
      setNetworkDrift(prev => Number((prev + (Math.random() * 0.01 - 0.005)).toFixed(3)));
    }, 4000);
    return () => {
      clearInterval(driftInterval);
      iotService.stopSimulation();
    };
  }, []);

  const RECOMMENDATIONS = [
    { id: 'rec-1', title: 'OPTIMIZE M-CONSTANT', priority: 'High', icon: TrendingUp, target: 'intelligence', col: 'text-blue-400', desc: 'Regional stability below 1.42x. Initiate remediation shard.' },
    { id: 'rec-2', title: 'DIVERSIFY CROP DNA', priority: 'Medium', icon: Binary, target: 'biotech_hub', col: 'text-emerald-400', desc: 'Market demand for Bantu Rice surging. Forge new genetic shard.' },
    { id: 'rec-3', title: 'AUDIT FIELD PROOFS', priority: 'Critical', icon: ShieldAlert, target: 'tqm', col: 'text-rose-500', desc: '3 shipments awaiting digital GRN signature.' },
  ];

  const THRUSTS = [
    { id: 'S', label: 'Societal', val: user.metrics.socialImmunity || 82, col: 'text-rose-400', icon: Users },
    { id: 'E', label: 'Environmental', val: user.metrics.sustainabilityScore || 94, col: 'text-emerald-400', icon: Leaf },
    { id: 'H', label: 'Human', val: Math.round((user.metrics.timeConstantTau || 0.76) * 100), col: 'text-teal-400', icon: Heart },
    { id: 'T', label: 'Technological', val: Math.round((user.metrics.agriculturalCodeU || 0.88) * 100), col: 'text-blue-400', icon: Cpu },
    { id: 'I', label: 'Industry', val: Math.round((user.metrics.baselineM || 0.91) * 100), col: 'text-indigo-400', icon: Landmark },
  ];

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 w-full overflow-x-hidden pb-10 px-2 md:px-3 mx-auto w-full max-w-full">
      <SEO title="Dashboard" description="EnvirosAgro Dashboard: Monitor agricultural projects, blockchain, and sustainability." />
      
      {/* Network Pulse Ticker - Responsive */}
      <div className="glass-card p-2 rounded-xl md:rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shrink-0 relative">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.1),transparent)] -translate-x-full animate-[scan_3s_ease-in-out_infinite]"></div>
        <div className="flex items-center gap-2 px-3 md:px-6 shrink-0 relative z-10">
           <button 
             onClick={toggleIoT}
             className={`flex items-center gap-2 ${isIoTActive ? 'text-emerald-400' : 'text-slate-500'}`}
           >
             <Cpu className="w-4 h-4" />
             <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{isIoTActive ? 'IOT_ON' : 'START_IOT'}</span>
           </button>
        </div>
        <div className="flex-1 px-4 overflow-hidden relative z-10 text-[9px] font-mono font-black uppercase tracking-widest text-emerald-400/80 truncate">
           FINALITY: {blockchain[0]?.hash.substring(0, 8) || '0xGENESIS'} • RESONANCE: 1.42x • DRIFT: {networkDrift}μ • SYCAMORE_OS_v6.5
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Identity & Metrics */}
        <div className="xl:col-span-8 space-y-4">
          <div className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl bg-black/40 border border-white/5 border-l-4 md:border-l-8 border-l-emerald-600 shadow-xl">
             
             <div className="flex flex-col sm:flex-row justify-between gap-4 items-center pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg relative shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white drop-shadow-lg">
                      {user.name.split(' ')[0]} <span className="text-emerald-400">{user.name.split(' ')[1] || 'STEWARD'}</span>
                    </h3>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
                
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                   <NavigationLink path="profile/card" className="flex-1 sm:flex-none px-4 py-2.5 agro-gradient rounded-lg text-[9px] font-black uppercase tracking-widest text-white transition-all shadow-lg flex items-center justify-center gap-2">
                     <Fingerprint size={12} /> ID
                   </NavigationLink>
                   <NavigationLink path="settings" className="px-4 py-2.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                     <Settings size={12} />
                   </NavigationLink>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'TREASURY', val: totalBalance.toFixed(0), icon: Coins, col: 'text-emerald-400' },
                  { label: 'RESONANCE', val: user.wallet.exchangeRate.toFixed(1), icon: Gauge, col: 'text-blue-400' },
                  { label: 'QUORUM', val: blockchain.length + 4281, icon: Layers, col: 'text-indigo-400' },
                  { label: 'VITALITY', val: user.metrics.sustainabilityScore, icon: Sprout, col: 'text-emerald-500' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 bg-black/60 rounded-2xl border border-white/5 space-y-1">
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-xl font-mono font-black text-white ${stat.col}`}>{stat.val}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Hub */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <AIOracle 
            telemetryContext={`User: ${user.name}. Balance: ${user.wallet.balance}. Sustainability: ${user.metrics.sustainabilityScore}. Resonance: ${user.wallet.exchangeRate}.`} 
            isDashboardView={true} 
          />
        </div>
      </div>

      {/* Blockchain Activity */}
      <div className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
          BLOCKCHAIN ACTIVITY <Activity className="w-4 h-4 text-emerald-500" />
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={blockchain.slice(0, 10).reverse()}>
              <XAxis dataKey="index" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #333' }} />
              <Bar dataKey="transactions.length" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEHTI Thrust Resonance Meters */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-2 text-slate-500 border-b border-white/5 pb-2 w-full">
             <Target className="w-4 h-4 text-emerald-400 animate-pulse" /> THE FIVE <span className="text-emerald-400">THRUSTS</span> (SEHTI)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-2">
           {THRUSTS.map((t) => (
             <NavigationLink key={t.id} path="impact" className="glass-card p-6 rounded-3xl border border-white/5 bg-black/60 shadow-xl group hover:border-indigo-500/30 transition-all flex flex-col items-center text-center space-y-4 relative overflow-hidden active:scale-[0.98] duration-300 cursor-pointer">
                <div className="absolute -bottom-4 -right-4 p-2 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><t.icon size={120} className={t.col} /></div>
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${t.col} shadow-inner group-hover:rotate-12 transition-transform`}>
                   <t.icon size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{t.label}</h4>
                   <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest mt-2 italic">Pillar_{t.id}</p>
                </div>
                <div className="w-full space-y-2 pt-2 border-t border-white/5">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600 px-1">
                      <span>Resonance</span>
                      <span className={`${t.col} font-mono`}>{t.val}%</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-[2.5s] ${t.col.replace('text', 'bg')} shadow-[0_0_10px_currentColor]`} style={{ width: `${t.val}%` }}></div>
                   </div>
                </div>
             </NavigationLink>
           ))}
        </div>
      </div>

      {/* Mesh Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10 px-4">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-10 rounded-[56px] border border-rose-500/20 bg-rose-500/[0.02] space-y-8 shadow-3xl">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                <ShieldAlert className="text-rose-500" size={20} />
                Mesh Alerts
              </h4>
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-[8px] font-black text-rose-400 uppercase">2 ACTIVE</span>
            </div>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="p-6 bg-black/40 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-rose-500/40 transition-all cursor-pointer">
                  <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase ${alert.type === 'CRITICAL' ? 'text-rose-500' : 'text-blue-400'}`}>{alert.type}</p>
                    <p className="text-xs font-bold text-white">{alert.msg}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Strategic Path Execution */}
          <div className="space-y-6">
            <div className="flex items-center gap-6 px-10 mb-6">
               <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20"><AlertCircle className="text-amber-500" /></div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">STRATEGIC <span className="text-amber-500">QUORUM</span></h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
               {RECOMMENDATIONS.map((rec) => (
                 <div key={rec.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/60 shadow-3xl group hover:border-indigo-500/40 transition-all flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><rec.icon size={250} /></div>
                    <div className="space-y-6 relative z-10">
                       <div className="flex justify-between items-start">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${rec.col} shadow-inner group-hover:rotate-6 transition-all`}>
                             <rec.icon size={32} />
                          </div>
                          <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl transition-all ${
                             rec.priority === 'High' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 
                             rec.priority === 'Critical' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                             'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                             {rec.priority} PRIORITY
                          </span>
                       </div>
                       <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none m-0 drop-shadow-2xl">{rec.title}</h4>
                       <p className="text-base text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity font-medium">"{rec.desc}"</p>
                    </div>
                    <button 
                      onClick={() => onNavigate(rec.target as ViewState)}
                      className="w-full py-6 mt-10 bg-white/5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white hover:bg-emerald-600 hover:border-emerald-400 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl relative z-10"
                    >
                       EXECUTE_STRATEGY <ArrowRight size={18} />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;