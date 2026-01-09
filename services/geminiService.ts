
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

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

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze sustainability: ${JSON.stringify(farmData)}. Context: ${FRAMEWORK_CONTEXT}`,
    config: { thinkingConfig: { thinkingBudget: 32768 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
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
  
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 32768 } }
  }) as GenerateContentResponse;
  
  return { text: response.text || "" };
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
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
  
  const response = await getAI().models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    contents: { parts },
    config: { thinkingConfig: { thinkingBudget: 32768 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const auditProductQuality = async (batchId: string, lifecycleLogs: any[]): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Audit TQM for Batch ${batchId}. Logs: ${JSON.stringify(lifecycleLogs)}. Verify quality across Production (Farm), Processing (Industrial), and Consumer feedback. Assign a 'Quality Shard Grade' (A-F) and identify any traceability gaps. Context: ${FRAMEWORK_CONTEXT}`,
    config: { thinkingConfig: { thinkingBudget: 8000 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const analyzeCustomerSentiment = async (feedbackLogs: any[]): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze customer feedback logs: ${JSON.stringify(feedbackLogs)}. Determine aggregate Customer Satisfaction score (0-100), identify pain points in the Five Thrusts, and provide a Customer Experience (CX) improvement strategy. Context: ${FRAMEWORK_CONTEXT}`,
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const diagnoseCropIssue = async (description: string, imageBase64?: string): Promise<AIResponse> => {
  const parts: any[] = [{ text: `EnvirosAgro Crop Doctor. Context: ${FRAMEWORK_CONTEXT}. Diagnostic: ${description}` }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  const response = await getAI().models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    contents: { parts },
    config: { thinkingConfig: { thinkingBudget: 32768 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const auditRecycledItem = async (itemName: string, usageData: any, imageBase64?: string): Promise<AIResponse> => {
  const parts: any[] = [{ text: `EnvirosAgro Reverse Supply Chain Auditor. Item: ${itemName}. Usage Logs: ${JSON.stringify(usageData)}. Context: ${FRAMEWORK_CONTEXT}. Evaluate refurbishment potential (0-100%) and calculate 'Recycle Credit' in EAC.` }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: { thinkingConfig: { thinkingBudget: 16000 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const predictMarketTrends = async (cropType: string): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict trends for ${cropType}. Context: ${FRAMEWORK_CONTEXT}`,
    config: { tools: [{ googleSearch: {} }] },
  }) as GenerateContentResponse;
  return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
};

export const findAgroResources = async (query: string, lat?: number, lng?: number): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: { tools: [{ googleMaps: {} }], toolConfig: { retrievalConfig: { latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined } } }
  }) as GenerateContentResponse;
  return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
};

export const analyzeMedia = async (mediaBase64: string, mimeType: string, prompt: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ inlineData: { data: mediaBase64, mimeType } }, { text: prompt }] },
    config: { thinkingConfig: { thinkingBudget: 32768 } }
  }) as GenerateContentResponse;
  return response.text || "";
};

export const analyzeTokenzFinance = async (tx: any): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze Institutional Trans: ${JSON.stringify(tx)}. Context: ${FRAMEWORK_CONTEXT}`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const analyzeSocialInfluenza = async (data: any): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze SID: ${JSON.stringify(data)}. Context: ${FRAMEWORK_CONTEXT}`,
    config: { thinkingConfig: { thinkingBudget: 8000 } }
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const verifyTelecommNode = async (tel: any): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Audit TelNode: ${JSON.stringify(tel)}. Context: ${FRAMEWORK_CONTEXT}`,
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const optimizeSupplyChain = async (route: any): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Optimize route: ${JSON.stringify(route)}. Context: ${FRAMEWORK_CONTEXT}`,
  }) as GenerateContentResponse;
  return { text: response.text || "" };
};

export const searchAgroTrends = async (q: string): Promise<AIResponse> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: q,
    config: { tools: [{ googleSearch: {} }] },
  }) as GenerateContentResponse;
  return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
};
