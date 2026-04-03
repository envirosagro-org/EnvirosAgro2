import { useEffect } from 'react';
import { listenToCollection } from '../services/firebaseService';

export const useDataSync = (
  user: any,
  setters: { [key: string]: (data: any[]) => void },
  collections: { name: string, setter: string, isGlobal?: boolean }[]
) => {
  useEffect(() => {
    if (!user) return;

    const unsubs = collections.map(col => {
      return listenToCollection(col.name, setters[col.setter], col.isGlobal);
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [user, setters, collections]);
};
