import { saveCollectionItem, listenToCollection } from './firebaseService';
import { AgroResource } from '../types';

/**
 * M2M Bridge Service
 * Handles the machine-to-machine handshake and network ingestion of physical assets.
 */

export const initiateHardwareHandshake = async (asset: AgroResource) => {
  try {
    // M2M handshake logic: 
    // 1. Ensure asset has IOT_HANDSHAKE verification meta
    // 2. Save to Firebase
    const handshakeAsset = {
      ...asset,
      status: 'AUDITING', // Initial handshake status
      verificationMeta: {
        ...asset.verificationMeta,
        method: 'IOT_HANDSHAKE',
        verifiedAt: new Date().toISOString(),
      }
    };
    
    return await saveCollectionItem('hardware_assets', handshakeAsset);
  } catch (error) {
    console.error("Error initiating hardware handshake:", error);
    throw new Error("Failed to initiate hardware handshake");
  }
};

export const listenToHandshakedAssets = (callback: (assets: AgroResource[]) => void) => {
  try {
    // Network ingest: Listen for all handshaked assets
    return listenToCollection('hardware_assets', callback, true);
  } catch (error) {
    console.error("Error listening to handshaked assets:", error);
    return () => {};
  }
};
