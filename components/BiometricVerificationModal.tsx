import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, ShieldCheck, X, AlertTriangle, Cpu, Database, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../services/audioService';

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionName: string; // Dynamic description of the treasury action being protected
  stewardEsin: string;
}

export const BiometricVerificationModal: React.FC<BiometricVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionName,
  stewardEsin,
}) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [authStatusText, setAuthStatusText] = useState('PLACE STEWARD SHARD ON TRANSCEIVER');

  useEffect(() => {
    if (isOpen) {
      setScanState('idle');
      setProgress(0);
      setAuthStatusText('AWAITING DEVICE TOUCHID/FACEID OR PASSKEY MATCH');
      // Gentle ready notification
      audioManager.playNotificationPing();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanState === 'scanning') {
      // Trigger ongoing sweep hum audio
      audioManager.triggerDispenseHum(2500);

      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleVerificationOutcome();
            return 100;
          }
          // Increment scan text dynamically for authenticity
          if (prev === 25) setAuthStatusText('ACQUIRING CRYPTOGRAPHIC ENVELOPE...');
          if (prev === 55) setAuthStatusText('VERIFYING ENCLAVE SIGNATURE ON-CHAIN...');
          if (prev === 80) setAuthStatusText('COMPUTING LEDGER ENTROPY SHARD...');
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [scanState]);

  const handleStartScan = async () => {
    if (scanState === 'scanning' || scanState === 'success') return;
    setScanState('scanning');
    setProgress(0);
  };

  const handleVerificationOutcome = () => {
    // Generate success or slight failure odds to keep the sandbox authentic, but ensure high success rate
    const isVerified = Math.random() > 0.05; // 95% success rate
    if (isVerified) {
      setScanState('success');
      setAuthStatusText('DEVICE PASSKEY BIOMETRICS VERIFIED');
      audioManager.playSystemSuccess();
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } else {
      setScanState('failed');
      setAuthStatusText('BIOMETRIC MATCH MISMATCH OR TIMEOUT');
      audioManager.playSystemError();
    }
  };

  const handleRetry = () => {
    setScanState('idle');
    setProgress(0);
    setAuthStatusText('AWAITING DEVICE TOUCHID/FACEID OR PASSKEY MATCH');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Ambient Darkened Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#020504]/90 backdrop-blur-md"
        />

        {/* Dynamic biometric scanner hub */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#0e1411] to-[#040806] border-2 border-slate-800/80 rounded-[48px] p-8 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden"
        >
          {/* Decorative scanner guidelines */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-emerald-500/20 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500/20 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-emerald-500/20 rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-emerald-500/20 rounded-br-3xl pointer-events-none" />

          {/* Close trigger */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header context */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono tracking-widest uppercase mb-2">
              <Shield size={10} /> HIGH_SECURITY_STATION_AUTHENTICATION
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
              Biometric <span className="text-emerald-400">Verifying</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide max-w-md mx-auto uppercase">
              Protected Action: <span className="text-amber-400 font-bold">{actionName}</span>
            </p>
            <p className="text-[9px] text-slate-500 font-mono pt-1">
              STEWARD ROLE NODE: <span className="text-slate-300 font-bold">{stewardEsin}</span>
            </p>
          </div>

          {/* Holographic interactive fingerprint center */}
          <div className="flex flex-col items-center justify-center space-y-8 my-10">
            <div className="relative">
              {/* Outer scanning rings */}
              <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${
                scanState === 'scanning' ? 'border-emerald-500/40 animate-spin' :
                scanState === 'success' ? 'border-emerald-500 scale-110' :
                scanState === 'failed' ? 'border-rose-500 scale-105 animate-shake' : 'border-slate-800'
              }`} />

              <div className={`absolute -inset-4 rounded-full border border-dotted transition-all duration-500 ${
                scanState === 'scanning' ? 'border-teal-500/20 scale-105' : 'border-transparent'
              }`} />

              {/* Glowing scanning matrix box */}
              <button
                id="btn-trigger-passkey-capture"
                onClick={handleStartScan}
                disabled={scanState === 'scanning' || scanState === 'success'}
                className={`relative w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-500 cursor-pointer ${
                  scanState === 'idle' ? 'bg-slate-900/40 border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-950/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]' :
                  scanState === 'scanning' ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' :
                  scanState === 'success' ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]' :
                  'bg-rose-950/20 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                }`}
              >
                {/* Fingerprint Glyph with scanning overlay */}
                <div className="relative text-white flex items-center justify-center">
                  <Fingerprint size={72} className={`transition-all duration-500 ${
                    scanState === 'idle' ? 'text-slate-500 transform scale-95' :
                    scanState === 'scanning' ? 'text-emerald-400' :
                    scanState === 'success' ? 'text-emerald-300 transform scale-105' :
                    'text-rose-400'
                  }`} />

                  {/* Laser Sweeper Beam Component */}
                  {scanState === 'scanning' && (
                    <motion.div
                      initial={{ y: -36 }}
                      animate={{ y: 36 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 1.2,
                        ease: 'easeInOut'
                      }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                    />
                  )}
                </div>

                {/* Progress Circle Border */}
                {scanState === 'scanning' && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      className="stroke-emerald-500 shadow-md"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray="465"
                      strokeDashoffset={465 - (465 * progress) / 100}
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Status updates terminal */}
            <div className="w-full text-center space-y-2">
              <span className={`text-[10px] font-mono tracking-widest uppercase font-black px-4 py-1.5 rounded-lg border transition-all ${
                scanState === 'idle' ? 'text-slate-400 bg-slate-950 border-slate-900' :
                scanState === 'scanning' ? 'text-teal-400 bg-teal-950/40 border-teal-500/20 block animate-pulse' :
                scanState === 'success' ? 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' :
                'text-rose-400 bg-rose-950/50 border-rose-500/30'
              }`}>
                {scanState === 'idle' ? '● CLICK TO INIT SECURE HANDSHAKE' : `[ ${authStatusText} ]`}
              </span>

              {scanState === 'scanning' && (
                <div className="text-[9px] font-mono text-slate-400">
                  ESTABLISHING SECURE PROTOCOLS... {progress}%
                </div>
              )}
            </div>
          </div>

          {/* Secure enclave metadata info */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 grid grid-cols-2 gap-y-2 text-[9px] font-mono text-slate-400">
            <div className="flex justify-between border-b border-slate-900 pb-1 pr-2">
              <span>ALGORITHM:</span>
              <span className="text-white font-bold">ECDSA-P256</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1 pl-2">
              <span>INTEGRITY:</span>
              <span className="text-emerald-400 font-bold">HARDWARE</span>
            </div>
            <div className="flex justify-between pr-2 pt-1">
              <span>STANDARDS:</span>
              <span className="text-slate-300 font-bold">FIDO2/WebAuthn</span>
            </div>
            <div className="flex justify-between pl-2 pt-1">
              <span>CHALLENGE:</span>
              <span className="text-amber-400 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex gap-4 mt-8 pt-4 border-t border-slate-900">
            {scanState === 'failed' ? (
              <button
                onClick={handleRetry}
                className="flex-1 py-4 bg-rose-950 text-rose-400 border border-rose-500/20 hover:bg-rose-900 rounded-2xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw size={12} /> Retry Verification
              </button>
            ) : (
              <button
                onClick={handleStartScan}
                disabled={scanState === 'scanning' || scanState === 'success'}
                className={`flex-1 py-4 rounded-2xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  scanState === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                {scanState === 'success' ? (
                  <>
                    <ShieldCheck size={14} /> Verification Certified
                  </>
                ) : (
                  <>
                    <Fingerprint size={14} /> Tap Sensor
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-shrink-0 px-6 py-4 bg-slate-950 border border-slate-900 text-slate-400 hover:text-white rounded-2xl text-[10px] uppercase font-black tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
