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
  onSnapshot,
  updateDoc,
  arrayUnion
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

// --- UTILITIES ---
const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanObject);
  if (typeof obj !== 'object') return obj;
  
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined && val !== null) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        newObj[key] = cleanObject(val);
      } else {
        newObj[key] = val;
      }
    }
  });
  return newObj;
};

// --- AUTHENTICATION ---
export const onAuthStateChanged = (_: any, callback: (user: any) => void) => fbOnAuthStateChanged(auth, callback);
export const signInWithEmailAndPassword = async (_: any, email: string, pass: string) => fbSignIn(auth, email, pass);
export const createUserWithEmailAndPassword = async (_: any, email: string, pass: string) => fbCreateUser(auth, email, pass);
export const signInWithGoogle = async () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOutSteward = () => fbSignOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

// Fix: Added missing transmitRecoveryCode export for password recovery flow
export const transmitRecoveryCode = async (email: string) => {
  // Simulated recovery code transmission logic for the registry
  console.log(`Transmitting recovery code to ${email}`);
  return true;
};

// Fix: Added missing verifyRecoveryShard export for password recovery flow
export const verifyRecoveryShard = async (email: string, code: string) => {
  // Simulated shard verification logic for the registry
  console.log(`Verifying shard ${code} for ${email}`);
  return code.length === 6;
};

// Fix: Added missing setupRecaptcha export for phone auth flow
export const setupRecaptcha = (containerId: string) => {
  // Simulated recaptcha setup logic for secure node ingest
  console.log(`Setting up reCAPTCHA on ${containerId}`);
};

// Fix: Added missing requestPhoneCode export for phone auth flow
export const requestPhoneCode = async (phone: string) => {
  // Simulated phone code request logic for node synchronization
  console.log(`Requesting phone code for ${phone}`);
  return "mock-verification-id";
};

// --- SIGNAL TERMINAL CORE ---
export const dispatchNetworkSignal = async (signalData: Partial<SignalShard>): Promise<SignalShard | null> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const id = `SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  
  const layers: DispatchChannel[] = [];
  layers.push({ channel: 'INBOX', status: 'SENT', timestamp });
  
  if (signalData.priority === 'critical' || signalData.priority === 'high') {
    layers.push({ channel: 'POPUP', status: 'SENT', timestamp });
    layers.push({ channel: 'EMAIL', status: 'SENT', timestamp });
  } else if (signalData.type !== 'network') {
    layers.push({ channel: 'POPUP', status: 'SENT', timestamp });
  }

  let iconName = 'MessageSquare';
  if (typeof signalData.actionIcon === 'string') {
    iconName = signalData.actionIcon;
  }

  const rawSignal: any = {
    id,
    type: signalData.type || 'system',
    origin: signalData.origin || 'MANUAL',
    title: signalData.title || 'NETWORK_SIGNAL',
    message: signalData.message || 'No message provided.',
    timestamp,
    read: false,
    priority: signalData.priority || 'low',
    dispatchLayers: layers,
    stewardId: userId,
    actionIcon: iconName,
    aiRemark: signalData.aiRemark || "Analyzing signal impact on node m-constant...",
    meta: signalData.meta || {},
    actionLabel: signalData.actionLabel || ''
  };

  const cleanSignal = cleanObject(rawSignal);

  try {
    await setDoc(doc(db, "signals", id), cleanSignal);
    return cleanSignal as SignalShard;
  } catch (e) {
    return null;
  }
};

// --- REGISTRY SYNC (FIRESTORE) ---
export const syncUserToCloud = async (userData: AgroUser, uid?: string) => {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return false;
  try {
    const cleanUserData = cleanObject(userData);
    await setDoc(doc(db, "stewards", userId), { ...cleanUserData, lastSync: Date.now(), stewardId: userId }, { merge: true });
    return true;
  } catch (e) { return false; }
};

export const getStewardProfile = async (uid: string): Promise<AgroUser | null> => {
  const snap = await getDoc(doc(db, "stewards", uid));
  return snap.exists() ? snap.data() as AgroUser : null;
};

/**
 * Marks an action as permanent in the user's document
 */
export const markPermanentAction = async (actionKey: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return false;
  try {
    await updateDoc(doc(db, "stewards", userId), {
      completedActions: arrayUnion(actionKey)
    });
    return true;
  } catch (e) { return false; }
};

export const saveCollectionItem = async (collectionName: string, item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  const cleanItem = cleanObject(item);
  const data = { ...cleanItem, stewardId: userId, lastModified: Date.now() };
  const docRef = item.id ? doc(db, collectionName, item.id) : doc(collection(db, collectionName));
  await setDoc(docRef, data, { merge: true });
  return docRef.id;
};

export const listenToCollection = (collectionName: string, callback: (items: any[]) => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};
  const q = query(collection(db, collectionName), where("stewardId", "==", userId));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ ...d.data(), id: d.id }))), (err) => {
    console.warn(`Registry Sync Warning (${collectionName}):`, err.message);
  });
};

export const verifyAuditorAccess = async (email: string) => {
  const q = query(collection(db, "auditors"), where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
};

export const backupTelemetryShard = async (esin: string, telemetry: any) => {
  const cleanTelem = cleanObject(telemetry);
  return setDoc(doc(db, "telemetry", esin), { ...cleanTelem, updatedAt: Date.now() }, { merge: true });
};
export const fetchTelemetryBackup = async (esin: string) => (await getDoc(doc(db, "telemetry", esin))).data();