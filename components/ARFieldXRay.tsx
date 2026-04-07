import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Box, Info, Map as MapIcon, Database, Zap, X, Crosshair, Layers, Bot, Target } from 'lucide-react';
import { Plot, spatialService } from '../services/spatialService';
import { User, SpatialTransform, Mission } from '../types';
import { listenToCollection } from '../services/firebaseService';

interface ARFieldXRayProps {
  user: User;
  onClose: () => void;
}

export const ARFieldXRay: React.FC<ARFieldXRayProps> = ({ user, onClose }) => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [robots, setRobots] = useState<Record<string, SpatialTransform>>({});
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'boundaries' | 'soil' | 'gps' | 'robots'>('boundaries');
  const [detectedAnchors, setDetectedAnchors] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!user.esin) return;
    const unsubscribe = listenToCollection('missions', (missions: Mission[]) => {
      const active = missions.find(m => m.status === 'ACTIVE');
      setActiveMission(active || null);
    });
    return () => unsubscribe();
  }, [user.esin]);

  useEffect(() => {
    const loadPlots = async () => {
      const allPlots = await spatialService.getPlots(user.esin);
      setPlots(allPlots.filter(p => p.stewardId === user.esin));
      setIsLoading(false);
    };
    loadPlots();

    spatialService.listenToRobots(setRobots);

    // Request camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Camera access denied:", err));
    }

    // Simulate anchor detection
    const interval = setInterval(() => {
      setDetectedAnchors(prev => {
        const newAnchor = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'GPS_LOCK',
          pos: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
          data: { accuracy: '0.02m', satellites: 12 }
        };
        return [...prev.slice(-5), newAnchor];
      });
    }, 3000);

    return () => {
        clearInterval(interval);
        spatialService.stopListening();
    };
  }, [user.esin]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col font-sans">
      {/* Camera Feed Background */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-50"
      />

      {/* AR Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Scanning Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Detected Anchors */}
        <AnimatePresence>
          {detectedAnchors.map((anchor) => (
            <motion.div
              key={anchor.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ left: `${anchor.pos.x}%`, top: `${anchor.pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-10 h-10 border-2 border-indigo-400 rounded-full animate-ping absolute inset-0" />
                <div className="w-10 h-10 bg-indigo-600/40 border border-indigo-400 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Zap size={16} className="text-white" />
                </div>
                <div className="absolute left-12 top-0 bg-black/90 border border-indigo-500/50 p-3 rounded-2xl backdrop-blur-xl min-w-[150px] shadow-2xl">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{anchor.type}</p>
                  <p className="text-xs text-white font-mono mt-1.5">ACC: {anchor.data.accuracy}</p>
                  <p className="text-xs text-white font-mono">SAT: {anchor.data.satellites}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Plot Boundaries Visualization (Simulated AR) */}
        {activeLayer === 'boundaries' && plots.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-[80%] h-[60%] border-4 border-dashed border-emerald-500/30 rounded-[40px] relative"
            >
              <div className="absolute top-4 left-4 bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 rounded-full backdrop-blur-md">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <MapIcon size={12} /> {plots[0].name} Boundary Detected
                </p>
              </div>
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-500" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-500" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500" />
            </motion.div>
          </div>
        )}

        {/* Soil Health Data Overlay */}
        {activeLayer === 'soil' && (
          <div className="absolute inset-0 grid grid-cols-3 gap-4 p-10 pt-32 pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-sm flex flex-col items-center justify-center text-center"
              >
                <Database size={16} className="text-indigo-400 mb-2" />
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SOIL_PH</p>
                <p className="text-xl font-mono font-black text-white">{(6.2 + Math.random()).toFixed(1)}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Robot Layer */}
        {activeLayer === 'robots' && Object.entries(robots).map(([id, robot]) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ left: `${(robot.pos.x % 100)}%`, top: `${(robot.pos.y % 100)}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-indigo-600/80 p-3 rounded-full border border-indigo-400 backdrop-blur-sm">
                <Bot size={20} className="text-white" />
            </div>
            <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mt-1 text-center bg-black/50 px-2 py-0.5 rounded-full">{id.slice(0, 8)}</p>
          </motion.div>
        ))}
      </div>

      {/* UI Controls */}
      <div className="relative z-10 flex flex-col h-full p-6 justify-between pointer-events-none">
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Camera size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">Field <span className="text-indigo-400">X-Ray</span></h1>
              <p className="text-[10px] text-indigo-400/60 font-mono uppercase tracking-widest">AR_ANCHOR_SYSTEM_v2.1</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all backdrop-blur-md"
          >
            <X size={24} />
          </button>
        </div>

        {/* Center Reticle */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair size={48} className="text-indigo-500/50 animate-pulse" />
            </div>
            {/* Scanning Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-0.5 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20"
            />
          </div>
        </div>

        {/* Footer Controls */}
        <div className="space-y-6 pointer-events-auto">
          {/* Active Mission Overlay */}
          {activeMission && (
            <div className="bg-indigo-950/90 backdrop-blur-2xl p-8 rounded-[40px] border border-indigo-500/50 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-5 mb-4">
                <Target className="text-indigo-400" size={32} />
                <h3 className="text-xl font-black uppercase tracking-widest">{activeMission.title}</h3>
              </div>
              <p className="text-sm text-indigo-100 italic">"{activeMission.objective}"</p>
            </div>
          )}
          {/* Layer Selector */}
          <div className="flex gap-3 bg-black/80 p-3 rounded-[40px] border border-white/20 backdrop-blur-2xl shadow-2xl">
            {[
              { id: 'boundaries', icon: MapIcon, label: 'Boundaries' },
              { id: 'soil', icon: Database, label: 'Soil Data' },
              { id: 'gps', icon: Zap, label: 'GPS Locks' },
              { id: 'robots', icon: Bot, label: 'Swarm' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-[32px] transition-all ${
                  activeLayer === layer.id 
                    ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <layer.icon size={24} />
                <span className="text-[11px] font-black uppercase tracking-widest">{layer.label}</span>
              </button>
            ))}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 py-6 bg-indigo-600/90 rounded-[32px] text-white shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
              <p className="text-xs font-black uppercase tracking-widest">System Online: RTK_FIX_LOCKED</p>
            </div>
            <p className="text-xs font-mono font-bold tracking-widest">LAT: -1.2833 | LNG: 36.8167</p>
          </div>
        </div>
      </div>
    </div>
  );
};
