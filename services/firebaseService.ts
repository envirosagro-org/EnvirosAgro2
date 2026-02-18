
import { initializeApp } from "firebase/app";
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
  query, 
  where, 
  getDocs, 
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
  limitToLast, 
  query as rtdbQuery,
  serverTimestamp as rtdbTimestamp,
  off,
  set
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

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  // CRITICAL: Set the debug App Check token BEFORE initializeAppCheck for node-to-cloud finality
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "1DA3A297-5A57-424F-862E-3A9E2557F82F";

  if (!(window as any).FIREBASE_APPCHECK_INITIALIZED) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider("6LeljyIsAAAAAKer8_fHinQBO5eO8WlqXPbpdAh5"),
        isTokenAutoRefreshEnabled: true
      });
      (window as any).FIREBASE_APPCHECK_INITIALIZED = true;
      console.log("[EnvirosAgro] App Check Registry Initialized.");
    } catch (err) {
      console.error("[EnvirosAgro] App Check Handshake Failed:", err);
    }
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanObject);
  if (typeof obj !== 'object') return obj;
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined && val !== null) {
      newObj[key] = (typeof val === 'object' && !Array.isArray(val)) ? cleanObject(val) : val;
    }
  });
  return newObj;
};

export const onAuthStateChanged = (_: any, callback: (user: any) => void) => fbOnAuthStateChanged(auth, callback);
export const signInWithEmailAndPassword = async (_: any, email: string, pass: string) => fbSignIn(auth, email, pass);
export const createUserWithEmailAndPassword = async (_: any, email: string, pass: string) => fbCreateUser(auth, email, pass);
export const signInWithGoogle = async () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOutSteward = () => fbSignOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const sendVerificationShard = async () => auth.currentUser ? sendEmailVerification(auth.currentUser) : false;
export const refreshAuthUser = async () => auth.currentUser ? (await reload(auth.currentUser), auth.currentUser) : null;

export const setupRecaptcha = (containerId: string) => {
  if (typeof window === "undefined") return null;
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
  try {
    return new RecaptchaVerifier(auth, containerId, { 'size': 'invisible' });
  } catch(e) { return null; }
};

export const requestPhoneCode = async (phone: string, appVerifier: any): Promise<ConfirmationResult> => signInWithPhoneNumber(auth, phone, appVerifier);

export const dispatchNetworkSignal = async (signalData: Partial<SignalShard>): Promise<SignalShard | null> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  const id = `SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const cleanSignal = cleanObject({
    ...signalData, id, timestamp, read: false, stewardId: userId,
    dispatchLayers: [{ channel: 'INBOX', status: 'SENT', timestamp }]
  });
  try {
    await setDoc(doc(db, "signals", id), cleanSignal);
    await push(ref(rtdb, 'network_pulse'), { message: `${cleanSignal.title}: ${cleanSignal.message}`, timestamp: rtdbTimestamp() });
    return cleanSignal as SignalShard;
  } catch (e) { 
    console.error("[EnvirosAgro] Signal Dispatch Failed:", e);
    return null; 
  }
};

export const updateSignalReadStatus = async (id: string, read: boolean) => {
  const docRef = doc(db, "signals", id);
  await updateDoc(docRef, { read });
};

export const markAllSignalsAsReadInDb = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;
  const q = query(collection(db, "signals"), where("stewardId", "==", userId), where("read", "==", false));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
};

export const listenToPulse = (callback: (pulse: string) => void) => {
  const pulseRef = rtdbQuery(ref(rtdb, 'network_pulse'), limitToLast(1));
  onValue(pulseRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback(data[Object.keys(data)[0]].message);
    }
  });
  return () => off(pulseRef);
};

export const streamLiveTelemetry = (esin: string, callback: (data: any) => void) => {
  const telemetryRef = ref(rtdb, `live_telemetry/${esin}`);
  onValue(telemetryRef, (snapshot) => {
    if (snapshot.exists()) callback(snapshot.val());
  });
  return () => off(telemetryRef);
};

export const updateLiveTelemetry = async (esin: string, data: any) => {
  const telemetryRef = ref(rtdb, `live_telemetry/${esin}`);
  return set(telemetryRef, { ...data, updatedAt: rtdbTimestamp() });
};

export const backupTelemetryShard = async (esin: string, data: any) => {
  const telemetryRef = ref(rtdb, `telemetry_backups/${esin}`);
  await set(telemetryRef, { ...cleanObject(data), timestamp: rtdbTimestamp() });
};

export const fetchTelemetryBackup = async (esin: string): Promise<any> => {
  const telemetryRef = ref(rtdb, `telemetry_backups/${esin}`);
  return new Promise((resolve) => {
    onValue(telemetryRef, (snapshot) => {
      resolve(snapshot.val());
    }, { onlyOnce: true });
  });
};

export const syncUserToCloud = async (userData: AgroUser, uid?: string) => {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return false;
  try {
    await setDoc(doc(db, "stewards", userId), { ...cleanObject(userData), lastSync: Date.now(), stewardId: userId }, { merge: true });
    return true;
  } catch (e) { return false; }
};

export const getStewardProfile = async (uid: string): Promise<AgroUser | null> => {
  const snap = await getDoc(doc(db, "stewards", uid));
  return snap.exists() ? snap.data() as AgroUser : null;
};

export const markPermanentAction = async (actionKey: string, reward: number, reason: string): Promise<boolean> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return false;
  const userRef = doc(db, "stewards", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;
  const userData = snap.data() as AgroUser;
  if (userData.completedActions?.includes(actionKey)) return true;

  try {
    await updateDoc(userRef, {
      completedActions: arrayUnion(actionKey),
      "wallet.balance": (userData.wallet.balance || 0) + reward
    });
    await dispatchNetworkSignal({
      type: 'ledger_anchor',
      title: 'PERMANENT_ACTION_FINALIZED',
      message: `${reason}. Reward: ${reward} EAC sharded.`,
      priority: 'high'
    });
    return true;
  } catch (e) { return false; }
};

export const saveCollectionItem = async (collectionName: string, item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  const docRef = item.id ? doc(db, collectionName, item.id) : doc(collection(db, collectionName));
  await setDoc(docRef, { ...cleanObject(item), stewardId: userId, lastModified: Date.now() }, { merge: true });
  return docRef.id;
};

export const listenToCollection = (collectionName: string, callback: (items: any[]) => void, isGlobal: boolean = false) => {
  const userId = auth.currentUser?.uid;
  if (!userId && !isGlobal) return () => {};
  const q = isGlobal ? query(collection(db, collectionName)) : query(collection(db, collectionName), where("stewardId", "==", userId));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
};

export const verifyAuditorAccess = async (email: string) => !(await getDocs(query(collection(db, "auditors"), where("email", "==", email)))).empty;
