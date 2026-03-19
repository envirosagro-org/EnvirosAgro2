import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  addDoc, 
  getDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { db, auth } from "./firebaseService";
import { WebRTCCall, IceCandidate } from "../types";
import { handleFirestoreError, OperationType } from "./errorHandling";

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export class WebRTCService {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  constructor() {
    this.pc = new RTCPeerConnection(servers);
    this.remoteStream = new MediaStream();
  }

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

    // Listen for answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data() as WebRTCCall;
      if (this.pc && !this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    });

    // Listen for remote ICE candidates
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
    }
    
    try {
      await updateDoc(doc(db, 'calls', callId), { status: 'DISCONNECTED' });
    } catch (e) {
      // Ignore if already deleted or disconnected
    }
  }
}

export const webrtcService = new WebRTCService();
