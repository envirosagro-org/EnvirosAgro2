
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { VertexAI } = require('@google-cloud/vertexai');
const { createAssessment } = require("./recaptcha");

admin.initializeApp();

// Initialize Vertex AI
const vertex_ai = new VertexAI({project: process.env.GCLOUD_PROJECT, location: 'us-central1'});
const model = 'gemini-1.0-pro';

const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generation_config: {
        "max_output_tokens": 2048,
        "temperature": 0.2,
        "top_p": 1
    },
});

exports.generateContent = functions.https.onRequest(async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        res.status(400).send('Please provide a prompt.');
        return;
    }

    const vertexAIRequest = {
        contents: [{role: 'user', parts: [{text: prompt}]}],
    };

    try {
        const resp = await generativeModel.generateContent(vertexAIRequest);
        res.status(200).send(resp);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// RTDB to Data Connect Sync Function
exports.syncPulseToDataConnect = functions.database.ref('/network_pulse/{pulse_id}')
    .onCreate(async (snapshot, context) => {
        const pulseData = snapshot.val();
        const pulseId = context.params.pulse_id;

        console.log(`Syncing pulse ${pulseId} to Data Connect:`, pulseData);

        // Placeholder for Data Connect insertion logic.
        console.log("Data Connect mutation would be called here.");

        return null;
    });


exports.verifyRecaptcha = functions.https.onCall(async (data, context) => {
  const { token, recaptchaAction } = data;

  const assessment = await createAssessment({
    token,
    recaptchaAction,
  });

  return assessment;
});
