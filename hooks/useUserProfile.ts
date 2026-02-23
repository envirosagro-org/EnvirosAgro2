
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebaseService';
import { syncFarmOSTelemetry } from '../systemFunctions';
import { User } from '../types';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nodeData, setNodeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateUpdate = async () => {
    if (!auth.currentUser) return;
    setSimulating(true);
    setError(null);
    
    const nodeId = `FARM-NODE-${auth.currentUser.uid.substring(0, 10)}`;
    const simulatedTelemetry = {
        x: 5, r: 1.2, n: 4, dn: 8, In: 7, s: 3
    };

    try {
      await syncFarmOSTelemetry(nodeId, simulatedTelemetry);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUser(doc.data() as User);
      } else {
        setError('User profile not found.');
      }
    });

    const nodeId = `FARM-NODE-${auth.currentUser.uid.substring(0, 10)}`;
    const nodeRef = doc(db, 'nodes', nodeId);

    const unsubscribeNode = onSnapshot(nodeRef, (doc) => {
      if (doc.exists()) {
        setNodeData(doc.data());
        setError(null);
      } else {
        handleSimulateUpdate();
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching node data:", err);
      setError('Failed to load sustainability data.');
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribeNode();
    }
  }, []);

  return {
    user,
    nodeData,
    loading,
    simulating,
    error,
    handleSimulateUpdate,
  };
};
