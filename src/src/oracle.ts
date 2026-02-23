import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from 'axios';

try {
  admin.initializeApp();
} catch (e) {
  functions.logger.info("Admin SDK already initialized.");
}
const db = admin.firestore();

// Define the structure for an Oracle Request
interface OracleRequest {
    stewardId: string;
    dataType: 'WEATHER' | 'MARKET_PRICE' | 'SATELLITE_IMAGERY_REQUEST' | 'CUSTOM_API';
    requestParams: Record<string, any>; // Parameters for the data fetch
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    createdAt: admin.firestore.FieldValue;
    processedAt?: admin.firestore.FieldValue;
    responseData?: any;
    errorMessage?: string;
}

// --- Data Fetching Logic ---

// Example: Fetch weather data from a public API (e.g., OpenWeatherMap)
async function fetchWeatherData(params: { lat: number; lon: number; }): Promise<any> {
    // IMPORTANT: Store API keys securely, e.g., in Firebase Secret Manager
    const apiKey = functions.config().openweathermap?.key;
    if (!apiKey) {
        throw new Error("OpenWeatherMap API key is not configured.");
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
}

// Example: Fetch cryptocurrency price data (e.g., from CoinGecko)
async function fetchMarketPrice(params: { id: string; currency: string; }): Promise<any> {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${params.id}&vs_currencies=${params.currency}`;
    const response = await axios.get(url);
    return response.data;
}

// --- Oracle Processing ---

async function processOracleRequest(requestId: string, requestData: OracleRequest) {
    const requestRef = db.collection("oracle_requests").doc(requestId);
    await requestRef.update({ status: 'PROCESSING' });

    try {
        let responseData: any;
        switch (requestData.dataType) {
            case 'WEATHER':
                responseData = await fetchWeatherData(requestData.requestParams as any);
                break;
            case 'MARKET_PRICE':
                responseData = await fetchMarketPrice(requestData.requestParams as any);
                break;
            // Add cases for other data types here
            default:
                throw new Error(`Unsupported data type: ${requestData.dataType}`);
        }

        await requestRef.update({
            status: 'COMPLETED',
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            responseData
        });
        functions.logger.info(`Oracle request ${requestId} completed successfully.`);

    } catch (error: any) {
        functions.logger.error(`Error processing oracle request ${requestId}:`, error);
        await requestRef.update({
            status: 'FAILED',
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            errorMessage: error.message || "An unknown error occurred."
        });
    }
}

// --- HTTPS Endpoint to Trigger Oracle --- //

export const oracleService = functions.https.onRequest(async (request, response) => {
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
    const stewardId = decodedToken.uid;

    // 2. Data Validation
    const { dataType, requestParams } = request.body;
    if (!dataType || !requestParams) {
        response.status(400).send("Bad Request: Missing 'dataType' or 'requestParams'.");
        return;
    }

    // 3. Create and Process Request
    const newRequest: OracleRequest = {
        stewardId,
        dataType,
        requestParams,
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
        const docRef = await db.collection("oracle_requests").add(newRequest);
        functions.logger.info(`New oracle request ${docRef.id} created for steward ${stewardId}`);
        
        // Asynchronously process the request to avoid long-running function
        // In a production app, this might be a separate Pub/Sub triggered function
        processOracleRequest(docRef.id, newRequest);

        response.status(202).send({ 
            message: "Oracle request received and is being processed.",
            requestId: docRef.id 
        });

    } catch (error) {
        functions.logger.error("Error creating oracle request:", error);
        response.status(500).send("Internal Server Error");
    }
});
