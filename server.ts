import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import apiRoutes from "./routes/api";
import { socialBotService } from "./services/socialBotService";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VIEW_METADATA: Record<string, { title: string; description: string; keywords: string }> = {
  dashboard: {
    title: "EnvirosAgro™ - Core Steward Dashboard",
    description: "Monitor real-time sustainable farming telemetry, device controls, and regenerative agro-economy operations.",
    keywords: "Steward Dashboard, solar telemetry, agricultural monitoring, agro-metrics"
  },
  governance: {
    title: "Global Protocol Governance | EnvirosAgro™",
    description: "Participate in industrial protocol voting, DAO disputes, steward identity proofing, and legislative proposals.",
    keywords: "Code of Laws, DAO voting, dispute resolution, decentralized governance, steward proof"
  },
  sustainability: {
    title: "Decentralized Sustainability & MRV | EnvirosAgro™",
    description: "Explore the carbon credits forge, ecological preservation trackers, and Measurement, Reporting & Verification.",
    keywords: "carbon forge, biodiversity credits, MRV engine, ecological footprint, permaculture"
  },
  marketplace: {
    title: "Regenerative Agro-Market Center | EnvirosAgro™",
    description: "Participate in the decentralized agricultural market, browse listing metrics, explore pricing analytics, and configure delivery services.",
    keywords: "decentralized marketplace, agricultural listings, trade assets, logistics shards"
  },
  explorer: {
    title: "Multi-Ledger Shard Explorer | EnvirosAgro™",
    description: "Inspect real-time blocks, agricultural transactions, cryptographic proofs, and decentralized audit trails.",
    keywords: "block explorer, transaction logs, ledger proof, cryptographic validation"
  },
  community: {
    title: "Kaizen Steward Community | EnvirosAgro™",
    description: "Connect, collaborate, and share with local stewards, global experts, and sustainable farming networks.",
    keywords: "Steward network, global farmers, botanical education, community forums"
  },
  agrowild: {
    title: "Agrowild Biodiversity Ledger | EnvirosAgro™",
    description: "Contribute to ecological preservation by tracking botanical lineages and mapping natural resources.",
    keywords: "Agrowild, biodiversity, wildlife tracking, environmental preservation"
  },
  envirosagro_store: {
    title: "EnvirosAgro™ Integrated Store",
    description: "Browse high-fidelity sensors, solar-powered IoT gateways, automated irrigation valves, and drone kits.",
    keywords: "hardware store, smart farming sensors, IoT, solar irrigation"
  },
  industrial: {
    title: "Industrial Supply Chain Hub | EnvirosAgro™",
    description: "Manage large-scale agricultural operations, industrial machinery sensors, and process automated routing workflows.",
    keywords: "industrial agriculture, machinery control, supply chain routing"
  },
  info: {
    title: "Governance Resources & System Documentation | EnvirosAgro™",
    description: "Read whitepapers, legal frameworks, site terms, and privacy protocols of the EnvirosAgro network.",
    keywords: "legal framework, terms of service, developer documentation, whitepaper"
  },
  profile: {
    title: "Steward Profile & Dossier | EnvirosAgro™",
    description: "Analyze your stewardship metrics, contribution scores, reputation shards, and manage wallet details.",
    keywords: "steward ID, ESG score, user profile, reputation metrics"
  },
  economy: {
    title: "Decentralized Regenerative Economy | EnvirosAgro™",
    description: "Participate in local trading, inspect pool pricing algorithms, view asset valuations, and review transaction ledgers.",
    keywords: "agro-economy, ESG coins, trading pools, value flow"
  },
  ecosystem: {
    title: "Sustainable Ecosystem Portals | EnvirosAgro™",
    description: "Deep dive into specialized ecological segments, soil research databases, and aquaponics modules.",
    keywords: "soil database, aquaponics, biotechnology, permaculture practices"
  },
  traceability: {
    title: "Cryptographic Product Traceability | EnvirosAgro™",
    description: "Track crop histories, processing locations, quality check hashes, and verify organic compliance seamlessly.",
    keywords: "product journey, crop trace, organic certificate, supply security"
  },
  carbon_credits: {
    title: "Carbon Credits Forge & Ledger | EnvirosAgro™",
    description: "Mint verified carbon credits, trade offset assets, and evaluate environmental offset efficiency scores.",
    keywords: "carbon credits, carbon minting, environmental offsets"
  },
  intelligence: {
    title: "AI-Powered Agro Intelligence | EnvirosAgro™",
    description: "Generate predictive yield reports, get optimization tips from AI analysts, or consult the Strategic Oracle.",
    keywords: "agro intelligence, yield modeling, strategic oracle, AI agriculture"
  },
  media: {
    title: "Media Broadcasts & Spatiotemporal Feeds",
    description: "Watch live farm video streams, access dynamic audio repair tracks, and browse satellite mapping media.",
    keywords: "farm cameras, agricultural broadcasts, spatiotemporal satellite map"
  },
  wallet: {
    title: "Steward Safe Wallet | EnvirosAgro™",
    description: "Track your EAC/EAT balances, manage your cryptographic mnemonic, trade tokens, and coordinate escrow deposits.",
    keywords: "crypto wallet, token transfer, escrow tracker, mnemonic"
  },
  investor: {
    title: "Steward Investor Portal | EnvirosAgro™",
    description: "Provide liquidity support for green projects, fund verified agricultural contracts, and track ecological ROI.",
    keywords: "green finance, agritech investing, crowdfunding, return on impact"
  },
  vendor: {
    title: "Vendor Management Terminal | EnvirosAgro™",
    description: "Configure product lists, manage inbound procurement orders, update pricing configurations, and see review metrics.",
    keywords: "vendor setup, stock inventory, supplier invoice"
  },
  ingest: {
    title: "Real-time Network Ingest Console | EnvirosAgro™",
    description: "Monitor active telemetry feeds, inspect raw API packets, configure webhooks, and debug endpoint payloads.",
    keywords: "API endpoint, network packets, webhook config, logging console"
  },
  hardware_registry: {
    title: "Industrial Hardware Registry | EnvirosAgro™",
    description: "Register and control smart farming sensors, solar actuators, automated pumps, and IoT mesh nodes.",
    keywords: "hardware registry, IoT onboarding, device address"
  },
  device_control: {
    title: "Active Device Control & Actuators | EnvirosAgro™",
    description: "Send remote commands, trigger scheduled irrigation, adjust greenhouse airflow, and adjust light levels.",
    keywords: "remote actuator, pump controls, air valves, light tuning"
  },
  tools: {
    title: "Custom Steward Utilities & Calculators | EnvirosAgro™",
    description: "Access unit converters, soil mixture calculators, carbon offset estimators, and profit analysis layouts.",
    keywords: "precision tools, agritech calculators, formulas"
  },
  live_voice_bridge: {
    title: "Live Peer Voice Bridge | EnvirosAgro™",
    description: "Connect to live audio discussions, participate in community town halls, and talk to online stewards in real-time.",
    keywords: "voice chat, peer connection, audio space"
  },
  crm: {
    title: "Nexus Customer CRM & Support Hub | EnvirosAgro™",
    description: "Submit support queries, track resolution logs, request field engineer dispatch, and resolve contract issues.",
    keywords: "helpdesk support, CRM engine, dispatch coordinator"
  },
  multimedia_generator: {
    title: "AI Agro Multimedia Generator | EnvirosAgro™",
    description: "Generate ecological report summaries, export custom visual infographics, and process speech audio translations.",
    keywords: "multimedia AI, agro writer, pdf exporter"
  },
  cost_accounting: {
    title: "Managerial Cost Accounting Terminal | EnvirosAgro™",
    description: "Optimize cash flows, classify overhead versus direct farming costs, and generate GAAP/IFRS compliant logs.",
    keywords: "accounting ledger, budget balance, cost variance"
  },
  internal_control: {
    title: "Internal Controls & Audit Security | EnvirosAgro™",
    description: "Review automated risk audits, examine system segregation of duties, and monitor network health markers.",
    keywords: "risk security, compliance audit, log trail"
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Strict CORS: Limit to app domain (example, adjust if necessary)
  app.use(cors({
    origin: process.env.VITE_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }));
  
  // Use built-in JSON parser
  app.use(express.json());

  // API routes
  app.use("/api", apiRoutes);
  
  // Periodic task processing with error handling
  setInterval(() => {
    try {
      socialBotService.processQueue();
    } catch (error) {
      console.error("[Server] Error in periodic socialBotService task:", error);
    }
  }, 20000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', (req, res) => {
      try {
        const viewParam = (req.query.view as string) || '';
        const meta = VIEW_METADATA[viewParam] || {
          title: "EnvirosAgro™ - Decentralized Sustainability",
          description: "EnvirosAgro - A decentralized platform for sustainable farming, environmental stewardship, and regenerative agro-economy.",
          keywords: "EnvirosAgro, sustainable farming, regenerative agriculture, agro-economy, decentralized, sustainability, farming technology"
        };
        
        let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        
        // Dynamic head tag substitutions
        html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
        html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${meta.description}" />`);
        html = html.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${meta.keywords}" />`);
        
        // Open Graph replacements
        html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${meta.title}" />`);
        html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${meta.description}" />`);
        
        // Twitter replacements
        html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${meta.title}" />`);
        html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${meta.description}" />`);
        
        // JSON-LD structured data parser & updater
        const ldJsonRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
        const match = html.match(ldJsonRegex);
        if (match) {
          try {
            const currentLd = JSON.parse(match[1]);
            currentLd.name = meta.title;
            currentLd.description = meta.description;
            if (viewParam) {
              currentLd.url = `https://envirosagro.org/?view=${viewParam}`;
            }
            html = html.replace(ldJsonRegex, `<script type="application/ld+json">${JSON.stringify(currentLd, null, 2)}</script>`);
          } catch (e) {
            // Ignore parse errors, proceed with structural string replace
          }
        }
        
        res.send(html);
      } catch (err) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
