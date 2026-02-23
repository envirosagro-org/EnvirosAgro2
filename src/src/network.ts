import * as functions from "firebase-functions";

export const networkSignal = functions.https.onRequest(async (request, response) => {
  response.send("Network signal service is running.");
});
