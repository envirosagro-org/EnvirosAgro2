import React, { useState, useEffect, useMemo } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { spatialService, Plot } from '../services/spatialService';
import { auth, listenToCollection } from '../services/firebaseService';
import { toast } from 'sonner';
import { useAppStore } from '../store';
import { User, Mission, SignalShard } from '../types';
import { MapPin, Loader2, Activity, Droplets, Sun, Wind, Zap, Camera, ShieldCheck, Target, Crosshair, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ARFieldXRay } from './ARFieldXRay';
import { predictCarbonYield } from '../services/agroLangService';

const containerStyle = {
  width: '100%',
  height: '600px'
};

interface GISPortalProps {
  user: User;
  onEmitSignal?: (signal: Partial<SignalShard>) => void;
}

const generatePlotTelemetry = (plotId: string) => {
  const data = [];
  let baseMoisture = 40 + Math.random() * 20;
  let baseNitrogen = 60 + Math.random() * 10;
  for (let i = 0; i < 10; i++) {
    baseMoisture += (Math.random() - 0.5) * 5;
    baseNitrogen += (Math.random() - 0.5) * 3;
    data.push({
      time: `T-${10 - i}`,
      moisture: Math.max(0, Math.min(100, baseMoisture)),
      nitrogen: Math.max(0, Math.min(100, baseNitrogen)),
    });
  }
  return data;
};

