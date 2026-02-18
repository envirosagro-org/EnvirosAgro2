
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Sparkles, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, Factory, Monitor, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, CloudCheck, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2, Signal as SignalIcon, Target,
  Truck, Layers, Map as MapIcon, Compass as CompassIcon, Server, Workflow, ShieldPlus, ChevronLeftCircle, ArrowLeft,
  ChevronRight, ArrowUp, UserCheck, BookOpen, Stamp, Binoculars, Command, Bot, Wand2, Brain, ArrowRight, Home,
  Building, ShieldX, ScanLine, MapPin, Download, FileDigit, Music, GraduationCap, ArrowUpRight, ShoppingBag, Sparkle, Mail, BellRing, Settings, CheckCircle2, Video, Clock, SearchCode, LayoutGrid, Calculator
} from 'lucide-react';
import { ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, NotificationType, MediaShard, SignalShard, VectorAddress } from './types';
import Dashboard from './components/Dashboard';
import Sustainability from './components/Sustainability';
import Economy from './components/Economy';
import Industrial from './components/Industrial';
import Intelligence from './components/Intelligence';
import Community from './components/Community';
import Explorer from './components/Explorer';
import Ecosystem from './components/Ecosystem';
import MediaHub from './components/MediaHub';
import InfoPortal from './components/InfoPortal';
import Login from './components/Login';
import AgroWallet from './components/AgroWallet';
import UserProfile from './components/UserProfile';
import InvestorPortal from './components/InvestorPortal';
import VendorPortal from './components/VendorPortal';
import NetworkIngest from './components/NetworkIngest';
import ToolsSection from './components/ToolsSection';
import LiveVoiceBridge from './components/LiveVoiceBridge';
import EvidenceModal from './components/EvidenceModal';
import CircularGrid from './components/CircularGrid';
import TQMGrid from './components/TQMGrid';
import LiveFarming from './components/LiveFarming';
import ContractFarming from './components/ContractFarming';
import Agrowild from './components/Agrowild';
import FloatingConsultant from './components/FloatingConsultant';
import Impact from './components/Impact';
import NaturalResources from './components/NaturalResources';
import IntranetPortal from './components/IntranetPortal';
import EnvirosAgroStore from './components/EnvirosAgroStore';
import CEA from './components/CEA';
import Biotechnology from './components/Biotechnology';
import Permaculture from './components/Permaculture';
import EmergencyPortal from './components/EmergencyPortal';
import AgroRegency from './components/AgroRegency';
import CodeOfLaws from './components/CodeOfLaws';
import AgroCalendar from './components/AgroCalendar';
import ChromaSystem from './components/ChromaSystem';
import AgroValueEnhancement from './components/AgroValueEnhancement';
import DigitalMRV from './components/DigitalMRV';
import RegistryHandshake from './components/RegistryHandshake';
import OnlineGarden from './components/OnlineGarden';
import FarmOS from './components/FarmOS';
import NetworkView from './components/NetworkView';
import MediaLedger from './components/MediaLedger';
import AgroLang from './components/AgroLang';
import SignalCenter from './components/SignalCenter';
import Sitemap from './components/Sitemap';
import AIAnalyst from './components/AIAnalyst';
import VerificationHUD from './components/VerificationHUD';
import SettingsPortal from './components/SettingsPortal';
import TemporalVideo from './components/TemporalVideo';
import Robot from './components/Robot';
import CostAccounting from './components/CostAccounting';

import { 
  syncUserToCloud, auth, getStewardProfile, signOutSteward, onAuthStateChanged,
  listenToCollection, saveCollectionItem, dispatchNetworkSignal, markPermanentAction,
  listenToPulse, updateSignalReadStatus, markAllSignalsAsReadInDb
} from './services/firebaseService';
import { chatWithAgroExpert } from './services/geminiService';
import { executeAgroLangShard } from './systemFunctions';

export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M100 180C100 180 95 160 100 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 145C100 145 70 140 50 120C30 100 20 80 25 55C30 30 55 20 75 35C85 45 100 30 100 30C100 30 115 45 125 35C145 20 170 30 175 55C180 80 170 100 150 120C130 140 100 145 100 145Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

// Added missing RegistryGroup interface export to fix Sitemap component error
export interface RegistryGroup {
  category: string;
  items: {
    id: string;
    name: string;
    icon: any;
    sections?: { id: string; label: string }[];
  }[];
}

