import React, { useState } from 'react';
import { db, auth } from '../src/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const HardwareRegistry: React.FC = () => {
  const [deviceId, setDeviceId] = useState('');

  const registerHardware = async () => {
    if (!auth.currentUser) return;
    try {
      const devicesRef = collection(db, 'devices');
      await addDoc(devicesRef, {
        deviceId,
        ownerUid: auth.currentUser.uid,
        protocol: 'CAN',
        status: 'Registered',
        registeredAt: serverTimestamp(),
      });
      alert('Hardware registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <h2 className="text-lg font-semibold">Hardware Registry</h2>
      <input 
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        placeholder="Enter Device ID"
        className="block w-full p-2 border rounded-lg"
      />
      <button 
        onClick={registerHardware}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Register Hardware
      </button>
    </div>
  );
};

export default HardwareRegistry;
