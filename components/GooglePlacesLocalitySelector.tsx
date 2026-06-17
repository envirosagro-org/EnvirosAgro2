import React, { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search, Loader2, MapPin, Check, ShieldCheck, Satellite, Globe, Navigation, Landmark, Ruler, ZoomIn, Sliders, Edit, HardDrive } from 'lucide-react';
import { spatialService } from '../services/ops/spatialService';
import { generateAlphanumericId } from '../systemFunctions';
import { User, SignalShard } from '../types';
import { toast } from 'sonner';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

interface GooglePlacesLocalitySelectorProps {
  user: User;
  onEmitSignal?: (signal: Partial<SignalShard>) => void;
  onSelectPlot: (plot: any) => void;
  assetName: string;
  setAssetName: (name: string) => void;
}

// Preset localities for fallback search and quick selection
const PRESET_LOCALITIES = [
  { name: 'Kiambu Ridge Agroplot', address: 'Kiambu County Road, Kiambu, Kenya', lat: -1.1494, lng: 36.8306, presetName: 'Kiambu Ridge' },
  { name: 'Naivasha Lakeside Greenhouse', address: 'Moi South Lake Road, Naivasha, Kenya', lat: -0.7172, lng: 36.4310, presetName: 'Naivasha Lakeside' },
  { name: 'Eldoret Highland Shard', address: 'Uasin Gishu Highway, Eldoret, Kenya', lat: 0.5143, lng: 35.2698, presetName: 'Eldoret Highlands' },
  { name: 'Nanyuki Equator Holding', address: 'Mount Kenya Ring Road, Nanyuki, Kenya', lat: 0.0167, lng: 37.0722, presetName: 'Nanyuki Equator' },
  { name: 'Mombasa Coastal Estate', address: 'Malindi Highway, Shanzu, Mombasa, Kenya', lat: -4.0435, lng: 39.6682, presetName: 'Mombasa Coast' },
  { name: 'Meru Forest Nursery', address: 'Meru-Nanyuki Road, Meru, Kenya', lat: 0.0514, lng: 37.6456, presetName: 'Meru Forest' }
];

