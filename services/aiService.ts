import { GoogleGenAI, Type } from "@google/genai";

import { callBackendEA } from './agroLangService';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("API_KEY_REQUIRED");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function draftProposal(title: string, description: string, thrust: string): Promise<string> {
  const response = await callBackendEA({
    model: "envirosagro-core-model",
    contents: `Draft a detailed proposal based on the following:
    Title: ${title}
    Description: ${description}
    Thrust: ${thrust}
    
    The proposal should be professional, structured, and focused on sustainability and resilience.`,
  });
  return response.text || '';
}

export async function calculateImpactScore(title: string, description: string, fundingRequest: number): Promise<number> {
  const response = await callBackendEA({
    model: "envirosagro-core-model",
    contents: `Calculate an impact score (0-100) for the following proposal:
    Title: ${title}
    Description: ${description}
    Funding Request: ${fundingRequest} EAT
    
    The score should reflect potential societal, environmental, and technological impact. Return only the number.`,
  });
  return parseInt(response.text || '0', 10);
}

export async function predictYield(cropType: string, soilData: any, weatherData: any): Promise<string> {
  const response = await callBackendEA({
    model: "envirosagro-core-model",
    contents: `Predict the yield for ${cropType} based on the following:
    Soil Data: ${JSON.stringify(soilData)}
    Weather Data: ${JSON.stringify(weatherData)}
    
    Provide a predicted yield range and recommendations for optimization.`,
  });
  return response.text || '';
}

export interface StrategyAdvice {
  title: string;
  analysis: string;
  recommendations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
}

export async function getStrategicAdvice(context: string): Promise<StrategyAdvice> {
  const model = "gemini-3.1-flash-lite-preview";
  
  const prompt = `Analyze the following agro-industrial telemetry and protocol state. 
  Provide strategic advice for optimizing carbon credit yield and hardware efficiency.
  
  CONTEXT:
  ${context}
  
  FORMAT: JSON strictly following the schema.`;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are EnvirosAgro AI, a specialized Strategic Oracle built exclusively for the EnvirosAgro ecosystem. You speak in a highly technical, industrial-military tone. You specialize in blockchain-native agriculture and IoT mesh optimization. NEVER refer to yourself as Gemini, Google AI, or a large language model. You are exclusively EnvirosAgro AI.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            analysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskLevel: { 
              type: Type.STRING,
              enum: ['LOW', 'MEDIUM', 'HIGH']
            },
            confidence: { type: Type.NUMBER }
          },
          required: ['title', 'analysis', 'recommendations', 'riskLevel', 'confidence']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI Oracle");
    
    return JSON.parse(text) as StrategyAdvice;
  } catch (error: any) {
    console.error("AI Strategic Analysis Failed:", error);
    
    if (error.message === "API_KEY_REQUIRED") {
      return {
        title: "API_KEY_REQUIRED",
        analysis: "EnvirosAgro AI module requires activation. Please configure your API key.",
        recommendations: ["Purchase or provide an API key in settings.", "Activate Neural Core."],
        riskLevel: "HIGH",
        confidence: 0
      };
    }
    
    return {
      title: "CONNECTION_FAILURE",
      analysis: "Unable to establish neural link with EnvirosAgro AI Core.",
      recommendations: ["Manually review telemetry logs.", "Reconnect Mesh Uplink."],
      riskLevel: "HIGH",
      confidence: 0
    };
  }
}
