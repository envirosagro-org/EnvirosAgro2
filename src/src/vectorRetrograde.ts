import * as functions from "firebase-functions";

export const vectorRetrograde = functions.https.onRequest(async (request, response) => {
  response.send("Vector retrograde service is running.");
});
