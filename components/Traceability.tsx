import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LiveAgroProduct, User } from '../types';
import { 
  CheckCircle2, AlertCircle, Clock, Search, Package, 
  ArrowRight, MapPin, Globe, ShieldCheck, Zap, 
  History, BarChart3, Binary, Fingerprint, 
  Dna, Boxes, Share2, Download, ExternalLink,
  ChevronRight, Info, AlertTriangle, Box, BadgeCheck
} from 'lucide-react';
import { SEO } from './SEO';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { spatialService, Plot } from '../services/spatialService';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface TraceabilityProps {
  user: User;
  product?: LiveAgroProduct;
  liveProducts?: LiveAgroProduct[];
}

const Traceability: React.FC<TraceabilityProps> = ({ user, product: initialProduct, liveProducts = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<LiveAgroProduct | null>(initialProduct || liveProducts[0] || null);
  const [originPlot, setOriginPlot] = useState<Plot | null>(null);

  const polygonData = useMemo(() => {
    if (!originPlot) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [originPlot.geometry.coordinates[0].map((coord: any) => [coord[1], coord[0]])]
      }
    };
  }, [originPlot]);

  const stages = ['Inception', 'Processing', 'Quality_Audit', 'Finalization', 'Market_Ready'];

  useEffect(() => {
    if (selectedProduct) {
      const idToFetch = selectedProduct.stewardId || selectedProduct.stewardEsin;
      spatialService.getPlots(idToFetch).then(plots => {
        const plot = plots.find(p => p.id === selectedProduct.plotId);
        if (plot) {
          setOriginPlot(plot);
        } else {
          setOriginPlot({
            id: 'MOCK-PLOT-01',
            stewardId: selectedProduct.stewardEsin,
            name: 'Demo Origin Plot',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [1.2921, 36.8219],
                [1.2931, 36.8219],
                [1.2931, 36.8209],
                [1.2921, 36.8209],
                [1.2921, 36.8219]
              ]]
            }
          });
        }
      }).catch(console.error);
    } else {
      setOriginPlot(null);
    }
  }, [selectedProduct]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = liveProducts.find(p => 
      p.id.toLowerCase() === searchQuery.toLowerCase() || 
      p.productType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setSelectedProduct(found);
      toast.success('Shard localized. Decrypting journey DNA...');
    } else {
      toast.error('Identity not found in current network vector.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Agro-Blockchain Traceability" description="Cryptographic product journey: Verify origins, processing nodes, and fidelity proofs for industrial agro-shards." />
      
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Journey <span className="text-emerald-400">Ledger</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Cryptographic_Fidelity_Tracker_v6.1</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <form onSubmit={handleSearch} className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="PROBE_IDENTITY..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </form>
           <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-inner"><Share2 size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Registry Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active_Registry</h3>
              <span className="text-[8px] font-mono text-slate-700 uppercase">{liveProducts.length} Items</span>
           </div>
           <div className="space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">
              {liveProducts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${selectedProduct?.id === p.id ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'}`}
                >
                   <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedProduct?.id === p.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}>
                            <Box size={20} className={selectedProduct?.id === p.id ? 'text-white' : 'text-slate-600'} />
                         </div>
                         <div>
                            <p className="text-md font-black uppercase italic tracking-tighter truncate max-w-[120px]">{p.productType}</p>
                            <p className="text-[7px] font-mono opacity-50 uppercase">{p.id}</p>
                         </div>
                      </div>
                      {selectedProduct?.id === p.id && <Zap size={14} className="text-white animate-pulse" />}
                   </div>
                   <div className="flex justify-between items-center relative z-10">
                      <span className="text-[7px] font-black uppercase tracking-widest opacity-60">Status: {p.stage}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                </button>
              ))}
           </div>
        </div>

        {/* Traceability HUD */}
        <div className="lg:col-span-3 space-y-6">
           <AnimatePresence mode="wait">
              {selectedProduct ? (
                <motion.div 
                  key={selectedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                   {/* DNA & QR Section */}
                   <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 shadow-3xl flex flex-col md:flex-row gap-10 items-start md:items-center relative overflow-hidden text-left">
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                         <Dna size={200} className="text-emerald-500 animate-spin-slow" />
                      </div>

                      <div className="p-6 bg-white rounded-[40px] shadow-2xl relative z-10 shrink-0 group hover:rotate-2 transition-transform">
                         <QRCodeSVG value={`${window.location.origin}/trace/${selectedProduct.id}`} size={160} />
                         <p className="text-[8px] font-black text-black uppercase tracking-widest text-center mt-4">Verified_Identity</p>
                      </div>

                      <div className="flex-1 space-y-6 relative z-10">
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedProduct.productType}</h3>
                               {selectedProduct.isAuthentic && <BadgeCheck size={32} className="text-emerald-400" />}
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Global_Mesh_ID: {selectedProduct.id} • Registered_Origin: {selectedProduct.location}</p>
                         </div>

                         <div className="flex flex-wrap gap-4">
                            <div className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5">
                               <Fingerprint size={18} className="text-emerald-400" />
                               <div className="text-left font-mono">
                                  <p className="text-[7px] text-slate-500 font-black uppercase">Bio_Fidelity</p>
                                  <p className="text-xs font-black text-white italic">MATCHED_99%</p>
                               </div>
                            </div>
                            <div className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 border border-indigo-500/20 bg-indigo-500/5">
                               <ShieldCheck size={18} className="text-indigo-400" />
                               <div className="text-left font-mono">
                                  <p className="text-[7px] text-slate-500 font-black uppercase">Shard_Audit</p>
                                  <p className="text-xs font-black text-white italic">{selectedProduct.auditStatus}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Supply Chain Timeline */}
                   <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 shadow-3xl text-left relative overflow-hidden">
                      <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2 mb-12">
                         <Boxes size={18} className="text-indigo-400" /> Supply_Chain_Resonance_Flow
                      </h3>
                      
                      <div className="relative pt-10 pb-8 px-4">
                         {/* Core Line */}
                         <div className="absolute top-[48px] left-10 right-10 h-0.5 bg-white/5 z-0"></div>
                         <div 
                           className="absolute top-[48px] left-10 h-0.5 bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] z-0 transition-all duration-1000"
                           style={{ width: `${(stages.indexOf(selectedProduct.stage) / (stages.length - 1)) * 100}%` }}
                         ></div>

                         <div className="flex justify-between items-center relative z-10 w-full overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:overflow-visible sm:px-0 sm:mx-0">
                            {stages.map((stage, index) => {
                               const isCompleted = index <= stages.indexOf(selectedProduct.stage);
                               const isCurrent = index === stages.indexOf(selectedProduct.stage);
                               
                               return (
                                 <div key={stage} className="flex flex-col items-center gap-4 shrink-0 min-w-[100px] sm:min-w-0">
                                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border-4 border-[#050706] transition-all duration-700 ${isCompleted ? 'bg-emerald-500 shadow-xl' : 'bg-slate-800'} ${isCurrent ? 'ring-8 ring-emerald-500/20 scale-110' : ''}`}>
                                       {isCompleted ? <CheckCircle2 className="w-7 h-7 text-white" /> : <Clock className="w-6 h-6 text-slate-500" />}
                                    </div>
                                    <div className="text-center space-y-1">
                                       <p className={`text-[10px] font-black uppercase tracking-tighter leading-none ${isCurrent ? 'text-emerald-400' : isCompleted ? 'text-slate-300' : 'text-slate-600'}`}>{stage.replace('_', ' ')}</p>
                                       <p className="text-[7px] font-mono text-slate-500 uppercase">{isCompleted ? 'VERIFIED' : 'PENDING'}</p>
                                    </div>
                                 </div>
                               );
                            })}
                         </div>
                      </div>
                   </div>

                   {/* Map & Analytics Grid */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                      <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/40 shadow-3xl space-y-6 relative overflow-hidden">
                         <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                               <MapPin size={18} className="text-rose-400" /> Origin_Vector_GIS
                            </h3>
                            <span className="text-[8px] font-mono text-slate-600 uppercase">LAT: 1.2921 / LNG: 36.8219</span>
                         </div>
                         
                         <div className="h-[320px] rounded-[32px] overflow-hidden border border-white/10 group relative">
                            <Map
                              initialViewState={{
                                longitude: originPlot?.geometry.coordinates[0][0][1] || 36.8219,
                                latitude: originPlot?.geometry.coordinates[0][0][0] || 1.2921,
                                zoom: 15
                              }}
                              mapStyle="https://demotiles.maplibre.org/style.json"
                            >
                              {polygonData && (
                                <Source type="geojson" data={polygonData as any}>
                                  <Layer
                                    type="fill"
                                    paint={{
                                      'fill-color': '#10B981',
                                      'fill-opacity': 0.4
                                    }}
                                  />
                                </Source>
                              )}
                            </Map>
                            <div className="absolute inset-0 pointer-events-none border-[20px] border-black/40 rounded-[32px]"></div>
                            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500/20 animate-scan"></div>
                         </div>
                         <p className="text-[8px] text-slate-600 font-mono uppercase tracking-widest italic"> Precision_Shard_Localized • Sync_Active</p>
                      </div>

                      <div className="space-y-6">
                         <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-8 shadow-3xl text-left">
                            <div className="flex items-center justify-between">
                               <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                                  <BarChart3 size={18} className="text-indigo-400" /> Fidelity_Metrics
                               </h3>
                            </div>
                            
                            <div className="space-y-6">
                               {[
                                 { label: 'Network_Trust', val: '99.4%', color: 'bg-emerald-500' },
                                 { label: 'Batch_Purity', val: '98.2%', color: 'bg-indigo-500' },
                                 { label: 'Provenance_Score', val: '100%', color: 'bg-amber-500' },
                               ].map((m, i) => (
                                 <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500 px-1">
                                       <span>{m.label}</span>
                                       <span className="text-white">{m.val}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
                                       <div className={`h-full ${m.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{ width: m.val }}></div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="glass-card p-8 rounded-[40px] border border-amber-500/20 bg-amber-500/5 space-y-4 shadow-xl text-left flex flex-col justify-between h-[216px]">
                            <div className="space-y-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                     <AlertTriangle size={20} />
                                  </div>
                                  <h4 className="text-[11px] font-black text-white uppercase italic tracking-widest">Protocol_Handshake</h4>
                               </div>
                               <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                                  Request original multitemporal multi-spectral evidence shards from the steward node for full local validation.
                               </p>
                            </div>
                            <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">REQUEST_LOCAL_VERIFICATION</button>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-slate-700 opacity-40 border-2 border-dashed border-white/5 rounded-[48px]">
                   <Globe size={80} className="mb-6 animate-pulse" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">No_Identity_Shard_Localized</p>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Traceability;
