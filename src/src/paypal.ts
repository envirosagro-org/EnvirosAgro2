import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// This is an illustrative example of what a PayPal Payouts request might look like.
// The @paypal/checkout-server-sdk does NOT support the Payouts API directly.
// You would need to make direct REST API calls to the Payouts API.
interface PayoutRequestBody {
    sender_batch_header: {
        sender_batch_id: string;
        email_subject: string;
        email_message: string;
    },
    items: {
        recipient_type: string;
        amount: {
            value: string;
            currency: string;
        },
        note: string;
        receiver: string; // The recipient's email address
    }[]
}

// Use Firebase secrets for secure credential management
const paypalClientId = functions.config().paypal?.client_id;
const paypalClientSecret = functions.config().paypal?.client_secret;

// Ensure you are using the correct environment (sandbox or live)
const environment = new paypal.core.SandboxEnvironment(paypalClientId, paypalClientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// --- DEPOSIT FUNCTIONS ---

// Step 1: Create an order from the server side
export const createPaypalOrder = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to create an order.');
    }

    const { amount } = data;
    if (typeof amount !== 'number' || amount <= 0) {
        throw new functions.https.HttpsError('invalid-argument', 'A valid amount is required.');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: "USD", // Or your desired currency
                value: amount.toFixed(2),
            },
            custom_id: context.auth.uid, // Embed the user's UID for tracking
        }],
    });

    try {
        const order = await client.execute(request);
        functions.logger.info(`PayPal Order ${order.result.id} created for user ${context.auth.uid}`);
        return { orderId: order.result.id };
    } catch (error) {
        functions.logger.error("Error creating PayPal order:", error);
        throw new functions.https.HttpsError('internal', 'Could not create PayPal order.');
    }
});

// Step 2: Capture the order and credit the user's wallet
export const capturePaypalOrder = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in.');
    }

    const { orderId, agroCoinExchangeRate } = data; // Exchange rate to convert USD to EAC
    if (!orderId || !agroCoinExchangeRate) {
        throw new functions.https.HttpsError('invalid-argument', 'orderId and agroCoinExchangeRate are required.');
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({}); // Required empty body

    try {
        const capture = await client.execute(request);
        const capturedAmount = parseFloat(capture.result.purchase_units[0].payments.captures[0].amount.value);
        const userId = capture.result.purchase_units[0].custom_id;

        if (userId !== context.auth.uid) {
            throw new functions.https.HttpsError('permission-denied', 'You cannot capture an order that is not yours.');
        }

        const agroCoinEarned = capturedAmount * agroCoinExchangeRate;

        // Securely update the user's wallet in a transaction
        const walletRef = db.collection("stewards").doc(userId).collection("wallet").doc("main");

        await db.runTransaction(async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            const newBalance = (walletDoc.data()?.balance || 0) + agroCoinEarned;
            transaction.set(walletRef, { balance: newBalance }, { merge: true });
        });
        
        functions.logger.info(`Credited ${agroCoinEarned} EAC to user ${userId} for PayPal Order ${orderId}`);
        return { success: true, amountCredited: agroCoinEarned };

    } catch (error) {
        functions.logger.error(`Error capturing PayPal order ${orderId}:`, error);
        throw new functions.https.HttpsError('internal', 'Failed to capture payment and credit wallet.');
    }
});

// --- WITHDRAWAL FUNCTION ---

export const requestWithdrawal = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in.');
    }

    const { amountEAC, paypalEmail, agroCoinExchangeRate } = data;
    if (!amountEAC || !paypalEmail || !agroCoinExchangeRate) {
        throw new functions.https.HttpsError('invalid-argument', 'amountEAC, paypalEmail, and agroCoinExchangeRate are required.');
    }

    const userId = context.auth.uid;
    const amountUSD = amountEAC / agroCoinExchangeRate;

    const walletRef = db.collection("stewards").doc(userId).collection("wallet").doc("main");

    try {
        await db.runTransaction(async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'User wallet does not exist.');
            }
            const currentBalance = walletDoc.data()?.balance || 0;

            if (currentBalance < amountEAC) {
                throw new functions.https.HttpsError('failed-precondition', 'Insufficient EAC balance.');
            }

            // Deduct the balance immediately
            const newBalance = currentBalance - amountEAC;
            transaction.update(walletRef, { balance: newBalance });

            // Log the withdrawal request for processing by a separate, secure backend process
            const withdrawalRef = db.collection("withdrawal_requests").doc();
            transaction.set(withdrawalRef, {
                stewardId: userId,
                amountEAC,
                amountUSD: parseFloat(amountUSD.toFixed(2)),
                paypalEmail,
                status: 'PENDING', // Status to be monitored by a backend processor
                requestedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        });

        functions.logger.info(`Withdrawal request of ${amountEAC} EAC for user ${userId} logged.`);
        return { success: true, message: "Withdrawal request submitted. It will be processed shortly." };

    } catch (error: any) {
        functions.logger.error(`Error in withdrawal request for user ${userId}:`, error);
        // Re-throw HttpsError to be caught by the client
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'An unexpected error occurred during the withdrawal request.');
    }
});
