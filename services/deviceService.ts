import { rtdb } from '../src/firebase';
import { ref, push } from 'firebase/database';

export const sendDeviceCommand = async (deviceId: string, command: string) => {
  const commandsRef = ref(rtdb, `devices/${deviceId}/commands`);
  await push(commandsRef, {
    command,
    timestamp: Date.now(),
  });
};
