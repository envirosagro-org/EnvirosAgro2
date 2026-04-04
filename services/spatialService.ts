import { ref, onValue, set, onDisconnect, off } from 'firebase/database';
import { rtdb, auth, db } from './firebaseService';
import { SpatialTransform } from '../types';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

export interface Plot {
  id?: string;
  stewardId: string;
  name: string;
  geometry: any; // GeoJSON
  deviceId?: string;
}

class SpatialService {
  private userPath = 'spatial_users';

  public async updateTransform(transform: Omit<SpatialTransform, 'lastUpdate'>) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const transformRef = ref(rtdb, `${this.userPath}/${userId}`);
    const data: SpatialTransform = {
      ...transform,
      lastUpdate: Date.now()
    };

    await set(transformRef, data);
    
    // Set up presence cleanup
    onDisconnect(transformRef).remove();
  }

  public listenToUsers(callback: (users: Record<string, SpatialTransform>) => void) {
    const usersRef = ref(rtdb, this.userPath);
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });
  }

  public stopListening() {
    const usersRef = ref(rtdb, this.userPath);
    off(usersRef);
  }

  // Plot Management
  public async savePlot(plot: Plot) {
    const plotsRef = collection(db, 'plots');
    if (plot.id) {
      const plotRef = doc(db, 'plots', plot.id);
      await updateDoc(plotRef, { ...plot });
      return plot.id;
    } else {
      const docRef = await addDoc(plotsRef, plot);
      return docRef.id;
    }
  }

  public async getPlots(stewardId: string) {
    const q = query(collection(db, 'plots'), where('stewardId', '==', stewardId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plot));
  }
}

export const spatialService = new SpatialService();
