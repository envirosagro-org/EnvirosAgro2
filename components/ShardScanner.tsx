
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  Scan,
  Database,
  Activity,
  History,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

interface ShardScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (data: any) => void;
  userEsin: string;
}

export const ShardScanner: React.FC<ShardScannerProps> = ({ isOpen, onClose, onVerified, userEsin }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'IDLE' | 'SCANNING' | 'VERIFYING' | 'RESULT'>('IDLE');
  
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveStep('IDLE');
      setScanResult(null);
      setError(null);
    }
  }, [isOpen]);

  const startScan = () => {
    setActiveStep('SCANNING');
    setIsScanning(true);
    
    // Simulate finding a QR code after 3 seconds
    setTimeout(() => {
      if (Math.random() > 0.1) {
        verifyShard({
          id: `SHD-${Math.floor(Math.random() * 10000)}`,
          type: 'HARDWARE_MODULE',
          origin: 'Nairobi Hub Node',
          trustRating: 98.4,
          lastSync: new Date().toISOString(),
          esin: userEsin
        });
      } else {
        setError('CORRUPT_SHARD_DETECTED: Checksum mismatch in Sector 7.');
        setActiveStep('IDLE');
      }
    }, 4000);
  };

  const verifyShard = (data: any) => {
    setActiveStep('VERIFYING');
    setTimeout(() => {
      setScanResult(data);
      setActiveStep('RESULT');
      onVerified(data);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg glass-card rounded-[48px] border-2 border-white/10 bg-[#050706] shadow-3xl overflow-hidden flex flex-col min-h-[600px]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                  <Scan size={24} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">Shard <span className="text-indigo-400">Scanner.</span></h2>
                 <p className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-1">ASSET_VERIFICATION_v4</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><X size={24}/></button>
          </div>

          <div className="flex-1 p-8 flex flex-col">
            {activeStep === 'IDLE' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in duration-500">
                <div className="w-48 h-48 rounded-[48px] border-4 border-dashed border-white/10 flex items-center justify-center relative group">
                  <Camera size={80} className="text-slate-700 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[48px] animate-pulse"></div>
                  {error && (
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full">
                       <p className="text-rose-500 font-mono text-[9px] font-black uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 py-2 px-4 rounded-full shadow-xl">
                         {error}
                       </p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm font-medium italic leading-relaxed max-w-xs mx-auto">
                    "Point your camera at the physical asset's industrial shard or QR code to sync with the registry."
                  </p>
                  <button 
                    onClick={startScan}
                    className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10"
                  >
                     INITIALIZE_LENS
                  </button>
                </div>
              </div>
            )}

            {activeStep === 'SCANNING' && (
              <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-[32px] bg-black/40 border-2 border-white/5 shadow-inner">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] animate-pulse"></div>
                 <div className="w-64 h-64 border-2 border-indigo-500/40 rounded-3xl relative">
                    <div className="absolute inset-0 bg-transparent overflow-hidden">
                       <div className="h-0.5 w-full bg-indigo-500 shadow-[0_0_15px_#6366f1] absolute top-0 animate-scan"></div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-indigo-500"></div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-indigo-500"></div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-indigo-500"></div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-indigo-500"></div>
                 </div>
                 <div className="mt-12 text-center space-y-4 relative z-10">
                    <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.6em] animate-pulse">SEEKING_SHARD_SIGNATURE...</p>
                    <p className="text-[9px] text-slate-600 font-mono italic">LENS_STABILITY: 0.84</p>
                 </div>
              </div>
            )}

            {activeStep === 'VERIFYING' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
                 <div className="relative">
                    <Loader2 size={100} className="text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Database size={32} className="text-white" />
                    </div>
                 </div>
                 <div className="text-center space-y-4">
                    <p className="text-white font-black text-2xl uppercase italic tracking-tighter m-0">Anchoring <span className="text-indigo-400">to Node.</span></p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] animate-pulse">Verifying_Immutable_Path...</p>
                 </div>
              </div>
            )}

            {activeStep === 'RESULT' && scanResult && (
              <div className="flex-1 space-y-10 animate-in slide-in-from-bottom-6 duration-700">
                 <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] flex items-center gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/[0.02] group-hover:scale-110 transition-transform duration-[10s]"></div>
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl relative z-10">
                       <CheckCircle2 size={40} />
                    </div>
                    <div className="relative z-10">
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">SHARD <span className="text-emerald-400">IDENTIFIED.</span></h4>
                       <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-2">VERIFICATION_STATUS: TRUTH_LEVEL_7</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Shard ID', val: scanResult.id, icon: QrCode },
                      { label: 'Asset Class', val: scanResult.type, icon: Database },
                      { label: 'Origin Node', val: scanResult.origin, icon: History },
                      { label: 'Trust Rating', val: `${scanResult.trustRating}%`, icon: Activity }
                    ].map((detail, i) => (
                      <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-2 hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center gap-2 text-slate-600">
                           <detail.icon size={12} />
                           <span className="text-[8px] font-black uppercase tracking-widest">{detail.label}</span>
                        </div>
                        <p className="text-sm font-mono font-black text-white">{detail.val}</p>
                      </div>
                    ))}
                 </div>

                 <div className="pt-6 space-y-4">
                    <button 
                      onClick={onClose}
                      className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all"
                    >
                       ACCEPT_&_INTEGRATE
                    </button>
                    <button 
                      onClick={() => setActiveStep('IDLE')}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                       SCAN_ANOTHER_SHARD
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/60 opacity-40">
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                <span className="text-[8px] font-mono text-slate-400">ENCODER: {userEsin}</span>
             </div>
             <p className="text-[8px] font-mono text-slate-400 italic">v4.0.2_GRID_EYE</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
