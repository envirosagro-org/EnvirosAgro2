import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const farmOSSync = functions.https.onRequest(async (request, response) => {
  const { farmOsData, nodeId } = request.body;

  if (!nodeId || !farmOsData) {
    response.status(400).send("Missing nodeId or farmOsData in request body");
    return;
  }

  try {
    const nodeRef = db.collection("nodes").doc(nodeId);

    // You can add more specific data processing here as needed
    await nodeRef.update({
      "telemetry_summary.farmos": farmOsData,
      "last_heartbeat": admin.firestore.FieldValue.serverTimestamp(),
      "status": "SYNCING",
    });

    // Dispatch a signal to the network
    const signalRef = db.collection("signals").doc();
    await signalRef.set({
      origin: "FarmOS",
      target: nodeId,
      type: "SYNC_REQUEST",
      payload: farmOsData,
      status: "COMPLETED",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    response.status(200).send({ 
      message: "FarmOS data synchronized successfully", 
      nodeId: nodeId 
    });

  } catch (error) {
    console.error("Error syncing FarmOS data:", error);
    response.status(500).send("Internal Server Error");
  }
});

export { getAgroCode } from "./agroCode";
export { getMConstant } from "./mConstant";
export { getHash, createGenesis, mineNewBlock } from "./blockchain";
export { sourceBlueprint } from "./sourcing";
export { processOracleData } from "./oracle";
export { createSecurityShard } from "./shards";
export { envirosAgroAI } from "./envirosAgroAI";
export { depositToAgroWallet, withdrawFromAgroWallet } from "./paypal";
export { dispatchService } from "./dispatch";
export { costAccountingService } from "./costAccounting";
export { supplyChainService } from "./supplyChain";
export { schemaMapXml } from "./schemaMap";
export { vectorRetrograde } from "./vectorRetrograde";
export { geminiService } from "./gemini";
export { networkSignal } from "./network";
export { notificationService } from "./notifications";
