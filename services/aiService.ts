import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are the ENVIROS_AGRO Strategic AI Oracle. You speak in a highly technical, industrial-military tone. You specialize in blockchain-native agriculture and IoT mesh optimization.",
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
  } catch (error) {
    console.error("AI Strategic Analysis Failed:", error);
    return {
      title: "CONNECTION_FAILURE",
      analysis: "Unable to establish neural link with Gemini Cluster.",
      recommendations: ["Manually review telemetry logs.", "Reconnect Mesh Uplink."],
      riskLevel: "HIGH",
      confidence: 0
    };
  }
}
