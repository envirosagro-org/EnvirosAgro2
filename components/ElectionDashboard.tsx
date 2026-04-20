import React, { useState } from 'react';
import { StewardPosition, Election, User } from '../types';
import { UserPlus, Vote, Users, Clock, ShieldCheck } from 'lucide-react';

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

  const handleApply = (electionId: string) => {
    if (!manifesto) {
      notify({ title: 'ERROR', message: 'Manifesto is required.', type: 'error' });
      return;
    }
    onApply(electionId, user.esin, user.name, manifesto);
    setManifesto('');
    notify({ title: 'APPLICATION_SUBMITTED', message: 'Application submitted successfully.', type: 'success' });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-2xl border border-white/10">
              <Users size={24} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.6em] italic">SEHTI_GOVERNANCE_v2.1</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
            Stewardship <span className="text-emerald-400">Elections.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium italic max-w-2xl">
            "Democratic orchestration of the agricultural mesh. Elect stewards to lead industrial sectors and research collectives."
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {elections.map(election => {
          const position = positions.find(p => p.id === election.positionId);
          if (!position) return null;
          
          const candidates = election.candidates || [];
          const totalVotes = candidates.reduce((acc, c) => acc + c.votes, 0);

          return (
            <div key={election.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 space-y-8 shadow-3xl hover:border-emerald-500/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[10s]"><Users size={300} /></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tight m-0 group-hover:text-emerald-400 transition-colors">{position.title}</h3>
                  <p className="text-slate-500 text-sm font-medium italic leading-relaxed max-w-md">{position.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest shadow-lg ${
                    election.status === 'OPEN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    election.status === 'VOTING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' : 
                    'bg-slate-500/10 text-slate-500 border-white/5'
                  }`}>
                    {election.status}_PHASE
                  </span>
                  <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px]">
                    <Clock size={12} /> {position.termDurationMonths}M_TERM
                  </div>
                </div>
              </div>

              {election.status === 'OPEN' && (
                <div className="space-y-6 relative z-10 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">CANDIDATE_MANIFESTO</label>
                    <textarea 
                      value={manifesto} 
                      onChange={e => setManifesto(e.target.value)} 
                      placeholder="Steward, define your vision for this sector..." 
                      className="w-full bg-black/60 border border-white/10 rounded-[40px] p-8 text-white text-sm font-medium italic focus:ring-8 focus:ring-emerald-500/10 outline-none h-44 resize-none placeholder:text-stone-900 shadow-inner" 
                    />
                  </div>
                  <button 
                    onClick={() => handleApply(election.id)} 
                    className="w-full py-6 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl flex items-center justify-center gap-4 transition-all active:scale-95 border-4 border-white/10 ring-[12px] ring-emerald-500/5"
                  >
                    <UserPlus size={20} /> INITIALIZE_APPLICATION
                  </button>
                </div>
              )}

              {election.status === 'VOTING' && (
                <div className="space-y-8 relative z-10 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Live Quorum Results</h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-black px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">{totalVotes} TOTAL_SIGNALS</span>
                  </div>
                  
                  <div className="space-y-6">
                    {candidates.map(candidate => {
                      const votePercent = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                      return (
                        <div key={candidate.id} className="p-8 bg-black/60 border border-white/10 rounded-[40px] space-y-6 hover:border-indigo-500/30 transition-all shadow-xl group/cand">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
                                <Users size={24} />
                              </div>
                              <div>
                                <h5 className="text-xl font-black text-white uppercase italic tracking-tight m-0">{candidate.stewardName}</h5>
                                <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest mt-1">REP_SCORE: {candidate.reputation}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-mono font-black text-white">{votePercent.toFixed(1)}%</p>
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">QUORUM_SHARE</p>
                            </div>
                          </div>

                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${votePercent}%` }}></div>
                          </div>

                          <p className="text-sm text-slate-400 italic leading-relaxed">"{candidate.manifesto}"</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map(skill => (
                              <span key={skill} className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded-full tracking-widest italic">{skill}</span>
                            ))}
                          </div>

                          <button 
                            onClick={() => onVote(election.id, candidate.id, user.esin)} 
                            className="w-full py-4 bg-white/5 hover:bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl border border-white/5 flex items-center justify-center gap-3 active:scale-95"
                          >
                            <Vote size={18} /> CAST_VOTE_SIGNAL
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
