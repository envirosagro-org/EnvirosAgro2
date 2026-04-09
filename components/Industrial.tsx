
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  PlusCircle, 
  Share2, 
  Hammer, 
  Target as TargetIcon, 
  Users, 
  ShieldCheck, 
  Clock,
  Maximize2,
  Factory,
  Activity,
  ArrowRightCircle,
  Briefcase,
  LayoutGrid,
  ChevronRight,
  Zap,
  HardHat,
  Search,
  X,
  Loader2,
  Fingerprint,
  Lock,
  CheckCircle2,
  Coins,
  ShieldAlert,
  ArrowRight,
  Stamp,
  Binary,
  Network,
  Cpu,
  SmartphoneNfc,
  Monitor,
  Workflow,
  Globe,
  Gauge,
  History,
  Terminal,
  Layers,
  Box,
  Radar,
  Radio,
  TrendingUp,
  MapPin,
  Plus,
  BadgeCheck,
  User as UserIcon,
  CircleDot,
  ArrowUpRight,
  Star,
  Pickaxe,
  UserPlus,
  Handshake,
  Route,
  Filter,
  Package,
  ClipboardCheck,
  ArrowDownRight,
  ScanLine,
  Building,
  RefreshCw,
  Leaf,
  Download,
  FlaskConical,
  ShoppingCart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { User, RegisteredUnit, ViewState, WorkerProfile, AgroProject, VendorProduct, Order } from '../types';
import { HenIcon } from './Icons';
import { chatWithAgroLang } from '../services/agroLangService';
import { SEO } from './SEO';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  collectives?: any[];
  setCollectives?: React.Dispatch<React.SetStateAction<any[]>>;
  onSaveProject: (project: AgroProject) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  industrialUnits: RegisteredUnit[];
  setIndustrialUnits: React.Dispatch<React.SetStateAction<RegisteredUnit[]>>;
  vendorProducts?: VendorProduct[];
  orders?: Order[];
  notify: any;
  initialSection?: string | null;
}

