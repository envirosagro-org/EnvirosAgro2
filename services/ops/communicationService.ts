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
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { rtdb, storage, db, auth } from "../core/firebaseService";
import { BroadcastSession, BroadcastSegment, BroadcastComment, WebRTCCall } from "../../types";
import { generateAlphanumericId } from "../../systemFunctions";
import { handleFirestoreError, OperationType } from "../system/errorHandling";

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export class CommunicationService {
  private static instance: CommunicationService;
  
  // Broadcast State
  private mediaRecorder: MediaRecorder | null = null;
  private currentSessionId: string | null = null;
  private sequence = 0;

  // WebRTC State
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  private constructor() {
    this.pc = new RTCPeerConnection(servers);
    this.remoteStream = new MediaStream();
  }

  public static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
  }

  // --- BROADCAST METHODS ---

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

      await setDoc(doc(db, 'broadcasts', sessionId), sessionData);

      const rtdbSessionRef = ref(rtdb, `broadcasts/${sessionId}`);
      await set(rtdbSessionRef, { 
        status: 'LIVE', 
        listenerCount: 0, 
        lastUpdate: rtdbTimestamp() 
      });

      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      
      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await this.uploadSegment(event.data);
        }
      };

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
      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);

      const segmentsRef = ref(rtdb, `broadcast_segments/${this.currentSessionId}`);
      await push(segmentsRef, {
        id: segmentId,
        sequence: seq,
        storagePath: path,
        downloadUrl,
        timestamp: rtdbTimestamp()
      });

      const segmentData: BroadcastSegment = {
        id: segmentId,
        sessionId: this.currentSessionId,
        sequence: seq,
        storagePath: path,
        timestamp: new Date().toISOString(),
        duration: 5 
      };
      await addDoc(collection(db, `broadcasts/${this.currentSessionId}/segments`), segmentData);

    } catch (e) {
      console.error("Failed to upload broadcast segment:", e);
    }
  }

  public async stopBroadcast() {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      if (this.currentSessionId) {
        await updateDoc(doc(db, 'broadcasts', this.currentSessionId), { 
          status: 'ENDED',
          endTime: new Date().toISOString()
        });
        await set(ref(rtdb, `broadcasts/${this.currentSessionId}/status`), 'ENDED');
        
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
      return () => {};
    }
  }

  public async sendBroadcastComment(sessionId: string, text: string) {
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

      const commentsRef = ref(rtdb, `broadcast_comments/${sessionId}`);
      await push(commentsRef, { ...comment, rtdbTimestamp: rtdbTimestamp() });

      await addDoc(collection(db, `broadcasts/${sessionId}/comments`), comment);
    } catch (error) {
      console.error("Error sending comment:", error);
      throw new Error("Failed to send comment");
    }
  }

  public listenToBroadcastComments(sessionId: string, onNewComment: (comment: any) => void) {
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
      return () => {};
    }
  }

  // --- WebRTC (P2P) METHODS ---

  public getRemoteStream() {
    return this.remoteStream;
  }

  public async startLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localStream.getTracks().forEach((track) => {
      if (this.pc && this.localStream) {
        this.pc.addTrack(track, this.localStream);
      }
    });
    return this.localStream;
  }

  public async createCall(calleeId: string, calleeName: string, callerName: string): Promise<string> {
    if (!this.pc) throw new Error("PeerConnection not initialized");
    const callerId = auth.currentUser?.uid;
    if (!callerId) throw new Error("User not authenticated");

    const callDoc = doc(collection(db, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    const callData: WebRTCCall = {
      id: callDoc.id,
      callerId,
      callerName,
      calleeId,
      calleeName,
      status: 'OFFERING',
      offer: {
        type: offerDescription.type,
        sdp: offerDescription.sdp,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await setDoc(callDoc, callData);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `calls/${callDoc.id}`);
    }

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data() as WebRTCCall;
      if (this.pc && !this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const candidate = new RTCIceCandidate(data);
          this.pc?.addIceCandidate(candidate);
        }
      });
    });

    return callDoc.id;
  }

  public async answerCall(callId: string) {
    if (!this.pc) throw new Error("PeerConnection not initialized");
    
    const callDoc = doc(db, 'calls', callId);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callSnap = await getDoc(callDoc);
    const callData = callSnap.data() as WebRTCCall;

    const offerDescription = callData.offer;
    await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    try {
      await updateDoc(callDoc, { answer, status: 'ANSWERING' });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `calls/${callId}`);
    }

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          this.pc?.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  public onRemoteStream(callback: (stream: MediaStream) => void) {
    if (!this.pc) return;
    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track);
      });
      if (this.remoteStream) callback(this.remoteStream);
    };
  }

  public async hangup(callId: string) {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.pc) {
      this.pc.close();
      // Re-initialize for next call
      this.pc = new RTCPeerConnection(servers);
      this.remoteStream = new MediaStream();
    }
    
    try {
      await updateDoc(doc(db, 'calls', callId), { status: 'DISCONNECTED' });
    } catch (e) {
      // Ignore if already deleted or disconnected
    }
  }

  // --- COLLABORATION METHODS ---

  public listenToSharedTopology(plotId: string, onUpdate: (data: any) => void) {
    try {
      const topologyRef = ref(rtdb, `topology/${plotId}`);
      onValue(topologyRef, (snapshot) => {
        onUpdate(snapshot.val());
      });
      return () => off(topologyRef);
    } catch (error) {
      console.error(`Error listening to topology for plot ${plotId}:`, error);
      return () => {};
    }
  }

  public async updateSharedTopology(plotId: string, data: any) {
    try {
      const topologyRef = ref(rtdb, `topology/${plotId}`);
      await set(topologyRef, data);
    } catch (error) {
      console.error(`Error updating topology for plot ${plotId}:`, error);
      throw new Error(`Failed to update topology for plot ${plotId}`);
    }
  }
}

export const communicationService = CommunicationService.getInstance();
