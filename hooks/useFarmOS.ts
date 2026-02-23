
import { useState, useEffect } from 'react';
import { User, SignalShard } from '../types';
import { auditAgroLangCode } from '../services/geminiService';

export const useFarmOS = (
  user: User,
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>,
  onEarnEAC: (amount: number, reason: string) => void,
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>,
  initialCode?: string | null,
  initialSection?: string | null
) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'ide' | 'hardware' | 'scheduler' | 'shell'>('kernel');
  const [bootStatus, setBootStatus] = useState<'OFF' | 'POST' | 'ON'>('ON');
  const [bootProgress, setBootProgress] = useState(100);
  const [shellInput, setShellInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    "AGROBOTO_OS_v6.5 kernel loaded.",
    "Registry connection established (0x882A).",
    "Consensus Quorum: 99.98% Synchronized.",
    "Initializing SEHTI Scheduler..."
  ]);

  const [resourceLoad, setResourceLoad] = useState({
    S: 42, E: 65, H: 28, T: 84, I: 55
  });

  const [hardwareHealth, setHardwareHealth] = useState({
    cpu: 45, disk: 12, net: 88, fan: 2100
  });

  const [isExecutingLogic, setIsExecutingLogic] = useState(false);

  // IDE Local States
  const [activeShard, setActiveShard] = useState('Production_Init.al');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({
    'Production_Init.al': `// AGROLANG_ENVIRONMENT: EnvirosAgro OS v6.5
// NODE_DESIGNATION: ${user.esin}
IMPORT AgroLaw.Kenya.NairobiCounty AS Law;
IMPORT EOS.Automation AS Bot;
IMPORT MedicAg.Aura AS Bio;

AUTHENTICATE node_signature(id: "${user.esin}");

SEQUENCE Optimize_Cycle_882 {
    // 1. Constrain process within Legal Thresholds
    CONSTRAIN moisture_delta < Law.WATER_ACT.quota_shard;
    
    // 2. Adjust m-Resilience via Sonic Remediation
    Bio.apply_freq(target: 432Hz, gain: 0.82v);
    
    // 3. Deploy Swarm for precision sharding
    Bot.swarm_deploy(units: 12, mode: "MIN_STRESS");
    
    // 4. Anchor value to ledger
    COMMIT_SHARD(registry: "GLOBAL_L3", finality: ZK_PROVEN);
}`
  });
  const [isCompiling, setIsCompiling] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<'IDLE' | 'COMPLIANT' | 'VIOLATION'>('IDLE');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  useEffect(() => {
    if (initialSection === 'ide' || initialCode) {
      setActiveTab('ide');
      if (initialCode) {
        setCodeMap(prev => ({ ...prev, 'External_Inflow.al': initialCode }));
        setActiveShard('External_inflow.al');
      }
    } else if (initialSection === 'shell') {
      setActiveTab('shell');
    }
  }, [initialSection, initialCode]);

  useEffect(() => {
    if (bootStatus === 'ON') {
      const metricInterval = setInterval(() => {
        setHardwareHealth(prev => ({
          cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 10 - 5))),
          disk: Math.min(100, prev.disk + 0.01),
          net: Math.min(100, Math.max(10, prev.net + (Math.random() * 4 - 2))),
          fan: Math.floor(2100 + Math.random() * 200)
        }));
      }, 3000);
      return () => clearInterval(metricInterval);
    }
  }, [bootStatus]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [`[${type.toUpperCase()}] ${msg}`, ...prev]);
  };

  const handleBoot = () => {
    setBootStatus('POST');
    setBootProgress(0);
    setLogs(["INITIALIZING AGRO-INIT SEQUENCE..."]);
    onEmitSignal({
      type: 'system',
      origin: 'ORACLE',
      title: 'KERNEL_BOOT_INITIALIZED',
      message: `Node ${user.esin} initializing Sycamore OS v6.5 boot sequence.`,
      priority: 'medium',
      actionIcon: 'Power'
    });

    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootStatus('ON');
          return 100;
        }
        if (prev === 20) setLogs(l => [...l, "Checking Soil Integrity... [OK]"]);
        if (prev === 50) setLogs(l => [...l, "Syncing Blockchain Shards... [OK]"]);
        if (prev === 80) setLogs(l => [...l, "Mounting Virtual Asset Registry... [OK]"]);
        return prev + 1;
      });
    }, 40);
  };

  const handleCompile = async () => {
    const fee = 25;
    if (!await onSpendEAC(fee, 'AGROLANG_INDUSTRIAL_AUDIT')) return;
    setIsCompiling(true);
    setComplianceStatus('IDLE');
    addLog("MOUNTING AGROLANG LOGIC SHARD...", 'info');
    
    onEmitSignal({
      type: 'task',
      origin: 'ORACLE',
      title: 'AGROLANG_AUDIT_STARTED',
      message: `Auditing code shard ${activeShard} for EOS Framework compliance.`,
      priority: 'low',
      actionIcon: 'SearchCode'
    });

    try {
      const res = await auditAgroLangCode(codeMap[activeShard]);
      await new Promise(r => setTimeout(r, 1000));
      addLog("Mapping Pillar Weights...", 'info');
      await new Promise(r => setTimeout(r, 600));
      addLog(`Handshake with Node ${user.esin} verified.`, 'success');
      
      if (res.is_compliant) {
        setComplianceStatus('COMPLIANT');
        addLog(`Shard integrity index 0.98a.`, 'success');
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'ORACLE',
          title: 'AUDIT_COMPLIANT',
          message: `Code shard ${activeShard} verified as compliant with SEHTI standards.`,
          priority: 'medium',
          actionIcon: 'ShieldCheck',
          meta: { target: 'farm_os', ledgerContext: 'INVENTION' }
        });
      } else {
        setComplianceStatus('VIOLATION');
        addLog("Resource constraint overflow detected at line 14.", 'error');
        onEmitSignal({
          type: 'system',
          origin: 'ORACLE',
          title: 'AUDIT_VIOLATION',
          message: `Code shard ${activeShard} failed compliance check. m-constant drift risk detected.`,
          priority: 'high',
          actionIcon: 'ShieldAlert'
        });
      }
    } catch (e) {
      addLog("ERROR: Oracle connection timeout.", 'error');
    } finally {
      setIsCompiling(false);
    }
  };

  const executeOptimization = async (code: string) => {
    setIsExecutingLogic(true);
    addLog("EXECUTING KERNEL BINDINGS...", 'info');
    
    const lines = code.split('\n').filter(l => l.trim() && !l.startsWith('//'));
    
    for (const line of lines) {
      await new Promise(r => setTimeout(r, 600));
      addLog(`Kernel syscall: ${line.trim().substring(0, 40)}...`, 'info');
      
      if (line.includes('CONSTRAIN')) {
        addLog("Resource boundary enforced.", 'success');
        setResourceLoad(prev => ({ ...prev, S: Math.max(10, prev.S - 5) }));
      }
      if (line.includes('Bio.apply_freq')) {
        addLog("Hardware resonance recalibrated.", 'success');
        setResourceLoad(prev => ({ ...prev, E: Math.min(100, prev.E + 8) }));
      }
      if (line.includes('Bot.swarm_deploy')) {
        addLog("Robot swarm signal transmitted.", 'success');
        setResourceLoad(prev => ({ ...prev, T: Math.min(100, prev.T + 12) }));
      }
      if (line.includes('COMMIT_SHARD')) {
        addLog("Finality reached. Shard anchored.", 'success');
      }
    }

    await new Promise(r => setTimeout(r, 800));
    addLog("OS OPTIMIZATION FINALIZED.", 'success');
    setIsExecutingLogic(false);
    onEarnEAC(100, 'OS_LOGIC_EXECUTION_REWARD');
  };

  const executeToShell = () => {
    setActiveTab('shell');
    addLog(`INITIALIZING DEPLOYMENT: ${activeShard}`, 'info');
    executeOptimization(codeMap[activeShard]);
  };

  const handleShellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim() || isExecutingLogic) return;
    const cmd = shellInput.toLowerCase().trim();
    setLogs(prev => [`admin@EnvirosAgro:~$ ${shellInput}`, ...prev]);
    
    if (cmd === 'agro-apply-logic' && activeShard) {
      executeOptimization(codeMap[activeShard]);
    } else if (cmd === 'npx wrangler deploy') {
      setIsExecutingLogic(true);
      addLog("Initializing Project Deployment Shard...", 'info');
      await new Promise(r => setTimeout(r, 1000));
      addLog("Deployment Finalized at 0x882A.", 'success');
      setIsExecutingLogic(false);
    } else if (cmd === 'help') {
      addLog("Syscalls: npx wrangler deploy, net-sync, mesh-finality, ingest-status, agro-apply-logic, clear, help", 'info');
    } else if (cmd === 'clear') {
      setLogs([]);
    } else {
      addLog(`Unknown syscall: ${cmd}`, 'error');
    }
    setShellInput('');
  };

  return {
    activeTab,
    setActiveTab,
    bootStatus,
    bootProgress,
    shellInput,
    setShellInput,
    logs,
    resourceLoad,
    hardwareHealth,
    isExecutingLogic,
    activeShard,
    setActiveShard,
    codeMap,
    setCodeMap,
    isCompiling,
    complianceStatus,
    isLibraryOpen,
    setIsLibraryOpen,
    handleBoot,
    handleCompile,
    executeToShell,
    handleShellSubmit,
  };
};
