import { User } from "../types";

/**
 * EnvirosAgro Local Registry Service
 * Replaces Firebase Cloud Storage with a Browser-based Local Registry
 * to simulate decentralized node persistence without external dependencies.
 */

const USERS_KEY = "envirosagro_stewards_registry";

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
    registry[user.esin.toUpperCase()] = user;
    saveRegistry(registry);
    return true;
  } catch (error) {
    console.error("Registry Sync Error:", error);
    return false;
  }
};

export const getUserByESIN = async (esin: string): Promise<User | null> => {
  // Simulating network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const registry = getRegistry();
    return registry[esin.toUpperCase()] || null;
  } catch (error) {
    console.error("Fetch User Error:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  // Simulating network latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const registry = getRegistry();
    const emailLower = email.toLowerCase();
    const user = Object.values(registry).find(u => u.email.toLowerCase() === emailLower);
    return user || null;
  } catch (error) {
    console.error("Fetch User by Email Error:", error);
    return null;
  }
};

export const getUserByMnemonic = async (mnemonic: string): Promise<User | null> => {
  // Simulating network latency
  await new Promise(resolve => setTimeout(resolve, 1200));

  try {
    const registry = getRegistry();
    const mnemonicNormal = mnemonic.trim().toLowerCase();
    const user = Object.values(registry).find(u => u.mnemonic.toLowerCase() === mnemonicNormal);
    return user || null;
  } catch (error) {
    console.error("Fetch User by Mnemonic Error:", error);
    return null;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const registry = getRegistry();
    const emailLower = email.toLowerCase();
    return Object.values(registry).some(u => u.email.toLowerCase() === emailLower);
  } catch (error) {
    console.error("Email Check Error:", error);
    return false;
  }
};