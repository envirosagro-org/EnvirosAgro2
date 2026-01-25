
import React, { useState } from 'react';
import { 
  Scale, ShieldCheck, Landmark, BookOpen, ScrollText, 
  Binary, Target, Zap, Heart, Leaf, Users, Bot, 
  Database, Info, ChevronRight, Lock, Stamp, 
  Gavel, HelpCircle, History, Sparkles, Binary as BinaryIcon,
  // Added missing Fingerprint icon import
  Fingerprint
} from 'lucide-react';
import { User } from '../types';

interface CodeOfLawsProps {
  user: User;
}

const LAWS = [
  {
    id: 1,
    thrust: 'Societal',
    title: 'The Githaka-Commons Mandate',
    precedent: 'Kenya Constitution Art. 60, Magna Carta, Kikuyu Mbari System',
    statute: "Every distinct land unit within the EnvirosAgro ecosystem shall be designated a 'Modern Githaka'. While title may be private, the usufruct (right to use) must serve the community. 'Fencing off' resources needed for survival (water, medicinal herbs) is prohibited.",
    icon: Users,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10'
  },
  {
    id: 2,
    thrust: 'Societal',
    title: 'The Widow & Orphan Clause',
    precedent: 'Leviticus 19:9, Quran, Kikuyu Migunda Rights',
    statute: "10% of all juizzyCookiez production inputs must be sourced from small-holder women farmers or community cooperatives, ensuring the 'Gleaning Right' is modernized into a 'Supply Chain Right'.",
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10'
  },
  {
    id: 3,
    thrust: 'Environmental',
    title: 'The Sabbath-Yajna Protocol',
    precedent: 'Bible (Shemitah), Vedas (Krishi Sukta), Quran (Khalifa)',
    statute: "For every 6 cycles of intensive production (high In), there must be 1 cycle of 'Regenerative Fallow' where In = 0 but Ca is maintained. During this cycle, only Agro Musika sensors may 'harvest' bio-data.",
    icon: Leaf,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 4,
    thrust: 'Environmental',
    title: 'The Mugumo Conservation Order',
    precedent: 'Kikuyu Customary Law, Quran 7:56 (Khalifa Stewardship)',
    statute: "In every acre of EnvirosAgro land, a 'Sacred Node' must be designated. This node is exempt from all machinery and chemicals. It serves as the baseline for the equation's S (Stress) variable—if the Node degrades, the Sm metric is void.",
    icon: Target,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10'
  },
  {
    id: 5,
    thrust: 'Human',
    title: 'The Bio-Signal Harmony Act',
    precedent: 'Vedic Ayurveda, Medicag Informatics, Kikuyu Anthropology',
    statute: "All produce branding must pass the 'Vibrational Test' via Agro Musika. Plants grown under high stress (S) generate 'dissonant' bio-signals and cannot be sold as premium grade. The food must 'sing' in harmony.",
    icon: Sparkles,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  },
  {
    id: 6,
    thrust: 'Technological',
    title: 'The Ploughshare Mandate',
    precedent: 'Isaiah 2:4 (Bible), Agroboto Prohibitions',
    statute: "The Agroboto division is prohibited from developing dual-use technologies that can be weaponized. Robotics must be 'servants of the Githaka,' designed to reduce the physical burden (S) on the human worker, not to replace them.",
    icon: Bot,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    id: 7,
    thrust: 'Informational',
    title: 'The Open Ledger Covenant',
    precedent: 'Quran 17:35, Kenya Constitution Art. 35, Tokenz Protocol',
    statute: "All data flowing through the Tokenz financial ecosystem must be immutable. The 'Equation of State' (Sm) for every harvest must be published via AgroInPDF. Concealing a high Stress factor (S) to inflate value is a violation.",
    icon: Database,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  }
];

