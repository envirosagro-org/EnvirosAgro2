import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { createEscrowContract, releaseEscrow } from '../services/escrowService';
import { EscrowContract } from '../types';

const EscrowPortal: React.FC = () => {
  const [contract, setContract] = useState<EscrowContract | null>(null);

  const handleLock = () => {
    setContract(createEscrowContract('BUYER-01', 'SELLER-01', 1000));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Smart Contract <span className="text-emerald-400">Escrow</span></h2>
      <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
        <p className="text-slate-400">Secure, trustless transaction management.</p>
        <div className="mt-6 flex gap-4">
          <button 
            onClick={handleLock}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Lock size={18} /> Lock Funds
          </button>
        </div>
        {contract && (
          <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-white/5">
            <p className="text-white">Contract ID: {contract.id}</p>
            <p className="text-slate-400">Amount: {contract.amount} EAC</p>
            <button 
              onClick={() => releaseEscrow(contract.id)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700"
            >
              Release Funds
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowPortal;
