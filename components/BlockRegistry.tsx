import React from 'react';
import { Box, CheckCircle2, Clock, User as UserIcon } from 'lucide-react';
import { AgroBlock } from '../types';
import { Virtuoso } from 'react-virtuoso';
import { Maximize2 } from 'lucide-react';

interface BlockRegistryProps {
  blocks: AgroBlock[];
  searchTerm: string;
}

export const BlockRegistry: React.FC<BlockRegistryProps> = ({ blocks, searchTerm }) => {
  const filteredBlocks = blocks.filter(b => 
    b.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.validator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[600px]">
      <Virtuoso
        style={{ height: '100%' }}
        data={filteredBlocks}
        itemContent={(index, block) => (
          <div className="p-4" key={block.hash}>
            <div className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden bg-black/40 shadow-3xl active:scale-[0.99] duration-300 animate-in slide-in-from-top-4">
              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-all"></div>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                <div className="flex items-center gap-10 w-full lg:w-auto">
                  <div className="w-24 h-24 rounded-[36px] bg-slate-800 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all shadow-2xl relative">
                    <Box className="w-12 h-12 text-emerald-400 group-hover:animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-6">
                      <span className="text-white font-mono text-3xl font-black tracking-tighter">{block.hash.substring(0, 16)}...</span>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">FINALIZED</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-8 text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">
                      <span className="flex items-center gap-3"><Clock className="w-4 h-4 text-emerald-500" /> {new Date(block.timestamp).toLocaleTimeString()}</span>
                      <span className="flex items-center gap-3"><UserIcon className="w-4 h-4 text-blue-400" /> {block.validator}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-12 border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-12">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-600 font-black uppercase">Shard Mass</p>
                    <p className="text-3xl font-mono font-black text-white">{block.transactions.length * 14.2} KB</p>
                  </div>
                  <button className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Maximize2 size={24} /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
