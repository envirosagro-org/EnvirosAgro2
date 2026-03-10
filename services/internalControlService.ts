
import { GoogleGenAI, Type } from "@google/genai";
import { InternalControlState, UserRole } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function dispatchInternalControls(userRole: UserRole, currentPath: string): Promise<InternalControlState> {
  const prompt = `
    As the EnvirosAgro AI Internal Control Dispatcher, analyze the current system state for a user with role: ${userRole} at path: ${currentPath}.
    
    Generate a JSON response following this schema:
    {
      "balanceOfPowers": {
        "stewardship": number (0-100),
        "governance": number (0-100),
        "treasury": number (0-100),
        "intelligence": number (0-100)
      },
      "activeRules": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "protocol": "string",
          "isActive": boolean,
          "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
        }
      ],
      "responsibilities": [
        {
          "id": "string",
          "role": "${userRole}",
          "task": "string",
          "status": "PENDING" | "ACTIVE",
          "priority": number
        }
      ],
      "globalAnalysis": {
        "networkHealth": number (0-100),
        "totalTreasury": number,
        "systemLiquidity": number,
        "userLiquidity": number
      }
    }

    Ensure the rules and responsibilities are aligned with the EnvirosAgro Blockchain operations sequence and immutable internal control protocols.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            balanceOfPowers: {
              type: Type.OBJECT,
              properties: {
                stewardship: { type: Type.NUMBER },
                governance: { type: Type.NUMBER },
                treasury: { type: Type.NUMBER },
                intelligence: { type: Type.NUMBER }
              },
              required: ["stewardship", "governance", "treasury", "intelligence"]
            },
            activeRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  protocol: { type: Type.STRING },
                  isActive: { type: Type.BOOLEAN },
                  severity: { type: Type.STRING }
                },
                required: ["id", "name", "description", "protocol", "isActive", "severity"]
              }
            },
            responsibilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  role: { type: Type.STRING },
                  task: { type: Type.STRING },
                  status: { type: Type.STRING },
                  priority: { type: Type.NUMBER }
                },
                required: ["id", "role", "task", "status", "priority"]
              }
            },
            globalAnalysis: {
              type: Type.OBJECT,
              properties: {
                networkHealth: { type: Type.NUMBER },
                totalTreasury: { type: Type.NUMBER },
                systemLiquidity: { type: Type.NUMBER },
                userLiquidity: { type: Type.NUMBER }
              },
              required: ["networkHealth", "totalTreasury", "systemLiquidity", "userLiquidity"]
            }
          },
          required: ["balanceOfPowers", "activeRules", "responsibilities", "globalAnalysis"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Internal Control Dispatcher Error:", error);
    // Fallback state
    return {
      balanceOfPowers: { stewardship: 50, governance: 50, treasury: 50, intelligence: 50 },
      activeRules: [],
      responsibilities: [],
      globalAnalysis: { networkHealth: 100, totalTreasury: 1000000, systemLiquidity: 500000, userLiquidity: 500000 }
    };
  }
}
