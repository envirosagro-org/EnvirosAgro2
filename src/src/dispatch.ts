import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
} catch (e) {
  // Forgive re-initialization
}

const db = admin.firestore();

// Define a type for a dispatchable signal
interface Signal {
    stewardId: string; // The user to whom the signal is directed
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    channels: ('EMAIL' | 'SMS' | 'INBOX' | 'POPUP')[];
    metadata?: Record<string, any>;
}

// --- Email Dispatch (Example with a generic mail service) ---
async function sendEmail(stewardId: string, title: string, message: string): Promise<void> {
    const userRecord = await admin.auth().getUser(stewardId);
    const email = userRecord.email;

    if (!email) {
        functions.logger.warn(`Steward ${stewardId} does not have an email for notification.`);
        return;
    }

    // In a real-world scenario, you would integrate with a mailing service like SendGrid, Mailgun, etc.
    // For this example, we'll log the action and write to a 'dispatched_emails' collection.
    functions.logger.info(`Simulating email dispatch to ${email}: ${title}`);
    await db.collection('dispatched_emails').add({
        to: email,
        message: {
            subject: title,
            text: message,
            html: `<strong>${message}</strong>`
        },
        dispatchTime: admin.firestore.FieldValue.serverTimestamp()
    });
}

// --- INBOX Dispatch (Writing to a 'signals' collection in Firestore) ---
async function sendToInbox(stewardId: string, title: string, message: string, priority: Signal['priority'], metadata: any): Promise<void> {
    await db.collection('stewards').doc(stewardId).collection('signals').add({
        title,
        message,
        priority,
        metadata,
        read: false,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
}

export const dispatchService = functions.https.onRequest(async (request, response) => {
    // 1. Authentication
    const idToken = request.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        response.status(403).send("Unauthorized");
        return;
    }

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        response.status(403).send("Unauthorized");
        return;
    }
    const requestingStewardId = decodedToken.uid;

    // 2. Data Validation
    const { stewardId, title, message, priority, channels, metadata } = request.body as Partial<Signal>;

    if (!stewardId || !title || !message || !priority || !channels || !Array.isArray(channels)) {
        response.status(400).send("Missing or malformed required fields: stewardId, title, message, priority, channels.");
        return;
    }

    functions.logger.info(`Dispatch requested by ${requestingStewardId} for steward ${stewardId}`);

    // 3. Dispatch Logic
    const dispatchPromises: Promise<void>[] = [];

    for (const channel of channels) {
        switch (channel) {
            case 'EMAIL':
                dispatchPromises.push(sendEmail(stewardId, title, message));
                break;
            case 'INBOX':
                dispatchPromises.push(sendToInbox(stewardId, title, message, priority, metadata));
                break;
            case 'SMS':
                // Placeholder for SMS logic (e.g., using Twilio)
                functions.logger.info(`SMS dispatch to be implemented for steward ${stewardId}`);
                break;
            case 'POPUP':
                // Popups are typically handled client-side via a real-time listener (e.g., on the 'signals' collection).
                // This logic ensures the signal is in the database for the client to receive.
                functions.logger.info(`Popup signal logged for steward ${stewardId}, client-side will handle display.`);
                if (!channels.includes('INBOX')) { // Ensure it gets to the inbox if not already there
                    dispatchPromises.push(sendToInbox(stewardId, title, message, priority, metadata));
                }
                break;
            default:
                functions.logger.warn(`Unknown channel type: ${channel}`);
                break;
        }
    }

    try {
        await Promise.all(dispatchPromises);
        response.status(200).send({ message: "Signal dispatched successfully to specified channels." });
    } catch (error) {
        functions.logger.error("Error during dispatch execution:", error);
        response.status(500).send("Internal Server Error: One or more dispatch channels failed.");
    }
});
