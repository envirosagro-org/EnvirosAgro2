import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebaseService';
import { SensorReading } from '../types';

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
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const data: SensorReading = {
      ...reading,
      id: Math.random().toString(36).substr(2, 9),
      stewardId: userId,
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'sensor_readings'), {
        ...data,
        createdAt: Timestamp.now()
      });
      
      this.processReading(data, onReward);
    } catch (error) {
      console.error('Error adding sensor reading:', error);
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
