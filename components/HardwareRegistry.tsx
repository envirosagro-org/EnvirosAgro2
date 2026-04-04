import React, { useState } from 'react';
import { toast } from 'sonner';
import { db, auth } from '../src/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SEO } from './SEO';

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
      toast.success('Hardware registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Check node connection.');
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <SEO title="Hardware Registry" description="EnvirosAgro Hardware Registry: Register and manage your agricultural hardware devices." />
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
