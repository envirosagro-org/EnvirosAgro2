
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  Menu, X, Radio, Search, BellRing, Coins, UserPlus, ChevronLeft, ArrowUp, 
  LayoutGrid, NetworkIcon, Globe, Microscope, MapIcon, ChevronRight, CheckCircle2, Info, LogOut
} from 'lucide-react';
import { ViewState } from './types';
import { useAppCore } from './hooks/useAppCore';

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
import Auth from './components/Auth';
import AgroWallet from './components/AgroWallet';
import UserProfile from './components/UserProfile';
import InvestorPortal from './components/InvestorPortal';
import VendorPortal from './components/VendorPortal';
import NetworkIngest from './components/NetworkIngest';
import ToolsSection from './components/ToolsSection';
import LiveVoiceBridge from './components/LiveVoiceBridge';
import Channelling from './components/Channelling';
import EvidenceModal from './components/EvidenceModal';
import CircularGrid from './components/CircularGrid';
import NexusCRM from './components/NexusCRM';
import TQMGrid from './components/TQMGrid';
import ResearchInnovation from './components/ResearchInnovation';
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
import OnlineGarden from './components/OnlineGarden';
import FarmOS from './components/FarmOS';
import MediaLedger from './components/MediaLedger';
import Sitemap from './components/Sitemap';
import AIAnalyst from './components/AIAnalyst';
import VerificationHUD from './components/VerificationHUD';
import SettingsPortal from './components/SettingsPortal';
import TemporalVideo from './components/TemporalVideo';
import Robot from './components/Robot';
import MeshProtocol from './components/MeshProtocol';
import RegistryHandshake from './components/RegistryHandshake';
import NodeManager from './components/NodeManager';
import ImplementationProgress from './components/ImplementationProgress';
import { InitializationScreen } from './components/InitializationScreen';
import { GlobalSearch } from './components/GlobalSearch';
import { SycamoreLogo } from './components/SycamoreLogo';
import { REGISTRY_NODES } from './constants';
import { saveCollectionItem, auth } from './services/firebaseService';

