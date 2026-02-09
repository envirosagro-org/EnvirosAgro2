
import React, { useState, useEffect, useRef } from 'react';
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
  Cpu,
  FileUp,
  FileText,
  ShieldPlus,
  ArrowLeftCircle,
  Trash2,
  ScanLine,
  Truck,
  Database,
  CloudUpload,
  Video
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
  const [scanStatus, setScanStatus] = useState('');
  
  // Hardware States
  const [hwType, setHwType] = useState<'PHYSICAL' | 'VIRTUAL' | 'NETWORK'>('PHYSICAL');
  const [hwCategory, setHwCategory] = useState('Lorry / GPS');
  const [deviceId, setDeviceId] = useState('');
  
  // Land States
  const [landSize, setLandSize] = useState('5.0');
  const [landUnit, setLandUnit] = useState<'Acreage' | 'Hectares'>('Acreage');
  const [coords, setCoords] = useState<{lat: string, lng: string} | null>(null);
  const [deedId, setDeedId] = useState('');
  const [integrityHash, setIntegrityHash] = useState('');

  // Evidence States
  const [isIngestingDoc, setIsIngestingDoc] = useState(false);
  const [ingestedFile, setIngestedFile] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isScanning) {
      const statuses = [
        "INITIALIZING GPS_LOCK...",
        "QUERYING ORACLE QUORUM...",
        "HASHING BIOMETRIC SHARDS...",
        "VERIFYING ZK-PROOFS...",
        "FINALIZING HANDSHAKE..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setScanStatus(statuses[i]);
        i = (i + 1) % statuses.length;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const handleStartHardwareSync = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDeviceId(`NODE-${Math.random().toString(36).substring(7).toUpperCase()}`);
      setStep(1); // Move to Metadata/Evidence
    }, 3000);
  };

  const handleStartGeoLock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCoords({
        lat: (Math.random() * 2 + 1).toFixed(4),
        lng: (36 + Math.random() * 2).toFixed(4)
      });
      setStep(1); // Move to Size Input
    }, 4000);
  };

  const handleDocumentIngest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsIngestingDoc(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setIngestedFile(reader.result as string);
          setIsIngestingDoc(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizeHardware = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) return alert("SIGNATURE ERROR: Node ESIN mismatch.");
    
    const newResource: AgroResource = {
      id: deviceId,
      category: 'HARDWARE',
      type: hwCategory,
      name: `${hwCategory} Node`,
      status: 'PROVISIONAL', // Needs on-site audit
      capabilities: ['Telemetry_Ingest', 'Registry_Bridge'],
      verificationMeta: { 
        method: 'IOT_HANDSHAKE', 
        verifiedAt: new Date().toISOString(),
        confidenceScore: 0.95 
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(3); // Success
  };

  const handleDeedGeneration = () => {
    const generatedDeed = `DEED-${Math.random().toString(36).substring(7).toUpperCase()}`;
    setDeedId(generatedDeed);
    setIntegrityHash(`0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_${generatedDeed.split('-')[1]}`);
    setStep(2); // Approval needed
  };

  const finalizeLand = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) return alert("SIGNATURE ERROR: Node ESIN mismatch.");
    
    const newResource: AgroResource = {
      id: deedId,
      category: 'LAND',
      type: 'Agricultural Plot',
      name: `${landSize} ${landUnit} Shard`,
      status: 'PROVISIONAL',
      capabilities: ['Carbon_Minting', 'Bio_Resonance'],
      verificationMeta: { 
        method: 'GEO_LOCK', 
        verifiedAt: new Date().toISOString(),
        confidenceScore: 1.0,
        coordinates: { lat: parseFloat(coords!.lat), lng: parseFloat(coords!.lng) }
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(4); // Success
  };

  const reset = () => {
    setActiveWorkflow(null);
    setStep(0);
    setIngestedFile(null);
    setEsinSign('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1200px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Portal HUD */}
      <div className="glass-card p-10 md:p-14 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
            <SmartphoneNfc size={400} />
         </div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-pulse"></div>
            <Zap size={56} className="text-white relative z-10 animate-pulse" />
         </div>
         <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic">REGISTRY_HANDSHAKE_v6.5</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Resource <span className="text-indigo-400">Pairing.</span></h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
               "Linking physical hardware and geofence shards to the digital ledger. Evidence-based finality for agricultural assets."
            </p>
         </div>
      </div>

      {!activeWorkflow ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <button 
              onClick={() => setActiveWorkflow('hardware')}
              className="glass-card p-14 rounded-[72px] border-2 border-white/5 hover:border-blue-500/40 bg-black/40 flex flex-col items-center text-center space-y-8 transition-all group shadow-2xl active:scale-[0.98]"
           >
              <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                 <Cpu size={64} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Hardware <br/><span className="text-blue-400">Handshake</span></h3>
                 <p className="text-slate-500 text-lg font-medium italic px-6 leading-relaxed">"Provision lorries, robotics, or IoT units as digital twins."</p>
              </div>
              <ChevronRight className="text-slate-800 group-hover:text-blue-400 transition-colors" size={32} />
           </button>

           <button 
              onClick={() => setActiveWorkflow('land')}
              className="glass-card p-14 rounded-[72px] border-2 border-white/5 hover:border-emerald-500/40 bg-black/40 flex flex-col items-center text-center space-y-8 transition-all group shadow-2xl active:scale-[0.98]"
           >
              <div className="p-8 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                 <MapPin size={64} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Land <br/><span className="text-emerald-400">Verification</span></h3>
                 <p className="text-slate-500 text-lg font-medium italic px-6 leading-relaxed">"Anchor geofence coordinates and ingest legal deeds."</p>
              </div>
              <ChevronRight className="text-slate-800 group-hover:text-emerald-400 transition-colors" size={32} />
           </button>
        </div>
      ) : activeWorkflow === 'hardware' ? (
        /* --- HARDWARE WORKFLOW --- */
        <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-blue-500/20 bg-black/60 shadow-3xl space-y-12 animate-in slide-in-from-right-10 relative overflow-hidden min-h-[700px] flex flex-col justify-center">
          
          {step === 0 && (
            <div className="space-y-12 flex flex-col items-center">
               <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className={`w-48 h-48 rounded-full border-4 border-dashed transition-all duration-[3s] flex items-center justify-center ${isScanning ? 'border-blue-400 rotate-180 scale-110' : 'border-slate-800'}`}>
                    <Bluetooth size={80} className={isScanning ? 'text-blue-400 animate-pulse' : 'text-slate-800'} />
                  </div>
                  {isScanning && <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>}
               </div>
               <div className="text-center space-y-4">
                  <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Initialize <span className="text-blue-400">Pairing</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
                    {isScanning ? scanStatus : '"Establish a spectral link between the registry and your physical unit."'}
                  </p>
               </div>
               <div className="flex gap-4 w-full max-w-md">
                 <select value={hwType} onChange={e => setHwType(e.target.value as any)} className="bg-black border border-white/10 rounded-2xl p-4 text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/40">
                   <option value="PHYSICAL">Physical Hardware</option>
                   <option value="VIRTUAL">Virtual Interface</option>
                   <option value="NETWORK">Network Ingest (IoT)</option>
                 </select>
                 <button onClick={handleStartHardwareSync} disabled={isScanning} className="flex-1 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10">
                   {isScanning ? 'SYNCING...' : 'START HANDSHAKE'}
                 </button>
               </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-4">
               <div className="text-center space-y-4">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Multi-Modal <span className="text-blue-400">Evidence</span></h4>
                  <p className="text-slate-400 text-lg italic">Provision metadata and evidence shards for ID: <span className="text-blue-400 font-mono">{deviceId}</span></p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Asset Classification</label>
                        <select value={hwCategory} onChange={e => setHwCategory(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20">
                           <option>Lorry / GPS-Tracked</option>
                           <option>Agricultural Robotics</option>
                           <option>Industrial Machinery</option>
                           <option>Edge Device / Mobile</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Evidence Ingest (Purchase Shard / Logbook)</label>
                        <div 
                           onClick={() => fileInputRef.current?.click()}
                           className={`p-10 border-4 border-dashed rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer transition-all ${ingestedFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-black/40 hover:border-blue-500/40'}`}
                        >
                           <input type="file" ref={fileInputRef} className="hidden" onChange={handleDocumentIngest} />
                           {ingestedFile ? <CheckCircle2 size={40} className="text-emerald-500" /> : <FileUp size={40} className="text-slate-800" />}
                           <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
                             {isIngestingDoc ? 'INGESTING...' : ingestedFile ? 'SHARD_STORED' : 'Upload Documentation'}
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="p-8 bg-black/80 rounded-[48px] border border-white/10 flex flex-col items-center justify-center text-center space-y-6 shadow-inner h-full">
                        <Video size={48} className="text-rose-500 animate-pulse" />
                        <h5 className="text-xl font-black text-white uppercase italic">Live Stream Verification</h5>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-relaxed">
                           Broadcast a live 30s ingest of the hardware in operation to finalize the digital twin handshake.
                        </p>
                        <button onClick={() => onNavigate?.('media')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-slate-300 font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all">Go to Broadcast Room</button>
                     </div>
                  </div>
               </div>

               <div className="max-w-md mx-auto space-y-6 pt-10 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Node Signature (ESIN)</label>
                    <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX" className="w-full bg-black border-2 border-white/10 rounded-full py-6 text-center text-4xl font-mono text-white outline-none focus:ring-8 focus:ring-blue-500/5 transition-all uppercase placeholder:text-stone-900 shadow-inner" />
                  </div>
                  <button onClick={finalizeHardware} disabled={!esinSign || !ingestedFile} className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl active:scale-95 disabled:opacity-30 transition-all">ANCHOR HARDWARE SHARD</button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 py-20 animate-in zoom-in duration-1000 flex flex-col items-center">
               <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(37,99,235,0.4)] relative group scale-110">
                  <CheckCircle2 size={120} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-15px] border-4 border-blue-500/20 rounded-full animate-ping opacity-30"></div>
               </div>
               <div className="space-y-4 text-center">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Handshake <span className="text-blue-400">Complete.</span></h3>
                  <p className="text-blue-400 text-[11px] font-black uppercase tracking-[1em] font-mono mt-6">HARDWARE_SHARD_ANCHORED // SYNC_OK</p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
            </div>
          )}
        </div>
      ) : (
        /* --- LAND WORKFLOW --- */
        <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-emerald-500/20 bg-[#020503] shadow-3xl space-y-12 animate-in slide-in-from-left-10 relative overflow-hidden min-h-[700px] flex flex-col justify-center">
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 flex flex-col items-center">
               <div className="relative w-80 h-80 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                  <div className={`absolute inset-0 rounded-full border-r-4 border-t-4 border-emerald-500/40 transition-all duration-[4s] ${isScanning ? 'animate-spin' : ''}`}></div>
                  <div className={`w-32 h-32 rounded-3xl bg-black/60 border-2 border-white/10 flex items-center justify-center shadow-2xl relative z-10 transition-all duration-700 ${isScanning ? 'border-emerald-400 scale-110' : ''}`}>
                    <Satellite className={`w-16 h-16 ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
               </div>
               <div className="space-y-4 max-w-2xl text-center">
                  <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Geo-Location <span className="text-emerald-400">Trigger</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
                    {isScanning ? scanStatus : '"Establishing your physical node coordinates to initialize the registration pipeline."'}
                  </p>
               </div>
               <button 
                 onClick={handleStartGeoLock} 
                 disabled={isScanning} 
                 className="px-24 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50 transition-all border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95"
               >
                 {isScanning ? 'PINPOINTING...' : 'INITIALIZE GPS_LOCK'}
               </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-4">
               <div className="text-center space-y-6">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Land <span className="text-emerald-400">Dimensions</span></h4>
                  <p className="text-slate-400 text-lg italic">Coordinates anchored: <span className="text-emerald-400 font-mono">{coords?.lat}N, {coords?.lng}E</span></p>
               </div>
               
               <div className="max-w-md mx-auto space-y-8">
                  <div className="flex gap-4">
                    <input 
                      type="number" value={landSize} onChange={e => setLandSize(e.target.value)} 
                      className="flex-1 bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-4xl font-mono font-black text-white outline-none focus:ring-8 focus:ring-emerald-500/5 shadow-inner" 
                    />
                    <select value={landUnit} onChange={e => setLandUnit(e.target.value as any)} className="bg-black border border-white/10 rounded-[32px] px-6 text-white text-xs font-black uppercase tracking-widest outline-none">
                       <option>Acreage</option>
                       <option>Hectares</option>
                    </select>
                  </div>
                  <button onClick={handleDeedGeneration} className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">GENERATE DIGITAL DEED</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000 flex flex-col items-center">
               <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-3xl mb-8">
                  <Stamp size={56} />
               </div>
               <div className="space-y-8 text-center w-full">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Social <span className="text-emerald-400">Approval Step.</span></h3>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-widest mt-6">STATUS: AWAITING_AUTHORITY_STAMP</p>
                  </div>
                  
                  <div className="p-12 md:p-16 bg-[#020403] rounded-[64px] border-4 border-double border-emerald-500/30 text-left space-y-10 shadow-3xl relative overflow-hidden group/cert max-w-2xl mx-auto">
                     <div className="flex justify-between items-center border-b-2 border-white/10 pb-8">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white border-2 border-white/20">
                              <BadgeCheck size={32} />
                           </div>
                           <h5 className="text-xl font-black text-white uppercase italic tracking-widest">DIGITAL LAND DEED</h5>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-8 text-[10px] font-mono uppercase">
                        <div className="space-y-2">
                           <p className="text-slate-600 font-black tracking-widest">ID</p>
                           <p className="text-lg font-black text-white italic">{deedId}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-slate-600 font-black tracking-widest">Acreage</p>
                           <p className="text-lg font-black text-white italic">{landSize} {landUnit.toUpperCase()}</p>
                        </div>
                     </div>
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic text-slate-500 text-xs">
                        "Print this shard and obtain a physical authority stamp. Ingest the stamped document back to finalize finality."
                     </div>
                     <button 
                       className="w-full py-6 bg-white rounded-2xl text-black font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all hover:bg-emerald-50"
                     >
                       <Download size={18} /> Download Shard for Stamping
                     </button>
                  </div>
                  <div className="flex justify-center pt-8">
                    <button onClick={() => setStep(3)} className="px-16 py-6 bg-emerald-900/40 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-500 hover:text-white active:scale-95 transition-all">INGEST STAMPED DOCUMENT</button>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-2xl">
                 <ScanLine size={40} className="animate-pulse" />
              </div>
              <div className="space-y-4 max-w-xl text-center">
                 <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Document <span className="text-emerald-400">Ingest</span></h4>
                 <p className="text-slate-400 text-lg italic leading-relaxed">
                   "Upload the authorized physical document to trigger the final HQ System Audit."
                 </p>
              </div>
              
              <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`w-full max-w-md p-16 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center cursor-pointer ${ingestedFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-black/40 hover:border-emerald-500/40'}`}
              >
                 <input type="file" ref={fileInputRef} className="hidden" onChange={handleDocumentIngest} />
                 {isIngestingDoc ? (
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                 ) : ingestedFile ? (
                    <div className="flex flex-col items-center gap-4">
                       <CheckCircle2 size={48} className="text-emerald-500" />
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">DEED_SHARD_VERIFIED</p>
                    </div>
                 ) : (
                    <>
                       <ClipboardCheck size={48} className="text-slate-700" />
                       <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4">Ingest Verified Deed</p>
                    </>
                 )}
              </div>

              <div className="space-y-6 w-full max-w-md">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center italic">Auth Signature (ESIN)</label>
                    <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX" className="w-full bg-black border border-white/10 rounded-full py-6 text-center text-4xl font-mono text-white outline-none focus:ring-8 focus:ring-emerald-500/5 uppercase placeholder:text-stone-900 shadow-inner" />
                 </div>
                 <button 
                   onClick={finalizeLand}
                   disabled={!esinSign || !ingestedFile}
                   className="w-full py-10 agro-gradient rounded-[48px] text-white font-black uppercase tracking-[0.4em] shadow-3xl disabled:opacity-20 active:scale-95 transition-all"
                 >
                    FINALIZE LAND REGISTRY
                 </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000 flex flex-col items-center">
               <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110">
                  <ShieldCheck size={120} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-25px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
               </div>
               <div className="space-y-6 text-center">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Plot <span className="text-emerald-400">Verified.</span></h3>
                  <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] font-mono mt-6">LAND_SHARD_ANCHORED // PHYSICAL_AUDIT_PENDING</p>
               </div>
               <div className="p-10 glass-card rounded-[56px] border border-emerald-500/10 bg-emerald-500/5 space-y-6 text-left relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4">
                     <Info size={24} className="text-emerald-400" />
                     <h4 className="text-xl font-black text-white uppercase italic">Audit Dispatch</h4>
                  </div>
                  <p className="text-slate-400 text-lg italic leading-relaxed">
                     "Your land shard has been provisioned. The EnvirosAgro Audit Team has been notified for the final on-site verification sharding cycle."
                  </p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
            </div>
          )}
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
