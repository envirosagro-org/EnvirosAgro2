import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Droplets, 
  Wind, 
  PawPrint, 
  Mountain, 
  Sparkle, 
  Sliders, 
  Zap, 
  Activity, 
  FileCode, 
  Download, 
  RefreshCw,
  Play,
  Square,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Compass,
  Volume2,
  Award
} from 'lucide-react';
import { audioManager } from '../services/audioService';

// Scent related types
export interface EnvironmentalFactors {
  plantDiversity: number; // 0-100
  animalPresence: number; // 0-100
  soilHealth: number;     // 0-100
  waterQuality: number;   // 0-100
  airPurity: number;      // 0-100
}

export interface ScentProfile {
  name: string;
  intensity: number;
  notes: string[];
  description: string;
  category: string;
  application: string;
  compounds: Array<{
    name: string;
    percentage: number;
    description: string;
    formula: string;
  }>;
}

// Function to generate rich bio-scent profiles based on factors
export function calculateScentProfile(factors: EnvironmentalFactors): ScentProfile {
  const score = (
    factors.plantDiversity * 0.25 +
    factors.animalPresence * 0.15 +
    factors.soilHealth * 0.25 +
    factors.waterQuality * 0.15 +
    factors.airPurity * 0.20
  );

  // Helper to compute organic chemical terpene ratios based on factors
  const totalWeight = (
    factors.plantDiversity * 1.5 +
    factors.soilHealth * 1.5 +
    factors.waterQuality * 1.2 +
    factors.airPurity * 1.0 +
    factors.animalPresence * 0.8
  ) || 1;

  // Rich compound ratios
  const linalool = Math.round((factors.plantDiversity * 1.2 + factors.waterQuality * 0.3) / totalWeight * 100);
  const geosmin = Math.round((factors.soilHealth * 1.4 + factors.waterQuality * 0.6) / totalWeight * 100);
  const pinene = Math.round((factors.plantDiversity * 0.8 + factors.airPurity * 1.0) / totalWeight * 100);
  const caryophyllene = Math.round((factors.plantDiversity * 0.5 + factors.soilHealth * 1.0) / totalWeight * 100);
  const indole = Math.round((factors.animalPresence * 1.5 + factors.plantDiversity * 0.2) / totalWeight * 100);
  const ozone = Math.round((factors.airPurity * 1.5) / totalWeight * 100);

  const rawCompounds = [
    { name: 'Linalool', percentage: linalool, formula: 'C10H18O', description: 'Floral, sweet, lavender-like essence; supports crop stress alleviation.' },
    { name: 'Geosmin', percentage: geosmin, formula: 'C12H22O', description: 'Warm damp soil, petrichor smell; activates beneficial soil microbiome.' },
    { name: 'Alpha-Pinene', percentage: pinene, formula: 'C10H16', description: 'Crisp pine and woodiness; acts as an antimicrobial defense vector.' },
    { name: 'Beta-Caryophyllene', percentage: caryophyllene, formula: 'C15H24', description: 'Woody spice fragrance; triggers multi-hop crop signaling warning waves.' },
    { name: 'Indole', percentage: indole, formula: 'C8H7N', description: 'Musky and intense bloomy properties; acts as active pollinator attractant.' },
    { name: 'Ozone', percentage: ozone, formula: 'O3', description: 'Clean, electrified air scent; helps suppress airborne mold spores.' }
  ];

  const totalCompPercent = rawCompounds.reduce((acc, c) => acc + c.percentage, 0) || 1;
  const compounds = rawCompounds.map(c => ({
    ...c,
    percentage: Math.round((c.percentage / totalCompPercent) * 100)
  })).sort((a, b) => b.percentage - a.percentage);

  let name = "Neutral Biosphere";
  let description = "A simple, clean baseline scent that carries mineral elements and raw field properties.";
  let category = "Mineral Earth";
  let application = "General baseline ventilation and environmental grounding.";
  let notes = ["Mild Mud", "Fresh Chalk"];

  if (score > 85) {
    name = "Ethereal Primeval Canopy";
    description = "A luxurious, sweet, damp bio-active scent signifying a climax rainforest or high-diversity organic permaculture haven.";
    category = "Hyper-Diverse Bio-climax";
    application = "Optimizing general pollinator count and boosting crop pest-resistance vectors.";
    notes = ["Sweet Orchid", "Fresh Ozone", "Humus Rain", "Crushed Moss"];
  } else if (score > 70) {
    name = "Woodland Hydration Resonance";
    description = "Dominant conifer and damp wood properties. Crisp, refreshing, with high plant defense compounds.";
    category = "Coniferous Woodland";
    application = "Microbial pathogen suppression and worker focus stimulation.";
    notes = ["Fresh Pine Needle", "Lichen Bark", "Dewy Meadow"];
  } else if (score > 55) {
    name = "Regenerative Loam & Sprout";
    description = "Deeply earthy and warm loam olfactory indicators, demonstrating healthy compost active decomposition.";
    category = "Active Soil Horizon";
    application = "Humus activation signaling and root inoculants priming.";
    notes = ["Damp Loam", "Petrichor", "Sprouted Grain"];
  } else if (score > 35) {
    name = "Sub-Arid Scrubland Aura";
    description = "Dry herbs, warm stones, and resinous components. High durability dry-adaptation signals.";
    category = "Xeric Sclerophyll";
    application = "Stimulating drought-defense gene expression in adjacent crops.";
    notes = ["Resinous Sage", "Warm Gravel", "Dry Hay"];
  } else {
    name = "Industrial Echo";
    description = "Strong dry grass with artificial sharpness. Signifies depleted organics, high nitrogen drift or mineral exposure.";
    category = "Anticlimax Mineral";
    application = "Triggering plant emergency adaptive hardiness; ventilation needed.";
    notes = ["Dry Chaff", "Burnt Silt", "Sharp Slate"];
  }

  return {
    name,
    intensity: Math.round(score),
    notes,
    description,
    category,
    application,
    compounds
  };
}

