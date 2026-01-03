
import React from 'react';
import { Globe, MapPin, Server, Activity, AlertCircle, Shield } from 'lucide-react';

const NetworkView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl overflow-hidden relative min-h-[500px] flex items-center justify-center">
        {/* Simulated Global Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="https://picsum.photos/1200/800?grayscale" 
            className="w-full h-full object-cover"
            alt="Map Overlay"
          />
        </div>

        {/* Floating Data Nodes */}
        <div className="relative z-10 w-full p-8">
          <div className="max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Global Consensus Status
            </h3>
            <div className="space-y-4">
              {[
                { region: 'North America', nodes: 1284, ping: '24ms', load: 45 },
                { region: 'Europe', nodes: 942, ping: '18ms', load: 62 },
                { region: 'East Asia', nodes: 1540, ping: '42ms', load: 88 },
                { region: 'South America', nodes: 420, ping: '110ms', load: 30 },
              ].map((region) => (
                <div key={region.region} className="group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      {region.region}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">{region.ping}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500/50" 
                        style={{ width: `${region.load}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400 min-w-[60px]">{region.nodes} nodes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pulse Indicators on Map (Mock) */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <Server className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="font-bold text-white mb-2">Protocol Sharding</h4>
          <p className="text-sm text-slate-400">Data is distributed across 64 secure shards to ensure 10,000+ transactions per second.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          {/* Fix: Shield icon component used here */}
          <Shield className="w-8 h-8 text-emerald-400 mb-4" />
          <h4 className="font-bold text-white mb-2">Zero-Knowledge Proofs</h4>
          <p className="text-sm text-slate-400">Farm telemetry is verified using ZK-Rollups to preserve farmer privacy while ensuring credit validity.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-4" />
          <h4 className="font-bold text-white mb-2">Decentralized Governance</h4>
          <p className="text-sm text-slate-400">Parameter changes are voted on by the Enviros DAO, currently over 12,000 active stakers.</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkView;
