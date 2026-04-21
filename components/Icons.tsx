import React from 'react';

/**
 * Resilient Icon Wrapper
 * Applies EnvirosAgro transformation equations to component iconography.
 */
export const AgroResilienceIcon: React.FC<{ 
  children: React.ReactNode; 
  resilience?: number;
  className?: string;
}> = ({ children, resilience = 1.0, className = "" }) => (
  <div 
    className={`relative group inline-block ${className}`}
    style={{ 
      filter: `drop-shadow(0 0 ${2 * resilience}px rgba(74, 124, 89, 0.4))` 
    }}
  >
    {children}
    {/* Symbiotic Shard Accents */}
    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
    <div className="absolute -bottom-0.5 -left-1 w-1 h-1 bg-indigo-500 rotate-45 opacity-0 group-hover:opacity-40 transition-opacity" />
  </div>
);

export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M100 180C100 180 95 160 100 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 145C100 145 70 140 50 120C30 100 20 80 25 55C30 30 55 20 75 35C85 45 100 30 100 30C100 30 115 45 125 35C145 20 170 30 175 55C180 80 170 100 150 120C130 140 100 145 100 145Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export const HenIcon: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s-4-1-4-4 3-4 3-4 1-3 1-5c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2 1 5 1 5s3 1 3 4-4 4-4 4" />
    <path d="M16 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    <path d="M12 14c-1 0-2 1-2 2s1 2 2 2" />
    <path d="M10 22v-2" />
    <path d="M14 22v-2" />
  </svg>
);
