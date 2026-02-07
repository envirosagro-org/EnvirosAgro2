
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
  Cpu,
  Monitor,
  Terminal,
  Server,
  Link2,
  Network,
  Binary,
  Code2,
  Settings,
  ScanLine,
  CpuIcon,
  HardDrive
} from 'lucide-react';
import { User, AgroResource, ViewState } from '../types';

interface RegistryHandshakeProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate?: (view: ViewState) => void;
}

const RegistryHandshake: React.FC<RegistryHandshakeProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeWorkflow, setActiveWorkflow] = useState<'hardware' | 'land' | null>(null);
  const [hardwareSubMode, setHardwareSubMode] = useState<'internal' | 'external' | null>(null);
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [esinSign, setEsinSign] = useState('');
  const [scanStatus, setScanStatus] = useState('');
  const [nodeEntropy, setNodeEntropy] = useState('0.002');
  const [signalLock, setSignalLock] = useState(0);

  // Land specific states
  const [coords, setCoords] = useState<{lat: string, lng: string} | null>(null);
  const [deedId, setDeedId] = useState('');
  const [integrityHash, setIntegrityHash] = useState('');

  useEffect(() => {
    if (isScanning) {
      const statuses = activeWorkflow === 'land' ? [
        "Initializing Spectral Ingest...",
        "Querying Local Quorum...",
        "Hashing Biometric Shards...",
        "Verifying ZK-Proofs...",
        "Finalizing Handshake..."
      ] : hardwareSubMode === 'internal' ? [
        "Probing Virtual Environment...",
        "Binding Kernel Shards...",
        "Authenticating Virtual UUID...",
        "Mapping Memory Shards...",
        "Mounting OS Buffer...",
        "Finalizing Internal Handshake..."
      ] : [
        "Broadcasting Discovery Pulse...",
        "Searching via Bluetooth/NFC...",
        "Proximity Handshake Initiated...",
        "Decoding Hardware Signal...",
        "Validating External Firmware...",
        "Bonding Physical Shard..."
      ];
      
      let i = 0;
      const interval = setInterval(() => {
        setScanStatus(statuses[i]);
        setNodeEntropy((Math.random() * 0.01).toFixed(4));
        setSignalLock(prev => Math.min(100, prev + (100 / statuses.length)));
        i = (i + 1) % statuses.length;
      }, 900);
      return () => clearInterval(interval);
    } else {
      setSignalLock(0);
    }
  }, [isScanning, activeWorkflow, hardwareSubMode]);

  const reset = () => {
    setActiveWorkflow(null);
    setHardwareSubMode(null);
    setStep(0);
    setDeviceId('');
    setEsinSign('');
    setIsScanning(false);
    setCoords(null);
    setDeedId('');
    setIntegrityHash('');
    setScanStatus('');
  };

  const handleStartInternalHandshake = () => {
    setIsScanning(true);
    setHardwareSubMode('internal');
    setTimeout(() => {
      setIsScanning(false);
      setDeviceId(`VIRT-NODE-${Math.random().toString(36).substring(7).toUpperCase()}`);
      setStep(1);
    }, 5000);
  };

  const handleStartExternalHandshake = () => {
    setIsScanning(true);
    setHardwareSubMode('external');
    setTimeout(() => {
      setIsScanning(false);
      setDeviceId(`PHYS-NODE-${Math.random().toString(36).substring(7).toUpperCase()}`);
      setStep(1);
    }, 6000);
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
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE MISMATCH: Node ESIN mismatch.");
      return;
    }
    
    const isInternal = hardwareSubMode === 'internal';
    const newResource: AgroResource = {
      id: deviceId,
      category: 'HARDWARE',
      type: isInternal ? 'Virtual Compute Node' : 'Physical Ingest Node',
      name: isInternal ? 'Primary OS Node' : 'Field Ingest Hub',
      status: 'VERIFIED',
      capabilities: isInternal ? ['System_Control', 'Logic_Sharding', 'Virtual_Twin'] : ['Bio_Sync', 'Acoustic_Audit', 'Field_Telemetry'],
      verificationMeta: { 
        method: isInternal ? 'DOC_INGEST' : 'IOT_HANDSHAKE', 
        verifiedAt: new Date().toISOString(),
        confidenceScore: isInternal ? 1.0 : 0.98 
      }
    };
    
    onUpdateUser({ ...user, resources: [...(user.resources || []), newResource] });
    setStep(2);
  };

  const finalizeLand = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE MISMATCH: Node ESIN mismatch.");
      return;
    }
    
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
      {/* HUD Header */}
      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform"><SmartphoneNfc size={300} /></div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-pulse"></div>
            <Zap size={32} className="text-white relative z-10" />
         </div>
         <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-indigo-400">Handshake</span></h2>
            <p className="text-slate-400 text-xl font-medium italic opacity-80 leading-relaxed">Pair physical hardware or virtual land resources with the global network mesh.</p>
         </div>
      </div>

      {/* Main Workflow Viewport */}
      <div className="min-h-[500px]">
        {step === 0 && !isScanning && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Hardware Workflow */}
            <div className={`glass-card p-12 rounded-[56px] border-2 transition-all flex flex-col space-y-8 ${activeWorkflow === 'hardware' ? 'border-indigo-500 bg-indigo-500/10 shadow-3xl' : 'border-white/5 bg-black/40'}`}>
              <div className="flex items-center justify-between">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl">
                  <Smartphone size={40} />
                </div>
                {activeWorkflow !== 'hardware' && (
                  <button 
                    onClick={() => setActiveWorkflow('hardware')}
                    className="px-6 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                  >Select</button>
                )}
              </div>
              <div>
                <h4 className="text-2xl font-black text-white uppercase italic">Node Pair</h4>
                <p className="text-slate-500 text-sm italic mt-2">Associate IoT sensors, robotic units, or virtual compute layers.</p>
              </div>

              {activeWorkflow === 'hardware' && (
                <div className="grid grid-cols-1 gap-4 animate-in zoom-in duration-300">
                   <button 
                    onClick={handleStartInternalHandshake}
                    className="p-6 glass-card rounded-3xl border border-white/10 hover:border-indigo-500/40 bg-black/40 text-left group transition-all"
                   >
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                           <CpuIcon size={20} className="text-indigo-400" />
                           <span className="text-xs font-black text-white uppercase tracking-widest">Internal Handshake</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                     </div>
                     <p className="text-[10px] text-slate-500 italic">Sync the device initializing the app as a Virtual Node.</p>
                   </button>

                   <button 
                    onClick={handleStartExternalHandshake}
                    className="p-6 glass-card rounded-3xl border border-white/10 hover:border-blue-500/40 bg-black/40 text-left group transition-all"
                   >
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                           <Radio size={20} className="text-blue-400" />
                           <span className="text-xs font-black text-white uppercase tracking-widest">External Handshake</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                     </div>
                     <p className="text-[10px] text-slate-500 italic">Bond with physical hardware (Sensors, Rovers) via discovery pulse.</p>
                   </button>
                   <button onClick={() => setActiveWorkflow(null)} className="py-3 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Back</button>
                </div>
              )}
            </div>

            {/* Land Workflow */}
            <div className={`glass-card p-12 rounded-[56px] border-2 transition-all flex flex-col space-y-8 ${activeWorkflow === 'land' ? 'border-emerald-500 bg-emerald-500/10 shadow-3xl' : 'border-white/5 bg-black/40'}`}>
              <div className="flex items-center justify-between">
                <div className="w-20 h-20 rounded-3xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
                  <MapPin size={40} />
                </div>
                {activeWorkflow !== 'land' && (
                  <button 
                    onClick={() => setActiveWorkflow('land')}
                    className="px-6 py-2 bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                  >Select</button>
                )}
              </div>
              <div>
                <h4 className="text-2xl font-black text-white uppercase italic">Plot Sync</h4>
                <p className="text-slate-500 text-sm italic mt-2">Connect physical geofence acreage shards using spectral ingest.</p>
              </div>
              {activeWorkflow === 'land' && (
                <div className="space-y-4 animate-in zoom-in duration-300">
                  <button 
                    onClick={handleStartLandSync}
                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all"
                  >
                    INITIALIZE GEO-LOCK
                  </button>
                  <button onClick={() => setActiveWorkflow(null)} className="w-full py-3 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Back</button>
                </div>
              )}
            </div>
          </div>
        )}

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-20 space-y-12 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-indigo-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.2)]">
                <Loader2 className="w-32 h-32 text-indigo-500 animate-spin" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-12 h-12 text-indigo-400 animate-pulse" />
              </div>
              <div className="absolute inset-[-10px] border-t-8 border-indigo-500 rounded-full animate-spin"></div>
            </div>
            
            <div className="text-center space-y-8 w-full max-w-md">
              <div className="space-y-2">
                 <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.4em] animate-pulse italic m-0">{scanStatus}</p>
                 <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Entropy: {nodeEntropy} // Lock: {Math.floor(signalLock)}%</p>
              </div>
              
              <div className="space-y-3">
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-700 shadow-[0_0_15px_#6366f1]" style={{ width: `${signalLock}%` }}></div>
                 </div>
                 <div className="flex justify-between px-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1 h-8 rounded-full transition-all duration-300 ${signalLock > (i+1)*20 ? 'bg-indigo-400 animate-pulse' : 'bg-white/5'}`}></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-12 animate-in slide-in-from-right-10 duration-700">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                <Fingerprint size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-4xl font-black text-white uppercase italic m-0 leading-none">Node Signature</h3>
              <p className="text-slate-400 text-lg italic">Confirm handshake with shard: <span className="text-indigo-400 font-mono font-bold">{deviceId}</span></p>
            </div>
            
            <div className="space-y-6 p-10 bg-black/60 rounded-[56px] border border-white/5 shadow-inner">
              <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] text-center block mb-4">Steward Auth Signature (ESIN)</label>
                 <input 
                   type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                   placeholder="EA-XXXX-XXXX"
                   className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.1em] outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-900 shadow-inner"
                 />
              </div>
              <div className="flex items-center gap-4 bg-indigo-500/5 p-4 rounded-3xl border border-indigo-500/20">
                 <Info size={16} className="text-indigo-400" />
                 <p className="text-[9px] text-slate-500 uppercase font-black leading-relaxed">By signing, you immutably anchor this {hardwareSubMode === 'internal' ? 'Virtual' : 'Physical'} node to the global industrial ledger.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={reset} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Abort_Handshake</button>
              <button 
                onClick={activeWorkflow === 'hardware' ? finalizeHardware : finalizeLand}
                disabled={!esinSign}
                className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
              >
                <Stamp size={24} className="inline mr-4 fill-current" /> Anchor Shard
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-1000 text-center relative">
            <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(99,102,241,0.4)] scale-110 relative group">
              <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
              <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-6 text-center">
               <h3 className="text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Sync <span className="text-emerald-400">Complete.</span></h3>
               <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH: 0x882_SYNC_OK_#{(Math.random()*100).toFixed(0)}</p>
            </div>
            
            <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-6 max-w-lg w-full shadow-2xl relative overflow-hidden group/success">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[10s]"><Activity size={120} /></div>
               <div className="flex justify-between items-center px-4 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shadow-inner"><BadgeCheck size={20} /></div>
                     <span className="text-xs font-black text-slate-300 uppercase tracking-widest italic">Node Reliability Shard</span>
                  </div>
                  <span className="text-2xl font-mono font-black text-white">100%</span>
               </div>
               <div className="h-px w-full bg-white/10"></div>
               <p className="text-sm text-slate-400 italic px-4 leading-loose">
                  "Node {deviceId} successfully sharded to the industrial mesh. Operational throughput has been normalized across the local cluster."
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              {activeWorkflow === 'land' && (
                <button onClick={downloadWarrant} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95">
                  <Download size={20} /> Download Warrant
                </button>
              )}
              <button onClick={reset} className="flex-1 py-8 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] shadow-xl active:scale-95 transition-all ring-8 ring-indigo-500/5">Return to Registry</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default RegistryHandshake;
