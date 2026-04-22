import React from 'react';
import { AIOracle } from './AIOracle';
import { SEO } from './SEO';
import { User, AgroProject } from '../types';

interface AIOracleViewProps {
  user: User;
  projects: AgroProject[];
}

const AIOracleView: React.FC<AIOracleViewProps> = ({ user, projects }) => {
  const context = `User Position: ${user.role}. Current Projects: ${projects.length}. Metrics: Sustainability Score ${user.metrics.sustainabilityScore}.`;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 mx-auto px-4 w-full">
      <SEO title="AI Strategic Oracle | EnvirosAgro" description="Neural strategic analysis for agro-industrial optimization." />
      
      <div className="space-y-2 mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
          Neural <span className="text-indigo-400">Oracle</span>
        </h2>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] italic">Strategic_Optimization_Layer</p>
      </div>

      <AIOracle telemetryContext={context} isDashboardView={true} />
    </div>
  );
};

export default AIOracleView;
