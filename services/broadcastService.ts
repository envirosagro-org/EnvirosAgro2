import { 
  ref, 
  push, 
  set, 
  onValue, 
  off, 
  serverTimestamp as rtdbTimestamp,
  query as rtdbQuery,
  limitToLast
} from "firebase/database";
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { rtdb, storage, db, auth } from "./firebaseService";
import { BroadcastSession, BroadcastSegment, BroadcastComment } from "../types";
import { generateAlphanumericId } from "../systemFunctions";

export class BroadcastService {
  private mediaRecorder: MediaRecorder | null = null;
  private currentSessionId: string | null = null;
  private sequence = 0;

  public async startBroadcast(title: string, type: 'LIVE_STREAM' | 'PODCAST' | 'DRONE', stream: MediaStream): Promise<string> {
    try {
      const userId = auth.currentUser?.uid;
      const userName = auth.currentUser?.displayName || 'Steward';
      if (!userId) throw new Error("Authentication required");

      const sessionId = `BRC-${generateAlphanumericId(10)}`;
      this.currentSessionId = sessionId;
      this.sequence = 0;

      const sessionData: BroadcastSession = {
        id: sessionId,
        hostId: userId,
        hostName: userName,
        title,
        type,
        status: 'LIVE',
        startTime: new Date().toISOString(),
        listenerCount: 0,
      };

      // 1. Create session in Firestore
      await setDoc(doc(db, 'broadcasts', sessionId), sessionData);

      // 2. Initialize RTDB metadata
      const rtdbSessionRef = ref(rtdb, `broadcasts/${sessionId}`);
      await set(rtdbSessionRef, { 
        status: 'LIVE', 
        listenerCount: 0, 
        lastUpdate: rtdbTimestamp() 
      });

      // 3. Start Media Recording and Chunking
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      
      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await this.uploadSegment(event.data);
        }
      };

      // Chunk every 2 seconds for DRONE (low latency), 5 for others
      const interval = type === 'DRONE' ? 2000 : 5000;
      this.mediaRecorder.start(interval);

      return sessionId;
    } catch (error) {
      console.error("Error starting broadcast:", error);
      throw new Error("Failed to start broadcast");
    }
  }

  private async uploadSegment(blob: Blob) {
    if (!this.currentSessionId) return;
    const seq = this.sequence++;
    const segmentId = `SEG-${seq}`;
    const path = `broadcasts/${this.currentSessionId}/${segmentId}.webm`;
    const fileRef = storageRef(storage, path);

    try {
      // Upload to Storage
      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);

      // Record segment in RTDB for real-time sync
      const segmentsRef = ref(rtdb, `broadcast_segments/${this.currentSessionId}`);
      await push(segmentsRef, {
        id: segmentId,
        sequence: seq,
        storagePath: path,
        downloadUrl,
        timestamp: rtdbTimestamp()
      });

      // Also record in Firestore for permanent ledger
      const segmentData: BroadcastSegment = {
        id: segmentId,
        sessionId: this.currentSessionId,
        sequence: seq,
        storagePath: path,
        timestamp: new Date().toISOString(),
        duration: 5 // 5 second chunks
      };
      await addDoc(collection(db, `broadcasts/${this.currentSessionId}/segments`), segmentData);

    } catch (e) {
      console.error("Failed to upload broadcast segment:", e);
      // We don't throw here to avoid stopping the broadcast on a single segment failure
    }
  }

  public async stopBroadcast() {
    try {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
      if (this.currentSessionId) {
        await updateDoc(doc(db, 'broadcasts', this.currentSessionId), { 
          status: 'ENDED',
          endTime: new Date().toISOString()
        });
        await set(ref(rtdb, `broadcasts/${this.currentSessionId}/status`), 'ENDED');
        
        // Generate Proof of Broadcast (Mock for now, would be a hash of all segments)
        const finalHash = `POB-${generateAlphanumericId(32)}`;
        await updateDoc(doc(db, 'broadcasts', this.currentSessionId), { hash: finalHash });
        
        this.currentSessionId = null;
      }
    } catch (error) {
      console.error("Error stopping broadcast:", error);
      throw new Error("Failed to stop broadcast");
    }
  }

  public listenToSegments(sessionId: string, onNewSegment: (segment: any) => void) {
    try {
      const segmentsRef = rtdbQuery(ref(rtdb, `broadcast_segments/${sessionId}`), limitToLast(5));
      onValue(segmentsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const latestKey = Object.keys(data).sort().pop();
          if (latestKey) {
            onNewSegment(data[latestKey]);
          }
        }
      });
      return () => off(segmentsRef);
    } catch (error) {
      console.error("Error listening to segments:", error);
      // Cannot throw from event listener
      return () => {};
    }
  }

  public async sendComment(sessionId: string, text: string) {
    try {
      const userId = auth.currentUser?.uid;
      const userName = auth.currentUser?.displayName || 'Steward';
      if (!userId) throw new Error("Authentication required");

      const comment: BroadcastComment = {
        id: generateAlphanumericId(10),
        sessionId,
        authorId: userId,
        authorName: userName,
        text,
        timestamp: new Date().toISOString()
      };

      // RTDB for real-time
      const commentsRef = ref(rtdb, `broadcast_comments/${sessionId}`);
      await push(commentsRef, { ...comment, rtdbTimestamp: rtdbTimestamp() });

      // Firestore for history
      await addDoc(collection(db, `broadcasts/${sessionId}/comments`), comment);
    } catch (error) {
      console.error("Error sending comment:", error);
      throw new Error("Failed to send comment");
    }
  }

  public listenToComments(sessionId: string, onNewComment: (comment: any) => void) {
    try {
      const commentsRef = rtdbQuery(ref(rtdb, `broadcast_comments/${sessionId}`), limitToLast(10));
      onValue(commentsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const latestKey = Object.keys(data).sort().pop();
          if (latestKey) {
            onNewComment(data[latestKey]);
          }
        }
      });
      return () => off(commentsRef);
    } catch (error) {
      console.error("Error listening to comments:", error);
      // Cannot throw from event listener
      return () => {};
    }
  }
}

export const broadcastService = new BroadcastService();
