import { AgrobotProfile, BotType, SignalShard } from "../../types";
import { dispatchNetworkSignal } from '../core/firebaseService';
import { generateAlphanumericId } from '../../systemFunctions';
import { socialBotService } from "../ops/socialBotService";

class AutomationService {
  private static instance: AutomationService;
  private bots: AgrobotProfile[] = [
    { id: 'BOT-DS-01', type: 'DATA_SCULPTOR', name: 'Sculptor-Alpha', status: 'ACTIVE', lastActive: new Date().toISOString(), efficiency: 98.2, tasksCompleted: 1450, shardAssigned: 'DATA_WAREHOUSE' },
    { id: 'BOT-LS-02', type: 'LEDGER_SENTINEL', name: 'Sentinel-Omega', status: 'IDLE', lastActive: new Date().toISOString(), efficiency: 99.9, tasksCompleted: 890, shardAssigned: 'BLOCKCHAIN_MAINNET' },
    { id: 'BOT-YO-03', type: 'YIELD_ORACLE', name: 'Oracle-Prime', status: 'ACTIVE', lastActive: new Date().toISOString(), efficiency: 94.5, tasksCompleted: 3200, shardAssigned: 'PREDICTIVE_MODELS' },
    { id: 'BOT-SS-04', type: 'SYNC_SWARM', name: 'Swarm-Node-04', status: 'CALIBRATING', lastActive: new Date().toISOString(), efficiency: 0, tasksCompleted: 0, shardAssigned: 'IOT_MESH' },
    { id: 'BOT-MA-05', type: 'MRV_AUDITOR', name: 'Auditor-Sigma', status: 'ACTIVE', lastActive: new Date().toISOString(), efficiency: 97.8, tasksCompleted: 540, shardAssigned: 'CARBON_LEDGER' },
    { id: 'BOT-DL-06', type: 'DISPATCH_LOGISTICIAN', name: 'Logi-Master', status: 'ACTIVE', lastActive: new Date().toISOString(), efficiency: 95.2, tasksCompleted: 1200, shardAssigned: 'SUPPLY_CHAIN' },
    { id: 'BOT-AC-07', type: 'ASSET_CUSTODIAN', name: 'Custodian-Zeta', status: 'ACTIVE', lastActive: new Date().toISOString(), efficiency: 98.5, tasksCompleted: 310, shardAssigned: 'HARDWARE_REGISTRY' },
    { id: 'BOT-SB-08', type: 'SOCIAL_BOT', name: 'EnviroBot-Social', status: 'ACTIVE', lastActive: new Date().toISOString(), efficiency: 99.0, tasksCompleted: 0, shardAssigned: 'SOCIAL_MEDIA' }
  ];

  private intervals: NodeJS.Timeout[] = [];

  private constructor() {}

  public static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  public startAutomation() {
    console.log('[AutomationService] Initializing Autonomous Agrobot Swarm...');
    
    // Core Data Sculpting Cycle (Every 30s)
    this.intervals.push(setInterval(() => this.runDataSculpting(), 30000));
    
    // Ledger Anchoring Cycle (Every 60s)
    this.intervals.push(setInterval(() => this.runLedgerAnchoring(), 60000));
    
    // Yield Modeling Cycle (Every 5m)
    this.intervals.push(setInterval(() => this.runYieldModeling(), 300000));

    // MRV Auditing Cycle (Every 2m)
    this.intervals.push(setInterval(() => this.runMRVAuditing(), 120000));

    // Logistics Dispatch Cycle (Every 45s)
    this.intervals.push(setInterval(() => this.runLogisticsMonitoring(), 45000));

    // Asset Maintenance Cycle (Every 10m)
    this.intervals.push(setInterval(() => this.runAssetMaintenance(), 600000));

    // Social Media Cycle (Every 20s)
    this.intervals.push(setInterval(() => socialBotService.processQueue(), 20000));
  }

