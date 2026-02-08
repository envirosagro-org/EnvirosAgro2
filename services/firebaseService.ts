
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
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
  limit, 
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc
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
import { User as AgroUser } from "../types";

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

/** 
 * Refined Firestore Initialization:
 * Using experimentalForceLongPolling and disabling fetch streams to resolve 
 * connectivity errors in restricted or high-latency network environments.
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

export const rtdb = getDatabase(app);

// --- AUTHENTICATION ---
export const onAuthStateChanged = (_: any, callback: (user: any) => void) => {
  return fbOnAuthStateChanged(auth, callback);
};

export const signInWithEmailAndPassword = async (_: any, email: string, pass: string) => {
  return fbSignIn(auth, email, pass);
};

export const createUserWithEmailAndPassword = async (_: any, email: string, pass: string) => {
  return fbCreateUser(auth, email, pass);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const setupRecaptcha = (containerId: string) => {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    });
  }
  return (window as any).recaptchaVerifier;
};

export const requestPhoneCode = async (phone: string, verifier: RecaptchaVerifier) => {
  return signInWithPhoneNumber(auth, phone, verifier);
};

export const signOutSteward = () => fbSignOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

/**
 * Transmits a 6-digit recovery shard code to the user email.
 */
export const transmitRecoveryCode = async (email: string) => {
  try {
    const q = query(collection(db, "stewards"), where("email", "==", email.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("EMAIL_NOT_FOUND");

    const shardCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const recoveryRef = doc(db, "recovery_shards", email.toLowerCase());
    await setDoc(recoveryRef, {
      code: shardCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + (1000 * 60 * 15)
    });

    console.log(`[NETWORK_SIGNAL] Recovery Shard ${shardCode} transmitted to ${email}`);
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (e: any) {
    throw e;
  }
};

export const verifyRecoveryShard = async (email: string, code: string) => {
  try {
    const recoveryRef = doc(db, "recovery_shards", email.toLowerCase());
    const snap = await getDoc(recoveryRef);
    if (!snap.exists()) return false;
    const data = snap.data();
    if (Date.now() > data.expiresAt) return false;
    return data.code === code;
  } catch (e) {
    return false;
  }
};

export const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

// --- REGISTRY SYNC (FIRESTORE) ---

export const syncUserToCloud = async (userData: AgroUser, uid?: string) => {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return false;
  try {
    const stewardRef = doc(db, "stewards", userId);
    await setDoc(stewardRef, { 
      ...userData, 
      lastSync: Date.now(),
      stewardId: userId
    }, { merge: true });
    return true;
  } catch (e) {
    console.error("Registry Sync Error:", e);
    return false;
  }
};

export const getStewardProfile = async (uid: string): Promise<AgroUser | null> => {
  try {
    const snap = await getDoc(doc(db, "stewards", uid));
    return snap.exists() ? snap.data() as AgroUser : null;
  } catch (e) { return null; }
};

export const saveCollectionItem = async (collectionName: string, item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  try {
    const data = { 
      ...item, 
      stewardId: userId, 
      stewardEsin: item.stewardEsin || null,
      lastModified: Date.now() 
    };
    if (item.id) {
      await setDoc(doc(db, collectionName, item.id), data, { merge: true });
      return item.id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    }
  } catch (e) { return null; }
};

export const fetchCollection = async (collectionName: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];
  try {
    const q = query(collection(db, collectionName), where("stewardId", "==", userId), orderBy("lastModified", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch (e) { return []; }
};

export const listenToCollection = (collectionName: string, callback: (items: any[]) => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};
  
  const q = query(collection(db, collectionName), where("stewardId", "==", userId));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    callback(items);
  }, (err) => console.error(`Listener error [${collectionName}]:`, err));
};

// --- REALTIME NETWORK ECHOES (RTDB) ---

export const broadcastPulse = async (esin: string, message: string) => {
  try {
    const pulsesRef = ref(rtdb, 'pulses');
    const newPulseRef = push(pulsesRef);
    await set(newPulseRef, {
      esin,
      message,
      timestamp: rtdbTimestamp()
    });
    return true;
  } catch (e) { return false; }
};

export const listenForGlobalEchoes = (callback: (echoes: any[]) => void) => {
  const pulsesRef = rtdbQuery(ref(rtdb, 'pulses'), limitToLast(30));
  return onValue(pulsesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.entries(data).map(([id, val]: [string, any]) => ({
        id, ...val
      })).sort((a, b) => b.timestamp - a.timestamp);
      callback(list);
    } else {
      callback([]);
    }
  });
};

// --- TELEMETRY & AUDIT ---

export const backupTelemetryShard = async (esin: string, telemetry: any) => {
  try {
    await setDoc(doc(db, "telemetry", esin), { ...telemetry, updatedAt: Date.now() }, { merge: true });
  } catch (e) {}
};

export const fetchTelemetryBackup = async (esin: string): Promise<any> => {
  try {
    const snap = await getDoc(doc(db, "telemetry", esin));
    return snap.exists() ? snap.data() : null;
  } catch (e) { return null; }
};

export const verifyAuditorAccess = async (email: string) => {
  try {
    const q = query(collection(db, "auditors"), where("email", "==", email));
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (e) { return false; }
};