const REGISTRY_NODES: RegistryGroup[] = [
  { category: 'Command & Strategy', items: [{ id: 'dashboard', name: 'Command Center', icon: LayoutDashboard }, { id: 'ai_analyst', name: 'Neural Analyst', icon: Brain }] },
  { category: 'Value & Production', items: [{ id: 'wallet', name: 'Treasury Node', icon: Wallet }, { id: 'economy', name: 'Market Center', icon: Globe }] },
];

const GlobalSearch: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (v: ViewState, section?: string) => void }> = ({ isOpen, onClose, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleQuery = async () => {
    setIsAiSearching(true);
    try {
      const res = await chatWithAgroExpert(`Analyze query "${searchTerm}" and map to exactly one ViewState and description.`, []);
      const view = res.text.includes('dashboard') ? 'dashboard' : res.text.includes('wallet') ? 'wallet' : 'economy';
      setSuggestion({ view, text: res.text });
    } finally { setIsAiSearching(false); }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl glass-card rounded-3xl border border-white/10 p-10 space-y-8 animate-in zoom-in duration-300">
        <div className="flex items-center gap-6"><Search className="text-emerald-400 w-8 h-8" /><input autoFocus value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleQuery()} placeholder="Query Registry Matrix..." className="flex-1 bg-transparent text-3xl font-black uppercase italic text-white outline-none" /></div>
        {suggestion && <button onClick={() => { onNavigate(suggestion.view); onClose(); }} className="p-8 bg-indigo-600/10 border-l-8 border-indigo-500 text-left w-full"><p className="text-slate-300 italic">"{suggestion.text}"</p></button>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [viewSection, setViewSection] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isVoiceBridgeOpen, setIsVoiceBridgeOpen] = useState(false);
  const [signals, setSignals] = useState<SignalShard[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getStewardProfile(fbUser.uid);
        if (profile) setUser(profile);
      }
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsGlobalSearchOpen(true); }
      if (e.key === 'v' && e.altKey) setIsVoiceBridgeOpen(true);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleAgroLangExecution = (code: string) => {
    if (!user) return;
    const updates = executeAgroLangShard(code, user);
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    syncUserToCloud(updatedUser);
  };

  const handleVoiceMint = (amount: number, material: string) => {
    if (!user) return;
    const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance + (amount * 10) } };
    setUser(updatedUser);
    syncUserToCloud(updatedUser);
    dispatchNetworkSignal({ type: 'ledger_anchor', title: 'VOICE_MINT_FINALIZED', message: `Minted EAC from ${amount} tons of ${material}.`, priority: 'high' });
  };

  const navigate = useCallback((v: ViewState, section?: string) => { setView(v); setViewSection(section || null); }, []);

  return (
    <div className="min-h-screen bg-[#050706] text-slate-200 selection:bg-emerald-500/30 overflow-hidden font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-[100]">
        <div className="flex items-center gap-4"><SycamoreLogo size={32} className="text-emerald-500" /><h1 className="text-xl font-black uppercase italic">EnvirosAgro</h1></div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsVoiceBridgeOpen(true)} className="p-3 bg-white/5 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"><Mic size={20}/></button>
          <button onClick={() => setIsGlobalSearchOpen(true)} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">Ctrl+K for Matrix Search</button>
        </div>
      </header>
      
      <main className="pt-24 pb-12 px-8 h-screen overflow-y-auto custom-scrollbar">
        {user ? (
          view === 'dashboard' ? <Dashboard onNavigate={navigate} user={user} isGuest={false} /> :
          view === 'wallet' ? <AgroWallet user={user} isGuest={false} onNavigate={navigate} onUpdateUser={setUser} onSwap={async() => true} onEarnEAC={() => {}} notify={() => {}} /> :
          view === 'agro_value_enhancement' ? <AgroValueEnhancement user={user} onSpendEAC={async() => true} onEarnEAC={() => {}} onNavigate={navigate} /> :
          view === 'online_garden' ? <OnlineGarden user={user} onEarnEAC={() => {}} onSpendEAC={async() => true} onNavigate={navigate} onExecuteToShell={handleAgroLangExecution} notify={() => {}} /> :
          <div className="p-20 text-center opacity-40 italic text-xl uppercase font-black">View Shard Standby.</div>
        ) : <Login onLogin={setUser} />}
      </main>

      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} onNavigate={navigate} />
      <LiveVoiceBridge isOpen={isVoiceBridgeOpen} isGuest={!user} onClose={() => setIsVoiceBridgeOpen(false)} onMintTrigger={handleVoiceMint} />
    </div>
  );
};

export default App;
