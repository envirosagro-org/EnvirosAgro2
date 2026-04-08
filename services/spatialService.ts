import { ref, onValue, set, onDisconnect, off, update } from 'firebase/database';
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

  private robotPath = 'spatial_robots';

  private anchorPath = 'spatial_anchors';

  public async updateTransform(transform: Omit<SpatialTransform, 'lastUpdate'>, stewardId?: string) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const idToUse = stewardId || userId;
    const transformRef = ref(rtdb, `${this.userPath}/${idToUse}`);
    const data: SpatialTransform = {
      ...transform,
      lastUpdate: Date.now()
    };

    await set(transformRef, data);
    
    // Set up presence cleanup
    onDisconnect(transformRef).remove();
  }

  public async updateRobotTransform(robotId: string, transform: Omit<SpatialTransform, 'lastUpdate'>) {
    const transformRef = ref(rtdb, `${this.robotPath}/${robotId}`);
    const data: SpatialTransform = {
      ...transform,
      lastUpdate: Date.now()
    };

    await set(transformRef, data);
    onDisconnect(transformRef).remove();
  }

  public listenToUsers(callback: (users: Record<string, SpatialTransform>) => void) {
    const usersRef = ref(rtdb, this.userPath);
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });
  }

  public listenToRobots(callback: (robots: Record<string, SpatialTransform>) => void) {
    const robotsRef = ref(rtdb, this.robotPath);
    onValue(robotsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });
  }

  public async sendRobotCommand(robotId: string, command: string) {
    const commandRef = ref(rtdb, `spatial_robots_commands/${robotId}`);
    await set(commandRef, {
      command,
      timestamp: Date.now()
    });
    
    const transformRef = ref(rtdb, `${this.robotPath}/${robotId}`);
    await update(transformRef, { anim_state: command, lastUpdate: Date.now() });
  }

  public listenToARAnchors(stewardId: string, callback: (anchors: Record<string, any>) => void) {
    const anchorsRef = ref(rtdb, `${this.anchorPath}/${stewardId}`);
    onValue(anchorsRef, (snapshot) => {
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

  public async deletePlot(plotId: string) {
    const plotRef = doc(db, 'plots', plotId);
    await deleteDoc(plotRef);
  }

  public async saveAnchor(anchor: any) {
    const anchorsRef = collection(db, 'ar_anchors');
    const docRef = await addDoc(anchorsRef, anchor);
    return docRef.id;
  }
}

export const spatialService = new SpatialService();
