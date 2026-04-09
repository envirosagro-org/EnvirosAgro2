import { collection, addDoc, Timestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebaseService';
import { SensorReading } from '../types';
import { z } from 'zod';

const SensorReadingSchema = z.object({
  sensorType: z.string(),
  value: z.number(),
  unit: z.string(),
});

class IoTSensorService {
  private simulationInterval: NodeJS.Timeout | null = null;

  public startSimulation(onReward: (amount: number, reason: string) => void) {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      const mockReading = {
        sensorType: 'SOIL_MOISTURE' as const,
        value: Math.floor(Math.random() * 100),
        unit: '%'
      };
      this.addReading(mockReading, onReward);
    }, 5000);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public async addReading(reading: Omit<SensorReading, 'id' | 'stewardId' | 'timestamp'>, onReward: (amount: number, reason: string) => void) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Validate incoming reading data
      const validatedReading = SensorReadingSchema.parse(reading);

      const data: SensorReading = {
        ...validatedReading,
        id: Math.random().toString(36).substr(2, 9),
        stewardId: userId,
        timestamp: new Date().toISOString()
      } as SensorReading;

      await addDoc(collection(db, 'sensor_readings'), {
        ...data,
        createdAt: Timestamp.now()
      });
      
      this.processReading(data, onReward);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error('Validation error adding sensor reading:', (error as any).errors);
      } else {
        console.error('Error adding sensor reading:', error);
      }
      throw new Error('Failed to add sensor reading');
    }
  }

  public listenToReadings(onUpdate: (reading: SensorReading) => void) {
    try {
      const q = query(collection(db, 'sensor_readings'), orderBy('createdAt', 'desc'), limit(1));
      return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            onUpdate(change.doc.data() as SensorReading);
          }
        });
      }, (error) => {
        console.error('Error listening to sensor readings:', error);
      });
    } catch (error) {
      console.error('Error setting up sensor reading listener:', error);
      return () => {};
    }
  }

  private processReading(reading: SensorReading, onReward: (amount: number, reason: string) => void) {
    // Reward logic: If soil moisture is optimal (e.g., 40-60%), reward EAC
    if (reading.sensorType === 'SOIL_MOISTURE' && reading.value >= 40 && reading.value <= 60) {
      console.log('Optimal soil moisture detected! Triggering reward...');
      onReward(10, 'OPTIMAL_SOIL_MOISTURE_REWARD');
    }
  }
}

export const iotService = new IoTSensorService();
