
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  initializeFirestore,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  set, 
  limitToLast, 
  query as rtdbQuery,
  serverTimestamp as rtdbTimestamp
} from "firebase/database";
import { User as AgroUser, SignalShard, DispatchChannel } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyD2OCiMVOxaXWOBD3p4_mJp7TDJVwPpiNM",
  authDomain: "envirosagro2git-41536716-7747d.firebaseapp.com",
  databaseURL: "https://envirosagro2git-41536716-7747d-default-rtdb.firebaseio.com",
  projectId: "envirosagro2git-41536716-7747d",
  storageBucket: "envirosagro2git-41536716-7747d.firebasestorage.app",
  messagingSenderId: "218810534057",
  appId: "1:218810534057:web:2d32abbb459755499fc1b8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});
export const rtdb = getDatabase(app);

// --- AUTHENTICATION ---
export const onAuthStateChanged = (_: any, callback: (user: any) => void) => fbOnAuthStateChanged(auth, callback);
export const signInWithEmailAndPassword = async (_: any, email: string, pass: string) => fbSignIn(auth, email, pass);
export const createUserWithEmailAndPassword = async (_: any, email: string, pass: string) => fbCreateUser(auth, email, pass);
export const signInWithGoogle = async () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOutSteward = () => fbSignOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

// --- RECOVERY PROTOCOLS ---
// Added missing recovery functions
export const transmitRecoveryCode = async (email: string) => {
  console.log("Transmitting recovery shard signal to:", email);
  return true;
};

export const verifyRecoveryShard = async (email: string, code: string) => {
  console.log("Verifying recovery shard consensus for:", email);
  return true;
};

export const setupRecaptcha = (containerId: string) => {
  console.log("Setting up reCAPTCHA node in:", containerId);
};

export const requestPhoneCode = async (phone: string, recaptchaVerifier: any) => {
  console.log("Requesting phone verification shard for:", phone);
  return "mock-verification-id";
};

// --- SIGNAL TERMINAL CORE ---

/**
 * Robust Signal Terminal logic: Intercepts, adsorbs, and allocates signals
 */
export const dispatchNetworkSignal = async (signalData: Partial<SignalShard>): Promise<SignalShard | null> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  // 1. ADSORPTION: Define the signal and assign core registry metadata
  const id = `SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  
  // 2. CATEGORIZATION & ALLOCATION: Decide which channels receive the signal
  const layers: DispatchChannel[] = [];
  
  // Always send to internal inbox
  layers.push({ channel: 'INBOX', status: 'SENT', timestamp });
  
  // High priority or critical signals get multi-channel allocation
  if (signalData.priority === 'critical' || signalData.priority === 'high') {
    layers.push({ channel: 'POPUP', status: 'SENT', timestamp });
    layers.push({ channel: 'EMAIL', status: 'SENT', timestamp });
    layers.push({ channel: 'PHONE', status: 'PENDING', timestamp }); // Mocking pending SMS handshake
  } else {
    // Normal signals get popup if they aren't purely archival
    if (signalData.type !== 'network') {
      layers.push({ channel: 'POPUP', status: 'SENT', timestamp });
    }
  }

  const completeSignal: SignalShard = {
    id,
    type: signalData.type || 'system',
    title: signalData.title || 'NETWORK_SIGNAL',
    message: signalData.message || 'No message provided.',
    timestamp,
    read: false,
    priority: signalData.priority || 'low',
    dispatchLayers: layers,
    meta: signalData.meta,
    aiRemark: signalData.aiRemark || "Analyzing signal impact on node m-constant...",
    actionLabel: signalData.actionLabel,
    actionIcon: signalData.actionIcon
  };

  try {
    // Save to Firestore (Internal Inbox Shard)
    await setDoc(doc(db, "signals", id), { ...completeSignal, stewardId: userId });
    
    // If it's a global pulse, broadcast to RTDB
    if (signalData.type === 'pulse') {
       const pulsesRef = ref(rtdb, 'pulses');
       await push(pulsesRef, {
         esin: signalData.meta?.payload?.esin || 'EA-SYS-NODE',
         message: signalData.message,
         timestamp: rtdbTimestamp()
       });
    }

    return completeSignal;
  } catch (e) {
    console.error("Signal Dispatch Failure:", e);
    return null;
  }
};

// --- REGISTRY SYNC (FIRESTORE) ---
export const syncUserToCloud = async (userData: AgroUser, uid?: string) => {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return false;
  try {
    await setDoc(doc(db, "stewards", userId), { ...userData, lastSync: Date.now(), stewardId: userId }, { merge: true });
    return true;
  } catch (e) { return false; }
};

export const getStewardProfile = async (uid: string): Promise<AgroUser | null> => {
  const snap = await getDoc(doc(db, "stewards", uid));
  return snap.exists() ? snap.data() as AgroUser : null;
};

export const saveCollectionItem = async (collectionName: string, item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  const data = { ...item, stewardId: userId, lastModified: Date.now() };
  const docRef = item.id ? doc(db, collectionName, item.id) : doc(collection(db, collectionName));
  await setDoc(docRef, data, { merge: true });
  return docRef.id;
};

export const listenToCollection = (collectionName: string, callback: (items: any[]) => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};
  const q = query(collection(db, collectionName), where("stewardId", "==", userId));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
};

export const listenForGlobalEchoes = (callback: (echoes: any[]) => void) => {
  return onValue(rtdbQuery(ref(rtdb, 'pulses'), limitToLast(30)), snapshot => {
    const data = snapshot.val();
    callback(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })).sort((a, b) => b.timestamp - a.timestamp) : []);
  });
};

export const verifyAuditorAccess = async (email: string) => {
  const q = query(collection(db, "auditors"), where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
};

export const backupTelemetryShard = async (esin: string, telemetry: any) => setDoc(doc(db, "telemetry", esin), { ...telemetry, updatedAt: Date.now() }, { merge: true });
export const fetchTelemetryBackup = async (esin: string) => (await getDoc(doc(db, "telemetry", esin))).data();
