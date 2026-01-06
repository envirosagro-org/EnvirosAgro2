
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const FRAMEWORK_CONTEXT = `
EnvirosAgro™ Sustainability Framework (EOS):
- C(a)™ Agro Code: Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
- m™ Constant / Time Signature: Formula: m = sqrt((Dn * In * C(a)) / S)
- Five Thrusts™ (SEHTI): Societal, Environmental, Human, Technological, Industry.
- Social Influenza Disease (SID): Vector pathogens impacting social immunity (x).
- Tokenz: Central institutional gateway for value ingress/egress.
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

export const generateAgroVideo = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Industrial agro-documentation: ${prompt}`,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  });
  while (!operation.done) {
    await new Promise(r => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }
  return `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`;
};

export const generateAgroImage = async (prompt: string, aspectRatio: string, imageSize: '1K' | '2K' | '4K'): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: imageSize === '1K' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `EnvirosAgro fidelity: ${prompt}` }] },
    config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: imageSize as any } },
  }) as GenerateContentResponse;
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Generation failure.");
};

export const editAgroImage = async (imageBase64: string, prompt: string): Promise<string> => {
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }, { text: prompt }] },
  }) as GenerateContentResponse;
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Edit failure.");
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
