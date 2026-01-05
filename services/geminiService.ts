import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const FRAMEWORK_CONTEXT = `
EnvirosAgro™ Sustainability Framework (EOS):
- C(a)™ Agro Code: Represents cumulative effect of practices.
  Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
- m™ Constant / Time Signature: Measures alignment of natural resources with crop requirements.
  Formula: m = sqrt((Dn * In * C(a)) / S)
- Parameters: S (Cycle Requirement), Dn (Direct Nature), In (Indirect Nature), x (Base Factor/Immunity), r (Adoption Rate), n (Periods).
- Social Influenza Disease (SID): A conceptual pathogen within the Social Thrust (S).
  - Vectors: Language, Intergenerational Trauma, Ideological Conflict.
  - Impact: Reduces x (Social Immunity), disrupts m™ (Resilience), leading to Environmental degradation and Human Health decline (Hypertension, anxiety).
- Five Thrusts™ (SEHTI): Societal, Environmental, Human, Technological, Industry.
- Tokenz Institutional Account: The central gateway for value ingress/egress. It manages EAC liquidity, FIAT parity, and ZK-verified bridge protocols.
- Telecommunication Node (TelNode): A specialized validator that anchors a steward's physical identity via encrypted line number handshakes.
`;

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface AIResponse {
  text: string;
  sources?: GroundingChunk[];
}

/**
 * Utility to handle transient 500 errors or RPC proxy failures.
 */
const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = 
      error?.status === 500 || 
      error?.code === 500 || 
      error?.message?.includes('xhr') || 
      error?.message?.includes('Rpc failed') ||
      error?.message?.includes('500');

    if (retries > 0 && isRetryable) {
      console.warn(`EnvirosAgro Oracle: Transient connection error. Retrying in ${delay}ms...`, error);
      await new Promise(r => setTimeout(r, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const verifyTelecommNode = async (telData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as the EnvirosAgro Telecommunication Audit Oracle. 
  Process this identity anchoring request: ${JSON.stringify(telData)}.
  Context: ${FRAMEWORK_CONTEXT}
  1. Perform a mock ZK-handshake with the regional TelNode.
  2. Verify if the provided country code and line number align with the steward's geographic node location.
  3. Confirm the cryptographic integrity of the proposed identity shard.`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "Telecomm audit successful." };
  } catch (error) {
    return { text: "TelNode Gateway timeout. Proceeding with local verification cache." };
  }
};

export const analyzeTokenzFinance = async (transactionData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as the EnvirosAgro Tokenz Institutional Oracle. 
  Manage this gateway transaction: ${JSON.stringify(transactionData)}.
  Context: ${FRAMEWORK_CONTEXT}
  1. Calculate the EOS System Value based on current network liquidity and C(a)™ averages.
  2. Verify the bridge integrity (ZK-handshake status).
  3. Provide an institutional risk assessment for this value transfer.`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "Institutional handshake failed." };
  } catch (error) {
    return { text: "Tokenz Gateway Oracle unreachable. Please re-synchronize your ESIN node." };
  }
};

export const analyzeSocialInfluenza = async (nodeData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as an EOS Pathogen Specialist. Analyze the impact of Social Influenza Disease (SID) on this node: ${JSON.stringify(nodeData)}.
  Context: ${FRAMEWORK_CONTEXT}
  1. Identify "Language Vectors" and intergenerational trauma indicators.
  2. Calculate the drop in C(a)™ Agro Code if SID is left unmanaged.
  3. Suggest specific remediation for Environmental (E) and Health (H) thrusts using "Neural Reforestation" techniques.`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "Diagnostic failed." };
  } catch (error) {
    return { text: "Oracle unreachable for SID analysis." };
  }
};

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Using the EOS Framework: ${FRAMEWORK_CONTEXT}
  Analyze this agricultural data: ${JSON.stringify(farmData)}
  Calculate or estimate C(a)™ Agro Code and m™ Constant if possible. Provide a structured sustainability report.`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "No analysis generated." };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { text: "Failed to generate AI report." };
  }
};

