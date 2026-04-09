import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Activity, ShieldCheck, Zap, Database, 
  Loader2, Radio, Binary, Link2, Globe, Cpu, 
  Workflow, Target, BadgeCheck, Terminal, 
  History, Fingerprint, Lock, Layers,
  ChevronRight, ArrowRight, ArrowUpRight,
  Database as PostgresIcon, Server, Search, RefreshCw,
  Monitor, Leaf, AlertCircle, LayoutGrid,
  Box,
  Atom,
  TrendingUp,
  Stamp,
  Circle,
  Share2,
  ZapOff
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { User, MeshNode, AgroBlock, MempoolTransaction } from '../types';
import { auditMeshStability } from '../services/agroLangService';
import { SycamoreLogo, HenIcon } from './Icons';
import { startBackgroundDataSync } from '../services/firebaseService';
import { generateAlphanumericId } from '../systemFunctions';
import { useDeviceSensors } from '../hooks/useDeviceSensors';

interface MeshProtocolProps {
  user: User;
  blockchain: AgroBlock[];
  mempool: MempoolTransaction[];
}

const INITIAL_MESH_NODES: MeshNode[] = [
  { id: 'NODE-ROOT', esin: 'EA-ROOT-001', label: 'Primary Validator', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['AFRI-4', 'EURO-82'], latency: 12, load: 45 },
  { id: 'AFRI-4', esin: 'EA-AFR-004', label: 'Nairobi Ingest', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['NODE-ROOT', 'ASIA-91'], latency: 18, load: 62 },
  { id: 'EURO-82', esin: 'EA-EUR-082', label: 'Valencia Shard', status: 'SYNCING', lastBlock: '0x882A_PEND', peers: ['NODE-ROOT', 'AMER-12'], latency: 45, load: 12 },
  { id: 'AMER-12', esin: 'EA-AMR-012', label: 'Omaha Hub', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['EURO-82'], latency: 24, load: 38 },
  { id: 'ASIA-91', esin: 'EA-ASN-091', label: 'Tokyo Relay', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['AFRI-4'], latency: 32, load: 55 },
];

