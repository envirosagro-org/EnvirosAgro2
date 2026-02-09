
import React, { useState, useMemo } from 'react';
import { 
  Siren, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Bot, 
  Sparkles, 
  Radio, 
  Activity, 
  Flame, 
  Waves, 
  Wind, 
  Bug, 
  Skull, 
  PlusCircle, 
  History, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  X, 
  Database, 
  Fingerprint, 
  ShieldCheck, 
  Lock, 
  Clock, 
  HardHat, 
  BookOpen, 
  Target, 
  Binary,
  CloudRain,
  Thermometer,
  ShieldPlus,
  Send,
  Download,
  Terminal,
  RotateCcw,
  SearchCode,
  Info,
  Search,
  FileText,
  Stamp
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { User, SignalShard } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface EmergencyProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

const REGIONAL_HAZARDS = [
  { id: 'H-01', title: 'Locust Swarm Inflow', type: 'Pest', risk: 'Critical', node: 'Node_Paris_04', time: '12m ago', col: 'text-rose-500' },
  { id: 'H-02', title: 'Sudden Thermal Drift', type: 'Weather', risk: 'High', node: 'Stwd_Nairobi', time: '1h ago', col: 'text-amber-500' },
  { id: 'H-03', title: 'Water Purity Anomaly', type: 'Biological', risk: 'Medium', node: 'Global_Alpha', time: '4h ago', col: 'text-blue-500' },
];

const SAFETY_SHARDS = [
  { title: 'Bio-Hazard Handling', cat: 'Protocol', icon: Skull, col: 'text-rose-400' },
  { title: 'Drone Crash Recovery', cat: 'Technical', icon: Zap, col: 'text-blue-400' },
  { title: 'Toxin Remediation', cat: 'Scientific', icon: ShieldAlert, col: 'text-amber-500' },
  { title: 'Emergency Soil Purge', cat: 'Environmental', icon: RotateCcw, col: 'text-emerald-400' },
];

const EmergencyPortal: React.FC<EmergencyProps> = ({ user, onEarnEAC, onSpendEAC, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'sos' | 'safety' | 'remediation'>('alerts');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [sosStep, setSosStep] = useState<'form' | 'sign' | 'success'>('form');
  const [sosType, setSosType] = useState('Pest Outbreak');
  const [sosDesc, setSosDesc] = useState('');
  const [esinSign, setEsinSign] = useState('');
  const [broadcastedIds, setBroadcastedIds] = useState<Set<string>>(new Set());
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [remediationAdvice, setRemediationAdvice] = useState<string | null>(null);
  const [threatSubject, setThreatSubject] = useState('');

  const threatRadarData = [
    { subject: 'Biological', A: 85, fullMark: 100 },
    { subject: 'Climatic', A: 72, fullMark: 100 },
    { subject: 'Technical', A: 68, fullMark: 100 },
    { subject: 'Societal', A: 40, fullMark: 100 },
    { subject: 'Yield Risk', A: 94, fullMark: 100 },
  ];

  const handleBroadcastSOS = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setSosStep('success');
      onEarnEAC(20, 'EMERGENCY_SHARD_BROADCAST');
      
      onEmitSignal({
        type: 'emergency',
        origin: 'EMERGENCY_CMD',
        title: `CRITICAL_SOS: ${sosType.toUpperCase()}`,
        message: sosDesc,
        priority: 'critical',
        actionIcon: 'Siren',
        meta: { target: 'emergency_portal', ledgerContext: 'EMERGENCY' }
      });
    }, 2500);
  };

  const handleBroadcastAlert = async (hazard: any) => {
    if (broadcastedIds.has(hazard.id)) return;
    
    await onEmitSignal({
      type: 'emergency',
      origin: 'EMERGENCY_CMD',
      title: `REGIONAL_HAZARD: ${hazard.title.toUpperCase()}`,
      message: `Anomaly detected at ${hazard.node}. Verification pending. Level: ${hazard.risk}.`,
      priority: hazard.risk === 'Critical' ? 'critical' : 'high',
      actionIcon: 'AlertTriangle',
      meta: { target: 'emergency_portal', ledgerContext: 'EMERGENCY' }
    });
    
    setBroadcastedIds(prev => new Set(prev).add(hazard.id));
  };

  const runEmergencyDiagnostic = async () => {
    if (!threatSubject.trim()) return;
    setIsAnalyzing(true);
    setRemediationAdvice(null);

    const fee = 50;
    if (!await onSpendEAC(fee, `CRISIS_REMEDIATION_AUDIT_${threatSubject.toUpperCase()}`)) {
      setIsAnalyzing(false);
      return;
    }

    try {
      const prompt = `Act as an EnvirosAgro Crisis Response Specialist. Analyze this immediate threat: "${threatSubject}". 
      Assess the impact on regional m-constant stability and C(a) constant. 
      Provide a technical 4st-stage remediation shard including containment, neutralisation, and registry reporting.`;
      const response = await chatWithAgroExpert(prompt, []);
      setRemediationAdvice(response.text);
    } catch (e) {
      setRemediationAdvice("Oracle Handshake Interrupted: Threat depth exceeded initial buffer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      <div className="glass-card p-12 rounded-[56px] border-rose-500/20 bg-rose-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
            <Siren className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-rose-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
            <Siren className="w-20 h-20 text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-rose-500/20 shadow-inner">EMERGENCY_NODE_v5.0</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Crisis <span className="text-rose-500">Command</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl italic leading-relaxed">
               "Securing the registry against catastrophic agricultural anomalies. Broadcast SOS signals and synthesize remediation shards in real-time."
            </p>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'alerts', label: 'Hazard Feed', icon: Radio },
          { id: 'sos', label: 'Signal Broadcast', icon: Siren },
          { id: 'remediation', label: 'Remediation Oracle', icon: Bot },
          { id: 'safety', label: 'Safety Vault', icon: ShieldCheck },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between px-4 border-b border-white/5 pb-6">
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-rose-500">Hazard Registry</span></h3>
                   <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded-full border border-rose-500/20">4 Active Signals</span>
                </div>
                <div className="grid gap-6">
                   {REGIONAL_HAZARDS.map(h => (
                     <div key={h.id} className="p-10 glass-card rounded-[48px] border-2 border-white/5 hover:border-rose-500/30 transition-all group flex flex-col md:flex-row items-center justify-between shadow-3xl bg-black/40 text-white">
                        <div className="flex items-center gap-8 flex-1">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-all">
                              <AlertTriangle className={`w-8 h-8 ${h.col}`} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-2xl font-black text-white uppercase italic leading-none">{h.title}</h4>
                              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">ID: {h.id} // ORIGIN: {h.node}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                           <div className="text-center md:text-right">
                              <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Impact Level</p>
                              <span className={`text-xl font-mono font-black ${h.col}`}>{h.risk.toUpperCase()}</span>
                           </div>
                           <button 
                             onClick={() => handleBroadcastAlert(h)}
                             disabled={broadcastedIds.has(h.id)}
                             className={`px-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${broadcastedIds.has(h.id) ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-500 cursor-default' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                           >
                             {broadcastedIds.has(h.id) ? 'BROADCASTED' : 'BROADCAST TO MESH'}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-xl min-h-[500px] text-white">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10">Regional Threat Density</h4>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={threatRadarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontStyle="italic" />
                            <Radar name="Threat" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="pt-10 border-t border-white/5 w-full mt-10">
                      <div className="flex items-center gap-4 text-rose-500 font-black text-[10px] uppercase justify-center italic">
                         <Activity size={14} className="animate-pulse" /> Live Monitoring Cluster active
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'sos' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 glass-card rounded-[64px] border-rose-500/20 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><AlertTriangle size={500} className="text-rose-500" /></div>
                {sosStep === 'form' && (
                  <div className="space-y-10 relative z-10 animate-in slide-in-from-right-4">
                     <div className="w-24 h-24 bg-rose-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                        <Siren size={48} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Initialize <span className="text-rose-500">SOS Shard</span></h3>
                        <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto italic">Broadcast a critical threat signal to all nodes in your regional cluster.</p>
                     </div>
                     <div className="space-y-8 max-w-xl mx-auto">
                        <div className="space-y-2 text-left">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Threat Category</label>
                           <select value={sosType} onChange={e => setSosType(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-rose-500/10 transition-all uppercase text-sm">
                              <option>Pest Outbreak</option>
                              <option>Industrial Hardware Failure</option>
                              <option>Biological Pathogen (Soil/Water)</option>
                              <option>Extreme Weather Damage</option>
                              <option>SID Contamination Signal</option>
                           </select>
                        </div>
                        <div className="space-y-2 text-left">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Threat Narrative</label>
                           <textarea 
                             value={sosDesc} onChange={e => setSosDesc(e.target.value)}
                             placeholder="Provide technical details of the anomaly..."
                             className="w-full bg-black/60 border border-white/10 rounded-3xl p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-rose-500/10 outline-none h-40 resize-none placeholder:text-slate-900 shadow-inner"
                           />
                        </div>
                        <button 
                          onClick={() => setSosStep('sign')}
                          disabled={!sosDesc.trim()}
                          className="w-full py-8 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                        >
                           INITIALIZE BROADCAST SEQUENCE
                        </button>
                     </div>
                  </div>
                )}
                {sosStep === 'sign' && (
                  <div className="space-y-12 relative z-10 animate-in slide-in-from-right-4">
                     <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-rose-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-rose-500/20 shadow-2xl group relative overflow-hidden">
                           <Fingerprint className="w-12 h-12 text-rose-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Steward <span className="text-rose-500">Auth Signature</span></h4>
                     </div>
                     <div className="space-y-4 max-w-xl mx-auto">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Signature ESIN</label>
                        <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX-XXXX" 
                           className="w-full bg-black border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-rose-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                        />
                     </div>
                     <button 
                       onClick={handleBroadcastSOS}
                       disabled={isBroadcasting || !esinSign}
                       className="w-full py-10 agro-gradient-rose rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30"
                     >
                        {isBroadcasting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send size={24} fill="current" />}
                        {isBroadcasting ? "BROADCASTING SHARD..." : "AUTHORIZE SOS SIGNAL"}
                     </button>
                  </div>
                )}
                {sosStep === 'success' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center relative z-10">
                     <div className="w-56 h-56 agro-gradient-rose rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(244,63,94,0.3)] relative group">
                        <CheckCircle2 size={24} h-24 text-white group-hover:scale-110 transition-transform />
                     </div>
                     <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Signal <span className="text-rose-500">Sent</span></h3>
                     <button onClick={() => setSosStep('form')} className="w-full max-w-md py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'remediation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-700">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-rose-500/20 bg-rose-500/5 space-y-10 shadow-2xl relative overflow-hidden group">
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="p-4 bg-rose-600 rounded-[28px] shadow-3xl"><Bot size={32} className="text-white" /></div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Crisis <span className="text-rose-500">Oracle</span></h3>
                   </div>
                   <div className="space-y-8 relative z-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Threat Subject</label>
                         <input 
                           type="text" value={threatSubject} onChange={e => setThreatSubject(e.target.value)}
                           placeholder="e.g. Chemical contamination Sector 4"
                           className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-rose-500/10 shadow-inner" 
                         />
                      </div>
                      <button 
                        onClick={runEmergencyDiagnostic}
                        disabled={isAnalyzing || !threatSubject.trim()}
                        className="w-full py-8 agro-gradient-rose rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30"
                      >
                         {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap size={20} fill="current" />}
                         {isAnalyzing ? "ANALYZING THREAT..." : "INITIALIZE REMEDIATION"}
                      </button>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[650px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl text-white">
                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-4 text-rose-500">
                         <Terminal className="w-6 h-6" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Shard Terminal</span>
                      </div>
                   </div>
                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                      {isAnalyzing ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 bg-black/80 backdrop-blur-md z-20">
                             <Loader2 className="w-24 h-24 text-rose-500 animate-spin" />
                             <p className="text-rose-500 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING THREAT VECTOR...</p>
                          </div>
                       ) : remediationAdvice ? (
                          <div className="animate-in slide-in-from-bottom-10 duration-700">
                             <div className="p-12 md:p-16 bg-black/60 rounded-[64px] border border-rose-500/20 border-l-8 shadow-inner relative overflow-hidden">
                                <div className="prose prose-invert prose-rose max-w-none text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-8">
                                   {remediationAdvice}
                                </div>
                             </div>
                             <div className="flex justify-center mt-12 gap-6">
                                <button className="px-16 py-8 agro-gradient-rose rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">COMMENCE CONTAINMENT</button>
                                <button className="p-8 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all"><Download size={24} /></button>
                             </div>
                          </div>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                             <Sparkles size={120} className="text-slate-500 group-hover:text-rose-500 transition-colors" />
                             <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic">ORACLE STANDBY</p>
                          </div>
                       )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'safety' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                 {SAFETY_SHARDS.map((shard, i) => (
                    <div key={i} className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all shadow-3xl relative overflow-hidden group flex flex-col h-[400px] text-white">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><BookOpen size={160} /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 transition-all shadow-xl`}>
                             <shard.icon size={28} className={shard.col} />
                          </div>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest">{shard.cat}</span>
                       </div>
                       <h4 className="text-3xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0 flex-1">{shard.title}</h4>
                       <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-white hover:bg-emerald-600/20 transition-all flex items-center justify-center gap-3">
                          <FileText size={16} /> READ SHARD
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 63, 94, 0.2); border-radius: 10px; }
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default EmergencyPortal;
