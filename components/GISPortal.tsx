import React, { useState, useEffect, useMemo } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { spatialService, Plot } from '../services/spatialService';
import { auth, listenToCollection } from '../services/firebaseService';
import { toast } from 'sonner';
import { useUiStore } from '../store/uiStore';
import { User, Mission, SignalShard } from '../types';
import { MapPin, Loader2, Activity, Droplets, Sun, Wind, Zap, Camera, ShieldCheck, Target, Crosshair, X, Sprout } from 'lucide-react';
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

// Compute real-time nutrient drift variance for a plot
const calculateDriftVariance = (
  plotId: string, 
  timestamp: number, 
  coverCropAdjustment = 0, 
  isMicroDamsActive = false, 
  isUltrasonicShieldActive = false
) => {
  // Stable deterministic hash of plotId to seed values
  const hash = plotId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseSlope = (hash % 12) + 2; // 2% to 14% slope incline
  const baseVeg = ((hash * 7) % 50) + 35; // 35% to 85% cover crop density
  const baseWind = ((hash * 13) % 10) + 3; // 3m/s to 13m/s wind speed
  const baseAngle = (hash * 23) % 360; // 0 to 360 degree wind direction

  // Wave for real-time periodic soil/nutrient moisture fluctuation
  const wave = Math.sin((timestamp / 10000) + (hash % 10));
  const currentMoistureNoise = 40 + (wave * 12); // Dynamic moisture %

  // Incorporate live mitigation simulation inputs
  const finalVeg = Math.min(100, Math.max(0, baseVeg + coverCropAdjustment));
  const slopeDamEffect = isMicroDamsActive ? 0.35 : 1.0; 
  const alignmentShieldEffect = isUltrasonicShieldActive ? 0.4 : 1.0; 

  // Nutrient drift variance calculation model (stable, physical indices-like):
  // - Higher wind and elevation slope increases the outward drift of micro-nutrients.
  // - Canopy covers and micro-dams retain soil substrate, suppressing drift.
  const rawDrift = ((baseWind * 0.22) * alignmentShieldEffect) + 
                   (currentMoistureNoise * 0.06) + 
                   ((baseSlope * 0.16) * slopeDamEffect) - 
                   (finalVeg * 0.04);
  const driftVariance = Math.max(0.05, rawDrift + wave * 0.3);
  const driftAngle = (baseAngle + wave * 18) % 360;

  return {
    driftVariance,
    driftAngle,
    slope: baseSlope,
    vegetationDensity: finalVeg,
    windSpeed: baseWind,
    windAngle: baseAngle,
    moisture: currentMoistureNoise
  };
};

const generatePlotTelemetry = (
  plotId: string, 
  coverCropAdjustment = 0, 
  isMicroDamsActive = false, 
  isUltrasonicShieldActive = false
) => {
  const data = [];
  let baseMoisture = 40;
  let baseNitrogen = 60;
  const hash = plotId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < 10; i++) {
    const timeOffset = Date.now() - (10 - i) * 60000;
    const stats = calculateDriftVariance(plotId, timeOffset, coverCropAdjustment, isMicroDamsActive, isUltrasonicShieldActive);
    data.push({
      time: `T-${10 - i}m`,
      moisture: stats.moisture,
      nitrogen: 65 - stats.driftVariance * 5 + Math.sin(i) * 2,
      drift: stats.driftVariance
    });
  }
  return data;
};

