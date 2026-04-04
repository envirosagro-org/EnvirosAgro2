import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Mic, 
  Radio, 
  Phone, 
  PhoneOff, 
  ShieldCheck, 
  Activity, 
  Users, 
  MessageSquare, 
  Send, 
  Play, 
  Square,
  Hash,
  Globe,
  Lock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Boxes,
  Share2,
  Layers,
  Plane,
  Settings,
  Database,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { webrtcService } from '../services/webrtcService';
import { broadcastService } from '../services/broadcastService';
import { auth, db } from '../services/firebaseService';
import { onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { spatialService } from '../services/spatialService';
import { telemetryService } from '../services/telemetryService';
import { User, ViewState, WebRTCCall, BroadcastSession, BroadcastComment, SpatialTransform, DroneTelemetry, TelemetryBatch, AgroBlock } from '../types';
import { useAppStore } from '../store';
import { SEO } from './SEO';

interface MediaHubProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, section?: string | null) => void;
  onEmitSignal: (signal: any) => void;
  initialSection?: string | null;
}

export const MediaHub: React.FC<MediaHubProps> = ({ 
  user: currentUser, 
  onEarnEAC, 
  onSpendEAC, 
  onNavigate, 
  onEmitSignal,
  initialSection 
}) => {
  const { 
    blockchain, 
    setBlockchain,
    ecosystemState,
    updateEcosystemState
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'calls' | 'streams' | 'podcasts' | 'ledger' | 'spatial' | 'drone'>(
    initialSection === 'video' ? 'calls' : 
    initialSection === 'podcast' ? 'podcasts' : 
    initialSection === 'livestream' ? 'streams' : 'calls'
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<WebRTCCall | null>(null);
  const [targetPeerId, setTargetPeerId] = useState('');
  
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [currentBroadcastId, setCurrentBroadcastId] = useState<string | null>(null);
  const [viewingSessionId, setViewingSessionId] = useState<string | null>(null);
  const [liveSessions, setLiveSessions] = useState<BroadcastSession[]>([]);
  const [comments, setComments] = useState<BroadcastComment[]>([]);
  const [commentText, setCommentText] = useState('');

  const [spatialUsers, setSpatialUsers] = useState<Record<string, SpatialTransform>>({});
  const [isSpatialActive, setIsSpatialActive] = useState(false);
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetry[]>([]);
  const [telemetryBatches, setTelemetryBatches] = useState<TelemetryBatch[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const broadcastVideoRef = useRef<HTMLVideoElement>(null);

  // --- WEBRTC CALLS ---
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Listen for incoming calls
    const q = query(
      collection(db, 'calls'), 
      where('calleeId', '==', userId), 
      where('status', '==', 'OFFERING'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const callData = snapshot.docs[0].data() as WebRTCCall;
        setIncomingCall({ ...callData, id: snapshot.docs[0].id });
      } else {
        setIncomingCall(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const startCall = async (targetId: string, targetName: string) => {
    try {
      const stream = await webrtcService.startLocalStream();
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const callId = await webrtcService.createCall(targetId, targetName, currentUser?.name || 'Steward');
      setCurrentCallId(callId);
      setIsCalling(true);
      
      onEarnEAC(10, 'CALL_INITIATED_YIELD');

      onEmitSignal({
        title: 'CALL_INITIATED',
        message: `Establishing secure WebRTC link with ${targetName}.`,
        priority: 'medium',
        type: 'network',
        origin: 'ORACLE',
        actionIcon: 'Phone',
        dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
      });

      webrtcService.onRemoteStream((remote) => {
        setRemoteStream(remote);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
      });
    } catch (err) {
      console.error("Call failed:", err);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    try {
      const stream = await webrtcService.startLocalStream();
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      await webrtcService.answerCall(incomingCall.id);
      setCurrentCallId(incomingCall.id);
      setIsCalling(true);
      onEarnEAC(15, 'CALL_ANSWERED_YIELD');
      setIncomingCall(null);

      webrtcService.onRemoteStream((remote) => {
        setRemoteStream(remote);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
      });
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const endCall = async () => {
    if (currentCallId) {
      await webrtcService.hangup(currentCallId);
      
      onEarnEAC(5, 'CALL_TERMINATED_SYNC');
      onEmitSignal({
        title: 'CALL_TERMINATED',
        message: `Secure link with peer has been severed.`,
        priority: 'low',
        type: 'network',
        origin: 'ORACLE',
        actionIcon: 'PhoneOff',
        dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
      });

      setCurrentCallId(null);
      setIsCalling(false);
      setLocalStream(null);
      setRemoteStream(null);
    }
  };

  // --- BROADCASTS ---
  useEffect(() => {
    // Listen for live broadcasts
    const q = query(collection(db, 'broadcasts'), where('status', '==', 'LIVE'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLiveSessions(snapshot.docs.map(d => d.data() as BroadcastSession));
    });
    return () => unsubscribe();
  }, []);

  // Listen to comments for current broadcast or viewed session
  useEffect(() => {
    const targetId = currentBroadcastId || viewingSessionId;
    if (targetId) {
      const unsubscribe = broadcastService.listenToComments(targetId, (newComment) => {
        setComments(prev => {
          const exists = prev.some(c => c.id === newComment.id);
          if (exists) return prev;
          return [...prev, newComment].slice(-50);
        });
      });
      return () => unsubscribe();
    } else {
      setComments([]);
    }
  }, [currentBroadcastId, viewingSessionId]);

  // --- SPATIAL SYNC ---
  useEffect(() => {
    if (activeTab === 'spatial') {
      spatialService.listenToUsers(setSpatialUsers);
      return () => spatialService.stopListening();
    }
  }, [activeTab]);

  const toggleSpatialSync = () => {
    const newState = !isSpatialActive;
    setIsSpatialActive(newState);
    updateEcosystemState({ isAnchored: newState });

    if (newState) {
      onEmitSignal({
        title: 'SPATIAL_MESH_ACTIVE',
        message: 'Real-time spatial synchronization initialized. Anchoring node to global mesh.',
        priority: 'medium',
        type: 'system',
        origin: 'ORACLE',
        actionIcon: 'Boxes',
        dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
      });

      // Mock spatial updates
      const interval = setInterval(() => {
        if (!newState) {
          clearInterval(interval);
          return;
        }
        spatialService.updateTransform({
          pos: { x: Math.random() * 10, y: 1.2, z: Math.random() * 10 },
          rot: { x: 0, y: Math.random() * 360, z: 0 },
          anim_state: 'walking'
        }, currentUser?.esin);
      }, 1000);
    }
  };

  // --- IOT TELEMETRY ---
  useEffect(() => {
    if (activeTab === 'drone') {
      const unsubscribe = telemetryService.listenToBatches('DRONE-001', (batches) => {
        setTelemetryBatches(batches);
        
        // Synchronize with global blockchain if new batches arrive
        if (batches.length > 0) {
          const latestBatch = batches[0];
          const exists = blockchain.some(b => b.hash === latestBatch.hash);
          if (!exists) {
            const newBlock: AgroBlock = {
              index: blockchain.length + 1,
              timestamp: latestBatch.endTime,
              transactions: [{
                id: `TX-${latestBatch.id}`,
                type: 'TELEMETRY_LOG',
                farmId: 'ENVIROS_AGRO_01',
                details: `Verified telemetry batch from drone DRONE-001. ${latestBatch.readings.length} samples.`,
                value: latestBatch.readings.length,
                unit: 'SAMPLES',
                payloadHash: latestBatch.hash
              }],
              previousHash: blockchain[blockchain.length - 1]?.hash || '0',
              hash: latestBatch.hash,
              validator: 'ORACLE_NODE_01',
              status: 'Confirmed'
            };
            setBlockchain([newBlock, ...blockchain]);
            
            onEmitSignal({
              title: 'BLOCK_VERIFIED',
              message: `New telemetry block #${newBlock.index} added to the ledger.`,
              priority: 'low',
              type: 'ledger_anchor',
              origin: 'ORACLE',
              actionIcon: 'ShieldCheck',
              dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
            });
          }
        }
      });
      return () => unsubscribe();
    }
  }, [activeTab, blockchain, setBlockchain, onEmitSignal]);

  const sendMockTelemetry = () => {
    telemetryService.addReading({
      droneId: 'DRONE-001',
      gps: { lat: 37.42, lng: -122.08, alt: 150 },
      battery: 85,
      speed: 12.5,
      heading: 90,
      sensors: {
        soil_ph: 6.5,
        humidity: 45,
        temp: 22
      }
    });
  };

  const startBroadcast = async (typeOverride?: 'LIVE' | 'PODCAST', titleOverride?: string) => {
    const title = titleOverride || broadcastTitle;
    if (!title && !titleOverride) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (broadcastVideoRef.current) broadcastVideoRef.current.srcObject = stream;

      const type = typeOverride === 'LIVE' ? 'LIVE_STREAM' : (typeOverride === 'PODCAST' ? 'PODCAST' : 'DRONE');
      const id = await broadcastService.startBroadcast(title || `New ${activeTab} Signal`, type, stream);
      setCurrentBroadcastId(id);
      setIsBroadcasting(true);
      
      onEarnEAC(25, 'BROADCAST_INITIATED_YIELD');

      onEmitSignal({
        title: 'BROADCAST_LIVE',
        message: `Signal "${title}" is now transmitting across the mesh.`,
        priority: 'high',
        type: 'network',
        origin: 'ORACLE',
        actionIcon: 'Radio',
        dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }, { channel: 'INBOX', status: 'PENDING' }]
      });
    } catch (err) {
      console.error("Broadcast failed:", err);
    }
  };

  const stopBroadcast = async () => {
    if (currentBroadcastId) {
      await broadcastService.stopBroadcast();
      
      onEarnEAC(10, 'BROADCAST_TERMINATED_SYNC');
      onEmitSignal({
        title: 'BROADCAST_TERMINATED',
        message: `Signal transmission has been successfully concluded.`,
        priority: 'low',
        type: 'network',
        origin: 'ORACLE',
        actionIcon: 'Square',
        dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
      });

      setIsBroadcasting(false);
      setCurrentBroadcastId(null);
      setLocalStream(null);
    }
  };

  return (
    <div className="flex flex-col min-h-[150vh] bg-[#050505] text-white p-6 md:p-12 font-sans pb-32 max-w-7xl mx-auto w-full relative">
      <SEO title="Media Hub" description="EnvirosAgro Media Hub: Access agricultural broadcasts, real-time communications, and spatial data." />
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header & Navigation */}
      <div className="sticky top-0 z-[100] bg-[#050505]/80 backdrop-blur-2xl -mx-6 md:-mx-12 px-6 md:px-12 py-6 mb-12 border-b border-white/5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter flex items-center gap-4 leading-none"
            >
              <Globe className="w-10 h-10 md:w-16 md:h-16 text-emerald-500" />
              MEDIA HUB
            </motion.h1>
            <p className="text-zinc-500 text-[10px] mt-3 uppercase tracking-[0.4em] font-mono border-l-2 border-emerald-500 pl-4">
              Decentralized P2P Signaling & Broadcast Ledger
            </p>
          </div>
          
          {/* Scrollable Tabs */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar flex items-center gap-2 bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
            {(['calls', 'streams', 'podcasts', 'spatial', 'drone', 'ledger'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap flex items-center gap-3 ${
                  activeTab === tab 
                    ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'calls' && <Phone className="w-3 h-3" />}
                {tab === 'streams' && <Video className="w-3 h-3" />}
                {tab === 'podcasts' && <Mic className="w-3 h-3" />}
                {tab === 'spatial' && <Boxes className="w-3 h-3" />}
                {tab === 'drone' && <Zap className="w-3 h-3" />}
                {tab === 'ledger' && <ShieldCheck className="w-3 h-3" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-12 min-h-[800px]">
          {activeTab === 'calls' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-8"
            >
              {/* Call Interface */}
              <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-0 lg:aspect-[21/9] bg-zinc-950/80 rounded-[3rem] border border-white/10 overflow-hidden group shadow-[0_0_100px_rgba(16,185,129,0.15)] backdrop-blur-3xl ring-1 ring-white/5 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)] before:pointer-events-none">
                {remoteStream ? (
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#080808]">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
                      <div className="relative z-10 p-12 bg-zinc-900/50 rounded-full border border-white/5 backdrop-blur-3xl">
                        <Video className="w-24 h-24 text-emerald-500/20" />
                      </div>
                    </div>
                    <div className="mt-12 text-center">
                      <p className="text-emerald-500 font-mono text-[10px] uppercase tracking-[0.6em] animate-pulse">
                        Awaiting Peer Handshake...
                      </p>
                      <p className="text-zinc-700 font-mono text-[8px] uppercase tracking-[0.3em] mt-4">
                        Secure P2P Node: {auth.currentUser?.uid?.slice(0, 12)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Local Preview */}
                <div className="absolute bottom-10 right-10 w-48 md:w-72 aspect-video bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl z-20 backdrop-blur-3xl">
                  {localStream ? (
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/50">
                      <Users className="w-8 h-8 text-zinc-800" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/5 text-[8px] font-black uppercase tracking-widest">
                    Local Node
                  </div>
                </div>

                {/* Call Controls */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
                  {isCalling ? (
                    <button 
                      onClick={endCall}
                      className="w-24 h-24 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)] transition-all active:scale-90 group"
                    >
                      <PhoneOff className="w-10 h-10 text-white group-hover:rotate-12 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 bg-black/60 backdrop-blur-3xl p-3 rounded-full border border-white/10 shadow-2xl">
                      <input 
                        type="text" 
                        value={targetPeerId}
                        onChange={(e) => setTargetPeerId(e.target.value)}
                        placeholder="PEER ESIN OR UID..."
                        className="bg-transparent px-10 py-5 text-xs font-mono w-80 focus:outline-none placeholder:text-zinc-700 font-black tracking-widest"
                      />
                      <button 
                        onClick={() => startCall(targetPeerId || 'TARGET_UID', 'Target Steward')}
                        className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all active:scale-90 group"
                      >
                        <Phone className="w-8 h-8 text-black group-hover:rotate-12 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Incoming Call Notification */}
              <AnimatePresence>
                {incomingCall && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-emerald-500 p-8 rounded-[2.5rem] flex items-center justify-between shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                        <Phone className="w-8 h-8 text-emerald-500 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-black font-black text-2xl uppercase tracking-tighter">Incoming Signal</h4>
                        <p className="text-black/60 text-xs font-mono uppercase tracking-widest mt-1">From: {incomingCall.callerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={acceptCall}
                        className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-900 transition-all"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => setIncomingCall(null)}
                        className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {(activeTab === 'streams' || activeTab === 'podcasts') && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-12"
            >
              {/* Featured Content / Active Stream */}
              <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-0 lg:aspect-[21/9] bg-zinc-950/80 rounded-[3rem] border border-white/10 overflow-hidden group shadow-[0_0_100px_rgba(16,185,129,0.15)] backdrop-blur-3xl ring-1 ring-white/5 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)] before:pointer-events-none">
                {isBroadcasting ? (
                  <div className="w-full h-full bg-black flex items-center justify-center relative">
                    <video ref={broadcastVideoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                      <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-red-500/20 blur-[80px] rounded-full animate-pulse" />
                        <Radio className="w-24 h-24 text-red-500 relative z-10" />
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Signal Transmitting</h3>
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em]">Node ID: {auth.currentUser?.uid?.slice(0, 16)}</p>
                      
                      <div className="flex items-center gap-12 mt-12">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Uptime</span>
                          <span className="text-2xl font-black font-mono">00:12:45</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Listeners</span>
                          <span className="text-2xl font-black font-mono">1,284</span>
                        </div>
                      </div>

                      <button 
                        onClick={stopBroadcast}
                        className="mt-12 px-12 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                      >
                        Terminate Signal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#080808] p-20">
                    <div className="max-w-2xl text-center">
                      <h3 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                        Initialize <span className="text-emerald-500">Global</span> Broadcast
                      </h3>
                      <input 
                        type="text" 
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="BROADCAST FREQUENCY TITLE..."
                        className="w-full bg-zinc-950/50 border-b-2 border-zinc-800 focus:border-emerald-500 rounded-none p-6 text-2xl font-black placeholder:text-zinc-800 focus:outline-none transition-all mb-12 text-center"
                      />
                      <p className="text-zinc-500 text-lg mb-12 leading-relaxed">
                        Deploy your signal across the decentralized mesh. Real-time encryption, zero-latency distribution.
                      </p>
                      <button 
                        onClick={() => startBroadcast(activeTab === 'streams' ? 'LIVE' : 'PODCAST', broadcastTitle || `New ${activeTab} Signal`)}
                        className="px-16 py-6 bg-emerald-500 text-black rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95"
                      >
                        Start {activeTab === 'streams' ? 'Live Stream' : 'Podcast'}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Overlay Info */}
                <div className="absolute top-10 left-10 flex items-center gap-4">
                  <div className="px-4 py-2 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Network Status: Optimal</span>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-8 hover:border-emerald-500/20 transition-all group cursor-pointer">
                    <div className="aspect-video bg-zinc-950 rounded-3xl mb-6 overflow-hidden relative">
                      <img 
                        src={`https://picsum.photos/seed/media${i}/800/450`} 
                        alt="Media Thumbnail"
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                          <Play className="w-8 h-8 text-black ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[8px] font-bold font-mono">
                        {i * 12}:45
                      </div>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-black text-xl mb-2 group-hover:text-emerald-400 transition-colors">Signal Archive Alpha-{i}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Steward: Node_0x{i}F2</p>
                      </div>
                      <button className="p-3 bg-zinc-900 rounded-xl text-zinc-700 hover:text-emerald-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ledger' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-emerald-500/30 transition-all backdrop-blur-sm">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center border border-zinc-900 group-hover:bg-emerald-500/5 transition-all">
                      <ShieldCheck className="w-10 h-10 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-black uppercase tracking-tight">Block #8,29{i}</h3>
                        <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Verified</span>
                      </div>
                      <p className="text-xs text-zinc-600 font-mono tracking-wider">SIG: 0x8291...{i}f29a...{i*7}b</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t border-zinc-800 md:border-none pt-6 md:pt-0">
                    <div className="text-right">
                      <p className="text-lg font-black font-mono">12.4 MB</p>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">2 hours ago</p>
                    </div>
                    <button className="p-4 bg-zinc-800/50 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'spatial' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-12"
            >
              {/* Spatial Visualization Area */}
              <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-0 lg:aspect-[21/9] bg-zinc-950/80 rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] backdrop-blur-3xl ring-1 ring-white/5 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)] before:pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
                
                {/* Mock Spatial Grid */}
                <div className="absolute inset-0 opacity-20" style={{ 
                  backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
                  backgroundSize: '40px 40px',
                  transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)'
                }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  {isSpatialActive ? (
                    <div className="relative w-full h-full">
                      {Object.entries(spatialUsers).map(([uid, transform], idx) => (
                        <motion.div 
                          key={uid}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute flex flex-col items-center gap-2"
                          style={{ 
                            left: `${50 + (transform.pos.x * 5)}%`, 
                            top: `${50 + (transform.pos.z * 5)}%` 
                          }}
                        >
                          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] border-4 border-black">
                            <Users className="w-6 h-6 text-black" />
                          </div>
                          <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10">
                            <p className="text-[8px] font-black text-white uppercase tracking-widest">Node_{uid.slice(0, 4)}</p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Telemetry Overlay */}
                      <div className="absolute top-10 right-10 flex flex-col gap-4">
                        <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 w-64 shadow-2xl">
                          <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Spatial Metrics</h5>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-zinc-500 uppercase font-mono">Active Nodes</span>
                              <span className="text-xs font-black">{Object.keys(spatialUsers).length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-zinc-500 uppercase font-mono">Sync Latency</span>
                              <span className="text-xs font-black text-emerald-400">12ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-zinc-500 uppercase font-mono">Mesh Density</span>
                              <span className="text-xs font-black">High</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center max-w-xl px-10">
                      <div className="relative inline-block mb-10">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                        <div className="relative z-10 p-10 bg-zinc-900/50 rounded-full border border-white/5 backdrop-blur-3xl">
                          <Boxes className="w-20 h-20 text-emerald-500/40" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Spatial Mesh Offline</h3>
                      <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
                        Initialize real-time 3D synchronization for VR/AR environments. Connect your headset or spatial node to begin.
                      </p>
                      <button 
                        onClick={toggleSpatialSync}
                        className="px-16 py-6 bg-emerald-500 text-black rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95"
                      >
                        Initialize Mesh
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Spatial Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: <Layers className="w-6 h-6" />, title: 'Layer Sync', desc: 'Multi-layered AR anchor synchronization across all nodes.' },
                  { icon: <Globe className="w-6 h-6" />, title: 'Geo-Anchors', desc: 'World-scale spatial persistence using global coordinates.' },
                  { icon: <Zap className="w-6 h-6" />, title: 'Zero Latency', desc: 'Optimized RTDB pipeline for sub-20ms spatial updates.' }
                ].map((feature, i) => (
                  <div key={i} className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-10 hover:border-emerald-500/20 transition-all group">
                    <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mb-8 text-emerald-500 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h4 className="font-black text-xl mb-4 uppercase tracking-tight">{feature.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'drone' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-12"
            >
              {/* Drone Feed / Telemetry */}
              <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-0 lg:aspect-[21/9] bg-zinc-950/80 rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] backdrop-blur-3xl ring-1 ring-white/5 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)] before:pointer-events-none">
                {isBroadcasting ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <video ref={broadcastVideoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="relative inline-block mb-8">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full animate-pulse" />
                          <Plane className="w-24 h-24 text-emerald-500 relative z-10" />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Encrypted Drone Feed Active</h3>
                        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em]">UAV-NODE: {auth.currentUser?.uid?.slice(0, 8)}</p>
                      </div>
                    </div>
                    
                    {/* HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 w-64">
                          <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Flight Telemetry</h5>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-zinc-500 uppercase font-mono">Altitude</span>
                              <span className="text-xs font-black text-emerald-400">
                                {telemetryBatches[0]?.readings[0]?.gps.alt.toFixed(1) || '124.5'}m
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-zinc-500 uppercase font-mono">Velocity</span>
                              <span className="text-xs font-black text-emerald-400">
                                {telemetryBatches[0]?.readings[0]?.speed.toFixed(1) || '42.8'}km/h
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-zinc-500 uppercase font-mono">Battery</span>
                              <span className="text-xs font-black text-emerald-400">
                                {telemetryBatches[0]?.readings[0]?.battery || '84'}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 items-end">
                          <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">REC</span>
                          </div>
                          <div className="px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Signal: 98%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="w-96 h-1 bg-white/10 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 bg-emerald-500/30 w-1/2 left-1/4" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-emerald-500 -mt-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#080808] p-20">
                    <div className="max-w-2xl text-center">
                      <div className="relative inline-block mb-10">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                        <div className="relative z-10 p-10 bg-zinc-900/50 rounded-full border border-white/5 backdrop-blur-3xl">
                          <Plane className="w-20 h-20 text-emerald-500/40" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">UAV Uplink Offline</h3>
                      <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
                        Establish secure satellite uplink for remote drone operations. Real-time telemetry and 4K encrypted video feed.
                      </p>
                      <button 
                        onClick={() => startBroadcast()}
                        className="px-16 py-6 bg-emerald-500 text-black rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95"
                      >
                        Initialize Uplink
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drone Controls / Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-xl shadow-2xl">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-emerald-500" />
                    Flight Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    {['Auto-Pilot', 'Terrain Follow', 'Obstacle Avoid', 'Signal Relay'].map((param, i) => (
                      <div key={i} className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{param}</span>
                        <div className="w-10 h-5 bg-zinc-900 rounded-full relative p-1 group-hover:bg-emerald-500/20 transition-all">
                          <div className="w-3 h-3 bg-zinc-700 rounded-full group-hover:bg-emerald-500 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-xl shadow-2xl">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Signal Integrity
                  </h4>
                  <div className="h-32 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 85].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="flex-1 bg-emerald-500/20 rounded-t-lg border-t border-emerald-500/40"
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                    <span>0ms</span>
                    <span>Signal Strength: 98.4%</span>
                    <span>500ms</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'ledger' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-12"
            >
              <div className="bg-zinc-900/40 rounded-[3rem] border border-white/5 p-12 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                      <Database className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Verified Ledger</h3>
                      <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest mt-1">Immutable Blockchain Record</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onNavigate('explorer')}
                      className="px-6 py-3 bg-zinc-950/50 rounded-full border border-white/5 flex items-center gap-3 hover:bg-white/5 transition-all group"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Open Explorer</span>
                    </button>
                    <div className="px-6 py-3 bg-zinc-950/50 rounded-full border border-white/5 flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sync Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {blockchain.length > 0 ? blockchain.map((block) => (
                    <div key={block.hash} className="bg-zinc-950/50 rounded-[2.5rem] border border-white/5 p-10 hover:border-emerald-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-all">
                            <Zap className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">Block {block.index}</h4>
                            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase mt-1">Hash: {block.hash.slice(0, 16)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase">{block.transactions.length} TXS</span>
                          <div 
                            onClick={() => onNavigate('explorer', block.hash)}
                            className="p-3 bg-zinc-900 rounded-xl text-zinc-700 group-hover:text-emerald-500 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/50">
                          <span className="text-[8px] text-zinc-600 uppercase tracking-widest block mb-2">Validator</span>
                          <span className="text-xl font-black font-mono truncate block">{block.validator}</span>
                        </div>
                        <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/50">
                          <span className="text-[8px] text-zinc-600 uppercase tracking-widest block mb-2">Status</span>
                          <span className="text-xl font-black font-mono text-emerald-500">{block.status}</span>
                        </div>
                        <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/50">
                          <span className="text-[8px] text-zinc-600 uppercase tracking-widest block mb-2">Timestamp</span>
                          <span className="text-xl font-black font-mono">{new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/50">
                          <span className="text-[8px] text-zinc-600 uppercase tracking-widest block mb-2">Tx Volume</span>
                          <span className="text-xl font-black font-mono">{block.transactions.reduce((acc, tx) => acc + tx.value, 0)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono tracking-widest border-t border-white/5 pt-8">
                        <div className="flex items-center gap-4">
                          <span>{new Date(block.timestamp).toLocaleDateString()}</span>
                          <span className="text-zinc-800">|</span>
                          <span>{block.transactions[0]?.type || 'GENERIC_TX'}</span>
                        </div>
                        <span className="text-emerald-500 uppercase font-black flex items-center gap-2">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          Verified on Chain
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-800">
                      <Database className="w-24 h-24 mb-6 opacity-20" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.5em]">No blocks verified in current session</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          {/* Live Sessions List */}
          <div className="bg-zinc-900/40 rounded-[3rem] border border-white/5 p-10 flex flex-col gap-10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
                <Radio className="w-5 h-5 text-emerald-500" />
                Active Signals
              </h3>
              <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">
                {liveSessions.length} Nodes
              </div>
            </div>
            <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto no-scrollbar">
              {liveSessions.length > 0 ? liveSessions.map((session) => (
                <motion.div 
                  whileHover={{ scale: 1.02, x: 4 }}
                  key={session.id} 
                  onClick={() => setViewingSessionId(session.id)}
                  className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                    viewingSessionId === session.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-950/50 border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Now</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                      <Users className="w-3 h-3" />
                      {session.listenerCount}
                    </div>
                  </div>
                  <h4 className="font-black text-xl group-hover:text-emerald-400 transition-colors leading-tight relative z-10">{session.title}</h4>
                  <div className="flex items-center justify-between mt-4 relative z-10">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">{session.hostName}</p>
                    <div className={`p-2 rounded-xl transition-colors ${
                      viewingSessionId === session.id ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-700 group-hover:text-emerald-500'
                    }`}>
                      <Play className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-800">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-zinc-800/20 blur-3xl rounded-full" />
                    <Activity className="w-20 h-20 relative z-10 opacity-20" />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-700">No active signals detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Chat / Comments */}
          <div className="bg-zinc-900/40 rounded-[3rem] border border-white/5 p-10 flex flex-col gap-10 backdrop-blur-xl shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Signal Feed
            </h3>
            <div className="flex flex-col gap-10 min-h-[400px] max-h-[600px] overflow-y-auto no-scrollbar pr-2">
              {comments.length > 0 ? comments.map((comment) => (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={comment.id} 
                  className="flex flex-col gap-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                      {comment.authorName}
                    </span>
                    <span className="text-[8px] text-zinc-700 font-mono">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">{comment.text}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p className="text-[8px] font-mono uppercase tracking-widest">Feed empty</p>
                </div>
              )}
            </div>
            <div className="relative mt-4">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  const targetId = currentBroadcastId || viewingSessionId;
                  if (e.key === 'Enter' && targetId && commentText) {
                    broadcastService.sendComment(targetId, commentText);
                    setCommentText('');
                  }
                }}
                placeholder="TRANSMIT MESSAGE..."
                className="w-full bg-zinc-950/80 border border-white/5 rounded-2xl px-8 py-6 text-xs focus:outline-none focus:border-emerald-500/50 transition-all pr-20 font-bold placeholder:text-zinc-800 shadow-inner"
              />
              <button 
                onClick={() => {
                  const targetId = currentBroadcastId || viewingSessionId;
                  if (targetId && commentText) {
                    broadcastService.sendComment(targetId, commentText);
                    setCommentText('');
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-90"
              >
                <Send className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default MediaHub;
