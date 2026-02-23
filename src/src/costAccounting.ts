import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
} catch (e) {
  console.log("Re-initializing admin");
}

const db = admin.firestore();

// Define a type for our accounting entry for clarity
interface AccountingEntry {
    stewardId: string;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'CAPITAL';
    description: string;
    amount: number;
    currency: 'EAC' | 'USD' | 'KES'; // EnvirosAgro Coin or fiat
    relatedEntityType?: string; // e.g., 'Order', 'Project', 'User'
    relatedEntityId?: string;
    timestamp: admin.firestore.FieldValue;
    metadata?: Record<string, any>;
}

export const costAccountingService = functions.https.onRequest(async (request, response) => {
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
    const { type, description, amount, currency, relatedEntityType, relatedEntityId, metadata } = request.body;

    if (!type || !description || amount === undefined || !currency) {
        response.status(400).send("Missing required fields: type, description, amount, currency.");
        return;
    }

    if (typeof amount !== 'number' || amount <= 0) {
        response.status(400).send("Invalid amount: must be a positive number.");
        return;
    }
    
    // 3. Data Processing
    const newEntry: AccountingEntry = {
        stewardId,
        type,
        description,
        amount,
        currency,
        relatedEntityType,
        relatedEntityId,
        metadata: metadata || {},
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 4. Database Interaction
    try {
        const docRef = await db.collection("accounting_entries").add(newEntry);
        functions.logger.info(`New accounting entry ${docRef.id} created for steward ${stewardId}`);
        response.status(201).send({
            message: "Accounting entry created successfully.",
            entryId: docRef.id,
        });
    } catch (error) {
        functions.logger.error("Error creating accounting entry:", error);
        response.status(500).send("Internal Server Error: Could not save accounting entry.");
    }
});