// Simple Geodesic solvers for GIS analytics
const calculateDistance = (p1: { lat: number, lng: number }, p2: { lat: number, lng: number }) => {
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

const calculatePolygonAreaAndPerimeter = (coords: [number, number][]) => {
  if (!coords || coords.length < 3) return { area: 0, perimeter: 0, compactness: 0 };
  
  // coords are array of [lat, lng]
  const list = coords.map(c => ({ lat: c[0], lng: c[1] }));
  
  // Perimeter
  let perimeter = 0;
  for (let i = 0; i < list.length; i++) {
    const p1 = list[i];
    const p2 = list[(i + 1) % list.length];
    perimeter += calculateDistance(p1, p2);
  }
  
  // Area (Equirectangular Shoelace Offset approximation for fast sub-regional agriculture scales)
  const latToMeters = 111320;
  const origin = list[0];
  const lngToMeters = 111320 * Math.cos(origin.lat * Math.PI / 180);
  
  let areaSum = 0;
  for (let i = 0; i < list.length; i++) {
    const p1 = list[i];
    const p2 = list[(i + 1) % list.length];
    
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

// Simple Centroid Solver for arbitrary GIS Polygons
const getPlotCentroid = (plot: Plot) => {
  if (!plot.geometry?.coordinates?.[0]) return [-1.2921, 36.8219];
  const coords = plot.geometry.coordinates[0];
  let sumLat = 0;
  let sumLng = 0;
  coords.forEach((c: any) => {
    sumLat += c[0];
    sumLng += c[1];
  });
  return [sumLat / coords.length, sumLng / coords.length];
};

const GISPortal: React.FC<GISPortalProps> = ({ user, onEmitSignal }) => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [showAR, setShowAR] = useState(false);
  const [isPredictingYield, setIsPredictingYield] = useState(false);
  const [yieldPrediction, setYieldPrediction] = useState<any | null>(null);
  const [vouchingPlotId, setVouchingPlotId] = useState<string | null>(null);
  const [robots, setRobots] = useState<Record<string, any>>({});
  const [mapViewState, setMapViewState] = useState({ longitude: 36.8219, latitude: -1.2921, zoom: 15 });
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isDroppingAnchor, setIsDroppingAnchor] = useState(false);
  const [anchors, setAnchors] = useState<any[]>([]);
  
  // Real-time UI Layer toggles and Simulation variables
  const [viewNutrientDrift, setViewNutrientDrift] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [coverCropAdjustment, setCoverCropAdjustment] = useState<number>(0);
  const [isMicroDamsActive, setIsMicroDamsActive] = useState<boolean>(false);
  const [isUltrasonicShieldActive, setIsUltrasonicShieldActive] = useState<boolean>(false);

  // New map layers and filtering state variables in GIS Portal
  const [viewMode, setViewMode] = useState<'MY_PLOTS' | 'UNIVERSAL'>('MY_PLOTS');
  const [baseMapType, setBaseMapType] = useState<'satellite' | 'street'>('satellite');

  const { selectedPlot, setSelectedPlot } = useUiStore();

  // Esri High-Resolution World Imagery Style Spec for Earth Map
  const esriSatelliteStyle = useMemo(() => ({
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'Esri World Imagery'
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite-tiles',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  }), []);

  // Standard Open Street Maps raster Style Spec
  const openStreetMapStyle = useMemo(() => ({
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{y}/{x}.png'
        ],
        tileSize: 256,
        attribution: 'OpenStreetMap'
      }
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }), []);

  const currentMapStyle = useMemo(() => {
    return baseMapType === 'satellite' ? esriSatelliteStyle : openStreetMapStyle;
  }, [baseMapType, esriSatelliteStyle, openStreetMapStyle]);

  const activePlotsList = useMemo(() => {
    return plots;
  }, [plots]);

  const selectedPlotDrift = useMemo(() => {
    if (selectedPlot) {
      return calculateDriftVariance(
        selectedPlot.id || 'default', 
        currentTime, 
        coverCropAdjustment, 
        isMicroDamsActive, 
        isUltrasonicShieldActive
      );
    }
    return null;
  }, [selectedPlot, currentTime, coverCropAdjustment, isMicroDamsActive, isUltrasonicShieldActive]);

  const telemetryData = useMemo(() => {
    if (selectedPlot && selectedPlot.id) {
      return generatePlotTelemetry(selectedPlot.id, coverCropAdjustment, isMicroDamsActive, isUltrasonicShieldActive);
    }
    return [];
  }, [selectedPlot, coverCropAdjustment, isMicroDamsActive, isUltrasonicShieldActive]);

  useEffect(() => {
    if (viewMode === 'MY_PLOTS') {
      if (user.esin) {
        spatialService.getPlots(user.esin).then(setPlots).catch(console.error);
      }
    } else {
      spatialService.getAllPlots().then(setPlots).catch(console.error);
    }
  }, [user.esin, viewMode]);

  useEffect(() => {
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

    // Clock update for physical real-time calculations
    const clock = setInterval(() => {
      setCurrentTime(Date.now());
    }, 2000);

    return () => {
      spatialService.stopListening();
      unsubscribeMissions();
      unsubscribeAnchors();
      clearInterval(clock);
    };
  }, []);

  // Adjust view state to center correctly on either seeded or database plots
  useEffect(() => {
    if (activePlotsList.length > 0) {
      const firstPlot = activePlotsList[0];
      const centroid = getPlotCentroid(firstPlot);
      setMapViewState(prev => ({ ...prev, longitude: centroid[1], latitude: centroid[0], zoom: 15 }));
    }
  }, [activePlotsList]);

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

  const plotAnalytics = useMemo(() => {
    if (selectedPlot?.geometry?.coordinates?.[0]) {
      return calculatePolygonAreaAndPerimeter(selectedPlot.geometry.coordinates[0]);
    }
    return { area: 0, perimeter: 0, compactness: 0 };
  }, [selectedPlot]);

  const [isSeeding, setIsSeeding] = useState(false);
  const handleSeedSamplePlot = async () => {
    setIsSeeding(true);
    const demoId = `plot-${Math.random().toString(36).substr(2, 6)}`;
    const samplePlot = {
      id: demoId,
      stewardId: user.esin,
      name: 'Simulated Mugumo Shard Alpha',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-1.2915, 36.8215],
          [-1.2915, 36.8235],
          [-1.2930, 36.8235],
          [-1.2930, 36.8215],
          [-1.2915, 36.8215]
        ]]
      }
    };
    try {
      await spatialService.savePlot(samplePlot);
      toast.success('Sample geofenced land plot committed to industrial registry!');
      if (viewMode === 'MY_PLOTS') {
        const loaded = await spatialService.getPlots(user.esin);
        setPlots(loaded);
      } else {
        const loaded = await spatialService.getAllPlots();
        setPlots(loaded);
      }
    } catch (e: any) {
      toast.error(`Fail to seed sample land: ${e.message}`);
    } finally {
      setIsSeeding(false);
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
        
        {/* Real-time Nutrient Drift Variance Layer Toggle */}
        <button 
          onClick={() => setViewNutrientDrift(!viewNutrientDrift)}
          className={`px-6 py-4 backdrop-blur-md border rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-2xl active:scale-95 ${viewNutrientDrift ? 'bg-amber-500/90 border-amber-400/50 text-black' : 'bg-black/80 border-amber-500/30 text-amber-400 hover:bg-amber-950/40'}`}
        >
          <Wind size={16} className={viewNutrientDrift ? 'animate-pulse' : ''} />
          {viewNutrientDrift ? 'Nutrient Drift: On' : 'Nutrient Drift: Off'}
        </button>
      </div>
      
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        {/* Scope selector */}
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Scope Scope</p>
          <button 
            type="button"
            onClick={() => setViewMode('MY_PLOTS')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'MY_PLOTS' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            My Plots
          </button>
          <button 
            type="button"
            onClick={() => setViewMode('UNIVERSAL')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'UNIVERSAL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            Universal Map
          </button>
        </div>

        {/* Base layer styles */}
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Map Layers</p>
          <button 
            type="button"
            onClick={() => setBaseMapType('satellite')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${baseMapType === 'satellite' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            Satellite
          </button>
          <button 
            type="button"
            onClick={() => setBaseMapType('street')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${baseMapType === 'street' ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            OSM Roads
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <Map
          {...mapViewState}
          onMove={evt => setMapViewState(evt.viewState)}
          mapStyle={currentMapStyle as any}
          onClick={(e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const plotId = feature.properties?.id;
              if (plotId) {
                const plot = activePlotsList.find(p => p.id === plotId);
                if (plot) setSelectedPlot(plot);
              }
            }
            onMapClick(e);
          }}
          interactiveLayerIds={activePlotsList.map((_, i) => `plot-${i}`)}
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

          {activePlotsList.map((plot, i) => {
            const isActiveMissionPlot = activeMission?.plotId === plot.id;
            
            // Dynamic multi-spectrum nutrient drift status modeling
            const driftStats = calculateDriftVariance(plot.id || 'default', currentTime);
            const driftColor = driftStats.driftVariance < 1.5 
              ? '#10B981' // stable emerald-500
              : driftStats.driftVariance < 3.0 
                ? '#F59E0B' // sub-coherent warning amber-500
                : '#EC4899'; // high dispersion rose/pink-500

            const polygonData = {
              type: 'Feature',
              properties: { id: plot.id },
              geometry: {
                type: 'Polygon',
                coordinates: [plot.geometry.coordinates[0].map((coord: any) => [coord[1], coord[0]])]
              }
            };

            const centroid = getPlotCentroid(plot);
            const rad = (driftStats.driftAngle * Math.PI) / 180;
            const lenMultiplier = 0.00018; 
            const deltaLat = Math.sin(rad) * driftStats.driftVariance * lenMultiplier;
            const deltaLng = Math.cos(rad) * driftStats.driftVariance * lenMultiplier;

            const vectorData = {
              type: 'Feature',
              properties: { id: plot.id },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [centroid[1], centroid[0]],
                  [centroid[1] + deltaLng, centroid[0] + deltaLat]
                ]
              }
            };

            const tipLng = centroid[1] + deltaLng;
            const tipLat = centroid[0] + deltaLat;

            return (
              <React.Fragment key={i}>
                <Source id={`plot-source-${i}`} type="geojson" data={polygonData as any}>
                  <Layer
                    id={`plot-${i}`}
                    type="fill"
                    paint={{
                      'fill-color': viewNutrientDrift 
                        ? driftColor 
                        : (isActiveMissionPlot ? '#F43F5E' : (selectedPlot?.id === plot.id ? '#3B82F6' : '#10B981')),
                      'fill-opacity': viewNutrientDrift 
                        ? 0.45 
                        : (isActiveMissionPlot ? 0.6 : 0.4)
                    }}
                  />
                  <Layer
                    id={`plot-outline-${i}`}
                    type="line"
                    paint={{
                      'line-color': viewNutrientDrift ? '#FFFFFF' : '#10B981',
                      'line-width': selectedPlot?.id === plot.id ? 2 : 1,
                      'line-opacity': 0.75
                    }}
                  />
                </Source>

                {/* Draw real-time wind drift vectors for geofenced shards */}
                {viewNutrientDrift && (
                  <>
                    <Source id={`vector-source-${i}`} type="geojson" data={vectorData as any}>
                      <Layer
                        id={`vector-line-${i}`}
                        type="line"
                        paint={{
                          'line-color': '#FFFFFF',
                          'line-width': 2.5,
                          'line-opacity': 0.85,
                          'line-dasharray': [2, 1.5]
                        }}
                      />
                    </Source>

                    {/* Tip flow animation coordinate particle */}
                    <Marker longitude={tipLng} latitude={tipLat} anchor="center">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-3 w-3 rounded-full opacity-60 animate-ping" style={{ backgroundColor: driftColor }}></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: driftColor }}></span>
                      </div>
                    </Marker>

                    {/* Shard visual identification helper */}
                    <Marker longitude={centroid[1]} latitude={centroid[0]} anchor="center">
                      <div className="px-1.5 py-0.5 bg-black/85 backdrop-blur-md rounded border border-white/10 text-[7px] font-mono text-white select-none whitespace-nowrap tracking-wider">
                        {plot.name?.split(' ').pop()} ({driftStats.driftVariance.toFixed(1)} v)
                      </div>
                    </Marker>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </Map>

        {plots.length === 0 && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="p-4 rounded-full bg-slate-900 border border-white/10 text-emerald-400 mb-4">
              <MapPin size={32} className="animate-pulse" />
            </div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight">No Geofenced Lands Registered</h4>
            <p className="max-w-md text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
              EnvirosAgro utilizes high-resolution earth telemetry. Walk around your land boundaries using GPS perimeter mapping in the Handshake flow to geofence your zone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider select-none leading-none flex items-center justify-center gap-2">
                Use Land Registry Tab to Map GPS
              </div>
              <button 
                type="button"
                onClick={handleSeedSamplePlot}
                disabled={isSeeding}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                {isSeeding ? <Loader2 size={12} className="animate-spin" /> : null}
                Spawn Experimental Plot
              </button>
            </div>
          </div>
        )}
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

          {/* Plotted GPS Land Geo-Analytics Panel */}
          <div className="p-5 bg-slate-900/90 border border-white/10 rounded-2xl space-y-3.5 shadow-inner">
            <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Activity size={12} className="text-emerald-400 animate-pulse" /> Plotted Geo-Analytics
            </h5>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold tracking-wider">Map Identity:</span>
                <span className="text-white font-bold text-nowrap select-all">{selectedPlot.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold tracking-wider">Surface Area:</span>
                <span className="text-emerald-400 font-bold">{(plotAnalytics.area / 10000).toFixed(4)} ha</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold tracking-wider">Acres Equiv:</span>
                <span className="text-emerald-500 font-bold">{(plotAnalytics.area / 4046.86).toFixed(3)} acres</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold tracking-wider">Perimeter:</span>
                <span className="text-white font-bold">{plotAnalytics.perimeter.toFixed(1)} m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans text-[10px] uppercase font-bold tracking-wider">Compactness:</span>
                <span className="text-sky-400 font-bold">{plotAnalytics.compactness.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Real-time Nutrient Drift Variance Analysis */}
          {selectedPlotDrift && (
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 gap-3 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Wind size={12} className="text-amber-400 animate-pulse" /> Shard Drift Analysis
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-nowrap ${
                  selectedPlotDrift.driftVariance < 1.5 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  selectedPlotDrift.driftVariance < 3.0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                }`}>
                  {selectedPlotDrift.driftVariance < 1.5 ? 'Stable' :
                   selectedPlotDrift.driftVariance < 3.0 ? 'Fluid Drift Warning' :
                   'High Entropy Runoff'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white font-mono">{selectedPlotDrift.driftVariance.toFixed(2)} <span className="text-[8px] text-slate-500 font-sans uppercase">g/m²/hr</span></span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider">Drift Variance Flux</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white font-mono">{selectedPlotDrift.driftAngle.toFixed(0)}°</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider">Drift Vector Angle</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white font-mono">{selectedPlotDrift.slope.toFixed(1)}%</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider">Slope Incline (S)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white font-mono">{selectedPlotDrift.vegetationDensity.toFixed(0)}%</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider">Cover Canopy (C)</span>
                </div>
              </div>

              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex justify-between pt-1.5 border-t border-white/5 leading-none">
                <span>Wind Force: {selectedPlotDrift.windSpeed.toFixed(1)} m/s</span>
                <span>Water Runoff: {(selectedPlotDrift.moisture * 0.15).toFixed(2)}x</span>
              </div>
            </div>
          )}

          {/* Interactive Mitigation Controller Simulator */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sprout size={12} className="text-emerald-400" /> Live Mitigation Simulator
            </h5>
            <p className="text-[10px] text-slate-400 italic">Simulate property remediations directly onto this geofenced shard to suppress nutrient drift variance.</p>
            
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <span>Cover Canopy Boost</span>
                  <span className="text-emerald-400">+{coverCropAdjustment}%</span>
                </div>
                <input 
                  type="range" 
                  min="-20" 
                  max="50" 
                  value={coverCropAdjustment} 
                  onChange={(e) => setCoverCropAdjustment(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Bio-Retention Micro-Dams</span>
                <button 
                  onClick={() => setIsMicroDamsActive(!isMicroDamsActive)}
                  className={`px-3 py-1 text-[8px] font-black rounded-lg border uppercase tracking-wider transition-all duration-300 ${
                    isMicroDamsActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isMicroDamsActive ? 'Active' : 'Deploy'}
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Ultrasonic Soil Shard Shield</span>
                <button 
                  onClick={() => setIsUltrasonicShieldActive(!isUltrasonicShieldActive)}
                  className={`px-3 py-1 text-[8px] font-black rounded-lg border uppercase tracking-wider transition-all duration-300 ${
                    isUltrasonicShieldActive 
                      ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.15)]' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isUltrasonicShieldActive ? 'Active' : 'Align'}
                </button>
              </div>
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
                    <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="moisture" name="Moisture %" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMoisture)" />
                  {viewNutrientDrift && (
                    <Area type="monotone" dataKey="drift" name="Drift Variance" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorDrift)" />
                  )}
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
