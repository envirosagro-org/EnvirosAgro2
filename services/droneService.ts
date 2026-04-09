import { DroneMission } from '../types';

export const getDroneMissions = (): DroneMission[] => {
  try {
    // Simulate fetching missions
    return [
      { id: 'DRN-M-01', droneIds: ['DRN-01', 'DRN-02'], zone: 'Zone A', path: [], status: 'IDLE', batteryThreshold: 20 },
    ];
  } catch (error) {
    console.error('Error fetching drone missions:', error);
    throw new Error('Failed to fetch drone missions');
  }
};

export const updateDroneMission = (missionId: string, status: DroneMission['status']) => {
  try {
    // Simulate updating mission
    console.log(`Mission ${missionId} status updated to ${status}`);
  } catch (error) {
    console.error(`Error updating mission ${missionId}:`, error);
    throw new Error(`Failed to update mission ${missionId}`);
  }
};

export const getDroneTelemetry = (missionId: string) => {
  try {
    // Simulate fetching telemetry
    return [
      { time: '0s', battery: 100 },
      { time: '10s', battery: 95 },
      { time: '20s', battery: 90 },
      { time: '30s', battery: 85 },
      { time: '40s', battery: 80 },
    ];
  } catch (error) {
    console.error(`Error fetching telemetry for mission ${missionId}:`, error);
    throw new Error(`Failed to fetch telemetry for mission ${missionId}`);
  }
};
