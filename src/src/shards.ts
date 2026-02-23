
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

const db = admin.firestore();

// Creates a new security shard and logs the event
export const createSecurityShard = onRequest(async (request, response) => {
    try {
        const { ownerId, shardData } = request.body;

        if (!ownerId || !shardData) {
            response.status(400).send("Missing required body parameters: ownerId, shardData");
            return;
        }

        // 1. Create the new security shard
        const shardRef = db.collection("security_shards").doc();
        await shardRef.set({
            owner: ownerId,
            ...shardData,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            shard_id: shardRef.id,
        });

        // 2. Log the creation event
        const eventRef = db.collection("shard_events").doc();
        await eventRef.set({
            shard_id: shardRef.id,
            type: "CREATION",
            owner: ownerId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        response.status(200).json({ 
            message: "Security shard created successfully!", 
            shardId: shardRef.id 
        });

    } catch (error) {
        functions.logger.error("Error creating security shard:", error);
        response.status(500).send("Internal Server Error");
    }
});
