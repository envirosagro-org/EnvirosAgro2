import { User } from "../types";

/**
 * EnvirosAgro Registry Service
 * Handles user profile persistence and authentication simulation.
 */

const USERS_KEY = "envirosagro_stewards_registry";
const AUTH_KEY = "envirosagro_current_session_uid";

const getRegistry = (): Record<string, User> => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Registry Read Error:", error);
    return {};
  }
};

const saveRegistry = (registry: Record<string, User>) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(registry));
  } catch (error) {
    console.error("Registry Write Error:", error);
  }
};

export const syncUserToCloud = async (user: User) => {
  // Simulating network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const registry = getRegistry();
    const uid = user.uid || user.esin;
    registry[uid] = { ...user, uid };
    saveRegistry(registry);
    return true;
  } catch (error) {
    console.error("Registry Sync Error:", error);
    return false;
  }
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const registry = getRegistry();
    return registry[uid] || null;
  } catch (error) {
    console.error("Fetch User Error:", error);
    return null;
  }
};

export const signUp = async (userData: Omit<User, 'uid' | 'createdAt'>): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const registry = getRegistry();
    
    // Check if email already exists
    if (Object.values(registry).some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("Email already registered in the node.");
    }

    const uid = `UID-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const newUser: User = {
      ...userData,
      uid,
      createdAt: new Date().toISOString(),
    };

    registry[uid] = newUser;
    saveRegistry(registry);
    localStorage.setItem(AUTH_KEY, uid);
    
    // Dispatch event to notify listeners
    window.dispatchEvent(new Event('auth-state-changed'));
    
    return newUser;
  } catch (error: any) {
    throw error;
  }
};

export const signIn = async (email: string, mnemonic: string): Promise<{ uid: string } | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const registry = getRegistry();
    const user = Object.values(registry).find(
      u => u.email.toLowerCase() === email.toLowerCase() && 
      u.mnemonic.toLowerCase() === mnemonic.trim().toLowerCase()
    );

    if (user) {
      localStorage.setItem(AUTH_KEY, user.uid);
      window.dispatchEvent(new Event('auth-state-changed'));
      return { uid: user.uid };
    } else {
      throw new Error("Invalid email or mnemonic phrase.");
    }
  } catch (error: any) {
    throw error;
  }
};

export const logOut = async () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('auth-state-changed'));
};

export const onAuthenticationChanged = (callback: (user: { uid: string } | null) => void) => {
  const checkAuth = () => {
    const uid = localStorage.getItem(AUTH_KEY);
    callback(uid ? { uid } : null);
  };

  window.addEventListener('auth-state-changed', checkAuth);
  checkAuth(); // Initial check

  return () => window.removeEventListener('auth-state-changed', checkAuth);
};
