import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("API_KEY missing");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function draftProposal(title: string, description: string, thrust: string): Promise<string> {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Draft a detailed proposal based on the following:
    Title: ${title}
    Description: ${description}
    Thrust: ${thrust}
    
    The proposal should be professional, structured, and focused on sustainability and resilience.`,
  });
  return response.text || '';
}

export async function calculateImpactScore(title: string, description: string, fundingRequest: number): Promise<number> {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Calculate an impact score (0-100) for the following proposal:
    Title: ${title}
    Description: ${description}
    Funding Request: ${fundingRequest} EAT
    
    The score should reflect potential societal, environmental, and technological impact. Return only the number.`,
  });
  return parseInt(response.text || '0', 10);
}

export async function predictYield(cropType: string, soilData: any, weatherData: any): Promise<string> {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Predict the yield for ${cropType} based on the following:
    Soil Data: ${JSON.stringify(soilData)}
    Weather Data: ${JSON.stringify(weatherData)}
    
    Provide a predicted yield range and recommendations for optimization.`,
  });
  return response.text || '';
}
