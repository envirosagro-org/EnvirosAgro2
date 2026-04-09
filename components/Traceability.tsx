import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LiveAgroProduct } from '../types';
import { CheckCircle2, AlertCircle, Clock, Search, Package, ArrowRight, MapPin } from 'lucide-react';
import { SEO } from './SEO';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { spatialService, Plot } from '../services/spatialService';

interface TraceabilityProps {
  product?: LiveAgroProduct;
  liveProducts?: LiveAgroProduct[];
}

const Traceability: React.FC<TraceabilityProps> = ({ product: initialProduct, liveProducts = [] }) => {
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

  const productsToDisplay = liveProducts.length > 0 ? liveProducts : [];

  const stages = ['Inception', 'Processing', 'Quality_Audit', 'Finalization', 'Market_Ready'];

  useEffect(() => {
    if (selectedProduct) {
      const idToFetch = selectedProduct.stewardId || selectedProduct.stewardEsin;
      spatialService.getPlots(idToFetch).then(plots => {
        const plot = plots.find(p => p.id === selectedProduct.plotId);
        if (plot) {
          setOriginPlot(plot);
        } else {
          // Mock plot for demo purposes if no real plot is found
          setOriginPlot({
            id: 'MOCK-PLOT-01',
            stewardId: selectedProduct.stewardEsin,
            name: 'Demo Origin Plot',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [37.7749, -122.4194],
                [37.7749, -122.4184],
                [37.7739, -122.4184],
                [37.7739, -122.4194],
                [37.7749, -122.4194]
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
    const found = productsToDisplay.find(p => p.id.toLowerCase() === searchQuery.toLowerCase() || p.productType.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelectedProduct(found);
    }
  };

  return (
    <div className="space-y-8">
      <SEO title="Traceability" description="EnvirosAgro Traceability: Verify the origin, journey, and authenticity of agricultural products." />
      {/* Search Bar */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Package className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Product Traceability</h2>
            <p className="text-sm text-slate-400">Verify the origin and journey of agricultural products.</p>
          </div>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Enter Product ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
          />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 shadow-2xl space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Recent Products</h3>
          {productsToDisplay.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <Package className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-slate-500 text-xs font-mono uppercase">No live products found in registry.</p>
            </div>
          )}
          {productsToDisplay.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedProduct?.id === p.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
            >
              <div>
                <h4 className={`font-bold ${selectedProduct?.id === p.id ? 'text-emerald-400' : 'text-white'}`}>{p.productType}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">{p.id}</p>
              </div>
              <ArrowRight className={`w-4 h-4 transition-transform ${selectedProduct?.id === p.id ? 'text-emerald-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
            </button>
          ))}
        </div>

        {/* Traceability Details */}
        {selectedProduct ? (
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/10 bg-black/40 shadow-2xl flex flex-col justify-between">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="bg-white p-4 rounded-2xl shrink-0">
                <QRCodeSVG value={`${window.location.origin}/trace/${selectedProduct.id}`} size={140} />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedProduct.productType}</h3>
                  <p className="text-slate-400 text-sm font-mono">ID: {selectedProduct.id} • Origin: {selectedProduct.location}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {selectedProduct.isAuthentic ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" /> Authenticated
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 text-sm font-bold bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                      <AlertCircle className="w-4 h-4" /> Authentication Failed
                    </span>
                  )}
                  <span className={`text-sm font-bold px-4 py-2 rounded-full border ${selectedProduct.auditStatus === 'VERIFIED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : selectedProduct.auditStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    Audit: {selectedProduct.auditStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8">Supply Chain Journey</h4>
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 -z-10"></div>
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-emerald-500 -z-10 transition-all duration-1000"
                  style={{ width: `${(stages.indexOf(selectedProduct.stage) / (stages.length - 1)) * 100}%` }}
                ></div>

                <div className="flex justify-between items-start">
                  {stages.map((stage, index) => {
                    const isCompleted = index <= stages.indexOf(selectedProduct.stage);
                    const isCurrent = index === stages.indexOf(selectedProduct.stage);
                    
                    return (
                      <div key={stage} className="flex flex-col items-center gap-3 relative group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#050706] transition-colors duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-800'} ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-slate-500" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider text-center max-w-[80px] ${isCurrent ? 'text-emerald-400' : isCompleted ? 'text-slate-300' : 'text-slate-600'}`}>
                          {stage.replace('_', ' ')}
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/10 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none">
                          {isCompleted ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* GIS Origin Map */}
            {originPlot && (
              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">GIS Origin Mapping</h4>
                </div>
                <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/10">
                  <Map
                    initialViewState={{
                      longitude: originPlot.geometry.coordinates[0][0][1],
                      latitude: originPlot.geometry.coordinates[0][0][0],
                      zoom: 16
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
                </div>
                <p className="text-xs text-slate-500 mt-4 font-mono">Precision Shard ID: {originPlot.id} • Acquired via Swarm Telemetry</p>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/10 bg-black/40 shadow-2xl flex items-center justify-center text-slate-500">
            Select a product to view its traceability details.
          </div>
        )}
      </div>
    </div>
  );
};

export default Traceability;
