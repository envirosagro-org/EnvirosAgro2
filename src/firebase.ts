import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
