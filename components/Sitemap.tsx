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
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-8 shadow-3xl group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
            <Network size={600} className="text-white" />
         </div>
         <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-3xl border-4 border-white/10 relative z-10 overflow-hidden">
            <MapIcon size={64} className="text-white animate-pulse" />
         </div>
         <div className="space-y-4 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Ecosystem <span className="text-emerald-400">Sitemap</span></h2>
            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
               "A unified hierarchical map of all EnvirosAgro OS shards. Every node represents a functional industrial logic path within the network registry."
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {nodes.map((group, i) => (
          <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl relative group/card overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/card:scale-110 transition-transform"><Database size={150} /></div>
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
               <h3 className="text-lg font-black text-emerald-400 uppercase tracking-[0.3em]">{group.category}</h3>
               <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20"><ChevronRight size={14}/></div>
            </div>
            <div className="grid gap-3">
               {group.items.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => onNavigate(item.id as ViewState)}
                    className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-emerald-600/10 border border-white/5 hover:border-emerald-500/30 rounded-[32px] transition-all group/node text-left"
                  >
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl group-hover/node:bg-emerald-600 group-hover/node:text-white transition-all">
                           <item.icon size={18} className="text-slate-500 group-hover/node:text-white" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-black text-slate-200 uppercase italic leading-none">{item.name}</p>
                           <p className="text-[9px] text-slate-600 font-mono font-bold uppercase tracking-widest">URL: #/{item.id}</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="text-slate-700 opacity-0 group-hover/node:opacity-100 group-hover/node:translate-x-1 transition-all" />
                  </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-16 glass-card rounded-[80px] border-indigo-500/20 bg-indigo-950/10 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 shrink-0">
               <Activity size={32} className="text-white animate-pulse" />
            </div>
            <div className="space-y-3">
               <h4 className="text-3xl font-black text-white uppercase italic m-0 leading-none">Integrated Network Finality</h4>
               <p className="text-slate-400 text-lg font-medium italic">All components are fully addressable via direct URL shards. No node exists in isolation.</p>
            </div>
         </div>
         <div className="text-right shrink-0 px-8 relative z-10 border-l border-white/10">
            <p className="text-[10px] text-slate-600 font-black uppercase mb-4 tracking-[0.5em]">Active Shards</p>
            <p className="text-6xl font-mono font-black text-white">{nodes.reduce((acc, g) => acc + g.items.length, 0)}</p>
         </div>
      </div>
    </div>
  );
};

export default Sitemap;