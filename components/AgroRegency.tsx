import React, { useState, useMemo } from 'react';
import { 
  History, 
  Infinity, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Loader2, 
  Binary, 
  Layers, 
  Compass, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Trash2, 
  Database, 
  Fingerprint, 
  RotateCcw, 
  Target, 
  LineChart, 
  FlaskConical, 
  Scale, 
  X,
  FileSearch,
  CheckCircle2,
  FileCheck,
  Binoculars,
  History as TimeIcon,
  Info,
  ShieldAlert,
  Coins,
  Terminal,
  SearchCode,
  Download,
  ChevronRight,
  Stamp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface AgroRegencyProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
}

const HISTORICAL_SHARDS = [
  { id: 'REG-G-001', date: '2024.11.12', ca: 0.85, m: 6.2, type: 'Initial Ingest', status: 'ARCHIVED' },
  { id: 'REG-G-442', date: '2024.12.20', ca: 1.02, m: 7.4, type: 'Cycle 1 Sync', status: 'ARCHIVED' },
  { id: 'REG-G-882', date: '2025.01.15', ca: 1.20, m: 8.5, type: 'Cycle 2 Expansion', status: 'ACTIVE' },
];

const AgroRegency: React.FC<AgroRegencyProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'calculus' | 'retrieval' | 'oracle'>('calculus');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [queryId, setQueryId] = useState('');
  const [restoredShard, setRestoredShard] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  const derivativeData = useMemo(() => {
    return [
      { t: 'T1', velocity: 2.1, accel: 0.4 },
      { t: 'T2', velocity: 2.4, accel: 0.6 },
      { t: 'T3', velocity: 3.2, accel: 1.2 },
      { t: 'T4', velocity: 4.5, accel: 1.8 },
      { t: 'T5', velocity: 5.8, accel: 2.4 },
      { t: 'T6', velocity: 8.2, accel: 3.5 },
    ];
  }, []);

  const handleRetrievePast = () => {
    if (!queryId.trim()) return;
    setIsRetrieving(true);
    setTimeout(() => {
      const match = HISTORICAL_SHARDS.find(s => s.id === queryId);
      setRestoredShard(match || { id: queryId, status: 'NOT_FOUND' });
      setIsRetrieving(false);
      if (match) onEarnEAC(10, 'HISTORICAL_SHARD_RETRIEVAL_AUTH');
    }, 2000);
  };

  const handleOracleCalc = async () => {
    const fee = 15;
    if (!await onSpendEAC(fee, 'REGENCY_ORACLE_DERIVATIVE_AUDIT')) return;

    setIsAnalyzing(true);
    setOracleReport(null);
    try {
      const prompt = `Act as an EnvirosAgro Regency Oracle. Execute the dy/dx derivative for this node:
      Current C(a): ${user.metrics.agriculturalCodeU}
      Current m-constant: ${user.metrics.timeConstantTau}
      Historical baseline: ${user.metrics.baselineM}
      
      Calculate the "Regenerative Velocity" (dy/dx). Analyze if the rate of sustainability is accelerating or decaying. 
      Provide a technical remediation shard based on the calculus.`;
      const res = await chatWithAgroExpert(prompt, []);
      setOracleReport(res.text);
    } catch (e) {
      setOracleReport("Derivative node timeout. Handshake interrupted.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl text-white">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
            <Infinity className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.3)] ring-4 ring-white/10 shrink-0">
            <History className="w-20 h-20 text-white animate-spin-slow" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20 shadow-inner">REGISTRY_REGENCY_v5.0</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Agro <span className="text-indigo-400">Regency</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl italic leading-relaxed">
               "Retrieving the past to calculate the derivative of the future. Executing dy/dx sustainability framework shards for absolute node calibration."
            </p>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'calculus', label: 'dy/dx Calculus', icon: Infinity },
          { id: 'retrieval', label: 'Shard Retrieval', icon: FileSearch },
          { id: 'oracle', label: 'Regency Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeTab === 'calculus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 relative overflow-hidden flex flex-col shadow-3xl group text-white">
                <div className="flex justify-between items-center mb-12 relative z-10 px-4">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-xl group-hover:scale-110 transition-transform">
                         <Activity className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Regenerative <span className="text-indigo-400">Velocity</span></h3>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mt-3">EOS_CALCULUS_SYNC // dy/dx_ACTIVE</p>
                      </div>
                   </div>
                   <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] text-center min-w-[180px] shadow-2xl">
                      <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">Instantaneous Rate</p>
                      <p className="text-4xl font-mono font-black text-white">+1.84<span className="text-sm ml-1 text-emerald-400">Δ</span></p>
                   </div>
                </div>
                <div className="flex-1 h-[400px] w-full min-h-0 relative z-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={derivativeData}>
                         <defs>
                            <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                         <XAxis dataKey="t" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                         <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                         <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                         <Area type="monotone" name="Velocity (dy/dx)" dataKey="velocity" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorVelocity)" />
                         <Area type="stepAfter" name="Acceleration" dataKey="accel" stroke="#10b981" strokeWidth={2} fill="transparent" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="lg:col-span-4 space-y-8 text-white">
                <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-950/10 space-y-8 shadow-xl relative overflow-hidden group">
                   <h4 className="text-xl font-black text-white uppercase italic flex items-center gap-3 relative z-10">
                      <Binary className="w-6 h-6 text-emerald-400" /> Shard Formula
                   </h4>
                   <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4 shadow-inner relative z-10">
                      <p className="text-sm font-mono text-emerald-500 font-black leading-loose text-center">
                         dy/dx = lim[Δx→0] <br/> (f(x+Δx) - f(x)) / Δx
                      </p>
                   </div>
                   <button className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10">
                      <Zap size={16} fill="currentColor" /> Refresh Calculus Node
                   </button>
                </div>
             </div>
          </div>
        )}
        
        {activeTab === 'retrieval' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500 text-white">
              <div className="glass-card p-16 rounded-[64px] border border-white/10 bg-black/40 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                 <div className="text-center space-y-6 relative z-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                       <History size={48} />
                    </div>
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Retrieve <span className="text-indigo-400">Past Shards</span></h3>
                 </div>
                 <div className="space-y-8 max-w-xl mx-auto relative z-10">
                    <input 
                      type="text" value={queryId} onChange={e => setQueryId(e.target.value)}
                      placeholder="Enter Shard Identifier..." 
                      className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-3xl font-mono text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                    />
                    <button 
                      onClick={handleRetrievePast}
                      disabled={isRetrieving || !queryId}
                      className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30"
                    >
                       {isRetrieving ? <Loader2 className="w-8 h-8 animate-spin" /> : <TimeIcon className="w-8 h-8" />}
                       {isRetrieving ? 'QUERYING LEDGER...' : 'INITIALIZE RETRIEVAL'}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'oracle' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700 text-center text-white">
              <div className="p-10 md:p-20 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group">
                 <div className="relative z-10 space-y-8 w-full">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Regency <span className="text-indigo-400">Oracle</span></h3>
                 </div>
                 <button 
                  onClick={handleOracleCalc}
                  disabled={isAnalyzing}
                  className="w-full max-w-md py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30"
                 >
                    {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                    {isAnalyzing ? "EXECUTING CALCULUS..." : "EXECUTE dy/dx AUDIT"}
                 </button>
                 {oracleReport && (
                    <div className="mt-10 p-10 bg-black/60 rounded-[48px] border border-indigo-500/20 text-left animate-in fade-in">
                       <p className="text-slate-300 text-xl leading-loose italic">{oracleReport}</p>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

export default AgroRegency;