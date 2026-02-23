
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

const db = admin.firestore();

// Simulates sourcing a blueprint and creating a new asset
export const sourceBlueprint = onRequest(async (request, response) => {
    try {
        const { blueprintId, ownerId } = request.body;

        if (!blueprintId || !ownerId) {
            response.status(400).send("Missing required body parameters: blueprintId, ownerId");
            return;
        }

        // 1. Fetch the blueprint
        const blueprintRef = db.collection("blueprints").doc(blueprintId);
        const blueprintDoc = await blueprintRef.get();

        if (!blueprintDoc.exists) {
            response.status(404).send(`Blueprint with ID ${blueprintId} not found.`);
            return;
        }

        const blueprintData = blueprintDoc.data();

        // 2. Create a new "sourced asset" from the blueprint
        const assetRef = db.collection("sourced_assets").doc();
        await assetRef.set({
            ...blueprintData,
            asset_id: assetRef.id,
            sourced_at: admin.firestore.FieldValue.serverTimestamp(),
            status: "SOURCED",
            owner: ownerId,
            original_blueprint_id: blueprintId,
        });

        response.status(200).json({ 
            message: "Blueprint sourced successfully!", 
            assetId: assetRef.id 
        });

    } catch (error) {
        functions.logger.error("Error sourcing blueprint:", error);
        response.status(500).send("Internal Server Error");
    }
});
