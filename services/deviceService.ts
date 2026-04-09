import { rtdb } from '../src/firebase';
import { ref, push } from 'firebase/database';

export const sendDeviceCommand = async (deviceId: string, command: string) => {
  try {
    const commandsRef = ref(rtdb, `devices/${deviceId}/commands`);
    await push(commandsRef, {
      command,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(`Error sending command to device ${deviceId}:`, error);
    throw new Error(`Failed to send command to device ${deviceId}`);
  }
};
