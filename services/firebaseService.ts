import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
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

export const onAuthenticationChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

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

export const syncUserToCloud = async (user: User) => {
  if (!user.uid) return false;
  try {
    await setDoc(doc(db, "users", user.uid), user, { merge: true });
    await setDoc(doc(db, "stewards", user.uid), user, { merge: true });
    return true;
  } catch (error) {
    console.error("Error syncing user to cloud:", error);
    return false;
  }
};

export const signUp = async (userData: Omit<User, 'uid' | 'createdAt'>): Promise<User | null> => {
  try {
    const { email, mnemonic } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, mnemonic);
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
    const userCredential = await signInWithEmailAndPassword(auth, email, mnemonic);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const signOutSteward = logOut;

export const saveCollectionItem = async (collectionName: string, item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  try {
    const data = { 
      ...item, 
      stewardId: userId, 
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
