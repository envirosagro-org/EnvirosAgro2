"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgroCode = exports.farmOSSync = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
exports.farmOSSync = functions.https.onRequest(async (request, response) => {
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
    }
    catch (error) {
        console.error("Error syncing FarmOS data:", error);
        response.status(500).send("Internal Server Error");
    }
});
var agroCode_1 = require("./agroCode");
Object.defineProperty(exports, "getAgroCode", { enumerable: true, get: function () { return agroCode_1.getAgroCode; } });
//# sourceMappingURL=index.js.map