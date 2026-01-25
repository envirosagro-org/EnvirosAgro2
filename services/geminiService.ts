
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const FRAMEWORK_CONTEXT = `
EnvirosAgro™ Sustainability Framework (EOS):
- C(a)™ Agro Code: Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
- m™ Constant / Time Signature: Formula: m = sqrt((Dn * In * C(a)) / S)
- Five Thrusts™ (SEHTI): Societal, Environmental, Human, Technological, Industry.
- Total Quality Management (TQM): Tracking and tracing products from Production to Consumption.
- Traceability Shards: Immutable ledger entries for every stage of a product's life.
- Quality Grade: A score derived from multi-thrust audits (Purity, Cleanliness, Feedback).
`;

const GENETIC_DECODER_SYSTEM_INSTRUCTION = `
You are the "EnvirosAgro Genetic Decoder," a specialized AI engine responsible for visualizing the health of an agricultural ecosystem as DNA strands.
The Framework (The "Agro-Genetic Code"):
1. A (Agro-Bio): Plant health, soil moisture, bio-signals.
2. T (Technology): Robotics status, sensor efficiency, AI uptime.
3. C (Consumption): Sales volume, market demand, food ratings.
4. G (Governance): Token value, financial stability, compliance.
Pairing Rules:
- A pairs with T: Nature must be supported by Technology. Bond Strength = 1 - abs(A - T).
- C pairs with G: Consumption must be supported by Governance/Finance. Bond Strength = 1 - abs(C - G).
The Backbone (Stability Factor): Average of SEHTI thrusts.
- < 0.5: "Unstable" (Wobbly/Denatured).
- > 0.8: "Robust" (Tight/Vibrant).
`;

