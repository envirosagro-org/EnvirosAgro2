import React, { useState, useEffect } from 'react';
import { ShieldCheck, Camera, Mic, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConsentManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('agro_user_consent');
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = async () => {
    // Request permissions
    try {
      await navigator.geolocation.getCurrentPosition(() => {}, () => {});
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (e) {
      console.warn("Permissions denied or unavailable", e);
    }
    localStorage.setItem('agro_user_consent', 'true');
    setShowConsent(false);
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {showConsent && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 p-6 z-[9999] p-4"
          >
            <div className="max-w-4xl mx-auto glass-card rounded-[40px] border border-white/10 bg-black/90 p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center justify-center p-4 bg-emerald-900/20 rounded-3xl text-emerald-400">
                <ShieldCheck size={32} />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-white font-black uppercase tracking-widest text-sm">Data Consent & Permissions</h4>
                <p className="text-slate-400 text-xs italic">We require access to your location, camera, and microphone to provide full agricultural diagnostic capabilities and blockchain anchoring. By continuing, you consent to our use of cookies and these permissions.</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[8px] text-emerald-500 uppercase font-black"><MapPin size={10} /> Geolocation</div>
                  <div className="flex items-center gap-1.5 text-[8px] text-emerald-500 uppercase font-black"><Camera size={10} /> Camera</div>
                  <div className="flex items-center gap-1.5 text-[8px] text-emerald-500 uppercase font-black"><Mic size={10} /> Microphone</div>
                </div>
              </div>
              <button 
                onClick={handleConsent}
                className="px-10 py-4 bg-emerald-600 rounded-full text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all w-full md:w-auto"
              >
                Accept & Enable
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
