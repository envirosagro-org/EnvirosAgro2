import React, { useState, useEffect, useRef } from 'react';
import { spatialService, ARAnchor } from '../services/spatialService';
import { User } from '../types';
import { Camera, MapPin, Info, ShieldCheck, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ARFieldViewProps {
  user: User;
  onClose: () => void;
}

const ARFieldView: React.FC<ARFieldViewProps> = ({ user, onClose }) => {
  const [anchors, setAnchors] = useState<Record<string, ARAnchor>>({});
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    // Start Camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    // Listen to AR Anchors
    spatialService.listenToARAnchors(user.esin, (data) => {
      setAnchors(data);
    });

    // Device Orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [user.esin]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Background Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* AR Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {Object.values(anchors).map((anchor) => (
            <motion.div
              key={anchor.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${orientation.alpha}deg)`
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 backdrop-blur-md flex items-center justify-center animate-pulse">
                  <MapPin className="text-emerald-400" size={24} />
                </div>
                <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 text-center min-w-[120px]">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{anchor.type}</div>
                  <div className="text-xs font-bold text-white">{anchor.id}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* UI Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Camera className="text-emerald-400" size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">AR Field X-Ray</div>
              <div className="text-[10px] text-emerald-400 font-mono">STW: {user.esin}</div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Scanning Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              animate={{ height: [4, 12, 4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 bg-emerald-500 rounded-full"
            />
          ))}
        </div>
        <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-60">
          Scanning Spatial Anchors...
        </div>
      </div>

      {!isCameraReady && (
        <div className="absolute inset-0 bg-black flex flex-center flex-col gap-4">
          <Loader2 className="text-emerald-500 animate-spin" size={48} />
          <div className="text-xs font-black text-white uppercase tracking-widest">Initializing Optics</div>
        </div>
      )}
    </div>
  );
};

export default ARFieldView;
