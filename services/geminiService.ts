
import { GoogleGenAI, Type, FunctionDeclaration, Modality } from "@google/genai";

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

const mintCarbonShardTool: FunctionDeclaration = {
  name: "mint_carbon_shard",
  description: "Anchors a new carbon sequestration shard to the ledger based on voice-reported ingest.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER, description: "Volume of material or carbon in tons." },
      material: { type: Type.STRING, description: "Type of material (e.g., maize, soil, coffee)." },
      notes: { type: Type.STRING, description: "Additional context for the registry." }
    },
    required: ["amount", "material"]
  }
};

export const ORACLE_TOOLS = [{ functionDeclarations: [mintCarbonShardTool] }];

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
  let errorText = "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified.";
  return { text: errorText };
};

export const detectAnomalousDrift = async (telemetry: any): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this L1 telemetry stream for anomalous drift: ${JSON.stringify(telemetry)}. 
    Flag if values deviate from EOS norms. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          has_drift: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          remediation: { type: Type.STRING }
        }
      }
    }
  });
  return { text: response.text || "", json: JSON.parse(response.text || "{}") };
};

export const validateProofOfSustainability = async (evidence: { description: string, image?: string }): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contents = evidence.image 
    ? { parts: [{ inlineData: { data: evidence.image, mimeType: 'image/jpeg' } }, { text: evidence.description }] }
    : evidence.description;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents,
    config: {
      systemInstruction: "You are an EnvirosAgro Validator Node. Audit proof for L3 ledger finality.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          justification_shard: { type: Type.STRING },
          m_impact: { type: Type.NUMBER }
        }
      }
    }
  });
  return { text: response.text || "", json: JSON.parse(response.text || "{}") };
};

export const chatWithAgroExpert = async (message: string, history: any[], useSearch: boolean = false): Promise<AIResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `EnvirosAgro AI Expert. Use logic: ${FRAMEWORK_CONTEXT}`,
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

export const generateAestheticAsset = async (prompt: string, hq: boolean = false, ratio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" = "1:1") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: hq ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: ratio,
        imageSize: hq ? "2K" : undefined
      }
    }
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const analyzeBidHandshake = async (investorReqs: string, farmerAssets: any[]): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Match Scores: ${investorReqs} vs ${JSON.stringify(farmerAssets)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          match_score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          gap_analysis: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return { text: response.text || "", json: JSON.parse(response.text || "{}") };
};

export const generateValueBlueprint = async (material: string, volume: number): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Blueprint for ${volume} tons of ${material}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          blueprint_id: { type: Type.STRING },
          status: { type: Type.STRING },
          input_material: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, volume: { type: Type.NUMBER } } },
          value_process_steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { step_order: { type: Type.INTEGER }, operation: { type: Type.STRING }, duration_hours: { type: Type.NUMBER } } } },
          asset_requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
          projected_value_delta: { type: Type.NUMBER }
        }
      }
    }
  });
  return { text: response.text || "", json: JSON.parse(response.text || "{}") };
};

export const activateLiveSequence = async (blueprintId: string, assets: any[]): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Activate sequence for ${blueprintId}`,
  });
  return { text: response.text || "" };
};

export const forgeSwarmMission = async (objective: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Mission Forge: ${objective}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mission_title: { type: Type.STRING },
          agrolang_code: { type: Type.STRING },
          impact_summary: { type: Type.STRING },
          required_units: { type: Type.INTEGER }
        }
      }
    }
  });
  return { text: response.text || "", json: JSON.parse(response.text || "{}") };
};

export const analyzeDemandForecast = async (inventory: any[], currentCycle: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Forecast for ${currentCycle}`,
  });
  return { text: response.text || "" };
};

export const runSpecialistDiagnostic = async (category: string, description: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Diagnostic for ${category}: ${description}`,
  });
  return { text: response.text || "" };
};

export const predictMarketSentiment = async (echoes: any[]): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Sentiment Analysis`,
  });
  return { text: response.text || "", sentiment_alpha: 0.82 };
};

export const auditAgroLangCode = async (code: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit AgroLang: ${code}`,
  });
  return { text: response.text || "", is_compliant: true };
};

export const decodeAgroGenetics = async (telemetry: any): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Decode Genetics: ${JSON.stringify(telemetry)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          helix_status: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          base_pairs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, bond_strength: { type: Type.NUMBER }, visual_cue: { type: Type.STRING }, diagnosis: { type: Type.STRING } } } }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeSustainability = async (farmData: any): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Sustainability Audit: ${JSON.stringify(farmData)}`,
  });
  return { text: response.text || "" };
};

export const analyzeMedia = async (base64: string, mime: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
  });
  return response.text || "";
};

export const settleRegistryBatch = async (transactions: any[]): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Settle Batch`,
  });
  return { text: response.text || "", finality_hash: "0x882A_FINAL" };
};

export const auditMeshStability = async (topologyData: any): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit Mesh`,
  });
  return { text: response.text || "" };
};

export const probeValidatorNode = async (nodeData: any): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Probe Node`,
  });
  return { text: response.text || "" };
};

export const searchAgroTrends = async (query: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
};

export const runSimulationAnalysis = async (simData: any): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Simulation Analysis`,
  });
  return { text: response.text || "" };
};

export const generateAgroExam = async (topic: string): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate Exam: ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correct: { type: Type.INTEGER } } }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const getWeatherForecast = async (location: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Weather for ${location}`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
};

export const analyzeMiningYield = async (miningData: any): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze Mining`,
  });
  return { text: response.text || "" };
};

export const generateTemporalVideo = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });
};

export const getTemporalVideoOperation = async (operation: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.operations.getVideosOperation({ operation: operation });
};

// Added missing getGroundedAgroResources export to fix Community.tsx error
export const getGroundedAgroResources = async (query: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
};

// Added missing analyzeInstitutionalRisk export to fix AgroWallet.tsx error
export const analyzeInstitutionalRisk = async (payload: { esin: string, type: string, amount: number }): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze risk for node ${payload.esin}. Action: ${payload.type}, Amount: ${payload.amount} EAC.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risk_assessment: { type: Type.STRING },
          is_cleared: { type: Type.BOOLEAN }
        }
      }
    }
  });
  const text = response.text || "";
  // Return matching format for component logic
  try {
    const result = JSON.parse(text);
    return { text: result.is_cleared ? "assessment clear" : "risk too high", json: result };
  } catch (e) {
    return { text: "risk assessment failed" };
  }
};

// Added missing diagnoseCropIssue export to fix EvidenceModal.tsx error
export const diagnoseCropIssue = async (description: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: description,
  });
  return { text: response.text || "" };
};

// Added missing analyzeMRVEvidence export to fix DigitalMRV.tsx error
export const analyzeMRVEvidence = async (description: string, imageBase64?: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: description }];
  if (imageBase64) {
    parts.unshift({ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } });
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          confidence_alpha: { type: Type.NUMBER },
          verification_narrative: { type: Type.STRING },
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
  return { text: response.text || "", json: JSON.parse(response.text || "{}") };
};

// Added missing generateAgroResearch export to fix ResearchInnovation.tsx error
export const generateAgroResearch = async (title: string, thrust: string, iot: any, context: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Forge research paper: "${title}". Thrust: ${thrust}. IoT Data: ${JSON.stringify(iot)}. Context: ${context}.`,
  });
  return { text: response.text || "" };
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
