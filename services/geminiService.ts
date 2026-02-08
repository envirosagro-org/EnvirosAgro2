
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const FRAMEWORK_CONTEXT = `
EnvirosAgro™ Sustainability Framework (EOS):
- C(a)™ Agro Code: Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
- m™ Constant / Time Signature: Formula: m = sqrt((Dn * In * C(a)) / S)
- Five Thrusts™ (SEHTI): Societal, Environmental, Human, Technological, Industry.
- Code of Laws: Statutes governing Land Trusteeship, Sabbath cycles, and Bio-Signal Harmony.
- Tokenz Institutional DeFi: RWA sharding, liquidity bridges, and risk-weighted capital deployment.
- AgroMusika: Bio-electric sonic remediation (432Hz, 528Hz, etc.) for cellular soil repair.
`;

export interface AIResponse {
  text: string;
  sources?: any[];
  is_compliant?: boolean;
  risk_score?: number; 
  sentiment_alpha?: number; 
  finality_hash?: string;
  impact_summary?: string;
}

const callOracleWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (err.status === 500 || (err.message && err.message.includes('500'))) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

const handleAIError = (error: any): AIResponse => {
  console.error("Gemini API Error:", error);
  return { 
    text: "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to internal congestion." 
  };
};

// Add missing runSpecialistDiagnostic for specialized audits
export const runSpecialistDiagnostic = async (category: string, description: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a Specialist Diagnostic Audit. 
        Category: ${category}
        Observation: ${description}
        
        Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          systemInstruction: "You are the EnvirosAgro Specialist Oracle. Provide technical diagnostics and alignment shards."
        }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const settleRegistryBatch = async (transactions: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform an Institutional Settlement Audit on this transaction batch: ${JSON.stringify(transactions)}.
        1. Analyze the aggregate impact on the global m-constant.
        2. Verify adherence to the 'Sabbath-Yajna' fallow protocols.
        3. Generate a 'Finality Abstract'.
        
        Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          systemInstruction: "You are the EnvirosAgro Finality Oracle. You ensure that economic sharding never compromises biological resonance."
        }
      });
      const text = response.text || "";
      return { 
        text,
        finality_hash: `0xSETTLE_${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
        impact_summary: text.split('\n')[0]
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const predictMarketSentiment = async (echoes: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a Sentiment Audit on these global network echoes: ${JSON.stringify(echoes.slice(0, 20))}.
        Evaluate the "Community Trust Index" based on SEHTI principles. 
        Return a Sentiment Alpha score (0.0 to 1.0) and a brief reasoning shard.`,
        config: {
          systemInstruction: "You are the EnvirosAgro Economic Oracle. Translate social signals into market resilience factors."
        }
      });
      const text = response.text || "";
      const scoreMatch = text.match(/Alpha:?\s*(0\.\d+)/i);
      return { 
        text, 
        sentiment_alpha: scoreMatch ? parseFloat(scoreMatch[1]) : 0.82 
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditMeshStability = async (nodeData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the following mesh topology metrics: ${JSON.stringify(nodeData)}. 
        Identify nodes at risk of SID (Social Influenza) contamination.
        Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeInstitutionalRisk = async (txData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform an Institutional Risk Audit on the following sharding request: ${JSON.stringify(txData)}. 
        Framework Context: ${FRAMEWORK_CONTEXT}.
        Assign a Risk Score (0-100) and provide a "VERDICT" (PROCEED or CAUTION).`,
        config: {
          thinkingConfig: { thinkingBudget: 8000 }
        }
      });
      const text = response.text || "";
      const riskMatch = text.match(/Risk Score:?\s*(\d+)/i);
      return { 
        text, 
        risk_score: riskMatch ? parseInt(riskMatch[1]) : 20,
        is_compliant: !text.includes('CAUTION')
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditAgroLangCode = async (code: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Audit the following AgroLang Shard for EOS Framework Compliance. 
        Code: ${code}
        Context: ${FRAMEWORK_CONTEXT}
        Return "COMPLIANCE_VERDICT: COMPLIANT" if valid.`,
        config: {
          thinkingConfig: { thinkingBudget: 8000 }
        }
      });
      const text = response.text || "";
      return { 
        text,
        is_compliant: text.includes('COMPLIANT') && !text.includes('VIOLATION')
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `EnvirosAgro AI Expert. Use logic: ${FRAMEWORK_CONTEXT}`,
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
        history,
      });
      const response = await chat.sendMessage({ message });
      return { 
        text: response.text || "", 
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any 
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const decodeAgroGenetics = async (telemetry: any): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Decode agricultural telemetry: ${JSON.stringify(telemetry)}. Return JSON matching schema.`,
        config: {
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
    });
  } catch (err) {
    throw err;
  }
};

export const analyzeMiningYield = async (vouchData: any): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze mining session: ${JSON.stringify(vouchData)}. Return JSON only. Context: ${FRAMEWORK_CONTEXT}`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    });
  } catch (err) {
    throw err;
  }
};

export const generateAgroExam = async (topic: string): Promise<any[]> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 multiple-choice questions for ${topic} within EnvirosAgro context. Return JSON array of objects with {question, options[], correct_index}.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correct: { type: Type.INTEGER }
              },
              required: ["question", "options", "correct"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  } catch (err) {
    throw err;
  }
};

export const getGroundedAgroResources = async (query: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { 
        text: response.text || "", 
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] 
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const getWeatherForecast = async (location: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Fetch technical weather telemetry for ${location} for industrial agriculture.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { 
        text: response.text || "", 
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] 
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeMRVEvidence = async (desc: string, base64?: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const parts: any[] = [{ text: desc }];
      if (base64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64 } });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verification_narrative: { type: Type.STRING },
              confidence_alpha: { type: Type.NUMBER },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  estimated_dbh_cm: { type: Type.NUMBER },
                  biomass_tonnes: { type: Type.NUMBER },
                  carbon_sequestration_potential: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  } catch (err) {
    throw err;
  }
};

export const generateValueEnhancementStrategy = async (material: string, weight: string, context: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Design value enhancement strategy for ${weight} of ${material}. Context: ${context}`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategy_abstract: { type: Type.STRING },
              estimated_value_boost: { type: Type.NUMBER }
            },
            required: ["strategy_abstract"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  } catch (err) {
    throw err;
  }
};

export const analyzeMedia = async (base64: string, mime: string, prompt: string): Promise<string> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
      });
      return response.text || "";
    });
  } catch (err) {
    return "Error analyzing media. Oracle server busy.";
  }
};

export const searchAgroTrends = async (q: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: q,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are the EnvirosAgro Strategic Trend Oracle. Extract latest trends and relate findings to the m-constant framework."
        }
      });
      return { 
        text: response.text || "", 
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] 
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditProductQuality = async (id: string, logs: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit ID ${id}. Logs: ${JSON.stringify(logs)}. Context: TQM Sharding.`,
        config: { thinkingConfig: { thinkingBudget: 2000 } }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const diagnoseCropIssue = async (desc: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: desc,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Run a sustainability audit on: ${JSON.stringify(farmData)}. Context: ${FRAMEWORK_CONTEXT}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroResearch = async (topic: string, thrust: string, iotData: any, context: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Synthesize research shard. Topic: ${topic}, Thrust: ${thrust}, IoT: ${JSON.stringify(iotData)}, Context: ${context}.`,
        config: { thinkingConfig: { thinkingBudget: 8000 } }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

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