const MeshProtocol: React.FC<MeshProtocolProps> = ({ user, blockchain, mempool }) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'commits' | 'mempool'>('commits');
  const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_MESH_NODES);
  const [isAuditing, setIsAuditing] = useState(false);
  const [oracleVerdict, setOracleVerdict] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [latency, setLatency] = useState(14);
  const [dcStatus, setDcStatus] = useState('RELATIONAL_SHARD_OPTIMIZED');
  const [shardsInFlight, setShardsInFlight] = useState<{ id: string; from: string; to: string; progress: number }[]>([]);
  const [tracingShard, setTracingShard] = useState<string | null>(null);
  const [tracePath, setTracePath] = useState<string[]>([]);
  
  const lastTimeRef = useRef(performance.now());
  
  const { batteryLevel, isOnline } = useDeviceSensors();

  useEffect(() => {
    return startBackgroundDataSync((newStatus) => {
      setDcStatus(newStatus === 'RELATIONAL_SHARD_OPTIMIZED' ? newStatus : 'RELATIONAL_SHARD_OPTIMIZED');
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        load: Math.min(100, Math.max(10, node.load + (Math.random() * 10 - 5))),
        latency: Math.min(500, Math.max(5, node.latency + (Math.random() * 4 - 2)))
      })));
      setLatency(prev => Math.min(500, Math.max(5, prev + (Math.random() * 4 - 2))));

      if (nodes.length > 0 && Math.random() > 0.4) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        const toIdx = Math.floor(Math.random() * nodes.length);
        if (fromIdx !== toIdx) {
          const shardId = `SHD-${generateAlphanumericId(7)}`;
          setShardsInFlight(prev => [...prev, { id: shardId, from: nodes[fromIdx].id, to: nodes[toIdx].id, progress: 0 }]);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [nodes]);

  useEffect(() => {
    let frame: number;
    const loop = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      
      setShardsInFlight(prev => prev.map(s => ({ ...s, progress: s.progress + delta * 50 })).filter(s => s.progress < 100));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleRunMeshAudit = async () => {
    setIsAuditing(true);
    setOracleVerdict(null);
    try {
      const res = await auditMeshStability({
        total_nodes: nodes.length,
        avg_latency: latency,
        consensus: 99.98,
        mesh_resonance: nodes.reduce((acc, n) => acc + (1 / (n.latency + 1)), 0)
      });
      setOracleVerdict(res.text);
    } catch (e) {
      setOracleVerdict("ORACLE_SYNC_ERROR: Mesh handshake interrupted.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleTraceShard = async () => {
    if (tracingShard) return;
    const shardId = `SHD-${generateAlphanumericId(8)}`;
    setTracingShard(shardId);
    setTracePath([]);
    
    const path = ['NODE-ROOT', 'AFRI-4', 'ASIA-91', 'EURO-82', 'AMER-12'];
    for (const nodeId of path) {
      setTracePath(prev => [...prev, nodeId]);
      await new Promise(r => setTimeout(r, 800));
    }
    
    setTimeout(() => {
      setTracingShard(null);
      setTracePath([]);
    }, 3000);
  };

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  const mapNodes = useMemo(() => [
    { id: 'NODE-ROOT', x: 50, y: 50 },
    { id: 'AFRI-4', x: 25, y: 30 },
    { id: 'EURO-82', x: 75, y: 25 },
    { id: 'AMER-12', x: 30, y: 75 },
    { id: 'ASIA-91', x: 70, y: 70 },
  ], []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto px-4 relative overflow-hidden">
      
      <div className="flex flex-col items-center gap-10">
        <div className="glass-card p-12 md:p-16 rounded-[80px] border-indigo-500/20 bg-indigo-950/10 relative overflow-hidden flex flex-col items-center w-full shadow-4xl group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
              <Network size={800} className="text-white" />
           </div>
           
           <div className="relative mb-10">
              <div className="w-48 h-48 rounded-[56px] bg-white shadow-[0_0_120px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="w-24 h-24 bg-indigo-600 rounded-[12px] flex flex-col gap-1 p-2">
                    <div className="flex gap-1 flex-1"><div className="flex-1 bg-white/20 rounded-[4px]"></div><div className="flex-1 bg-white/20 rounded-[4px]"></div></div>
                    <div className="flex gap-1 flex-1"><div className="flex-1 bg-white/20 rounded-[4px]"></div><div className="flex-1 bg-white/20 rounded-[4px]"></div></div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-4">
                 <span className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic tracking-widest">MESH_TOPOLOGY_LIVE</span>
                 <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-inner italic tracking-widest flex items-center gap-2">
                    <PostgresIcon size={12} /> {dcStatus}
                 </span>
              </div>
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Mesh <span className="text-indigo-400">Protocol.</span></h2>
              
              <div className="p-10 border-2 border-indigo-400/40 rounded-[32px] max-w-4xl bg-black/20">
                 <p className="text-slate-400 text-xl md:text-3xl font-medium italic leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                    "Direct industrial orchestration. High-frequency relational sharding is synchronized silently across the decentralized mesh architecture to ensure absolute biological finality."
                 </p>
              </div>
           </div>
        </div>

        <div className="w-full h-[600px] glass-card rounded-[80px] border border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
          <div className="absolute top-10 left-10 z-10 glass-card p-6 rounded-3xl border border-white/10 bg-black/40">
            <h3 className="text-xl font-bold text-white mb-2">Spatial Mesh Node</h3>
            <p className="text-slate-400 text-sm">Status: {isOnline ? 'Active' : 'Offline'}</p>
            <p className="text-slate-400 text-sm">Battery: {Math.round(batteryLevel * 100)}%</p>
          </div>
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Sphere args={[1, 64, 64]}>
                <MeshDistortMaterial color="#6366f1" distort={0.4} speed={2} />
              </Sphere>
              <OrbitControls enableZoom={false} />
            </Suspense>
          </Canvas>
        </div>
      </div>
      
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap justify-center gap-4 p-2 glass-card rounded-full w-fit border border-white/5 bg-black/40 shadow-xl px-12 relative z-20">
          {[
            { id: 'topology', label: 'Network Topology', icon: Network },
            { id: 'commits', label: 'Block Commits', icon: Binary },
            { id: 'mempool', label: 'Inbound Mempool', icon: Terminal },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {activeTab === 'topology' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 relative overflow-hidden min-h-[600px]">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Mesh Topology</h3>
                      <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Real-time Node Distribution & Resonance</p>
                    </div>
                    <button 
                      onClick={handleRunMeshAudit}
                      disabled={isAuditing}
                      className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-3"
                    >
                      {isAuditing ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                      Run Mesh Audit
                    </button>
                  </div>

                  <div className="flex-1 relative bg-black/20 rounded-[32px] border border-white/5 overflow-hidden">
                    {/* Visual Map Representation */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Connections */}
                      {nodes.map(node => node.peers.map(peerId => {
                        const peer = mapNodes.find(n => n.id === peerId);
                        const self = mapNodes.find(n => n.id === node.id);
                        if (!peer || !self) return null;
                        return (
                          <line 
                            key={`${node.id}-${peerId}`}
                            x1={self.x} y1={self.y} x2={peer.x} y2={peer.y}
                            stroke="rgba(99, 102, 241, 0.2)"
                            strokeWidth="0.5"
                            strokeDasharray="2 2"
                          />
                        );
                      }))}

                      {/* Shards in Flight */}
                      {shardsInFlight.map(shard => {
                        const from = mapNodes.find(n => n.id === shard.from);
                        const to = mapNodes.find(n => n.id === shard.to);
                        if (!from || !to) return null;
                        const x = from.x + (to.x - from.x) * (shard.progress / 100);
                        const y = from.y + (to.y - from.y) * (shard.progress / 100);
                        return (
                          <circle key={shard.id} cx={x} cy={y} r="0.8" fill="#6366f1">
                            <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
                          </circle>
                        );
                      })}

                      {/* Nodes */}
                      {mapNodes.map(nodePos => {
                        const node = nodes.find(n => n.id === nodePos.id);
                        if (!node) return null;
                        const isSelected = selectedNodeId === node.id;
                        return (
                          <g 
                            key={node.id} 
                            onClick={() => setSelectedNodeId(node.id)}
                            className="cursor-pointer group"
                          >
                            <circle 
                              cx={nodePos.x} cy={nodePos.y} r={isSelected ? 3 : 2} 
                              fill={node.status === 'UP' ? '#10B981' : '#F59E0B'} 
                              className="transition-all duration-500"
                            />
                            <circle 
                              cx={nodePos.x} cy={nodePos.y} r={isSelected ? 5 : 4} 
                              fill="none" 
                              stroke={node.status === 'UP' ? '#10B981' : '#F59E0B'} 
                              strokeWidth="0.2" 
                              className="animate-ping opacity-20"
                            />
                            <text 
                              x={nodePos.x} y={nodePos.y + 6} 
                              textAnchor="middle" 
                              className="text-[2px] font-black fill-slate-500 uppercase tracking-tighter group-hover:fill-white transition-colors"
                            >
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {oracleVerdict && (
                      <div className="absolute bottom-6 left-6 right-6 glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
                            <Atom className="text-indigo-400" size={20} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Oracle Consensus Verdict</h4>
                            <p className="text-sm text-white font-medium italic leading-relaxed">{oracleVerdict}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Node Inspector</h4>
                  {selectedNode ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${selectedNode.status === 'UP' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                          <Server size={24} />
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-white">{selectedNode.label}</h5>
                          <p className="text-xs text-slate-500 font-mono">{selectedNode.esin}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</p>
                          <p className="text-xl font-black text-white">{Math.round(selectedNode.latency)}<span className="text-[10px] text-slate-500 ml-1">ms</span></p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Load</p>
                          <p className="text-xl font-black text-white">{Math.round(selectedNode.load)}<span className="text-[10px] text-slate-500 ml-1">%</span></p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Peers</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.peers.map(peerId => (
                            <span key={peerId} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-400 font-mono">{peerId}</span>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={handleTraceShard}
                        disabled={!!tracingShard}
                        className="w-full py-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl text-indigo-400 font-black uppercase tracking-widest hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-3"
                      >
                        {tracingShard ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                        {tracingShard ? 'Tracing Shard...' : 'Trace Shard Path'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <Target className="w-12 h-12 text-slate-800 mx-auto" />
                      <p className="text-slate-500 text-xs font-mono uppercase">Select a node to inspect telemetry.</p>
                    </div>
                  )}
                </div>

                <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Network Health</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Consensus Resonance</span>
                      <span className="text-xs font-black text-emerald-400">99.98%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99.98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Nodes</span>
                        <span className="text-2xl font-black text-white">{nodes.length}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Shards</span>
                        <span className="text-2xl font-black text-white">{shardsInFlight.length + 124}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commits' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Chain Ledger</h3>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      <Circle size={8} className="fill-emerald-400 animate-pulse" /> Live Sync
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Height: {blockchain.length > 0 ? blockchain[blockchain.length - 1].index : 0}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {blockchain.length > 0 ? (
                    blockchain.slice().reverse().map((block, idx) => (
                      <motion.div 
                        key={block.hash}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex flex-col items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Block</span>
                              <span className="text-xl font-black text-white leading-none">#{block.index}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Confirmed Commit</h4>
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Finalized</span>
                              </div>
                              <p className="text-xs text-slate-500 font-mono truncate max-w-[200px] md:max-w-md">Hash: {block.hash}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8 text-right">
                            <div className="hidden md:flex flex-col items-end">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Validator</span>
                              <span className="text-xs font-bold text-slate-300">{block.validator}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Transactions</span>
                              <span className="text-xs font-bold text-white">{block.transactions.length} TXs</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:text-indigo-400 transition-all">
                              <ChevronRight size={18} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-32 text-center space-y-6 glass-card rounded-[48px] border border-white/5 bg-black/20">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                        <Database className="text-slate-700" size={32} />
                      </div>
                      <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">No blocks committed to ledger yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Chain Stats</h4>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Avg Block Time</span>
                      <span className="text-2xl font-black text-white">12.4s</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Transactions</span>
                      <span className="text-2xl font-black text-white">{blockchain.reduce((acc, b) => acc + b.transactions.length, 0)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Difficulty</span>
                      <span className="text-2xl font-black text-indigo-400">4.2 TH/s</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Recent Activity</h4>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        <p className="text-[10px] text-slate-400 font-mono">Block #{1024 - i} confirmed by EA-ROOT</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mempool' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Inbound Mempool</h3>
                  <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded-full border border-amber-500/20 animate-pulse">
                    Awaiting Consensus
                  </span>
                </div>

                <div className="space-y-4">
                  {mempool.length > 0 ? (
                    mempool.map((tx, idx) => (
                      <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 rounded-3xl border border-white/5 bg-black/40 hover:border-amber-500/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                              <Zap size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white uppercase tracking-widest">{tx.data.type}</h4>
                              <p className="text-[10px] text-slate-500 font-mono">TX_ID: {tx.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-white leading-none">{tx.data.value} <span className="text-[10px] text-slate-500 uppercase">{tx.data.unit}</span></p>
                            <p className="text-[9px] text-slate-500 font-mono mt-1">Steward: {tx.stewardId}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <p className="text-[10px] text-slate-400 italic">{tx.data.details}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Pending</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-32 text-center space-y-6 glass-card rounded-[48px] border border-white/5 bg-black/20">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                        <ZapOff className="text-slate-700" size={32} />
                      </div>
                      <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Mempool is currently empty.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Mempool Analytics</h4>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pending Volume</span>
                      <span className="text-2xl font-black text-white">{mempool.length} TXs</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Confirmation Time</span>
                      <span className="text-2xl font-black text-amber-400">~45s</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Congestion</span>
                      <span className="text-2xl font-black text-emerald-400">Low</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50 animate-scan"></div>
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Security Scan</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Double Spend Check</span>
                      <BadgeCheck size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Signature Verification</span>
                      <BadgeCheck size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Payload Integrity</span>
                      <BadgeCheck size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 80px 250px -50px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default MeshProtocol;
