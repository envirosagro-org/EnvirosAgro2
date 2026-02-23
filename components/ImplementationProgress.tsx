
import React from 'react';

// Define the possible stages for implementation
export type ImplementationStage = 'Schema Definition' | 'Node Services' | 'Node UI' | 'FarmOS Sync' | 'Deployment' | 'Success';

interface ImplementationProgressProps {
  currentStage: ImplementationStage;
}

const STAGES: ImplementationStage[] = ['Schema Definition', 'Node Services', 'Node UI', 'FarmOS Sync', 'Deployment', 'Success'];

const ImplementationProgress: React.FC<ImplementationProgressProps> = ({ currentStage }) => {
  const currentIdx = STAGES.indexOf(currentStage);

  return (
    <div className="w-full bg-black/50 border-y border-white/10 p-4 fixed top-0 left-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs text-white/50 font-black uppercase tracking-widest mb-2">Project Implementation Progress</p>
        <div className="flex gap-4 items-center">
          {STAGES.map((stage, i) => (
            <div key={stage} className="flex-1 flex flex-col gap-2 items-center">
              <div className={`h-2 w-full rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]' : 'bg-white/10'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${i <= currentIdx ? 'text-emerald-400' : 'text-slate-600'}`}>
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImplementationProgress;
