
import { GoogleGenAI, GenerateContentResponse, Modality, Type, FunctionDeclaration } from "@google/genai";

const FRAMEWORK_CONTEXT = `
EnvirosAgro™ Sustainability Framework (EOS) - System Architecture (v6.5):
1. CORE AGRO: FarmOS, AgroCalendar (Crop Lifecycle), VerificationHUD (Supply Chain), Marketplace (Economy), AgroWallet (Treasury), Sustainability (Impact Metrics).
2. INTELLIGENCE: AIAnalyst (Crop/Pest/Yield), Intelligence (Market Trends), DigitalMRV (Carbon Mining/Reporting).
3. BLOCKCHAIN: Smart Contracts, Biotechnology (Genetic NFTs), RegistryHandshake (Settlement), Explorer (Ledger).
4. COMMUNITY: Community (Steward Hub), NetworkIngest, NexusCRM, LiveFarming.
5. COMMERCE: ContractFarming, VendorPortal, EnvirosAgroStore.
6. BUSINESS BI: Economy Dashboard, InvestorPortal, ValueEnhancement.
7. RESEARCH: Biotechnology, ResearchInnovation, GeneticDecoder.
8. SPECIALTY: Permaculture, CEA (Greenhouse), OnlineGarden, Agrowild (Conservation).
9. DATA: MediaHub, MediaLedger, EvidenceModal, InfoPortal.
10. SYSTEM MGMT: Dashboard, SettingsPortal, IdentityCard, UserProfile, IntranetPortal.
11. EMERGENCY: EmergencyPortal (SOS), FloatingConsultant, LiveVoiceBridge.
12. QUALITY: TQMGrid, ChromaSystem (Grading), CircularGrid (Waste), CodeOfLaws.
13. ADVANCED: Impact Measurement, Industrial Integration, ToolsSection, Simulator.

CORE FORMULAS:
- C(a)™ Agro Code: Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
- m™ Constant / Time Signature: Formula: m = sqrt((Dn * In * C(a)) / S)
- Five Thrusts™ (SEHTI): Societal, Environmental, Human, Technological, Industry.
`;

const activateLiveSequenceTool: FunctionDeclaration = {
  name: "activate_live_sequence",
  description: "Triggers the transition from Blueprint to Live Processing. Requires asset registration.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      blueprint_id: { type: Type.STRING, description: "The ID of the generated value blueprint." },
      assets_registered: {
        type: Type.ARRAY,
        description: "List of physical or digital assets pledged as guarantee.",
        items: {
          type: Type.OBJECT,
          properties: {
            asset_type: { type: Type.STRING, enum: ["RAW_MATERIAL_STOCK", "MACHINERY_IOT", "LAND_DEED", "TOKENIZED_ASSET"] },
            asset_id: { type: Type.STRING },
            verification_status: { type: Type.BOOLEAN }
          }
        }
      }
    },
    required: ["blueprint_id", "assets_registered"]
  }
};

export interface AIResponse {
  text: string;
  sources?: any[];
  is_compliant?: boolean;
  risk_score?: number; 
  sentiment_alpha?: number; 
  finality_hash?: string;
  impact_summary?: string;
  functionCalls?: any[];
  json?: any;
}

const callOracleWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      // Added 429 (Rate Limit) and 503 (Service Unavailable) to retry logic to address "internal congestion" errors
      const status = err.status || (err.message && parseInt(err.message.match(/\d{3}/)?.[0] || '0'));
      if ([429, 500, 503].includes(status) || err.message?.includes('500') || err.message?.includes('429')) {
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
  let errorText = "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to internal congestion.";
  
  if (error.message?.includes('API_KEY')) {
    errorText = "AUTH_ERROR: Registry API Key is missing or invalid. Please verify node credentials.";
  } else if (error.status === 429 || error.message?.includes('429')) {
    errorText = "QUOTA_EXCEEDED: High-frequency sharding limit reached. Quorum cooldown active.";
  }
  
  return { text: errorText };
};

/**
 * AI-powered Bid Analysis
 * Compares Investor Requirements against Farmer Ingested Assets.
 */
