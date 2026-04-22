import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, Cpu, Zap, Target, 
  ShieldAlert, RefreshCcw, Loader2,
  ChevronRight, ArrowUpRight, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getStrategicAdvice, StrategyAdvice } from '../services/aiService';
import { toast } from 'sonner';

interface AIOracleProps {
  telemetryContext?: string;
  isDashboardView?: boolean;
}

export const AIOracle: React.FC<AIOracleProps> = ({ telemetryContext = "Overall system optimal.", isDashboardView = false }) => {
  const [advice, setAdvice] = useState<StrategyAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<number>(Date.now());

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await getStrategicAdvice(telemetryContext);
      setAdvice(result);
      setLastAnalysis(Date.now());
      toast.success('AI_STRATEGIC_SYNC_COMPLETE');
    } catch (error) {
      toast.error('AI_ORACLE_DESYNC');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [telemetryContext]);

  return (
    <div className={`glass-card p-8 rounded-[48px] border-2 border-indigo-500/20 bg-black/60 relative overflow-hidden group shadow-3xl ${isDashboardView ? 'w-full' : ''}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/30 text-indigo-400 animate-pulse">
                <Brain size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
                   Strategic <span className="text-indigo-400">Oracle</span>
                </h3>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Gemini_Neural_Core_v3.1</p>
             </div>
          </div>
          
          <button 
            onClick={runAnalysis}
            disabled={isLoading}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin text-indigo-400" /> : <RefreshCcw size={16} className="text-slate-400" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!advice || isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center space-y-6"
            >
               <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Processing_Matrix_Data...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               {/* Risk & Confidence Metrics */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                     <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Risk_Assessment</p>
                     <div className="flex items-center gap-3">
                        <ShieldAlert size={14} className={advice.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'} />
                        <span className={`text-[12px] font-black italic ${advice.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>{advice.riskLevel}_THREAT</span>
                     </div>
                  </div>
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                     <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Neural_Confidence</p>
                     <div className="flex items-center gap-3">
                        <Network size={14} className="text-indigo-400" />
                        <span className="text-[12px] font-black text-white italic">{(advice.confidence * 100).toFixed(1)}%</span>
                     </div>
                  </div>
               </div>

               {/* Analysis Text */}
               <div className="space-y-4">
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{advice.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {advice.analysis}
                  </p>
               </div>

               {/* Recommendations List */}
               <div className="space-y-4">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Protocol_Directives</p>
                  <div className="space-y-3">
                     {advice.recommendations.map((rec, i) => (
                       <div key={i} className="flex items-start gap-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 group/item hover:bg-indigo-500/10 transition-all">
                          <div className="mt-1 text-indigo-400">
                             <Target size={14} />
                          </div>
                          <p className="text-[11px] font-bold text-slate-300 group-hover/item:text-white transition-colors">{rec}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                     Last_Sync: {new Date(lastAnalysis).toLocaleTimeString()}
                  </span>
                  <button className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                     EXECUTE_OPTIMIZATION <ArrowUpRight size={12} />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
