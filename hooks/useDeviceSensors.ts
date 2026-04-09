import { useBattery, useNetworkState } from 'react-use';

export const useDeviceSensors = () => {
  const battery = useBattery();
  const network = useNetworkState();

  return {
    batteryLevel: battery.isSupported ? (battery as any).level : 1,
    isCharging: battery.isSupported ? (battery as any).charging : false,
    connectionType: network.effectiveType,
    isOnline: network.online,
  };
};
