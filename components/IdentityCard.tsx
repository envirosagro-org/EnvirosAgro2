import React from 'react';
import { ShieldCheck, Leaf, Globe, Calendar, Fingerprint, Layers, QrCode, Wifi, Activity, Info, Lock, MapPin, BadgeCheck, Stamp } from 'lucide-react';
import { User } from '../types';

interface IdentityCardProps {
  user: User;
  isPrintMode?: boolean;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ user, isPrintMode = false }) => {
  // Generate a QR code containing core identity metadata for registry verification
  const qrData = JSON.stringify({
    esin: user.esin,
    name: user.name,
    role: user.role,
    loc: user.location,
    ver: "EOS-6.5",
    reg: user.regDate
  });
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=050706&color=10b981`;

  // Standard CR80 dimensions in pixels for a professional look (85.6mm x 53.98mm)
  return (
    <div className={`flex flex-col gap-8 w-full max-w-lg mx-auto ${isPrintMode ? 'print:gap-0' : ''}`}>
      {/* FRONT OF CARD */}
      <div className={`relative w-full aspect-[1.586/1] group transition-all duration-700 perspective-1000 ${isPrintMode ? 'print-card shadow-none border-black' : 'shadow-3xl'}`}>
        <div className="absolute inset-0 rounded-[24px] border border-white/20 bg-[#050706] overflow-hidden shadow-2xl">
          
          {/* Security Background Pattern */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20"></div>
          </div>

          {/* Holographic Strip */}
          <div className="absolute top-0 right-12 bottom-0 w-16 bg-gradient-to-b from-transparent via-white/5 to-transparent skew-x-12 animate-hologram pointer-events-none"></div>

          {/* Header Section */}
          <div className="p-6 flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 agro-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <Leaf className="text-white w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none italic">Enviros<span className="text-emerald-400">Agro™</span></h3>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Industrial Identity Shard</p>
               </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Authenticated</span>
               </div>
               <p className="text-[6px] text-slate-700 font-mono font-black uppercase tracking-widest mt-1">Registry_Sync: v6.5</p>
            </div>
          </div>

          {/* Main Info Area */}
          <div className="px-8 flex gap-8 relative z-10 mt-2">
            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                 <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Steward Designation</p>
                 <h4 className="text-2xl font-black text-white truncate drop-shadow-md tracking-tight uppercase italic">{user.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Primary Thrust</p>
                    <p className="text-[11px] text-slate-200 font-bold uppercase truncate tracking-tight flex items-center gap-1.5 mt-1">
                       <Activity className="w-3 h-3 text-blue-400" /> {user.role}
                    </p>
                 </div>
                 <div>
                    <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Regional Node</p>
                    <p className="text-[11px] text-slate-200 font-bold uppercase truncate tracking-tight flex items-center gap-1.5 mt-1">
                       <MapPin className="w-3 h-3 text-emerald-500" /> {user.location.split(',')[0]}
                    </p>
                 </div>
              </div>

              <div className="pt-2 flex items-center gap-6">
                 <div className="space-y-0.5">
                    <p className="text-[6px] text-slate-700 font-black uppercase tracking-widest">m™ Resilience</p>
                    <p className="text-xs font-mono font-black text-blue-400">x{user.wallet.exchangeRate.toFixed(2)}</p>
                 </div>
                 <div className="w-px h-6 bg-white/5"></div>
                 <div className="space-y-0.5">
                    <p className="text-[6px] text-slate-700 font-black uppercase tracking-widest">C(a)™ Growth</p>
                    <p className="text-xs font-mono font-black text-emerald-400">+{user.metrics.agriculturalCodeU.toFixed(2)}</p>
                 </div>
              </div>
            </div>

            {/* Photo & QR Section */}
            <div className="w-36 flex flex-col items-center gap-4 shrink-0 -mt-2">
               <div className="w-full aspect-square rounded-2xl bg-black border-2 border-emerald-500/20 p-2 relative overflow-hidden group/qr shadow-2xl flex items-center justify-center">
                  <img src={qrUrl} alt="Identity QR" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none"></div>
                  <div className="absolute bottom-1 right-1 opacity-20"><QrCode size={10} className="text-white" /></div>
               </div>
               <div className="w-full flex gap-2">
                  <div className="flex-1 p-2 bg-black/60 rounded-xl border border-white/5 flex items-center justify-center shadow-inner">
                     <Fingerprint className="w-4 h-4 text-emerald-500/30 animate-pulse" />
                  </div>
                  <div className="flex-1 p-2 bg-black/60 rounded-xl border border-white/5 flex items-center justify-center shadow-inner">
                     <BadgeCheck className="w-4 h-4 text-blue-500/30" />
                  </div>
               </div>
            </div>
          </div>

          {/* Footer ID Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent flex items-end justify-between z-10">
             <div className="space-y-1">
                <p className="text-[7px] text-slate-700 font-black uppercase tracking-[0.2em]">EnvirosAgro Social Identification (ESIN)</p>
                <p className="text-xl font-mono font-black text-white tracking-[0.1em] leading-none">{user.esin}</p>
             </div>
             <div className="text-right">
                <p className="text-[7px] text-slate-800 font-black uppercase tracking-widest mb-1">Issue Shard</p>
                <p className="text-[10px] font-mono text-slate-500 font-bold">{user.regDate.replace(/\//g, '.')}</p>
             </div>
          </div>
        </div>
      </div>

      {/* BACK OF CARD (Visible in print or as second block) */}
      <div className={`relative w-full aspect-[1.586/1] group transition-all duration-700 ${isPrintMode ? 'print-card mt-8' : 'shadow-3xl'}`}>
        <div className="absolute inset-0 rounded-[24px] border border-white/20 bg-[#050706] overflow-hidden shadow-2xl flex flex-col p-8">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Info size={16} className="text-blue-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Legal Shard Mandate</h4>
              </div>
              <p className="text-[8px] leading-relaxed text-slate-500 italic uppercase font-medium">
                This document serves as the official identity anchor for the EnvirosAgro network. The holder is a verified steward of the Githaka Registry. Any modification to the ESIN signature or digital biometrics encoded in the QR shard constitutes a violation of the SEHTI Truth Protocol and will result in immediate node multiplier slashing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                 <p className="text-[7px] text-slate-700 font-black uppercase tracking-widest">Authorized Signature</p>
                 <div className="border-b border-white/20 pb-1 h-12 flex items-end">
                    <p className="text-sm font-serif italic text-slate-400 opacity-50">Industrial Registrar</p>
                 </div>
              </div>
              <div className="space-y-4 text-right">
                 <p className="text-[7px] text-slate-700 font-black uppercase tracking-widest">Steward Vouch Seal</p>
                 <div className="flex justify-end opacity-20">
                    <Stamp size={48} className="text-emerald-500" />
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
              <p className="text-[7px] text-slate-800 font-black uppercase tracking-[0.4em]">WWW.ENVIROSAGRO.ORG // HQ_NODE: 9X6C+P6</p>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
                 <div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hologram {
          0% { background-position: 0% 50%; opacity: 0; }
          50% { background-position: 100% 50%; opacity: 0.15; }
          100% { background-position: 0% 50%; opacity: 0; }
        }
        .animate-hologram {
          background-size: 200% 200%;
          animation: hologram 10s ease infinite;
        }
        @media print {
          body { background: white !important; }
          .print-card {
            width: 85.6mm;
            height: 53.98mm;
            margin: 0 auto;
            border: 1px solid #000;
            background: #fff;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print-card * { color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default IdentityCard;