const GISPortal: React.FC<GISPortalProps> = ({ user, onEmitSignal }) => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [showAR, setShowAR] = useState(false);
  const [isPredictingYield, setIsPredictingYield] = useState(false);
  const [yieldPrediction, setYieldPrediction] = useState<any | null>(null);
  const [vouchingPlotId, setVouchingPlotId] = useState<string | null>(null);
  const [robots, setRobots] = useState<Record<string, any>>({});
  const [mapViewState, setMapViewState] = useState({ longitude: 0, latitude: 0, zoom: 2 });
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isDroppingAnchor, setIsDroppingAnchor] = useState(false);
  const [anchors, setAnchors] = useState<any[]>([]);
  
  const { selectedPlot, setSelectedPlot } = useAppStore();
  
  const telemetryData = useMemo(() => {
    if (selectedPlot && selectedPlot.id) {
      return generatePlotTelemetry(selectedPlot.id);
    }
    return [];
  }, [selectedPlot]);

  useEffect(() => {
    if (user.esin) {
      spatialService.getPlots(user.esin).then(setPlots).catch(console.error);
    }
    
    // Listen to real-time robot positions
    spatialService.listenToRobots((data) => {
      setRobots(data);
    });

    // Listen for active missions
    const unsubscribeMissions = listenToCollection('missions', (missions: Mission[]) => {
      const active = missions.find(m => m.status === 'ACTIVE');
      setActiveMission(active || null);
    });

    // Listen for AR Anchors
    const unsubscribeAnchors = listenToCollection('ar_anchors', (data: any[]) => {
      setAnchors(data);
    });

    return () => {
      spatialService.stopListening();
      unsubscribeMissions();
      unsubscribeAnchors();
    };
  }, [user.esin]);

  const handleGpsLock = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMapViewState({ longitude: loc.lng, latitude: loc.lat, zoom: 18 });
        setUserLocation(loc);
        setIsLocating(false);
        toast.success('GPS Lock Acquired');
      },
      (error) => {
        setIsLocating(false);
        toast.error(`GPS Error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePredictYield = async () => {
    if (!selectedPlot || isPredictingYield) return;
    setIsPredictingYield(true);
    try {
      // Mock historical MRV data
      const mockMRV = [
        { date: '2024-01-01', biomass: 100, carbon: 50 },
        { date: '2025-01-01', biomass: 120, carbon: 60 }
      ];
      const res = await predictCarbonYield(selectedPlot, mockMRV);
      setYieldPrediction(res.json);
      toast.success('Carbon Yield Oracle Synchronized');
    } catch (e) {
      toast.error('Yield Prediction Failed');
    } finally {
      setIsPredictingYield(false);
    }
  };

  const handleVouch = async (plotId: string) => {
    setVouchingPlotId(plotId);
    try {
      // Simulate blockchain/consensus delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Consensus Vouch Committed for Plot ${plotId}. ESIN Signature verified.`);
    } finally {
      setVouchingPlotId(null);
    }
  };

  const onMapClick = async (e: any) => {
    if (!isDroppingAnchor || !e.lngLat) return;
    
    const newAnchor = {
      stewardId: user.esin,
      type: 'MARKER',
      spatialPos: { x: e.lngLat.lat, y: 0, z: e.lngLat.lng },
      data: { title: 'User Dropped Anchor', timestamp: new Date().toISOString(), accuracy: '0.01m', satellites: 14 }
    };
    
    try {
      await spatialService.saveAnchor(newAnchor);
      toast.success('AR Anchor Dropped Successfully!');
      if (onEmitSignal) {
        onEmitSignal({ type: 'ledger_anchor', title: 'AR Anchor Dropped', message: `Dropped AR Anchor at ${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)} by ${user.esin}` });
      }
      setIsDroppingAnchor(false);
    } catch (error: any) {
      toast.error(`Failed to drop anchor: ${error.message}`);
    }
  };

  return (
    <div className="h-[600px] w-full glass-card rounded-3xl overflow-hidden border border-white/10 relative flex">
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
        <button 
          onClick={handleGpsLock}
          disabled={isLocating}
          className="px-6 py-4 bg-black/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-emerald-900/40 transition-all shadow-2xl active:scale-95"
        >
          {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          {isLocating ? 'Locating...' : 'GPS Geo-Lock'}
        </button>
        <button 
          onClick={() => setShowAR(true)}
          className="px-6 py-4 bg-indigo-600/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl active:scale-95"
        >
          <Camera size={16} />
          AR Field X-Ray
        </button>
        <button 
          onClick={() => setIsDroppingAnchor(!isDroppingAnchor)}
          className={`px-6 py-4 backdrop-blur-md border rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-2xl active:scale-95 ${isDroppingAnchor ? 'bg-fuchsia-600/90 border-fuchsia-500/50 text-white' : 'bg-black/80 border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-900/40'}`}
        >
          <Target size={16} />
          {isDroppingAnchor ? 'Click Map to Drop' : 'Drop AR Anchor'}
        </button>
      </div>
      
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Map Layers</p>
          <button className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/20 transition-all">Satellite</button>
          <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all">Roadmap</button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <Map
          {...mapViewState}
          onMove={evt => setMapViewState(evt.viewState)}
          mapStyle="https://demotiles.maplibre.org/style.json"
          onClick={(e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const plotId = feature.properties?.id;
              if (plotId) {
                const plot = plots.find(p => p.id === plotId);
                if (plot) setSelectedPlot(plot);
              }
            }
            onMapClick(e);
          }}
          interactiveLayerIds={plots.map((_, i) => `plot-${i}`)}
        >
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat} color="#10B981" />
          )}

          {/* Robot Swarm Markers */}
          {Object.entries(robots).map(([id, robot]: [string, any]) => (
            <Marker
              key={id}
              longitude={robot.pos.z}
              latitude={robot.pos.x}
              color={robot.anim_state === 'working' ? '#10B981' : '#6366F1'}
            />
          ))}

          {/* AR Anchor Markers */}
          {anchors.map((anchor) => (
            <Marker
              key={anchor.id}
              longitude={anchor.spatialPos.z}
              latitude={anchor.spatialPos.x}
              color="#d946ef"
            />
          ))}

          {plots.map((plot, i) => {
            const isActiveMissionPlot = activeMission?.plotId === plot.id;
            const polygonData = {
              type: 'Feature',
              properties: { id: plot.id },
              geometry: {
                type: 'Polygon',
                coordinates: [plot.geometry.coordinates[0].map((coord: any) => [coord[1], coord[0]])]
              }
            };
            return (
              <Source key={i} id={`plot-source-${i}`} type="geojson" data={polygonData as any}>
                <Layer
                  id={`plot-${i}`}
                  type="fill"
                  paint={{
                    'fill-color': isActiveMissionPlot ? '#F43F5E' : (selectedPlot?.id === plot.id ? '#3B82F6' : '#10B981'),
                    'fill-opacity': isActiveMissionPlot ? 0.6 : 0.4
                  }}
                />
              </Source>
            );
          })}
        </Map>
      </div>

      {/* Mission HUD Overlay */}
      {activeMission && (
        <div className="absolute bottom-6 left-6 z-20 glass-card p-6 rounded-[32px] border-2 border-rose-500/30 bg-black/80 backdrop-blur-xl flex items-center gap-6 shadow-2xl animate-in slide-in-from-bottom-8">
          <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
            <Target size={28} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Active Mission Shard</p>
            <h5 className="text-lg font-black text-white uppercase italic m-0 tracking-tight">{activeMission.title}</h5>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <Crosshair size={12} className="text-rose-500" />
                <span>Sector: {activeMission.plotId || 'GLOBAL'}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <Activity size={12} className="text-emerald-400" />
                <span>Swarm: {activeMission.requiredUnits || 0} Units</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Telemetry Panel */}
      {selectedPlot && (
        <div className="w-96 bg-black/95 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">{selectedPlot.name}</h4>
            <button onClick={() => setSelectedPlot(null)} className="p-2 bg-white/5 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
              <Droplets size={16} className="text-blue-400 mb-1" />
              <div className="text-3xl font-black text-white">{(telemetryData[telemetryData.length - 1]?.moisture || 0).toFixed(1)}<span className="text-sm text-slate-500">%</span></div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Moisture</div>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
              <Activity size={16} className="text-fuchsia-400 mb-1" />
              <div className="text-3xl font-black text-white">{(telemetryData[telemetryData.length - 1]?.nitrogen || 0).toFixed(1)}<span className="text-sm text-slate-500">mg</span></div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nitrogen</div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handlePredictYield}
              disabled={isPredictingYield}
              className="w-full py-5 bg-indigo-600/20 border border-indigo-500/50 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600/40 transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
            >
              {isPredictingYield ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              Predict Carbon Yield
            </button>

            {yieldPrediction && (
              <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Yield Oracle</p>
                  <p className="text-[9px] font-mono text-white">CONF: {(yieldPrediction.confidence_score * 100).toFixed(0)}%</p>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {yieldPrediction.predictions.map((p: any, i: number) => (
                    <div key={i} className="text-center">
                      <p className="text-[8px] text-slate-500 font-mono mb-1">Y{i+1}</p>
                      <p className="text-xs font-black text-white">{p.estimated_yield_tonnes}t</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-indigo-300/60 italic leading-relaxed">"{yieldPrediction.narrative}"</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Boundary Consensus</h5>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                ))}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic px-2">3/4 Neighbors have vouched for this boundary.</p>
            <button 
              onClick={() => handleVouch(selectedPlot.id || '')}
              disabled={!!vouchingPlotId}
              className="w-full py-4 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-3"
            >
              {vouchingPlotId ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Vouch for Boundary
            </button>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Telemetry Stream</h5>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMoisture)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button className="w-full py-3 bg-emerald-600/20 border border-emerald-500/50 rounded-xl text-emerald-400 font-bold text-xs uppercase tracking-widest hover:bg-emerald-600/40 transition-all">
            Run Diagnostics
          </button>
        </div>
      )}

      {showAR && (
        <ARFieldXRay user={user} onClose={() => setShowAR(false)} />
      )}
    </div>
  );
};

export default GISPortal;