// 2D Canvas Scent Dispersion Simulator
const ScentCanvas: React.FC<{ 
  factors: EnvironmentalFactors; 
  windSpeed: number; 
  windDirection: number; // 0 (Left-to-Right) to 360
  isDispensing: boolean;
}> = ({ factors, windSpeed, windDirection, isDispensing }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 160;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dynamic color matching the dominant ecological dimension
    const getColor = () => {
      if (factors.plantDiversity > 60) return `hsla(${140 + Math.random() * 30}, 85%, 60%, `;
      if (factors.waterQuality > 60) return `hsla(${195 + Math.random() * 20}, 85%, 65%, `;
      if (factors.soilHealth > 60) return `hsla(${28 + Math.random() * 15}, 75%, 50%, `;
      if (factors.animalPresence > 60) return `hsla(${280 + Math.random() * 30}, 80%, 65%, `;
      return `hsla(${160 + Math.random() * 20}, 50%, 60%, `;
    };

    const render = () => {
      ctx.fillStyle = 'rgba(8, 10, 16, 0.25)'; // Semi-clear tracing
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render subtle background agricultural grid lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Render Diffuser Source Core at Left-Center
      const sourceX = 35;
      const sourceY = canvas.height / 2;
      
      const pulseRadius = 5 + Math.sin(Date.now() / 140) * 1.8;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, pulseRadius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = isDispensing ? 'rgba(16, 185, 129, 0.25)' : 'rgba(100, 116, 139, 0.15)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sourceX, sourceY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDispensing ? '#10b981' : '#475569';
      ctx.shadowBlur = isDispensing ? 14 : 2;
      ctx.shadowColor = isDispensing ? '#10b981' : '#475569';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Source label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '7px monospace';
      ctx.fillText("NODE-SV100", sourceX - 22, sourceY + 16);

      // Emit scent cloud particles
      const maxEmit = isDispensing ? 5 : 1;
      if (Math.random() < 0.75) {
        for (let i = 0; i < maxEmit; i++) {
          const angleRad = (windDirection * Math.PI) / 180;
          const baseSpeed = (windSpeed / 100) * 2.5 + 0.4;
          
          // Slight dispersion spread
          const spreadAngle = angleRad + (Math.random() - 0.5) * 0.75;
          
          particles.push({
            x: sourceX,
            y: sourceY + (Math.random() - 0.5) * 8,
            vx: Math.cos(spreadAngle) * baseSpeed + (Math.random() - 0.5) * 0.3,
            vy: Math.sin(spreadAngle) * baseSpeed + (Math.random() - 0.5) * 0.3,
            alpha: 1.0,
            size: Math.random() * 3 + 1,
            color: getColor()
          });
        }
      }

      // Update position and rendering of particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= isDispensing ? 0.005 : 0.015; // Slow fade if dispensing, fast decay of old scent cloud
        
        if (p.alpha <= 0 || p.x > canvas.width || p.x < 0 || p.y > canvas.height || p.y < 0) {
          return false;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
        return true;
      });

      // Render coverage telemetry text
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.font = '8px monospace';
      const coverageVal = Math.min(100, Math.round((particles.length / 150) * 100));
      ctx.fillText(`AIR CLOUD DENSITY: ${coverageVal}%`, 10, canvas.height - 10);
      ctx.fillText(`DISPERSAL REACH: ${Math.round(factors.airPurity * 1.2 + windSpeed * 2.0)}m`, canvas.width - 120, canvas.height - 10);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [factors, windSpeed, windDirection, isDispensing]);

  return (
    <div className="relative w-full border border-emerald-500/10 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-slate-400 border border-emerald-500/10">
        <span className={`h-1.5 w-1.5 rounded-full ${isDispensing ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
        AIRFLOW WAVE SIMULATION
      </div>
      <canvas ref={canvasRef} className="block w-full h-[160px]" />
    </div>
  );
};

const ScentGeneratorView: React.FC = () => {
  const [factors, setFactors] = useState<EnvironmentalFactors>({
    plantDiversity: 75,
    animalPresence: 45,
    soilHealth: 80,
    waterQuality: 70,
    airPurity: 85,
  });

  const [windSpeed, setWindSpeed] = useState<number>(45);
  const [windDirection, setWindDirection] = useState<number>(15); // angle 0-360
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [dispenseProgress, setDispenseProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    "System connected. Standby logic awaiting trigger.",
    "Decentralized telemetry active. Transpiring bio-organic signals loaded."
  ]);
  const [activePreset, setActivePreset] = useState<string>("Greenhouse");

  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(40);

  // Sync Agromusika bio-synth system with ecological factor adjustments
  useEffect(() => {
    if (isSoundOn) {
      audioManager.startScentSynth(factors);
    } else {
      audioManager.stopScentSynth();
    }
  }, [isSoundOn]);

  useEffect(() => {
    if (isSoundOn) {
      audioManager.updateScentSynth(factors);
    }
  }, [factors, isSoundOn]);

  useEffect(() => {
    audioManager.setVolume(soundVolume / 100);
  }, [soundVolume]);

  useEffect(() => {
    return () => {
      audioManager.stopScentSynth();
    };
  }, []);

  const computedScent = calculateScentProfile(factors);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // Quick Ecosystem Preset configurations
  const presets = [
    {
      name: "Rainforest Canopy",
      description: "Hyper-diverse rainforest ecosystem values, generating premium primeval floral oxygen.",
      icon: Leaf,
      factors: { plantDiversity: 95, animalPresence: 85, soilHealth: 90, waterQuality: 85, airPurity: 95 },
      windSpeed: 20,
      windDirection: 45
    },
    {
      name: "Arid Oasis",
      description: "Clean dry wind, warm stones, sage and resinous brushwood.",
      icon: Mountain,
      factors: { plantDiversity: 40, animalPresence: 30, soilHealth: 65, waterQuality: 75, airPurity: 80 },
      windSpeed: 60,
      windDirection: 0
    },
    {
      name: "CEA Greenhouse",
      description: "Hydroponic clean room conditions with balanced floral notes.",
      icon: Droplets,
      factors: { plantDiversity: 80, animalPresence: 10, soilHealth: 70, waterQuality: 98, airPurity: 90 },
      windSpeed: 10,
      windDirection: 90
    },
    {
      name: "Spruce Ridge",
      description: "High altitude conifer forest, crisp woodiness and extreme pine air.",
      icon: Wind,
      factors: { plantDiversity: 65, animalPresence: 55, soilHealth: 85, waterQuality: 95, airPurity: 98 },
      windSpeed: 75,
      windDirection: 15
    },
    {
      name: "Regenerative Loam",
      description: "Healthy bio-organic compost and humus active signaling.",
      icon: PawPrint,
      factors: { plantDiversity: 30, animalPresence: 75, soilHealth: 95, waterQuality: 45, airPurity: 55 },
      windSpeed: 30,
      windDirection: 180
    }
  ];

  const pushLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-30), `[${timestamp}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Dispenser active pulsing/counting logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDispensing) {
      interval = setInterval(() => {
        setDispenseProgress(p => {
          if (p >= 100) {
            setIsDispensing(false);
            pushLog("Scent dispersion run concluded successfully. Diffuser entering cleaning purge sequence.");
            return 0;
          }
          // Periodic runtime log generation
          if (p % 20 === 0 && p > 0) {
            pushLog(`EnvirosAgro Node SV100 diffusing: ${computedScent.name} at air velocity ${windSpeed} CFM...`);
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isDispensing, windSpeed, computedScent.name]);

  const handleApplyPreset = (p: typeof presets[0]) => {
    setFactors(p.factors);
    setWindSpeed(p.windSpeed);
    setWindDirection(p.windDirection);
    setActivePreset(p.name);
    pushLog(`Loaded Preset: ${p.name}. Updating chemical composition modeling matrix.`);
  };

  const handleStartDispense = () => {
    if (isDispensing) {
      setIsDispensing(false);
      setDispenseProgress(0);
      pushLog("Dispensation aborted by command interface.");
    } else {
      setIsDispensing(true);
      setDispenseProgress(0);
      pushLog(`Establishing IoT M2M handshake for diffusion SV-NODE...`);
      pushLog(`Authorizing dispatch of "${computedScent.name}" scent recipe (Intensity: ${computedScent.intensity}%) on-chain...`);
      // Trigger scent active dispense sweep hum (Agromusika synthesized)
      try {
        audioManager.triggerDispenseHum(5000);
      } catch (e) {
        console.warn('Dispense sound trigger failed:', e);
      }
    }
  };

  const handleExportRecipe = () => {
    const recipeString = JSON.stringify({
      scentName: computedScent.name,
      ecologicalIntensity: computedScent.intensity,
      category: computedScent.category,
      recommendedAgriculturalUse: computedScent.application,
      environmentalFactors: factors,
      chemicalRatios: computedScent.compounds.map(c => ({ compound: c.name, ratio: `${c.percentage}%`, formula: c.formula }))
    }, null, 2);

    navigator.clipboard.writeText(recipeString);
    pushLog("Olfactory formulation recipe exported to system clipboard!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#090b11] text-slate-100 min-h-screen font-sans">
      {/* Top Telemetry Strip */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">SV-100 OLFACTORY CORE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase mt-1">
            Bio-Scent <span className="text-emerald-400">Generator</span>
          </h1>
        </div>
        <div className="flex gap-4 text-right font-mono text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-emerald-500/5">
          <div>
            <p className="text-slate-500">M2M HANDSHAKE</p>
            <p className="font-bold text-emerald-400">SECURE_ACTIVE</p>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <p className="text-slate-500">TRANSDUCER FREQ</p>
            <p className="font-bold text-white">42.5 kHz</p>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <p className="text-slate-500">ACTIVE ESSENTIALS</p>
            <p className="font-bold text-white">84.2%</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset & Environmental Configurations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Presets Card */}
          <div className="p-5 bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-400" /> Choose Ecosystem Presets
              </h2>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-800 text-emerald-400 rounded-full">
                Active: {activePreset}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {presets.map((p) => {
                const IconComp = p.icon;
                const isSelected = activePreset === p.name;
                return (
                  <button
                    key={p.name}
                    id={`btn-preset-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => handleApplyPreset(p)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500 text-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                        : 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <IconComp className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-bold tracking-tight uppercase block truncate w-full">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider Controls Card */}
          <div className="p-5 bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800/80 rounded-2xl">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 mb-4">
              <Sliders className="h-4 w-4 text-emerald-400" /> Fine-Tune Bio-Variables
            </h2>

            <div className="space-y-4">
              {/* Plant Diversity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <Leaf className="h-3.5 w-3.5 text-emerald-500" /> Plant Terpene Diversity
                  </span>
                  <span className="font-mono text-emerald-400 text-xs font-bold">{factors.plantDiversity}%</span>
                </div>
                <input
                  id="slider-plant"
                  type="range"
                  min="0"
                  max="100"
                  value={factors.plantDiversity}
                  onChange={(e) => {
                    setFactors({ ...factors, plantDiversity: Number(e.target.value) });
                    setActivePreset("Custom");
                  }}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Soil Health */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <Mountain className="h-3.5 w-3.5 text-amber-500" /> Soil Microbial Health
                  </span>
                  <span className="font-mono text-amber-400 text-xs font-bold">{factors.soilHealth}%</span>
                </div>
                <input
                  id="slider-soil"
                  type="range"
                  min="0"
                  max="100"
                  value={factors.soilHealth}
                  onChange={(e) => {
                    setFactors({ ...factors, soilHealth: Number(e.target.value) });
                    setActivePreset("Custom");
                  }}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Water Quality */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" /> Hydro-Aquatic Purity
                  </span>
                  <span className="font-mono text-blue-400 text-xs font-bold">{factors.waterQuality}%</span>
                </div>
                <input
                  id="slider-water"
                  type="range"
                  min="0"
                  max="100"
                  value={factors.waterQuality}
                  onChange={(e) => {
                    setFactors({ ...factors, waterQuality: Number(e.target.value) });
                    setActivePreset("Custom");
                  }}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Air Purity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <Wind className="h-3.5 w-3.5 text-teal-400" /> Atmospheric Isolation & Pure PM2.5
                  </span>
                  <span className="font-mono text-teal-400 text-xs font-bold">{factors.airPurity}%</span>
                </div>
                <input
                  id="slider-air"
                  type="range"
                  min="0"
                  max="100"
                  value={factors.airPurity}
                  onChange={(e) => {
                    setFactors({ ...factors, airPurity: Number(e.target.value) });
                    setActivePreset("Custom");
                  }}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Animal Presence */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <PawPrint className="h-3.5 w-3.5 text-purple-400" /> Faunal Activity & Pollinators
                  </span>
                  <span className="font-mono text-purple-400 text-xs font-bold">{factors.animalPresence}%</span>
                </div>
                <input
                  id="slider-animal"
                  type="range"
                  min="0"
                  max="100"
                  value={factors.animalPresence}
                  onChange={(e) => {
                    setFactors({ ...factors, animalPresence: Number(e.target.value) });
                    setActivePreset("Custom");
                  }}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

            </div>
          </div>

          {/* Scent dispersion canvas / airflow options */}
          <div className="p-5 bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" /> Olfactory Dispersion Map & Airflow Vector
              </h2>
              <span className="text-[8px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                SIMULATED GRID NODE
              </span>
            </div>

            <ScentCanvas 
              factors={factors}
              windSpeed={windSpeed}
              windDirection={windDirection}
              isDispensing={isDispensing}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                  <span>Dispersion Wind speed</span>
                  <span className="text-white font-bold">{windSpeed} CFM</span>
                </div>
                <input
                  id="slider-wind-speed"
                  type="range"
                  min="5"
                  max="100"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                  <span>Direction (Vane Angle)</span>
                  <span className="text-white font-bold">{windDirection}°</span>
                </div>
                <input
                  id="slider-wind-dir"
                  type="range"
                  min="0"
                  max="360"
                  value={windDirection}
                  onChange={(e) => setWindDirection(Number(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations, Molecule Compound Breakdown, Live Dispensing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Scent Profile Card */}
          <div className="p-6 bg-gradient-to-b from-[#111622] to-[#0c0f17] border-2 border-emerald-500/30 rounded-2xl relative overflow-hidden shadow-[0_0_24px_rgba(16,185,129,0.06)]">
            <div className="absolute top-0 right-0 p-3">
              <Sparkle className="h-10 w-10 text-emerald-500/15" />
            </div>

            <div className="space-y-3.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider border border-emerald-500/10 inline-block">
                {computedScent.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black italic text-white uppercase leading-none">
                {computedScent.name}
              </h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                {computedScent.description}
              </p>

              {/* Recommendations/Ecological application indicators */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-500/5 text-[10px] font-mono text-slate-300">
                <span className="text-[8px] font-bold text-emerald-500 uppercase block mb-1">
                  RECOMMENDED AGRI-APPLICATION:
                </span>
                {computedScent.application}
              </div>

              {/* Dynamic Note Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {computedScent.notes.map((n, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-300 uppercase tracking-wider">
                    {n}
                  </span>
                ))}
              </div>

              {/* Ecological Intensity Indicator */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono mb-1">
                  <span>ECOLOGICAL INTENSITY INDEX</span>
                  <span className="font-bold text-emerald-400">{computedScent.intensity}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: `${computedScent.intensity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Molecule Chemical Compound Breakdown */}
          <div className="p-5 bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800/80 rounded-2xl">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-emerald-400" /> Molecular Compound Ratio
            </h2>

            <div className="space-y-3.5">
              {computedScent.compounds.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-300">{c.name}</span>
                      <span className="text-[8px] text-slate-500 font-mono bg-slate-950 px-1 py-0.2 rounded">
                        {c.formula}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{c.percentage}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                  <p className="text-[8px] text-slate-500 leading-relaxed font-light">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Agromusika Bio-Acoustic Synthesizer Card */}
          <div className="p-5 bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-emerald-400" /> Agromusika Bio-Synthesizer
              </h2>
              <button
                id="btn-scent-toggle-sound"
                onClick={() => {
                  const newState = !isSoundOn;
                  setIsSoundOn(newState);
                  pushLog(newState 
                    ? "Agromusika Acoustic Engine ONLINE. Generating eco-harmony frequencies." 
                    : "Agromusika Acoustic Engine STANDBY.");
                }}
                className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                  isSoundOn 
                    ? 'bg-emerald-500/10 border-emerald-500 text-teal-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {isSoundOn ? '● ACTIVE' : '○ STANDBY'}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-light">
              Synthesizes real-time sonic harmonies bound directly to ecological factors: Soil (grounding drone), Plant diversity (sine voice), Water indexes (slow LFO ripples), and Air quality (filtered breeze). Powered by **Agromusika**.
            </p>

            {isSoundOn && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/10 space-y-3">
                {/* Audio parameters status display */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[9px] font-mono text-slate-400">
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>SOIL DRONE:</span>
                    <span className="text-amber-400 font-bold">{45 + Math.round((factors.soilHealth / 100) * 65)}Hz</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>PLANT HARMONY:</span>
                    <span className="text-emerald-400 font-bold">{160 + Math.round((factors.plantDiversity / 100) * 280)}Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WATER LFO:</span>
                    <span className="text-blue-400 font-bold">{(0.2 + (factors.waterQuality / 100) * 3.0).toFixed(1)}Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AIR WIND:</span>
                    <span className="text-teal-400 font-bold">{100 + Math.round((factors.airPurity / 100) * 1500)}Hz</span>
                  </div>
                </div>

                {/* Volume slider */}
                <div className="space-y-1 pt-1.5 border-t border-slate-905">
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                    <span>AGROMUSIKA MASTER GAIN</span>
                    <span>{soundVolume}%</span>
                  </div>
                  <input
                    id="slider-sound-volume"
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dispense controller & Trigger section */}
          <div className="p-5 bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800/80 rounded-2xl space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" /> IoT Handshake Controls
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                <span className="block text-[8px] text-slate-500 font-mono">FLOW RATE</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mt-1">
                  Dynamic CFM Drift
                </span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                <span className="block text-[8px] text-slate-500 font-mono">ON-CHAIN LEDGER</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mt-1">
                  SHA-256 SIGNED
                </span>
              </div>
            </div>

            {/* Custom Interactive Dispense Button and active bar */}
            <div className="space-y-3">
              {isDispensing && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono text-emerald-400">
                    <span>DIFFUSER PULSE RUNNING...</span>
                    <span>{dispenseProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-emerald-500/10">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full animate-pulse"
                      style={{ width: `${dispenseProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  id="btn-scent-dispense"
                  onClick={handleStartDispense}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all cursor-pointer ${
                    isDispensing 
                      ? 'bg-rose-900/30 border border-rose-500/50 hover:bg-rose-900/50 text-rose-300' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 hover:-translate-y-0.5'
                  }`}
                >
                  {isDispensing ? (
                    <>
                      <Square className="h-4.5 w-4.5 animate-pulse text-rose-400" />
                      Abort Dispense
                    </>
                  ) : (
                    <>
                      <Play className="h-4.5 w-4.5 text-white" />
                      Dispense Scent
                    </>
                  )}
                </button>

                <button
                  id="btn-scent-export"
                  onClick={handleExportRecipe}
                  title="Copy scent formulation recipe JSON"
                  className="px-3 border border-slate-700 hover:border-slate-500 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <Download className="h-4.2 w-4.2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Console Console Output log panel at bottom (fully responsive) */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl font-mono text-[9px] shadow-2xl">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-900">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-500" /> SYSTEM TELEMETRY LOGSTREAM
            </span>
            <button 
              id="btn-scent-clear-logs"
              onClick={() => setLogs([])}
              className="text-[8px] text-slate-500 hover:text-white hover:underline uppercase"
            >
              Clear Logs
            </button>
          </div>
          <div 
            ref={logContainerRef} 
            className="h-24 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 text-slate-450 pr-2"
          >
            {logs.map((log, index) => (
              <div key={index} className="leading-5 truncate">
                <span className="text-emerald-500/80">&gt;&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScentGeneratorView;
