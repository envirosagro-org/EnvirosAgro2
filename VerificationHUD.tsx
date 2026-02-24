
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Loader2, 
  RefreshCw, 
  Send, 
  ShieldAlert, 
  Fingerprint, 
  Lock, 
  CheckCircle2, 
  Globe, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { refreshAuthUser, sendVerificationShard, signOutSteward } from '../services/firebaseService';

interface VerificationHUDProps {
  userEmail: string;
  onVerified: () => void;
  onLogout: () => void;
}

const VerificationHUD: React.FC<VerificationHUDProps> = ({ userEmail, onVerified, onLogout }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsRefreshing(true);
    try {
      const user = await refreshAuthUser();
      if (user?.emailVerified) {
        onVerified();
      } else {
        setStatusMessage("REGISTRY_PENDING: Email signature not yet detected on-chain.");
      }
    } catch (e) {
      setStatusMessage("SYNC_ERROR: Could not reach auth quorum.");
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setTimeout(() => setStatusMessage(null), 3000);
      }, 1000);
    }
  };

  const resendShard = async () => {
    setIsResending(true);
    try {
      await sendVerificationShard();
      setStatusMessage("SHARD_TRANSMITTED: Check your inbox for the ZK-Identity link.");
    } catch (e) {
      setStatusMessage("TRANSMISSION_FAILED: Rate limit hit. Try again in 60s.");
    } finally {
      setTimeout(() => {
        setIsResending(false);
        setTimeout(() => setStatusMessage(null), 3000);
      }, 1500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-700">
      <div className="glass-card p-10 md:p-16 rounded-[64px] border-emerald-500/20 bg-black/60 shadow-3xl w-full max-w-2xl text-center space-y-12 relative overflow-hidden group">
         
         {/* Background Scanline FX */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/20 to-transparent absolute top-0 animate-scan"></div>
         </div>

         <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-600/10 border-4 border-emerald-500/20 rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse relative">
               <Fingerprint className="w-12 h-12 md:w-16 md:h-16 text-emerald-400" />
               <div className="absolute inset-[-10px] border-2 border-dashed border-emerald-500/10 rounded-[50px] animate-spin-slow"></div>
            </div>
            <div className="space-y-3">
               <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Identity <span className="text-emerald-400">Handshake</span></h1>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">Registry Validation Required</p>
            </div>
         </div>

         <div className="p-8 bg-black/80 rounded-[48px] border border-white/5 space-y-6 shadow-inner relative z-10">
            <div className="flex items-center justify-center gap-4 text-emerald-400">
               <Mail size={24} />
               <span className="text-lg font-mono font-black tracking-widest">{userEmail}</span>
            </div>
            <p className="text-slate-400 text-sm md:text-base italic leading-relaxed px-6">
               "A secure verification shard has been dispatched. Authenticate your email to anchor your node to the planetary regeneration grid."
            </p>
         </div>

         {statusMessage && (
           <div className={`p-5 rounded-3xl border text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 flex items-center justify-center gap-3 ${
             statusMessage.includes('FAILED') ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
           }`}>
             {statusMessage.includes('FAILED') ? <ShieldAlert size={14} /> : <Zap size={14} fill="currentColor" />}
             {statusMessage}
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <button 
              onClick={checkStatus}
              disabled={isRefreshing}
              className="py-6 bg-emerald-600 hover:bg-emerald-500 rounded-[32px] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
               {isRefreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
               REFRESH NODE STATUS
            </button>
            <button 
              onClick={resendShard}
              disabled={isResending}
              className="py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[32px] text-slate-300 font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 disabled:opacity-50"
            >
               {isResending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
               RESEND SHARD
            </button>
         </div>

         <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6 relative z-10">
            <button 
              onClick={onLogout}
              className="text-[10px] font-black text-slate-700 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              <Lock size={14}/> ABORT SYNCHRONIZATION
            </button>
            <div className="flex gap-10 opacity-20">
               <Globe size={20} className="text-white" />
               <ShieldCheck size={20} className="text-white" />
            </div>
         </div>
      </div>
      
      <style>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default VerificationHUD;
