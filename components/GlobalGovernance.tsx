import React, { useState } from 'react';
import { 
  ShieldCheck, Globe, Settings, Users, 
  Vote, Fingerprint, Lock, Cpu,
  ExternalLink, ChevronRight, AlertCircle,
  Database, Network, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';
import { SectionTabs } from './SectionTabs';
import { User } from '../types';

interface GlobalGovernanceProps {
  user: User;
}

export const GlobalGovernance: React.FC<GlobalGovernanceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'protocol' | 'identity' | 'governance'>('protocol');

  const governanceStats = [
    { label: 'Active Proposals', value: '412', icon: Vote, color: 'text-emerald-400' },
    { label: 'Market Quorum', value: '68.2%', icon: Users, color: 'text-indigo-400' },
    { label: 'Sync Nodes', value: '9,102', icon: Network, color: 'text-amber-400' },
    { label: 'Protocol Rev', value: 'v4.2.1', icon: Cpu, color: 'text-white' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 mx-auto px-4 w-full">
      <SEO title="Global Governance | EnvirosAgro" description="Industrial Protocol Governance, Identity Proofing, and Mesh DAO Voting." />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            Protocol <span className="text-indigo-400">Command</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] italic">Decentralized_Agro_Matrix_v1.0</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
          {governanceStats.map((s, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 min-w-[140px]">
              <div className="flex items-center gap-3 mb-2">
                <s.icon size={12} className={s.color} />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{s.label}</span>
              </div>
              <p className="text-lg font-black text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <SectionTabs 
            tabs={[
              { id: 'protocol', label: 'Protocol Sync', icon: Database },
              { id: 'identity', label: 'Identity Proof', icon: Fingerprint },
              { id: 'governance', label: 'Mesh Voting', icon: Vote }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            variant="glass"
          />

          <AnimatePresence mode="wait">
            {activeTab === 'protocol' && (
              <motion.div 
                key="protocol"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-8 rounded-[48px] border-2 border-white/5 bg-black/40 space-y-6">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                      <Settings size={20} className="text-indigo-400" /> Node_Mesh_Config
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Transmission Frequency', val: 'Low_Latency_10Hz', active: true },
                        { label: 'Shard Encryption', val: 'AES_512_Quantum', active: true },
                        { label: 'GPS Precision', val: 'RTK_High_Res', active: true },
                        { label: 'Automatic MRV Sync', val: 'ENABLED', active: true },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</span>
                          <span className={`text-[10px] font-black ${c.active ? 'text-emerald-400' : 'text-slate-500'}`}>{c.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-[48px] border-2 border-white/5 bg-black/40 space-y-6">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                      <Key size={20} className="text-amber-400" /> Security_Uplinks
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Hardware Key', val: '0x4...F2A', status: 'VERIFIED' },
                        { label: 'Backup Seed', val: 'ENCRYPTED', status: 'SECURED' },
                        { label: 'Multi-Sig Mode', val: 'ACTIVE (2/3)', status: 'SYNCED' },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</span>
                          <span className="text-[10px] font-black text-indigo-400">{c.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'identity' && (
              <motion.div 
                key="identity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden text-center space-y-8"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="w-24 h-24 bg-indigo-600/20 rounded-[32px] border-2 border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 relative z-10">
                  <Fingerprint size={48} />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Identity_Core_Verification</h3>
                  <p className="max-w-md mx-auto text-sm text-slate-400 font-medium leading-relaxed">
                    Proof of Personhood is required for governance participation and high-volume carbon minting. Connect your Decentralized ID (DID) to continue.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
                  {[
                    { label: 'Biometric Hash', status: 'VERIFIED', icon: ShieldCheck, color: 'text-emerald-400' },
                    { label: 'Citizen Proof', status: 'PENDING', icon: Globe, color: 'text-amber-400' },
                    { label: 'Network Stake', status: 'VERIFIED', icon: Network, color: 'text-indigo-400' },
                  ].map((p, i) => (
                    <div key={i} className="p-6 bg-black/40 rounded-[32px] border border-white/10 space-y-4">
                      <div className={`p-3 w-fit mx-auto rounded-xl bg-white/5 border border-white/5 ${p.color}`}>
                        <p.icon size={20} />
                      </div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{p.label}</p>
                      <p className={`text-[9px] font-black uppercase ${p.status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>{p.status}</p>
                    </div>
                  ))}
                </div>

                <button className="agro-gradient px-12 py-6 rounded-full text-white font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm group">
                  COMMENCE_ID_UPLINK <ChevronRight className="inline-block ml-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            )}

            {activeTab === 'governance' && (
              <motion.div 
                key="governance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="glass-card p-10 rounded-[48px] border-2 border-white/5 bg-black/40 hover:bg-white/5 transition-all group">
                      <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                          <Vote size={24} />
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">PROP_ID: 9412_{i}</span>
                      </div>
                      <div className="space-y-4 mb-8">
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none">Protocol_Upgrade_v{i}.5</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 font-medium">Re-orienting the mesh consensus algorithm to prioritize high-velocity carbon sinks in tropical regions.</p>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                            <span>Quorum Progress</span>
                            <span className="text-white">74%</span>
                         </div>
                         <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-[74%]"></div>
                         </div>
                      </div>
                      <button className="w-full mt-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:border-emerald-500 transition-all flex items-center justify-center gap-3">
                         CAST_MESH_VOTE <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Alerts HUD */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="glass-card p-8 rounded-[48px] border-2 border-red-500/20 bg-red-500/5 space-y-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] rounded-full"></div>
             <div className="flex items-center justify-between relative z-10">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                   <AlertCircle size={18} className="text-red-400 animate-pulse" /> Critical_HUD
                </h3>
                <span className="text-[8px] font-mono text-red-400/50">LIVE_PULSE</span>
             </div>

             <div className="space-y-4 relative z-10">
                {[
                  { title: 'MESH_SYNC_TIMEOUT', desc: 'Node_741 reporting high latency.', time: '2m ago' },
                  { title: 'ESCROW_RELEASE_AUTH', desc: 'Awaiting user biometric proof.', time: '14m ago' },
                  { title: 'CARBON_VELOCITY_SPIKE', desc: 'Unusual minting volume detected.', time: '1h ago' },
                ].map((a, i) => (
                  <div key={i} className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 space-y-1 group">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">{a.title}</p>
                      <span className="text-[7px] text-red-400/60 font-mono">{a.time}</span>
                    </div>
                    <p className="text-[9px] text-red-200/40 font-medium">{a.desc}</p>
                  </div>
                ))}
             </div>

             <button className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl text-[8px] font-black uppercase tracking-widest transition-all border border-red-500/20">
                ACKNOWLEDGE_ALL_THREATS
             </button>
          </div>

          <div className="glass-card p-8 rounded-[48px] border-2 border-indigo-500/20 bg-black/40 space-y-6">
             <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                <Network size={18} className="text-indigo-400" /> Mesh_Topography
             </h3>
             <div className="aspect-square bg-indigo-500/5 rounded-3xl border border-indigo-500/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                   <Globe size={120} className="text-indigo-500/20 animate-spin-slow" />
                </div>
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-700"></div>
             </div>
             <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE_NODES</span>
                <span className="text-white">41,209</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
