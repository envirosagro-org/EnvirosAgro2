import * as functions from "firebase-functions";

export const supplyChainService = functions.https.onRequest(async (request, response) => {
  response.send("Supply chain service is running.");
});
