import React, { useState, useEffect } from 'react';
import { Proposal, Vote, User } from '../types';
import { ThumbsUp, ThumbsDown, MinusCircle, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface GovernanceProps {
  user: User;
  proposals: Proposal[];
  onSaveProposal: (proposal: Proposal) => void;
  onSaveVote: (vote: Vote) => void;
  notify: any;
}

const Governance: React.FC<GovernanceProps> = ({ user, proposals, onSaveProposal, onSaveVote, notify }) => {
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', thrust: 'Industry' });

  const handleVote = (proposalId: string, decision: 'YES' | 'NO' | 'ABSTAIN') => {
    const vote: Vote = {
      id: `VOTE-${Date.now()}`,
      proposalId,
      stewardEsin: user.esin,
      decision,
      timestamp: new Date().toISOString()
    };
    onSaveVote(vote);
    notify({ title: 'VOTE_CAST', message: `Vote ${decision} cast for proposal ${proposalId}.`, type: 'success' });
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const proposal: Proposal = {
      id: `PROP-${Date.now()}`,
      title: newProposal.title,
      description: newProposal.description,
      authorEsin: user.esin,
      authorName: user.name,
      status: 'PROPOSED',
      timestamp: new Date().toISOString(),
      votes: [],
      thrust: newProposal.thrust
    };
    onSaveProposal(proposal);
    setShowProposalModal(false);
    setNewProposal({ title: '', description: '', thrust: 'Industry' });
    notify({ title: 'PROPOSAL_SUBMITTED', message: `Proposal ${proposal.title} submitted.`, type: 'success' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Governance <span className="text-indigo-400">DAO</span></h2>
        <button onClick={() => setShowProposalModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500">
          <PlusCircle size={16} /> New Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {proposals.map(prop => (
          <div key={prop.id} className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
            <h3 className="text-xl font-bold text-white">{prop.title}</h3>
            <p className="text-slate-400 text-sm">{prop.description}</p>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Author: {prop.authorName}</span>
              <span>Status: {prop.status}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleVote(prop.id, 'YES')} className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/40"><ThumbsUp size={16} /></button>
              <button onClick={() => handleVote(prop.id, 'NO')} className="p-2 bg-rose-600/20 text-rose-400 rounded-lg hover:bg-rose-600/40"><ThumbsDown size={16} /></button>
              <button onClick={() => handleVote(prop.id, 'ABSTAIN')} className="p-2 bg-slate-600/20 text-slate-400 rounded-lg hover:bg-slate-600/40"><MinusCircle size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showProposalModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateProposal} className="w-full max-w-lg glass-card rounded-3xl border border-white/10 bg-black p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Create Proposal</h3>
            <input type="text" required value={newProposal.title} onChange={e => setNewProposal({...newProposal, title: e.target.value})} placeholder="Title" className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white" />
            <textarea required value={newProposal.description} onChange={e => setNewProposal({...newProposal, description: e.target.value})} placeholder="Description" className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white h-32" />
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Governance;
