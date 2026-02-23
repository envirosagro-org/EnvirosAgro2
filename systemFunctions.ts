
import { httpsCallable } from "firebase/functions";
import { functions } from "./services/firebaseService"; 

/**
 * ENVIROSAGRO™ SYSTEM FUNCTIONS v7.1
 * ---------------------------------
 * This file now acts as the client-side SDK for interacting with the centralized
 * backend logic. The core calculations have been moved to the cloud function.
 */

/**
 * Synchronizes Farm OS telemetry data with the central database.
 * This function calls the `processFarmOSUpdate` cloud function.
 * The actual calculation logic now resides in the backend.
 */
export const syncFarmOSTelemetry = async (nodeId: string, telemetry: any) => {
  const processFarmOSUpdate = httpsCallable(functions, 'processFarmOSUpdate');
  
  try {
    // The cloud function now handles all calculations and database updates.
    const result = await processFarmOSUpdate({ nodeId, telemetry });
    console.log('Backend processing successful:', result.data);
    return result.data; // The backend returns the processed data.
  } catch (error) { 
    console.error("Error calling processFarmOSUpdate function:", error);
    throw new Error("Failed to sync with the EnvirosAgro backend.");
  }
};

/**
 * Validates industrial inflow for TQM Traceability.
 * This is a local validation check before sending data to the backend.
 */
export const validateIndustrialInflow = (payload: any) => {
  const required = ['sku', 'origin', 'batch_id'];
  const missing = required.filter(k => !payload[k]);
  
  return {
    is_compliant: missing.length === 0,
    missing_shards: missing,
    timestamp: Date.now()
  };
};

/**
 * Generates a cryptographic shard hash for client-side nonce generation.
 * Used by services like dispatchService.ts.
 */
export const generateShardHash = async (data: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(data + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
};

/**
 * Mints EAC Shards from Biomass proof.
 * This is a client-side simulation/calculation helper.
 * The authoritative minting process should be handled by the backend to prevent tampering.
 */
export const mintCarbonShard = (biomass: number, confidence: number) => {
  const MINT_RATE = 100;
  return {
    value: Math.floor(biomass * MINT_RATE * confidence),
    unit: 'EAC'
  };
};
