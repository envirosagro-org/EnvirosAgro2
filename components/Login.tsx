
import React, { useState } from 'react';
import { User } from '../types';
import { Leaf, ShieldCheck, Key, Globe, MapPin, Loader2, Sparkles, Binary, Gift, Info } from 'lucide-react';
import { syncUserToCloud } from '../services/firebaseService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [esin, setEsin] = useState(`EA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState('Kenya');

  const finalizeRegistration = async () => {
    if (!email) return;
    setLoading(true);
    
    const generatedMnemonic = "seed plant grow harvest sun rain soil root leaf flower fruit seed";
    const gpsCoords = "1.29, 36.82";

    const newUser: User = {
      name: name || 'Anonymous Steward',
      email: email.toLowerCase(),
      esin: esin,
      mnemonic: generatedMnemonic,
      regDate: new Date().toLocaleDateString(),
      role: 'Regenerative Farmer',
      location: `${city || 'Unknown City'}, ${county || 'Unknown County'}, ${country || 'Unknown Country'} [${gpsCoords || 'Manual-Node'}]`,
      wallet: { 
        balance: 0, 
        eatBalance: 0, 
        exchangeRate: 600, 
        bonusBalance: 100, 
        tier: 'Seed', 
        lifetimeEarned: 100,
        linkedProviders: []
      },
      metrics: { 
        agriculturalCodeU: 1.2, 
        timeConstantTau: 8.5, 
        sustainabilityScore: 72,
        socialImmunity: 60,
        viralLoadSID: 35,
        baselineM: 8.5
      },
      skills: { 'General': 10 },
      isReadyForHire: false
    };

    const success = await syncUserToCloud(newUser);
    if (success) {
      onLogin(newUser);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050706] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md glass-card p-6 md:p-10 rounded-[48px] border-emerald-500/20 bg-black/40 shadow-3xl text-center space-y-6 md:space-y-8">
         <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 agro-gradient rounded-2xl flex items-center justify-center shadow-xl">
               <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Enviros<span className="text-emerald-400">Agro™</span></h1>
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-[0.25em]">Authorized Steward Inflow</p>
         </div>

         <div className="space-y-4 md:space-y-6">
            <div className="space-y-3">
               <div className="space-y-1 text-left px-1">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Alias</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Bantu Steward"
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all" 
                  />
               </div>
               <div className="space-y-1 text-left px-1">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Email Registry</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="steward@envirosagro.org"
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-3 px-1">
                  <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="bg-black/60 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none" />
                  <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} className="bg-black/60 border border-white/10 rounded-xl py-3 px-5 text-sm text-white outline-none" />
               </div>
            </div>

            <div className="space-y-3 mx-1">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ESIN Shard</span>
                   </div>
                   <span className="text-[10px] font-mono text-emerald-400 font-black">{esin}</span>
                </div>

                <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                      <Gift className="w-4 h-4 text-white" />
                   </div>
                   <div className="text-left">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Gift Shard</p>
                      <p className="text-[10px] text-slate-300 font-bold">100 EAC Credited</p>
                   </div>
                </div>
            </div>

            <button 
              onClick={finalizeRegistration}
              disabled={loading || !email}
              className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
            >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               Initialize Node
            </button>
         </div>
      </div>
    </div>
  );
};

export default Login;
