import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Palette, 
  Binary, 
  Box, 
  Microscope, 
  Info, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Scale, 
  Thermometer, 
  Users, 
  Leaf, 
  Heart, 
  Loader2, 
  Check,
  Upload, 
  CheckCircle2, 
  Scan, 
  ArrowRight,
  Droplets,
  Radiation,
  Waves,
  Layout,
  Fingerprint,
  Monitor,
  Sun,
  RefreshCw,
  ShieldPlus,
  Terminal,
  Stamp,
  PencilRuler,
  Building,
  Trees,
  Mountain,
  ChevronRight,
  X,
  Download,
  FileText,
  Coins,
  Brush,
  Eraser,
  Printer,
  Undo2,
  Maximize2,
  Trash2,
  Image as ImageIcon,
  Wand2,
  Send,
  Eye,
  Workflow,
  Plus,
  LayoutGrid,
  Share2,
  History,
  Target,
  Dna,
  ShieldAlert,
  Wind,
  Flower2,
  Crown,
  Maximize,
  ArrowUpRight,
  ThermometerSun,
  Layers,
  Circle,
  FlaskConical,
  Atom
} from 'lucide-react';
import { toast } from 'sonner';
import { User, ViewState, MediaShard } from '../types';
import { SectionTabs } from './SectionTabs';
import { HenIcon } from './Icons';
import { chatWithAgroLang, analyzeMedia, callBackendEA } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { generateQuickHash } from '../systemFunctions';

interface ChromaSystemProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
}

const SEHTI_CHROMA_MAPPING = [
  { id: 'societal', thrust: 'Societal', variable: 'W_s', spectrum: 'Warm (Red/Orange/Yellow)', frequency: '432Hz', context: 'Markets, Education', diagnosis: 'Warning: Nutrient Stress', color: '#F2CC8F', icon: Users },
  { id: 'environmental', thrust: 'Environmental', variable: 'B_s', spectrum: 'Bio (Green/Brown/Teal)', frequency: '528Hz', context: 'Production, Waste', diagnosis: 'Health: Chlorophyll Density', color: '#4A7C59', icon: Leaf },
  { id: 'human', thrust: 'Human', variable: 'C_s', spectrum: 'Calm (Blue/Indigo/Violet)', frequency: '396Hz', context: 'Labs, Rest Areas', diagnosis: 'Deficiency: Phosphorus/Fungal', color: '#818cf8', icon: Heart },
  { id: 'lilies', thrust: 'Aesthetic', variable: 'L_s', spectrum: 'Fuchsia (Pink/Gold/Light)', frequency: '440Hz', context: 'Lilies Around, Floriculture', diagnosis: 'Peak: Aesthetic Resonance', color: '#f472b6', icon: Flower2 },
  { id: 'technological', thrust: 'Technological', variable: 'U_s', spectrum: 'UV/IR (Greyscale Mapping)', frequency: '639Hz', context: 'Server Rooms, Robotics', diagnosis: 'Early Detection: Pre-symptomatic', color: '#2F3E46', icon: HenIcon },
];

const ARCHITECTURAL_PALETTES = [
  { zone: 'Growth Zone', name: 'Photosynthetic Green', hex: '#4A7C59', albedo: 0.12, resilience: 'High', function: 'Blends with crops, maximizes psychological connection to nature.' },
  { zone: 'Control Zone', name: 'Slate Tech Grey', hex: '#2F3E46', albedo: 0.08, resilience: 'Standard', function: 'High contrast for robot navigation, reduces screen glare.' },
  { zone: 'Lilies Node', name: 'Celestial Fuchsia', hex: '#f472b6', albedo: 0.35, resilience: 'Ultra', function: 'High spectral albedo for pollinator sharding and aesthetic impact.' },
];

const PRE_CATALOGUED_RESOURCES = [
  { id: 'hibiscus', name: 'Wild Hibiscus Flowers', pigment: 'Anthocyanins', hex: '#B02A50', r: 176, g: 42, b: 80, code: 'EA-HIBIS-V2', context: 'Rich crimson, high-vitality visual sharding' },
  { id: 'woad', name: 'Woad Leaves', pigment: 'Indigotin', hex: '#2D4F7C', r: 45, g: 79, b: 124, code: 'EA-WOAD-B1', context: 'Deep calming indigo, technology nodes' },
  { id: 'marigold', name: 'Marigold Petals', pigment: 'Lutein Yellow', hex: '#F5B041', r: 245, g: 176, b: 65, code: 'EA-MARI-Y6', context: 'High reflectance, protective albedo shield' },
  { id: 'beetroot', name: 'Beetroot Root', pigment: 'Betalain', hex: '#871F54', r: 135, g: 31, b: 84, code: 'EA-BEET-F3', context: 'Vibrant fuchsia, aesthetic lilies resonance' },
  { id: 'walnut', name: 'Black Walnut Hulls', pigment: 'Juglone Brown', hex: '#5C4033', r: 92, g: 64, b: 51, code: 'EA-WALN-BR4', context: 'Organic deep brown, soil carbon integration' },
];