// Simple LRU Cache to conserve quota
const requestCache = new Map<string, { data: AIResponse, expiry: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface AIResponse {
  text: string;
  sources?: GroundingChunk[];
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

const handleAIError = (error: any): AIResponse => {
  console.error("Gemini API Error:", error);
  if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
    return { 
      text: "SYSTEM_ALERT: Network Oracle Congestion. We have exceeded the current processing quota. Please wait a moment while the registry synchronizes or upgrade your node tier. Switching to low-latency bypass..." 
    };
  }
  return { 
    text: "SYSTEM_ERROR: Protocol handshake failure. Check node connection and API_KEY registry." 
  };
};

/**
 * Executes an AI request with exponential backoff for 429 errors
 */
const requestWithRetry = async (fn: () => Promise<any>, retries = 3, initialDelay = 2000): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || 
                          error?.message?.includes('429') || 
                          error?.message?.includes('RESOURCE_EXHAUSTED');
      
      if (isRateLimit && i < retries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

export const decodeAgroGenetics = async (telemetry: any): Promise<any> => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Decode this agricultural telemetry: ${JSON.stringify(telemetry)}. Follow the Genetic Decoder rules and return JSON only.`,
      config: {
        systemInstruction: GENETIC_DECODER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            helix_status: { type: Type.STRING },
            backbone_integrity: { type: Type.NUMBER },
            base_pairs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  bond_strength: { type: Type.NUMBER },
                  visual_cue: { type: Type.STRING },
                  diagnosis: { type: Type.STRING }
                },
                required: ["type", "bond_strength", "visual_cue", "diagnosis"]
              }
            },
            recommendation: { type: Type.STRING }
          },
          required: ["helix_status", "backbone_integrity", "base_pairs", "recommendation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("Genetic Decoder Failure:", err);
    throw err;
  }
};

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  const cacheKey = `sustain_${JSON.stringify(farmData)}`;
  if (requestCache.has(cacheKey) && requestCache.get(cacheKey)!.expiry > Date.now()) {
    return requestCache.get(cacheKey)!.data;
  }

  try {
    const result = await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze sustainability: ${JSON.stringify(farmData)}. Context: ${FRAMEWORK_CONTEXT}`,
        config: { thinkingConfig: { thinkingBudget: 16000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
    
    requestCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });
    return result;
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroResearch = async (title: string, thrust: string, iotTelemetry: any, externalContext: string): Promise<AIResponse> => {
  const prompt = `
    Act as an EnvirosAgro Senior Research Scientist.
    Generate a formal research paper shard based on the following:
    Title: ${title}
    Primary Thrust: ${thrust}
    IoT Telemetry Data: ${JSON.stringify(iotTelemetry)}
    External Context: ${externalContext}
    
    Structure the output in professional scientific format:
    1. Abstract
    2. Introduction (SEHTI Alignment)
    3. Methodology (EOS Framework integration)
    4. Data Analysis (Based on IoT Telemetry)
    5. C(a) & m-Constant Impact Prediction
    6. Conclusion & Invention Potential.
    
    Reference: ${FRAMEWORK_CONTEXT}
  `;
  
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 24000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const chat = getAI().chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `EnvirosAgro AI Expert. Use logic: ${FRAMEWORK_CONTEXT}`,
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
        history,
      });
      const response = await chat.sendMessage({ message }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const runSpecialistDiagnostic = async (category: string, description: string, imageBase64?: string): Promise<AIResponse> => {
  const systemPrompt = `EnvirosAgro ${category} Specialist. Context: ${FRAMEWORK_CONTEXT}. 
  Provide a detailed industrial diagnostic report including:
  1. Current Status (Condition Shard)
  2. Remediation Strategy
  3. C(a) Impact Prediction
  4. m-Constant Stability Audit.`;
  
  const parts: any[] = [{ text: `${systemPrompt}\n\nDiagnostic Request: ${description}` }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: { parts },
        config: { thinkingConfig: { thinkingBudget: 16000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditProductQuality = async (batchId: string, lifecycleLogs: any[]): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit TQM for Batch ${batchId}. Logs: ${JSON.stringify(lifecycleLogs)}. Verify quality across Production (Farm), Processing (Industrial), and Consumer feedback. Assign a 'Quality Shard Grade' (A-F) and identify any traceability gaps. Context: ${FRAMEWORK_CONTEXT}`,
        config: { thinkingConfig: { thinkingBudget: 8000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeCustomerSentiment = async (feedbackLogs: any[]): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze customer feedback logs: ${JSON.stringify(feedbackLogs)}. Determine aggregate Customer Satisfaction score (0-100), identify pain points in the Five Thrusts, and provide a Customer Experience (CX) improvement strategy. Context: ${FRAMEWORK_CONTEXT}`,
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const diagnoseCropIssue = async (description: string, imageBase64?: string): Promise<AIResponse> => {
  const parts: any[] = [{ text: `EnvirosAgro Crop Doctor. Context: ${FRAMEWORK_CONTEXT}. Diagnostic: ${description}` }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: { parts },
        config: { thinkingConfig: { thinkingBudget: 16000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditRecycledItem = async (itemName: string, usageData: any, imageBase64?: string): Promise<AIResponse> => {
  const parts: any[] = [{ text: `EnvirosAgro Reverse Supply Chain Auditor. Item: ${itemName}. Usage Logs: ${JSON.stringify(usageData)}. Context: ${FRAMEWORK_CONTEXT}. Evaluate refurbishment potential (0-100%) and calculate 'Recycle Credit' in EAC.` }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { thinkingConfig: { thinkingBudget: 12000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const predictMarketTrends = async (cropType: string): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict trends for ${cropType}. Context: ${FRAMEWORK_CONTEXT}`,
        config: { tools: [{ googleSearch: {} }] },
      }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const findAgroResources = async (query: string, lat?: number, lng?: number): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: { tools: [{ googleMaps: {} }], toolConfig: { retrievalConfig: { latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined } } }
      }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeMedia = async (mediaBase64: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const result = await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: mediaBase64, mimeType } }, { text: prompt }] },
        config: { thinkingConfig: { thinkingBudget: 16000 } }
      }) as GenerateContentResponse;
      return response.text || "";
    });
    return result;
  } catch (err) {
    return handleAIError(err).text;
  }
};

export const analyzeTokenzFinance = async (tx: any): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze Institutional Trans: ${JSON.stringify(tx)}. Context: ${FRAMEWORK_CONTEXT}`,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeSocialInfluenza = async (data: any): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze SID: ${JSON.stringify(data)}. Context: ${FRAMEWORK_CONTEXT}`,
        config: { thinkingConfig: { thinkingBudget: 8000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const verifyTelecommNode = async (tel: any): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit TelNode: ${JSON.stringify(tel)}. Context: ${FRAMEWORK_CONTEXT}`,
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const optimizeSupplyChain = async (route: any): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Optimize route: ${JSON.stringify(route)}. Context: ${FRAMEWORK_CONTEXT}`,
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const searchAgroTrends = async (q: string): Promise<AIResponse> => {
  try {
    return await requestWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: q,
        config: { tools: [{ googleSearch: {} }] },
      }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};
