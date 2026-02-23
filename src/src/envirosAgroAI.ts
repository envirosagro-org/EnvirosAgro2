import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { askGemini } from "./gemini";
import { User as Steward } from "../../types";

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
} catch (e) {
  functions.logger.info("Admin SDK already initialized.");
}
const db = admin.firestore();

// A more sophisticated framework application
const applySustainabilityFramework = (prompt: string, steward: Steward | null): string => {
    // Start with a base persona for the AI
    let frameworkPrompt = `
        You are "Aura", the AI core of the EnvirosAgro platform. Your purpose is to guide stewards towards regenerative, equitable, and sustainable practices.
        Your responses must be filtered through the EnvirosAgro Sustainability Framework, which prioritizes:
        1.  **Environmental Health**: Soil regeneration, water conservation, biodiversity, and carbon sequestration.
        2.  **Social Equity**: Fair labor, community empowerment, knowledge sharing, and social immunity (resilience).
        3.  **Economic Viability**: Circular economies, value-added production, and fair market access for all stewards.
        4.  **Technological Resonance**: Use of appropriate, accessible technology (IoT, blockchain) to enhance transparency and efficiency.

        Always be encouraging, insightful, and actionable.
    `;

    // If we have user context, add it to the prompt
    if (steward) {
        frameworkPrompt += `
            You are speaking to ${steward.name}, a ${steward.role} located in ${steward.location}.
            Here is a summary of their current status on the platform:
            - ESIN: ${steward.esin}
            - Sustainability Score: ${steward.metrics.sustainabilityScore}
            - Skills: ${Object.keys(steward.skills).join(', ')}
            - Wallet Balance: ${steward.wallet.balance} EAC

            Personalize your response based on this context. For example, if they ask about crops, consider their location. If they ask about finances, be mindful of their wallet.
        `;
    } else {
        frameworkPrompt += `
            You are speaking to a guest or a new steward. Be welcoming and provide general information that encourages them to join and participate in the EnvirosAgro ecosystem.
        `;
    }

    // Add the user's actual prompt
    frameworkPrompt += `
        Based on the framework and the user's context, please respond to the following query:

        Prompt: \"${prompt}\"
    `;

    return frameworkPrompt;
};

// The main AI logic function
const envirosAgroAIFunc = async (prompt: string, stewardId: string | null): Promise<string> => {
    let steward: Steward | null = null;
    if (stewardId) {
        try {
            const stewardDoc = await db.collection("stewards").doc(stewardId).get();
            if (stewardDoc.exists) {
                steward = stewardDoc.data() as Steward;
            }
        } catch (error) {
            functions.logger.error(`Could not fetch steward profile for ${stewardId}`, error);
            // Proceed without steward context if fetching fails
        }
    }

    const framedPrompt = applySustainabilityFramework(prompt, steward);

    const aiResponse = await askGemini(framedPrompt);

    // Log the interaction
    if (stewardId) {
        try {
            await db.collection("ai_interactions").add({
                stewardId,
                prompt,
                framedPrompt,
                response: aiResponse,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            functions.logger.error(`Failed to log AI interaction for steward ${stewardId}`, error);
        }
    }

    return aiResponse;
};

// The exported HTTPS Cloud Function
export const envirosAgroAI = functions.https.onRequest(async (request, response) => {
    // 1. Authentication (Optional - allow for unauthenticated requests but provide less context)
    const idToken = request.headers.authorization?.split('Bearer ')[1];
    let stewardId: string | null = null;

    if (idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            stewardId = decodedToken.uid;
            functions.logger.info(`Request from authenticated steward: ${stewardId}`);
        } catch (error) {
            functions.logger.warn("Received a token, but it was invalid. Treating as anonymous.", error);
            // Don't block the request, just proceed without user context
        }
    } else {
        functions.logger.info("Request from anonymous user.");
    }

    // 2. Data Validation
    const { prompt } = request.body;
    if (!prompt) {
        response.status(400).send("Bad Request: Missing 'prompt' in request body.");
        return;
    }

    // 3. Execute AI Logic and Respond
    try {
        const result = await envirosAgroAIFunc(prompt, stewardId);
        response.status(200).json({ response: result });
    } catch (error) {
        functions.logger.error("Error executing envirosAgroAIFunc:", error);
        response.status(500).send("Internal Server Error: The AI core encountered an unexpected anomaly.");
    }
});
