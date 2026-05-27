import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  SmartphoneNfc, Cpu, MapPin, Search, X, Loader2, CheckCircle2, 
  ShieldCheck, ArrowRight, Upload, History, Binary, Leaf, 
  Satellite, Fingerprint, Lock, ShieldAlert, Zap, Globe, Compass, 
  Stamp, Workflow, Terminal, Code2, Download, AlertTriangle, Info,
  BadgeCheck, Monitor, History as HistoryIcon, Send, RefreshCw, Layers,
  FileText, Scan
} from 'lucide-react';
import { User, AgroResource, ViewState, SignalShard, HandshakeStep } from '../types';
import { HenIcon } from './Icons';
import { generateHandshakeAgroLang } from '../services/agroLangService';
import { toast } from 'sonner';
import GISPortal from './GISPortal';
import { spatialService } from '../services/ops/spatialService';

interface RegistryHandshakeProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, section?: string) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  onExecuteToShell?: (code: string) => void;
}

import { useRegistrationStore } from '../store/registrationStore';
import { useUiStore } from '../store/uiStore';
import { generateAlphanumericId } from '../systemFunctions';

const HARDWARE_PROTOCOL_STEPS: Partial<HandshakeStep>[] = [
  { id: 'NET_PAIR', label: 'Network Pairing' },
  { id: 'PROOF_INGEST', label: 'Ownership Proof' },
  { id: 'PHYSICAL_VERIFY', label: 'HQ Physical Audit' },
  { id: 'SYSTEM_AUDIT', label: 'System Finality' },
  { id: 'OS_SYNC', label: 'Network Sync' }
];

const LAND_PROTOCOL_STEPS: Partial<HandshakeStep>[] = [
  { id: 'GEO_LOCK', label: 'GPS / Geo-Lock' },
  { id: 'DOC_GEN', label: 'Document Generation' },
  { id: 'SOCIAL_AUTH', label: 'Social Authority' },
  { id: 'PHYSICAL_VERIFY', label: 'HQ Physical Audit' },
  { id: 'SYSTEM_AUDIT', label: 'System Finality' }
];

const calculateDistance = (p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) => {
  const R = 6371000; // Earth radius in meters
  const phi1 = p1.lat * Math.PI / 180;
  const phi2 = p2.lat * Math.PI / 180;
  const deltaPhi = (p2.lat - p1.lat) * Math.PI / 180;
  const deltaLambda = (p2.lng - p1.lng) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

const calculatePolygonAreaAndPerimeter = (coords: { lat: number; lng: number }[]) => {
  if (!coords || coords.length < 3) return { area: 0, perimeter: 0, compactness: 0 };
  
  // Perimeter
  let perimeter = 0;
  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    perimeter += calculateDistance(p1, p2);
  }
  
  // Area (Equirectangular Shoelace Offset approximation for fast sub-regional agriculture scales)
  const latToMeters = 111320;
  const origin = coords[0];
  const lngToMeters = 111320 * Math.cos(origin.lat * Math.PI / 180);
  
  let areaSum = 0;
  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    
    const x1 = (p1.lng - origin.lng) * lngToMeters;
    const y1 = (p1.lat - origin.lat) * latToMeters;
    const x2 = (p2.lng - origin.lng) * lngToMeters;
    const y2 = (p2.lat - origin.lat) * latToMeters;
    
    areaSum += (x1 * y2) - (x2 * y1);
  }
  const area = Math.abs(areaSum) / 2;
  
  // Isoperimetric Compactness Quotient: (4 * pi * Area) / (Perimeter^2) * 100
  let compactness = 0;
  if (perimeter > 0) {
    compactness = (4 * Math.PI * area) / (perimeter * perimeter) * 100;
  }
  compactness = Math.min(100, Math.max(0, compactness));
  
  return { area, perimeter, compactness };
};

