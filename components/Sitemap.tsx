
import React from 'react';
import { 
  Network, 
  Map as MapIcon, 
  ChevronRight, 
  ExternalLink, 
  Activity, 
  Database,
  ArrowRight
} from 'lucide-react';
import { ViewState } from '../types';

interface SitemapProps {
  nodes: {
    category: string;
    items: { id: string; name: string; icon: any }[];
  }[];
  onNavigate: (view: ViewState) => void;
}

const Sitemap: React.FC<SitemapProps> = ({ nodes, onNavigate }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1500px] mx-auto px-4">
      <div className="glass-card p-10 md:p-12 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-6 shadow-2xl group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
            <Network size={400} className="text-white" />
         </div>
         <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-xl border-4 border-white/10 relative z-10 overflow-hidden">
            <MapIcon size={40} className="text-white animate-pulse" />
         </div>
         <div className="space-y-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">Ecosystem <span className="text-emerald-400">Sitemap</span></h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
               "Hierarchical directory of network registry shards."
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {nodes.map((group, i) => (
          <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 space-y-6 shadow-xl relative group/card overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/card:scale-110 transition-transform"><Database size={100} /></div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">{group.category}</h3>
               <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20"><ChevronRight size={12}/></div>
            </div>
            <div className="grid gap-2">
               {group.items.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => onNavigate(item.id as ViewState)}
                    className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-emerald-600/10 border border-white/5 hover:border-emerald-500/30 rounded-[24px] transition-all group/node text-left shadow-inner"
                  >
                     <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white/5 rounded-xl group-hover/node:bg-emerald-600 group-hover/node:text-white transition-all">
                           <item.icon size={16} className="text-slate-500 group-hover/node:text-white" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-black text-slate-200 uppercase italic leading-none">{item.name}</p>
                           <p className="text-[8px] text-slate-700 font-mono font-bold uppercase tracking-widest mt-1">#/{item.id}</p>
                        </div>
                     </div>
                     <ArrowRight size={14} className="text-slate-800 opacity-0 group-hover/node:opacity-100 group-hover/node:translate-x-1 transition-all" />
                  </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-12 glass-card rounded-[56px] border-indigo-500/20 bg-indigo-950/10 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-xl border-4 border-white/10 shrink-0">
               <Activity size={28} className="text-white animate-pulse" />
            </div>
            <div className="space-y-2">
               <h4 className="text-2xl font-black text-white uppercase italic m-0 leading-none">Integrated Network Finality</h4>
               <p className="text-slate-400 text-base italic">Every shard is fully addressable via direct logical paths.</p>
            </div>
         </div>
         <div className="text-right shrink-0 px-8 relative z-10 border-l border-white/10 hidden md:block">
            <p className="text-[10px] text-slate-600 font-black uppercase mb-2 tracking-[0.5em]">TOTAL_NODES</p>
            <p className="text-6xl font-mono font-black text-white">{nodes.reduce((acc, g) => acc + g.items.length, 0)}</p>
         </div>
      </div>
    </div>
  );
};

export default Sitemap;
