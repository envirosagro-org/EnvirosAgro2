import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";

admin.initializeApp();

// Define secrets
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

/**
 * EnvirosAgro Cloud Registry Oracle
 */
export const syncNodeRegistry = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Node authentication required.');
  }

  const { userData } = request.data;
  const uid = request.auth.uid;

  try {
    await admin.firestore().collection('users').doc(uid).set(userData, { merge: true });
    return { status: 'SUCCESS', message: 'Node shard synchronized to global registry.' };
  } catch (error) {
    throw new HttpsError('internal', 'Cloud sync protocol failure.');
  }
});

/**
 * Agro AI Ingest - 2nd Gen
 */
export const agroAiIngest = onCall({ 
  secrets: [GEMINI_API_KEY, SENDGRID_API_KEY] 
}, async (request) => {
  const geminiKey = GEMINI_API_KEY.value();
  const sendgridKey = SENDGRID_API_KEY.value();
  
  // Logic using AI and Email services would go here
  
  return { status: 'AUTHORIZED', message: 'Registry secrets ingested successfully.' };
});