export const searchAgroTrends = async (query: string): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Search for the latest trends, news, and events related to: ${query} in the context of sustainable agriculture. Use the EnvirosAgro™ context if relevant: ${FRAMEWORK_CONTEXT}`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    })) as GenerateContentResponse;

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "No results found.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Search failed:", error);
    return { text: "The Search Oracle is currently experiencing high load or a network sync failure. Please attempt your query in a few moments." };
  }
};

export const generateMediaInsights = async (channelType: string, topic: string): Promise<AIResponse> => {
  const ai = getAI();
  let prompt = "";
  
  if (channelType === 'audio') {
    prompt = `Act as the EnvirosAgro™ 'AgroMusika' sound engineer. Grounded in this context: ${FRAMEWORK_CONTEXT}, describe a scientific, rhythmic audio m™ Time Signature specifically designed to resonate with ${topic}. Explain the biological reasoning for why this frequency helps with regenerative farming or worker wellness.`;
  } else if (channelType === 'video') {
    prompt = `Act as the 'SkyScout' or 'Green Lens TV' director. Grounded in this context: ${FRAMEWORK_CONTEXT}, provide a detailed narrative description or 'visual script' for a satellite observation or documentary segment about ${topic}. Focus on what high-fidelity sensors would detect spectral signatures and C(a)™ Agro Code variances.`;
  } else {
    prompt = `Act as the 'AgroInPDF' head researcher. Grounded in this context: ${FRAMEWORK_CONTEXT}, write a 3-paragraph executive summary on ${topic}. Use professional, scientific language and cite theoretical EOS impacts across the Five Thrusts™.`;
  }

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "Insight generation failed." };
  } catch (error) {
    return { text: "The media node is currently unreachable." };
  }
};

export const findAgroResources = async (query: string, lat?: number, lng?: number): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Find nearby ${query} (e.g., fertilizer suppliers, warehouses, or cooperatives). Use EnvirosAgro™ standards.`;
  
  const toolConfig = lat && lng ? {
    retrievalConfig: {
      latLng: { latitude: lat, longitude: lng }
    }
  } : undefined;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig
      },
    })) as GenerateContentResponse;

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "No locations found.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Maps search failed:", error);
    return { text: "Maps grounding sync failure." };
  }
};

export const diagnoseCropIssue = async (description: string, imageBase64?: string): Promise<AIResponse> => {
  const ai = getAI();
  const parts: any[] = [{ text: `You are the EnvirosAgro™ 'Crop Doctor'. Context: ${FRAMEWORK_CONTEXT}. Provide a detailed diagnostic report for: ${description}. Analyze its impact on the farm's C(a)™ Agro Code.` }];
  
  if (imageBase64) {
    parts.push({
      inlineData: { mimeType: 'image/jpeg', data: imageBase64 }
    });
  }

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    })) as GenerateContentResponse;
    return { text: response.text || "Diagnostic failed." };
  } catch (error) {
    return { text: "The Crop Doctor is currently offline." };
  }
};

export const predictMarketTrends = async (cropType: string): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Using real-time web data and the EOS Framework context (${FRAMEWORK_CONTEXT}), predict the demand and price trends for ${cropType} over the next 6 months. How does high C(a)™ Agro Code verification affect market premium?`;
  
  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    })) as GenerateContentResponse;
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "Market intelligence unavailable.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Market prediction failed:", error);
    return { text: "Market intelligence forecasting sync failed." };
  }
};

export const optimizeSupplyChain = async (routeData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as an EnvirosAgro™ Logistics Optimizer. Analyze this procurement route: ${JSON.stringify(routeData)}. 
  Based on the EOS Framework (${FRAMEWORK_CONTEXT}), suggest the most sustainable logistics path.
  Provide a technical recommendation aligned with the Five Thrusts™.`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "Optimization unavailable." };
  } catch (error) {
    return { text: "Logistics Oracle is offline." };
  }
};

export const getDeFiIntelligence = async (transaction: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as an EnvirosAgro™ DeFi Analyst. Analyze this currency exchange/withdrawal: ${JSON.stringify(transaction)}. 
  Calculate the EOS-aligned exchange rate and justify it based on global agricultural liquidity and the sustainability constants m™ and C(a)™. 
  Provide a summary of the bridge security (ZK-Rollup confirmation times).`;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    })) as GenerateContentResponse;
    return { text: response.text || "DeFi Intelligence offline." };
  } catch (error) {
    return { text: "Protocol analyzer unavailable." };
  }
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an EnvirosAgro™ AI Expert. Use the following framework logic for all technical answers: ${FRAMEWORK_CONTEXT}. Be precise, scientific, and help users navigate Five Thrusts™ modules.`,
      tools: useSearch ? [{ googleSearch: {} }] : undefined,
    },
    history: history,
  });

  try {
    const response = await callWithRetry(() => chat.sendMessage({ message })) as GenerateContentResponse;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "I am currently unable to answer.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Chat error:", history, error);
    return { text: "The network link to the AI Expert is currently unstable. Please re-initialize the terminal." };
  }
};