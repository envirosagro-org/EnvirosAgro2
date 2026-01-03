
import React, { useState } from 'react';
import { Search, Hash, Clock, Shield, Box, User, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { AgroBlock } from '../types';

const mockBlocks: AgroBlock[] = [
  {
    hash: '0x8f2d...91c3',
    prevHash: '0x12a5...33d1',
    timestamp: '2 mins ago',
    validator: 'Node_Paris_04',
    status: 'Confirmed',
    transactions: [
      { id: 'tx1', type: 'CarbonMint', farmId: 'FR-882', details: 'Regenerative Tilling Credits', value: 14.2, unit: 'CO2e' }
    ]
  },
  {
    hash: '0x33e1...bb20',
    prevHash: '0x8f2d...91c3',
    timestamp: '12 mins ago',
    validator: 'Node_SF_12',
    status: 'Confirmed',
    transactions: [
      { id: 'tx2', type: 'Harvest', farmId: 'US-291', details: 'Organic Corn Yield Log', value: 12500, unit: 'kg' }
    ]
  },
  {
    hash: '0xab82...0092',
    prevHash: '0x33e1...bb20',
    timestamp: '24 mins ago',
    validator: 'Node_Tokyo_01',
    status: 'Confirmed',
    transactions: [
      { id: 'tx3', type: 'Audit', farmId: 'JP-92', details: 'Soil pH Verification', value: 6.8, unit: 'pH' }
    ]
  }
];

const Explorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search by Block Hash, TxID or Farm ID..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-colors">
            Filters
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockBlocks.map((block) => (
          <div key={block.hash} className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 hover:bg-white/[0.05] transition-all cursor-pointer">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <Box className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-bold tracking-wider">{block.hash}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {block.timestamp}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> Validator: {block.validator}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {block.transactions[0].value} {block.transactions[0].unit}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-tighter">
                    {block.transactions[0].type}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm text-slate-400">
                <span className="font-semibold text-slate-500">Farm:</span> {block.transactions[0].farmId}
              </div>
              <div className="text-sm text-slate-400">
                <span className="font-semibold text-slate-500">Details:</span> {block.transactions[0].details}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors flex items-center gap-1">
          Load older blocks <ArrowUpRight className="w-4 h-4 rotate-45" />
        </button>
      </div>
    </div>
  );
};

export default Explorer;
