
import React from 'react';
import { ShieldCheck, Leaf, Globe, Calendar, Fingerprint, Layers, QrCode, Wifi, Activity } from 'lucide-react';
import { User } from '../types';

interface IdentityCardProps {
  user: User;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ user }) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] group transition-all duration-500">
      {/* Outer Card Glass Container */}
      <div className="absolute inset-0 glass-card rounded-[32px] border border-white/20 shadow-2xl overflow-hidden backdrop-blur-3xl bg-gradient-to-br from-white/10 to-transparent">
        
        {/* Holographic Texture Overlays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-transparent to-blue-500 animate-hologram opacity-30"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
        </div>

        {/* Micro-chip visual detail */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-16 border border-white/10 rounded-lg bg-white/5 opacity-10 flex flex-col items-center justify-center gap-1 pointer-events-none">
           <div className="w-8 h-1 bg-white/20 rounded"></div>
           <div className="w-8 h-1 bg-white/20 rounded"></div>
           <div className="w-8 h-1 bg-white/20 rounded"></div>
           <div className="w-8 h-1 bg-white/20 rounded"></div>
        </div>

        {/* Card Header Section */}
        <div className="p-6 pb-2 flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 agro-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Leaf className="text-white w-6 h-6" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.1em] leading-none">EnvirosAgro™</h3>
                <p className="text-[7px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-1">Registry Steward Shard</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="text-right mr-2 hidden sm:block">
                <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Status</p>
                <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Authorized</p>
             </div>
             <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
             </div>
          </div>
        </div>

        {/* Primary Content Grid */}
        <div className="px-6 flex gap-6 relative z-10 mt-2">
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
               <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest">Identity Anchor</p>
               <h4 className="text-lg font-bold text-white truncate drop-shadow-sm">{user.name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div>
                  <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest">Thrust Role</p>
                  <p className="text-[9px] text-slate-200 font-bold uppercase truncate tracking-tight">{user.role}</p>
               </div>
               <div>
                  <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest">Regional Node</p>
                  <p className="text-[9px] text-slate-200 font-bold uppercase truncate tracking-tight">{user.location}</p>
               </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[6px] text-slate-500 font-black uppercase tracking-widest">m™: {user.metrics.timeConstantTau.toFixed(2)}</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[6px] text-slate-500 font-black uppercase tracking-widest">C(a)™: {user.metrics.agriculturalCodeU.toFixed(2)}</span>
               </div>
            </div>
          </div>

          {/* Biometric & QR Section */}
          <div className="w-24 flex flex-col items-center gap-3 shrink-0">
             <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 p-1.5 relative overflow-hidden group/id shadow-xl">
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/id:opacity-100 transition-opacity flex items-center justify-center z-10">
                   <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <div className="w-full h-full bg-slate-900/80 rounded-xl flex items-center justify-center text-4xl font-black text-emerald-600/80 backdrop-blur-sm">
                  {user.name[0]}
                </div>
             </div>
             <div className="w-full flex gap-1.5">
                <div className="flex-1 p-1.5 bg-black/40 rounded-lg border border-white/5 flex items-center justify-center">
                   <QrCode className="w-6 h-6 text-white opacity-40 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="flex-1 p-1.5 bg-black/40 rounded-lg border border-white/5 flex items-center justify-center">
                   <Wifi className="w-4 h-4 text-emerald-500/40 animate-pulse" />
                </div>
             </div>
          </div>
        </div>

        {/* Global Shard Identification Bar (ESIN) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between z-10 border-t border-white/5">
           <div className="space-y-1 flex-1 min-w-0">
              <p className="text-[6px] text-slate-500 font-black uppercase tracking-[0.2em]">EnvirosAgro Social Identification Number (ESIN)</p>
              <div className="flex items-center gap-3">
                 <p className="text-base sm:text-lg font-mono font-black text-white tracking-[0.05em] truncate leading-none">
                    {user.esin}
                 </p>
                 <div className="h-4 w-px bg-white/10"></div>
                 <div className="flex gap-2 text-white/30">
                    <Activity className="w-3 h-3" />
                    <Layers className="w-3 h-3" />
                 </div>
              </div>
           </div>
           <div className="text-right ml-4 shrink-0">
              <p className="text-[6px] text-slate-600 font-black uppercase tracking-widest mb-0.5">Anchored</p>
              <p className="text-[8px] font-mono text-slate-400 font-bold">{user.regDate.replace(/\//g, '.')}</p>
           </div>
        </div>
      </div>

      {/* Embedded Styles for Animations */}
      <style>{`
        @keyframes hologram {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-hologram {
          background-size: 200% 200%;
          animation: hologram 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default IdentityCard;