const MOCK_WORKERS: WorkerProfile[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', esin: 'EA-SRH-8821', skills: ['Soil Science', 'Spectral Analysis'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000, efficiency: 94, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', location: 'California Hub' },
  { id: 'W-02', name: 'Marcus T.', esin: 'EA-MRC-4420', skills: ['Hydroponics', 'IoT Maintenance'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000, efficiency: 82, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', location: 'Nairobi Ingest' },
  { id: 'W-03', name: 'Elena R.', esin: 'EA-ELN-0922', skills: ['Registry Auth', 'ZK-Proofs'], sustainabilityRating: 94, verifiedHours: 1560, isOpenToWork: true, lifetimeEAC: 31000, efficiency: 91, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', location: 'Valencia Shard' },
];

const ANALYTICS_DATA = [
  { time: 'T-6', ingest: 45, output: 40, drift: 0.02 },
  { time: 'T-5', ingest: 52, output: 48, drift: 0.01 },
  { time: 'T-4', ingest: 48, output: 52, drift: 0.03 },
  { time: 'T-3', ingest: 61, output: 58, drift: 0.02 },
  { time: 'T-2', ingest: 55, output: 60, drift: 0.01 },
  { time: 'T-1', ingest: 68, output: 65, drift: 0.01 },
  { time: 'NOW', ingest: 84, output: 72, drift: 0.02 },
];

const Industrial: React.FC<IndustrialProps> = ({ 
  user, onSpendEAC, onSaveProject, industrialUnits, onNavigate, vendorProducts = [], orders = [], notify, initialSection 
}) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'sync' | 'path' | 'tenders' | 'workers' | 'mesh' | 'twin'>('bridge');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [oracleAdvice, setOracleAdvice] = useState<string | null>(null);

  // Sync with initialSection for Vector Routing
  useEffect(() => {
    if (initialSection) {
      if (['bridge', 'sync', 'path', 'tenders', 'workers', 'mesh', 'twin'].includes(initialSection)) {
        setActiveTab(initialSection as any);
      }
    }
  }, [initialSection]);

  const [globalThroughput, setGlobalThroughput] = useState(142.8);
  const [activePeers, setActivePeers] = useState(1242);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalThroughput(prev => Number((prev + (Math.random() * 2 - 1)).toFixed(1)));
      setActivePeers(prev => prev + (Math.random() > 0.8 ? 1 : Math.random() > 0.9 ? -1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const registryNodes = useMemo(() => {
    const nodes: any[] = [];
    
    // Physical Infrastructure
    industrialUnits.forEach(unit => nodes.push({ ...unit, nodeType: 'INFRASTRUCTURE', bridgeIcon: Factory }));
    
    // Vendor Entities (Supply Nodes)
    const suppliers = new Set(vendorProducts.map(p => p.supplierEsin));
    suppliers.forEach(esin => {
        const prod = vendorProducts.find(p => p.supplierEsin === esin);
        if (prod) {
            nodes.push({ 
                id: esin, 
                name: prod.supplierName, 
                type: prod.supplierType, 
                location: 'Remote Node', 
                status: 'ACTIVE', 
                nodeType: 'SUPPLIER',
                bridgeIcon: Building
            });
        }
    });

    return nodes.filter(n => (n.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [industrialUnits, vendorProducts, searchTerm]);

  const handleRunPathAnalysis = async () => {
    setIsAnalyzing(true);
    setOracleAdvice(null);
    try {
      const prompt = `Act as the Supply Chain Oracle. Analyze the current registry state for Node ${user.esin}.
      Physical Units: ${industrialUnits.length}
      Supply Nodes Linked: ${registryNodes.filter(n => n.nodeType === 'SUPPLIER').length}
      Active Orders: ${orders.length}
      
      Identify the critical path for asset sharding. Detect bottlenecks between the Ingest Node and Market Cloud. Suggest process synchronization steps.`;
      
      const res = await chatWithAgroLang(prompt, []);
      setOracleAdvice(res.text);
    } catch (e) {
      setOracleAdvice("Handshake Interrupted. Registry drift detected in Sector 4.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-700 pb-48 max-w-[1700px] mx-auto px-4 relative">
      <SEO title="Industrial" description="EnvirosAgro Industrial Hub: Manage supply chains, monitor machinery, and oversee large-scale agricultural operations." />
      
      {/* 1. Supply Chain Resonance HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Mesh Throughput', val: globalThroughput.toFixed(1), unit: 'GB/s', icon: Network, color: 'text-indigo-400' },
          { label: 'Supply Shards', val: registryNodes.length.toLocaleString(), unit: 'NODES', icon: Box, color: 'text-emerald-400' },
          { label: 'Quorum Integrity', val: '99.98', unit: '%', icon: ShieldCheck, color: 'text-blue-400' },
          { label: 'Chain Latency', val: '14', unit: 'ms', icon: Zap, color: 'text-amber-400' },
        ].map((m) => (
          <div key={m.label} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 flex flex-col justify-between relative overflow-hidden group shadow-2xl min-h-[260px]">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><m.icon size={120} /></div>
             <div className="space-y-4 relative z-10">
                <p className={`text-[10px] ${m.color} font-black uppercase tracking-[0.5em] text-nowrap`}>{m.label}</p>
                <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{m.val}<span className={`text-xl ${m.color} ml-1 italic`}>{m.unit}</span></h4>
             </div>
             <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-slate-700 uppercase">Registry v6.5.2</span>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`}></div>
                   <span className={`text-[9px] font-mono ${m.color} font-bold uppercase`}>Streaming</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Unified Industrial Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-4 md:px-6 overflow-x-auto scrollbar-hide">
           {[
             { id: 'bridge', label: 'Registry Bridge', icon: Route },
             { id: 'mesh', label: 'Mesh Visualization', icon: Network },
             { id: 'twin', label: 'Digital Twin', icon: Box },
             { id: 'sync', label: 'Process Sync', icon: RefreshCw },
             { id: 'path', label: 'Path Analyzer', icon: Workflow },
             { id: 'tenders', label: 'Bounty Manifest', icon: Hammer },
             { id: 'workers', label: 'Steward Cloud', icon: Users },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
               className={`flex items-center gap-3 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-2 border-indigo-400 ring-4 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={16} /> {tab.label}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-[350px]">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Audit Registry Shards..." 
                 className="w-full bg-black/60 border border-white/10 rounded-full py-4 pl-14 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner"
               />
            </div>
            <button 
              onClick={() => onNavigate('multimedia_generator')}
              className="p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95"
              title="Multimedia Forge"
            >
               <Leaf size={24} />
            </button>
            <button 
              onClick={() => onNavigate('registry_handshake')}
              className="p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95"
              title="Initialize Physical Handshake"
            >
               <SmartphoneNfc size={24} />
            </button>
         </div>
      </div>

      {/* 3. Main Operational Viewport */}
      <div className="min-h-[70vh] md:min-h-[80vh] relative z-10 space-y-16 md:space-y-24">
        
        {/* --- VIEW: DIGITAL TWIN --- */}
        {activeTab === 'twin' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 relative overflow-hidden min-h-[700px] flex flex-col">
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[28px] bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
                      <Box size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Industrial <span className="text-indigo-400">Twin.</span></h3>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-1">REAL_TIME_HARDWARE_REPLICA</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">CALIBRATE_SENSORS</button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">INIT_DIAGNOSTIC</button>
                  </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center">
                  {/* Schematic Representation */}
                  <div className="relative w-full max-w-2xl aspect-square">
                    <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[80px] bg-indigo-500/[0.02] shadow-inner"></div>
                    <div className="absolute inset-10 border border-indigo-500/10 rounded-[60px] border-dashed"></div>
                    
                    {/* Core Reactor Mockup */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-black/60 border-4 border-indigo-500/40 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.2)] group cursor-pointer">
                      <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping opacity-20"></div>
                      <Cpu size={80} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                      
                      {/* Sensor Overlays */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 border border-emerald-500/40 px-4 py-2 rounded-xl shadow-2xl">
                        <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">TEMP_CORE</p>
                        <p className="text-xl font-mono font-black text-white">24.2°C</p>
                      </div>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/80 border border-blue-500/40 px-4 py-2 rounded-xl shadow-2xl">
                        <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">FLOW_RATE</p>
                        <p className="text-xl font-mono font-black text-white">1.2 L/s</p>
                      </div>
                    </div>

                    {/* Peripheral Modules */}
                    {[
                      { label: 'NUTRIENT_PUMP', pos: 'top-10 left-10', icon: Zap, val: '98%' },
                      { label: 'LIGHT_ARRAY', pos: 'top-10 right-10', icon: Monitor, val: '84%' },
                      { label: 'HUMIDITY_CTRL', pos: 'bottom-10 left-10', icon: Activity, val: '62%' },
                      { label: 'MESH_RELAY', pos: 'bottom-10 right-10', icon: Radio, val: 'SYNC' }
                    ].map((mod, i) => (
                      <div key={i} className={`absolute ${mod.pos} w-24 h-24 bg-black/40 border border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-2 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-xl`}>
                        <mod.icon size={24} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <p className="text-[8px] font-black text-white">{mod.val}</p>
                        <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[6px] font-mono text-slate-600 whitespace-nowrap">{mod.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware Online</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mesh Linked</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">ESIN: {user.esin}_TWIN_v1.0</p>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-3xl">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Diagnostic Logs</h4>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar-terminal">
                    {[
                      { time: '12:04:22', msg: 'Core temperature stabilized at 24.2°C', type: 'INFO' },
                      { time: '12:04:15', msg: 'Nutrient pump α pressure nominal', type: 'INFO' },
                      { time: '12:03:58', msg: 'Mesh relay handshake successful', type: 'SUCCESS' },
                      { time: '12:03:42', msg: 'Minor drift detected in Sector 4 sensors', type: 'WARN' },
                      { time: '12:03:10', msg: 'Initializing digital twin sync sequence', type: 'SYSTEM' }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 items-start font-mono">
                        <span className="text-[10px] text-slate-700 shrink-0">{log.time}</span>
                        <p className={`text-[10px] ${log.type === 'WARN' ? 'text-amber-500' : log.type === 'SUCCESS' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          <span className="font-black">[{log.type}]</span> {log.msg}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-500/[0.03] space-y-6 shadow-3xl">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Maintenance Forecast</h4>
                  <div className="space-y-4">
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-white uppercase italic">Filter Replacement</p>
                        <span className="text-[10px] font-mono text-amber-500">12 DAYS</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-white uppercase italic">Sensor Recalibration</p>
                        <span className="text-[10px] font-mono text-emerald-500">42 DAYS</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">SCHEDULE_ALL_TASKS</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: MESH VISUALIZATION --- */}
        {activeTab === 'mesh' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 relative overflow-hidden min-h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
                  <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                </div>
                
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {/* Simulated Mesh Nodes */}
                  <div className="relative w-96 h-96">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-600/20 rounded-full border-2 border-indigo-500 flex items-center justify-center animate-pulse shadow-[0_0_100px_rgba(79,70,229,0.3)]">
                      <Cpu size={48} className="text-white" />
                      <div className="absolute -bottom-8 text-[10px] font-black text-indigo-400 uppercase tracking-widest">MASTER_NODE_01</div>
                    </div>
                    
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div 
                        key={i} 
                        className="absolute w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer group"
                        style={{
                          top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 180}px)`,
                          left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 180}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <Network size={24} className="text-emerald-400 group-hover:rotate-45 transition-transform" />
                        <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-slate-500 whitespace-nowrap">NODE_SYNC_{i+1}</div>
                        
                        {/* Connection Lines */}
                        <div 
                          className="absolute bg-gradient-to-r from-indigo-500/40 to-emerald-500/40 h-0.5 origin-left"
                          style={{
                            width: '120px',
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${angle + 180}deg) translateX(32px)`
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Mesh Active</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium italic max-w-xs">Real-time visualization of industrial node synchronization and asset sharding pathways.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><Maximize2 size={20} /></button>
                    <button className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><RefreshCw size={20} /></button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-3xl">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                    <Activity size={24} className="text-indigo-400" />
                    Mesh <span className="text-indigo-400">Health.</span>
                  </h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Synchronization', val: 98.4, color: 'bg-emerald-500' },
                      { label: 'Packet Integrity', val: 99.9, color: 'bg-blue-500' },
                      { label: 'Node Uptime', val: 100, color: 'bg-indigo-500' },
                      { label: 'Encryption Strength', val: 92.1, color: 'bg-amber-500' }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">{stat.label}</span>
                          <span className="text-white">{stat.val}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/[0.03] space-y-6 shadow-3xl">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Active Shards</h4>
                  <div className="space-y-4">
                    {[
                      { id: 'SH-992', type: 'DATA_SYNC', status: 'COMPLETED' },
                      { id: 'SH-993', type: 'ASSET_TRANSFER', status: 'IN_PROGRESS' },
                      { id: 'SH-994', type: 'QUORUM_VOTE', status: 'PENDING' }
                    ].map((shard, i) => (
                      <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-mono text-emerald-400">{shard.id}</p>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{shard.type}</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${shard.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : shard.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-500'}`}>
                          {shard.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* --- VIEW: REGISTRY BRIDGE (Unified Nodes) --- */}
        {/* --- VIEW: DIGITAL TWIN --- */}
        {activeTab === 'twin' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card p-12 rounded-[64px] border border-indigo-500/20 bg-indigo-500/[0.02] space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                <Box size={400} className="text-indigo-500" />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[28px] bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-2xl">
                      <Box size={32} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Industrial <span className="text-indigo-400">Digital Twin.</span></h3>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-1">REAL_TIME_SIMULATION_SHARD</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Interactive replica of the Sector 7 Core Reactor. Monitor thermal resonance, pressure drift, and energy sharding in real-time.
                  </p>
                  <div className="flex gap-4">
                    <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">STATUS: OPTIMAL</div>
                    <div className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest">SYNC: 99.9%</div>
                  </div>
                </div>

                <div className="flex-1 w-full glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 min-h-[400px] flex items-center justify-center relative">
                  {/* Mock Twin Visualization */}
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-[40px] animate-pulse"></div>
                    <div className="absolute inset-4 border-2 border-indigo-500/40 rounded-[32px] rotate-45 animate-spin duration-[10s]"></div>
                    <div className="absolute inset-10 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-indigo-500 rounded-xl shadow-[0_0_40px_rgba(99,102,241,0.8)]"></div>
                    </div>
                  </div>
                  
                  {/* Floating Data Points */}
                  <div className="absolute top-10 left-10 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Thermal Resonance</p>
                    <p className="text-lg font-mono font-black text-white">1,422°C</p>
                  </div>
                  <div className="absolute bottom-10 right-10 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Pressure Drift</p>
                    <p className="text-lg font-mono font-black text-white">0.024 psi</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Energy Output', val: '4.2 GW', trend: '+2.1%', col: 'text-emerald-400' },
                  { label: 'Coolant Flow', val: '840 L/s', trend: 'STABLE', col: 'text-blue-400' },
                  { label: 'Sharding Velocity', val: '142/m', trend: '+14%', col: 'text-indigo-400' },
                  { label: 'Maintenance', val: '12d', trend: 'SCHEDULED', col: 'text-amber-400' }
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-2">
                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-xl font-black text-white">{stat.val}</p>
                      <p className={`text-[8px] font-black uppercase ${stat.col}`}>{stat.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bridge' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                 {registryNodes.map((node) => (
                    <div key={node.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden min-h-[400px]">
                       <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><node.bridgeIcon size={300} /></div>
                       
                       <div className="flex justify-between items-start relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner group-hover:rotate-6 transition-all ${node.nodeType === 'SUPPLIER' ? 'text-amber-500' : 'text-blue-400'}`}>
                             <node.bridgeIcon size={32} />
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                             <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest shadow-lg ${
                                node.status === 'ACTIVE' || node.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                             }`}>{node.status}</span>
                             <p className="text-[9px] text-slate-700 font-mono font-black uppercase">{node.nodeType}</p>
                          </div>
                       </div>

                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{node.name.toUpperCase()}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">{node.type} // {node.location}</p>
                          
                          <div className="pt-8 grid grid-cols-2 gap-4">
                             <div className="p-5 bg-black/80 rounded-[32px] border border-white/5 space-y-1 shadow-inner group/val hover:border-emerald-500/20 transition-all">
                                <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Resonance</p>
                                <p className="text-2xl font-mono font-black text-emerald-400">98.2%</p>
                             </div>
                             <div className="p-5 bg-black/80 rounded-[32px] border border-white/5 space-y-1 shadow-inner group/val hover:border-indigo-500/20 transition-all text-right">
                                <p className="text-[8px] text-slate-700 font-black uppercase">Load</p>
                                <p className="text-2xl font-mono font-black text-indigo-400">1.42<span className="text-xs">m</span></p>
                             </div>
                          </div>
                       </div>

                       <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                          {node.nodeType === 'SUPPLIER' ? (
                            <button 
                               onClick={() => onNavigate('crm')}
                               className="flex-1 py-5 bg-amber-600 hover:bg-amber-500 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-white shadow-xl active:scale-95 transition-all border border-white/10"
                            >
                               Consult Node
                            </button>
                          ) : (
                            <button 
                               onClick={() => onNavigate('digital_mrv')}
                               className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-white shadow-xl active:scale-95 transition-all border border-white/10"
                            >
                               Audit Shard
                            </button>
                          )}
                          <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all"><Maximize2 size={20}/></button>
                       </div>
                    </div>
                 ))}
                 
                 {registryNodes.length === 0 && (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/10 rounded-[64px]">
                       <Database size={80} className="text-slate-600" />
                       <p className="text-2xl font-black uppercase tracking-[0.4em]">No matching nodes in registry.</p>
                       <button onClick={() => onNavigate('registry_handshake')} className="px-12 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95">INITIALIZE HANDSHAKE</button>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- VIEW: PATH ANALYZER --- */}
        {activeTab === 'path' && (
           <div className="space-y-12 animate-in zoom-in duration-700 max-w-6xl mx-auto">
              <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 flex flex-col items-center text-center space-y-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 animate-float">
                       <Workflow size={40} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Critical <span className="text-indigo-400">Path Analyzer</span></h3>
                       <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto">"Utilizing the network matrix to identify dependencies and bottleneck shards across the industrial registry."</p>
                    </div>

                    {!oracleAdvice && !isAnalyzing ? (
                       <button 
                         onClick={handleRunPathAnalysis}
                         className="px-20 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-indigo-500/5"
                       >
                          <Zap size={24} className="fill-current mr-4" /> INITIALIZE ANALYZER
                       </button>
                    ) : isAnalyzing ? (
                       <div className="flex flex-col items-center gap-8 py-10">
                          <Loader2 size={80} className="text-indigo-500 animate-spin" />
                          <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING MESH TOPOLOGY...</p>
                       </div>
                    ) : (
                       <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 w-full max-w-4xl mx-auto">
                          <div className="p-10 bg-black/90 rounded-[64px] border-l-[16px] border-l-indigo-600 border border-indigo-500/20 shadow-3xl text-left relative overflow-hidden group/advice">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Leaf size={400} /></div>
                             <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8 relative z-10">
                                <HenIcon size={32} className="text-indigo-400 animate-pulse" />
                                <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">Strategic Verdict</h4>
                             </div>
                             <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-8 border-l-2 border-white/5">
                                {oracleAdvice}
                             </div>
                             <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Shard Authority: Core_Oracle_v6</span>
                                <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><Download size={20}/></button>
                             </div>
                          </div>
                          <button onClick={() => setOracleAdvice(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl">Discard Analysis</button>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: PROCESS SYNC --- */}
        {activeTab === 'sync' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 
                 {/* Inbound Shards (Orders requiring processing) */}
                 <div className="space-y-8">
                    <div className="flex items-center justify-between px-6 border-b border-white/5 pb-6">
                       <div className="flex items-center gap-4">
                          <ShoppingCart size={24} className="text-blue-400" />
                          <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Inbound <span className="text-blue-400">Commitments</span></h4>
                       </div>
                       <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full border border-blue-500/20">{orders.length} ACTIVE</span>
                    </div>
                    <div className="space-y-4 pr-4">
                       {orders.length === 0 ? (
                         <div className="py-32 text-center opacity-10 border-2 border-dashed border-white/5 rounded-[48px] bg-black/20 flex flex-col items-center gap-4">
                            <Package size={48} />
                            <p className="text-lg font-black uppercase tracking-widest">No active shipments.</p>
                         </div>
                       ) : orders.map(order => (
                          <div key={order.id} className="p-8 glass-card rounded-[48px] border-2 border-white/5 hover:border-blue-500/30 transition-all group/card bg-black/40 shadow-xl flex items-center justify-between gap-10 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/card:scale-110 transition-transform duration-700"><Activity size={150} /></div>
                             <div className="flex items-center gap-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover/card:border-blue-500 transition-all shadow-2xl bg-slate-900">
                                   <img src={order.itemImage || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                   <h5 className="text-xl font-black text-white uppercase italic m-0 tracking-tight">{order.itemName}</h5>
                                   <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase font-black italic">{order.id} // {order.status}</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => onNavigate('tqm')}
                                className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-blue-400 transition-all shadow-xl active:scale-90 relative z-10"
                             >
                                <ArrowUpRight size={28} />
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Outbound Sync (Market Cloud Triggers) */}
                 <div className="space-y-8">
                    <div className="flex items-center justify-between px-6 border-b border-white/5 pb-6">
                       <div className="flex items-center gap-4">
                          <Globe size={24} className="text-emerald-400" />
                          <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Market <span className="text-emerald-400">Exit Gates</span></h4>
                       </div>
                       <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">READY_FOR_FINALITY</span>
                    </div>
                    
                    <div className="p-12 glass-card rounded-[64px] border-emerald-500/10 bg-emerald-950/5 space-y-12 shadow-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
                       <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse border-4 border-white/10">
                          <ArrowRight size={40} className="text-white" />
                       </div>
                       <div className="space-y-4">
                          <p className="text-slate-400 italic text-lg leading-relaxed max-w-sm font-medium">"Sync live processing products to the market cloud to initialize commercial finality."</p>
                          <button 
                            onClick={() => onNavigate('live_farming')}
                            className="px-12 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                          >
                             Manage Live Inflow
                          </button>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        )}

        {/* VIEW: BOUNTY MANIFEST */}
        {activeTab === 'tenders' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {[
                   { id: 'TND-882', title: 'Nairobi Hub Expansion', budget: 125000, deadline: '12d', thrust: 'Industry', difficulty: 'Critical', bidders: 4, desc: 'Provisioning L3 logistics shards for the eastern regional cluster.' },
                   { id: 'TND-104', title: 'Solar Ingest Array v4', budget: 45000, deadline: '5d', thrust: 'Technological', difficulty: 'Medium', bidders: 12, desc: 'Calibration of autonomous energy nodes for Zone 2 moisture sensors.' },
                   { id: 'TND-042', title: 'Carbon Vault Audit', budget: 15000, deadline: '2d', thrust: 'Environmental', difficulty: 'Standard', bidders: 8, desc: 'Third-party physical verification of bio-char sequestration proofs.' },
                 ].map(tender => (
                    <div key={tender.id} className="p-12 glass-card rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-amber-500/40 transition-all group flex flex-col justify-between min-h-[500px] shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Hammer size={300} /></div>
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-6 rounded-3xl bg-amber-600/10 border border-amber-500/20 text-amber-500 shadow-2xl group-hover:rotate-6 transition-all">
                                <TargetIcon size={40} />
                             </div>
                             <span className={`px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded-full border border-amber-500/20 tracking-widest`}>{tender.difficulty}</span>
                          </div>
                          <div>
                             <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-amber-400 transition-colors drop-shadow-2xl">{tender.title}</h4>
                             <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mt-6">Thrust alignment: {tender.thrust}</p>
                          </div>
                          <p className="text-slate-400 text-lg leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">"{tender.desc}"</p>
                       </div>
                       <div className="mt-12 pt-10 border-t border-white/5 space-y-10 relative z-10">
                          <div className="text-center p-10 bg-black/60 rounded-[48px] border border-white/10 shadow-inner">
                             <p className="text-[10px] text-slate-600 font-black uppercase mb-3">Expected Bounty Shard</p>
                             <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_#10b981]">
                                {tender.budget.toLocaleString()} <span className="text-2xl italic font-sans text-emerald-800">EAC</span>
                             </p>
                          </div>
                          <button className="w-full py-8 bg-amber-600 hover:bg-amber-500 rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5">COMMIT BID SHARD</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: STEWARD CLOUD --- */}
        {activeTab === 'workers' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {MOCK_WORKERS.map(worker => (
                    <div key={worker.id} className="glass-card p-12 rounded-[80px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden min-h-[500px]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Fingerprint size={300} /></div>
                       
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className="w-24 h-24 rounded-[40px] border-4 border-white/10 bg-slate-800 overflow-hidden shadow-3xl group-hover:scale-105 transition-transform duration-700">
                             <img src={worker.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          </div>
                          <div className="text-right">
                             <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">VERIFIED_STEWARD</span>
                             <p className="text-[10px] text-slate-700 font-mono font-bold tracking-widest mt-2 uppercase text-nowrap">{worker.esin}</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{worker.name}</h4>
                          <div className="flex flex-wrap gap-2 pt-2">
                             {worker.skills.map(s => (
                                <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest">{s}</span>
                             ))}
                          </div>
                          <p className="text-slate-400 text-lg italic opacity-80 group-hover:opacity-100">"Certified EOS Steward with {worker.verifiedHours} verified industrial hours."</p>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 space-y-8 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-black/60 border border-white/5 rounded-[40px] shadow-inner text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Resonance</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">{worker.sustainabilityRating}%</p>
                             </div>
                             <div className="p-6 bg-black/60 border border-white/5 rounded-[40px] shadow-inner text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Efficiency</p>
                                <p className="text-3xl font-mono font-black text-indigo-400">{worker.efficiency}%</p>
                             </div>
                          </div>
                          <button className="w-full py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10">
                             <UserPlus size={18} /> INITIATE ENGAGEMENT
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>

      {/* 4. Industrial Resonance Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-indigo-500/20 bg-indigo-950/5 flex flex-col xl:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-12 z-10 backdrop-blur-3xl shrink-0">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
            <Layers className="w-[1000px] h-[1000px] text-indigo-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Stamp size={80} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TOTAL <span className="text-indigo-400">TRUTH</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl opacity-80">
                 "Eliminating the burden of unverified industrial data. Every supply node, logistic relay, and workforce shard is anchored in immutable finality."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-20 hidden xl:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">REGISTRY_RESONANCE</p>
            <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-indigo-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
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

export default Industrial;
