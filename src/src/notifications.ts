import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
} catch (e) {
  console.log("Re-initializing admin");
}

const db = admin.firestore();

interface Notification {
    stewardId: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    read: boolean;
    timestamp: admin.firestore.FieldValue;
    metadata?: Record<string, any>;
}

export const notificationService = functions.https.onRequest(async (request, response) => {
    // 1. Authentication
    const idToken = request.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        functions.logger.warn("No authorization token provided.");
        response.status(403).send("Unauthorized");
        return;
    }

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        functions.logger.error("Error verifying auth token:", error);
        response.status(403).send("Unauthorized");
        return;
    }
    const stewardId = decodedToken.uid;

    // 2. Data Validation
    const { title, message, type, metadata } = request.body;

    if (!title || !message || !type) {
        response.status(400).send("Missing required fields: title, message, type.");
        return;
    }

    // 3. Data Processing
    const newNotification: Notification = {
        stewardId,
        title,
        message,
        type,
        read: false,
        metadata: metadata || {},
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 4. Database Interaction
    try {
        const docRef = await db.collection("notifications").add(newNotification);
        functions.logger.info(`New notification ${docRef.id} created for steward ${stewardId}`);
        response.status(201).send({
            message: "Notification created successfully.",
            notificationId: docRef.id,
        });
    } catch (error) {
        functions.logger.error("Error creating notification:", error);
        response.status(500).send("Internal Server Error: Could not save notification.");
    }
});
