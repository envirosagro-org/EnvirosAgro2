import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Bot, 
  X, 
  Loader2, 
  CheckCircle2, 
  SmartphoneNfc,
  Radio, 
  Scan,
  RefreshCw,
  Stamp,
  BadgeCheck,
  ArrowRight,
  ArrowLeftCircle,
  Satellite,
  Download,
  Fingerprint,
  Bluetooth,
  Globe,
  FileCheck,
  SearchCode
} from 'lucide-react';
import { User, AgroResource, ViewState } from '../types';

interface RegistryHandshakeProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate?: (view: ViewState) => void;
}

const RegistryHandshake: React.FC<RegistryHandshakeProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeWorkflow, setActiveWorkflow] = useState<'hardware' | 'land' | null>(null);
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [esinSign, setEsinSign] = useState('');

  // Land specific states
  const [coords, setCoords] = useState<{lat: string, lng: string} | null>(null);
  const [deedId, setDeedId] = useState('');

  const reset = () => {
    setActiveWorkflow(null);
    setStep(0);
    setDeviceId('');
    setEsinSign('');
    setIsScanning(false);
    setCoords(null);
    setDeedId('');
  };

  const handleStartHardwareSync = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDeviceId(`NODE-${Math.random().toString(36).substring(7).toUpperCase()}`);
      setStep(1);
    }, 3000);
  };

  const handleStartLandSync = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCoords({
        lat: (Math.random() * 2 + 1).toFixed(4),
        lng: (36 + Math.random() * 2).toFixed(4)
      });
      setDeedId(`DEED-${Math.random().toString(36).substring(7).toUpperCase()}`);
      setStep(1);
    }, 4000);
  };

  const finalizeHardware = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) return alert("SIGNATURE MISMATCH: Node ESIN mismatch.");
    
    const newResource: AgroResource = {
      id: deviceId,
      category: 'HARDWARE',
      type: 'Agro Musika Node',
      name: 'Spectral Hub P4',
      status: 'VERIFIED',
      capabilities: ['Bio_Sync', 'Acoustic_Audit'],
      verificationMeta: { 
        method: 'IOT_HANDSHAKE', 
        verifiedAt: new Date().toISOString(),
        confidenceScore: 0.98 
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(2);
  };

  const finalizeLand = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) return alert("SIGNATURE MISMATCH: Node ESIN mismatch.");
    
    const newResource: AgroResource = {
      id: deedId,
      category: 'LAND',
      type: 'Acreage Shard',
      name: `Plot ${deedId.split('-')[1]}`,
      status: 'VERIFIED',
      capabilities: ['Carbon_Minting', 'Bio_Resonance_Mapping'],
      verificationMeta: { 
        method: 'GEO_LOCK', 
        verifiedAt: new Date().toISOString(),
        confidenceScore: 0.99,
        coordinates: { lat: parseFloat(coords!.lat), lng: parseFloat(coords!.lng) }
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(2);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform"><SmartphoneNfc size={300} /></div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <Zap size={56} className="text-white relative z-10 animate-pulse" />
         </div>
         <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-indigo-400">Handshake</span></h2>
            <p className="text-slate-400 text-xl font-medium italic">"Secure pairing of physical industrial assets via social authority verification."</p>
         </div>
      </div>

      {!activeWorkflow ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { id: 'hardware', label: 'HARDWARE SYNC', icon: SmartphoneNfc, desc: 'Pair Agro Musika or Agroboto units via Proximity Scan.' },
             { id: 'land', label: 'LAND VERIFICATION', icon: MapPin, desc: 'Anchor farm coordinates with Authority proof.' },
           ].map(opt => (
             <button key={opt.id} onClick={() => setActiveWorkflow(opt.id as any)} className="glass-card p-12 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center space-y-6 bg-black/40 shadow-xl active:scale-[0.98]">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner group-hover:bg-indigo-600/10"><opt.icon size={56} className="text-indigo-400 group-hover:text-white transition-colors" /></div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{opt.label}</h3>
                   <p className="text-slate-500 text-sm font-medium italic">"{opt.desc}"</p>
                </div>
             </button>
           ))}
        </div>
      ) : activeWorkflow === 'hardware' ? (
        <div className="glass-card p-16 rounded-[64px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12 animate-in slide-in-from-right-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none animate-scan"></div>
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
               <div className="relative mx-auto w-40 h-40">
                  <Bluetooth className={`w-40 h-40 ${isScanning ? 'text-blue-400 animate-pulse' : 'text-slate-800'}`} />
                  {isScanning && <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-40"></div>}
                  <div className="absolute inset-[-20px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Proximity <span className="text-blue-400">Scan</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic">"Place your EnvirosAgro hardware near the terminal to initialize spectral pairing."</p>
               </div>
               <button 
                onClick={handleStartHardwareSync} 
                disabled={isScanning} 
                className="px-20 py-8 agro-gradient rounded-3xl text-white font-black uppercase tracking-[0.4em] shadow-xl disabled:opacity-50 transition-all border-4 border-white/10 ring-8 ring-white/5 active:scale-95"
               >
                  {isScanning ? 'SCANNING_SPECTRUM...' : 'START HANDSHAKE'}
               </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
               <div className="w-28 h-28 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                  <Fingerprint size={56} className="relative z-10 group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Node <span className="text-indigo-400">Authorization</span></h4>
                  <p className="text-[10px] text-slate-500 font-mono uppercase font-black mt-3">TARGET_DEVICE_ID: {deviceId}</p>
               </div>
               <div className="max-w-md mx-auto space-y-8">
                  <input 
                    type="text" 
                    value={esinSign} 
                    onChange={e => setEsinSign(e.target.value)} 
                    placeholder="EA-XXXX-XXXX" 
                    className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-900 shadow-inner tracking-widest" 
                  />
                  <button onClick={finalizeHardware} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] active:scale-95 transition-all border-4 border-white/10 ring-8 ring-white/5">COMMIT PAIRING SHARD</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-700">
               <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110">
                  <CheckCircle2 size={80} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Pairing <span className="text-emerald-400">Verified.</span></h3>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH_0x{(Math.random()*100).toFixed(0)}_SYNC_OK</p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Done</button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-16 rounded-[64px] border-2 border-emerald-500/20 bg-black/60 shadow-3xl text-center space-y-12 animate-in slide-in-from-left-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none animate-scan"></div>
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
               <div className="relative mx-auto w-40 h-40">
                  <Satellite className={`w-40 h-40 ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-slate-800'}`} />
                  {isScanning && <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping opacity-40"></div>}
                  <div className="absolute inset-[-30px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Geofence <span className="text-emerald-400">Calibration</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic">"Initialize satellite link to defining the biological boundaries of your node."</p>
               </div>
               <button 
                onClick={handleStartLandSync} 
                disabled={isScanning} 
                className="px-20 py-8 agro-gradient rounded-3xl text-white font-black uppercase tracking-[0.4em] shadow-xl disabled:opacity-50 transition-all border-4 border-white/10 ring-8 ring-white/5 active:scale-95"
               >
                  {isScanning ? 'SYNCING_SATELLITE...' : 'INITIATE GEOLINK'}
               </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
               <div className="w-28 h-28 bg-emerald-600/10 border-2 border-emerald-500/20 rounded-[32px] flex items-center justify-center mx-auto text-emerald-400 shadow-3xl relative overflow-hidden group">
                  <FileCheck size={56} className="relative z-10 group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-4">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Ledger <span className="text-emerald-400">Anchor</span></h4>
                  <div className="flex justify-center gap-10 py-4 border-y border-white/5 max-w-sm mx-auto">
                    <div>
                      <p className="text-[8px] text-slate-500 font-black uppercase">Latitude Shard</p>
                      <p className="text-xl font-mono text-white">{coords?.lat}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div>
                      <p className="text-[8px] text-slate-500 font-black uppercase">Longitude Shard</p>
                      <p className="text-xl font-mono text-white">{coords?.lng}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase font-black">DEED_SHARD_ID: {deedId}</p>
               </div>
               <div className="max-w-md mx-auto space-y-8">
                  <input 
                    type="text" 
                    value={esinSign} 
                    onChange={e => setEsinSign(e.target.value)} 
                    placeholder="SIGN WITH ESIN" 
                    className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white outline-none focus:ring-8 focus:ring-emerald-500/10 transition-all uppercase placeholder:text-slate-900 shadow-inner tracking-widest" 
                  />
                  <button onClick={finalizeLand} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(16,185,129,0.3)] active:scale-95 transition-all border-4 border-white/10 ring-8 ring-white/5">ANCHOR LAND SHARD</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-700">
               <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110">
                  <Globe size={80} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Resource <span className="text-emerald-400">Anchored.</span></h3>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono">REGISTRY_LAT_{coords?.lat}_LNG_{coords?.lng}_OK</p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Complete Synchronization</button>
            </div>
          )}
        </div>
      )}

      {!activeWorkflow && (
        <div className="p-10 glass-card rounded-[48px] border-emerald-500/10 bg-emerald-600/5 flex items-center gap-8 shadow-inner">
           <SearchCode className="w-12 h-12 text-emerald-400 shrink-0 animate-pulse" />
           <p className="text-sm text-slate-400 italic leading-relaxed font-medium">
              "Verifying land mass shards establishing the base-layer for carbon credit minting (MRV). All registry anchors are permanent and peer-audited."
           </p>
        </div>
      )}

      <button onClick={reset} className="w-full py-10 text-[10px] font-black text-slate-700 uppercase tracking-[1em] hover:text-slate-400 transition-colors flex items-center justify-center gap-4">
         <X size={14} /> Terminate Handshake Protocol
      </button>

      <style>{`
        @keyframes scan { from { top: -10px; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RegistryHandshake;