const ChromaSystem: React.FC<ChromaSystemProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'mapping' | 'design' | 'paint' | 'macro' | 'micro'>('mapping');

  // Bioclimatic Parameters (Macro) declared early to allow downstream derived selectors
  const [albedo, setAlbedo] = useState(0.92);
  const [psychScore, setPsychScore] = useState(8);
  const [thermalCoeff, setThermalCoeff] = useState(0.45);
  const [footprint, setFootprint] = useState(0.12);
  const [isCalculatingSc, setIsCalculatingSc] = useState(false);
  const [scResult, setScResult] = useState<{name: string, hex: string} | null>(null);
  
  // Chroma SEHTI Color Mixing States
  const [chlorophyllTealRatio, setChlorophyllTealRatio] = useState(40);
  const [soilOxideRedRatio, setSoilOxideRedRatio] = useState(20);
  const [pollinatorRoseRatio, setPollinatorRoseRatio] = useState(20);
  const [celestialOchreRatio, setCelestialOchreRatio] = useState(20);
  const [customPaintName, setCustomPaintName] = useState('Spectral Foliage White');
  const [customPaintPrice, setCustomPaintPrice] = useState(45);
  const [isAnchoringMarket, setIsAnchoringMarket] = useState(false);
  
  // Sub tab tracking inside Architectural Sc Tab
  const [macroSubTab, setMacroSubTab] = useState<'spec' | 'market'>('spec');
  const [processingState, setProcessingState] = useState<'idle' | 'mixing' | 'binding' | 'titrating' | 'done'>('idle');
  const [processorMessage, setProcessorMessage] = useState('');

  // Natural resources pigment tracking inside Chromatography Tab
  const [microTab, setMicroTab] = useState<'audit' | 'natural'>('audit');
  const [selectedNaturalResource, setSelectedNaturalResource] = useState<string>('hibiscus');
  const [customResourceName, setCustomResourceName] = useState('');
  const [customPigmentName, setCustomPigmentName] = useState('');
  const [isForgingExtraction, setIsForgingExtraction] = useState(false);
  const [extractionResult, setExtractionResult] = useState<string | null>(null);

  // Chroma Market Cloud state listing
  const [marketCloudColors, setMarketCloudColors] = useState<any[]>([
    {
      id: "EA-CHROMA-82-MINT",
      name: "Algal Chlorophyll B-82",
      code: "EA-PAINT-CT50-SR10-PR10-CO30-ALB72",
      hex: "#4E8F79",
      price: 35,
      author: "Steward Alpha",
      esin: "EA-ALPH-8821",
      scValue: 8.2,
      pigments: "Teal 50%, Red 10%, Rose 10%, Ochre 30%",
      status: "Active",
      efficiency: "88%",
      albedo: 0.72,
      purchased: false,
    },
    {
      id: "EA-CHROMA-45-CLAY",
      name: "Terracotta Oxide Red",
      code: "EA-PAINT-CT10-SR70-PR10-CO10-ALB35",
      hex: "#9F3D3D",
      price: 45,
      author: "Gaia Green",
      esin: "EA-GAIA-1104",
      scValue: 4.5,
      pigments: "Teal 10%, Red 70%, Rose 10%, Ochre 10%",
      status: "Active",
      efficiency: "74%",
      albedo: 0.35,
      purchased: false,
    },
    {
      id: "EA-CHROMA-104-ROSE",
      name: "Atrium Celestial Pink",
      code: "EA-PAINT-CT15-SR15-PR50-CO20-ALB85",
      hex: "#CF729E",
      price: 60,
      author: "Aesthetic Rose",
      esin: "EA-LILY-0042",
      scValue: 10.4,
      pigments: "Teal 15%, Red 15%, Rose 50%, Ochre 20%",
      status: "Active",
      efficiency: "96%",
      albedo: 0.85,
      purchased: false,
    }
  ]);

  // Unified color blender utilizing exact SEHTI variables
  const getMixedColor = useMemo(() => {
    const totalRatio = chlorophyllTealRatio + soilOxideRedRatio + pollinatorRoseRatio + celestialOchreRatio;
    if (totalRatio === 0) return "#808080"; // Neutral grey

    // Base colors coordinates in RGB
    // Chlorophyll Teal: (15, 118, 110)
    // Soil Oxide Red: (185, 28, 28)
    // Pollinator Rose Gold: (244, 114, 182)
    // Celestial Ochre: (217, 119, 6)
    let mixedR = (chlorophyllTealRatio * 15 + soilOxideRedRatio * 185 + pollinatorRoseRatio * 244 + celestialOchreRatio * 217) / totalRatio;
    let mixedG = (chlorophyllTealRatio * 118 + soilOxideRedRatio * 28 + pollinatorRoseRatio * 114 + celestialOchreRatio * 119) / totalRatio;
    let mixedB = (chlorophyllTealRatio * 110 + soilOxideRedRatio * 28 + pollinatorRoseRatio * 182 + celestialOchreRatio * 6) / totalRatio;

    // Saturation adjustment governed by psychScore (vibrancy, standard = 5)
    const satCoeff = psychScore / 5;
    const neutralGreyIntensity = 128;
    mixedR = Math.min(255, Math.max(0, neutralGreyIntensity + (mixedR - neutralGreyIntensity) * satCoeff));
    mixedG = Math.min(255, Math.max(0, neutralGreyIntensity + (mixedG - neutralGreyIntensity) * satCoeff));
    mixedB = Math.min(255, Math.max(0, neutralGreyIntensity + (mixedB - neutralGreyIntensity) * satCoeff));

    // Lightness/Reflectance adjustment governed by albedo (reflectance, center = 0.5)
    const reflectanceBoost = (albedo - 0.5) * 2; // -1.0 to 0.9
    if (reflectanceBoost > 0) {
      mixedR = mixedR * (1 - reflectanceBoost) + 255 * reflectanceBoost;
      mixedG = mixedG * (1 - reflectanceBoost) + 255 * reflectanceBoost;
      mixedB = mixedB * (1 - reflectanceBoost) + 255 * reflectanceBoost;
    } else {
      const absorptionCoeff = Math.abs(reflectanceBoost);
      mixedR = mixedR * (1 - absorptionCoeff);
      mixedG = mixedG * (1 - absorptionCoeff);
      mixedB = mixedB * (1 - absorptionCoeff);
    }

    const valueToHex = (num: number) => {
      const hex = Math.round(num).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${valueToHex(mixedR)}${valueToHex(mixedG)}${valueToHex(mixedB)}`.toUpperCase();
  }, [chlorophyllTealRatio, soilOxideRedRatio, pollinatorRoseRatio, celestialOchreRatio, psychScore, albedo]);

  const mixedPaintCode = useMemo(() => {
    return `EA-PAINT-CT${chlorophyllTealRatio}-SR${soilOxideRedRatio}-PR${pollinatorRoseRatio}-CO${celestialOchreRatio}-ALB${Math.round(albedo * 100)}`;
  }, [chlorophyllTealRatio, soilOxideRedRatio, pollinatorRoseRatio, celestialOchreRatio, albedo]);

  const rawScValue = useMemo(() => {
    return (albedo * psychScore) / (thermalCoeff + footprint);
  }, [albedo, psychScore, thermalCoeff, footprint]);

  const handleAnchorAndSell = async () => {
    if (!customPaintName.trim()) {
      toast.error("Color/Paint blueprint name required.");
      return;
    }

    setIsAnchoringMarket(true);
    try {
      const newListing = {
        id: `EA-CHROMA-${Math.floor(rawScValue * 10)}-${generateQuickHash().substring(0, 4).toUpperCase()}`,
        name: customPaintName,
        code: mixedPaintCode,
        hex: getMixedColor,
        price: customPaintPrice,
        author: user.name,
        resin: user.esin,
        scValue: parseFloat(rawScValue.toFixed(2)),
        pigments: `Teal ${chlorophyllTealRatio}%, Red ${soilOxideRedRatio}%, Rose ${pollinatorRoseRatio}%, Ochre ${celestialOchreRatio}%`,
        status: "Active",
        efficiency: `${Math.round(Math.min(100, rawScValue * 10))}%`,
        albedo: albedo,
        purchased: false,
      };

      setMarketCloudColors(prev => [newListing, ...prev]);

      try {
        await saveCollectionItem('media_ledger', {
          title: `CHROMA BLUEPRINT: ${customPaintName}`,
          type: 'ORACLE',
          source: 'Market Cloud',
          author: user.name,
          authorEsin: user.esin,
          timestamp: new Date().toISOString(),
          hash: `0x${generateQuickHash()}`,
          mImpact: (1.5 + Math.random() * 0.3).toFixed(2),
          size: '1.2 KB',
          content: JSON.stringify(newListing),
        });
      } catch (f) {
        console.warn("Firestore save skipped, listing added locally.");
      }

      await onEarnEAC(30, 'CHROMA_BLUEPRINT_LISTED');
      toast.success(`Success! "${customPaintName}" color code listings anchored to Market Cloud.`);
      setMacroSubTab('market');
    } catch (e) {
      toast.error("Ledger registration failed.");
    } finally {
      setIsAnchoringMarket(false);
    }
  };

  const handleProcessPaint = (colorItem: any) => {
    if (processingState !== 'idle') return;

    setProcessingState('mixing');
    setProcessorMessage(`Verifying paint blueprint code "${colorItem.code}" on chain...`);

    setTimeout(() => {
      setProcessingState('binding');
      setProcessorMessage(`Extracting natural chroma pigments & blending with organic soy-based binders...`);

      setTimeout(() => {
        setProcessingState('titrating');
        setProcessorMessage(`Analyzing spectrophotometric properties. Stabilizing reflection curve...`);

        setTimeout(() => {
          setProcessingState('done');
          setProcessorMessage(`Paint batch successfully process-mixed! Pigments verified from EnvirosAgro chroma system. Shipped to local paint outlets.`);

          setMarketCloudColors(prev => prev.map(c => c.id === colorItem.id ? { ...c, purchased: true } : c));
          onEarnEAC(40, `PAINT_PROCESSING_REWARD_${colorItem.id}`);
          toast.success(`Paint batch formulated! Code is active: "${colorItem.code}"`);

          setTimeout(() => {
            setProcessingState('idle');
            setProcessorMessage('');
          }, 4500);
        }, 1800);
      }, 1800);
    }, 1800);
  };

  const handleValueForgeExtraction = async () => {
    let sourceMaterial = "";
    let targetPigment = "";

    if (selectedNaturalResource === 'custom') {
      if (!customResourceName.trim() || !customPigmentName.trim()) {
        toast.error("Resource name and Pigment name are required.");
        return;
      }
      sourceMaterial = customResourceName;
      targetPigment = customPigmentName;
    } else {
      const selected = PRE_CATALOGUED_RESOURCES.find(r => r.id === selectedNaturalResource);
      if (selected) {
        sourceMaterial = selected.name;
        targetPigment = selected.pigment;
      } else {
        toast.error("Invalid natural resource choice.");
        return;
      }
    }

    const processCost = 25;
    if (!await onSpendEAC(processCost, `VALUE_FORGE_PIGMENT_MAPPING_${sourceMaterial.toUpperCase()}`)) {
      return;
    }

    setIsForgingExtraction(true);
    setExtractionResult(null);

    const forensicPrompt = `Act as an expert Bio-chromatography Chemical Engineer for the EnvirosAgro chroma system. Develop a meticulous organic extraction blueprint and value route mapping for:
- Sustainable Natural Source: "${sourceMaterial}"
- Active Organic Pigment: "${targetPigment}"

Provide a detailed manual consisting of instructions for paint formulation, formatting with exact, bold sections:
1. **PIGMENT ATTRIBUTES & CHROMATIC METRICS**: Define the organic chromophore class (anthocyanins, carotenoids, chlorophylls, betalains) and estimate the resulting SEHTI spectrum mapping, albedo factors, and direct formulation compatibility codes (RAL, Pantone) for mixing.
2. **HARVEST & SITE-PREP CONTEXT**: Specify optimal drying indexes, mill grinding speeds, and solid-to-solvent ratios without toxic reactants.
3. **PIGMENT ISOLATION VIA CHROMATOGRAPHY**: Detail a step-by-step Column, Paper, or Gas chromatography purification sequence. Describe mobile phase ratios (e.g. ethanol-water), stationery phase (cellulose/silica), and the target retention factor (Rf values) for high-purity shades.
4. **SUSPENSION, eco-BINDERS & STABILIZERS**: Recommend earth-friendly binding agents (linseed oil, casein, soy proteins, lecithin) to come up with long-term, sun-resilient sustainable paints.
5. **AGGREGATION ROUTE**: Explain how paint processors can execute this extraction in live farming systems to mass manufacture paints with real pigments from EnvirosAgro.`;

    try {
      const res = await chatWithAgroLang(forensicPrompt, []);
      setExtractionResult(res.text);
      onEarnEAC(20, 'VALUE_FORGE_EXTRACTION_COMPLETED');
      toast.success(`Success! Extraction protocol compiled for ${sourceMaterial}.`);
    } catch (e) {
      setExtractionResult(`ZK_ERROR: Connection timed out. Direct manual laboratory parameters below:\n\nMaterial: ${sourceMaterial}\nPigment: ${targetPigment}\nSuggested path: Ethanol-Water reflux combined with Column Chromatography.`);
    } finally {
      setIsForgingExtraction(false);
    }
  };

  // Paint with Nature States
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedThrust, setSelectedThrust] = useState(SEHTI_CHROMA_MAPPING[3]); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isMintingGraphic, setIsMintingGraphic] = useState(false);
  const [graphicAnchored, setGraphicAnchored] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');

  // Macro States are declared early at the very top of the component.

  // Micro States
  const [isScanning, setIsScanning] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [chromaDiagnosis, setChromaDiagnosis] = useState<{hi: number, report: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Design Ingest States
  const [designDescription, setDesignDescription] = useState('');
  const [designCategory, setDesignCategory] = useState('Lilies_Around_Blueprint');
  const [isForgingDesign, setIsForgingDesign] = useState(false);
  const [designShard, setDesignShard] = useState<string | null>(null);

  // General Archiving States
  const [archivedShards, setArchivedShards] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  const anchorToLedger = async (content: string, type: string, mode: string) => {
    const shardKey = `${type}_${mode}_${content.substring(0, 20)}`;
    if (archivedShards.has(shardKey)) return;
    
    setIsArchiving(shardKey);
    try {
      const shardHash = `0x${generateQuickHash()}`;
      const newShard: Partial<MediaShard> = {
        title: `${type.toUpperCase()}: ${mode.replace('_', ' ')}`,
        type: 'ORACLE',
        source: 'Chroma System',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (1.42 + Math.random() * 0.1).toFixed(2),
        size: `${(content.length / 1024).toFixed(1)} KB`,
        content: content
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setArchivedShards(prev => new Set(prev).add(shardKey));
      onEarnEAC(20, `LEDGER_ANCHOR_${type.toUpperCase()}_SUCCESS`);
    } catch (e) {
      toast.error("LEDGER_FAILURE: Registry handshake failed.");
    } finally {
      setIsArchiving(null);
    }
  };

  const downloadReport = (content: string, mode: string, type: string) => {
    const shardId = `0x${generateQuickHash()}`;
    const report = `
ENVIROSAGRO™ ${type.toUpperCase()} SHARD
=================================
REGISTRY_ID: ${shardId}
NODE_AUTH: ${user.esin}
MODE: ${mode}
TIMESTAMP: ${new Date().toISOString()}
ZK_CONSENSUS: VERIFIED (99.8%)

DIAGNOSTIC VERDICT:
-------------------
${content}

-------------------
(c) 2025 EA_ROOT_NODE. Secure Shard Finality.
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EA_${type}_${mode}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    const COST = 25;
    if (!await onSpendEAC(COST, `GRAPHIC_SYNTHESIS_${selectedThrust.thrust.toUpperCase()}`)) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setGraphicAnchored(false);

    try {
      const technicalPrompt = `Professional architectural and agricultural render of ${imagePrompt}. 
      Brand Influence: Lilies Around Aesthetic Revolution.
      Framework Context: ${selectedThrust.thrust} sustainability. 
      Spectral Focus: ${selectedThrust.spectrum}. 
      Style: High-fidelity cinematic 8k architectural visualization, botanical precision, fuchsia highlights, industrial EOS aesthetic.`;

      const response = await callBackendEA({
        model: 'envirosagro-image-model',
        contents: { parts: [{ text: technicalPrompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (foundImage) {
        onEarnEAC(5, 'AESTHETIC_VITALITY_INGEST');
      } else {
        toast.error("Consensus Failure: No image shard returned.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Oracle synthesis interrupted. Check node connectivity.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMintGraphic = async () => {
    if (!generatedImageUrl) return;
    const fee = 15;
    if (!await onSpendEAC(fee, 'AGRICULTURAL_GRAPHIC_MINT')) return;

    setIsMintingGraphic(true);
    setTimeout(() => {
      setIsMintingGraphic(false);
      setGraphicAnchored(true);
      onEarnEAC(10, 'AESTHETIC_ASSET_ANCHORED');
    }, 2500);
  };

  const calculateSc = () => {
    setIsCalculatingSc(true);
    setTimeout(() => {
      const scValue = (albedo * psychScore) / (thermalCoeff + footprint);
      let res = { name: "EnvirosAgro White", hex: "#F2F7F2" };
      if (scValue < 5) res = { name: "Photosynthetic Green", hex: "#4A7C59" };
      else if (scValue < 8) res = { name: "Lilies Around Fuchsia", hex: "#f472b6" };
      else if (scValue < 12) res = { name: "Harvest Gold", hex: "#F2CC8F" };
      
      setScResult(res);
      setIsCalculatingSc(false);
      onEarnEAC(10, 'ARCHITECTURAL_CHROMA_CALIBRATION');
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        runDigitalChromatography();
      };
      reader.readAsDataURL(file);
    }
  };

  const runDigitalChromatography = async () => {
    setIsScanning(true);
    setChromaDiagnosis(null);
    try {
      const hi = 0.82;
      const prompt = `Perform a Digital Chromatography Audit on this crop shard. 
      Predicted Health Index (Hi): ${hi}. Analyze spectral pigments and suggest SEHTI remediation. Include Lilies Around aesthetic impact analysis.`;
      
      const response = await chatWithAgroLang(prompt, []);
      setChromaDiagnosis({ hi, report: response.text });
      onEarnEAC(20, 'CHROMATOGRAPHY_INGEST_SYNC');
    } catch (e) {
      setChromaDiagnosis({ hi: 0.5, report: "Oracle sync timeout. Manual audit required." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleForgeDesign = async () => {
    if (!designDescription.trim()) return;
    const DESIGN_FEE = 40;
    
    if (!await onSpendEAC(DESIGN_FEE, `DESIGN_INGEST_SHARD_${designCategory.toUpperCase()}`)) return;

    setIsForgingDesign(true);
    setDesignShard(null);

    try {
      const prompt = `Act as a Lilies Around Architectural Consultant. Synthesize this ${designCategory} design:
      "${designDescription}"
      
      Requirements:
      1. Map to Chroma-SEHTI aesthetic spectrum.
      2. Calculate Albedo and Psychological Resonance for floriculture.
      3. Recommend material index and Lilies Around resilience score.`;
      
      const response = await chatWithAgroLang(prompt, []);
      setDesignShard(response.text);
      onEarnEAC(15, 'LILIES_DESIGN_INGEST_SYNERGY');
    } catch (e) {
      setDesignShard("Registry link timeout.");
    } finally {
      setIsForgingDesign(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Palette className="w-[800px] h-[800px] text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <Palette className="w-20 h-20 text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">CHROMA_SEHTI_v2</span>
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Chroma <span className="text-emerald-400">SEHTI</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed italic opacity-80">
               "Architectural color as a functional agricultural instrument. Powered by Lilies Around aesthetic sharding logic."
            </p>
         </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex justify-center w-full mb-10">
        <SectionTabs 
          tabs={[
            { id: 'mapping', label: 'Spectral Registry', icon: Binary },
            { id: 'paint', label: 'Paint with Nature', icon: Wand2 },
            { id: 'design', label: 'Lilies Forge', icon: Flower2 },
            { id: 'macro', label: 'Architectural Sc', icon: Box },
            { id: 'micro', label: 'Chromatography', icon: Microscope },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
          variant="industrial"
          className="w-full lg:w-auto"
        />
      </div>

      <div className="min-h-[800px] relative z-10">
        
        {/* --- VIEW: SPECTRAL REGISTRY --- */}
        {activeTab === 'mapping' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {SEHTI_CHROMA_MAPPING.map((m, i) => (
                   <div key={i} className={`glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-[520px] relative overflow-hidden shadow-3xl ${m.id === 'lilies' ? 'ring-2 ring-fuchsia-500/20' : ''}`}>
                      <div className="absolute -bottom-10 -right-10 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]">
                         <m.icon size={300} />
                      </div>
                      <div className="space-y-8 relative z-10">
                         <div className="flex justify-between items-start">
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/10 shadow-inner group-hover:rotate-6 transition-transform">
                               <m.icon className={`w-10 h-10 ${m.id === 'lilies' ? 'text-fuchsia-400' : 'text-emerald-400'}`} />
                            </div>
                            <span className="text-[12px] font-mono font-black text-slate-700 uppercase tracking-widest">{m.variable}</span>
                         </div>
                         <div>
                            <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{m.thrust}</h4>
                            <p className={`text-[10px] font-mono mt-3 uppercase tracking-widest ${m.id === 'lilies' ? 'text-fuchsia-400' : 'text-emerald-400'}`}>{m.frequency} // SYNC_OK</p>
                         </div>
                         <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden shadow-inner">
                            <div className="h-full animate-pulse" style={{ backgroundColor: m.color, width: '100%' }}></div>
                         </div>
                         <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{m.spectrum}</p>
                      </div>
                      <div className="space-y-6 pt-10 border-t border-white/5 relative z-10">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Agricultural Context</p>
                            <p className="text-sm text-slate-400 italic">"{m.context}"</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Diagnostic Verdict</p>
                            <p className={`text-sm font-bold uppercase italic ${m.id === 'lilies' ? 'text-fuchsia-500' : 'text-emerald-500/80'}`}>{m.diagnosis}</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: PAINT WITH NATURE --- */}
        {activeTab === 'paint' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl">
                    <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                          <Wand2 className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Nature <span className="text-emerald-400">Canvas</span></h3>
                          <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">AGRO_LANG_AESTHETIC_INGEST</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <button 
                         onClick={() => onNavigate('multimedia_generator')}
                         className="w-full py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                       >
                          <Leaf size={16} /> MULTIMEDIA_FORGE
                       </button>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Aesthetic Intent Shard</label>
                          <textarea 
                            value={imagePrompt}
                            onChange={e => setImagePrompt(e.target.value)}
                            placeholder="Describe your botanical vision (e.g. Circular bantu garden at sunrise)..."
                            className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-40 resize-none placeholder:text-stone-900"
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Pillar focus</label>
                             <select 
                                value={selectedThrust.id}
                                onChange={e => setSelectedThrust(SEHTI_CHROMA_MAPPING.find(m => m.id === e.target.value)!)}
                                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                             >
                                {SEHTI_CHROMA_MAPPING.map(m => <option key={m.id} value={m.id}>{m.thrust}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Aspect Ratio</label>
                             <select 
                                value={aspectRatio}
                                onChange={e => setAspectRatio(e.target.value as any)}
                                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                             >
                                <option value="1:1">1:1 Square</option>
                                <option value="16:9">16:9 Wide</option>
                                <option value="9:16">9:16 Port</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    <button 
                       onClick={handleGenerateImage}
                       disabled={isGenerating || !imagePrompt.trim()}
                       className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5"
                    >
                       {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Leaf className="w-6 h-6 fill-current" />}
                       {isGenerating ? 'Synthesizing...' : 'GENERATE AESTHETIC SHARD'}
                    </button>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6 group">
                    <div className="flex items-center gap-4">
                       <Info size={16} className="text-emerald-500" />
                       <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Tip</h4>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                       "Aesthetic shards increase regional social immunity (x) by 12.4% when anchored to the heritage hub."
                    </p>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[650px] border-2 border-white/5 bg-black overflow-hidden relative group shadow-3xl flex flex-col">
                    {!generatedImageUrl && !isGenerating ? (
                       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 opacity-10">
                          <ImageIcon size={140} className="text-slate-500" />
                          <p className="text-4xl font-black uppercase tracking-[0.6em] text-white italic">CANVAS_EMPTY</p>
                       </div>
                    ) : isGenerating ? (
                       <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                          <div className="relative">
                             <Loader2 size={120} className="text-emerald-500 animate-spin mx-auto" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Palette size={48} className="text-emerald-400 animate-pulse" />
                             </div>
                          </div>
                          <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING SPECTRAL DATA...</p>
                       </div>
                    ) : (
                       <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-1000">
                          <div className="relative group/img overflow-hidden flex-1 flex items-center justify-center bg-stone-950">
                             <img src={generatedImageUrl!} className="w-full h-full object-contain max-h-[700px] shadow-2xl" alt="Generated" referrerPolicy="no-referrer" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover/img:opacity-0 transition-opacity"></div>
                             <div className="absolute top-10 right-10 flex gap-4">
                                <button className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"><Maximize size={24}/></button>
                                <button onClick={() => setGeneratedImageUrl(null)} className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"><X size={24}/></button>
                             </div>
                          </div>
                          <div className="p-12 border-t border-white/5 bg-black/90 flex flex-col md:flex-row justify-between items-center gap-8">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Fingerprint size={32} /></div>
                                <div className="text-left">
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Aesthetic Shard Protocol</p>
                                   <p className="text-lg font-mono font-black text-white">0x882_GEN_OK_SYNC</p>
                                </div>
                             </div>
                             {!graphicAnchored ? (
                               <button 
                                 onClick={handleMintGraphic}
                                 disabled={isMintingGraphic}
                                 className="px-16 py-7 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-5 ring-8 ring-white/5 border-2 border-white/10"
                               >
                                  {isMintingGraphic ? <Loader2 size={24} className="animate-spin" /> : <Stamp size={24} />}
                                  {isMintingGraphic ? 'MINTING SHARD...' : 'ANCHOR ASSET TO REGISTRY'}
                               </button>
                             ) : (
                               <div className="flex items-center gap-6 animate-in slide-in-from-right-4">
                                  <div className="text-right">
                                     <p className="text-emerald-500 font-black text-sm uppercase tracking-widest leading-none">Shard Anchored</p>
                                     <p className="text-[10px] text-slate-600 font-mono mt-1">Registry Ref: #G882A</p>
                                  </div>
                                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl"><CheckCircle2 size={32} /></div>
                               </div>
                             )}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: LILIES FORGE (DESIGN FORGE) --- */}
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
             <div className="lg:col-span-4 space-y-10">
                <div className="glass-card p-10 md:p-14 rounded-[64px] border-2 border-fuchsia-500/20 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Flower2 size={400} className="text-fuchsia-400" /></div>
                   <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                      <div className="p-5 bg-fuchsia-600 rounded-3xl shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform">
                         <Crown className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Aesthetic <span className="text-fuchsia-400">Forge</span></h3>
                        <p className="text-[10px] text-slate-500 font-mono uppercase mt-2 tracking-widest">Lilies_Around_Architecture_v1</p>
                      </div>
                   </div>
                   
                   <div className="space-y-10 relative z-10">
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Mission Category</label>
                         <div className="grid grid-cols-2 gap-4">
                            {['Floriculture', 'Landscape', 'Atrium_Design', 'Celestial_Arcs'].map(cat => (
                               <button 
                                 key={cat} 
                                 onClick={() => setDesignCategory(cat)}
                                 className={`p-6 rounded-[32px] border-2 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3 ${designCategory === cat ? 'bg-fuchsia-600 border-white text-white shadow-2xl scale-105' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                               >
                                  {cat === 'Floriculture' ? <Flower2 size={16} /> : cat === 'Landscape' ? <Trees size={16} /> : cat === 'Atrium_Design' ? <Building size={16} /> : <Sun size={16} />}
                                  {cat}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Botanical Intent Shard</label>
                         <textarea 
                           value={designDescription}
                           onChange={e => setDesignDescription(e.target.value)}
                           placeholder="Describe the aesthetic botanical architecture: Symmetry, celestial alignment, fuchsia sharding..."
                           className="w-full bg-black/80 border border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-fuchsia-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-stone-900"
                         />
                      </div>

                      <div className="p-8 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-[44px] flex justify-between items-center shadow-inner group/fee hover:border-fuchsia-500/30 transition-all">
                         <div className="flex items-center gap-4">
                            <Coins size={24} className="text-fuchsia-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Aesthetic Fee</span>
                         </div>
                         <span className="text-2xl font-mono font-black text-white">40 <span className="text-sm text-fuchsia-700">EAC</span></span>
                      </div>

                      <button 
                        onClick={handleForgeDesign}
                        disabled={isForgingDesign || !designDescription.trim()}
                        className="w-full py-10 bg-fuchsia-800 hover:bg-fuchsia-700 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(217,70,239,0.3)] flex items-center justify-center gap-8 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10 ring-[16px] ring-white/5"
                      >
                         {isForgingDesign ? <Loader2 className="w-10 h-10 animate-spin" /> : <Leaf className="w-10 h-10 fill-current" />}
                         {isForgingDesign ? "SYNTHESIZING AESTHETIC..." : "FORGE LILIES SHARD"}
                      </button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[80px] min-h-[850px] border-2 border-fuchsia-500/20 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-12 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                      <div className="flex items-center gap-8 text-fuchsia-400">
                         <Terminal className="w-8 h-8" />
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Aesthetic Blueprint Terminal</span>
                      </div>
                   </div>

                   <div className="flex-1 p-16 overflow-y-auto custom-scrollbar relative z-20">
                      {!designShard && !isForgingDesign ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                           <div className="relative">
                              <Flower2 size={180} className="text-slate-500 group-hover:text-fuchsia-500 transition-colors duration-1000" />
                              <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">ORACLE_STANDBY</p>
                              <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Input Aesthetic Context to Sync Shard</p>
                           </div>
                        </div>
                      ) : isForgingDesign ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 className="w-32 h-32 text-fuchsia-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Crown className="w-14 h-14 text-fuchsia-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-8">
                              <p className="text-fuchsia-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">MODELING CELESTIAL ALIGNMENT...</p>
                              <div className="flex justify-center gap-3 pt-10">
                                 {[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-16 bg-fuchsia-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-16 pb-16">
                           <div className="p-16 md:p-20 bg-black/80 rounded-[80px] border-2 border-fuchsia-500/20 prose prose-invert prose-indigo max-w-none shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[16px] border-l-fuchsia-600 relative overflow-hidden group/final">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/final:scale-110 transition-transform duration-[15s]"><Crown size={600} className="text-fuchsia-400" /></div>
                              <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10 gap-8">
                                 <div className="flex items-center gap-10">
                                    <HenIcon className="w-14 h-14 text-fuchsia-400 animate-pulse" />
                                    <div>
                                       <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Lilies Oracle</h4>
                                       <p className="text-fuchsia-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-3">AESTHETIC_VITALITY_SYNC // VERIFIED_SHARD</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-slate-300 text-3xl leading-[2] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                 {designShard}
                              </div>
                              <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                                 <button onClick={() => downloadReport(designShard || '', designCategory, 'Design')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl">
                                    <Download size={18} /> Download Shard
                                 </button>
                                 <button 
                                   onClick={() => anchorToLedger(designShard || '', 'Design', designCategory)}
                                   disabled={isArchiving === `Design_${designCategory}_${designShard?.substring(0, 20)}` || archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`)}
                                   className={`px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`) ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                 >
                                    {isArchiving === `Design_${designCategory}_${designShard?.substring(0, 20)}` ? <Loader2 size={18} className="animate-spin" /> : archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`) ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                                    {archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`) ? 'ANCHORED TO LEDGER' : 'ANCHOR TO LEDGER'}
                                 </button>
                              </div>
                           </div>
                           <div className="flex justify-center gap-10">
                              <button onClick={() => setDesignShard(null)} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: ARCHITECTURAL Sc (MACRO) --- */}
        {activeTab === 'macro' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Sustainable Parameters & Pigments Mixer */}
              <div className="lg:col-span-5 space-y-8">
                 {/* Panel 1: Bioclimatic Parameters */}
                 <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-8 shadow-3xl">
                    <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                          <Box className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Bioclimatic <span className="text-emerald-400">Sc</span></h3>
                          <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">EOS_COEFFICIENT_DRIVERS</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="group">
                          <div className="flex justify-between px-2 mb-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Target Albedo (Reflectance)</label><span className="text-xs font-mono text-emerald-400 font-black">{albedo.toFixed(2)}</span></div>
                          <input type="range" min="0.05" max="0.95" step="0.01" value={albedo} onChange={e => { setAlbedo(parseFloat(e.target.value)); calculateSc(); }} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                       </div>
                       <div className="group">
                          <div className="flex justify-between px-2 mb-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Psychological Score (Vibrancy)</label><span className="text-xs font-mono text-blue-400 font-black">{psychScore}/10</span></div>
                          <input type="range" min="1" max="10" step="1" value={psychScore} onChange={e => { setPsychScore(parseInt(e.target.value)); calculateSc(); }} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" />
                       </div>
                       <div className="group">
                          <div className="flex justify-between px-2 mb-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Thermal Coefficient (k)</label><span className="text-xs font-mono text-amber-400 font-black">{thermalCoeff.toFixed(2)}</span></div>
                          <input type="range" min="0.1" max="1.0" step="0.05" value={thermalCoeff} onChange={e => { setThermalCoeff(parseFloat(e.target.value)); calculateSc(); }} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500 shadow-inner" />
                       </div>
                       <div className="group">
                          <div className="flex justify-between px-2 mb-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Acreage Footprint Factor</label><span className="text-xs font-mono text-rose-400 font-black">{footprint.toFixed(2)}ha</span></div>
                          <input type="range" min="0.01" max="0.5" step="0.01" value={footprint} onChange={e => { setFootprint(parseFloat(e.target.value)); calculateSc(); }} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500 shadow-inner" />
                       </div>
                    </div>
                 </div>

                 {/* Panel 2: Sustainable Pigment Mixing System */}
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-8 shadow-3xl">
                    <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                       <div className="p-4 bg-blue-600 rounded-2xl shadow-xl">
                          <Palette className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Pigment <span className="text-sky-400">Blender</span></h3>
                          <p className="text-[10px] text-sky-400/60 font-mono tracking-widest uppercase mt-2">CHROMA_SYSTEM_ABILITIES</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <p className="text-xs text-slate-400 leading-relaxed italic">
                         Adjust the organic raw material ratios below to compile a custom structural shade.
                       </p>
                       
                       <div className="group">
                          <div className="flex justify-between px-2 mb-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Chlorophyll Teal (Botanical)</label>
                             <span className="text-xs font-mono text-emerald-400 font-black">{chlorophyllTealRatio}%</span>
                          </div>
                          <input type="range" min="0" max="100" step="5" value={chlorophyllTealRatio} onChange={e => setChlorophyllTealRatio(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                       </div>

                       <div className="group">
                          <div className="flex justify-between px-2 mb-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-red-400 transition-colors">Soil Oxide Red (Foliage Oxide)</label>
                             <span className="text-xs font-mono text-red-400 font-black">{soilOxideRedRatio}%</span>
                          </div>
                          <input type="range" min="0" max="100" step="5" value={soilOxideRedRatio} onChange={e => setSoilOxideRedRatio(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-red-500 shadow-inner" />
                       </div>

                       <div className="group">
                          <div className="flex justify-between px-2 mb-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-pink-400 transition-colors">Pollinator Rose Gold (Nectar)</label>
                             <span className="text-xs font-mono text-pink-400 font-black">{pollinatorRoseRatio}%</span>
                          </div>
                          <input type="range" min="0" max="100" step="5" value={pollinatorRoseRatio} onChange={e => setPollinatorRoseRatio(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-pink-500 shadow-inner" />
                       </div>

                       <div className="group">
                          <div className="flex justify-between px-2 mb-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Celestial Ochre (Red Clay)</label>
                             <span className="text-xs font-mono text-amber-400 font-black">{celestialOchreRatio}%</span>
                          </div>
                          <input type="range" min="0" max="100" step="5" value={celestialOchreRatio} onChange={e => setCelestialOchreRatio(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500 shadow-inner" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Spec Sheet & Market Cloud */}
              <div className="lg:col-span-7 flex flex-col gap-10">
                 {/* Tab selectors for Right Column */}
                 <div className="flex gap-4 bg-black/60 p-2 rounded-full border border-white/5 self-center md:self-start">
                    <button 
                      onClick={() => setMacroSubTab('spec')}
                      className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${macroSubTab === 'spec' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                      Paint Specification
                    </button>
                    <button 
                      onClick={() => setMacroSubTab('market')}
                      className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all relative ${macroSubTab === 'market' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                      Market Cloud Ledger
                      {marketCloudColors.some(c => !c.purchased && c.author !== user.name) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                      )}
                    </button>
                 </div>

                 {macroSubTab === 'spec' ? (
                    <div className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[550px] space-y-10">
                       <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 pointer-events-none"></div>
                       
                       <div className="text-center space-y-4">
                          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.8em]">ORGANIC_BLENDED_SHADE</p>
                          <h4 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                             {customPaintName}
                          </h4>
                       </div>

                       <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full">
                          <div className="relative group">
                             <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-[72px] opacity-20 group-hover:opacity-40 blur-lg transition duration-700 animate-pulse" />
                             <div className="w-56 h-56 rounded-[56px] shadow-3xl border-8 border-white/10 relative transition-transform duration-700 hover:scale-105" style={{ backgroundColor: getMixedColor }}>
                                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                                   <span className="text-white bg-black/60 px-4 py-2 rounded-full text-[10px] font-mono font-bold tracking-widest border border-white/10 backdrop-blur-md uppercase">{getMixedColor}</span>
                                </div>
                             </div>
                          </div>

                          <div className="text-left space-y-4 max-w-xs">
                             <div>
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Standard Paint Outlet Code</p>
                                <p className="text-lg font-mono font-black text-emerald-400 tracking-tight break-all bg-black/40 p-4 rounded-2xl border border-white/5">{mixedPaintCode}</p>
                             </div>
                             
                             <p className="text-[10.5px] text-slate-400 leading-relaxed italic">
                               Paint dealers can input this generated SEHTI chromatic code into paint tinting terminals (Spectrophotometers) to reconstruct the exact pigment concentration.
                             </p>
                          </div>
                       </div>

                       {/* Equations and Coefficients */}
                       <div className="w-full border-t border-white/5 pt-8 grid grid-cols-3 gap-6 text-center">
                          <div className="p-4 bg-black/30 rounded-3xl border border-white/5">
                             <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Impact Psi</p>
                             <p className="text-2xl font-mono font-black text-emerald-400">{rawScValue.toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-black/30 rounded-3xl border border-white/5">
                             <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Albedo Index</p>
                             <p className="text-2xl font-mono font-black text-sky-400">{albedo.toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-black/30 rounded-3xl border border-white/5">
                             <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Thermal Buffer</p>
                             <p className="text-2xl font-mono font-black text-pink-400">{Math.round((0.95 - thermalCoeff) * 100)}%</p>
                          </div>
                       </div>

                       {/* Sell to Market Cloud Panel */}
                       <div className="w-full bg-emerald-500/5 border border-emerald-500/15 p-6 rounded-[36px] space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest pl-2 block mb-2">Blueprint Shade Name</label>
                                <input 
                                  type="text" 
                                  value={customPaintName}
                                  onChange={e => setCustomPaintName(e.target.value)}
                                  className="w-full px-5 py-3 bg-black/60 rounded-2xl border border-white/5 text-xs text-white font-black"
                                  placeholder="e.g. Amber Sunrise"
                                />
                             </div>
                             <div>
                                <span className="flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-widest px-2 mb-2">
                                  <span>Selling Value</span>
                                  <span className="text-emerald-400 font-mono font-black">{customPaintPrice} EAC</span>
                                </span>
                                <input 
                                  type="range" min="10" max="150" step="5"
                                  value={customPaintPrice}
                                  onChange={e => setCustomPaintPrice(parseInt(e.target.value))}
                                  className="w-full h-2 bg-black/40 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                                />
                             </div>
                          </div>
                          <button 
                            onClick={handleAnchorAndSell}
                            disabled={isAnchoringMarket}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-4 border border-white/10"
                          >
                             {isAnchoringMarket ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Stamp className="w-4 h-4" />}
                             Anchor & Sell to Market Cloud (+30 EAC)
                          </button>
                       </div>
                    </div>
                 ) : (
                    <div className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col min-h-[550px] space-y-8">
                       <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                          <div>
                             <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Market Cloud Registry</h4>
                             <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-1">AVAILABLE_CHROMA_BLUEPRINTS</p>
                          </div>
                          <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 rounded-md font-black">
                             {marketCloudColors.length} CODES REGISTERED
                          </span>
                       </div>

                       {/* Live Processing Simulator Console Block */}
                       {processingState !== 'idle' && (
                          <div className="bg-slate-950 p-6 rounded-3xl border border-cyan-500/30 font-mono relative overflow-hidden animate-in fade-in zoom-in duration-300">
                             <div className="absolute top-2 right-4 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                                <span className="text-[9px] text-cyan-400 font-black uppercase">LIVE_TITRATION_PROCESSOR</span>
                             </div>
                             <p className="text-[11px] text-cyan-400 uppercase font-black tracking-widest mb-3">SCADA Chroma System Operations</p>
                             
                             <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-3">
                                   {processingState === 'mixing' ? <Loader2 size={13} className="animate-spin text-cyan-400" /> : <Check size={13} className="text-emerald-400" />}
                                   <span className={processingState === 'mixing' ? 'text-cyan-400' : 'text-slate-400'}>Phase 1: Pigment Mix Verification</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   {processingState === 'binding' ? <Loader2 size={13} className="animate-spin text-blue-400" /> : <Check size={13} className={['mixing'].includes(processingState) ? 'text-slate-600' : 'text-emerald-400'} />}
                                   <span className={processingState === 'binding' ? 'text-blue-400' : ['mixing'].includes(processingState) ? 'text-slate-600' : 'text-slate-400'}>Phase 2: Organic Binders Binding Integration</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   {processingState === 'titrating' ? <Loader2 size={13} className="animate-spin text-yellow-500" /> : <Check size={13} className={['mixing', 'binding'].includes(processingState) ? 'text-slate-600' : 'text-emerald-400'} />}
                                   <span className={processingState === 'titrating' ? 'text-yellow-400' : ['mixing', 'binding'].includes(processingState) ? 'text-slate-600' : 'text-slate-400'}>Phase 3: Spectrophotometric Titration Checks (528Hz)</span>
                                </div>
                             </div>

                             <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-emerald-400 italic font-sans font-bold">
                                {processorMessage}
                             </div>
                          </div>
                       )}

                       {/* Dynamic Ledger Grid */}
                       <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                          {marketCloudColors.map((colorItem, i) => (
                             <div 
                               key={colorItem.id} 
                               className={`p-6 bg-black/50 border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-emerald-500/20 transition-all ${colorItem.purchased ? 'opacity-60 border-slate-750' : ''}`}
                             >
                                <div className="flex items-center gap-5">
                                   <div className="w-16 h-16 rounded-[20px] shadow-md border-2 border-white/10 shrink-0" style={{ backgroundColor: colorItem.hex }} />
                                   <div>
                                      <div className="flex items-center gap-2">
                                         <h5 className="font-black text-white text-sm m-0">{colorItem.name}</h5>
                                         {colorItem.author === user.name && (
                                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[7px] text-emerald-400 font-bold rounded">MY BLUEPRINT</span>
                                         )}
                                      </div>
                                      <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">{colorItem.code}</p>
                                      <div className="flex items-center gap-4 mt-2 text-[9px] text-slate-400 font-semibold">
                                         <span>Pigments: <strong className="text-slate-300 font-mono">{colorItem.pigments}</strong></span>
                                         <span>Sc Coefficient: <strong className="text-emerald-400 font-mono">{colorItem.scValue}</strong></span>
                                      </div>
                                   </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                   <div className="text-left md:text-right shrink-0">
                                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mb-0.5">Anchored Cost</p>
                                      <p className="text-md font-mono font-black text-emerald-400">{colorItem.price} EAC</p>
                                   </div>

                                   {colorItem.purchased ? (
                                      <span className="px-6 py-2 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-[10px] uppercase tracking-widest font-black rounded-xl">
                                         PROCESSED
                                      </span>
                                   ) : (
                                      <button 
                                        onClick={() => handleProcessPaint(colorItem)}
                                        disabled={processingState !== 'idle'}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 hover:scale-105 disabled:opacity-40 text-white text-[10px] uppercase font-black tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2"
                                      >
                                         <Activity size={12} className="text-white" />
                                         PROCESS PAINT
                                      </button>
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>

                       <p className="text-[10px] text-slate-500 text-center italic mt-auto pt-4 leading-relaxed font-sans font-medium">
                         "Color codes listed above are distributed to paint processors for live farming. Processing a code invokes molecular pigment extraction using regional EnvirosAgro raw reservoirs."
                       </p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- VIEW: CHROMATOGRAPHY (MICRO) --- */}
        {activeTab === 'micro' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             {/* Sub-tab switcher */}
             <div className="flex gap-4 bg-black/60 p-2 rounded-full border border-white/5 self-center md:self-start w-fit mx-auto md:mx-0">
                <button 
                  onClick={() => setMicroTab('audit')}
                  className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${microTab === 'audit' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Digital Ingestion Scan
                </button>
                <button 
                  onClick={() => setMicroTab('natural')}
                  className={`px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all relative ${microTab === 'natural' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Organic Extraction Route
                </button>
             </div>

             {microTab === 'audit' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl">
                   <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                      <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                         <Microscope size={32} className="text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Pigment <span className="text-emerald-400">Lab</span></h3>
                          <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">DIGITAL_CHROMATOGRAPHY</p>
                       </div>
                    </div>
                    
                    {!filePreview ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-16 border-4 border-dashed border-white/10 rounded-[48px] bg-black/40 flex flex-col items-center justify-center text-center space-y-6 group hover:border-emerald-500/40 hover:bg-emerald-500/[0.01] transition-all cursor-pointer shadow-inner"
                      >
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                         <Upload size={48} className="text-slate-700 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
                         <div>
                            <p className="text-xl font-black text-white uppercase tracking-tighter">Choose Shard</p>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-2 px-10">Upload visual crop/soil data for spectral pigment sharding.</p>
                         </div>
                      </div>
                    ) : (
                       <div className="space-y-10 animate-in zoom-in duration-500">
                          <div className="relative w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
                             <img src={filePreview} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="Preview" referrerPolicy="no-referrer" />
                             <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none"></div>
                             <button onClick={() => { setFilePreview(null); setChromaDiagnosis(null); }} className="absolute top-4 right-4 p-3 bg-black/60 rounded-full text-white hover:bg-rose-600 transition-colors"><X size={20}/></button>
                          </div>
                          <button 
                             onClick={runDigitalChromatography}
                             disabled={isScanning}
                             className="w-full py-8 agro-gradient rounded-[36px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30 border-2 border-white/10 ring-8 ring-white/5"
                          >
                             {isScanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
                             {isScanning ? 'SCANNING PIGMENTS...' : 'INITIALIZE CHROMA AUDIT'}
                          </button>
                       </div>
                    )}
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[750px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                   {/* SCADA Scanline overlay */}
                   <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
                      <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/20 to-transparent absolute top-0 animate-scan"></div>
                   </div>

                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                      <div className="flex items-center gap-8">
                         <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                            <HenIcon size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Diagnostic <span className="text-emerald-400">Oracle Shard</span></h3>
                            <p className="text-emerald-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_CHROMA_AUDIT // PIXEL_ANALYSIS_v4.2</p>
                         </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                         <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">ORACLE_STABLE</span>
                      </div>
                   </div>

                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-20">
                      {!chromaDiagnosis && !isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                           <div className="relative">
                              <FlaskConical size={180} className="text-slate-500 group-hover:text-emerald-500 transition-colors duration-1000" />
                              <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">LAB_STANDBY</p>
                              <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Awaiting Spectral Ingest</p>
                           </div>
                        </div>
                      ) : isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 size={120} className="text-emerald-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Microscope size={48} className="text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-8">
                              <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">ANALYZING PIGMENT RESONANCE...</p>
                              <div className="flex justify-center gap-3 pt-10">
                                 {[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-16 bg-emerald-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10 flex-1">
                           <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-[12px] border-l-emerald-600 relative overflow-hidden group/shard">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[10s]"><Atom size={600} className="text-emerald-400" /></div>
                              
                              <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                                 <div className="flex items-center gap-6">
                                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                                    <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Diagnostic Result</h4>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase">Health Index (Hi)</p>
                                    <p className="text-4xl font-mono font-black text-emerald-400">{chromaDiagnosis!.hi.toFixed(2)}</p>
                                 </div>
                              </div>

                              <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                 {chromaDiagnosis!.report}
                              </div>

                              <div className="mt-16 pt-10 border-t border-white/10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                 <div className="flex items-center gap-6">
                                    <Fingerprint size={40} className="text-indigo-400" />
                                    <div className="text-left">
                                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">CHROMATOGRAPHY_HASH</p>
                                       <p className="text-lg font-mono text-white">0x{generateQuickHash()}_PIGMENT_SYNC</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4">
                                     <button onClick={() => downloadReport(chromaDiagnosis!.report, 'Chromatography', 'Laboratory')} className="px-10 py-5 bg-white/5 border-2 border-white/10 rounded-full text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl">
                                        <Download size={20} /> Download Report
                                     </button>
                                     <button 
                                       onClick={() => anchorToLedger(chromaDiagnosis!.report, 'Chromatography', 'Diagnostic')}
                                       disabled={isArchiving === `Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}` || archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`)}
                                       className={`px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`) ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                     >
                                        {isArchiving === `Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}` ? <Loader2 size={18} className="animate-spin" /> : archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`) ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                                        {archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`) ? 'ANCHORED' : 'ANCHOR TO LEDGER'}
                                     </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
                {/* Left Column: Natural Pre-Catalogued Pigments Picker & Prompter */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-6 shadow-3xl">
                      <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                         <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                            <FlaskConical size={32} className="text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Organic <span className="text-emerald-400">Forge</span></h3>
                            <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">VALUE_ROUTE_MAPPING</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Botanical Source</label>
                         <div className="grid grid-cols-1 gap-2">
                            {PRE_CATALOGUED_RESOURCES.map(res => (
                               <button 
                                 key={res.id}
                                 onClick={() => setSelectedNaturalResource(res.id)}
                                 className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${selectedNaturalResource === res.id ? 'bg-emerald-600/10 border-emerald-500/50 shadow-inner' : 'bg-black/30 border-white/5 hover:border-white/10'}`}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className="w-5 h-5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: res.hex }} />
                                     <div>
                                        <p className="text-xs font-black text-white tracking-widest">{res.name}</p>
                                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{res.pigment}</p>
                                     </div>
                                  </div>
                                  <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/10 shrink-0">{res.code}</span>
                               </button>
                            ))}

                            <button 
                              onClick={() => setSelectedNaturalResource('custom')}
                              className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${selectedNaturalResource === 'custom' ? 'bg-emerald-600/10 border-emerald-500/50 shadow-inner' : 'bg-black/30 border-white/5 hover:border-white/10'}`}
                            >
                               <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-teal-400 via-yellow-400 to-rose-400 border border-white/10 shrink-0" />
                                  <div>
                                     <p className="text-xs font-black text-white tracking-widest">Custom Organic Input...</p>
                                     <p className="text-[9px] text-slate-500 font-mono mt-0.5">Prompt any unique organic source</p>
                                  </div>
                               </div>
                            </button>
                         </div>
                      </div>

                      {selectedNaturalResource === 'custom' && (
                         <div className="space-y-4 p-4 bg-black/60 rounded-3xl border border-white/5 animate-in slide-in-from-top-4 duration-300">
                            <div>
                               <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest pl-2 block mb-2">Natural Source Name</label>
                               <input 
                                 type="text"
                                 value={customResourceName}
                                 onChange={e => setCustomResourceName(e.target.value)}
                                 className="w-full px-4 py-3 bg-black/40 rounded-xl border border-white/5 text-xs text-white uppercase font-bold"
                                 placeholder="e.g. Red Rose petals"
                               />
                            </div>
                            <div>
                               <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest pl-2 block mb-2">Target Active Pigment</label>
                               <input 
                                 type="text"
                                 value={customPigmentName}
                                 onChange={e => setCustomPigmentName(e.target.value)}
                                 className="w-full px-4 py-3 bg-black/40 rounded-xl border border-white/5 text-xs text-white uppercase font-bold"
                                 placeholder="e.g. Anthocyanins"
                               />
                            </div>
                         </div>
                      )}

                      <button 
                        onClick={handleValueForgeExtraction}
                        disabled={isForgingExtraction}
                        className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30 border-2 border-white/10"
                      >
                         {isForgingExtraction ? <Loader2 className="w-5 h-5 animate-spin" /> : <FlaskConical className="w-5 h-5" />}
                         Forge Extraction Route (-25 EAC)
                      </button>
                   </div>
                </div>

                {/* Right Column: Generation Output / Extraction Protocol Report */}
                <div className="lg:col-span-8">
                   <div className="glass-card rounded-[64px] min-h-[650px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                      <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                         <div className="flex items-center gap-8">
                            <span className="p-4 bg-emerald-600 rounded-2xl block text-white shadow-xl">
                               <Atom size={24} />
                            </span>
                            <div>
                               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Extraction <span className="text-emerald-400">Blueprint</span></h3>
                               <p className="text-emerald-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_VALUE_FORG_ORACLE // REGIONAL_EXTRACTION_SYSTEMs</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-20">
                         {!extractionResult && !isForgingExtraction ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20 opacity-10 group">
                               <div className="relative">
                                  <Atom size={140} className="text-slate-500 group-hover:text-emerald-500 transition-colors duration-1000" />
                                  <div className="absolute inset-[-40px] border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
                               </div>
                               <div className="space-y-4">
                                  <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic leading-none">SHAFT_STANDBY</p>
                                  <p className="text-xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Ready to Map Value Route</p>
                               </div>
                            </div>
                         ) : isForgingExtraction ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                               <div className="relative animate-spin-slow">
                                  <FlaskConical size={80} className="text-emerald-400 mx-auto" />
                               </div>
                               <div className="space-y-6">
                                  <p className="text-emerald-400 font-black text-xl uppercase tracking-[0.8em] animate-pulse italic m-0">MINING ORGANIC CHROMOPHORES...</p>
                                  <p className="text-[10px] text-slate-500 max-w-sm mx-auto uppercase tracking-widest leading-relaxed">Connecting to system LangOracle. Solving solvent equations and Rf chromatographic indexes...</p>
                               </div>
                            </div>
                         ) : (
                            <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10 flex-1">
                               <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 max-w-none shadow-3xl border-l-[12px] border-l-emerald-600 relative overflow-hidden group/shard animate-in zoom-in">
                                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Atom size={600} className="text-emerald-400" /></div>
                                  
                                  <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                                     <div className="flex items-center gap-6">
                                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                                        <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Extraction Oracle Shard</h4>
                                     </div>
                                     <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 rounded-md font-black animate-pulse">
                                        SOLVENT_INDEX_VERIFIED
                                     </span>
                                  </div>

                                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10 max-h-[450px] overflow-y-auto custom-scrollbar">
                                     {extractionResult}
                                  </div>

                                  <div className="mt-16 pt-10 border-t border-white/10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                     <div className="flex items-center gap-6">
                                        <Fingerprint size={40} className="text-indigo-400" />
                                        <div className="text-left">
                                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">EXTRACTION_HASH</p>
                                           <p className="text-lg font-mono text-white">0x{generateQuickHash()}_EXTRACT_SYNC</p>
                                        </div>
                                     </div>
                                     <div className="flex gap-4">
                                         <button onClick={() => downloadReport(extractionResult || '', 'Extraction', 'Process')} className="px-10 py-5 bg-white/5 border-2 border-white/10 rounded-full text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl">
                                            <Download size={20} /> Download Shard
                                         </button>
                                         <button 
                                           onClick={() => anchorToLedger(extractionResult || '', 'Extraction', 'Value_Forge')}
                                           disabled={isArchiving === `Extraction_Value_Forge_${extractionResult?.substring(0, 20)}` || archivedShards.has(`Extraction_Value_Forge_${extractionResult?.substring(0, 20)}`)}
                                           className={`px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${archivedShards.has(`Extraction_Value_Forge_${extractionResult?.substring(0, 20)}`) ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                         >
                                            {isArchiving === `Extraction_Value_Forge_${extractionResult?.substring(0, 20)}` ? <Loader2 size={18} className="animate-spin" /> : archivedShards.has(`Extraction_Value_Forge_${extractionResult?.substring(0, 20)}`) ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                                            {archivedShards.has(`Extraction_Value_Forge_${extractionResult?.substring(0, 20)}`) ? 'ANCHORED' : 'ANCHOR TO LEDGER'}
                                         </button>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          )}
          </div>
        )}

      </div>

      
    </div>
  );
};

export default ChromaSystem;