const CodeOfLaws: React.FC<CodeOfLawsProps> = ({ user }) => {
  const [selectedThrust, setSelectedThrust] = useState<string | 'All'>('All');

  const filteredLaws = selectedThrust === 'All' ? LAWS : LAWS.filter(l => l.thrust === selectedThrust);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4 md:px-0">
      
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
            <Scale className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent animate-pulse"></div>
            <Gavel className="w-20 h-20 text-white relative z-10" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">SUPREME_REGISTRY_STATUTES</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Code of <span className="text-emerald-400">Laws</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
               "Synthesizing ancient wisdom with industrial calculus. The statutes governing the EnvirosAgro network are immutable and bound to the Equation of State."
            </p>
         </div>
      </div>

      {/* The Supreme Governing Equation - Sm = sqrt((Dn * In * Ca) / S) */}
      <div className="max-w-4xl mx-auto w-full">
         <div className="glass-card p-14 rounded-[64px] border-emerald-500/30 bg-black/40 flex flex-col items-center space-y-12 shadow-3xl relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
            <div className="space-y-4 relative z-10">
               <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.8em] italic">Foundational Equation of State</h4>
               <div className="flex flex-col items-center justify-center gap-10">
                  <div className="flex items-center gap-10">
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] text-emerald-500 font-mono font-black mb-2">Metric</span>
                        <p className="text-6xl font-mono font-black text-white tracking-tighter">S<sub className="text-3xl">m</sub></p>
                     </div>
                     <div className="text-5xl font-light text-slate-700">=</div>
                     <div className="relative pt-6">
                        <div className="text-7xl font-thin text-emerald-400 absolute -left-8 -top-2">√</div>
                        <div className="border-t-2 border-emerald-400 pt-4 flex flex-col items-center gap-2">
                           <div className="flex items-center gap-4 text-3xl font-mono font-black text-white tracking-widest">
                              <span className="hover:text-blue-400 transition-colors" title="Density (Kenya Const. Art 60)">D<sub className="text-sm">n</sub></span>
                              <span className="text-slate-700">·</span>
                              <span className="hover:text-amber-500 transition-colors" title="Intensity (Vedic Yield)">I<sub className="text-sm">n</sub></span>
                              <span className="text-slate-700">·</span>
                              <span className="hover:text-emerald-400 transition-colors" title="Agro Code (Biblical Stewardship)">C(a)</span>
                           </div>
                           <div className="w-full h-0.5 bg-slate-800"></div>
                           <div className="text-3xl font-mono font-black text-rose-500 hover:text-rose-400 transition-colors" title="Environmental Stress (Minimized)">
                              S
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-2xl relative z-10 border-t border-white/5 pt-10">
               {[
                  { label: 'Density (Dn)', val: user.metrics.agriculturalCodeU.toFixed(1), color: 'text-blue-400' },
                  { label: 'Intensity (In)', val: (user.metrics.timeConstantTau / 2).toFixed(1), color: 'text-amber-500' },
                  { label: 'Agro Code (Ca)', val: user.metrics.agriculturalCodeU.toFixed(1), color: 'text-emerald-400' },
                  { label: 'Stress (S)', val: (user.metrics.viralLoadSID / 10).toFixed(1), color: 'text-rose-500' },
               ].map((item, i) => (
                  <div key={i} className="space-y-1">
                     <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none">{item.label}</p>
                     <p className={`text-2xl font-mono font-black ${item.color}`}>{item.val}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto border border-white/5 bg-black/40 shadow-xl px-4">
        {['All', 'Societal', 'Environmental', 'Human', 'Technological', 'Industry'].map(thrust => (
          <button 
            key={thrust} 
            onClick={() => setSelectedThrust(thrust)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedThrust === thrust ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            {thrust} Shards
          </button>
        ))}
      </div>

      {/* Laws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         {filteredLaws.map(law => (
            <div key={law.id} className="p-12 glass-card rounded-[56px] border-2 border-white/5 bg-black/40 flex flex-col group hover:border-emerald-500/30 transition-all shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><law.icon size={250} /></div>
               
               <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className={`p-5 rounded-3xl ${law.bg} border border-white/5 shadow-2xl group-hover:rotate-6 transition-transform`}>
                     <law.icon className={`w-10 h-10 ${law.color}`} />
                  </div>
                  <div className="text-right space-y-2">
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest bg-white/5 border-white/10 text-slate-500`}>Thrust {law.id}: {law.thrust}</span>
                     <p className="text-[10px] font-mono text-slate-700 font-bold uppercase tracking-tighter">STATUTE_ANCHOR_0x{law.id}A8</p>
                  </div>
               </div>

               <div className="flex-1 space-y-8 relative z-10">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight m-0">{law.title}</h3>
                  <div className="p-8 bg-black/60 rounded-[44px] border border-white/10 shadow-inner">
                     <p className="text-slate-300 text-lg md:text-xl leading-loose italic font-medium border-l-4 border-emerald-500/40 pl-8">
                        "{law.statute}"
                     </p>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-6 relative z-10">
                  <div className="space-y-4">
                     <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] italic flex items-center gap-2">
                        <History size={12} className="text-emerald-500" /> Cross-Registry Precedents
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {law.precedent.split(', ').map(p => (
                           <span key={p} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-slate-500 uppercase border border-white/10">{p}</span>
                        ))}
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <BookOpen size={14} /> View Case Law Shard
                     </button>
                     <button className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-500 active:scale-90 transition-all">
                        <Stamp size={20} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Global Sovereignty Footer */}
      <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <ShieldCheck className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse ring-[15px] ring-white/5 shrink-0">
               <Fingerprint className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">The Open Ledger Covenant</h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-md:text-sm max-w-lg mx-auto md:mx-0">Every registry action is anchored to the 7 Statutes of SEHTI. Transgressions against the equation Sm result in immediate node multiplier slashing.</p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">TOTAL_SYNC_TASKS</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter">1,426</p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CodeOfLaws;
