import React, { useState } from 'react';
import { toast } from 'sonner';
import { Proposal, Vote, User, StewardPosition, Election } from '../types';
import { ThumbsUp, ThumbsDown, MinusCircle, PlusCircle, Play, CheckCircle, XCircle, Zap, ShieldCheck, FileText, Vote as LucideVote } from 'lucide-react';
import ElectionDashboard from './ElectionDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { draftProposal, calculateImpactScore } from '../services/geminiService';
import { SectionTabs } from './SectionTabs';
import { SEO } from './SEO';

interface GovernanceProps {
  user: User;
  proposals: Proposal[];
  stewardPositions: StewardPosition[];
  elections: Election[];
  onSaveProposal: (proposal: Proposal) => void;
  onSaveVote: (vote: Vote) => void;
  onApplyForElection: (electionId: string, stewardEsin: string, stewardName: string, manifesto: string) => void;
  onVoteInElection: (electionId: string, candidateId: string, stewardEsin: string) => void;
  onUpdateProposalStatus: (proposalId: string, status: Proposal['status']) => void;
  notify: any;
}

const Governance: React.FC<GovernanceProps> = ({ user, proposals, stewardPositions, elections, onSaveProposal, onSaveVote, onApplyForElection, onVoteInElection, onUpdateProposalStatus, notify }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'elections' | 'guilds'>('proposals');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', thrust: 'Industry', fundingRequest: 0 });

  const proposalStatusData = [
    { name: 'Discussion', value: proposals.filter(p => p.status === 'DISCUSSION').length },
    { name: 'Voting', value: proposals.filter(p => p.status === 'VOTING').length },
    { name: 'Passed', value: proposals.filter(p => p.status === 'PASSED').length },
    { name: 'Rejected', value: proposals.filter(p => p.status === 'REJECTED').length },
    { name: 'Executed', value: proposals.filter(p => p.status === 'EXECUTED').length },
  ];
  const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f43f5e', '#3b82f6'];

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
      status: 'DISCUSSION',
      timestamp: new Date().toISOString(),
      votes: [],
      thrust: newProposal.thrust,
      fundingRequest: newProposal.fundingRequest
    };
    onSaveProposal(proposal);
    setShowProposalModal(false);
    setNewProposal({ title: '', description: '', thrust: 'Industry', fundingRequest: 0 });
    notify({ title: 'PROPOSAL_SUBMITTED', message: `Proposal ${proposal.title} submitted.`, type: 'success' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <SEO title="Governance" description="Participate in EnvirosAgro DAO governance: Submit proposals, vote on community initiatives, and shape the future of sustainable agriculture." />
      
      <SectionTabs 
        tabs={[
          { id: 'proposals', label: 'Proposals', icon: FileText },
          { id: 'elections', label: 'Elections', icon: LucideVote },
          { id: 'guilds', label: 'Stewardship Guilds', icon: ShieldCheck }
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
        variant="glass"
        className="mb-8"
      />

      {activeTab === 'elections' && (
        <ElectionDashboard 
          user={user} 
          positions={stewardPositions} 
          elections={elections} 
          onApply={onApplyForElection} 
          onVote={onVoteInElection} 
          notify={notify} 
        />
      )}

      {activeTab === 'proposals' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Governance <span className="text-indigo-400">DAO</span></h2>
            <button onClick={() => setShowProposalModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500">
              <PlusCircle size={16} /> New Proposal
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {proposals.map(prop => (
              <div key={prop.id} className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
                <h3 className="text-xl font-bold text-white">{prop.title}</h3>
                <p className="text-slate-400 text-sm">{prop.description}</p>
                <div className="text-emerald-400 font-mono text-sm">Funding Request: {prop.fundingRequest || 0} EAT</div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Author: {prop.authorName}</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-white">{prop.status}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleVote(prop.id, 'YES')} className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/40"><ThumbsUp size={16} /></button>
                  <button onClick={() => handleVote(prop.id, 'NO')} className="p-2 bg-rose-600/20 text-rose-400 rounded-lg hover:bg-rose-600/40"><ThumbsDown size={16} /></button>
                  <button onClick={() => handleVote(prop.id, 'ABSTAIN')} className="p-2 bg-slate-600/20 text-slate-400 rounded-lg hover:bg-slate-600/40"><MinusCircle size={16} /></button>
                </div>
                {user.role === 'ADMIN' && (
                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button onClick={() => onUpdateProposalStatus(prop.id, 'VOTING')} className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg"><Play size={16} /></button>
                    <button onClick={() => onUpdateProposalStatus(prop.id, 'PASSED')} className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg"><CheckCircle size={16} /></button>
                    <button onClick={() => onUpdateProposalStatus(prop.id, 'REJECTED')} className="p-2 bg-rose-600/20 text-rose-400 rounded-lg"><XCircle size={16} /></button>
                    <button onClick={() => onUpdateProposalStatus(prop.id, 'EXECUTED')} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Zap size={16} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
          <h3 className="text-xl font-bold text-white">Proposal Analytics</h3>
          {proposals.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={proposalStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {proposalStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
              <FileText size={48} className="animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">NO_PROPOSALS_SYNCED</p>
            </div>
          )}
        </div>
      </div>
    )}

    {activeTab === 'guilds' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Soil Sentinels', members: 124, reputation: 4.8, color: 'text-emerald-400', desc: 'Focus on regenerative soil health and carbon sequestration.' },
              { name: 'Water Weavers', members: 89, reputation: 4.5, color: 'text-blue-400', desc: 'Managing local water resources and irrigation efficiency.' },
              { name: 'Genetic Guardians', members: 56, reputation: 4.9, color: 'text-purple-400', desc: 'Preserving heirloom seeds and genetic biodiversity.' }
            ].map((guild, i) => (
              <div key={i} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 space-y-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${guild.color}`}>
                    <ShieldCheck size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black">Reputation</p>
                    <p className={`text-xl font-black ${guild.color}`}>{guild.reputation}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase italic">{guild.name}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{guild.desc}</p>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{guild.members} Stewards</span>
                  <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black text-white uppercase tracking-widest border border-white/10 transition-all">STAKE_REPUTATION</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showProposalModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateProposal} className="w-full max-w-lg glass-card rounded-3xl border border-white/10 bg-black p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Create Proposal</h3>
            <button type="button" onClick={async () => {
              const drafted = await draftProposal(newProposal.title, newProposal.description, newProposal.thrust);
              setNewProposal({...newProposal, description: drafted});
            }} className="w-full py-2 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-500">AI Draft</button>
            <button type="button" onClick={async () => {
              const score = await calculateImpactScore(newProposal.title, newProposal.description, newProposal.fundingRequest);
              toast.info(`Impact Score: ${score}/100`);
            }} className="w-full py-2 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500">Calculate Impact Score</button>
            <input type="text" required value={newProposal.title} onChange={e => setNewProposal({...newProposal, title: e.target.value})} placeholder="Title" className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white" />
            <textarea required value={newProposal.description} onChange={e => setNewProposal({...newProposal, description: e.target.value})} placeholder="Description" className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white h-32" />
            <input type="number" required value={newProposal.fundingRequest} onChange={e => setNewProposal({...newProposal, fundingRequest: parseInt(e.target.value)})} placeholder="Funding Request (EAT)" className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white" />
            <div className="flex gap-4">
              <button type="button" onClick={() => {
                setShowProposalModal(false);
                setNewProposal({ title: '', description: '', thrust: 'Industry', fundingRequest: 0 });
              }} className="w-full py-3 bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 border border-white/10">Back</button>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Governance;
