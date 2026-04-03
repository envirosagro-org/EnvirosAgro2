import React from 'react';
import { CarbonCredit, User, LiveAgroProduct } from '../types';
import { Leaf, CheckCircle2, AlertCircle } from 'lucide-react';
import { SEO } from './SEO';

interface CarbonCreditsProps {
  user: User;
  credits: CarbonCredit[];
  products: LiveAgroProduct[];
  onVerifyCredit: (creditId: string) => void;
  notify: any;
}

const CarbonCredits: React.FC<CarbonCreditsProps> = ({ user, credits, products, onVerifyCredit, notify }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <SEO title="Carbon Credits" description="EnvirosAgro Carbon Credits: Manage, verify, and trade carbon credits generated through sustainable practices." />
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Carbon <span className="text-emerald-400">Credits</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {credits.map(credit => {
          const product = products.find(p => p.id === credit.assetId);
          return (
            <div key={credit.id} className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
              <div className="flex justify-between items-center">
                <Leaf className="text-emerald-400" size={32} />
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${credit.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {credit.verificationStatus}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{product?.productType || 'Unknown Asset'}</h3>
              <p className="text-slate-400 text-sm">Amount: {credit.amount} tons CO2e</p>
              {credit.verificationStatus === 'PENDING' && (
                <button onClick={() => onVerifyCredit(credit.id)} className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-500">
                  Verify Credit
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarbonCredits;
