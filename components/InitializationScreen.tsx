
import React, { useState, useEffect } from 'react';
import { SycamoreLogo } from './SycamoreLogo';
import { Loader2, ShieldCheck } from 'lucide-react';
import { verifyAppCheckHandshake } from '../services/firebaseService';

const BOOT_LOGS = [
  "INITIALIZING RECAPTCHA APP_CHECK...",
  "ESTABLISHING SECURITY HANDSHAKE...",
  "MAPPING_GEOFENCE_SHARDS [OK]",
  "CALIBRATING_M_CONSTANT_BASE [1.42]",
  "SYNCING_L3_INDUSTRIAL_LEDGER...",
  "ZK_PROOF_ENGINE_BOOT [SUCCESS]",
  "ESTABLISHING_ORACLE_HANDSHAKE...",
  "SEHTI_THRUST_ALIGNED",
  "DATA_CONNECT_L3_SYNC_ACTIVE",
  "NODE_SYNC_FINALIZED"
];

export const InitializationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifStatus, setVerifStatus] = useState('PENDING_HANDSHAKE');

  useEffect(() => {
    const runHandshake = async () => {
      await new Promise(r => setTimeout(r, 1000));
      const success = await verifyAppCheckHandshake();
      if (success) {
        setVerifStatus('SECURITY_VERIFIED');
      } else {
        setVerifStatus('OFFLINE_RECOVERY_MODE');
      }
      await new Promise(r => setTimeout(r, 1000));
      setIsVerifying(false);
    };
    runHandshake();
  }, []);

  useEffect(() => {
    if (isVerifying) return;
    const logInterval = setInterval(() => {
      setCurrentLog(prev => (prev < BOOT_LOGS.length - 1 ? prev + 1 : prev));
    }, 1200);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return prev + 1;
      });
    }, 55);
    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete, isVerifying]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center space-y-12 overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      <div className="relative group">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[48px] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-pulse relative z-20 overflow-hidden">
          <SycamoreLogo size={120} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute inset-[-30px] border-2 border-dashed border-emerald-500/20 rounded-[64px] animate-spin-slow"></div>
        {isVerifying && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 animate-in fade-in duration-500">
             <div className="p-4 bg-black/80 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col items-center gap-2">
               <Loader2 size={32} className="text-emerald-500 animate-spin" />
               <span className="text-[8px] font-black text-white tracking-[0.2em]">{verifStatus}</span>
             </div>
           </div>
        )}
      </div>
      <div className="w-full max-w-md space-y-8 relative z-20">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px shadow-inner">
          <div className="h-full bg-emerald-500 shadow-[0_0_20px_#10b981] transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex flex-col items-center gap-6">
           <p className="text-[11px] font-mono font-black text-emerald-400/80 uppercase tracking-[0.4em] animate-pulse h-4 text-center">
              {BOOT_LOGS[currentLog]}
           </p>
           <div className="flex items-center gap-6">
              <p className="text-[9px] font-mono text-slate-700 font-bold uppercase tracking-widest">
                SYSTEM_BOOT // REGISTRY_SYNC: {progress}%
              </p>
              {progress > 50 && <ShieldCheck size={14} className="text-emerald-500 animate-in zoom-in" />}
           </div>
        </div>
      </div>
      <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-40">
        <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Enviros<span className="text-emerald-400">Agro</span></h1>
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.5em] text-center">Decentralized Regenerative Grid</p>
      </div>
    </div>
  );
};
