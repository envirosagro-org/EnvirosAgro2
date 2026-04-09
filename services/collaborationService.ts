import { ref, onValue, set, off } from "firebase/database";
import { rtdb } from "./firebaseService";

export class CollaborationService {
  public listenToTopology(plotId: string, onUpdate: (data: any) => void) {
    try {
      const topologyRef = ref(rtdb, `topology/${plotId}`);
      onValue(topologyRef, (snapshot) => {
        onUpdate(snapshot.val());
      });
      return () => off(topologyRef);
    } catch (error) {
      console.error(`Error listening to topology for plot ${plotId}:`, error);
      // Cannot throw from event listener
      return () => {};
    }
  }

  public async updateTopology(plotId: string, data: any) {
    try {
      const topologyRef = ref(rtdb, `topology/${plotId}`);
      await set(topologyRef, data);
    } catch (error) {
      console.error(`Error updating topology for plot ${plotId}:`, error);
      throw new Error(`Failed to update topology for plot ${plotId}`);
    }
  }
}

export const collaborationService = new CollaborationService();
