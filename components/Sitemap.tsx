import React from 'react';
/* Added BadgeCheck to lucide-react imports to fix error on line 122 */
import { 
  Network, 
  Map as MapIcon, 
  ChevronRight, 
  ArrowRight,
  Database,
  Activity,
  Layers,
  Box,
  Fingerprint,
  Cpu,
  Workflow,
  SearchCode,
  Target,
  BoxSelect,
  BadgeCheck
} from 'lucide-react';
import { ViewState } from '../types';
import { RegistryGroup } from '../App';

interface SitemapProps {
  nodes: RegistryGroup[];
  onNavigate: (view: ViewState, section?: string) => void;
}

const Sitemap: React.FC<SitemapProps> = ({ nodes, onNavigate }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-[1600px] mx-auto px-4">
      {/* Immersive Registry Header */}
      <div className="glass-card p-12 md:p-20 rounded-[80px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-3xl group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
            <Network size={800} className="text-white" />
         </div>
         <div className="w-32 h-32 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.3)] border-4 border-white/10 relative z-10 overflow-hidden animate-float">
            <MapIcon size={56} className="text-white" />
         </div>
         <div className="space-y-6 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">REGISTRY <span className="text-emerald-400">MATRIX</span></h2>
            <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl mx-auto">
               "Navigating the multi-thrust architecture of EnvirosAgro. Every shard, protocol, and node addressable at the atomic level."
            </p>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-10 pt-12 border-t border-white/5">
            {[
              { l: 'Total Shards', v: '42', i: Database },
              { l: 'Deep Protocols', v: '124', i: Workflow },
              { l: 'Auth Method', v: 'ZK_SNARK', i: Fingerprint },
              { l: 'Resonance', v: '1.42x', i: Activity }
            ].map((s, idx) => (
              <div key={idx} className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex flex-col items-center gap-2">
                 <s.i size={18} className="text-emerald-500" />
                 <p className="text-xl font-mono font-black text-white">{s.v}</p>
                 <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Registry Groups Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {nodes.map((group, i) => (
          <div key={i} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/60 space-y-10 shadow-2xl relative group/card overflow-hidden h-fit transition-all duration-500 hover:border-emerald-500/20">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover/card:scale-125 transition-transform duration-[10s]"><SearchCode size={250} /></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="space-y-1">
                  <h3 className="text-lg font-black text-emerald-400 uppercase tracking-[0.4em] leading-none">{group.category}</h3>
                  <p className="text-[10px] text-slate-700 font-mono font-black uppercase">CLUSTER_0{i+1}</p>
               </div>
               <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-xl"><Layers size={20}/></div>
            </div>

            <div className="grid gap-10">
               {group.items.map(item => (
                  <div key={item.id} className="space-y-6">
                    {/* Primary Node Link */}
                    <button 
                      onClick={() => onNavigate(item.id as ViewState)}
                      className="w-full flex items-center justify-between p-6 bg-white/[0.02] hover:bg-emerald-600/10 border border-white/5 hover:border-emerald-500/30 rounded-[40px] transition-all group/node text-left shadow-inner"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/node:bg-emerald-600 group-hover/node:text-white transition-all shadow-xl">
                             <item.icon size={24} className="text-slate-500 group-hover/node:text-white" />
                          </div>
                          <div className="space-y-2">
                             <p className="text-xl font-black text-slate-200 uppercase italic leading-none group-hover/node:text-emerald-400 transition-colors m-0">{item.name}</p>
                             <p className="text-[10px] text-slate-700 font-mono font-bold uppercase tracking-widest mt-1">#/{item.id}</p>
                          </div>
                       </div>
                       <ArrowRight size={20} className="text-slate-800 opacity-0 group-hover/node:opacity-100 group-hover/node:translate-x-1 transition-all" />
                    </button>

                    {/* Nested Section Shards */}
                    {item.sections && item.sections.length > 0 && (
                      <div className="pl-8 flex flex-wrap gap-3 animate-in fade-in duration-1000">
                        {item.sections.map(section => (
                          <button
                            key={section.id}
                            onClick={() => onNavigate(item.id as ViewState, section.id)}
                            className="px-5 py-2.5 bg-black/60 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/40 rounded-full text-[10px] font-black uppercase text-slate-500 hover:text-indigo-400 transition-all flex items-center gap-3 group/sec relative"
                            title={section.desc}
                          >
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover/sec:bg-indigo-500 transition-colors shadow-[0_0_5px_currentColor]"></div>
                             {section.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
               ))}
            </div>
          </div>
        ))}
      </div>

      {/* Finality Protocol Matrix Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-indigo-500/30 bg-indigo-950/5 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-[15s]"><Workflow size={1000} className="text-indigo-400" /></div>
         <div className="flex items-center gap-12 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-32 h-32 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.4)] border-4 border-white/10 shrink-0 animate-pulse">
               <BadgeCheck size={48} className="text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic m-0 leading-none">REGISTRY FINALITY <span className="text-indigo-400">INDEX</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                 "Direct addressing of industrial shards ensures zero latency in the agricultural decision-support cycle."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right shrink-0 px-12 relative z-10 border-l-2 border-white/5 hidden lg:block">
            <p className="text-[12px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">AGGREGATE_SHARDS</p>
            <p className="text-[140px] font-mono font-black text-white tracking-tighter leading-none m-0">
              {nodes.reduce((acc, g) => acc + g.items.reduce((acc2, i) => acc2 + 1 + (i.sections?.length || 0), 0), 0)}
            </p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Sitemap;