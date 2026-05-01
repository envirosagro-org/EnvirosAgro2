import React, { useMemo } from 'react';

// EnvirosAgro Mathematics Constants
const PHI = 1.618033988749895;
const M_CONSTANT = 2.71828; // Used for organic growth algorithms

/**
 * Resilient Icon Wrapper
 * Applies EnvirosAgro transformation equations to component iconography,
 * using Torus-like drop shadows and pulsating mathematical aura.
 */
export const AgroResilienceIcon: React.FC<{ 
  children: React.ReactNode; 
  resilience?: number;
  className?: string;
}> = ({ children, resilience = 1.0, className = "" }) => {
  // Harmonic resonance logic
  const resonanceShadow = `drop-shadow(0 0 ${2 * resilience * PHI}px rgba(74, 124, 89, 0.4)) drop-shadow(0 0 ${4 * resilience}px rgba(16, 185, 129, 0.2))`;
  
  return (
    <div 
      className={`relative group inline-block ${className}`}
      style={{ filter: resonanceShadow }}
    >
      {children}
      {/* Symbiotic Shard Accents based on Golden Ratio positioning */}
      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
           style={{ transform: `scale(${PHI})` }} />
      <div className="absolute -bottom-0.5 -left-1 w-1 h-1 bg-indigo-500 rotate-45 opacity-0 group-hover:opacity-40 transition-opacity" />
    </div>
  );
};

/**
 * Sycamore Logo: Represents interconnected organic growth grids
 * Uses Fibonacci arcs and Phi algorithms to construct the tree pattern.
 */
export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => {
  // Generates fractal-like tree branches based on EnvirosAgro equations
  const constructFractalTree = () => {
    return (
      <>
        {/* Core Trunk */}
        <path d="M100 180 C100 150, 90 140, 100 120" stroke="currentColor" strokeWidth={6 * PHI} strokeLinecap="round" />
        
        {/* Golden Ratio Branches */}
        <path d="M100 130 C70 120, 50 90, 40 60" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
        <path d="M100 130 C130 120, 150 90, 160 60" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
        <path d="M80 100 C50 80, 40 50, 30 20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <path d="M120 100 C150 80, 160 50, 170 20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <path d="M100 120 C100 90, 95 60, 100 20" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        
        {/* Sacred Geometry Canopy Matrix */}
        <circle cx="100" cy="70" r={40 * PHI} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="4 4" />
        <circle cx="60" cy="50" r={25 * PHI} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="2 2" />
        <circle cx="140" cy="50" r={25 * PHI} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="2 2" />
        
        {/* Intersection Energy Dots */}
        <circle cx="100" cy="70" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="60" cy="50" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="140" cy="50" r="2" fill="currentColor" opacity="0.6" />
      </>
    );
  };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
      <g style={{ transformOrigin: 'center' }} className="animate-spin-slow">
        {constructFractalTree()}
      </g>
    </svg>
  );
};

/**
 * Hen Icon: Transformed into an Agricultural Swarm Oracle Matrix (Geometric Hen)
 * Utilizes Torus intersection patterns and organic polygon plotting.
 */
export const HenIcon: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
      {/* Mathematical Enclosure (Torus projection) */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" opacity="0.2" fill="none" strokeDasharray="4 6" />
      <circle cx="50" cy="50" r={45 / PHI} stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      
      {/* Cyber-Geometric Hen Structure */}
      <path d="M 30,70 L 30,40 C 30,30, 40,20, 50,20 C 60,20, 70,25, 75,35 L 85,35 L 75,45 C 75,55, 65,70, 50,70 Z" 
            stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            
      {/* Eye of the Oracle (Fibonacci point) */}
      <circle cx="65" cy="30" r="3" fill="currentColor" />
      <circle cx="65" cy="30" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      
      {/* Swarm Neural Lines */}
      <path d="M 50,20 L 50,70 M 30,40 L 75,45 M 40,30 L 65,65" stroke="currentColor" strokeWidth="0.5" opacity="0.4" fill="none" />
      
      {/* Mechanical / Grounding Legs */}
      <path d="M 40,70 L 35,85 M 35,85 L 30,90 M 35,85 L 40,90 M 60,70 L 65,85 M 65,85 L 70,90 M 65,85 L 60,90" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            
      {/* Peak Comb / Antenna */}
      <path d="M 50,20 L 45,10 L 55,5 L 60,15 Z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="bevel" />
    </svg>
  );
};