const RegistryHandshake: React.FC<RegistryHandshakeProps> = ({ 
  user, onUpdateUser, onSpendEAC, onNavigate, onEmitSignal, onExecuteToShell 
}) => {
  const { handshakeRegistrationState, setHandshakeRegistrationState } = useRegistrationStore();
  const selectedPlot = useUiStore(state => state.selectedPlot);
  const [showResumePrompt, setShowResumePrompt] = useState(!!handshakeRegistrationState);
  const [mode, setMode] = useState<'HARDWARE' | 'LAND' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Data collection
  const [assetName, setAssetName] = useState(selectedPlot ? selectedPlot.name : '');
  const [assetType, setAssetType] = useState('Moisture Array');
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');
  const [agroLangShard, setAgroLangShard] = useState<any>(null);

  // GPS Land Plotting States for Circumnavigation Workflow
  const [plottingPhase, setPlottingPhase] = useState<'IDLE' | 'CENTER_MARKED' | 'START_ANCHORED' | 'DRAWING' | 'COMPLETED'>('IDLE');
  const [plotCenter, setPlotCenter] = useState<{ lat: number, lng: number } | null>(null);
  const [boundaryStart, setBoundaryStart] = useState<{ lat: number, lng: number } | null>(null);
  const [isDrawingBoundary, setIsDrawingBoundary] = useState(false);
  const [boundaryPath, setBoundaryPath] = useState<{ lat: number, lng: number }[]>([]);
  const [currentGPS, setCurrentGPS] = useState<{ lat: number, lng: number }>({ lat: -1.2921, lng: 36.8219 });
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(3.5);
  const [mappingMethod, setMappingMethod] = useState<'GPS_CIRCUIT' | 'GIS_PORTAL'>('GPS_CIRCUIT');

  const deedStats = useMemo(() => {
    if (boundaryPath && boundaryPath.length >= 3) {
      return calculatePolygonAreaAndPerimeter(boundaryPath);
    }
    if (selectedPlot?.geometry?.coordinates?.[0]) {
      const list = selectedPlot.geometry.coordinates[0].map((c: any) => ({ lat: c[0], lng: c[1] }));
      return calculatePolygonAreaAndPerimeter(list);
    }
    return { area: 0, perimeter: 0, compactness: 0 };
  }, [boundaryPath, selectedPlot]);

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGPS({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setGpsAccuracy(pos.coords.accuracy || 2.4);
        },
        () => console.log('Location detection deferred to virtual radar simulation'),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const getRelativePosition = (pt: { lat: number, lng: number }) => {
    if (!plotCenter) return { x: 120, y: 120 };
    // Center at 120, 120. Scale factor approx 180000 for high resolution zoom
    const scale = 180000;
    const dx = (pt.lng - plotCenter.lng) * scale;
    const dy = (plotCenter.lat - pt.lat) * scale; // invert y for SVG coordinate system
    return {
      x: Math.max(15, Math.min(225, 120 + dx)),
      y: Math.max(15, Math.min(225, 120 + dy))
    };
  };

  const handleMarkCenter = () => {
    setIsProcessing(true);
    setStatusMsg('SENSING FIELD RADAR...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPlotCenter(pt);
          setCurrentGPS(pt);
          setGpsAccuracy(pos.coords.accuracy || 1.8);
          setPlottingPhase('CENTER_MARKED');
          setIsProcessing(false);
          toast.success('Githaka central point marked!');
        },
        () => {
          const pt = { lat: -1.2918 + (Math.random() - 0.5) * 0.0004, lng: 36.8222 + (Math.random() - 0.5) * 0.0004 };
          setPlotCenter(pt);
          setCurrentGPS(pt);
          setPlottingPhase('CENTER_MARKED');
          setIsProcessing(false);
          toast.success('Central point established in Mugumo Cluster Hub (Simulated)');
        },
        { enableHighAccuracy: true }
      );
    } else {
      const pt = { lat: -1.2921, lng: 36.8219 };
      setPlotCenter(pt);
      setPlottingPhase('CENTER_MARKED');
      setIsProcessing(false);
    }
  };

  const handleMarkStart = () => {
    setIsProcessing(true);
    setStatusMsg('LOCKING BOUNDARY START POINT...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setBoundaryStart(pt);
          setCurrentGPS(pt);
          setBoundaryPath([pt]);
          setPlottingPhase('START_ANCHORED');
          setIsProcessing(false);
          toast.success('Perimeter boundary start anchored!');
        },
        () => {
          // Set start point nearby the center
          const offsetLat = plotCenter ? plotCenter.lat + 0.0003 : -1.2918;
          const offsetLng = plotCenter ? plotCenter.lng - 0.0003 : 36.8216;
          const pt = { lat: offsetLat, lng: offsetLng };
          setBoundaryStart(pt);
          setCurrentGPS(pt);
          setBoundaryPath([pt]);
          setPlottingPhase('START_ANCHORED');
          setIsProcessing(false);
          toast.success('Perimeter start point anchored (Simulated boundary start)');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleBeginDrawing = () => {
    setIsDrawingBoundary(true);
    setPlottingPhase('DRAWING');
    toast.info('Movement tracking active! Walk along the perimeter.');

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentGPS(pt);
          setGpsAccuracy(pos.coords.accuracy || 2.1);
          setBoundaryPath((prev) => {
            const last = prev[prev.length - 1];
            if (last) {
              const diffLat = Math.abs(last.lat - pt.lat);
              const diffLng = Math.abs(last.lng - pt.lng);
              if (diffLat < 1e-7 && diffLng < 1e-7) return prev;
            }
            return [...prev, pt];
          });
        },
        () => console.log('Continuous tracking operating in custom virtual locus space'),
        { enableHighAccuracy: true }
      );
      watchIdRef.current = id;
    }
  };

  const stopGpsWatcher = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleSimulateWalkDirection = (direction: 'N' | 'E' | 'S' | 'W' | 'NE' | 'NW' | 'SE' | 'SW') => {
    if (!isDrawingBoundary) return;
    const stepSize = 0.00018; // approx 20 meters step
    let dLat = 0;
    let dLng = 0;
    switch (direction) {
      case 'N': dLat = stepSize; break;
      case 'S': dLat = -stepSize; break;
      case 'E': dLng = stepSize; break;
      case 'W': dLng = -stepSize; break;
      case 'NE': dLat = stepSize * 0.7; dLng = stepSize * 0.7; break;
      case 'NW': dLat = stepSize * 0.7; dLng = -stepSize * 0.7; break;
      case 'SE': dLat = -stepSize * 0.7; dLng = stepSize * 0.7; break;
      case 'SW': dLat = -stepSize * 0.7; dLng = -stepSize * 0.7; break;
    }

    setCurrentGPS((prev) => {
      const next = { lat: prev.lat + dLat, lng: prev.lng + dLng };
      setBoundaryPath((path) => [...path, next]);
      return next;
    });
  };

  const handleAutoWalkSim = () => {
    if (!isDrawingBoundary || !boundaryStart) return;
    setIsProcessing(true);
    setStatusMsg('RUNNING AUTONOMOUS GPS LOOP...');
    
    // Create a loop path starting from boundaryStart and ending back near it
    const start = boundaryStart;
    const offset1 = { lat: start.lat + 0.0006, lng: start.lng + 0.0001 };
    const offset2 = { lat: start.lat + 0.0005, lng: start.lng + 0.0007 };
    const offset3 = { lat: start.lat - 0.0002, lng: start.lng + 0.0006 };
    const offset4 = { lat: start.lat - 0.0004, lng: start.lng - 0.0001 };

    const simulatedRoute = [start, offset1, offset2, offset3, offset4];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < simulatedRoute.length) {
        const pt = simulatedRoute[i];
        setCurrentGPS(pt);
        setBoundaryPath((prev) => [...prev, pt]);
        i++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        toast.success('Dynamic circular boundary mapped!');
      }
    }, 800);
  };

  const handleCompletePlotting = async () => {
    if (boundaryPath.length < 3) {
      toast.error('BOUNDARY RECONSTITUTE ERROR: Locus requires at least 3 points to formulate a plot.');
      return;
    }

    setIsProcessing(true);
    setStatusMsg('ANCHORING PHYSICAL LAND BOUNDS...');
    stopGpsWatcher();
    setIsDrawingBoundary(false);

    // Formulate closed GeoJSON
    const closedPath = [...boundaryPath, boundaryPath[0]];
    const coordinates = [closedPath.map(pt => [pt.lat, pt.lng])];

    const plotId = `plot-${generateAlphanumericId(6)}`;
    const finalAssetName = assetName || `Githaka Shard ${generateAlphanumericId(4).toUpperCase()}`;

    const customPlot = {
      id: plotId,
      stewardId: user.esin,
      name: finalAssetName,
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      }
    };

    try {
      await spatialService.savePlot(customPlot);
      useUiStore.getState().setSelectedPlot(customPlot);
      setAssetName(customPlot.name);
      setPlottingPhase('COMPLETED');
      toast.success(`Success! Geo-locked boundary registered to the industrial ledger.`);
    } catch (e) {
      useUiStore.getState().setSelectedPlot(customPlot);
      setAssetName(customPlot.name);
      setPlottingPhase('COMPLETED');
      toast.success(`Registered! Boundary mapped and selected locally.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPlotting = () => {
    stopGpsWatcher();
    setIsDrawingBoundary(false);
    setPlottingPhase('IDLE');
    setPlotCenter(null);
    setBoundaryStart(null);
    setBoundaryPath([]);
  };

  useEffect(() => {
    if (selectedPlot && mode === 'LAND') {
      setAssetName(selectedPlot.name);
    }
  }, [selectedPlot, mode]);

  const isSuccessRef = useRef(false);
  const stateRef = useRef({ mode, currentStep, assetName, assetType, evidenceFile, esinSign, agroLangShard });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = { mode, currentStep, assetName, assetType, evidenceFile, esinSign, agroLangShard };
  }, [mode, currentStep, assetName, assetType, evidenceFile, esinSign, agroLangShard]);

  // Sync local state with handshakeRegistrationState
  useEffect(() => {
    if (handshakeRegistrationState && !showResumePrompt) {
      if (handshakeRegistrationState.mode) setMode(handshakeRegistrationState.mode);
      if (handshakeRegistrationState.currentStep) setCurrentStep(handshakeRegistrationState.currentStep);
      if (handshakeRegistrationState.assetName) setAssetName(handshakeRegistrationState.assetName);
      if (handshakeRegistrationState.assetType) setAssetType(handshakeRegistrationState.assetType);
      if (handshakeRegistrationState.evidenceFile) setEvidenceFile(handshakeRegistrationState.evidenceFile);
      if (handshakeRegistrationState.esinSign) setEsinSign(handshakeRegistrationState.esinSign);
      if (handshakeRegistrationState.agroLangShard) setAgroLangShard(handshakeRegistrationState.agroLangShard);
    }
  }, [handshakeRegistrationState, showResumePrompt]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.mode && !isSuccessRef.current) {
        setHandshakeRegistrationState(stateRef.current);
      }
    };
  }, [setHandshakeRegistrationState]);

  const steps = mode === 'HARDWARE' ? HARDWARE_PROTOCOL_STEPS : LAND_PROTOCOL_STEPS;
  const isLastStep = currentStep === steps.length - 1;

  const handleModeSelect = (m: 'HARDWARE' | 'LAND') => {
    isSuccessRef.current = false;
    setMode(m);
    setCurrentStep(0);
    setEvidenceFile(null);
    setAgroLangShard(null);
    setAssetName('');
  };

  const handleNextStep = async () => {
    setIsProcessing(true);
    const stepId = steps[currentStep].id;

    try {
      if (mode === 'HARDWARE') {
        switch (stepId) {
          case 'NET_PAIR':
            setStatusMsg('ESTABLISHING SECURE TUNNEL...');
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'PROOF_INGEST':
            setStatusMsg('VERIFYING BIO-METRIC PROOF...');
            await new Promise(r => setTimeout(r, 1500));
            break;
          case 'PHYSICAL_VERIFY':
            setStatusMsg('AWAITING SHARD SCAN...');
            // In a real app we'd wait for scanner, here we simulate a successful scan if it's the "Next" step
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'SYSTEM_AUDIT':
            setStatusMsg('EXECUTING REGISTRY CROSS-CHECK...');
            await new Promise(r => setTimeout(r, 1500));
            break;
          case 'OS_SYNC':
            setStatusMsg('FORGING AGROLANG SYNC SHARD...');
            const res = await generateHandshakeAgroLang('HARDWARE', { name: assetName, type: assetType });
            setAgroLangShard(res.json);
            break;
        }
      } else {
        switch (stepId) {
          case 'GEO_LOCK':
            setStatusMsg('CALIBRATING GPS SHARDS...');
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'DOC_GEN':
            setStatusMsg('FORGING DOCUMENT SHARD...');
            const landRes = await generateHandshakeAgroLang('LAND', { name: assetName, loc: user.location });
            setAgroLangShard(landRes.json);
            break;
          case 'SOCIAL_AUTH':
            setStatusMsg('VERIFYING SOCIAL HANDSHAKE...');
            await new Promise(r => setTimeout(r, 1500));
            break;
          case 'PHYSICAL_VERIFY':
            setStatusMsg('NOTIFYING HQ AUDITORS...');
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'SYSTEM_AUDIT':
            setStatusMsg('FINALIZING LEDGER ANCHOR...');
            await new Promise(r => setTimeout(r, 1500));
            break;
        }
      }

      if (!isLastStep) {
        setCurrentStep(prev => prev + 1);
      } else if (agroLangShard || stepId === 'SYSTEM_AUDIT') {
        setCurrentStep(steps.length);
      }
    } catch (err) {
      toast.error("HANDSHAKE ERROR: Protocol sync failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalize = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      toast.error("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const fee = 100;
    if (!await onSpendEAC(fee, `REGISTRY_HANDSHAKE_${mode}`)) return;

    setIsProcessing(true);
    setStatusMsg('COMMITTING TO PERMANENT REGISTRY...');
    
    const newResource: AgroResource = {
      id: `SHD-${generateAlphanumericId(4)}`,
      category: mode!,
      name: assetName,
      type: assetType,
      status: 'VERIFIED',
      capabilities: ['Registry Sync', 'm-Resonance Ingest'],
      verificationMeta: {
        method: mode === 'HARDWARE' ? 'IOT_HANDSHAKE' : 'GEO_LOCK',
        verifiedAt: new Date().toISOString(),
        confidenceScore: 0.98,
        coordinates: user.coords || { lat: 0, lng: 0 }
      }
    };

    setTimeout(async () => {
      const currentResources = user.resources || [];
      onUpdateUser({ ...user, resources: [newResource, ...currentResources] });
      
      await onEmitSignal({
        type: 'ledger_anchor',
        origin: 'ORACLE',
        title: `${mode}_HANDSHAKE_FINALIZED`,
        message: `Node ${user.esin} anchored a new ${mode} shard: ${assetName}.`,
        priority: 'high',
        actionIcon: 'ShieldCheck'
      });

      isSuccessRef.current = true;
      setHandshakeRegistrationState(null);
      setIsProcessing(false);
      setCurrentStep(steps.length + 1); // Success state
    }, 2500);
  };

  const handleExecuteToShell = () => {
    if (agroLangShard?.code && onExecuteToShell) {
      onExecuteToShell(agroLangShard.code);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4 relative overflow-hidden">
      
      {/* HUD Header */}
      <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
            <SmartphoneNfc size={500} className="text-white" />
         </div>
         <div className="w-36 h-36 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] shrink-0 border-4 border-white/10 group-hover:scale-105 transition-all">
            <SmartphoneNfc size={64} className="text-white animate-float" />
         </div>
         <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-1">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-emerald-400">Handshake.</span></h2>
               <p className="text-emerald-500/60 text-[10px] font-mono tracking-[0.5em] uppercase mt-2">ZK_PAIRING_PROTOCOL_v6.5</p>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
               "Linking physical assets to the industrial grid. Complete protocol cycles for hardware pairing or physical land verification."
            </p>
         </div>
      </div>

      <div className="min-h-[750px] relative z-10">
        {!mode ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in duration-500 max-w-4xl mx-auto">
              <div 
                 onClick={() => handleModeSelect('HARDWARE')}
                 className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-blue-500/40 transition-all group flex flex-col items-center text-center space-y-10 shadow-3xl cursor-pointer active:scale-95"
              >
                 <div className="p-10 rounded-[44px] bg-blue-600/10 border-2 border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <Cpu size={64} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Hardware <span className="text-blue-400">Pairing</span></h4>
                    <p className="text-slate-500 text-lg font-medium italic">IOT nodes, drones, and processing machinery.</p>
                 </div>
              </div>
              <div 
                 onClick={() => handleModeSelect('LAND')}
                 className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group flex flex-col items-center text-center space-y-10 shadow-3xl cursor-pointer active:scale-95"
              >
                 <div className="p-10 rounded-[44px] bg-emerald-600/10 border-2 border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <MapPin size={64} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Land <span className="text-emerald-400">Verification</span></h4>
                    <p className="text-slate-500 text-lg font-medium italic">Githaka plots and geofenced production nodes.</p>
                 </div>
              </div>
           </div>
        ) : currentStep < steps.length ? (
           <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex gap-4 px-10 relative z-20">
                 {steps.map((s, i) => (
                    <div key={s.id} className="flex-1 flex flex-col gap-3">
                       <div className={`h-2 rounded-full transition-all duration-700 ${i <= currentStep ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}></div>
                       <span className={`text-[8px] font-black uppercase text-center tracking-widest ${i === currentStep ? 'text-indigo-400' : 'text-slate-700'}`}>{s.label}</span>
                    </div>
                 ))}
              </div>

              <div className="glass-card p-16 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 shadow-4xl relative overflow-hidden flex flex-col items-center text-center space-y-10">
                 {isProcessing ? (
                    <div className="py-20 flex flex-col items-center gap-12 animate-in zoom-in">
                       <div className="relative">
                          <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Binary size={40} className="text-indigo-400 animate-pulse" />
                          </div>
                       </div>
                       <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">{statusMsg}</p>
                    </div>
                 ) : (
                    <div className="w-full space-y-12 animate-in slide-in-from-right-4 duration-500">
                       <div className="space-y-4">
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">{steps[currentStep].label}</h3>
                          <p className="text-slate-400 text-xl font-medium italic opacity-70">
                             {mode === 'HARDWARE' 
                               ? 'Pairing hardware via robust network handshake to secure the M2M bridge.' 
                               : 'Triggering GPS geo-lock to verify biological cluster coordinates.'}
                          </p>
                       </div>

                       {currentStep === 0 && (
                          <div className="max-w-3xl mx-auto space-y-8">
                             <div className="space-y-3 px-4 text-left">
                                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4">Asset Alias</label>
                                <input 
                                   type="text" value={assetName} onChange={e => setAssetName(e.target.value)}
                                   placeholder="e.g. Zone 4 Soil Array"
                                   className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 shadow-inner italic" 
                                />
                             </div>
                             {mode === 'LAND' ? (
                               <div className="space-y-6 px-4">
                                 {/* Selection Tab */}
                                 <div className="flex gap-4 p-1.5 bg-black/60 border border-white/10 rounded-2xl">
                                   <button 
                                     type="button"
                                     onClick={() => { setMappingMethod('GPS_CIRCUIT'); handleResetPlotting(); }}
                                     className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${mappingMethod === 'GPS_CIRCUIT' ? 'bg-indigo-600/90 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                   >
                                     GPS Perimeter Mapping (Circumnavigate)
                                   </button>
                                   <button 
                                     type="button"
                                     onClick={() => { setMappingMethod('GIS_PORTAL'); handleResetPlotting(); }}
                                     className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${mappingMethod === 'GIS_PORTAL' ? 'bg-indigo-600/90 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                   >
                                     Static GIS Database Selector
                                   </button>
                                 </div>

                                 {mappingMethod === 'GIS_PORTAL' ? (
                                   <div className="space-y-3">
                                     <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4">Select Plot from GIS Portal</label>
                                     <div className="w-full rounded-[32px] overflow-hidden border-2 border-white/10">
                                       <GISPortal user={user} onEmitSignal={onEmitSignal} />
                                     </div>
                                     {selectedPlot && (
                                       <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mt-2">
                                         <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">✔ Selected Plot Active</span>
                                         <span className="text-white font-mono text-xs font-bold">{selectedPlot.name}</span>
                                       </div>
                                     )}
                                   </div>
                                 ) : (
                                   <div className="glass-card p-8 border border-white/10 rounded-[40px] bg-black/40 space-y-6 relative overflow-hidden">
                                     
                                     {/* Satellite Overlay Accent */}
                                     <div className="absolute top-4 right-4 text-slate-700 pointer-events-none flex items-center gap-1.5 font-mono text-[7px] tracking-widest uppercase">
                                       <Satellite size={14} className="animate-spin-slow text-indigo-400/50" /> GPS Precision Locked
                                     </div>

                                     <div className="space-y-2">
                                       <h4 className="text-lg font-black text-white uppercase tracking-wider">GPS perimeter circumnavigator</h4>
                                       <p className="text-slate-400 text-xs italic">
                                         Step-by-step land mapping. Stand where the plot is to mark center, walk to boundary start, then circumnavigate to trace real coordinates.
                                       </p>
                                     </div>

                                     {/* Interactive Radar Visualizer */}
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                       
                                       {/* Dynamic coordinate canvas display */}
                                       <div className="aspect-square w-full bg-slate-950/90 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative p-4 shadow-inner overflow-hidden">
                                         
                                         {/* BG grid lines */}
                                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d1d2b_1px,transparent_1px),linear-gradient(to_bottom,#1d1d2b_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>
                                         
                                         {/* Standard radar target circle overlay */}
                                         <div className="absolute inset-4 border border-indigo-500/10 rounded-full pointer-events-none"></div>
                                         <div className="absolute inset-16 border border-indigo-500/10 rounded-full pointer-events-none"></div>
                                         <div className="absolute inset-28 border border-indigo-500/10 rounded-full pointer-events-none"></div>

                                         {plotCenter ? (
                                           <svg className="w-full h-full relative z-10" viewBox="0 0 240 240">
                                             
                                             {/* 1. Central Locus Point */}
                                             <circle 
                                               cx={getRelativePosition(plotCenter).x} 
                                               cy={getRelativePosition(plotCenter).y} 
                                               r={6} 
                                               fill="#EF4444" 
                                               className="animate-pulse"
                                             />
                                             <text 
                                               x={getRelativePosition(plotCenter).x + 8} 
                                               y={getRelativePosition(plotCenter).y - 4} 
                                               fill="#EF4444" 
                                               fontSize={6} 
                                               fontFamily="monospace"
                                               fontWeight="bold"
                                             >
                                               CENTER
                                             </text>

                                             {/* 2. Boundary Start marker */}
                                             {boundaryStart && (
                                               <g>
                                                 <circle 
                                                   cx={getRelativePosition(boundaryStart).x} 
                                                   cy={getRelativePosition(boundaryStart).y} 
                                                   r={5} 
                                                   fill="#EAB308" 
                                                 />
                                                 <text 
                                                   x={getRelativePosition(boundaryStart).x + 8} 
                                                   y={getRelativePosition(boundaryStart).y - 4} 
                                                   fill="#EAB308" 
                                                   fontSize={6} 
                                                   fontFamily="monospace"
                                                 >
                                                   START
                                                 </text>
                                               </g>
                                             )}

                                             {/* 3. Drawn Boundary Line */}
                                             {boundaryPath.length > 1 && (
                                               <polyline
                                                 points={boundaryPath.map(pt => `${getRelativePosition(pt).x},${getRelativePosition(pt).y}`).join(' ')}
                                                 fill="none"
                                                 stroke="#10B981"
                                                 strokeWidth={2}
                                                 strokeDasharray={isDrawingBoundary ? "4, 3" : undefined}
                                               />
                                             )}

                                             {/* 4. Live location dot tracker cursor */}
                                             {currentGPS && (
                                               <circle 
                                                 cx={getRelativePosition(currentGPS).x} 
                                                 cy={getRelativePosition(currentGPS).y} 
                                                 r={4} 
                                                 fill="#3B82F6" 
                                               />
                                             )}
                                           </svg>
                                         ) : (
                                           <div className="text-center space-y-3 relative z-10 p-6">
                                             <Compass size={40} className="text-slate-600 animate-pulse mx-auto" />
                                             <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">GPS RADAR OFFLINE</p>
                                           </div>
                                         )}

                                         {/* Telemetry Footer inside Canvas */}
                                         <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[7px] font-mono text-slate-500 select-none z-20">
                                           <span>POS: {currentGPS.lat.toFixed(5)}, {currentGPS.lng.toFixed(5)}</span>
                                           <span>ACCURACY: ±{gpsAccuracy.toFixed(1)}m</span>
                                         </div>
                                       </div>

                                       {/* State machine controls (Steps list & buttons) */}
                                       <div className="space-y-4 text-left">
                                         
                                         {/* Stage metrics status */}
                                         <div className="bg-black/80 rounded-2xl p-4 border border-white/5 space-y-2.5">
                                           <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest pb-1 border-b border-white/5">
                                             <span className="text-indigo-400">Plotted Phase</span>
                                             <span className="font-bold text-white text-[10px]">{plottingPhase}</span>
                                           </div>
                                           <div className="space-y-1.5 pt-1 font-sans">
                                             <div className="flex items-center gap-2 text-[10px] select-none text-slate-300">
                                               <span className={`w-2 h-2 rounded-full ${plotCenter ? 'bg-emerald-500' : 'bg-white/15'}`} />
                                               <span className={plotCenter ? 'text-slate-400 line-through' : ''}>1. Central Locus Plot Marked</span>
                                             </div>
                                             <div className="flex items-center gap-2 text-[10px] select-none text-slate-300">
                                               <span className={`w-2 h-2 rounded-full ${boundaryStart ? 'bg-emerald-500' : 'bg-white/15'}`} />
                                               <span className={boundaryStart ? 'text-slate-400 line-through' : ''}>2. Boundary Line Start Anchored</span>
                                             </div>
                                             <div className="flex items-center gap-2 text-[10px] select-none text-slate-300">
                                               <span className={`w-2 h-2 rounded-full ${plottingPhase === 'COMPLETED' ? 'bg-emerald-500' : (isDrawingBoundary ? 'bg-indigo-500 animate-pulse' : 'bg-white/15')}`} />
                                               <span className={plottingPhase === 'COMPLETED' ? 'text-slate-400 line-through' : ''}>3. Perimeter Circumnavigated</span>
                                             </div>
                                           </div>
                                         </div>

                                         {/* Interactive Phase Actions */}
                                         <div className="space-y-3 font-sans font-bold">
                                           {plottingPhase === 'IDLE' && (
                                             <button
                                               type="button"
                                               onClick={handleMarkCenter}
                                               className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                             >
                                               <MapPin size={14} /> Stand at Center & Mark GPS
                                             </button>
                                           )}

                                           {plottingPhase === 'CENTER_MARKED' && (
                                             <div className="space-y-3">
                                               <p className="text-[10px] text-slate-400 italic bg-white/5 p-3 rounded-xl border border-white/10 font-normal">
                                                 Now move to the perimeter boundary start position of your land and trigger anchoring.
                                               </p>
                                               <button
                                                 type="button"
                                                 onClick={handleMarkStart}
                                                 className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                               >
                                                 <Compass size={14} className="animate-spin-slow" /> Anchor Boundary Start GPS
                                               </button>
                                             </div>
                                           )}

                                           {(plottingPhase === 'START_ANCHORED' || plottingPhase === 'DRAWING') && (
                                             <div className="space-y-3">
                                               {!isDrawingBoundary ? (
                                                 <button
                                                   type="button"
                                                   onClick={handleBeginDrawing}
                                                   className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                                 >
                                                   <Send size={14} /> Begin Tracking Perimeter
                                                 </button>
                                                ) : (
                                                  <div className="space-y-4">
                                                    
                                                    {/* Simulated Walking Controls */}
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                                                      <div className="flex justify-between items-center pb-1">
                                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Walk Simulator / Joystick</span>
                                                        <button 
                                                          type="button"
                                                          onClick={handleAutoWalkSim}
                                                          className="px-2 py-0.5 border border-indigo-500/30 rounded bg-indigo-500/10 text-[8px] font-black text-indigo-300 uppercase hover:bg-indigo-500 hover:text-white transition-all"
                                                        >
                                                          Simulate Circle Loop
                                                        </button>
                                                      </div>
                                                      <div className="grid grid-cols-3 gap-2 max-w-[150px] mx-auto pt-1">
                                                        <div />
                                                        <button type="button" onClick={() => handleSimulateWalkDirection('N')} className="p-2 border border-white/10 rounded bg-black/60 hover:bg-white/10 text-xs text-center font-bold">▲</button>
                                                        <div />
                                                        <button type="button" onClick={() => handleSimulateWalkDirection('W')} className="p-2 border border-white/10 rounded bg-black/60 hover:bg-white/10 text-xs text-center font-bold">◀</button>
                                                        <div className="p-2 flex items-center justify-center text-[8px] text-slate-600 font-mono">WALK</div>
                                                        <button type="button" onClick={() => handleSimulateWalkDirection('E')} className="p-2 border border-white/10 rounded bg-black/60 hover:bg-white/10 text-xs text-center font-bold">▶</button>
                                                        <div />
                                                        <button type="button" onClick={() => handleSimulateWalkDirection('S')} className="p-2 border border-white/10 rounded bg-black/60 hover:bg-white/10 text-xs text-center font-bold">▼</button>
                                                        <div />
                                                      </div>
                                                    </div>

                                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-[10px] text-emerald-400 italic font-normal">
                                                      Locus Anchors Captured: <strong>{boundaryPath.length}</strong> points
                                                    </div>

                                                    <button
                                                      type="button"
                                                      onClick={handleCompletePlotting}
                                                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                      <CheckCircle2 size={14} /> Complete & Save Boundary
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {plottingPhase === 'COMPLETED' && (
                                              <div className="space-y-3">
                                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center">
                                                  <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5">
                                                    ✔ Plot Mapping Confirmed!
                                                  </p>
                                                  <p className="text-slate-400 text-[10px] italic mt-1 font-sans font-normal">Ready to initialize blockchain registry handshake.</p>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={handleResetPlotting}
                                                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-white/10"
                                                >
                                                  Clear & Re-Plot Perimeter
                                                </button>
                                              </div>
                                            )}

                                            {plottingPhase !== 'IDLE' && plottingPhase !== 'COMPLETED' && (
                                              <button
                                                type="button"
                                                onClick={handleResetPlotting}
                                                className="w-full py-2 text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest text-center"
                                              >
                                                Cancel and Reset
                                              </button>
                                            )}
                                          </div>

                                        </div>

                                      </div>

                                    </div>
                                  )}

                                </div>
                              ) : null}
                             <button onClick={handleNextStep} disabled={!assetName || (mode === 'LAND' && !selectedPlot)} className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ring-white/5 active:scale-95 disabled:opacity-30">
                                INITIALIZE HANDSHAKE <ArrowRight size={20} />
                             </button>
                          </div>
                       )}

                       {mode === 'HARDWARE' && currentStep === 1 && (
                          <div className="space-y-10">
                             <div 
                                onClick={() => setEvidenceFile('MOCK_FILE')}
                                className={`max-w-xl mx-auto p-20 border-4 border-dashed rounded-[56px] flex flex-col items-center justify-center text-center space-y-8 group/upload cursor-pointer transition-all ${evidenceFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-indigo-500/40 bg-black/40'}`}
                             >
                                {!evidenceFile ? (
                                   <>
                                      <Upload size={48} className="text-slate-700 group-hover:text-indigo-400 transition-all" />
                                      <p className="text-xl font-black text-white uppercase italic">Upload Proof of Ownership</p>
                                   </>
                                ) : (
                                   <>
                                      <CheckCircle2 size={48} className="text-emerald-500" />
                                      <p className="text-xl font-black text-white uppercase italic">Evidence Buffered</p>
                                   </>
                                )}
                             </div>
                             <button onClick={handleNextStep} disabled={!evidenceFile} className="w-full max-w-xl py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl mx-auto">CONTINUE TO AUDIT</button>
                          </div>
                       )}

                       {mode === 'LAND' && currentStep === 1 && (
                          <div className="space-y-10">
                             <div className="p-12 glass-card rounded-[64px] border border-white/10 bg-black/60 max-w-xl mx-auto space-y-8 shadow-inner">
                                <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 w-fit mx-auto shadow-2xl">
                                   <FileText size={40} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase italic">Generated Deed Shard</h4>
                                <div className="space-y-3 px-4 text-left border-y border-white/10 py-5 my-4 font-mono text-xs">
                                   <div className="flex justify-between items-center text-xs">
                                      <span className="text-slate-500 font-sans font-bold uppercase tracking-wider text-[9px]">Map Identity Code:</span>
                                      <span className="text-amber-400 font-bold tracking-wider select-all">{selectedPlot?.id || 'MAP-UNASSIGNED'}</span>
                                   </div>
                                   <div className="flex justify-between items-center text-xs pb-1 border-b border-white/5">
                                      <span className="text-slate-500 font-sans font-bold uppercase tracking-wider text-[9px]">Registered Area:</span>
                                      <span className="text-emerald-400 font-bold">{(deedStats.area / 10000).toFixed(4)} ha ({(deedStats.area / 4046.86).toFixed(3)} acres)</span>
                                   </div>
                                   <div className="flex justify-between items-center text-xs pb-1 border-b border-white/5">
                                      <span className="text-slate-500 font-sans font-bold uppercase tracking-wider text-[9px]">Boundary Perimeter:</span>
                                      <span className="text-white font-bold">{deedStats.perimeter.toFixed(1)} m</span>
                                   </div>
                                   <div className="flex justify-between items-center text-xs pb-1 border-b border-white/5">
                                      <span className="text-slate-500 font-sans font-bold uppercase tracking-wider text-[9px]">Locus Compactness:</span>
                                      <span className="text-sky-300 font-bold">{deedStats.compactness.toFixed(1)}%</span>
                                   </div>
                                   <div className="flex justify-between items-center text-xs">
                                      <span className="text-slate-500 font-sans font-bold uppercase tracking-wider text-[9px]">Steward Owner:</span>
                                      <span className="text-slate-300 font-bold">{user.esin}</span>
                                    </div>
                                </div>
                                <button className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-amber-500/10">
                                   <Stamp size={16} /> CRYPTOGRAPHICALLY SIGN TITLE DEED
                                </button>
                             </div>
                             <button onClick={handleNextStep} className="w-full max-w-xl py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl mx-auto">I HAVE VERIFIED DOCUMENT</button>
                          </div>
                       )}

                       {mode === 'HARDWARE' && steps[currentStep].id === 'PHYSICAL_VERIFY' && (
                         <div className="space-y-10 animate-in zoom-in duration-500">
                           <div className="w-48 h-48 rounded-[48px] border-4 border-dashed border-indigo-500/20 flex items-center justify-center relative group mx-auto">
                              <Scan size={80} className="text-slate-700 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-700" />
                              <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-[48px] animate-pulse"></div>
                           </div>
                           <p className="text-slate-400 text-lg font-medium italic max-w-sm mx-auto">
                             "Initializing physical lens for hardware shard verification. Scan the unique ID plate of the asset."
                           </p>
                           <button 
                             onClick={handleNextStep}
                             className="w-full max-w-xl py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl mx-auto flex items-center justify-center gap-4 border-2 border-white/10"
                           >
                             SCAN ASSET SHARD <SmartphoneNfc size={20} />
                           </button>
                         </div>
                       )}

                       {currentStep >= 2 && !isProcessing && (steps[currentStep].id !== 'PHYSICAL_VERIFY' || mode !== 'HARDWARE') && (
                          <div className="space-y-12 animate-in slide-in-from-bottom-6">
                             {agroLangShard && (
                                <div className="p-10 bg-black/90 rounded-[48px] border border-indigo-500/20 shadow-3xl text-left relative overflow-hidden group/shard">
                                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/shard:scale-110 transition-transform"><Code2 size={400} /></div>
                                   <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                                      <Code2 size={28} className="text-indigo-400" />
                                      <h4 className="text-2xl font-black text-white uppercase italic">AgroLang Logic Shard</h4>
                                   </div>
                                   <pre className="text-emerald-400 font-mono text-lg leading-loose italic whitespace-pre-wrap select-all">
                                      {agroLangShard.code}
                                   </pre>
                                   <div className="mt-10 flex gap-4">
                                      <button onClick={handleExecuteToShell} className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">EXECUTE IN SHELL</button>
                                   </div>
                                </div>
                             )}

                             <div className="p-8 bg-black/60 rounded-[48px] border-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="text-left space-y-2">
                                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Process Verification</h4>
                                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">AWAITING_STEP_{currentStep + 1}</p>
                                </div>
                                <button 
                                   onClick={handleNextStep}
                                   className="px-16 py-6 bg-white hover:bg-slate-200 text-black rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                >
                                   PROCEED_TO_FINALITY
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        ) : currentStep === steps.length ? (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-1000 flex flex-col items-center">
              <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center text-white shadow-[0_0_120px_rgba(16,185,129,0.5)] scale-110 relative group">
                 <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-[-15px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                 <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-6 text-center">
                 <h3 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">SHARD <span className="text-emerald-400">READY.</span></h3>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono leading-none">AWAITING_SIGNATURE_AUTH</p>
              </div>

              <div className="w-full max-w-2xl space-y-8">
                 <div className="space-y-4">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center italic">NODE_SIGNATURE_AUTH (ESIN)</label>
                    <input 
                       type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                       placeholder="EA-XXXX-XXXX-XXXX" 
                       className="w-full bg-black border-2 border-white/10 rounded-[56px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-emerald-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                    />
                 </div>
                 <button 
                    onClick={handleFinalize}
                    disabled={isProcessing || !esinSign}
                    className="w-full py-12 md:py-16 agro-gradient rounded-[64px] text-white font-black text-lg uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-10 border-4 border-white/10 ring-[24px] ring-white/5"
                 >
                    {isProcessing ? <Loader2 className="w-12 h-12 animate-spin" /> : <Stamp size={40} className="fill-current" />}
                    {isProcessing ? 'SYNCHRONIZING...' : 'COMMIT TO LEDGER'}
                 </button>
              </div>
           </div>
        ) : (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-1000 flex flex-col items-center">
              <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center text-white shadow-[0_0_120px_rgba(16,185,129,0.5)] scale-110 relative group">
                 <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-[-15px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                 <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-6 text-center">
                 <h3 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">SHARD <span className="text-emerald-400">ANCHORED.</span></h3>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono leading-none">HASH_COMMIT_0xHS_FINAL_OK</p>
              </div>
              <button onClick={() => setMode(null)} className="px-10 py-4 text-[10px] font-black text-slate-700 hover:text-white transition-colors uppercase tracking-widest">Register Another Shard</button>
           </div>
        )}
      </div>

      {showResumePrompt && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-black border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Confirm Form Resubmission</h3>
            <p className="text-slate-400 mb-8 text-sm">You have an incomplete registration process. Would you like to resume where you left off or start a new registration?</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { isSuccessRef.current = false; setShowResumePrompt(false); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Resume Registration
              </button>
              <button onClick={() => { isSuccessRef.current = false; setHandshakeRegistrationState(null); setShowResumePrompt(false); setMode(null); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default RegistryHandshake;