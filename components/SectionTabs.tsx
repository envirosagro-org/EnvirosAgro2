import React, { useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AGRO_EQUATIONS } from '../services/agroEquations';

export interface TabItem {
  id: string | any;
  label: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
}

interface SectionTabsProps {
  tabs: TabItem[];
  activeTab: string | any;
  onTabChange: (id: string | any) => void;
  className?: string;
  variant?: 'industrial' | 'minimal' | 'glass' | 'prestige';
  sticky?: boolean;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "",
  variant = 'industrial',
  sticky = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const symbioticScale = AGRO_EQUATIONS.getSymbioticScale(window.innerWidth, window.innerHeight);

  useEffect(() => {
    const activeEl = scrollRef.current?.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'industrial':
        return isActive 
          ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5'
          : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent';
      case 'minimal':
        return isActive
          ? 'text-white border-b-2 border-emerald-500 scale-105'
          : 'text-slate-500 hover:text-slate-300';
      case 'glass':
        return isActive
          ? 'bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-2xl scale-105'
          : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5';
      case 'prestige':
        return isActive
          ? 'bg-slate-900 text-indigo-400 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)] skew-x-[-12deg]'
          : 'text-slate-600 hover:text-slate-300 skew-x-[-12deg] hover:bg-slate-900/40';
      default:
        return '';
    }
  };

  return (
    <div className={`
      relative z-[100] 
      ${sticky ? 'sticky top-0 -mx-4 px-4 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5' : ''} 
      ${className}
    `}>
      <div 
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar snap-x"
        style={{ scale: symbioticScale > 1.2 ? 1.05 : 1 }}
      >
        <div className="flex gap-1 p-1 bg-black/20 border border-white/5 rounded-3xl w-full mx-auto backdrop-blur-md">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                data-tab-id={tab.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap snap-center
                  ${getTabStyles(isActive)}
                `}
              >
                <div className={variant === 'prestige' ? 'skew-x-[12deg]' : ''}>
                  {tab.icon && <tab.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />}
                </div>
                <span className={variant === 'prestige' ? 'skew-x-[12deg]' : ''}>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-[9px] font-bold 
                    ${variant === 'prestige' ? 'skew-x-[12deg]' : ''}
                    ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}
                  `}>
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Scroll Indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/40 to-transparent pointer-events-none lg:hidden z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/40 to-transparent pointer-events-none lg:hidden z-10"></div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
