import { initializeApp, getApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendEmailVerification,
  reload
} from "firebase/auth";
import { 
  getFirestore,
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
  arrayUnion,
  writeBatch
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  set, 
  limitToLast, 
  query as rtdbQuery,
  serverTimestamp as rtdbTimestamp,
  off
} from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { User as AgroUser, SignalShard, DispatchChannel } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyD2OCiMVOxaXWOBD3p4_mJp7TDJVwPpiNM",
  authDomain: "envirosagro.org",
  databaseURL: "https://envirosagro2git-41536716-7747d-default-rtdb.firebaseio.com",
  projectId: "envirosagro2git-41536716-7747d",
  storageBucket: "envirosagro2git-41536716-7747d.firebasestorage.app",
  messagingSenderId: "218810534057",
  appId: "1:218810534057:web:2d32abbb459755499fc1b8"
};

// 1. Initialize Firebase App Core
const app = initializeApp(firebaseConfig);

// 2. Initialize App Check with safety flag to prevent re-initialization error
if (typeof window !== "undefined") {
  const RECAPTCHA_SITE_KEY = "6LeljyIsAAAAAKer8_fHinQBO5eO8WlqXPbpdAh5";
  
  // Use a global flag to check if App Check is already active
  if (!(window as any).FIREBASE_APPCHECK_INITIALIZED) {
    try {
      // Enable debug token for local development environments if needed
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
      (window as any).FIREBASE_APPCHECK_INITIALIZED = true;
    } catch (err) {
      console.warn("App Check initialization skipped or failed:", err);
    }
  }
}

// 3. Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
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

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Ensure the provider prompts for account selection to prevent "hanging" with a single silent account attempt
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
};

export const signOutSteward = () => fbSignOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

// Email Verification
export const sendVerificationShard = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
    return true;
  }
  return false;
};

export const refreshAuthUser = async () => {
  if (auth.currentUser) {
    await reload(auth.currentUser);
    return auth.currentUser;
  }
  return null;
};

// --- PHONE AUTH ---
export const setupRecaptcha = (containerId: string) => {
  if (typeof window === "undefined") return null;
  
  // Clean up any existing instances associated with the container if possible
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }

  try {
    const verifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': () => {
        console.log("Recaptcha solved successfully.");
      },
      'expired-callback': () => {
        console.warn("Recaptcha expired. Please refresh.");
      }
    });
    return verifier;
  } catch(e) {
    console.error("Recaptcha setup error:", e);
    return null;
  }
};

export const requestPhoneCode = async (phone: string, appVerifier: any): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phone, appVerifier);
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
    actionIcon: signalData.actionIcon || 'MessageSquare',
    aiRemark: signalData.aiRemark || "Analyzing signal impact...",
    meta: signalData.meta || {},
    actionLabel: signalData.actionLabel || ''
  };

  const cleanSignal = cleanObject(rawSignal);

  try {
    await setDoc(doc(db, "signals", id), cleanSignal);
    
    // Low-latency pulse broadcast
    const pulseRef = ref(rtdb, 'network_pulse');
    await push(pulseRef, {
      message: `${rawSignal.title}: ${rawSignal.message}`,
      timestamp: rtdbTimestamp()
    });

    return cleanSignal as SignalShard;
  } catch (e) {
    return null;
  }
};

export const updateSignalReadStatus = async (id: string, read: boolean) => {
  try {
    await updateDoc(doc(db, "signals", id), { read });
    return true;
  } catch (e) {
    return false;
  }
};

export const markAllSignalsAsReadInDb = async (signalIds: string[]) => {
  if (signalIds.length === 0) return true;
  try {
    const batch = writeBatch(db);
    signalIds.forEach(id => {
      batch.update(doc(db, "signals", id), { read: true });
    });
    await batch.commit();
    return true;
  } catch (e) {
    return false;
  }
};

export const listenToPulse = (callback: (pulse: string) => void) => {
  const pulseRef = rtdbQuery(ref(rtdb, 'network_pulse'), limitToLast(1));
  onValue(pulseRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const latestKey = Object.keys(data)[0];
      callback(data[latestKey].message);
    }
  });
  return () => off(pulseRef);
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
export const fetchTelemetryBackup = async (esin: string) => {
  const snap = await getDoc(doc(db, "telemetry", esin));
  return snap.exists() ? snap.data() : null;
};
