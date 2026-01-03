
import React from 'react';
import { ShieldCheck, Leaf, Globe, Calendar, Fingerprint, Layers, QrCode } from 'lucide-react';
import { User } from '../types';

interface IdentityCardProps {
  user: User;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ user }) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] group transition-all duration-500">
      {/* Outer Card Glass */}
      <div className="absolute inset-0 glass-card rounded-3xl border border-white/20 shadow-2xl overflow-hidden backdrop-blur-3xl bg-gradient-to-br from-white/10 to-transparent">
        
        {/* Holographic Overlays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-transparent to-blue-500 animate-hologram"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        {/* Card Header */}
        <div className="p-6 flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 agro-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="text-white w-6 h-6" />
             </div>
             <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-none">EnvirosAgro</h3>
                <p className="text-[8px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-1">Registry steward ID</p>
             </div>
          </div>
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 flex gap-6 relative z-10">
          <div className="space-y-6 flex-1">
            <div className="space-y-1">
               <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Full Name</p>
               <h4 className="text-xl font-bold text-white truncate">{user.name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Thrust Role</p>
                  <p className="text-[10px] text-slate-300 font-bold truncate">{user.role}</p>
               </div>
               <div>
                  <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Base Node</p>
                  <p className="text-[10px] text-slate-300 font-bold truncate">{user.location}</p>
               </div>
            </div>
          </div>

          <div className="w-24 flex flex-col items-center gap-4">
             <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 p-2 relative overflow-hidden group/id">
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/id:opacity-100 transition-opacity flex items-center justify-center">
                   <Fingerprint className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>
                <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center text-3xl font-black text-emerald-600">
                  {user.name[0]}
                </div>
             </div>
             <div className="w-full p-2 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white opacity-40" />
             </div>
          </div>
        </div>

        {/* ESIN Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-2 bg-gradient-to-t from-black/40 to-transparent relative z-10">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">ESIN (Social Identification Number)</p>
                 <p className="text-lg font-mono font-black text-white tracking-[0.1em]">{user.esin}</p>
              </div>
              <div className="flex gap-3 text-white/40">
                 <Globe className="w-3 h-3" />
                 <Layers className="w-3 h-3" />
                 <Calendar className="w-3 h-3" />
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes hologram {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-hologram {
          background-size: 200% 200%;
          animation: hologram 10s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default IdentityCard;
