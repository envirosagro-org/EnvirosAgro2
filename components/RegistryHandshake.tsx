
import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Bot, 
  X, 
  Loader2, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  FileText, 
  Database, 
  Binary, 
  Fingerprint, 
  Waves, 
  Radio, 
  Activity, 
  Scan,
  RefreshCw,
  Lock,
  Stamp,
  Globe,
  Signal,
  BadgeCheck,
  Compass,
  ArrowRight,
  ShieldAlert,
  LocateFixed,
  ArrowLeftCircle,
  Cable
} from 'lucide-react';
import { User, AgroResource, ViewState } from '../types';

interface RegistryHandshakeProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate?: (view: ViewState) => void;
}

const RegistryHandshake: React.FC<RegistryHandshakeProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeWorkflow, setActiveWorkflow] = useState<'hardware' | 'land' | 'ledger' | null>(null);
  const [step, setStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [esinSign, setEsinSign] = useState('');

  // Hardware State
  const [deviceId, setDeviceId] = useState('');
  const [secretToken, setSecretToken] = useState('');

  // Land State
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);

  const reset = () => {
    setActiveWorkflow(null);
    setStep(0);
    setIsProcessing(false);
    setEsinSign('');
    setDeviceId('');
    setSecretToken('');
    setCurrentCoords(null);
    setUploadedDoc(null);
  };

  const handleGeoLock = () => {
    setIsProcessing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsProcessing(false);
        setStep(1);
      }, (error) => {
        alert("GEOLOCATION ERROR: Signal acquisition failed.");
        setIsProcessing(false);
      });
    } else {
      alert("SIGNAL_ERROR: Browser does not support geolocation.");
      setIsProcessing(false);
    }
  };

  const handleHardwarePair = () => {
    if (!deviceId || !secretToken) return;
    setIsProcessing(true);
    setTimeout(() => {
      setStep(1);
      setIsProcessing(false);
    }, 2000);
  };

  const finalizeVerification = (category: 'HARDWARE' | 'LAND') => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newResource: AgroResource = {
        id: category === 'HARDWARE' ? deviceId : `PLOT-${Math.floor(Math.random() * 9000 + 1000)}`,
        category,
        type: category === 'HARDWARE' ? 'Agro Musika Sensor' : 'Regenerative Plot',
        name: category === 'HARDWARE' ? 'Sonic Node P4' : 'Nairobi Buffer Shard',
        status: category === 'HARDWARE' ? 'VERIFIED' : 'PROVISIONAL',
        capabilities: category === 'HARDWARE' ? ['Sound_Dashboard', 'Bio_Sync'] : ['Weather_Sync', 'Impact_Tracking'],
        verificationMeta: {
          method: category === 'HARDWARE' ? 'QR_SCAN' : 'GEO_LOCK',
          verifiedAt: new Date().toISOString(),
          coordinates: currentCoords || undefined,
          deviceSecretHash: category === 'HARDWARE' ? btoa(secretToken) : undefined
        }
      };

      onUpdateUser({
        ...user,
        resources: [...(user.resources || []), newResource]
      });

      setStep(category === 'HARDWARE' ? 2 : 3);
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1200px] mx-auto px-4">
      {/* HUD Header */}
      <div className="flex justify-between items-center px-4">
        <button 
          onClick={() => onNavigate?.('dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-indigo-600/10 transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </button>
      </div>

      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <QrCode className="w-96 h-96 text-indigo-400" />
         </div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent animate-pulse"></div>
            <Zap className="w-16 h-16 text-white relative z-10" />
         </div>
         <div className="space-y-4 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20 shadow-inner">REGISTRY_HANDSHAKE_v5.0</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Registry <span className="text-indigo-400">Handshake</span></h2>
            </div>
            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
               "Cryptographic sharding for physical assets. Link your hardware nodes and physical land plots to the global EnvirosAgro registry."
            </p>
         </div>
      </div>

      <div className="min-h-[600px]">
        {!activeWorkflow ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in duration-500">
             {[
               { id: 'hardware', label: 'HARDWARE PAIRING', desc: 'Sync Agro Musika or Agroboto nodes via QR/Secret Handshake.', icon: Smartphone, col: 'text-blue-400', bg: 'bg-blue-600/10', border: 'border-blue-500/20' },
               { id: 'land', label: 'LAND VERIFICATION', desc: 'Anchor physical farm acreage via Geo-Lock and document sharding.', icon: MapPin, col: 'text-emerald-400', bg: 'bg-emerald-600/10', border: 'border-emerald-500/20' },
             ].map(opt => (
               <button 
                key={opt.id}
                onClick={() => setActiveWorkflow(opt.id as any)}
                className="glass-card p-16 rounded-[64px] border-2 border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center space-y-8 bg-black/40 shadow-3xl active:scale-[0.98]"
               >
                  <div className={`w-32 h-32 rounded-[44px] ${opt.bg} flex items-center justify-center border-2 ${opt.border} group-hover:scale-110 transition-transform shadow-2xl`}>
                     <opt.icon size={56} className={opt.col} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{opt.label}</h3>
                     <p className="text-slate-500 text-lg italic leading-relaxed max-sm:text-sm max-w-sm">"{opt.desc}"</p>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">
                     INITIALIZE_PROTOCOL <ArrowRight size={18} />
                  </div>
               </button>
             ))}
             
             <div className="col-span-full pt-10 border-t border-white/5 flex justify-center">
                <button 
                  onClick={() => setActiveWorkflow('ledger')}
                  className="px-12 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500 font-black text-[11px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
                >
                   <Database size={16} /> View Resource Shards
                </button>
             </div>
          </div>
        ) : activeWorkflow === 'hardware' ? (
          <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center px-4">
                <button onClick={reset} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">
                   <ChevronRight size={16} className="rotate-180" /> Back to Selector
                </button>
                <div className="flex gap-2">
                   {[0,1,2].map(i => (
                      <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-700 ${i <= step ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/10'}`}></div>
                   ))}
                </div>
             </div>

             {step === 0 && (
                <div className="glass-card p-12 rounded-[64px] border border-blue-500/20 bg-black/40 space-y-12 shadow-3xl text-center">
                   <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 animate-float shadow-2xl">
                      <Scan size={48} className="text-blue-400" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-4xl font-black text-white uppercase italic">Pairing <span className="text-blue-400">Node</span></h3>
                      <p className="text-slate-400 text-lg font-medium italic">"Input the unique device identifiers for high-fidelity sharding."</p>
                   </div>
                   
                   <div className="space-y-6 max-w-md mx-auto">
                      <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Device Identifier (S/N)</label>
                         <input 
                           type="text" value={deviceId} onChange={e => setDeviceId(e.target.value)}
                           placeholder="AM-XXXX-XXXX" 
                           className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xl font-mono text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase"
                         />
                      </div>
                      <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Verification Token</label>
                         <input 
                           type="password" value={secretToken} onChange={e => setSecretToken(e.target.value)}
                           placeholder="••••••••" 
                           className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xl font-mono text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                         />
                      </div>
                      <button 
                        onClick={handleHardwarePair}
                        disabled={!deviceId || !secretToken || isProcessing}
                        className="w-full py-8 bg-blue-600 hover:bg-blue-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                      >
                         {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : "Commence Pairing"}
                      </button>
                   </div>
                </div>
             )}

             {step === 1 && (
                <div className="glass-card p-12 rounded-[64px] border border-indigo-500/30 bg-black/40 space-y-12 shadow-3xl text-center">
                   <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20 shadow-3xl group">
                      <Fingerprint className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase italic">Registry <span className="text-indigo-400">Authorization</span></h3>
                   <div className="space-y-4 max-w-md mx-auto">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Node Signature (ESIN)</label>
                      <input 
                        type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                        placeholder="EA-XXXX-XXXX-XXXX" 
                        className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                      />
                   </div>
                   <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[44px] flex items-center gap-6 max-xl:mx-auto">
                      <ShieldAlert className="w-10 h-10 text-indigo-400 shrink-0" />
                      <p className="text-[10px] text-indigo-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic">
                         "Pairing commits your node to immediate telemetry sharding. Unauthorized pairing attempts will be logged by the Registry Oracle."
                      </p>
                   </div>
                   <button 
                      onClick={() => finalizeVerification('HARDWARE')}
                      disabled={isProcessing || !esinSign}
                      className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                   >
                      {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8 fill-current" />}
                      {isProcessing ? "MINTING SHARD..." : "AUTHORIZE PAIRING"}
                   </button>
                </div>
             )}

             {step === 2 && (
               <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-700 text-center">
                  <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110">
                     <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                     <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic">Pairing <span className="text-emerald-400">Finalized</span></h3>
                     <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0xNODE_SYNC_OK</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                     <button 
                        onClick={() => onNavigate?.('ingest')}
                        className="flex-1 px-8 py-6 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                        <Cable size={18} /> Manage Ingest
                     </button>
                     <button 
                        onClick={reset} 
                        className="flex-1 px-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-xl active:scale-95"
                     >
                        Return to Registry Hub
                     </button>
                  </div>
               </div>
             )}
          </div>
        ) : activeWorkflow === 'land' ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center px-4">
                <button onClick={reset} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">
                   <ChevronRight size={16} className="rotate-180" /> Back to Selector
                </button>
                <div className="flex gap-2">
                   {[0,1,2,3].map(i => (
                      <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-700 ${i <= step ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'}`}></div>
                   ))}
                </div>
             </div>

             {step === 0 && (
                <div className="glass-card p-16 rounded-[64px] border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-3xl">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s]"><Globe size={400} className="text-emerald-400" /></div>
                   <div className="w-64 h-64 bg-emerald-600 rounded-full flex flex-col items-center justify-center shadow-3xl shrink-0 animate-float relative overflow-hidden group">
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <LocateFixed size={96} className="text-white relative z-10" />
                      <div className="absolute inset-[-10px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                   </div>
                   <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
                      <div className="space-y-2">
                         <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">TIER_1: GEO_LOCK_PROTOCOL</span>
                         <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic m-0">ACQUIRE <br/> <span className="text-emerald-400">SIGNAL.</span></h2>
                      </div>
                      <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto lg:mx-0">
                         "To register a plot, stand physically on the land to commit your node coordinates to the global sharded map."
                      </p>
                      <button 
                        onClick={handleGeoLock}
                        disabled={isProcessing}
                        className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5"
                      >
                         {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Compass size={24} />}
                         INITIALIZE GEO-LOCK
                      </button>
                   </div>
                </div>
             )}

             {step === 1 && (
                <div className="glass-card p-12 rounded-[64px] border border-emerald-500/20 bg-black/40 space-y-12 shadow-3xl text-center animate-in slide-in-from-right-4">
                   <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl animate-float">
                      <Upload size={48} className="text-blue-400" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-4xl font-black text-white uppercase italic">Tier 2: <span className="text-blue-400">Stewardship Proof</span></h3>
                      <p className="text-slate-400 text-lg font-medium italic">"Upload a registry shard (Land Title, Lease, or Chief Letter) for Layer-2 Vetting."</p>
                   </div>
                   
                   <div 
                      onClick={() => setUploadedDoc('MOCK_DOC_SYNCED')}
                      className={`p-20 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center text-center space-y-6 group/upload cursor-pointer bg-black/40 ${uploadedDoc ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-blue-500/40'}`}
                   >
                      {!uploadedDoc ? (
                         <>
                            <FileText className="w-14 h-14 text-slate-700 group-hover:text-blue-400 transition-all duration-500" />
                            <div className="space-y-2">
                               <p className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Choose Doc Shard</p>
                               <p className="text-slate-500 text-xs font-black uppercase tracking-widest font-mono">PDF_OR_IMAGE_REQUIRED</p>
                            </div>
                         </>
                      ) : (
                         <div className="text-center space-y-4">
                            <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                            <p className="text-xl font-black text-emerald-400 uppercase italic">SHARD_BUFFERED_OK</p>
                            <button onClick={(e) => { e.stopPropagation(); setUploadedDoc(null); }} className="text-[10px] font-black text-slate-600 uppercase hover:text-rose-500 transition-colors">Discard and Retry</button>
                         </div>
                      )}
                   </div>

                   <div className="flex gap-4">
                      <button onClick={() => setStep(0)} className="px-10 py-10 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                      <button 
                        onClick={() => setStep(2)}
                        disabled={!uploadedDoc}
                        className="flex-1 py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                      >
                         Proceed to Authorization <ChevronRight size={20} />
                      </button>
                   </div>
                </div>
             )}

             {step === 2 && (
                <div className="glass-card p-12 rounded-[64px] border border-indigo-500/30 bg-black/40 space-y-12 shadow-3xl text-center animate-in slide-in-from-right-4">
                   <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20 shadow-3xl">
                      <Fingerprint className="w-12 h-12 text-indigo-400" />
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase italic">Registry <span className="text-indigo-400">Anchor</span></h3>
                   
                   <div className="space-y-8">
                      <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 text-left space-y-4 shadow-inner">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                            <span>Locked Lat</span>
                            <span className="text-white font-mono">{currentCoords?.lat.toFixed(6)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                            <span>Locked Lng</span>
                            <span className="text-white font-mono">{currentCoords?.lng.toFixed(6)}</span>
                         </div>
                      </div>

                      <div className="space-y-4 max-w-md mx-auto">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Node Signature (ESIN)</label>
                         <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX-XXXX" 
                           className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                         />
                      </div>
                   </div>

                   <button 
                      onClick={() => finalizeVerification('LAND')}
                      disabled={isProcessing || !esinSign}
                      className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                   >
                      {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8 fill-current" />}
                      {isProcessing ? "MINTING SHARD..." : "COMMIT LAND SHARD"}
                   </button>
                </div>
             )}

             {step === 3 && (
               <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-700 text-center">
                  <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                     <BadgeCheck className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                     <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic">Provisional <br/> <span className="text-emerald-400">Anchored</span></h3>
                     <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0xLAND_MINT_OK</p>
                  </div>
                  <p className="text-slate-500 text-lg max-sm:text-sm max-w-sm mx-auto leading-relaxed italic">
                    "Geo-lock committed. Document shard uploaded. Standing by for Registry Vetting Node final consensus (Tier 2 Verified status)."
                  </p>
                  <button onClick={reset} className="px-16 py-7 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry Hub</button>
               </div>
             )}
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-10 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Resource <span className="text-indigo-400">Ledger Shards</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Manage all physical assets immutably linked to node {user.esin}.</p>
                </div>
                <button onClick={reset} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Pair New Asset</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(user.resources || []).map(res => (
                   <div key={res.id} className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-indigo-500/20 transition-all group flex flex-col h-full bg-black/40 shadow-xl relative overflow-hidden">
                      <div className="flex justify-between items-start mb-10">
                         <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 group-hover:bg-indigo-600/10 transition-all shadow-inner`}>
                            {res.category === 'HARDWARE' ? <Smartphone size={28} className="text-blue-400" /> : <MapPin size={28} className="text-emerald-400" />}
                         </div>
                         <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                               res.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                               res.status === 'PROVISIONAL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' : 
                               'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>{res.status}</span>
                            <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase tracking-tighter italic">{res.id}</p>
                         </div>
                      </div>
                      <div className="flex-1 space-y-4">
                         <h4 className="text-2xl font-black text-white uppercase italic leading-tight group-hover:text-indigo-400 transition-colors m-0 tracking-tighter">{res.name}</h4>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{res.type} Shard</p>
                         <div className="flex flex-wrap gap-2 pt-4">
                            {res.capabilities.map(cap => (
                               <span key={cap} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">{cap}</span>
                            ))}
                         </div>
                      </div>
                      <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <History size={16} className="text-slate-600" />
                            <span className="text-[9px] font-black text-slate-600 uppercase">SYNC_OK</span>
                         </div>
                         <button className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">Manage Node</button>
                      </div>
                   </div>
                ))}
                {(user.resources || []).length === 0 && (
                   <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                      <div className="relative">
                         <Database size={80} className="text-slate-600 animate-pulse" />
                         <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                      </div>
                      <p className="text-xl font-black uppercase tracking-[0.5em] text-white">Registry Standby</p>
                      <button onClick={reset} className="text-[10px] font-black text-indigo-400 hover:text-white uppercase underline underline-offset-4 tracking-[0.2em]">Pair First Physical Asset</button>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

export default RegistryHandshake;