const App: React.FC = () => {
  const {
    isBooting, setIsBooting, isAppStarted, setIsAppStarted, view, setView, viewSection, user, setUser, isUnverified, setIsUnverified,
    isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen, isGlobalSearchOpen, setIsGlobalSearchOpen,
    isConsultantOpen, setIsConsultantOpen, isInboxOpen, setIsInboxOpen, history, forwardHistory, projects, contracts,
    orders, vendorProducts, industrialUnits, liveProducts, blockchain, transactions, notifications, setNotifications,
    mediaShards, signals, setSignals, tasks, blueprints, pulseMessage, isEvidenceOpen, setIsEvidenceOpen,
    activeTaskForEvidence, setActiveTaskForEvidence, osInitialCode, setOsInitialCode, costAudit, mainContentRef,
    scrollProgress, showZenithButton, implementationStage, handleScroll, scrollToTop, emitSignal, handleSpendEAC, handleEarnEAC,
    handlePerformPermanentAction, handleLogout, markSignalAsRead, markAllSignalsAsRead, navigate, goBack, goForward, GUEST_STWD
  } = useAppCore();

  const renderView = () => {
    const currentUser = user || GUEST_STWD;
    
    // For non-logged-in users who haven't entered the blockchain, show the landing dashboard
    if (!user && !isAppStarted) {
        return <Dashboard onNavigate={(v) => {
            if (v === 'auth') {
                setIsAppStarted(true);
                setView('auth');
            } else {
                setView(v);
            }
        }} user={GUEST_STWD} isGuest={true} blockchain={blockchain} orders={orders} />;
    }

    if (isUnverified) return <VerificationHUD userEmail={auth.currentUser?.email || 'Unauthorized Node'} onVerified={() => { setIsUnverified(false); setView('dashboard'); }} onLogout={handleLogout} />;
    
    switch (view) {
      case 'auth': return <Auth onLogin={(u) => { setUser(u); setIsAppStarted(true); setView('dashboard'); }} />;
      case 'dashboard': return <Dashboard onNavigate={navigate} user={currentUser} isGuest={!user} blockchain={blockchain} isMining={false} orders={orders} />;
      case 'mesh_protocol': return <MeshProtocol user={currentUser} blockchain={blockchain} />;
      case 'sustainability': return <Sustainability user={currentUser} onNavigate={navigate} onMintEAT={handleEarnEAC} />;
      case 'economy': return <Economy user={currentUser} isGuest={!user} onSpendEAC={handleSpendEAC} onNavigate={navigate} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} projects={projects} notify={emitSignal} contracts={contracts} industrialUnits={industrialUnits} onUpdateUser={(u) => setUser(u)} initialSection={viewSection} />;
      case 'wallet': return <AgroWallet user={currentUser} isGuest={!user} onNavigate={navigate} onUpdateUser={(u) => setUser(u)} onSwap={async () => { handleEarnEAC(0, 'SWAP_EAT'); return true; }} onEarnEAC={handleEarnEAC} notify={emitSignal} transactions={transactions} initialSection={viewSection} costAudit={costAudit} />;
      case 'intelligence': return <Intelligence user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onOpenEvidence={() => setIsEvidenceOpen(true)} initialSection={viewSection} />;
      case 'community': return <Community user={currentUser} isGuest={!user} onContribution={() => {}} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'explorer': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} signals={signals} setSignals={setSignals} initialSection={viewSection} onNavigate={navigate} />;
      case 'network_signals': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} signals={signals} setSignals={setSignals} initialSection="terminal" onNavigate={navigate} />;
      case 'ecosystem': return <Ecosystem user={currentUser} onDeposit={handleEarnEAC} onUpdateUser={(u) => setUser(u)} onNavigate={navigate} />;
      case 'industrial': return <Industrial user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} industrialUnits={industrialUnits} vendorProducts={vendorProducts} orders={orders} notify={emitSignal} collectives={[]} setCollectives={() => {}} onSaveProject={(p) => saveCollectionItem('projects', p)} setIndustrialUnits={() => {}} initialSection={viewSection} />;
      case 'investor': return <InvestorPortal user={currentUser} onUpdate={(u) => setUser(u)} onSpendEAC={handleSpendEAC} projects={projects} onNavigate={navigate} />;
      case 'profile': return <UserProfile user={currentUser} />;
      case 'channelling': return <Channelling user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'media': return <MediaHub user={currentUser} userBalance={currentUser.wallet.balance} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'crm': return <NexusCRM user={currentUser} onSpendEAC={handleSpendEAC} vendorProducts={vendorProducts} onNavigate={navigate} orders={orders} initialSection={viewSection} />;
      case 'circular': return <CircularGrid user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} onNavigate={navigate} initialSection={viewSection} />;
      case 'tqm': return <TQMGrid user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} liveProducts={liveProducts} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'tools': return <ToolsSection user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onOpenEvidence={(t) => { setActiveTaskForEvidence(t); setIsEvidenceOpen(true); }} tasks={tasks} onSaveTask={(t) => saveCollectionItem('tasks', t)} notify={emitSignal} initialSection={viewSection} />;
      case 'research': return <ResearchInnovation user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onEmitSignal={emitSignal} />;
      case 'live_farming': return <LiveFarming user={currentUser} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={handleEarnEAC} onSaveProduct={(p) => saveCollectionItem('live_products', p)} onNavigate={navigate} notify={emitSignal} initialSection={viewSection} onSaveTask={(t) => saveCollectionItem('tasks', t)} blueprints={blueprints} industrialUnits={industrialUnits} />;
      case 'contract_farming': return <ContractFarming user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} contracts={contracts} setContracts={setContracts} onSaveContract={(c) => saveCollectionItem('contracts', c)} blueprints={blueprints} onSaveTask={(t) => saveCollectionItem('tasks', t)} industrialUnits={industrialUnits} initialMission={viewSection} />;
      case 'agrowild': return <Agrowild user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onPlaceOrder={(o) => saveCollectionItem('orders', o)} vendorProducts={vendorProducts} notify={emitSignal} />;
      case 'impact': return <Impact user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'animal_world': return <NaturalResources user={currentUser} type="animal_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'plants_world': return <NaturalResources user={currentUser} type="plants_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'aqua_portal': return <NaturalResources user={currentUser} type="aqua_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'soil_portal': return <NaturalResources user={currentUser} type="soil_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'air_portal': return <NaturalResources user={currentUser} type="air_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'intranet': return <IntranetPortal user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'cea_portal': return <CEA user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'biotech_hub': return <Biotechnology user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'permaculture_hub': return <Permaculture user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onEmitSignal={emitSignal} notify={emitSignal} initialSection={viewSection} />;
      case 'emergency_portal': return <EmergencyPortal user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} />;
      case 'agro_regency': return <AgroRegency user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'code_of_laws': return <CodeOfLaws user={currentUser} />;
      case 'agro_calendar': return <AgroCalendar user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} onNavigate={navigate} />;
      case 'chroma_system': return <ChromaSystem user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'envirosagro_store': return <EnvirosAgroStore user={currentUser} onSpendEAC={handleSpendEAC} onPlaceOrder={(o) => saveCollectionItem('orders', o)} />;
      case 'agro_value_enhancement': return <AgroValueEnhancement user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'digital_mrv': return <DigitalMRV user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onUpdateUser={(u) => setUser(u)} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'online_garden': return <OnlineGarden user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} notify={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} initialSection={viewSection} />;
      case 'farm_os': return <FarmOS user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} initialCode={osInitialCode} clearInitialCode={() => setOsInitialCode(null)} initialSection={viewSection} />;
      case 'media_ledger': return <MediaLedger user={currentUser} shards={mediaShards} />;
      case 'sitemap': return <Sitemap nodes={REGISTRY_NODES} onNavigate={navigate} />;
      case 'ai_analyst': return <AIAnalyst user={currentUser} onEmitSignal={emitSignal} onNavigate={navigate} />;
      case 'vendor': return <VendorPortal user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} vendorProducts={vendorProducts} onRegisterProduct={(p) => { setVendorProducts(prev => [p, ...prev]); saveCollectionItem('products', p); }} onNavigate={navigate} initialSection={viewSection} onUpdateProduct={(p) => { setVendorProducts(prev => prev.map(x => x.id === p.id ? p : x)); saveCollectionItem('products', p); }} onEmitSignal={emitSignal} liveProducts={liveProducts} onSaveLiveProduct={(p) => saveCollectionItem('live_products', p)} />;
      case 'ingest': return <NetworkIngest user={currentUser} onUpdateUser={(u) => setUser(u)} onSpendEAC={handleSpendEAC} onNavigate={navigate} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} initialSection={viewSection} />;
      case 'info': return <InfoPortal user={currentUser} onNavigate={navigate} onAcceptAll={() => handlePerformPermanentAction('ACCEPT_ALL_AGREEMENTS', 50, 'AGREEMENT_QUORUM_SYNC')} onPermanentAction={handlePerformPermanentAction} />;
      case 'settings': return <SettingsPortal user={currentUser} onUpdateUser={(u) => setUser(u)} onNavigate={navigate} />;
      case 'temporal_video': return <TemporalVideo user={currentUser} onNavigate={navigate} />;
      case 'robot': return <Robot user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} initialObjective={viewSection} />;
      case 'registry_handshake': return <RegistryHandshake user={currentUser} onUpdateUser={(u) => setUser(u)} onSpendEAC={handleSpendEAC} onNavigate={navigate} onEmitSignal={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); setView('farm_os'); }} />;
      case 'node_manager': return <NodeManager stewardId={currentUser.esin} />;
      default: return <Dashboard onNavigate={navigate} user={currentUser} isGuest={!user} blockchain={blockchain} isMining={false} orders={orders} />;
    }
  };
  const unreadSignalsCount = signals.filter(s => !s.read).length;

  if (isBooting) return <InitializationScreen onComplete={() => setIsBooting(false)} />;

  return (
    <div className="min-h-screen bg-[#050706] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden animate-in fade-in duration-1000">
      <ImplementationProgress currentStage={implementationStage} />
      
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-[1000] h-8 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 h-full shrink-0">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[7px] font-black uppercase text-emerald-400 tracking-widest">NETWORK_PULSE</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-[7px] text-emerald-500/80 font-mono font-black uppercase tracking-widest">
            {pulseMessage} • {new Date().toISOString()} • STABILITY: 1.42x • CONSENSUS: 100% • 
          </div>
        </div>
      </div>

      {/* Main Sidebar (Only for started app/logged-in users) */}
      {(user || isAppStarted) && (
        <div className={`fixed top-8 left-0 bottom-0 z-[250] bg-black/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'} ${isMobileMenuOpen ? 'w-80 translate-x-0' : ''}`}>
            <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
                    <SycamoreLogo size={32} className="text-black" />
                </div>
                {(isSidebarOpen || isMobileMenuOpen) && (
                <div className="animate-in fade-in slide-in-from-left-2">
                    <h1 className="text-lg font-black text-white italic tracking-tighter leading-none uppercase">Enviros<span className="text-emerald-400">Agro</span></h1>
                    <p className="text-[6px] text-slate-500 font-black uppercase tracking-0.4em mt-1 italic">Registry</p>
                </div>
                )}
            </div>
            {isMobileMenuOpen && <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white"><X size={20} /></button>}
            </div>

            <nav className="px-4 py-8 space-y-10">
            {REGISTRY_NODES.map((group) => (
                <div key={group.category} className="space-y-4">
                    {(isSidebarOpen || isMobileMenuOpen) && <p className={`px-4 text-[7px] font-black uppercase tracking-0.3em text-slate-700 italic`}>{group.category}</p>}
                    <div className="space-y-1">
                    {group.items.map(item => (
                        <button key={item.id} onClick={() => navigate(item.id as ViewState)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${view === item.id || (view === 'network_signals' && item.id === 'explorer') ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                        <item.icon size={16} className={view === item.id ? 'text-white' : 'text-slate-500'} />
                        {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-left leading-none">{item.name}</span>}
                        </button>
                    ))}
                    </div>
                </div>
            ))}
            </nav>
            {user && (
                <div className="p-8 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all">
                        <LogOut size={16} />
                        {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[8px] font-black uppercase tracking-[0.2em]">Logout</span>}
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Main Content Area */}
      <main ref={mainContentRef} onScroll={(e) => handleScroll(e.currentTarget)} className={`transition-all duration-500 pt-14 pb-32 h-screen overflow-y-auto custom-scrollbar relative ${(user || isAppStarted) ? (isSidebarOpen ? 'lg:pl-80' : 'lg:pl-24') : ''} px-4`}>
        
        {/* Scroll Progress Bar */}
        <div className="fixed top-8 left-0 right-0 z-[200] h-0.5 pointer-events-none">
          <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%`, marginLeft: (user || isAppStarted) ? (isSidebarOpen ? '20rem' : '5rem') : '0' }}></div>
        </div>

        {/* Dynamic Header */}
        <header className="flex justify-between items-center mb-6 md:mb-8 sticky top-0 bg-[#050706]/90 backdrop-blur-xl py-3 md:py-4 z-[150] px-2 -mx-2 border-b border-emerald-500/10 shadow-lg">
           <div className="flex items-center gap-4 overflow-hidden">
              {(user || isAppStarted) && (
                  <>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0">{isSidebarOpen ? <ChevronLeft size={18}/> : <Menu size={18}/>}</button>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0"><Menu size={18}/></button>
                  </>
              )}
              <div className="space-y-0.5 truncate max-w-[120px] sm:max-w-none">
                 <h2 className="text-sm sm:text-lg font-black text-white uppercase italic tracking-widest truncate leading-tight">{(view || '').replace(/_/g, ' ')}</h2>
                 <p className="text-[6px] sm:text-[8px] text-slate-600 font-mono tracking-widest uppercase truncate font-bold">STATUS: {user ? 'ANCHORED' : 'OBSERVER_MODE'}</p>
              </div>
           </div>
           
           <div className="flex-1 max-w-md mx-6 hidden md:block">
              <button onClick={() => setIsGlobalSearchOpen(true)} className="w-full h-10 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-slate-500 hover:border-emerald-500/40 hover:bg-white/10 transition-all group shadow-inner">
                 <div className="flex items-center gap-3">
                    <Search size={14} className="group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Search Multi-Ledger Registry...</span>
                 </div>
                 <div className="flex items-center gap-1.5 opacity-30">
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-mono">⌘</span>
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-mono">K</span>
                 </div>
              </button>
           </div>

           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onClick={() => { setIsConsultantOpen(!isConsultantOpen); setIsGlobalSearchOpen(false); setIsInboxOpen(false); }}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative group ${isConsultantOpen ? 'bg-indigo-600 text-white border-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}
                title="Concierge Oracle"
              >
                 <SycamoreLogo size={18} className={isConsultantOpen ? "text-white" : "text-emerald-400"} />
                 <div className={`absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-black ${isConsultantOpen ? 'animate-none' : 'animate-pulse'}`}></div>
              </button>

              {user && (
                <div className="relative">
                  <button 
                    onClick={() => { setIsInboxOpen(!isInboxOpen); setIsGlobalSearchOpen(false); setIsConsultantOpen(false); }}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative ${isInboxOpen ? 'bg-indigo-600 text-white border-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    title="User Inbox"
                  >
                    <BellRing size={18} className={unreadSignalsCount > 0 ? 'animate-pulse' : ''} />
                    {unreadSignalsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[7px] font-black flex items-center justify-center rounded-full border border-black animate-in zoom-in">
                        {unreadSignalsCount > 9 ? '9+' : unreadSignalsCount}
                      </span>
                    )}
                  </button>

                  {isInboxOpen && (
                    <div className="absolute top-14 right-0 w-80 md:w-96 glass-card rounded-3xl border border-white/10 bg-[#050706] shadow-3xl overflow-hidden animate-in slide-in-from-top-4 z-[500]">
                       <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                             <LucideIcons.Mail size={12} /> INBOX_TERMINAL
                          </span>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={markAllSignalsAsRead} 
                              className="text-[7px] font-black text-emerald-400 hover:text-emerald-300 uppercase flex items-center gap-1.5 transition-colors"
                            >
                               <CheckCircle2 size={10} /> Mark All Read
                            </button>
                          </div>
                       </div>
                       <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                          {signals.filter(s => !s.read).slice(0, 5).length === 0 ? (
                            <div className="p-10 text-center opacity-30 italic text-[10px] uppercase font-black">No active shards.</div>
                          ) : (
                            signals.filter(s => !s.read).slice(0, 5).map(sig => (
                              <div 
                                key={sig.id} 
                                onClick={() => { navigate('explorer', 'terminal'); setIsInboxOpen(false); }}
                                className={`p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-all border-l-4 group/msg ${sig.priority === 'critical' ? 'border-rose-600' : sig.priority === 'high' ? 'border-amber-500' : 'border-indigo-500'}`}
                              >
                                 <div className="flex items-center justify-between gap-3 mb-1">
                                    <div className="flex items-center gap-2">
                                       <span className="text-7px font-mono text-slate-700">{new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                       <span className={`text-[6px] font-black uppercase px-1.5 py-0.5 rounded ${sig.priority === 'critical' ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-600'}`}>{sig.priority}</span>
                                    </div>
                                    <button 
                                      onClick={(e) => markSignalAsRead(sig.id, e)}
                                      className="opacity-0 group-hover/msg:opacity-100 p-1 hover:bg-emerald-500/10 rounded text-emerald-500 transition-all"
                                    >
                                       <CheckCircle2 size={10} />
                                    </button>
                                 </div>
                                 <h5 className="text-[10px] font-black text-white uppercase italic truncate">{sig.title}</h5>
                                 <p className="text-[9px] text-slate-500 mt-1 line-clamp-1 italic">"{sig.message}"</p>
                              </div>
                            ))
                          )}
                       </div>
                       <button onClick={() => navigate('explorer', 'terminal')} className="w-full py-3 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Go to Signal Terminal</button>
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setIsGlobalSearchOpen(true)} className="md:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><Search size={16} className="text-slate-400" /></button>
              {user && <button onClick={() => setView('wallet')} className="px-3 py-2 glass-card rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 hover:bg-emerald-500/10 transition-all group"><Coins size={12} className="text-emerald-400 group-hover:rotate-12 transition-transform" /><span className="text-[8px] sm:text-[10px] font-mono font-black text-white">{(user?.wallet.balance || 0).toFixed(0)}</span></button>}
              <button onClick={() => { 
                  if (!user) {
                      setIsAppStarted(true);
                      setView('auth');
                  } else {
                      setView('profile');
                  }
              }} className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all shadow-xl overflow-hidden ${user ? 'border-white/10 bg-slate-800' : 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'}`}>
                 {user ? (<><div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-white/20 bg-black/40"><SycamoreLogo size={18} className="text-slate-500 m-auto mt-1.5" /></div><span className="text-[8px] font-black text-white hidden sm:block truncate max-w-[60px] uppercase italic">{user.name.split(' ')[0]}</span></>) : (<><UserPlus size={14} className="text-emerald-400" /><span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Sync</span></>)}
              </button>
           </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          {renderView()}
        </div>

        {/* Global Footer (Mostly for Landing) */}
        <footer className="mt-20 pt-8 border-t border-white/5 pb-12 flex flex-col items-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-500 px-4">
           {(user || isAppStarted) && (
               <div className="flex w-full items-center justify-between gap-4">
                <button onClick={goBack} disabled={history.length === 0} className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all active:scale-95 group/back ${history.length > 0 ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'border-white/5 text-slate-800 opacity-20 cursor-not-allowed'}`} title="Vector Retrograde">
                    <ChevronLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                    <div className="flex flex-col items-start text-left hidden md:block"><span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none">Retrograde</span><span className="text-6px font-mono opacity-50 mt-1 uppercase">{history.length > 0 ? history[history.length - 1].matrixIndex : 'Prev_Vector'}</span></div>
                </button>
                <div className="flex p-1 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-3xl">
                    {[ { id: 'dashboard', label: 'Command', icon: LayoutGrid }, { id: 'mesh_protocol', label: 'Mesh', icon: NetworkIcon }, { id: 'economy', label: 'Market', icon: Globe }, { id: 'wallet', label: 'Treasury', icon: Coins }, { id: 'intelligence', label: 'Science', icon: Microscope }, { id: 'sitemap', label: 'Matrix', icon: MapIcon } ].map(shard => (
                    <button key={shard.id} onClick={() => navigate(shard.id as ViewState)} className={`p-3 rounded-xl transition-all group/shard relative ${view === shard.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-white hover:bg-white/5'}`} title={shard.label}>
                        <shard.icon size={16} /><div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] font-black uppercase tracking-widest rounded border border-white/10 opacity-0 group-hover/shard:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{shard.label}</div>
                    </button>
                    ))}
                </div>
                <button onClick={goForward} disabled={forwardHistory.length === 0} className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all active:scale-95 group/fwd ${forwardHistory.length > 0 ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'border-white/5 text-slate-800 opacity-20 cursor-not-allowed'}`} title="Vector Advance">
                    <div className="flex flex-col items-end text-right hidden md:block"><span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 transition-all">Advance</span><span className="text-6px font-mono opacity-50 mt-1 uppercase">{forwardHistory.length > 0 ? forwardHistory[forwardHistory.length - 1].matrixIndex : 'Next_Vector'}</span></div>
                    <ChevronRight size={16} className="group-hover/fwd:translate-x-1 transition-transform" />
                </button>
                </div>
           )}
           <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 border-t border-white/5 pt-8 px-4 opacity-40">
              <div className="flex items-center gap-4"><SycamoreLogo size={20} className="text-emerald-500" /><div className="text-left"><p className="text-9px font-black text-white uppercase italic tracking-widest leading-none">Enviros<span className="text-emerald-400">Agro</span></p><p className="text-[6px] text-slate-600 font-bold uppercase tracking-[0.4em] mt-1">Planetary_Regeneration_Grid</p></div></div>
              <div className="flex items-center gap-8"><div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-7px text-slate-700 font-mono uppercase font-black">MATRIX_SYNC_OK</span></div><p className="text-7px text-slate-700 font-mono uppercase tracking-widest">© 2025 EA_ROOT_NODE</p><button onClick={() => navigate('info')} className="text-7px font-black text-slate-600 hover:text-white uppercase tracking-[0.4em]">SAFETY_REGISTRY</button></div>
           </div>
        </footer>
        {showZenithButton && <button onClick={scrollToTop} className="fixed bottom-32 right-6 sm:right-10 p-3.5 sm:p-4 agro-gradient rounded-xl sm:rounded-2xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all z-[400] border border-white/20 animate-in fade-in zoom-in duration-300"><ArrowUp size={20} /></button>}
      </main>

      {/* Persistent UI Layers */}
      <div className="fixed top-24 right-4 sm:right-10 z-[500] space-y-4 max-w-[280px] sm:max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 sm:p-5 rounded-2xl border shadow-3xl flex items-start gap-3 pointer-events-auto animate-in slide-in-from-right duration-500 ${n.type === 'error' ? 'bg-rose-950/80 border-rose-500/30 text-rose-500' : n.type === 'warning' ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' : 'bg-black/95 border-emerald-500/20 text-emerald-400'}`}>
            {n.type === 'error' ? <LucideIcons.ShieldAlert className="shrink-0 mt-0.5" size={16} /> : <Info className="shrink-0 mt-0.5" size={16} />}
            <div className="flex-1 space-y-0.5"><h5 className="text-[9px] font-black uppercase tracking-widest">{n.title}</h5><p className="text-[9px] italic text-slate-300 leading-tight">{n.message}</p></div>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-slate-700 hover:text-white"><X size={12}/></button>
          </div>
        ))}
      </div>
      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} onNavigate={navigate} vendorProducts={vendorProducts} />
      <EvidenceModal isOpen={isEvidenceOpen} onClose={() => setIsEvidenceOpen(false)} user={user || GUEST_STWD} onMinted={handleEarnEAC} onNavigate={navigate} taskToIngest={activeTaskForEvidence} />
      <LiveVoiceBridge isOpen={false} isGuest={!user} onClose={() => {}} />
      <FloatingConsultant isOpen={isConsultantOpen} onClose={() => setIsConsultantOpen(false)} user={user || GUEST_STWD} onNavigate={navigate} />
    </div>
  );
};

export default App;
