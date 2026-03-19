import { ref, onValue, set, onDisconnect, off } from 'firebase/database';
import { rtdb, auth } from './firebaseService';
import { SpatialTransform } from '../types';

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
}

export const spatialService = new SpatialService();
