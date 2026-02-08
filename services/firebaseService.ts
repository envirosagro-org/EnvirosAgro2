import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword, 
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  onSnapshot,
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
import { User } from "../types";

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
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// --- AUTHENTICATION ---

export const onAuthenticationChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { onAuthStateChanged }; 

export const createUserWithEmailAndPassword = async (_: any, email: string, pass: string) => {
  return fbCreateUserWithEmailAndPassword(auth, email, pass);
};

export const signInWithEmailAndPassword = async (_: any, email: string, pass: string) => {
  return fbSignInWithEmailAndPassword(auth, email, pass);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const signOutSteward = logOut;

export const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible'
  });
};

// --- USER PROFILE & REGISTRY ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    const legacyDoc = await getDoc(doc(db, "stewards", uid));
    if (legacyDoc.exists()) {
       return legacyDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const getStewardProfile = getUserProfile;

export const syncUserToCloud = async (user: User, uid?: string) => {
  const userId = uid || user.uid || auth.currentUser?.uid;
  if (!userId) return false;
  try {
    const data = { ...user, uid: userId, lastSync: Date.now() };
    await setDoc(doc(db, "users", userId), data, { merge: true });
    await setDoc(doc(db, "stewards", userId), data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error syncing user to cloud:", error);
    return false;
  }
};

export const signUp = async (userData: Omit<User, 'uid' | 'createdAt'>): Promise<User | null> => {
  try {
    const { email, mnemonic } = userData;
    const userCredential = await fbCreateUserWithEmailAndPassword(auth, email, mnemonic);
    const firebaseUser = userCredential.user;
    
    const newUser: User = {
      ...userData,
      uid: firebaseUser.uid,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), newUser);
    await setDoc(doc(db, "stewards", firebaseUser.uid), newUser);
    return newUser;
  } catch (error: any) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signIn = async (email: string, mnemonic: string): Promise<FirebaseUser | null> => {
  try {
    const userCredential = await fbSignInWithEmailAndPassword(auth, email, mnemonic);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// --- RECOVERY SHARDS ---

export const transmitRecoveryCode = async (email: string) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
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

// --- FIRESTORE UTILITIES ---

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

// --- RTDB UTILITIES ---

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
      })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(list);
    } else {
      callback([]);
    }
  });
};

export const listenToPulse = (callback: (msg: string) => void) => {
   const pulsesRef = rtdbQuery(ref(rtdb, 'pulses'), limitToLast(1));
   return onValue(pulsesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
         const latest = Object.values(data)[0] as any;
         callback(latest.message);
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

// --- MISC UTILITIES ---

export const dispatchNetworkSignal = async (signalData: any) => {
   const userId = auth.currentUser?.uid;
   if (!userId) return null;
   const signal = {
      ...signalData,
      id: `SIG-${Date.now()}`,
      stewardId: userId,
      timestamp: Date.now(),
      dispatchLayers: [{ channel: 'POPUP' }, { channel: 'TERMINAL' }]
   };
   await saveCollectionItem('signals', signal);
   return signal;
};

export const markPermanentAction = async (actionKey: string) => {
   const userId = auth.currentUser?.uid;
   if (!userId) return false;
   try {
      const stewardRef = doc(db, "users", userId);
      const snap = await getDoc(stewardRef);
      if (snap.exists()) {
         const currentActions = snap.data().completedActions || [];
         if (!currentActions.includes(actionKey)) {
            await updateDoc(stewardRef, {
               completedActions: [...currentActions, actionKey]
            });
            return true;
         }
      }
      return false;
   } catch (e) { return false; }
};
