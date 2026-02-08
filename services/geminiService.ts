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
  risk_score?: number; // 0-100
  sentiment_alpha?: number; // 0.0 - 1.0
  finality_hash?: string;
  impact_summary?: string;
}

/**
 * Resilient wrapper to handle transient 500 errors from Gemini API
 */
const callOracleWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      // If it's a 500 error, wait and retry
      if (err.status === 500 || (err.message && err.message.includes('500'))) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i))); // Exponential backoff
        continue;
      }
      throw err; // For other errors, fail immediately
    }
  }
  throw lastError;
};

const handleAIError = (error: any): AIResponse => {
  console.error("Gemini API Error:", error);
  return { 
    text: "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to an internal server congestion (Error 500)." 
  };
};

export const settleRegistryBatch = async (transactions: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform an Institutional Settlement Audit on this transaction batch: ${JSON.stringify(transactions)}.
        1. Analyze the aggregate impact on the global m-constant.
        2. Verify adherence to the 'Sabbath-Yajna' fallow protocols.
        3. Generate a 'Finality Abstract' and a unique 64-bit settlement hash.
        
        Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          systemInstruction: "You are the EnvirosAgro Finality Oracle. You ensure that economic sharding never compromises biological resonance."
        }
      }) as GenerateContentResponse;
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a Sentiment Audit on these global network echoes: ${JSON.stringify(echoes.slice(0, 20))}.
        Evaluate the "Community Trust Index" based on SEHTI principles. 
        How should this impact the EAC pricing multipliers for agricultural shards?
        Provide a Sentiment Alpha score (0.0 to 1.0) and a brief reasoning shard.`,
        config: {
          systemInstruction: "You are the EnvirosAgro Economic Oracle. Translate social signals into market resilience factors."
        }
      }) as GenerateContentResponse;
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the following mesh topology metrics: ${JSON.stringify(nodeData)}. 
        Identify nodes at risk of SID (Social Influenza) contamination and suggest rerouting shards to high-resonance clusters.
        Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          thinkingConfig: { thinkingBudget: 4000 } // Reduced budget for stability
        }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeInstitutionalRisk = async (txData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform an Institutional Risk Audit on the following sharding request: ${JSON.stringify(txData)}. 
        Framework Context: ${FRAMEWORK_CONTEXT}.
        Evaluate m-constant stability, network liquidity depth, and potential for SID-contamination.
        Assign a Risk Score (0-100) and provide a "VERDICT" (PROCEED or CAUTION).`,
        config: {
          thinkingConfig: { thinkingBudget: 8000 }
        }
      }) as GenerateContentResponse;
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

export const calibrateSonicResonance = async (telemetry: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze acoustic telemetry for node ${telemetry.node}: ${JSON.stringify(telemetry)}. 
        Based on the EnvirosAgro Framework, recommend a corrective Solfeggio frequency (e.g. 432Hz for healing, 528Hz for repair).
        Explain the biological impact on the soil microbial shard.`,
        config: {
          systemInstruction: "You are the AgroMusika Bio-Sonic Oracle. Provide technical frequency calibration shards."
        }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditAgroLangCode = async (code: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Audit the following AgroLang Shard for EOS Framework Compliance. 
        Code:
        ${code}
        
        Context: ${FRAMEWORK_CONTEXT}
        
        Rules:
        1. Check for 'CONSTRAIN' keywords (Governance compliance).
        2. Identify m-constant drift risks.
        3. Verify 'COMMIT_SHARD' finality logic.
        
        Return a technical audit log and a final "COMPLIANCE_VERDICT" (COMPLIANT or VIOLATION).`,
        config: {
          thinkingConfig: { thinkingBudget: 8000 }
        }
      }) as GenerateContentResponse;
      
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

export const validateBlockSustainability = async (blockHash: string, transactions: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a Neural Audit on Block ${blockHash}. Transactions: ${JSON.stringify(transactions)}. Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          systemInstruction: "You are the EnvirosAgro Consensus Auditor. Verify if the block's transactions align with the m-constant and C(a) framework. Assign a finality confidence score (0-100%).",
          thinkingConfig: { thinkingBudget: 4000 }
        }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
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
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const runSpecialistDiagnostic = async (category: string, description: string, imageBase64?: string): Promise<AIResponse> => {
  const parts: any[] = [{ text: `EnvirosAgro ${category} Specialist. Context: ${FRAMEWORK_CONTEXT}. Diagnostic Request: ${description}` }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: { parts },
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const decodeAgroGenetics = async (telemetry: any): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Decode this agricultural telemetry: ${JSON.stringify(telemetry)}. Follow the Genetic Decoder rules and return JSON only.`,
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this mining session: ${JSON.stringify(vouchData)}. Context: ${FRAMEWORK_CONTEXT}`,
        config: {
          responseMimeType: "application/json"
        }
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a 5-question exam for ${topic}. Context: ${FRAMEWORK_CONTEXT}`,
        config: { responseMimeType: "application/json" }
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const getWeatherForecast = async (location: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Fetch technical weather telemetry for ${location}. Context: Industrial Agriculture.`,
        config: { tools: [{ googleSearch: {} }] }
      }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeMRVEvidence = async (desc: string, base64?: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const parts: any[] = [{ text: desc }];
      if (base64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64 } });
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: { responseMimeType: "application/json" }
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Design strategy for ${weight} of ${material}. Context: ${context}`,
        config: { responseMimeType: "application/json" }
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
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
      }) as GenerateContentResponse;
      return response.text || "";
    });
  } catch (err) {
    return "Error analyzing media. Oracle server busy.";
  }
};

export const searchAgroTrends = async (q: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: q,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are the EnvirosAgro Strategic Trend Oracle. Extract the latest agricultural trends focusing on regenerative farming and blockchain integration for carbon credit tracking. Always relate findings back to the m-constant and C(a) growth framework."
        }
      }) as GenerateContentResponse;
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[] };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditProductQuality = async (id: string, logs: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit ID ${id}. Logs: ${JSON.stringify(logs)}. Context: TQM Sharding.`,
        config: { thinkingConfig: { thinkingBudget: 2000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const diagnoseCropIssue = async (desc: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: desc,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Run a sustainability audit on the following farm data: ${JSON.stringify(farmData)}. Context: ${FRAMEWORK_CONTEXT}`,
      }) as GenerateContentResponse;
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroResearch = async (topic: string, thrust: string, iotData: any, context: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Synthesize a formal research paper shard. 
        Topic: ${topic}
        Thrust: ${thrust}
        IoT Data: ${JSON.stringify(iotData)}
        Context: ${context}
        Framework: ${FRAMEWORK_CONTEXT}`,
        config: {
          thinkingConfig: { thinkingBudget: 8000 }
        }
      }) as GenerateContentResponse;
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
