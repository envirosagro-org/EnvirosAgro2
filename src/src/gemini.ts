import * as functions from "firebase-functions";

export const geminiService = functions.https.onRequest(async (request, response) => {
  response.send("Gemini service is running.");
});