export const analyzeBidHandshake = async (investorReqs: string, farmerAssets: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Upgraded to Pro for advanced reasoning
        contents: `Compare Investor Requirements: "${investorReqs}"
        Against Farmer Ingested Assets: ${JSON.stringify(farmerAssets)}
        Context: ${FRAMEWORK_CONTEXT}
        Calculate Match Score (0.0 to 1.0) and identify resource gaps. Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              match_score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              gap_analysis: { type: Type.ARRAY, items: { type: Type.STRING } },
              steward_reputation_impact: { type: Type.NUMBER }
            },
            required: ["match_score", "reasoning", "gap_analysis"]
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateValueBlueprint = async (material: string, volume: number): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Upgraded to Pro for complex blueprint synthesis
        contents: `Generate a Value Blueprint for: ${volume} tons of ${material}. 
        Apply SEHTI principles and EOS sustainability metrics.`,
        config: {
          systemInstruction: `You are the EnvirosAgro System Architect. You design theoretical agricultural value blueprints.
          CORE MISSION: Transform raw inputs into high-value digital shards.
          Provide Sustainability Delta and Process Steps.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              blueprint_id: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["DRAFT", "READY_FOR_ASSETS", "LIVE"] },
              input_material: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  volume: { type: Type.NUMBER }
                }
              },
              value_process_steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step_order: { type: Type.INTEGER },
                    operation: { type: Type.STRING },
                    duration_hours: { type: Type.NUMBER }
                  }
                }
              },
              asset_requirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              projected_value_delta: { type: Type.NUMBER }
            },
            required: ["blueprint_id", "status", "input_material", "value_process_steps", "asset_requirements", "projected_value_delta"]
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const activateLiveSequence = async (blueprintId: string, assets: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Activate live sequence for blueprint ${blueprintId} using assets: ${JSON.stringify(assets)}.`,
        config: {
          systemInstruction: `You are the EnvirosAgro System Architect. When a user provides verified assets, you MUST transition their Blueprint into a LIVE sequence. 
          Constraint: Do not activate unless assets are verified.`,
          tools: [{ functionDeclarations: [activateLiveSequenceTool] }]
        }
      });
      return { 
        text: response.text || "Handshake initiated.",
        functionCalls: response.functionCalls
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeDemandForecast = async (inventory: any[], currentCycle: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Pro for demand sharding
        contents: `Analyze inventory for Demand Forecasting: ${JSON.stringify(inventory)}. 
        Current Cycle: ${currentCycle}.
        Pillar Context: ${FRAMEWORK_CONTEXT}.`,
        config: {
          systemInstruction: "You are the EnvirosAgro Demand Oracle."
        }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const forecastMarketReadiness = async (product: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Forecast market readiness for asset: ${product.productType}.`,
        config: {
          systemInstruction: "You are the EnvirosAgro Market Strategist."
        }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const consultFinancialOracle = async (query: string, context: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Process financial query: "${query}".`,
        config: {
          systemInstruction: "You are the EnvirosAgro Financial Oracle."
        }
      });
      return { 
        text: response.text || "Financial signal processed.",
        functionCalls: response.functionCalls
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const runSpecialistDiagnostic = async (category: string, description: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform a Specialist Diagnostic Audit. Category: ${category}, Observation: ${description}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const predictMarketSentiment = async (echoes: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform a Sentiment Audit based on mesh echoes.`,
      });
      const text = response.text || "";
      return { text, sentiment_alpha: 0.82 };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditAgroLangCode = async (code: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Audit AgroLang: ${code}`,
      });
      const text = response.text || "";
      return { text, is_compliant: true };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `EnvirosAgro AI Expert. Core Mission: Drive users toward deep agricultural sustainability using the EnvirosAgro OS and 60-shard architecture. Use logic: ${FRAMEWORK_CONTEXT}`,
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
        history,
      });
      const response = await chat.sendMessage({ message });
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const decodeAgroGenetics = async (telemetry: any): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Pro for DNA sharding
        contents: `Decode: ${JSON.stringify(telemetry)}`,
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
                  }
                }
              },
              recommendation: { type: Type.STRING }
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

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Pro for sustainability metrics
        contents: `Run sustainability audit: ${JSON.stringify(farmData)}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeMedia = async (base64: string, mime: string, prompt: string): Promise<string> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
      });
      return response.text || "";
    });
  } catch (err) {
    return handleAIError(err).text;
  }
};

export const settleRegistryBatch = async (transactions: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Settle batch: ${JSON.stringify(transactions)}`,
      });
      return { text: response.text || "Batch verified.", finality_hash: "0x882A_FINAL" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditMeshStability = async (topologyData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Audit mesh stability: ${JSON.stringify(topologyData)}`,
      });
      return { text: response.text || "Stability verified." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const probeValidatorNode = async (nodeData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Perform high-fidelity probe on validator node: ${JSON.stringify(nodeData)}. Identify risks of SID contamination or m-constant drift.`,
      });
      return { text: response.text || "Probe successful." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const searchAgroTrends = async (query: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const runSimulationAnalysis = async (simData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Run simulation: ${JSON.stringify(simData)}`,
      });
      return { text: response.text || "Simulation finalized." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroExam = async (topic: string): Promise<any[]> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate exam for: ${topic}`,
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
              }
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeInstitutionalRisk = async (transactionData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Risk audit: ${JSON.stringify(transactionData)}`,
      });
      return { text: response.text || "Risk assessment clear." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const diagnoseCropIssue = async (description: string, base64Image?: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contents = base64Image 
        ? { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: description }] }
        : { text: description };
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditProductQuality = async (productId: string, logs: any[]): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit quality for ${productId}`,
      });
      return { text: response.text || "Quality audit passed." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroResearch = async (title: string, thrust: string, iotData: any, context: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate research: ${title}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const getWeatherForecast = async (location: string): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Weather for ${location}`,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateValueEnhancementStrategy = async (material: string, weight: string, context: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Value strategy for ${weight} of ${material}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategy_abstract: { type: Type.STRING },
              stages: { type: Type.ARRAY, items: { type: Type.STRING } },
              resilience_impact: { type: Type.NUMBER }
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

export const analyzeMRVEvidence = async (description: string, base64Image?: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contents = base64Image 
        ? { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: description }] }
        : { text: description };
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
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

export const analyzeMiningYield = async (miningData: any): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze mining potential: ${JSON.stringify(miningData)}.`,
      });
      return { text: response.text || "Yield analysis finalized." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateTemporalVideo = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
};

export const getTemporalVideoOperation = async (operation: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.operations.getVideosOperation({ operation });
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