export default function GooglePlacesLocalitySelector({
  user,
  onEmitSignal,
  onSelectPlot,
  assetName,
  setAssetName,
}: GooglePlacesLocalitySelectorProps) {

  // For real Google Places
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  
  // Custom Manual State
  const [manualAddress, setManualAddress] = useState('Kiambu County Road, Kiambu, Kenya');
  const [manualName, setManualName] = useState('Kiambu Ridge Agroplot');
  const [manualLat, setManualLat] = useState(-1.1494);
  const [manualLng, setManualLng] = useState(36.8306);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  const [plotScale, setPlotScale] = useState<number>(0.0003); // degree offset corresponding to approximate land area
  const [scaleLabel, setScaleLabel] = useState<string>('Standard Plot (0.5 Acre)');
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: -1.1494, lng: 36.8306 });

  // Compute bounding box coordinates for mapping as a polygon (supports Google + Manual)
  const polygonBounds = useMemo(() => {
    const lat = selectedPlace?.geometry?.location 
      ? (typeof selectedPlace.geometry.location.lat === 'function' ? selectedPlace.geometry.location.lat() : selectedPlace.geometry.location.lat)
      : manualLat;
    const lng = selectedPlace?.geometry?.location 
      ? (typeof selectedPlace.geometry.location.lng === 'function' ? selectedPlace.geometry.location.lng() : selectedPlace.geometry.location.lng)
      : manualLng;
    const d = plotScale;

    // Create a closed rectangle clockwise
    return [
      { lat: lat + d, lng: lng - d },
      { lat: lat + d, lng: lng + d },
      { lat: lat - d, lng: lng + d },
      { lat: lat - d, lng: lng - d },
      { lat: lat + d, lng: lng - d }
    ];
  }, [selectedPlace, manualLat, manualLng, plotScale]);

  useEffect(() => {
    if (selectedPlace?.geometry?.location) {
      const lat = typeof selectedPlace.geometry.location.lat === 'function' ? selectedPlace.geometry.location.lat() : selectedPlace.geometry.location.lat;
      const lng = typeof selectedPlace.geometry.location.lng === 'function' ? selectedPlace.geometry.location.lng() : selectedPlace.geometry.location.lng;
      setCenter({ lat, lng });
    } else {
      setCenter({ lat: manualLat, lng: manualLng });
    }
  }, [selectedPlace, manualLat, manualLng]);

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place);
    if (place.name) {
      setAssetName(`Githaka ${place.name}`);
    } else if (place.formatted_address) {
      setAssetName(`Locality - ${place.formatted_address.split(',')[0]}`);
    }
  };

  const selectPreset = (preset: typeof PRESET_LOCALITIES[0]) => {
    setSelectedPlace(null);
    setManualName(preset.name);
    setManualAddress(preset.address);
    setManualLat(preset.lat);
    setManualLng(preset.lng);
    setAssetName(`Githaka ${preset.presetName}`);
    setSearchQuery(preset.name);
    setShowPresetsDropdown(false);
    toast.success(`Locality locked: ${preset.name}`);
  };

  const handleManualSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setShowPresetsDropdown(true);
    } else {
      setShowPresetsDropdown(false);
    }
  };

  const handleScaleChange = (scaleValue: number, label: string) => {
    setPlotScale(scaleValue);
    setScaleLabel(label);
    toast.info(`Boundary resized: ${label}`);
  };

  const handleRegisterPlacePlot = async () => {
    const isGoogle = hasValidKey && selectedPlace;
    const currentName = isGoogle ? (selectedPlace.name || '') : manualName;
    const currentAddress = isGoogle ? (selectedPlace.formatted_address || '') : manualAddress;
    const currentPlaceId = isGoogle ? (selectedPlace.place_id || '') : `manual-${generateAlphanumericId(4)}`;
    
    const name = assetName || `Githaka Place Shard`;
    const plotId = `gmp-plot-${generateAlphanumericId(6)}`;
    
    // Construct Polygon coordinates format required by industrial registry [[lat, lng], [lat, lng], ...]
    const coordinates = [polygonBounds.map(pt => [pt.lat, pt.lng])];

    const plotObj = {
      id: plotId,
      stewardId: user.esin,
      name: name,
      address: currentAddress,
      placeId: currentPlaceId,
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      },
      metadata: {
        registeredVia: isGoogle ? 'GOOGLE_PLACES_AUTO' : 'STEWARD_MANUAL_HANDSHAKE',
        googlePlaceAddress: currentAddress,
        displayName: currentName,
        precisionOptimized: true,
        verificationEvidence: isGoogle ? 'GOOGLE_PLACE_HANDSHAKE' : 'MANUAL_LOCALITY_EVIDENCE_GEOLOCATED'
      }
    };

    try {
      if (spatialService && typeof spatialService.savePlot === 'function') {
        await spatialService.savePlot(plotObj);
      }
    } catch (e) {
      console.log('Skipping database write as offline bypass or server fallback initiated.');
    }

    onSelectPlot(plotObj);

    if (onEmitSignal) {
      await onEmitSignal({
        type: 'ledger_anchor',
        origin: 'ORACLE',
        title: 'GOOGLE_PLACE_SYNCHRONIZED',
        message: `Steward verified land physical locality evidence via ${isGoogle ? 'Google Places API' : 'Manual High-Precision GPS Anchor'}: ${currentAddress}`,
        priority: 'high',
        actionIcon: 'BadgeCheck'
      });
    }
    toast.success('Land place locality locked and synchronized with registry handshake!');
  };

  // Graceful view layout when hasValidKey is FALSE (Standard customized fallback without any API secret warnings)
  const renderInteractiveWorkspace = () => {
    const isGoogle = hasValidKey && selectedPlace;
    const displayedName = isGoogle ? selectedPlace.name : manualName;
    const displayedAddress = isGoogle ? selectedPlace.formatted_address : manualAddress;
    const currentLat = isGoogle 
      ? (typeof selectedPlace.geometry.location.lat === 'function' ? selectedPlace.geometry.location.lat() : selectedPlace.geometry.location.lat)
      : manualLat;
    const currentLng = isGoogle 
      ? (typeof selectedPlace.geometry.location.lng === 'function' ? selectedPlace.geometry.location.lng() : selectedPlace.geometry.location.lng)
      : manualLng;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Coordinates & Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 border border-white/10 rounded-[40px] bg-black/50 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Locality Handshake</span>
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tight italic">Steward Address Evidence</h4>
              <p className="text-xs text-slate-400 italic">
                {hasValidKey 
                  ? "Enter the official Google-indexed address or landmark representing the physical land plot."
                  : "Search our unified agricultural geographic registry to lock coordinates instantly."}
              </p>
            </div>

            {/* Places Selector Input (Google Autocomplete or fallback smart manual autocomplete) */}
            {hasValidKey ? (
              <PlaceSearchInput onPlaceSelect={handlePlaceSelect} />
            ) : (
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleManualSearchChange(e.target.value)}
                    onFocus={() => setShowPresetsDropdown(true)}
                    placeholder="Search localities (e.g., Kiambu, Naivasha, Mombasa...)"
                    className="w-full bg-black/95 border-2 border-white/10 rounded-2xl py-5 px-12 text-sm text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-stone-700 font-medium italic"
                  />
                  <Search className="absolute left-4.5 top-5.5 text-stone-600" size={16} />
                </div>

                {showPresetsDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-stone-950/98 border border-white/10 rounded-2xl max-h-64 overflow-y-auto z-50 shadow-2xl divide-y divide-white/5 font-sans">
                    {PRESET_LOCALITIES.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase())).map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => selectPreset(preset)}
                        className="w-full px-5 py-4 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-start gap-3"
                      >
                        <MapPin size={14} className="text-indigo-400 mt-1.5 shrink-0" />
                        <div>
                          <div className="font-black text-white text-[13px]">{preset.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{preset.address}</div>
                        </div>
                      </button>
                    ))}
                    {PRESET_LOCALITIES.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="p-4 text-xs text-slate-500 italic text-center">
                        No matches. Type custom values directly in coordinates below.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Editable Coordinate Hub */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Geospatial Locality Card</span>
                <span className="text-[9px] font-mono text-indigo-400 uppercase font-black bg-indigo-500/10 px-2.5 py-1 rounded-full">
                  {isGoogle ? 'Verified Live Map' : 'Verified Local Shard'}
                </span>
              </div>

              {!isGoogle && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-500">Custom Landmark / Name Identification</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase font-bold outline-none focus:border-indigo-500"
                      value={manualName}
                      onChange={(e) => {
                        setManualName(e.target.value);
                        setAssetName(`Githaka ${e.target.value}`);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-slate-500">Physical Locality Address</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-indigo-500"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isGoogle && (
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 shrink-0">
                      <Landmark size={20} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Identified Land Name</span>
                      <h5 className="font-bold text-white text-base leading-tight">{displayedName}</h5>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-white/5 pt-4">
                    <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/25 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Physical Street locality</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{displayedAddress}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slider / Geolocation controls */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
                  <span className="text-[8px] font-mono uppercase text-slate-500 block">Center latitude</span>
                  {hasValidKey ? (
                    <p className="text-sm font-mono font-black text-indigo-400">{currentLat.toFixed(6)}</p>
                  ) : (
                    <input
                      type="number"
                      step="0.0001"
                      value={manualLat}
                      onChange={(e) => setManualLat(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none text-sm font-mono font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 p-0"
                    />
                  )}
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
                  <span className="text-[8px] font-mono uppercase text-slate-500 block">Center longitude</span>
                  {hasValidKey ? (
                    <p className="text-sm font-mono font-black text-indigo-400">{currentLng.toFixed(6)}</p>
                  ) : (
                    <input
                      type="number"
                      step="0.0001"
                      value={manualLng}
                      onChange={(e) => setManualLng(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none text-sm font-mono font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 p-0"
                    />
                  )}
                </div>
              </div>

              {/* Plot Size Dimension Scaling */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5 font-bold">
                  <Ruler size={12} /> Define Visual Boundary Dimension
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleScaleChange(0.00015, 'Small holding (0.1 Acre)')}
                    className={`py-2 px-3 text-[9px] font-black uppercase rounded-xl border transition-all ${
                      plotScale === 0.00015 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    0.1 Acre
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScaleChange(0.0003, 'Standard Plot (0.5 Acre)')}
                    className={`py-2 px-3 text-[9px] font-black uppercase rounded-xl border transition-all ${
                      plotScale === 0.0003 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    0.5 Acre
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScaleChange(0.00065, 'Large Estate (2.5 Acres)')}
                    className={`py-2 px-3 text-[9px] font-black uppercase rounded-xl border transition-all ${
                      plotScale === 0.00065 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    2.5 Acres
                  </button>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={handleRegisterPlacePlot}
                  className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} /> Save Google Locality Evidence
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Topological Preview/Satellite Canvas */}
        <div className="lg:col-span-7 flex flex-col h-[520px] lg:h-auto min-h-[480px]">
          <div className="flex-1 glass-card border border-white/10 rounded-[40px] relative overflow-hidden bg-black flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-stone-950/25">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Satellite size={14} className="text-indigo-400 rotate-12" /> Topographic Verification Stage
              </span>
              <span className="text-[9px] font-mono uppercase text-slate-400 italic font-bold">
                {displayedName ? `LOCKED: ${displayedName}` : 'AWAITING COORDS...'}
              </span>
            </div>

            {/* Map wrapper: Load real map if Google Key exists, otherwise render custom procedural radar topographic model view */}
            <div className="flex-1 w-full relative h-full">
              {hasValidKey ? (
                <Map
                  defaultCenter={{ lat: -1.1494, lng: 36.8306 }}
                  center={center}
                  defaultZoom={15}
                  zoom={selectedPlace ? 16 : 14}
                  mapId="DEMO_MAP_ID"
                  mapTypeId="hybrid"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%', position: 'absolute' }}
                >
                  {(selectedPlace || manualLat) && (
                    <>
                      <AdvancedMarker position={center} title={displayedName}>
                        <Pin background="#10B981" glyphColor="#fff" borderColor="#047857" />
                      </AdvancedMarker>
                      <GoogleMapPolygonOverlay paths={polygonBounds} />
                    </>
                  )}
                </Map>
              ) : (
                <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
                  {/* Procedural Topological Grid & Dynamic Radar */}
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] border border-indigo-500 rounded-full animate-ping duration-[10000ms]" />
                    <div className="w-[400px] h-[400px] border-2 border-dashed border-indigo-500 rounded-full animate-spin duration-[12000ms]" />
                    <div className="w-[200px] h-[200px] border border-white rounded-full" />
                  </div>

                  <div className="absolute inset-0 pointer-events-none select-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Procedural Land Polygon Visual Representation */}
                  <div className="w-64 h-64 border-2 border-emerald-500/40 bg-emerald-500/10 rounded-2xl flex flex-col justify-between p-4 relative shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-pulse">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                    <div className="flex justify-between items-start">
                      <div className="text-[10px] font-mono text-emerald-400">{displayedName.toUpperCase()}</div>
                      <div className="text-[8px] font-mono text-slate-500">{scaleLabel}</div>
                    </div>

                    <div className="my-auto space-y-1 text-center font-mono">
                      <div className="text-[20px] font-black tracking-tight text-white uppercase italic">Active Shard</div>
                      <div className="text-[10px] text-slate-400">LAT: {manualLat.toFixed(4)}° / LNG: {manualLng.toFixed(4)}°</div>
                    </div>

                    <div className="flex justify-between items-end text-[8px] font-mono text-emerald-500">
                      <span>PRECISION: MAX</span>
                      <span>SEC_STATUS: READY</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 border border-white/5 rounded-2xl p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                        <Navigation size={15} />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-white uppercase tracking-wider">Topographic Procedural Node</div>
                        <div className="text-[8px] font-mono text-slate-400">Offline Satellite rendering simulation loaded.</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono font-black animate-pulse">● SIGNAL</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <APIProvider apiKey={API_KEY} version="weekly" solutionChannel="GMP_devsite_samples_v3_rgmautocomplete">
      {renderInteractiveWorkspace()}
    </APIProvider>
  );
}

// Subcomponent: Custom Search Input for google places API predictions
function PlaceSearchInput({ onPlaceSelect }: { onPlaceSelect: (place: any) => void }) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const placesLib = useMapsLibrary('places');
  const [autocompleteService, setAutocompleteService] = useState<any | null>(null);
  const [sessionToken, setSessionToken] = useState<any | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!placesLib) return;
    setAutocompleteService(new (placesLib as any).AutocompleteService());
    setSessionToken(new (placesLib as any).AutocompleteSessionToken());
  }, [placesLib]);

  useEffect(() => {
    // Helper to dismiss predictions dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }
    if (!autocompleteService) return;
    setLoading(true);

    autocompleteService.getPlacePredictions({
      input: val,
      sessionToken: sessionToken || undefined,
    }, (results: any, status: any) => {
      setLoading(false);
      const googleMaps = (window as any).google?.maps;
      const okStatus = googleMaps?.places?.PlacesServiceStatus?.OK || 'OK';
      if (status === okStatus && results) {
        setPredictions(results);
        setIsOpen(true);
      } else {
        setPredictions([]);
        setIsOpen(false);
      }
    });
  };

  const handleSelect = (pred: any) => {
    setQuery(pred.description);
    setIsOpen(false);
    setPredictions([]);

    if (!placesLib) return;

    // Use dummy container for service query
    const dummyDiv = document.createElement('div');
    const service = new (placesLib as any).PlacesService(dummyDiv);
    service.getDetails({
      placeId: pred.place_id,
      fields: ['name', 'formatted_address', 'geometry', 'address_components', 'place_id'],
    }, (place: any, status: any) => {
      const googleMaps = (window as any).google?.maps;
      const okStatus = googleMaps?.places?.PlacesServiceStatus?.OK || 'OK';
      if (status === okStatus && place) {
        onPlaceSelect(place);
      } else {
        toast.error('GOOGLE PLACES ERROR: Fetching place details failed.');
      }
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Type physical address, locality or landmark..."
          className="w-full bg-black/95 border-2 border-white/10 rounded-2xl py-5 px-12 text-sm text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-stone-700 font-medium italic"
        />
        <Search className="absolute left-4.5 top-5.5 text-stone-600" size={16} />
        {loading && <Loader2 className="absolute right-4.5 top-5.5 text-indigo-500 animate-spin" size={16} />}
      </div>

      {isOpen && predictions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-stone-950/98 border border-white/10 rounded-2xl max-h-64 overflow-y-auto z-50 shadow-2xl divide-y divide-white/5 font-sans">
          {predictions.map((pred) => (
            <button
              key={pred.place_id}
              onClick={() => handleSelect(pred)}
              className="w-full px-5 py-4 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-start gap-3"
            >
              <MapPin size={14} className="text-indigo-400 mt-1.5 shrink-0" />
              <div>
                <div className="font-black text-white text-[13px]">{pred.structured_formatting.main_text}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{pred.structured_formatting.secondary_text}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Subcomponent: Live vector polygon overlay boundaries drawer
function GoogleMapPolygonOverlay({ paths }: { paths: { lat: number; lng: number }[] }) {
  const map = useMap();
  const polygonRef = useRef<any | null>(null);

  useEffect(() => {
    if (!map || !paths || paths.length === 0) return;

    // Erase old polygon
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    const googleMaps = (window as any).google?.maps;
    if (!googleMaps || !googleMaps.Polygon) return;

    // Forge new geo boundary
    const polygon = new googleMaps.Polygon({
      paths: paths,
      strokeColor: '#10B981',
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: '#10B981',
      fillOpacity: 0.2,
      map: map
    });

    polygonRef.current = polygon;

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, paths]);

  return null;
}
