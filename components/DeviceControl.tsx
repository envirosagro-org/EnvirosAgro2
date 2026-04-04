import React, { useState, useEffect } from 'react';
import { rtdb } from '../src/firebase';
import { ref, onValue, set, push } from 'firebase/database';
import { SEO } from './SEO';

interface DeviceControlProps {
  deviceId: string;
}

export const DeviceControl: React.FC<DeviceControlProps> = ({ deviceId }) => {
  const [status, setStatus] = useState<string>('Loading...');
  const [command, setCommand] = useState('');

  useEffect(() => {
    const statusRef = ref(rtdb, `devices/${deviceId}/status`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      setStatus(snapshot.val() || 'Offline');
    });
    return () => unsubscribe();
  }, [deviceId]);

  const sendCommand = async () => {
    const commandsRef = ref(rtdb, `devices/${deviceId}/commands`);
    await push(commandsRef, {
      command,
      timestamp: Date.now(),
    });
    setCommand('');
  };

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <SEO title="Device Control" description="EnvirosAgro Device Control: Monitor and send commands to your agricultural devices." />
      <h2 className="text-lg font-semibold">Device: {deviceId}</h2>
      <p>Status: <span className="font-bold">{status}</span></p>
      <div className="flex gap-2">
        <input 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command"
          className="flex-1 p-2 border rounded-lg"
        />
        <button 
          onClick={sendCommand}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DeviceControl;
