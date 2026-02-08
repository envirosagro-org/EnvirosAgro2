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
  ScanLine
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
  
  // Document Ingest States
  const [isIngestingDoc, setIsIngestingDoc] = useState(false);
  const [ingestedFile, setIngestedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIngestedFile(null);
    setIsIngestingDoc(false);
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

  const finalizeStep1 = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) return alert("SIGNATURE MISMATCH: Node ESIN mismatch.");
    setStep(2);
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
    if (!ingestedFile) return;
    
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
        confidenceScore: 0.99 
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(3); // Move to success
  };

  const finalizeLand = () => {
    if (!ingestedFile) return;
    
    const newResource: AgroResource = {
      id: deedId,
      category: 'LAND',
      type: 'Acreage Shard',
      name: `Plot ${deedId.split('-')[1]}`,
      status: 'VERIFIED', // Document ingest marks it as verified
      capabilities: ['Carbon_Minting', 'Bio_Resonance_Mapping'],
      verificationMeta: { 
        method: 'GEO_LOCK', 
        verifiedAt: new Date().toISOString(),
        confidenceScore: 1.0,
        coordinates: { lat: parseFloat(coords!.lat), lng: parseFloat(coords!.lng) }
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(4); // Final success
  };

  const downloadWarrant = () => {
    const qrData = JSON.stringify({
      type: 'LAND_ANCHOR',
      id: deedId,
      coords: coords,
      owner: user.esin,
      hash: integrityHash
    });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=050706&color=10b981`;

    const warrantHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Land Anchor Warrant - ${deedId}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background: #020403; color: #fff; padding: 40px; display: flex; items-center; justify-center; min-height: 100vh; }
        .warrant { max-width: 900px; width: 100%; border: 10px double #1e293b; padding: 80px; background: #050706; border-radius: 24px; box-shadow: 0 50px 100px rgba(0,0,0,0.8); }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .agro-text { color: #10b981; }
      </style>
    </head>
    <body>
      <div class="warrant space-y-16">
        <div class="flex justify-between items-start">
           <div class="space-y-4">
              <h1 class="text-4xl font-black uppercase italic tracking-tighter">Land Registry <span class="agro-text">Warrant</span></h1>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.6em]">Official EnvirosAgro™ Network Asset</p>
           </div>
           <div class="text-right">
              <p class="text-xs font-mono text-slate-500">${new Date().toISOString()}</p>
              <p class="text-xs font-mono text-emerald-400">HASH: ${integrityHash}</p>
           </div>
        </div>

        <div class="grid grid-cols-2 gap-20 py-12 border-y border-white/5">
           <div class="space-y-8">
              <div class="space-y-2">
                 <p class="text-[10px] text-slate-600 font-black uppercase tracking-widest">Steward Authority</p>
                 <p class="text-2xl font-bold uppercase italic">${user.name}</p>
                 <p class="text-xs font-mono text-emerald-500">${user.esin}</p>
              </div>
              <div class="space-y-2">
                 <p class="text-[10px] text-slate-600 font-black uppercase tracking-widest">Geospatial Shard</p>
                 <p class="text-xl font-bold uppercase italic">LAT: ${coords?.lat}N // LNG: ${coords?.lng}E</p>
                 <p class="text-[10px] text-slate-700 font-mono">REGISTRY_ID: ${deedId}</p>
              </div>
           </div>
           <div class="flex flex-col items-center gap-6">
              <div class="w-40 h-40 bg-black p-2 border-2 border-emerald-500/30 rounded-2xl">
                 <img src="${qrUrl}" class="w-full h-full object-contain">
              </div>
              <p class="text-[8px] text-slate-500 font-black uppercase tracking-[0.4em]">Scan to Verify Shard</p>
           </div>
        </div>

        <div class="p-8 bg-white/5 rounded-3xl border border-white/10 italic text-slate-400 text-sm leading-relaxed">
           "This warrant authorizes the named steward to initialize Carbon Mining (MRV) and Bio-Resonance Mapping within the defined geofence. Usufruct rights are granted in alignment with the Githaka Registry statutes."
        </div>

        <div class="flex justify-between items-end pt-12">
           <div class="space-y-4">
              <p class="text-[10px] text-slate-600 font-black uppercase">Authorized Signature</p>
              <div class="border-b border-white/20 pb-2 w-64">
                 <p class="text-xl font-serif italic text-slate-500 opacity-50 font-black">Industrial Registrar</p>
              </div>
           </div>
           <div class="text-right">
              <p class="text-[10px] text-emerald-400 font-black uppercase tracking-[0.8em]">EOS_v6.5_OK</p>
           </div>
        </div>
      </div>
    </body>
    </html>
    `;
    const blob = new Blob([warrantHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LAND_WARRANT_${deedId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-5xl mx-auto px-4">
      
      {/* 1. HUD Header */}
      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform"><SmartphoneNfc size={300} /></div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-pulse"></div>
            <Zap size={56} className="text-white relative z-10 animate-pulse" />
         </div>
         <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Registry <span className="text-indigo-400">Handshake</span></h2>
            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
               "Orchestrating the connection between physical assets and the digital ledger. Physical verification finality is achieved via legal document ingestion."
            </p>
         </div>
      </div>

      {!activeWorkflow ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { id: 'hardware', label: 'HARDWARE SYNC', icon: Cpu, desc: 'Pair hardware units and ingest legal proof for physical verification finality.', col: 'indigo' },
             { id: 'land', label: 'LAND VERIFICATION', icon: MapPin, desc: 'Anchor farm coordinates and ingest verified deeds to end physical audit cycles.', col: 'emerald' },
           ].map(opt => (
             <button 
                key={opt.id} 
                onClick={() => setActiveWorkflow(opt.id as any)} 
                className={`glass-card p-12 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center space-y-8 bg-black/40 shadow-xl active:scale-[0.98] relative overflow-hidden`}
             >
                <div className={`absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner`}>
                   <opt.icon size={64} className={`text-indigo-400 group-hover:text-white transition-colors`} />
                </div>
                <div className="space-y-4 relative z-10">
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{opt.label}</h3>
                   <p className="text-slate-500 text-base font-medium italic px-4 leading-relaxed">"{opt.desc}"</p>
                </div>
                <div className={`w-12 h-1 bg-indigo-500/20 rounded-full group-hover:w-32 group-hover:bg-indigo-500 transition-all`}></div>
             </button>
           ))}
        </div>
      ) : activeWorkflow === 'hardware' ? (
        /* --- HARDWARE SYNC FLOW --- */
        <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-indigo-500/20 bg-[#050706] shadow-3xl text-center space-y-12 animate-in slide-in-from-right-10 relative overflow-hidden min-h-[650px] flex flex-col justify-center">
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 flex flex-col items-center">
               <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className={`w-48 h-48 rounded-full border-4 border-dashed transition-all duration-[3s] flex items-center justify-center ${isScanning ? 'border-indigo-400 rotate-180 scale-110' : 'border-slate-800'}`}>
                    <Bluetooth size={80} className={`${isScanning ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                  {isScanning && <div className="absolute inset-0 border-2 border-indigo-500 rounded-full animate-ping opacity-20"></div>}
               </div>
               <div className="space-y-4 max-w-xl">
                  <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Spectral <span className="text-indigo-400">Handshake</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
                    {isScanning ? scanStatus : '"Initialize the hardware pairing sequence via spectral bridge."'}
                  </p>
               </div>
               <button 
                 onClick={handleStartHardwareSync} 
                 disabled={isScanning} 
                 className="px-24 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(99,102,241,0.3)] disabled:opacity-50 transition-all border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95"
               >
                 {isScanning ? 'PAIRING_NODES...' : 'INITIALIZE SYNC'}
               </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-4">
               <div className="w-32 h-32 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[40px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl">
                  <Fingerprint size={64} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Node <span className="text-indigo-400">Authorization</span></h4>
                  <p className="text-[11px] text-slate-500 font-mono uppercase font-black mt-3 tracking-[0.3em]">DEVICE_IDENTITY: {deviceId}</p>
               </div>
               <div className="max-w-md mx-auto space-y-8">
                  <input 
                    type="text" 
                    value={esinSign} 
                    onChange={e => setEsinSign(e.target.value)} 
                    placeholder="ENTER ESIN SIGNATURE" 
                    className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white outline-none focus:border-indigo-500/40 focus:ring-8 focus:ring-indigo-500/5 transition-all uppercase placeholder:text-stone-900 shadow-inner tracking-widest" 
                  />
                  <button onClick={finalizeStep1} className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">AUTHORIZE ANCHOR</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-2xl">
                 <FileUp size={40} className="animate-bounce" />
              </div>
              <div className="space-y-4 max-w-xl">
                 <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Legal <span className="text-blue-400">Document Ingest</span></h4>
                 <p className="text-slate-400 text-lg italic leading-relaxed">
                   "To finalize physical verification, ingest the legal ownership shard (Invoice/Warranty) for the gadget into the registry."
                 </p>
              </div>
              
              <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`w-full max-w-md p-16 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center cursor-pointer ${ingestedFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 bg-black/40 hover:border-blue-500/40'}`}
              >
                 <input type="file" ref={fileInputRef} className="hidden" onChange={handleDocumentIngest} />
                 {isIngestingDoc ? (
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                 ) : ingestedFile ? (
                    <div className="flex flex-col items-center gap-4">
                       <CheckCircle2 size={48} className="text-emerald-500" />
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SHARD_CAPTURED</p>
                    </div>
                 ) : (
                    <>
                       <FileText size={48} className="text-slate-700" />
                       <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4">Choose Shard File</p>
                    </>
                 )}
              </div>

              <button 
                 onClick={finalizeHardware}
                 disabled={!ingestedFile}
                 className="px-20 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-3xl disabled:opacity-20 active:scale-95 transition-all"
              >
                 FINALIZE PHYSICAL AUDIT
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000">
               <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(99,102,241,0.4)] relative group scale-110">
                  <CheckCircle2 size={120} className="group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-4 text-center">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Node <span className="text-emerald-400">Verified.</span></h3>
                  <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] font-mono mt-6">PHYSICAL_AUDIT_COMPLETE // SYNC_OK</p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
            </div>
          )}
        </div>
      ) : (
        /* --- LAND VERIFICATION FLOW --- */
        <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-emerald-500/20 bg-[#020503] shadow-3xl text-center space-y-12 animate-in slide-in-from-left-10 relative overflow-hidden min-h-[650px] flex flex-col justify-center">
          
          {step === 0 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 flex flex-col items-center">
               <div className="relative w-80 h-80 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                  <div className={`absolute inset-0 rounded-full border-r-4 border-t-4 border-emerald-500/40 transition-all duration-[4s] ${isScanning ? 'animate-spin' : ''}`}></div>
                  <div className={`w-32 h-32 rounded-3xl bg-black/60 border-2 border-white/10 flex items-center justify-center shadow-2xl relative z-10 transition-all duration-700 ${isScanning ? 'border-emerald-400 scale-110' : ''}`}>
                    <Satellite className={`w-16 h-16 ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
               </div>
               <div className="space-y-4 max-w-2xl">
                  <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Geofence <span className="text-emerald-400">Calibration</span></h4>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
                    {isScanning ? scanStatus : '"Establishing satellite coordinate shards to defining the industrial boundaries of your plot."'}
                  </p>
               </div>
               <button 
                 onClick={handleStartLandSync} 
                 disabled={isScanning} 
                 className="px-24 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50 transition-all border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95"
               >
                 {isScanning ? 'SYNCING_SATELLITE...' : 'INITIATE GEOLINK'}
               </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-4">
               <div className="w-32 h-32 bg-emerald-600/10 border-2 border-emerald-500/20 rounded-[40px] flex items-center justify-center mx-auto text-emerald-400 shadow-3xl">
                  <FileCheck size={64} />
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
               </div>
               <div className="max-w-lg mx-auto space-y-10">
                  <input 
                    type="text" 
                    value={esinSign} 
                    onChange={e => setEsinSign(e.target.value)} 
                    placeholder="NODE SIGNATURE" 
                    className="w-full bg-black border-2 border-white/10 rounded-[48px] py-12 text-center text-5xl font-mono text-white outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all uppercase placeholder:text-stone-900 shadow-inner tracking-widest" 
                  />
                  <button onClick={() => setStep(2)} className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5">PROCEED TO DEED GENERATION</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000 flex flex-col items-center">
               <div className="w-32 h-32 agro-gradient rounded-[40px] flex items-center justify-center mx-auto text-white shadow-3xl mb-8">
                  <Stamp size={56} />
               </div>
               <div className="space-y-8 text-center w-full">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Deed Shard <span className="text-emerald-400">Generated.</span></h3>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-widest mt-6">PHASE_3_REQUIRED: DEED_INGEST_BACK</p>
                  </div>
                  
                  <div className="p-12 md:p-16 bg-[#020403] rounded-[64px] border-4 border-double border-emerald-500/30 text-left space-y-10 shadow-3xl relative overflow-hidden group/cert max-w-2xl mx-auto">
                     <div className="flex justify-between items-center border-b-2 border-white/10 pb-8">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white border-2 border-white/20">
                              <BadgeCheck size={32} />
                           </div>
                           <h5 className="text-xl font-black text-white uppercase italic tracking-widest">LAND ANCHOR SHARD</h5>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-8 text-[10px] font-mono uppercase">
                        <div className="space-y-4">
                           <p className="text-slate-600 font-black tracking-widest">Latitude</p>
                           <p className="text-xl font-black text-white italic">{coords?.lat}N</p>
                        </div>
                        <div className="space-y-4">
                           <p className="text-slate-600 font-black tracking-widest">Longitude</p>
                           <p className="text-xl font-black text-white italic">{coords?.lng}E</p>
                        </div>
                     </div>
                     <button 
                       onClick={downloadWarrant}
                       className="w-full py-6 bg-white rounded-2xl text-black font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all hover:bg-emerald-50"
                     >
                       <Download size={18} /> Download for Final Verification
                     </button>
                  </div>
                  <div className="flex justify-center pt-8">
                    <button onClick={() => setStep(3)} className="px-16 py-6 bg-indigo-600 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-indigo-500 active:scale-95 transition-all">Proceed to Physical Verification Ending</button>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-2xl">
                 <ScanLine size={40} className="animate-pulse" />
              </div>
              <div className="space-y-4 max-w-xl">
                 <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Verified <span className="text-emerald-400">Deed Ingest</span></h4>
                 <p className="text-slate-400 text-lg italic leading-relaxed">
                   "To finalize the Land Verification process and end the physical audit requirement, ingest the signed/verified deed shard back into the registry."
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
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">DEED_SHARD_VERIFIED</p>
                    </div>
                 ) : (
                    <>
                       <ClipboardCheck size={48} className="text-slate-700" />
                       <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4">Ingest Verified Deed</p>
                    </>
                 )}
              </div>

              <button 
                 onClick={finalizeLand}
                 disabled={!ingestedFile}
                 className="px-24 py-8 agro-gradient rounded-full text-white font-black uppercase tracking-[0.4em] shadow-3xl disabled:opacity-20 active:scale-95 transition-all ring-8 ring-white/5"
              >
                 FINALIZE LAND REGISTRY
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-1000">
               <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110">
                  <ShieldCheck size={120} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-25px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
               </div>
               <div className="space-y-4 text-center">
                  <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Handshake <span className="text-emerald-400">Complete.</span></h3>
                  <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[1em] font-mono mt-6">PHYSICAL_AUDIT_FINALIZED // ASSET_FULLY_ANCHORED</p>
               </div>
               <button onClick={reset} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry</button>
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