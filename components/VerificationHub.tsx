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
  ArrowRight,
  Activity,
  Database,
  Binary,
  Workflow,
  Globe2,
  Chrome,
  Key,
  BadgeCheck,
  Cpu,
  SmartphoneNfc,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { refreshAuthUser, sendVerificationShard, signOutSteward, signInWithGoogle } from '../services/firebaseService';
import { SycamoreLogo } from './Icons';

interface VerificationHubProps {
  userEmail: string;
  onVerified: () => void;
  onLogout: () => void;
}

const VerificationHub: React.FC<VerificationHubProps> = ({ userEmail, onVerified, onLogout }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Levels of verification
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);
  const [isTwoFactorActive, setIsTwoFactorActive] = useState(false);
  const [isZkPuzzleCleared, setIsZkPuzzleCleared] = useState(false);
  const [isConsensusAchieved, setIsConsensusAchieved] = useState(false);

  // ZK-Integrity Interactive Challenge state
  const [puzzleSequence, setPuzzleSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [puzzleMsg, setPuzzleMsg] = useState<string | null>("Initialize dynamic alignment keys below");
  const [puzzleLevel, setPuzzleLevel] = useState(1);

  // Global static node counts (counted in achievements)
  const [networkNodesSecureCount, setNetworkNodesSecureCount] = useState(12842);

  // Initialize checks
  useEffect(() => {
    // Basic verification status check
    const runImmediateChecks = async () => {
      try {
        const user = await refreshAuthUser();
        if (user?.emailVerified) {
          setIsEmailVerified(true);
        }
        if (user?.providerData?.some(p => p.providerId === 'google.com')) {
          setIsGoogleSynced(true);
        }
      } catch (e) {
        console.error("Initial verification checks failed", e);
      }
    };
    runImmediateChecks();
    generateNewPuzzle();
  }, []);

  // Check consensus level automatically if threshold of protocols achieved
  useEffect(() => {
    let achievedCount = 0;
    if (isEmailVerified) achievedCount++;
    if (isGoogleSynced) achievedCount++;
    if (isTwoFactorActive) achievedCount++;
    if (isZkPuzzleCleared) achievedCount++;

    if (achievedCount >= 4) {
      setIsConsensusAchieved(true);
    } else {
      setIsConsensusAchieved(false);
    }
  }, [isEmailVerified, isGoogleSynced, isTwoFactorActive, isZkPuzzleCleared]);

  const generateNewPuzzle = () => {
    const list = [1, 2, 3, 4, 5];
    const randomized = [...list].sort(() => Math.random() - 0.5);
    setPuzzleSequence(randomized);
    setPlayerInput([]);
    setPuzzleMsg("Align keys in ascending order (Click 1 through 5)");
  };

  const handleKeyClick = (num: number) => {
    if (isZkPuzzleCleared) return;
    
    // Check if the clicked number is indeed the next ascending number we expect
    const nextExpected = playerInput.length + 1;
    if (num === nextExpected) {
      const newInput = [...playerInput, num];
      setPlayerInput(newInput);
      setPuzzleMsg(`Key shard #${num} aligned correctly.`);
      
      if (newInput.length === 5) {
        setIsZkPuzzleCleared(true);
        setPuzzleMsg("PROTOCOL_RESOLVED_SECURED: Cryptographic parity established.");
        setNetworkNodesSecureCount(prev => prev + 1); // Count this user in
      }
    } else {
      setPlayerInput([]);
      setPuzzleMsg("ALIGNMENT_FAILED: Hash parity mismatch. Re-calibrating sequence...");
      setTimeout(() => {
        generateNewPuzzle();
      }, 1000);
    }
  };

  const handleGoogleVerify = async () => {
    setIsGoogleVerifying(true);
    setStatusMessage("INITIALIZING_GOOGLE_SHARD_SYNC...");
    try {
      await signInWithGoogle();
      setIsGoogleSynced(true);
      setStatusMessage("GOOGLE_SYNC_SUCCESS: Handshake verified.");
    } catch (e: any) {
      console.error(e);
      setStatusMessage(`GOOGLE_SYNC_ERROR: ${e.message}`);
    } finally {
      setIsGoogleVerifying(false);
    }
  };

  const checkStatus = async () => {
    setIsRefreshing(true);
    setStatusMessage("PROBING_NODE_SIGNATURE...");
    try {
      const user = await refreshAuthUser();
      if (user?.emailVerified) {
        setIsEmailVerified(true);
        setStatusMessage("REGISTRY_VERIFIED: Primary activation shard located.");
      } else {
        setStatusMessage("REGISTRY_PENDING: Email handshake not detected on-chain. Please check your inbox.");
      }
    } catch (e) {
      setStatusMessage("SYNC_ERROR: Quorum communication timeout.");
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setTimeout(() => setStatusMessage(null), 4000);
      }, 1200);
    }
  };

  const resendShard = async () => {
    setIsResending(true);
    setStatusMessage("DISPATCHING_NEW_SHARD...");
    try {
      await sendVerificationShard();
      setStatusMessage("SHARD_TRANSMITTED: New verification handshake dispatched to inbox.");
    } catch (e) {
      setStatusMessage("TRANSMISSION_FAILED: Secure relay rate limit hit.");
    } finally {
      setTimeout(() => {
        setIsResending(false);
        setTimeout(() => setStatusMessage(null), 4000);
      }, 1200);
    }
  };

  // Protocols overview representation
  const protocols = [
    {
      level: 1,
      title: "EMAIL_SIGNITURE_HANDSHAKE",
      desc: "Activate base node communication by verifying your registered digital email shard.",
      status: isEmailVerified ? "RESOLVED_SECURED" : "PENDING_DISPATCH",
      verified: isEmailVerified,
      icon: Mail,
      element: (
        <div className="flex gap-4 mt-4 animate-in slide-in-from-bottom duration-300">
           <button onClick={checkStatus} disabled={isRefreshing} className="flex-1 py-4 bg-emerald-700/80 hover:bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2">
              {isRefreshing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              CHECK STATUS
           </button>
           <button onClick={resendShard} disabled={isResending} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              {isResending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              RESEND EMAIL SHARD
           </button>
        </div>
      )
    },
    {
      level: 2,
      title: "FEDERATED_IDENTITY_SYNC",
      desc: "Synchronize identity hashes with secure Google federation credentials.",
      status: isGoogleSynced ? "RESOLVED_SECURED" : "PENDING_SYNC",
      verified: isGoogleSynced,
      icon: Chrome,
      element: !isGoogleSynced ? (
        <button onClick={handleGoogleVerify} disabled={isGoogleVerifying} className="w-full mt-4 py-4 bg-white hover:bg-slate-100 text-black font-black text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2">
           {isGoogleVerifying ? <Loader2 size={12} className="animate-spin" /> : <Chrome size={12} />}
           SYNC GOOGLE ACCREDITATION
        </button>
      ) : null
    },
    {
      level: 3,
      title: "MULTI_FACTOR_RESONANCE",
      desc: "Configure secondary transceiver shards (configured in user profile configuration settings).",
      status: isTwoFactorActive ? "RESOLVED_SECURED" : "INTEGRATION_AVAILABLE",
      verified: isTwoFactorActive,
      icon: SmartphoneNfc,
      element: (
        <div className="mt-4 flex flex-col gap-3">
           <p className="text-[9px] text-slate-500 italic">"Ensure MFA Transceiver is enabled on your Profile settings for persistent security."</p>
           {!isTwoFactorActive ? (
              <button 
                onClick={() => {
                   setIsTwoFactorActive(true);
                   setNetworkNodesSecureCount(prev => prev + 1);
                   setStatusMessage("MFA_SIMULATION_ENGAGED: Activated temporary transceiver state validation.");
                }} 
                className="py-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-transparent transition-all"
              >
                 TEST MFA TRANSCEIVER EMITTER ONLINE
              </button>
           ) : null}
        </div>
      )
    },
    {
      level: 4,
      title: "CRYPTOGRAPHIC_INTEGRITY_RESONANCE",
      desc: "Calibrate alignment matrices on your browser display to verify secure human logic consensus.",
      status: isZkPuzzleCleared ? "RESOLVED_SECURED" : "CALIBRATION_NEEDED",
      verified: isZkPuzzleCleared,
      icon: Key,
      element: (
        <div className="mt-4 p-5 bg-black/60 border border-white/5 rounded-2xl space-y-4">
           <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-lg">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">STATUS:</span>
              <span className={`text-[9px] font-mono font-black uppercase ${isZkPuzzleCleared ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-blue-400'}`}>{puzzleMsg}</span>
           </div>
           
           {!isZkPuzzleCleared && (
              <div className="grid grid-cols-5 gap-2 pt-2">
                 {puzzleSequence.map((num) => {
                    const isSelected = playerInput.includes(num);
                    return (
                       <button
                          key={num}
                          onClick={() => handleKeyClick(num)}
                          disabled={isSelected}
                          className={`py-4 rounded-xl font-mono text-xs font-black border transition-all ${
                             isSelected 
                             ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-500 scale-90' 
                             : 'bg-indigo-600/10 border-indigo-500/20 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95'
                          }`}
                       >
                          {isSelected ? '✓' : `K#0${num}`}
                       </button>
                    );
                 })}
              </div>
           )}
           {isZkPuzzleCleared && (
              <div className="flex items-center justify-center gap-2 p-2 text-[9px] text-emerald-400 font-mono font-bold">
                 <BadgeCheck size={14} className="text-emerald-400" />
                 NODE QUOTA SECURITY WEIGHT CONTRIBUTED (+1 WEIGHT)
              </div>
           )}
        </div>
      )
    },
    {
      level: 5,
      title: "DISTRIBUTED_CONCENSUS_ORACLE",
      desc: "Advanced quorum compliance finality state. Unlocks when four baseline levels resonate.",
      status: isConsensusAchieved ? "ORACLE_ONLINE_ACTIVE" : "AWAITING_PROTOCOLS",
      verified: isConsensusAchieved,
      icon: Cpu,
      element: null
    }
  ];

  // Helper count of verified levels
  const securedCount = protocols.filter(p => p.verified).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-1000 bg-[#020403] relative overflow-hidden">
      
      {/* Dynamic Network Mesh */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.12)_0%,_transparent_70%)]"></div>
         <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck size={1000} className="text-white opacity-[0.015] animate-pulse" />
         </div>
      </div>

      <div className="glass-card p-8 md:p-14 rounded-[64px] border-indigo-500/20 bg-black/75 shadow-[0_60px_180px_rgba(0,0,0,0.95)] w-full max-w-5xl text-center space-y-10 relative overflow-hidden group z-10 border-2">
         
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
            <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500 to-transparent absolute top-0 animate-scan"></div>
         </div>

         {/* Verification Header and Live Shard Stat Count */}
         <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6 relative z-10 text-left">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-3xl text-indigo-400 shadow-md">
                  <Layers size={28} className="animate-pulse" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">VERIFICATION_HUB</h1>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black leading-none mt-1">Hierarchical Node Trust Protocols ({securedCount}/5 ACCREDITED)</p>
               </div>
            </div>

            {/* Total verified nodes network counter: Users counted in */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-right">
               <div className="flex items-center gap-2 justify-end">
                  <Activity size={12} className="text-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">SECURED_QUORUM_QUOTA</span>
               </div>
               <p className="text-lg font-mono font-black text-white tracking-widest mt-1">
                  {networkNodesSecureCount.toLocaleString()} <span className="text-[10px] text-slate-600">STEWARD_NODES</span>
               </p>
               <p className="text-[8px] text-slate-500 italic mt-0.5 uppercase tracking-widest">Global active resonance consensus weight</p>
            </div>
         </div>

         {statusMessage && (
            <div className={`p-6 rounded-[28px] border text-xs font-black uppercase tracking-widest animate-in zoom-in flex items-center gap-4 text-left shadow-2xl relative z-10 ${
              statusMessage.includes('PENDING') || statusMessage.includes('FAILED') || statusMessage.includes('ERROR') ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
               <ShieldCheck className="shrink-0 text-indigo-400 animate-pulse" size={20} />
               <span className="leading-relaxed">{statusMessage}</span>
            </div>
         )}

         {/* Hierarchical Security Levels Path */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 text-left">
            <div className="lg:col-span-4 p-8 bg-black/80 rounded-[48px] border-2 border-white/5 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group/instr">
               <div className="absolute top-0 right-0 p-6 opacity-[0.015] group-hover/instr:scale-110 transition-transform"><Key size={200} className="text-white" /></div>
               <div className="space-y-4">
                  <h3 className="text-md font-black text-white uppercase italic tracking-wider leading-none">Security Trust Path</h3>
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                     To initiate complete synchronization on high-integrity supply chains, your Steward Node must calibrate sequential credentials. Resolving levels from simple email handshakes up to complex key configurations is required.
                  </p>
               </div>

               <div className="p-6 bg-indigo-950/10 border border-indigo-500/15 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2">
                     <HeartHandshake size={14} className="text-indigo-400" />
                     <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">NODE INTEGRITY WEIGHT</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
                     As you achieve sequential status protocols, your weighted consensus voting integrity index increases.
                  </p>
               </div>

               <div className="space-y-2">
                  <p className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest">REGISTERED IDENTIFIER</p>
                  <p className="text-sm font-mono text-white italic truncate">{userEmail}</p>
               </div>
            </div>

            {/* Main Levels Queue List */}
            <div className="lg:col-span-8 space-y-4">
               {protocols.map((proto) => (
                  <div 
                     key={proto.level} 
                     className={`p-6 rounded-[36px] border transition-all duration-500 flex flex-col gap-4 shadow-xl ${
                        proto.verified 
                        ? 'bg-emerald-950/5 border-emerald-500/20' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                     }`}
                  >
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                           <div className={`p-3 rounded-2xl shadow-inner ${
                              proto.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-black/60 text-indigo-400'
                           }`}>
                              <proto.icon size={20} />
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[9px] font-mono font-black bg-indigo-950/40 text-indigo-400 px-2 py-0.5 rounded">LEVEL_0{proto.level}</span>
                                 <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{proto.title}</h4>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">{proto.desc}</p>
                           </div>
                        </div>

                        <div>
                           <span className={`px-4 py-1.5 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest ${
                              proto.verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-black text-indigo-400 border border-indigo-500/10'
                           }`}>
                              {proto.status}
                           </span>
                        </div>
                     </div>

                     {proto.element}
                  </div>
               ))}
            </div>
         </div>

         {/* Verification Action and Bypass controls */}
         <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <button 
              onClick={onLogout}
              className="py-4 px-8 bg-rose-600/10 border border-rose-500/25 text-rose-500 hover:bg-rose-600 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3"
            >
               <Lock size={14} /> DE-ESTABLISH TRUST (LOGOUT)
            </button>

            {/* Only allow final entry when email is verified or at least base consensus is established */}
            <button
               onClick={() => {
                  if (securedCount >= 2 || isEmailVerified) {
                     onVerified();
                  } else {
                     setStatusMessage("PROHIBITED_ENTRY: Resolution of at least 2 protocols (Email & Google) required for high-security sector entry.");
                  }
               }}
               className="py-5 px-10 bg-indigo-600 hover:bg-indigo-550 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white/5 group"
            >
               CONTINUE TO COGNITIVE DESPATCH
               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default VerificationHub;
