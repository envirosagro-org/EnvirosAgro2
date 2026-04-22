import { collection, addDoc, query, where, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { db, auth } from './firebaseService';
import { DroneTelemetry, TelemetryBatch } from '../types';

class TelemetryService {
  private telemetryBuffer: DroneTelemetry[] = [];
  private batchInterval = 60000; // 1 minute
  private timer: NodeJS.Timeout | null = null;
  private listeners: ((reading: DroneTelemetry) => void)[] = [];

  public onLiveReading(callback: (reading: DroneTelemetry) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public async addReading(reading: Omit<DroneTelemetry, 'id' | 'stewardId' | 'timestamp'>) {
    const userId = auth.currentUser?.uid;
    // We can still process even without userId for demo purposes, 
    // but the backend requires it. Let's provide a fallback for demo:
    const finalUserId = userId || 'demo-user';

    const data: DroneTelemetry = {
      ...reading,
      id: Math.random().toString(36).substr(2, 9),
      stewardId: finalUserId,
      timestamp: new Date().toISOString()
    };

    this.telemetryBuffer.push(data);
    this.listeners.forEach(cb => cb(data));

    if (!this.timer) {
      this.timer = setTimeout(() => this.flushBatch(), this.batchInterval);
    }
  }

  private async flushBatch() {
    if (this.telemetryBuffer.length === 0) return;

    const batch = [...this.telemetryBuffer];
    this.telemetryBuffer = [];
    this.timer = null;

    const droneId = batch[0].droneId;
    const startTime = batch[0].timestamp;
    const endTime = batch[batch.length - 1].timestamp;

    // Mock hash for blockchain verification
    const hash = btoa(JSON.stringify(batch)).slice(0, 32);

    const batchData: Omit<TelemetryBatch, 'id'> = {
      droneId,
      readings: batch,
      startTime,
      endTime,
      hash
    };

    try {
      await addDoc(collection(db, 'telemetry_batches'), {
        ...batchData,
        createdAt: Timestamp.now()
      });
      console.log(`Flushed batch of ${batch.length} readings for drone ${droneId}`);
    } catch (error) {
      console.error('Error flushing telemetry batch:', error);
    }
  }

  public listenToBatches(droneId: string, callback: (batches: TelemetryBatch[]) => void) {
    const q = query(
      collection(db, 'telemetry_batches'),
      where('droneId', '==', droneId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const batches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TelemetryBatch[];
      callback(batches);
    });
  }
}

export const telemetryService = new TelemetryService();
