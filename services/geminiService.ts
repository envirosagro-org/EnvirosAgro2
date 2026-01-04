
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const FRAMEWORK_CONTEXT = `
EnvirosAgro Sustainability Framework (EOS):
- Agricultural Code C(a): Represents cumulative effect of practices.
  Growth formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
  Static formula: C(a) = n * x + 1
- Sustainable Time Constant (m): Measures alignment of natural resources with crop requirements.
  Formula: m = sqrt((Dn * In * C(a)) / S)
- Parameters:
  S: Crop Cycle Requirement (days to maturity).
  Dn: Direct Nature Factor (immediate inputs like rainfall days/sunlight).
  In: Indirect Nature Factor (stored resources like soil moisture/groundwater).
  x: Agricultural Base Factor (1-10, integration level).
  r: Growth/Adoption Rate.
  n: Number of Periods (seasons/years).
- Pillars (SEHTI):
  S: Societal - Anthropological agriculture.
  E: Environmental - Stewardship of physical resources.
  H: Human - Health and behavioral processes.
  T: Technological - Modern agrarian innovations.
  I: Industry - Data-driven industrial optimization and blockchain registries.
`;

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface AIResponse {
  text: string;
  sources?: GroundingChunk[];
}

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Using the EOS Framework: ${FRAMEWORK_CONTEXT}
  Analyze this agricultural data: ${JSON.stringify(farmData)}
  Calculate or estimate C(a) and m if possible. Provide a structured sustainability report.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
    });
    return { text: response.text || "No analysis generated." };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { text: "Failed to generate AI report." };
  }
};

export const searchAgroTrends = async (query: string): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Search for the latest trends, news, and events related to: ${query} in the context of sustainable agriculture. Use the EOS framework context if relevant: ${FRAMEWORK_CONTEXT}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "No results found.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Search failed:", error);
    return { text: "Search grounding failed." };
  }
};

export const generateMediaInsights = async (channelType: string, topic: string): Promise<AIResponse> => {
  const ai = getAI();
  let prompt = "";
  
  if (channelType === 'audio') {
    prompt = `Act as the EnvirosAgro 'AgroMusika' sound engineer. Grounded in this context: ${FRAMEWORK_CONTEXT}, describe a scientific, rhythmic audio frequency (like 432Hz or 528Hz) specifically designed to resonate with ${topic}. Explain the biological reasoning for why this frequency helps with regenerative farming or worker wellness.`;
  } else if (channelType === 'video') {
    prompt = `Act as the 'SkyScout' or 'Green Lens TV' director. Grounded in this context: ${FRAMEWORK_CONTEXT}, provide a detailed narrative description or 'visual script' for a satellite observation or documentary segment about ${topic}. Focus on what high-fidelity sensors would detect (spectral signatures, moisture heatmaps).`;
  } else {
    prompt = `Act as the 'AgroInPDF' head researcher. Grounded in this context: ${FRAMEWORK_CONTEXT}, write a 3-paragraph executive summary on ${topic}. Use professional, scientific language and cite theoretical EOS impacts.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return { text: response.text || "Insight generation failed." };
  } catch (error) {
    return { text: "The media node is currently unreachable." };
  }
};

export const findAgroResources = async (query: string, lat?: number, lng?: number): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Find nearby ${query} (e.g., fertilizer suppliers, warehouses, or cooperatives).`;
  
  const toolConfig = lat && lng ? {
    retrievalConfig: {
      latLng: { latitude: lat, longitude: lng }
    }
  } : undefined;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "No locations found.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Maps search failed:", error);
    return { text: "Maps grounding failed." };
  }
};

export const diagnoseCropIssue = async (description: string, imageBase64?: string): Promise<AIResponse> => {
  const ai = getAI();
  const parts: any[] = [{ text: `You are the EnvirosAgro 'Crop Doctor'. Context: ${FRAMEWORK_CONTEXT}. Provide a detailed diagnostic report for: ${description}.` }];
  
  if (imageBase64) {
    parts.push({
      inlineData: { mimeType: 'image/jpeg', data: imageBase64 }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    return { text: response.text || "Diagnostic failed." };
  } catch (error) {
    return { text: "The Crop Doctor is currently offline." };
  }
};

export const predictMarketTrends = async (cropType: string): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Using real-time web data and the EOS Framework context (${FRAMEWORK_CONTEXT}), predict the demand and price trends for ${cropType} over the next 6 months. How does the current global climate affect this?`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "Market intelligence unavailable.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Market prediction failed:", error);
    return { text: "Market intelligence forecasting failed." };
  }
};

export const optimizeSupplyChain = async (routeData: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as an EnvirosAgro Logistics Optimizer. Analyze this procurement route: ${JSON.stringify(routeData)}. 
  Based on the EOS Framework (${FRAMEWORK_CONTEXT}), suggest the most sustainable logistics path (considering carbon footprint, node proximity, and scientific thrust alignment).
  Provide a technical recommendation for the vendor.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return { text: response.text || "Optimization unavailable." };
  } catch (error) {
    return { text: "Logistics Oracle is offline." };
  }
};

export const getDeFiIntelligence = async (transaction: any): Promise<AIResponse> => {
  const ai = getAI();
  const prompt = `Act as an EnvirosAgro DeFi Analyst. Analyze this currency exchange/withdrawal: ${JSON.stringify(transaction)}. 
  Calculate the EOS-aligned exchange rate and justify it based on global agricultural liquidity and the sustainability of the target currency. 
  Provide a summary of the bridge security (ZK-Rollup confirmation times).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
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
      systemInstruction: `You are an EnvirosAgro AI Expert. Use the following framework logic for all technical answers: ${FRAMEWORK_CONTEXT}. Be precise, scientific, and help users navigate EOS modules.`,
      tools: useSearch ? [{ googleSearch: {} }] : undefined,
    },
    history: history,
  });

  try {
    const response = await chat.sendMessage({ message });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "I am currently unable to answer.",
      sources: sources as GroundingChunk[]
    };
  } catch (error) {
    console.error("Chat error:", error);
    return { text: "Error communicating with AI expert." };
  }
};
