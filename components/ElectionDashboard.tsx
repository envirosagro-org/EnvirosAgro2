import React, { useState } from 'react';
import { StewardPosition, Election, Candidate, User } from '../types';
import { UserPlus, Vote, Users, Clock } from 'lucide-react';

interface ElectionDashboardProps {
  user: User;
  positions: StewardPosition[];
  elections: Election[];
  onApply: (electionId: string, stewardEsin: string, stewardName: string, manifesto: string) => void;
  onVote: (electionId: string, candidateId: string, stewardEsin: string) => void;
  notify: any;
}

const ElectionDashboard: React.FC<ElectionDashboardProps> = ({ user, positions, elections, onApply, onVote, notify }) => {
  const [manifesto, setManifesto] = useState('');
  const [selectedElection, setSelectedElection] = useState<string | null>(null);

  const handleApply = (electionId: string) => {
    if (!manifesto) {
      notify({ title: 'ERROR', message: 'Manifesto is required.', type: 'error' });
      return;
    }
    onApply(electionId, user.esin, user.name, manifesto);
    setManifesto('');
    setSelectedElection(null);
    notify({ title: 'APPLICATION_SUBMITTED', message: 'Application submitted successfully.', type: 'success' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Stewardship <span className="text-emerald-400">Elections</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {elections.map(election => {
          const position = positions.find(p => p.id === election.positionId);
          if (!position) return null;
          return (
            <div key={election.id} className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
              <h3 className="text-xl font-bold text-white">{position.title}</h3>
              <p className="text-slate-400 text-sm">{position.description}</p>
              <div className="text-xs text-slate-500 font-mono">
                <p>Term: {position.termDurationMonths} months</p>
                <p>Status: {election.status}</p>
              </div>

              {election.status === 'OPEN' && (
                <div className="space-y-2">
                  <textarea value={manifesto} onChange={e => setManifesto(e.target.value)} placeholder="Enter your manifesto" className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white h-24" />
                  <button onClick={() => handleApply(election.id)} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500">
                    <UserPlus size={16} /> Apply for Position
                  </button>
                </div>
              )}

              {election.status === 'VOTING' && (
                <div className="space-y-4">
                  <h4 className="text-white font-bold">Candidates</h4>
                  {election.candidates.map(candidate => (
                    <div key={candidate.id} className="flex flex-col bg-slate-900 p-4 rounded-xl gap-2 border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">{candidate.stewardName}</span>
                        <span className="text-emerald-400 text-xs font-mono">Rep: {candidate.reputation}</span>
                      </div>
                      <p className="text-slate-400 text-xs italic">"{candidate.manifesto}"</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(skill => <span key={skill} className="bg-indigo-900/30 text-indigo-300 text-[10px] px-2 py-1 rounded-full">{skill}</span>)}
                      </div>
                      <div className="text-slate-500 text-[10px] font-mono">
                        Contributions: {candidate.contributions.join(', ')}
                      </div>
                      <button onClick={() => onVote(election.id, candidate.id, user.esin)} className="mt-2 w-full py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/40 flex items-center justify-center gap-2">
                        <Vote size={14} /> Vote ({candidate.votes})
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectionDashboard;
