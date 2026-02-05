"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agroAiIngest = exports.syncNodeRegistry = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const params_1 = require("firebase-functions/params");
admin.initializeApp();
const GEMINI_API_KEY = (0, params_1.defineSecret)("GEMINI_API_KEY");
const SENDGRID_API_KEY = (0, params_1.defineSecret)("SENDGRID_API_KEY");
exports.syncNodeRegistry = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Node authentication required.');
    }
    const { userData } = request.data;
    const uid = request.auth.uid;
    try {
        await admin.firestore().collection('users').doc(uid).set(userData, { merge: true });
        return { status: 'SUCCESS', message: 'Node shard synchronized to global registry.' };
    }
    catch (error) {
        throw new https_1.HttpsError('internal', 'Cloud sync protocol failure.');
    }
});
exports.agroAiIngest = (0, https_1.onCall)({
    secrets: [GEMINI_API_KEY, SENDGRID_API_KEY]
}, async (request) => {
    const geminiKey = GEMINI_API_KEY.value();
    const sendgridKey = SENDGRID_API_KEY.value();
    return { status: 'AUTHORIZED', message: 'Registry secrets ingested successfully.' };
});
//# sourceMappingURL=index.js.map