  public stopAutomation() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  private async runDataSculpting() {
    const bot = this.bots.find(b => b.type === 'DATA_SCULPTOR');
    if (!bot || bot.status !== 'ACTIVE') return;

    console.log(`[Agrobot] ${bot.name} scanning for data drifts...`);
    bot.tasksCompleted++;
    bot.lastActive = new Date().toISOString();

    if (Math.random() > 0.8) {
      await dispatchNetworkSignal({
        title: 'DATA_SYNC_AUTOMATION',
        message: `${bot.name} resolved 12 data shard inconsistencies in the organizational ledger.`,
        priority: 'low',
        type: 'system',
        origin: 'ORACLE',
        actionIcon: 'Database'
      });
    }
  }

  private async runLedgerAnchoring() {
    const bot = this.bots.find(b => b.type === 'LEDGER_SENTINEL');
    if (!bot) return;

    bot.status = 'ACTIVE';
    console.log(`[Agrobot] ${bot.name} anchoring pending transactions...`);
    
    bot.tasksCompleted++;
    bot.lastActive = new Date().toISOString();

    await dispatchNetworkSignal({
      title: 'LEDGER_ANCHOR_AUTO',
      message: `Autonomous block validation completed by ${bot.name}. 5 blocks successfully appended.`,
      priority: 'medium',
      type: 'ledger_anchor',
      origin: 'ORACLE',
      actionIcon: 'Shield'
    });

    bot.status = 'IDLE';
  }

  private async runYieldModeling() {
    const bot = this.bots.find(b => b.type === 'YIELD_ORACLE');
    if (!bot || bot.status !== 'ACTIVE') return;

    console.log(`[Agrobot] ${bot.name} recalculating predictive yield models...`);
    bot.tasksCompleted++;
    bot.lastActive = new Date().toISOString();

    await dispatchNetworkSignal({
      title: 'YIELD_PREDICTION_UPDATED',
      message: `Global yield models updated. Maize output predicted +4.2% based on current sensor sharding.`,
      priority: 'high',
      type: 'system',
      origin: 'ORACLE',
      actionIcon: 'TrendingUp'
    });
  }

  private async runMRVAuditing() {
    const bot = this.bots.find(b => b.type === 'MRV_AUDITOR');
    if (!bot || bot.status !== 'ACTIVE') return;

    console.log(`[Agrobot] ${bot.name} auditing soil carbon metrics...`);
    bot.tasksCompleted++;
    bot.lastActive = new Date().toISOString();

    if (Math.random() > 0.7) {
      await dispatchNetworkSignal({
        title: 'MRV_AUDIT_SUCCESS',
        message: `Carbon sequestration thresholds met for Plot_EA_44. Issuing 1.2 tons of offsets.`,
        priority: 'medium',
        type: 'system',
        origin: 'TREASURY',
        actionIcon: 'Leaf'
      });
    }
  }

  private async runLogisticsMonitoring() {
    const bot = this.bots.find(b => b.type === 'DISPATCH_LOGISTICIAN');
    if (!bot || bot.status !== 'ACTIVE') return;

    console.log(`[Agrobot] ${bot.name} optimizing shipping routes...`);
    bot.tasksCompleted++;
    bot.lastActive = new Date().toISOString();

    if (Math.random() > 0.9) {
      await dispatchNetworkSignal({
        title: 'LOGISTICS_REROUTE',
        message: `Delivery delays detected in Nairobi corridor. ${bot.name} rerouted 3 shipments to Eco-Rail.`,
        priority: 'medium',
        type: 'network',
        origin: 'ORACLE',
        actionIcon: 'Truck'
      });
    }
  }

  private async runAssetMaintenance() {
    const bot = this.bots.find(b => b.type === 'ASSET_CUSTODIAN');
    if (!bot || bot.status !== 'ACTIVE') return;

    console.log(`[Agrobot] ${bot.name} checking hardware health...`);
    bot.tasksCompleted++;
    bot.lastActive = new Date().toISOString();

    if (Math.random() > 0.95) {
      await dispatchNetworkSignal({
        title: 'MAINTENANCE_REQUIRED',
        message: `Solar Inverter #882 at Node_7 show efficiency drop. Maintenance task scheduled.`,
        priority: 'high',
        type: 'task',
        origin: 'ORACLE',
        actionIcon: 'Wrench'
      });
    }
  }

  public getBots(): AgrobotProfile[] {
    return this.bots;
  }
}

export const automationService = AutomationService.getInstance();
