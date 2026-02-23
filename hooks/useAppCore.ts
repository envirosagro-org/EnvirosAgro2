
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ViewState, User, AgroProject, FarmingContract, Order, VendorProduct, RegisteredUnit, 
  LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, MediaShard, SignalShard, 
  Task, ValueBlueprint, VectorAddress, ShardCostCalibration, ImplementationStage 
} from '../types';
import { 
  auth, getStewardProfile, signOutSteward, onAuthStateChanged, listenToCollection, 
  saveCollectionItem, dispatchNetworkSignal, markPermanentAction, listenToPulse, 
  updateSignalReadStatus, markAllSignalsAsReadInDb, startBackgroundDataSync
} from '../services/firebaseService';
import { getFullCostAudit } from '../services/costAccountingService';
import { REGISTRY_NODES } from '../constants';
import { GUEST_STWD } from '../guestStwd';

export const useAppCore = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [viewSection, setViewSection] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [history, setHistory] = useState<VectorAddress[]>([]);
  const [forwardHistory, setForwardHistory] = useState<VectorAddress[]>([]);
  const [projects, setProjects] = useState<AgroProject[]>([]);
  const [contracts, setContracts] = useState<FarmingContract[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [transactions, setTransactions] = useState<AgroTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationShard[]>([]);
  const [mediaShards, setMediaShards] = useState<MediaShard[]>([]);
  const [signals, setSignals] = useState<SignalShard[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blueprints, setBlueprints] = useState<ValueBlueprint[]>([]);
  const [pulseMessage, setPulseMessage] = useState('Registry synchronized. No anomalies detected.');
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<any | null>(null);
  const [osInitialCode, setOsInitialCode] = useState<string | null>(null);
  const [costAudit, setCostAudit] = useState<ShardCostCalibration | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showZenithButton, setShowZenithButton] = useState(false);
  const [implementationStage, setImplementationStage] = useState<ImplementationStage>('Schema Definition');

  useEffect(() => {
    const unsubSync = startBackgroundDataSync();
    const costInterval = setInterval(() => {
      if (user) {
        const auditResult = getFullCostAudit(100, user.metrics);
        setCostAudit(auditResult);
      }
    }, 15000);
    return () => {
      unsubSync();
      clearInterval(costInterval);
    };
  }, [user]);

  useEffect(() => { mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [view]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
        setIsConsultantOpen(false);
        setIsInboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScroll = (target: HTMLDivElement) => { 
    setScrollProgress((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100);
    setShowZenithButton(target.scrollTop > 400);
  };

  const scrollToTop = () => mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleResize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsSidebarOpen(isLg);
      if (isLg) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isVerified = fbUser.emailVerified || fbUser.providerData?.some(p => p.providerId === 'phone');
        if (isVerified) {
          setIsUnverified(false);
          const profile = await getStewardProfile(fbUser.uid);
          if (profile) {
              setUser(profile);
              setIsAppStarted(true); // User is logged in, app is definitely started
          }
        } else {
          setIsUnverified(true);
          setUser(null);
        }
      } else {
        setIsUnverified(false);
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const unsubProjects = listenToCollection('projects', setProjects, true);
    const unsubContracts = listenToCollection('contracts', setContracts, true);
    const unsubOrders = listenToCollection('orders', setOrders);
    const unsubProducts = listenToCollection('products', setVendorProducts, true);
    const unsubUnits = listenToCollection('industrial_units', setIndustrialUnits);
    const unsubLive = listenToCollection('live_products', setLiveProducts, true);
    const unsubTx = listenToCollection('transactions', setTransactions);
    const unsubSignals = listenToCollection('signals', setSignals);
    const unsubMedia = listenToCollection('media_ledger', setMediaShards, true);
    const unsubBlocks = listenToCollection('blocks', setBlockchain, true);
    const unsubTasks = listenToCollection('tasks', setTasks);
    const unsubBlueprints = listenToCollection('blueprints', setBlueprints);
    const unsubPulse = listenToPulse(setPulseMessage);
    return () => {
      unsubProjects(); unsubContracts(); unsubOrders(); unsubProducts(); unsubUnits(); unsubLive(); 
      unsubTx(); unsubSignals(); unsubPulse(); unsubMedia(); unsubBlocks(); unsubTasks(); unsubBlueprints();
    };
  }, [user]);

  const emitSignal = useCallback(async (signalData: Partial<SignalShard>) => {
    const signal = await dispatchNetworkSignal(signalData);
    if (signal) {
      const popupLayer = signal.dispatchLayers.find(l => l.channel === 'POPUP');
      if (popupLayer) {
        const id = Math.random().toString(36).substring(7);
        setNotifications(prev => [{ 
          id, type: signal.type === 'ledger_anchor' ? 'success' : signal.priority === 'critical' ? 'error' : signal.priority === 'high' ? 'warning' : 'info', 
          title: signal.title, message: signal.message, duration: 6000, actionLabel: signal.actionLabel, actionIcon: signalData.actionIcon 
        }, ...prev]);
      }
    }
  }, []);

  const handleSpendEAC = async (amount: number, reason: string) => {
    if (!user) { setView('auth'); return false; }
    if (user.wallet.balance < amount) {
      emitSignal({ title: 'INSUFFICIENT_FUNDS', message: `Need ${amount} EAC for ${reason}.`, priority: 'high', type: 'commerce', origin: 'MANUAL' });
      return false;
    }
    const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance - amount } };
    setUser(updatedUser);
    return true;
  };

  const handleEarnEAC = async (amount: number, reason: string) => {
    if (!user) return;
    const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance + amount, lifetimeEarned: (user.wallet.lifetimeEarned || 0) + amount } };
    setUser(updatedUser);
  };

  const handlePerformPermanentAction = async (actionKey: string, reward?: number, reason?: string) => {
    if (!user || user.completedActions?.includes(actionKey)) return false;
    const ok = await markPermanentAction(actionKey);
    if (ok && reward && reason) await handleEarnEAC(reward, reason);
    return ok;
  };

  const handleLogout = async () => {
    await signOutSteward();
    setUser(null);
    setView('dashboard');
    setIsAppStarted(false); // Reset app started state on logout
  };

  const markSignalAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
    await updateSignalReadStatus(id, true);
  };

  const markAllSignalsAsRead = async () => {
    const unreadIds = signals.filter(s => !s.read).map(s => s.id);
    if (unreadIds.length === 0) return;
    setSignals(prev => prev.map(s => ({ ...s, read: true })));
    await markAllSignalsAsReadInDb(unreadIds);
    emitSignal({ title: 'INBOX_SYNCHRONIZED', message: 'All unread network signals have been cleared and archived.', priority: 'low', type: 'system', origin: 'MANUAL', actionIcon: 'CheckCircle2' });
  };

  const findMatrixIndex = (v: ViewState, section: string | null): string | undefined => {
    let index: string | undefined;
    REGISTRY_NODES.forEach((group, dIdx) => {
      group.items.forEach((item, eIdx) => {
        if (item.id === v) {
          if (!section) {
            index = `[${dIdx + 1}.${eIdx + 1}]`;
          } else {
            const sIdx = item.sections?.findIndex(s => s.id === section);
            if (sIdx !== undefined && sIdx !== -1) {
              index = `[${dIdx + 1}.${eIdx + 1}.${sIdx + 1}]`;
            }
          }
        }
      });
    });
    return index;
  };

  const navigate = useCallback((v: ViewState, section?: string, pushToHistory = true) => {
    if (pushToHistory) {
      const currentAddress: VectorAddress = { dimension: view, element: viewSection, matrixIndex: findMatrixIndex(view, viewSection) };
      setHistory(prev => [...prev, currentAddress]);
      setForwardHistory([]);
    }
    setView(v);
    setViewSection(section || null);
    setIsMobileMenuOpen(false);
    setIsConsultantOpen(false);
    setIsInboxOpen(false);
    const index = findMatrixIndex(v, section || null);
    emitSignal({ title: 'VECTOR_SHIFT', message: `Resolved route to ${index || v.toUpperCase()}.`, priority: 'low', type: 'system', origin: 'ORACLE', actionIcon: 'ChevronRight' });
  }, [view, viewSection, emitSignal]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const currentAddress: VectorAddress = { dimension: view, element: viewSection, matrixIndex: findMatrixIndex(view, viewSection) };
      const lastVector = history[history.length - 1];
      setForwardHistory(prev => [...prev, currentAddress]);
      setHistory(prev => prev.slice(0, -1));
      navigate(lastVector.dimension, lastVector.element || undefined, false);
    } else if (view !== 'dashboard') {
      navigate('dashboard', undefined, true);
    }
  }, [history, view, viewSection, navigate]);

  const goForward = useCallback(() => {
    if (forwardHistory.length > 0) {
      const currentAddress: VectorAddress = { dimension: view, element: viewSection, matrixIndex: findMatrixIndex(view, viewSection) };
      const nextVector = forwardHistory[forwardHistory.length - 1];
      setHistory(prev => [...prev, currentAddress]);
      setForwardHistory(prev => prev.slice(0, -1));
      navigate(nextVector.dimension, nextVector.element || undefined, false);
    }
  }, [forwardHistory, view, viewSection, navigate]);
  
  return {
    isBooting, setIsBooting,
    isAppStarted, setIsAppStarted,
    view, setView,
    viewSection, setViewSection,
    user, setUser,
    isUnverified, setIsUnverified,
    isSidebarOpen, setIsSidebarOpen,
    isMobileMenuOpen, setIsMobileMenuOpen,
    isGlobalSearchOpen, setIsGlobalSearchOpen,
    isConsultantOpen, setIsConsultantOpen,
    isInboxOpen, setIsInboxOpen,
    history, setHistory,
    forwardHistory, setForwardHistory,
    projects, setProjects,
    contracts, setContracts,
    orders, setOrders,
    vendorProducts, setVendorProducts,
    industrialUnits, setIndustrialUnits,
    liveProducts, setLiveProducts,
    blockchain, setBlockchain,
    transactions, setTransactions,
    notifications, setNotifications,
    mediaShards, setMediaShards,
    signals, setSignals,
    tasks, setTasks,
    blueprints, setBlueprints,
    pulseMessage, setPulseMessage,
    isEvidenceOpen, setIsEvidenceOpen,
    activeTaskForEvidence, setActiveTaskForEvidence,
    osInitialCode, setOsInitialCode,
    costAudit, setCostAudit,
    mainContentRef,
    scrollProgress, setScrollProgress,
    showZenithButton, setShowZenithButton,
    implementationStage, setImplementationStage,
    handleScroll,
    scrollToTop,
    emitSignal,
    handleSpendEAC,
    handleEarnEAC,
    handlePerformPermanentAction,
    handleLogout,
    markSignalAsRead,
    markAllSignalsAsRead,
    navigate,
    goBack,
    goForward,
    GUEST_STWD,
    findMatrixIndex
  };
};
