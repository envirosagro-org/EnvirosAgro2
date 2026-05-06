import { collection, addDoc, Timestamp, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { ref, push } from 'firebase/database';
import { db, auth, rtdb } from '../core/firebaseService';
import { SensorReading, DroneTelemetry, TelemetryBatch, DroneMission } from '../../types';
import { z } from 'zod';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

const DroneTelemetrySchema = {
  type: "object",
  properties: {
    droneId: { type: "string" },
    altitude: { type: "number" },
    battery: { type: "number" },
    timestamp: { type: "string" },
    stewardId: { type: "string" }
  },
  required: ["droneId", "altitude", "battery", "timestamp", "stewardId"],
  additionalProperties: true
};

const validateTelemetry = ajv.compile(DroneTelemetrySchema);

const SensorReadingSchema = z.object({
  sensorType: z.string(),
  value: z.number(),
  unit: z.string(),
});

export type TelemetryChannel = 'ENERGY_OUTPUT' | 'PRESSURE_DRIFT' | 'THERMAL_RESONANCE' | 'COOLANT_FLOW' | 'SHARD_VELOCITY';

export interface TelemetryReading {
  channel: TelemetryChannel;
  value: number;
  unit: string;
  timestamp: string;
  nodeId: string;
}

class IoTSensorService {
  private static instance: IoTSensorService;
  private simulationInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(reading: TelemetryReading) => void> = new Set();
  private telemetryBuffer: DroneTelemetry[] = [];
  private batchInterval = 60000;
  private batchTimer: NodeJS.Timeout | null = null;
  private liveTelemetryListeners: ((reading: DroneTelemetry) => void)[] = [];

  private constructor() {}

  public static getInstance(): IoTSensorService {
    if (!IoTSensorService.instance) {
      IoTSensorService.instance = new IoTSensorService();
    }
    return IoTSensorService.instance;
  }

  // --- General Telemetry Simulation ---
  public startSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      const channels: TelemetryChannel[] = ['ENERGY_OUTPUT', 'PRESSURE_DRIFT', 'THERMAL_RESONANCE', 'COOLANT_FLOW', 'SHARD_VELOCITY'];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      let value = 0;
      let unit = '';
      switch(channel) {
        case 'ENERGY_OUTPUT': value = 4.0 + Math.random() * 0.5; unit = 'GW'; break;
        case 'PRESSURE_DRIFT': value = 0.02 + Math.random() * 0.01; unit = 'psi'; break;
        case 'THERMAL_RESONANCE': value = 1400 + Math.random() * 50; unit = '°C'; break;
        case 'COOLANT_FLOW': value = 800 + Math.random() * 100; unit = 'L/s'; break;
        case 'SHARD_VELOCITY': value = 140 + Math.random() * 10; unit = 'sh/m'; break;
      }
      const reading: TelemetryReading = { channel, value, unit, nodeId: 'CORE_REACTOR_S7', timestamp: new Date().toISOString() };
      this.listeners.forEach(cb => cb(reading));
    }, 3000);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public subscribe(callback: (reading: TelemetryReading) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // --- Legacy / Dashboard Simulation ---
  public startOldSimulation(onReward: (amount: number, reason: string) => void) {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      const mockReading = { sensorType: 'SOIL_MOISTURE' as const, value: Math.floor(Math.random() * 100), unit: '%' };
      this.addReading(mockReading, onReward);
    }, 5000);
  }

  // --- Sensor Readings (Firestore) ---
  public async addReading(reading: Omit<SensorReading, 'id' | 'stewardId' | 'timestamp'>, onReward: (amount: number, reason: string) => void) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const validatedReading = SensorReadingSchema.parse(reading);
      const data: SensorReading = { ...validatedReading, id: Math.random().toString(36).substr(2, 9), stewardId: userId, timestamp: new Date().toISOString() } as SensorReading;
      await addDoc(collection(db, 'sensor_readings'), { ...data, createdAt: Timestamp.now() });
      if (data.sensorType === 'SOIL_MOISTURE' && data.value >= 40 && data.value <= 60) onReward(10, 'OPTIMAL_SOIL_MOISTURE_REWARD');
    } catch (e) {
      console.error('Error adding sensor reading:', e);
    }
  }

  public listenToReadings(onUpdate: (reading: SensorReading) => void) {
    const q = query(collection(db, 'sensor_readings'), orderBy('createdAt', 'desc'), limit(1));
    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => { if (change.type === 'added') onUpdate(change.doc.data() as SensorReading); });
    });
  }

  // --- Drone Telemetry (Consolidated from telemetryService) ---
  public onLiveReading(callback: (reading: DroneTelemetry) => void) {
    this.liveTelemetryListeners.push(callback);
    return () => { this.liveTelemetryListeners = this.liveTelemetryListeners.filter(cb => cb !== callback); };
  }

  public async addDroneReading(reading: Omit<DroneTelemetry, 'id' | 'stewardId' | 'timestamp'>) {
    const userId = auth.currentUser?.uid || 'demo-user';
    
    // Add missing fields for validation
    const telemetryToValidate = {
      ...reading,
      stewardId: userId,
      timestamp: new Date().toISOString()
    };
    
    if (!validateTelemetry(telemetryToValidate)) {
      console.error('Invalid telemetry data:', validateTelemetry.errors);
      return;
    }
    
    const data: DroneTelemetry = { ...telemetryToValidate, id: Math.random().toString(36).substr(2, 9) };
    this.telemetryBuffer.push(data);
    this.liveTelemetryListeners.forEach(cb => cb(data));
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flushBatch(), this.batchInterval);
    }
  }

  private async flushBatch() {
    if (this.telemetryBuffer.length === 0) return;
    const batch = [...this.telemetryBuffer];
    this.telemetryBuffer = [];
    this.batchTimer = null;
    const droneId = batch[0].droneId;
    const hash = btoa(JSON.stringify(batch)).slice(0, 32);
    const batchData: Omit<TelemetryBatch, 'id'> = { droneId, readings: batch, startTime: batch[0].timestamp, endTime: batch[batch.length - 1].timestamp, hash };
    try {
      await addDoc(collection(db, 'telemetry_batches'), { ...batchData, createdAt: Timestamp.now() });
    } catch (e) { console.error('Error flushing telemetry batch:', e); }
  }

  public listenToBatches(droneId: string, callback: (batches: TelemetryBatch[]) => void) {
    const q = query(collection(db, 'telemetry_batches'), where('droneId', '==', droneId), orderBy('createdAt', 'desc'), limit(10));
    return onSnapshot(q, (snapshot) => {
      const batches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TelemetryBatch[];
      callback(batches);
    });
  }

  // --- Device Commands (Consolidated from deviceService) ---
  public getDeviceStatusRef(deviceId: string) {
    return ref(rtdb, `devices/${deviceId}/status`);
  }

  public getDeviceCommandsRef(deviceId: string) {
    return ref(rtdb, `devices/${deviceId}/commands`);
  }

  public async sendDeviceCommand(deviceId: string, command: string) {
    try {
      const commandsRef = ref(rtdb, `devices/${deviceId}/commands`);
      await push(commandsRef, { command, timestamp: Date.now() });
    } catch (e) {
      console.error(`Error sending command to device ${deviceId}:`, e);
      throw e;
    }
  }

  // --- Drone Missions (Consolidated from droneService) ---
  public getDroneMissions(): DroneMission[] {
    return [ { id: 'DRN-M-01', droneIds: ['DRN-01', 'DRN-02'], zone: 'Zone A', path: [], status: 'IDLE', batteryThreshold: 20 } ];
  }

  public updateDroneMission(missionId: string, status: DroneMission['status']) {
    console.log(`Mission ${missionId} status updated to ${status}`);
  }

  public getDroneTelemetrySummary(missionId: string) {
    return [
      { time: '0s', battery: 100 }, { time: '10s', battery: 95 }, { time: '20s', battery: 90 }, { time: '30s', battery: 85 }, { time: '40s', battery: 80 },
    ];
  }
}

export const iotService = IoTSensorService.getInstance();
