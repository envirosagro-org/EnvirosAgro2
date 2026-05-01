import React, { useState, useEffect } from 'react';
import { iotService } from '../services/iotService';
import { onValue, push } from 'firebase/database';
import { SEO } from './SEO';
import { Toggle } from './ui/Toggle';

interface DeviceControlProps {
  deviceId: string;
}

export const DeviceControl: React.FC<DeviceControlProps> = ({ deviceId }) => {
  const [status, setStatus] = useState<string>('Loading...');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [command, setCommand] = useState('');

  useEffect(() => {
    const statusRef = iotService.getDeviceStatusRef(deviceId);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const val = snapshot.val();
      setStatus(val || 'Offline');
      setIsActive(val === 'Active');
    });
    return () => unsubscribe();
  }, [deviceId]);

  const handleToggle = (enabled: boolean) => {
    setIsActive(enabled);
    iotService.sendDeviceCommand(deviceId, enabled ? 'START_DEVICE' : 'STOP_DEVICE');
  };

  const sendCommand = async () => {
    await iotService.sendDeviceCommand(deviceId, command);
    setCommand('');
  };

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <SEO title="Device Control" description="EnvirosAgro Device Control: Monitor and send commands to your agricultural devices." />
      <h2 className="text-lg font-semibold">Device: {deviceId}</h2>
      <div className="flex items-center justify-between">
        <p>Status: <span className="font-bold">{status}</span></p>
        <Toggle enabled={isActive} onToggle={handleToggle} />
      </div>
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
