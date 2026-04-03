import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function draftProposal(title: string, description: string, thrust: string): Promise<string> {
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
