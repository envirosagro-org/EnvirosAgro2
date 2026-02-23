
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseService";
import { getStewardProfile } from "../services/firebaseService";

export const useLogin = (onLogin) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createStewardProfile = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const nodeRef = doc(db, "nodes", `FARM-NODE-${user.uid.substring(0, 5)}`);

    const newUserProfile = {
      esin: user.uid,
      email: user.email,
      name: "New Steward",
      createdAt: new Date().toISOString(),
      avatar: `https://avatar.vercel.sh/${user.email}.png`,
      // Add other default fields from your User type
    };

    await setDoc(userRef, newUserProfile);

    await setDoc(nodeRef, {
      ownerUid: user.uid,
      createdAt: new Date().toISOString(),
      sustainability_metrics: {
        ca_value: 1,
        m_constant: 0,
      },
    });
    return newUserProfile;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUserProfile = await createStewardProfile(userCredential.user);
      if (onLogin) {
        onLogin(newUserProfile);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await getStewardProfile(userCredential.user.uid);
      if (onLogin && userProfile) {
        onLogin(userProfile);
      }
    } catch (err: any) { 
      setError(err.code.includes('auth/invalid-credential') ? 'Invalid credentials. Please try again.' : err.message);
    }
    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSignUp,
    handleLogin,
  };
};
