import React from 'react';
import { User } from '../types';
import { Star, Target, Zap, Award } from 'lucide-react';

interface StewardJourneyProps {
  user: User;
}

export const StewardJourney: React.FC<StewardJourneyProps> = ({ user }) => {
  const completedActionsCount = user.completedActions?.length || 0;
  const skillCount = Object.keys(user.skills || {}).length;

  return (
    <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Award className="text-emerald-400" /> Steward Journey
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
          <p className="text-slate-400 text-xs uppercase tracking-widest">Actions</p>
          <p className="text-2xl font-black text-white">{completedActionsCount}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
          <p className="text-slate-400 text-xs uppercase tracking-widest">Skills</p>
          <p className="text-2xl font-black text-white">{skillCount}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-slate-400 text-xs uppercase tracking-widest">Top Skills</p>
        {Object.entries(user.skills || {}).slice(0, 3).map(([skill, level]) => (
          <div key={skill} className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
            <span className="text-white text-sm">{skill}</span>
            <span className="text-emerald-400 font-mono">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
