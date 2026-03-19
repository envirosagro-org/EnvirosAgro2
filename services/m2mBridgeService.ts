import { saveCollectionItem, listenToCollection } from './firebaseService';
import { AgroResource } from '../types';

/**
 * M2M Bridge Service
 * Handles the machine-to-machine handshake and network ingestion of physical assets.
 */

export const initiateHardwareHandshake = async (asset: AgroResource) => {
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
};

export const listenToHandshakedAssets = (callback: (assets: AgroResource[]) => void) => {
  // Network ingest: Listen for all handshaked assets
  return listenToCollection('hardware_assets', callback, true);
};
