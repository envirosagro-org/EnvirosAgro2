
import React, { useState, useEffect } from 'react';
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
  Scan as ScanIcon,
  RefreshCw,
  Stamp,
  BadgeCheck,
  ArrowRight,
  Satellite,
  Download,
  Fingerprint,
  Bluetooth,
  Globe,
  FileCheck,
  SearchCode,
  Building2,
  FileSignature,
  Target,
  BadgeAlert,
  Info,
  ChevronRight,
  ClipboardCheck,
  Award,
  Pen,
  Landmark,
  User as UserIcon,
  History,
  Activity,
  Waves,
  Radar,
  Lock,
  Cpu
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
  const [scanStatus, setScanStatus] = useState('');
  const [nodeEntropy, setNodeEntropy] = useState('0.002');

  // Land specific states
  const [coords, setCoords] = useState<{lat: string, lng: string} | null>(null);
  const [deedId, setDeedId] = useState('');
  const [integrityHash, setIntegrityHash] = useState('');

  useEffect(() => {
    if (isScanning) {
      const statuses = [
        "Initializing Spectral Ingest...",
        "Querying Local Quorum...",
        "Hashing Biometric Shards...",
        "Verifying ZK-Proofs...",
        "Finalizing Handshake..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setScanStatus(statuses[i]);
        setNodeEntropy((Math.random() * 0.01).toFixed(4));
        i = (i + 1) % statuses.length;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const reset = () => {
    setActiveWorkflow(null);
    setStep(0);
    setDeviceId('');
    setEsinSign('');
    setIsScanning(false);
    setCoords(null);
    setDeedId('');
    setIntegrityHash('');
    setScanStatus('');
  };

  const handleStartHardwareSync = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDeviceId(`NODE-${Math.random().toString(36).substring(7).toUpperCase()}`);
      setStep(1);
    }, 4500);
  };

  const handleStartLandSync = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCoords({
        lat: (Math.random() * 2 + 1).toFixed(4),
        lng: (36 + Math.random() * 2).toFixed(4)
      });
      const generatedDeed = `DEED-${Math.random().toString(36).substring(7).toUpperCase()}`;
      setDeedId(generatedDeed);
      setIntegrityHash(`0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_${generatedDeed.split('-')[1]}`);
      setStep(1);
    }, 5500);
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
      status: 'PROVISIONAL',
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

  const downloadWarrant = () => {
    const content = `
╔══════════════════════════════════════════════════════════════════════════╗
║                    ENVIROSAGRO™ NETWORK REGISTRY                         ║
║               CERTIFICATE OF LAND REGISTRY ANCHOR                        ║
╚══════════════════════════════════════════════════════════════════════════╝

DOCUMENT_REF: CERT-LND-${integrityHash.substring(2, 10)}
ISSUANCE_DATE: ${new Date().toLocaleDateString()}
GEO_PROTOCOL: SEHTI-v6.5 / ZK-GEO-LOCK_PROVEN

This is to certify that the specified land resource has been successfully
sharded and anchored into the EnvirosAgro Industrial Blockchain.

1. STEWARD IDENTITY ANCHOR
----------------------------------------------------------------------------
NAME: ${user.name.toUpperCase()}
NODE ESIN: ${user.esin}
REGIONAL HUB: ${user.location}

2. GEOSPATIAL SHARD METADATA
----------------------------------------------------------------------------
DEED_SHARD_ID: ${deedId}
GEO_COORDINATES: LATITUDE ${coords?.lat} / LONGITUDE ${coords?.lng}
INTEGRITY_HASH: ${integrityHash}
SYNC_STATUS: PROVISIONAL_ANCHOR (Awaiting Physical Handshake)

3. INDUSTRIAL MANDATE
----------------------------------------------------------------------------
The Steward named above is hereby authorized to initialize Carbon Mining (MRV)
and Bio-Resonance Mapping within the defined geofence coordinates. This shard 
grants the inalienable Usufruct Right for sustainable natural resource 
application as defined by the EnvirosAgro Code of Laws.

FINALITY SIGNATURE: 0x${Math.random().toString(16).substring(2, 16).toUpperCase()}
════════════════════════════════════════════════════════════════════════════
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CERTIFICATE_OF_ANCHOR_${deedId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-5xl mx-auto px-4">
      
      {/* 1. HUD Header - High Contrast Industrial Design */}
      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform"><SmartphoneNfc size={300} /></div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-pulse"></div>
            <Zap size={56} className="text-white relative z-10 animate-pulse" />
         </div>
         <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Registry <span className="text-indigo-400">Handshake</span></h2>
            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
               "Orchestrating the connection between physical assets and the digital ledger. Every handshake requires ZK-Finality and peer consensus."
            </p>
         </div>
      </div>

      {!activeWorkflow ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { id: 'hardware', label: 'HARDWARE SYNC', icon: Cpu, desc: 'Pair Agro Musika or Agroboto units via Spectral Handshake.', col: 'indigo' },
             { id: 'land', label: 'LAND VERIFICATION', icon: MapPin, desc: 'Anchor farm coordinates through Geofence Calibration.', col: 'emerald' },
           ].map(opt => (
             <button 
                key={opt.id} 
                onClick={() => setActiveWorkflow(opt.id as any)} 
                className={`glass-card p-12 rounded-[48px] border-2 border-white/5 hover:border-${opt.col}-500/30 transition-all group flex flex-col items-center text-center space-y-8 bg-black/40 shadow-xl active:scale-[0.98] relative overflow-hidden`}
             >
                <div className={`absolute inset-0 bg-${opt.col}-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner group-hover:bg-${opt.col}-600/10`}>
                   <opt.icon size={64} className={`text-${opt.col}-400 group-hover:text-white transition-colors`} />
                </div>
                <div className="space-y-4 relative z-10">
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{opt.label}</h3>
                   <p className="text-slate-500 text-base font-medium italic px-4 leading-relaxed">"{opt.desc}"</p>
                </div>
                <div className={`w-12 h-1 bg-${opt.col}-500/20 rounded-full group-hover:w-32 group-hover:bg-${opt.col}-500 transition-all`}></div>
             </button>
           ))}
        </div>
      ) : activeWorkflow === 'hardware' ? (
        /* --- HARDWARE SYNC FLOW --- */
        <div className="glass-card p-16 rounded-[64px] border-2 border-indigo-500/20 bg-[#050706] shadow-3xl text-center space-y-12 animate-in slide-in-from-right-10 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
          <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none animate-scan opacity-30"></div>
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 flex flex-col items-center">
               <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className={`w-48 h-48 rounded-full border-4 border-dashed transition-all duration-[3s] flex items-center justify-center ${isScanning ? 'border-indigo-400 rotate-180 scale-110' : 'border-slate-800'}`}>
                    <Bluetooth size={80} className={`${isScanning ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 border-2 border-indigo-500 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-[-20px] border border-white/5 rounded-full animate-spin-slow"></div>
                      {/* Spectral Waves */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-1 bg-indigo-500/40 rounded-full animate-bounce" style={{ height: `${30+Math.random()*70}%`, animationDelay: `${i*0.1}s` }}></div>
                        ))}
                      </div>
                    </>
                  )}
               </div>
               
               <div className="space-y-4 max-w-xl">
                  <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Spectral <span className="text-indigo-400">Handshake</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
                    {isScanning ? scanStatus : '"Place your hardware unit near the sensor array to initialize spectral pairing."'}
                  </p>
               </div>

               <div className="flex flex-col items-center gap-6">
                  <button 
                    onClick={handleStartHardwareSync} 
                    disabled={isScanning} 
                    className="px-24 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(99,102,241,0.3)] disabled:opacity-50 transition-all border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95"
                  >
                    {isScanning ? 'PAIRING_NODES...' : 'INITIALIZE SYNC'}
                  </button>
                  {isScanning && (
                    <div className="flex items-center gap-4 text-[10px] font-mono text-indigo-400 font-black tracking-widest uppercase">
                      <Activity size={14} className="animate-pulse" /> Signal Entropy: {nodeEntropy}
                    </div>
                  )}
               </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-4">
               <div className="w-32 h-32 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[40px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                  <Fingerprint size={64} className="relative z-10 group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-4">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Node <span className="text-indigo-400">Authorization</span></h4>
                  <p className="text-[11px] text-slate-500 font-mono uppercase font-black mt-3 tracking-[0.3em]">DEVICE_IDENTITY: {deviceId}</p>
               </div>
               <div className="max-w-md mx-auto space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-indigo-500/5 blur-xl rounded-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <input 
                      type="text" 
                      value={esinSign} 
                      onChange={e => setEsinSign(e.target.value)} 
                      placeholder="ENTER ESIN SIGNATURE" 
                      className="w-full bg-black border-2 border-white/10 rounded-[40px] py-12 text-center text-5xl font-mono text-white outline-none focus:border-indigo-500/40 focus:ring-8 focus:ring-indigo-500/5 transition-all uppercase placeholder:text-slate-900 shadow-inner tracking-widest relative z-10" 
                    />
                  </div>
                  <button onClick={finalizeHardware} className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(99,102,241,0.3)] active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5">COMMIT PAIRING SHARD</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000">
               <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(99,102,241,0.4)] relative group scale-110">
                  <CheckCircle2 size={120} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-25px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                  <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full"></div>
               </div>
               <div className="space-y-4 text-center">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Node <span className="text-emerald-400">Synced.</span></h3>
                  <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] font-mono mt-6">REGISTRY_HASH_0x{(Math.random()*100).toFixed(0)}_FINALITY_OK</p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Terminate Sequence</button>
            </div>
          )}
        </div>
      ) : (
        /* --- LAND VERIFICATION FLOW --- */
        <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-emerald-500/20 bg-[#020503] shadow-3xl text-center space-y-12 animate-in slide-in-from-left-10 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
          <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none animate-scan opacity-30"></div>
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 flex flex-col items-center">
               <div className="relative w-80 h-80 flex items-center justify-center">
                  {/* High Tech Radar Visual */}
                  <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                  <div className="absolute inset-10 border border-white/5 rounded-full"></div>
                  <div className="absolute inset-20 border border-white/5 rounded-full"></div>
                  
                  {/* Rotating Radar Sweep */}
                  <div className={`absolute inset-0 rounded-full border-r-4 border-t-4 border-emerald-500/40 transition-all duration-[4s] ${isScanning ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}></div>
                  <div className={`absolute inset-0 rounded-full border-l-2 border-emerald-500/10 ${isScanning ? 'animate-spin-slow' : ''}`} style={{ animationDirection: 'reverse' }}></div>

                  {/* Center Icon */}
                  <div className={`w-32 h-32 rounded-3xl bg-black/60 border-2 border-white/10 flex items-center justify-center shadow-2xl relative z-10 transition-all duration-700 ${isScanning ? 'border-emerald-400 scale-110' : ''}`}>
                    <Satellite className={`w-16 h-16 ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                  
                  {isScanning && (
                    <div className="absolute top-1/4 right-0 px-4 py-2 glass-card rounded-xl border border-emerald-500/40 animate-in fade-in duration-1000">
                      <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">GEO_LOCK: SEARCHING</p>
                      <p className="text-[10px] font-mono text-white mt-1">42.88...N</p>
                    </div>
                  )}
               </div>

               <div className="space-y-4 max-w-2xl">
                  <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Geofence <span className="text-emerald-400">Calibration</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
                    {isScanning ? scanStatus : '"Establishing satellite coordinate shards to defining the industrial boundaries of your plot."'}
                  </p>
               </div>

               <div className="flex flex-col items-center gap-6">
                  <button 
                    onClick={handleStartLandSync} 
                    disabled={isScanning} 
                    className="px-24 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] disabled:opacity-50 transition-all border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95"
                  >
                    {isScanning ? 'SYNCING_SATELLITE...' : 'INITIATE GEOLINK'}
                  </button>
                  {isScanning && (
                    <div className="flex items-center gap-4 text-[10px] font-mono text-emerald-400 font-black tracking-widest uppercase">
                      <Globe size={14} className="animate-spin-slow" /> Geodetic Drift: {nodeEntropy}
                    </div>
                  )}
               </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-4">
               <div className="w-32 h-32 bg-emerald-600/10 border-2 border-emerald-500/20 rounded-[40px] flex items-center justify-center mx-auto text-emerald-400 shadow-3xl relative overflow-hidden group">
                  <FileCheck size={64} className="relative z-10 group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-6">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Ledger <span className="text-emerald-400">Anchor</span></h4>
                  <div className="flex justify-center gap-12 py-6 border-y border-white/5 max-w-xl mx-auto shadow-inner bg-white/[0.01] rounded-3xl">
                    <div className="text-center">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Latitude Shard</p>
                      <p className="text-3xl font-mono text-white font-black">{coords?.lat}<span className="text-emerald-500 text-sm ml-1">N</span></p>
                    </div>
                    <div className="w-px h-16 bg-white/10"></div>
                    <div className="text-center">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Longitude Shard</p>
                      <p className="text-3xl font-mono text-white font-black">{coords?.lng}<span className="text-emerald-500 text-sm ml-1">E</span></p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono uppercase font-black tracking-[0.3em]">DEED_SHARD_ID: {deedId}</p>
               </div>
               <div className="max-w-lg mx-auto space-y-10">
                  <input 
                    type="text" 
                    value={esinSign} 
                    onChange={e => setEsinSign(e.target.value)} 
                    placeholder="NODE SIGNATURE" 
                    className="w-full bg-black border-2 border-white/10 rounded-[48px] py-12 text-center text-5xl font-mono text-white outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all uppercase placeholder:text-slate-900 shadow-inner tracking-widest" 
                  />
                  <button onClick={finalizeLand} className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5">ANCHOR LAND SHARD</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000 flex flex-col items-center">
               <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110 mb-8">
                  <Award size={100} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-30px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
               </div>
               
               <div className="space-y-8 text-center w-full">
                  <div className="space-y-2">
                    <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Registry <span className="text-emerald-400">Certified.</span></h3>
                    <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] font-mono mt-6">NEXT_PHASE: PHYSICAL_AUDIT_VERIFY</p>
                  </div>
                  
                  {/* PROFESSIONAL CERTIFICATE UI */}
                  <div className="p-12 md:p-20 bg-[#020403] rounded-[64px] border-4 border-double border-emerald-500/30 text-left space-y-14 shadow-[0_60px_150px_rgba(0,0,0,0.9)] relative overflow-hidden group/cert max-w-4xl mx-auto">
                     <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none group-hover/cert:scale-110 transition-transform duration-[20s]">
                        <Landmark size={1000} />
                     </div>
                     <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
                     
                     <div className="flex justify-between items-start border-b-2 border-white/10 pb-12 relative z-10">
                        <div className="flex items-center gap-10">
                           <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-3xl border-2 border-white/20">
                              <BadgeCheck size={56} className="animate-pulse" />
                           </div>
                           <div>
                              <h5 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-widest leading-none">CERTIFICATE OF LAND REGISTRY ANCHOR</h5>
                              <p className="text-[12px] text-emerald-500/60 font-mono tracking-widest uppercase mt-6 font-black">SERIAL_NO: CERT-{integrityHash.substring(2, 12)} // SYNC_STABLE</p>
                           </div>
                        </div>
                        <div className="w-32 h-32 border-2 border-dashed border-emerald-500/20 rounded-full flex items-center justify-center relative hidden sm:flex">
                           <Stamp className="w-20 h-20 text-emerald-500/40 animate-spin-slow" />
                           <CheckCircle2 size={32} className="absolute text-emerald-400" />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[12px] font-mono uppercase relative z-10">
                        <div className="space-y-10">
                           <div>
                              <p className="text-slate-600 font-black mb-3 tracking-widest flex items-center gap-3">
                                 <UserIcon size={16} className="text-emerald-500" /> Authorized Steward
                              </p>
                              <p className="text-3xl font-black text-white italic border-b border-white/5 pb-4">{user.name}</p>
                           </div>
                           <div>
                              <p className="text-slate-600 font-black mb-3 tracking-widest flex items-center gap-3">
                                 <Fingerprint size={16} className="text-indigo-400" /> Identity Anchor
                              </p>
                              <p className="text-lg font-black text-indigo-400 tracking-widest">{user.esin}</p>
                           </div>
                        </div>
                        <div className="space-y-10">
                           <div>
                              <p className="text-slate-600 font-black mb-3 tracking-widest flex items-center gap-3">
                                 <MapPin size={16} className="text-emerald-500" /> Geospatial Finality
                              </p>
                              <p className="text-3xl font-black text-white italic border-b border-white/5 pb-4">{coords?.lat}N, {coords?.lng}E</p>
                           </div>
                           <div>
                              <p className="text-slate-600 font-black mb-3 tracking-widest flex items-center gap-3">
                                 <History size={16} className="text-blue-400" /> Shard Issuance
                              </p>
                              <p className="text-lg font-black text-emerald-400">{new Date().toLocaleDateString().replace(/\//g, '.')}</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-10 bg-emerald-500/5 rounded-[40px] border-2 border-emerald-500/20 flex items-center gap-8 relative z-10 shadow-inner">
                        <Info size={40} className="text-emerald-500 shrink-0" />
                        <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                           "This industrial shard is immutably anchored to the EnvirosAgro blockchain. The bearer possesses the **Inalienable Usufruct Right** for the specified land mass, pending final physical audit by the designated Social Authority."
                        </p>
                     </div>

                     <div className="flex justify-between items-end pt-16 relative z-10">
                        <div className="space-y-6">
                           <div className="w-56 h-px bg-white/10"></div>
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-3">
                              <Pen size={12} /> HQ Network Registrar
                           </p>
                        </div>
                        <div className="space-y-6 text-right">
                           <div className="w-56 h-px bg-white/10 ml-auto"></div>
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-end gap-3">
                              Land Steward <FileSignature size={12} />
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-16 max-w-2xl mx-auto">
                    <button 
                      onClick={downloadWarrant}
                      className="flex-1 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 ring-8 ring-white/5 border-2 border-white/10"
                    >
                      <Download size={24} /> Download Professional Shard
                    </button>
                    <button onClick={reset} className="px-16 py-8 bg-white/5 border-2 border-white/10 rounded-full text-slate-400 font-black text-[12px] uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-90">Close Portal</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {!activeWorkflow && (
        <div className="p-12 glass-card rounded-[56px] border-emerald-500/10 bg-emerald-600/5 flex items-center gap-10 shadow-inner group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:scale-110 transition-transform"><SearchCode size={120} /></div>
           <SearchCode className="w-16 h-16 text-emerald-400 shrink-0 animate-pulse relative z-10" />
           <p className="text-lg text-slate-400 italic leading-relaxed font-medium relative z-10">
              "Verifying land mass shards establishing the base-layer for carbon credit minting (MRV). All registry anchors are permanent and peer-audited. Handshake protocol ensures 100% geofence integrity."
           </p>
        </div>
      )}

      <button onClick={reset} className="w-full py-10 text-[11px] font-black text-slate-700 uppercase tracking-[1em] hover:text-slate-400 transition-colors flex items-center justify-center gap-4">
         <X size={16} /> Terminate Handshake Protocol
      </button>

      <style>{`
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default RegistryHandshake;
