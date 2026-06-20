import { generateAlphanumericId } from '../../systemFunctions';

/**
 * ENVIROSAGRO M-PESA DARAJA SERVICE
 * Secure proxy server integration for Safaricom M-Pesa STK Push queries.
 */

interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export async function getMpesaAccessToken(): Promise<string | null> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const env = process.env.MPESA_ENV || 'sandbox';

  if (!consumerKey || !consumerSecret) {
    console.warn("[M-Pesa] Missing credentials. Operating in SIMULATION mode.");
    return null;
  }

  const baseUrl = env === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to generate token: ${errText}`);
    }

    const data: any = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("[M-Pesa Token Error]", error);
    throw error;
  }
}

export async function initiateMpesaStkPush(params: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc?: string;
}): Promise<StkPushResponse & { isSimulated: boolean }> {
  const { phoneNumber, amount, accountReference, transactionDesc = 'AgroWallet Ingest' } = params;

  // Sanitize phone number (remove +, format as 2547XXXXXXXX or 2541XXXXXXXX)
  let cleanPhone = phoneNumber.replace(/\+/g, '').trim();
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '254' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
    cleanPhone = '254' + cleanPhone;
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const shortCode = process.env.MPESA_SHORTCODE || '174379'; // default Till/Paybill for Sandbox
  const passKey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://my-domain.com/api/mpesa/callback';
  const env = process.env.MPESA_ENV || 'sandbox';

  // Check if we should operate in simulation mode
  if (!consumerKey) {
    console.log("[M-Pesa STK Push] Triggering simulated push for:", cleanPhone, "Amount:", amount);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          MerchantRequestID: `MpesaSim-${Date.now()}`,
          CheckoutRequestID: `ws_CO_${Date.now()}_${generateAlphanumericId(8)}`,
          ResponseCode: "0",
          ResponseDescription: "Success. Request accepted for processing",
          CustomerMessage: "Success. Please check your handset to complete inputting your PIN.",
          isSimulated: true
        });
      }, 2000);
    });
  }

  const accessToken = await getMpesaAccessToken();
  if (!accessToken) {
    throw new Error("Unable to generate M-Pesa Access Token. Verify credentials.");
  }

  const baseUrl = env === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

  // Format timestamp (YYYYMMDDHHmmss)
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  // Generate password
  const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", // Standard Customer Paybill STK Push
    Amount: Math.round(amount),
    PartyA: cleanPhone,
    PartyB: shortCode,
    PhoneNumber: cleanPhone,
    CallBackURL: callbackUrl,
    AccountReference: accountReference.substring(0, 12),
    TransactionDesc: transactionDesc.substring(0, 20)
  };

  try {
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Safaricom Daraja API rejected request: ${errText}`);
    }

    const data: any = await response.json();
    return {
      MerchantRequestID: data.MerchantRequestID,
      CheckoutRequestID: data.CheckoutRequestID,
      ResponseCode: data.ResponseCode,
      ResponseDescription: data.ResponseDescription,
      CustomerMessage: data.CustomerMessage || data.ResponseDescription,
      isSimulated: false
    };
  } catch (error: any) {
    console.error("[M-Pesa STK Push Request Failed]", error);
    throw new Error(error.message || "Failed to trigger Safaricom STK Push session.");
  }
}
