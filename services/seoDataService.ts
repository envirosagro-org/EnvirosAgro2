export interface ViewSeoMeta {
  title: string;
  description: string;
  keywords: string;
  schemaType: string;
  staticContent: string;
}

export const VIEW_SEO_DATA: Record<string, ViewSeoMeta> = {
  dashboard: {
    title: "EnvirosAgro™ - Core Steward Dashboard",
    description: "Monitor real-time sustainable farming telemetry, bio-electric soil sensors, solar battery grids, and regenerative agro-economy operations.",
    keywords: "Steward Dashboard, agricultural telemetry, sensor networks, sustainable farming tracking",
    schemaType: "Dashboard",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Core System</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Steward Control Dashboard</h1>
          <p class="text-sm text-slate-400 mt-2">Core node operations, dynamic farming telemetry, and bio-electric validation streams.</p>
        </header>
        
        <section class="grid md:grid-cols-3 gap-6 mb-12">
          <div class="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/10">
            <h3 class="text-xs font-mono text-emerald-400 uppercase tracking-wider">Node Calibration // U-Value</h3>
            <p class="text-3xl font-black text-white mt-2">1.482</p>
            <p class="text-xs text-slate-500 mt-1">Agricultural code stability variable.</p>
          </div>
          <div class="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/10">
            <h3 class="text-xs font-mono text-emerald-400 uppercase tracking-wider">Time Constant // Tau</h3>
            <p class="text-3xl font-black text-white mt-2">0.954s</p>
            <p class="text-xs text-slate-500 mt-1">Response delay on soil active telemetry.</p>
          </div>
          <div class="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/10">
            <h3 class="text-xs font-mono text-emerald-400 uppercase tracking-wider">Steward Rating // ESG</h3>
            <p class="text-3xl font-black text-white mt-2">98.5%</p>
            <p class="text-xs text-slate-500 mt-1">Overall network fidelity rating.</p>
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="text-xl font-bold uppercase text-white tracking-widest">Core Active Services</h2>
          <ul class="space-y-4">
            <li class="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <span class="font-bold text-emerald-400">⚡ Soil Telemetry Integration</span>
              <p class="text-sm text-slate-400 mt-1">Gathers and streams live moisture levels, micro-nutrient compositions, and cellular frequencies.</p>
            </li>
            <li class="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <span class="font-bold text-emerald-400">🚜 Interactive Device Control Actuators</span>
              <p class="text-sm text-slate-400 mt-1">Grants direct control of irrigation grids, ventilation pumps, and greenhouses.</p>
            </li>
            <li class="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <span class="font-bold text-emerald-400">🪙 Regenerative EAC Balance Flow</span>
              <p class="text-sm text-slate-400 mt-1">Real-time status tracking of environmental coin assets earned via green actions.</p>
            </li>
          </ul>
        </section>
      </main>
    `
  },
  governance: {
    title: "Global Protocol Governance | EnvirosAgro™",
    description: "Participate in industrial protocol voting, DAO dispute resolutions, steward proof-of-identity vetting, and legislative additions.",
    keywords: "DAO, blockchain governance, vote proposals, steward proof, code of laws",
    schemaType: "GovernmentService",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">EnvirosAgro // Governance Shard</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Global Protocol Governance</h1>
          <p class="text-sm text-slate-400 mt-2">Participate in decentralized voting, manage legal guidelines, and evaluate protocol policies.</p>
        </header>

        <section class="p-8 rounded-3xl bg-indigo-950/10 border-2 border-indigo-500/20 mb-12">
          <h2 class="text-lg font-black text-indigo-400 uppercase tracking-wider mb-4">Active Voting &amp; Proposal Docket</h2>
          <div class="space-y-6">
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <span class="font-bold text-white">Proposal #EA-104: Expand Nairobi Ingest Shard</span>
              <p class="text-sm text-slate-400 mt-1">Upgrade IoT wireless repeaters and introduce solar drone mapping lanes in Nairobi sector.</p>
              <div class="mt-2 text-xs text-indigo-400">Agreement status: 89.4% Approved</div>
            </div>
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <span class="font-bold text-white">Proposal #EA-105: Update EAC-to-EAT Minting Ratio</span>
              <p class="text-sm text-slate-400 mt-1">Proposes calibration of ecosystem tokens reward multipliers based on carbon sink longevity.</p>
              <div class="mt-2 text-xs text-indigo-400">Agreement status: 72.1% Under Review</div>
            </div>
          </div>
        </section>

        <section class="space-y-4">
          <h3 class="text-xl font-bold uppercase text-white tracking-widest">Democratic Pillars</h3>
          <ol class="list-decimal pl-6 space-y-2 text-sm text-slate-300">
            <li><strong>Steward Proof of Identity:</strong> Requires decentralized ESIN credentials to submit legislative votes.</li>
            <li><strong>Equal Shard Weighting:</strong> Voting index scales proportionally with verified ecological contribution metrics.</li>
            <li><strong>Code of Laws Compliance:</strong> Legal structures kept transparently inside the global blockchain ledger.</li>
          </ol>
        </section>
      </main>
    `
  },
  sustainability: {
    title: "Decentralized Sustainability & MRV | EnvirosAgro™",
    description: "Explore the carbon credits forge, ecological preservation trackers, and Measurement, Reporting & Verification engine.",
    keywords: "carbon forge, biodiversity credits, MRV engine, ecological audit, permaculture",
    schemaType: "SpecializedCounsel",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">EnvirosAgro // Environmental Integrity</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Sustainability &amp; MRV Engine</h1>
          <p class="text-sm text-slate-400 mt-2">Tracking carbon offsets, ecological sequestration rates, and verifying field proofs.</p>
        </header>

        <section class="grid md:grid-cols-2 gap-8 mb-12">
          <div class="p-6 bg-zinc-900 rounded-2xl border border-teal-500/15">
            <h3 class="text-sm font-bold text-white">Carbon Forge Tracker</h3>
            <p class="text-xs text-slate-400 mt-1">Real-time quantification of carbon metrics minted through biological soil activity verification nodes.</p>
          </div>
          <div class="p-6 bg-zinc-900 rounded-2xl border border-teal-500/15">
            <h3 class="text-sm font-bold text-white">MRV Telemetry</h3>
            <p class="text-xs text-slate-400 mt-1">Continuous algorithmic audit of greenhouse gas levels and remote multispectral satellite sweeps.</p>
          </div>
        </section>

        <section class="p-6 rounded-2xl bg-teal-950/10 border border-teal-500/20">
          <h3 class="text-lg font-bold text-teal-400 mb-2">Sustainable Milestones</h3>
          <p class="text-sm text-slate-300 leading-relaxed">
            The EnvirosAgro global network has cataloged over 150 hectares of carbon-dense permaculture sectors, validated with digital cryptographic hashes to guarantee complete transparency and absolute defense against greenwashing risks.
          </p>
        </section>
      </main>
    `
  },
  marketplace: {
    title: "Regenerative Agro-Market Center | EnvirosAgro™",
    description: "Participate in the decentralized agricultural market, browse listing metrics, explore pricing analytics, and configure delivery services.",
    keywords: "decentralized marketplace, agricultural listings, trade assets, logistics shards",
    schemaType: "ItemPage",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Asset Exchange</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Regenerative Agro-Market</h1>
          <p class="text-sm text-slate-400 mt-2">Trade verified seeds, bio-dynamic fertilizers, solar IoT components, and logistics route credits.</p>
        </header>

        <section class="space-y-6">
          <h2 class="text-lg font-bold text-white uppercase tracking-wider">Available Market Shards</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-6 rounded-2xl bg-zinc-900 border border-white/5">
              <span class="text-xs font-mono text-emerald-400">PR-COF-82</span>
              <h4 class="text-xl font-bold text-white mt-1">Organic Bantu Coffee Seed Seedlings</h4>
              <p class="text-xs text-slate-400 mt-1">Heirloom seeds certified organic under micro-farm registry audits.</p>
              <div class="mt-4 flex justify-between items-center text-sm">
                <span class="font-bold text-emerald-400">450 EAC // Package</span>
                <span class="text-slate-500">In Stock</span>
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-zinc-900 border border-white/5">
              <span class="text-xs font-mono text-emerald-400">EQ-SLR-04</span>
              <h4 class="text-xl font-bold text-white mt-1">Solar Soil Hydration Actuator v2</h4>
              <p class="text-xs text-slate-400 mt-1">Subtle solar-charging irrigation controller with integrated mesh network capabilities.</p>
              <div class="mt-4 flex justify-between items-center text-sm">
                <span class="font-bold text-emerald-400">1200 EAC // Unit</span>
                <span class="text-slate-500">In Stock</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    `
  },
  explorer: {
    title: "Multi-Ledger Shard Explorer | EnvirosAgro™",
    description: "Inspect real-time blockchain blocks, agricultural transaction nodes, cryptographic proofs, and decentralized audit trails.",
    keywords: "block explorer, blockchain transaction logs, ledger proof, validation hashes",
    schemaType: "WebAPI",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Cryptographic Ledger</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Decentralized Shard Explorer</h1>
          <p class="text-sm text-slate-400 mt-2">Audit ledger transactions, verified environmental proofs, and active cryptographic blocks.</p>
        </header>

        <section class="space-y-4">
          <h2 class="text-lg font-bold text-white uppercase tracking-lighter">Recent Ledger Blocks</h2>
          <div class="space-y-3 font-mono text-xs">
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col md:flex-row md:justify-between gap-2">
              <span class="text-emerald-400 font-bold">Block #110482 // STATUS: VALIDATED</span>
              <span class="text-slate-500">Hash: aa98d28cb115e442c...</span>
              <span class="text-slate-400">Time: Just now</span>
            </div>
            <div class="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col md:flex-row md:justify-between gap-2">
              <span class="text-emerald-400 font-bold">Block #110481 // STATUS: VALIDATED</span>
              <span class="text-slate-500">Hash: ff89e02c5108bb210...</span>
              <span class="text-slate-400">Time: 3 mins ago</span>
            </div>
          </div>
        </section>
      </main>
    `
  },
  community: {
    title: "Kaizen Steward Community | EnvirosAgro™",
    description: "Connect, collaborate, and share with local stewards, global experts, and sustainable farming networks.",
    keywords: "Steward community, farmer forums, botanical discussions, agricultural network",
    schemaType: "AboutPage",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Social Network</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Kaizen Steward Community</h1>
          <p class="text-sm text-slate-400 mt-2">Decentralized cooperative space linking sustainable stewards across global mesh networks.</p>
        </header>

        <section class="space-y-6">
          <h2 class="text-lg font-bold text-white uppercase tracking-wider">Active Community Rooms</h2>
          <ul class="space-y-4">
            <li class="p-5 rounded-2xl bg-zinc-900 border border-white/5">
              <h4 class="font-bold text-emerald-400">🌱 Soil Bio-frequency &amp; Cellular Repair</h4>
              <p class="text-xs text-slate-400 mt-1">Discussion of acoustic frequencies and cosmic soil calibrations on heirloom fields.</p>
            </li>
            <li class="p-5 rounded-2xl bg-zinc-900 border border-white/5">
              <h4 class="font-bold text-emerald-400">🍂 Permaculture Shard Distribution Models</h4>
              <p class="text-xs text-slate-400 mt-1">Coordinating micro-transport networks and cooperative delivery lines for organic yield.</p>
            </li>
          </ul>
        </section>
      </main>
    `
  },
  agrowild: {
    title: "Agrowild Biodiversity Ledger | EnvirosAgro™",
    description: "Contribute to ecological preservation by tracking botanical lineages and mapping natural resources.",
    keywords: "Agrowild, biodiversity tracking, ecology conservation, wildlife registry",
    schemaType: "CollectionPage",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Ecology Shard</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Agrowild Biodiversity Ledger</h1>
          <p class="text-sm text-slate-400 mt-2">Mapping botanical diversity, preserving indigenous species, and tracking forest health.</p>
        </header>

        <section class="space-y-6">
          <div class="p-6 rounded-2xl bg-zinc-900 border border-white/5">
            <h3 class="text-lg font-bold text-emerald-400">Botanical Lineage Archives</h3>
            <p class="text-xs text-slate-300 leading-relaxed mt-2">
              Active documentation and certification of rare plant lineages, tracked securely using decentralized environmental metadata standards.
            </p>
          </div>
        </section>
      </main>
    `
  },
  envirosagro_store: {
    title: "EnvirosAgro™ Integrated Store",
    description: "Browse high-fidelity sensors, solar-powered IoT gateways, automated irrigation valves, and drone kits.",
    keywords: "smart agricultural sensors, IoT hardware store, irrigation controllers, drone supplies",
    schemaType: "Store",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Hardware Center</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Integrated Hardware Store</h1>
          <p class="text-sm text-slate-400 mt-2">Access professional environmental sensors and IoT agricultural controller arrays.</p>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-6 bg-zinc-900 rounded-3xl border border-white/5">
            <h3 class="text-xl font-bold text-white">Soil Bio-Acoustic Sensor Pack</h3>
            <p class="text-xs text-slate-400 mt-2">Streams cellular bio-resonance signals from deep soil layers. Rechargeable with integrated micro solar module.</p>
            <div class="mt-4 font-bold text-emerald-400">890 EAC</div>
          </div>
          <div class="p-6 bg-zinc-900 rounded-3xl border border-white/5">
            <h3 class="text-xl font-bold text-white">Greenhouse Airflow Actuator</h3>
            <p class="text-xs text-slate-400 mt-2">Automates standard ventilation lines via high-capacity mesh networking triggers.</p>
            <div class="mt-4 font-bold text-emerald-400">1450 EAC</div>
          </div>
        </section>
      </main>
    `
  },
  industrial: {
    title: "Industrial Supply Chain Hub | EnvirosAgro™",
    description: "Manage large-scale agricultural operations, industrial machinery sensors, and process automated routing workflows.",
    keywords: "industrial agriculture, machinery control, supply chain routing",
    schemaType: "Service",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">EnvirosAgro // Heavy Operations</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Industrial Supply Chain</h1>
          <p class="text-sm text-slate-400 mt-2">Oversee factory processing nodes, automated fleet routing, and large-scale farming machinery.</p>
        </header>

        <section class="space-y-4">
          <h2 class="text-lg font-bold text-white uppercase tracking-wider">Industrial Processing Shards</h2>
          <div class="p-4 rounded-xl bg-zinc-900 border border-white/5">
            <span class="text-emerald-400 font-bold">Node_Nairobi_04 // Warehouse Ingest Hub</span>
            <p class="text-xs text-slate-400 mt-1">Automated receipt validation unit mapping inbound organic crops.</p>
          </div>
        </section>
      </main>
    `
  },
  info: {
    title: "Governance Resources & System Documentation | EnvirosAgro™",
    description: "Read whitepapers, legal frameworks, site terms, and privacy protocols of the EnvirosAgro network.",
    keywords: "legal framework, terms of service, developer documentation, whitepaper",
    schemaType: "TechArticle",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Legal Core</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Information Portal</h1>
          <p class="text-sm text-slate-400 mt-2">Framework architectures, privacy specifications, and user legal bounds.</p>
        </header>

        <article class="prose prose-invert max-w-none text-sm text-slate-300 space-y-4">
          <p>
            Welcome to the official legal specifications for the EnvirosAgro blockchain ecosystem. Under this framework, stewards operate as decentralized nodes responsible for validating localized environmental telemetry.
          </p>
          <h3 class="text-lg font-bold text-white mt-6">Telemetry &amp; Verification Rules</h3>
          <p>
            All ingested data streams undergo dual-layer cryptographic proof vetting to prevent data adulteration and maintain carbon offset registry integrity.
          </p>
        </article>
      </main>
    `
  },
  profile: {
    title: "Steward Profile & Dossier | EnvirosAgro™",
    description: "Analyze your stewardship metrics, contribution scores, reputation shards, and manage wallet details.",
    keywords: "steward ID, ESG score, user profile, reputation metrics",
    schemaType: "ProfilePage",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // User Records</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Steward Dossier File</h1>
          <p class="text-sm text-slate-400 mt-2">Verify profile configurations, environmental validation scores, and active wallet balance keys.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-4">
          <h3 class="text-xl font-bold text-white">Current Node Identity</h3>
          <p class="text-xs text-slate-400">ESIN: EA-GUEST-VOID-NODE</p>
          <p class="text-xs text-slate-400">Class: GLOBAL MESH OBSERVER</p>
        </section>
      </main>
    `
  },
  economy: {
    title: "Decentralized Regenerative Economy | EnvirosAgro™",
    description: "Participate in local trading, inspect pool pricing algorithms, view asset valuations, and review transaction ledgers.",
    keywords: "agro-economy, ESG coins, trading pools, value flow",
    schemaType: "FinancialService",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Monetary Policy</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Regenerative Macro-Economy</h1>
          <p class="text-sm text-slate-400 mt-2">Analyze token velocity metrics, EAC pool depths, and trade automated energy hashes.</p>
        </header>

        <section class="p-8 rounded-3xl bg-emerald-950/10 border-2 border-emerald-500/20 mb-8">
          <h4 class="text-sm font-mono text-emerald-400 uppercase tracking-wider">Ecosystem Coin Constants</h4>
          <p class="text-sm text-slate-300 leading-relaxed mt-2">
            EAC token reserves support physical environmental restoration tasks. The system utilizes constant-product automated pricing pools to manage exchange functions accurately.
          </p>
        </section>
      </main>
    `
  },
  ecosystem: {
    title: "Sustainable Ecosystem Portals | EnvirosAgro™",
    description: "Deep dive into specialized ecological segments, soil research databases, and aquaponics modules.",
    keywords: "soil database, aquaponics, biotechnology, permaculture practices",
    schemaType: "DataCatalog",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Systems Ecology</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Ecosystem Interface Hub</h1>
          <p class="text-sm text-slate-400 mt-2">Navigate specialized portals for Soil Informatics, Aquaculture, Air Quality, and Biotechnology.</p>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-zinc-900 rounded-2xl border border-white/5">
            <h4 class="font-bold text-teal-400">🌲 Permaculture Systems</h4>
            <p class="text-xs text-slate-400 mt-1">Covers regenerative land planning, heavy bio-swale configurations, and multi-tier forest farming structures.</p>
          </div>
          <div class="p-6 bg-zinc-900 rounded-2xl border border-white/5">
            <h4 class="font-bold text-teal-400">🧬 Biotechnology Laboratory</h4>
            <p class="text-xs text-slate-400 mt-1">Analyzes organic soil genetics records to map plant immunity constants against viral exposures.</p>
          </div>
        </section>
      </main>
    `
  },
  traceability: {
    title: "Cryptographic Product Traceability | EnvirosAgro™",
    description: "Track crop histories, processing locations, quality check hashes, and verify organic compliance seamlessly.",
    keywords: "product journey, crop trace, organic certificate, supply security",
    schemaType: "TrackAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Supply Assurance</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Cryptographic Product Traceability</h1>
          <p class="text-sm text-slate-400 mt-2">Audit agricultural shipments, verify spatial coordinates, and examine quality proof hashes.</p>
        </header>

        <section class="space-y-4">
          <h4 class="text-xs font-mono text-emerald-400 uppercase tracking-widest">Active Shipment Shards</h4>
          <div class="p-4 rounded-xl bg-zinc-900 border border-white/5">
            <span class="font-bold text-white">Item #EA-SHRD-928</span>
            <p class="text-xs text-slate-400 mt-1">Origin Node: Nairobi_04. Transit via Eco-Rail Electric Relay.</p>
            <div class="text-xs text-emerald-400 mt-2">Compliance Hash: d38bc91f2... [VERIFIED]</div>
          </div>
        </section>
      </main>
    `
  },
  carbon_credits: {
    title: "Carbon Credits Forge & Ledger | EnvirosAgro™",
    description: "Mint verified carbon credits, trade offset assets, and evaluate environmental offset efficiency scores.",
    keywords: "carbon credits, carbon minting, environmental offsets",
    schemaType: "BrokerageInfo",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Offset Ledger</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Carbon Credits Forge</h1>
          <p class="text-sm text-slate-400 mt-2">Submit verified biomass content proofs and generate organic carbon credit offset certificates.</p>
        </header>

        <section class="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/20">
          <h4 class="text-lg font-bold text-white">Fidelity Tokenization Parameters</h4>
          <p class="text-xs text-slate-400 leading-relaxed mt-2">
            Minting processes require double-blind peer verification of physical organic fields to guarantee carbon sequestration credibility.
          </p>
        </section>
      </main>
    `
  },
  intelligence: {
    title: "AI-Powered Agro Intelligence | EnvirosAgro™",
    description: "Generate predictive yield reports, get optimization tips from AI analysts, or consult the Strategic Oracle.",
    keywords: "agro intelligence, yield modeling, strategic oracle, AI agriculture",
    schemaType: "ResearchProject",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Neural Analytics</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Agro Intelligence Engine</h1>
          <p class="text-sm text-slate-400 mt-2">Generate predictive yield forecasts, model water tables, and launch simulation models.</p>
        </header>

        <section class="space-y-6">
          <p class="text-sm text-slate-300">
            Access the integrated AI Oracle, capable of mapping localized soil trends and suggesting custom planting schedules to maximize regenerative output.
          </p>
        </section>
      </main>
    `
  },
  media: {
    title: "Media Broadcasts & Spatiotemporal Feeds",
    description: "Watch live farm video streams, access dynamic audio repair tracks, and browse satellite mapping media.",
    keywords: "farm cameras, agricultural broadcasts, spatiotemporal satellite map",
    schemaType: "ImageGallery",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Multimedia Stream</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Media &amp; Spatiotemporal Hub</h1>
          <p class="text-sm text-slate-400 mt-2">Observe live-feed security surveillance streams and listen to soil acoustic alignment audio.</p>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 bg-zinc-900 rounded-2xl border border-white/5">
            <h4 class="font-bold text-white">Live Feed 01: Nairobi Field North</h4>
            <p class="text-xs text-slate-400 mt-1">Multi-spectral optical stream observing canopy heat patterns.</p>
          </div>
          <div class="p-4 bg-zinc-900 rounded-2xl border border-white/5">
            <h4 class="font-bold text-white">Bio-Acoustic repair alignment (432Hz)</h4>
            <p class="text-xs text-slate-400 mt-1">Continuous ambient track aiding localized cellular botanical cell repair.</p>
          </div>
        </section>
      </main>
    `
  },
  wallet: {
    title: "Steward Safe Wallet | EnvirosAgro™",
    description: "Track your EAC/EAT balances, manage your cryptographic mnemonic, trade tokens, and coordinate escrow deposits.",
    keywords: "crypto wallet, token transfer, escrow tracker, mnemonic",
    schemaType: "ExchangeRateSpecification",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Cryptographic Secure</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Steward Safe Wallet</h1>
          <p class="text-sm text-slate-400 mt-2">Check seed-token capital balances, export transaction lists, or execute escrow locks.</p>
        </header>

        <section class="p-8 rounded-3xl bg-zinc-900 border border-white/10 space-y-4">
          <span class="text-xs text-emerald-400 font-bold uppercase">Active Balance Status</span>
          <h3 class="text-4xl font-black text-white">0.00 EAC</h3>
          <p class="text-xs text-slate-500 font-mono">Blockchain Network Address: EA-NODE-VALID-UNCONNECTED</p>
        </section>
      </main>
    `
  },
  investor: {
    title: "Steward Investor Portal | EnvirosAgro™",
    description: "Provide liquidity support for green projects, fund verified agricultural contracts, and track ecological ROI.",
    keywords: "green finance, agritech investing, crowdfunding, return on impact",
    schemaType: "InvestmentOrDeposit",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Green Ventures</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Investor Funding Portal</h1>
          <p class="text-sm text-slate-400 mt-2">Fund sustainable microclimate cooperatives and track environmental returns.</p>
        </header>

        <section class="space-y-4">
          <h4 class="font-bold text-white uppercase tracking-wider text-xs">Vetted Investment Opportunities</h4>
          <div class="p-6 bg-zinc-900 rounded-2xl border border-white/5">
            <h5 class="font-bold text-emerald-400">Project Alpha: Bio-Char Carbon Vaults</h5>
            <p class="text-xs text-slate-400 mt-1">Installing soil charcoal systems to boost nutrient absorption in sub-saharan fields.</p>
            <div class="mt-4 text-xs font-mono text-slate-500">Target Capital: 1,500,000 EAC // 68% Filled</div>
          </div>
        </section>
      </main>
    `
  },
  vendor: {
    title: "Vendor Management Terminal | EnvirosAgro™",
    description: "Configure product lists, manage inbound procurement orders, update pricing configurations, and see review metrics.",
    keywords: "vendor setup, stock inventory, supplier invoice",
    schemaType: "RegisterAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Inventory System</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Vendor Procurement Desk</h1>
          <p class="text-sm text-slate-400 mt-2">Manage commercial agricultural stocks, dispatch orders, and track supplier ratings.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5">
          <p class="text-xs text-slate-400 leading-relaxed font-mono">
            Requires active vendor access token credentials to retrieve private inbound dispatch manifests.
          </p>
        </section>
      </main>
    `
  },
  ingest: {
    title: "Real-time Network Ingest Console | EnvirosAgro™",
    description: "Monitor active telemetry feeds, inspect raw API packets, configure webhooks, and debug endpoint payloads.",
    keywords: "API endpoint, network packets, webhook config, logging console",
    schemaType: "DataFeed",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Dev Terminal</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Network Ingest Station</h1>
          <p class="text-sm text-slate-400 mt-2">Logs dynamic server webhooks, telemetric payloads, and remote sensor API data.</p>
        </header>

        <section class="space-y-4">
          <pre class="p-6 bg-zinc-950 rounded-2xl border border-white/10 text-[10px] text-emerald-400 font-mono tracking-tight overflow-x-auto">
{
  "node_status": "ONLINE",
  "incoming_packet_rate": "12.4Hz",
  "m_constant": "0.19245",
  "payload_verification_score": "0.9982"
}
          </pre>
        </section>
      </main>
    `
  },
  hardware_registry: {
    title: "Industrial Hardware Registry | EnvirosAgro™",
    description: "Register and control smart farming sensors, solar actuators, automated pumps, and IoT mesh nodes.",
    keywords: "hardware registry, IoT onboarding, device address",
    schemaType: "DigitalDocument",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Infrastructure Systems</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Mesh Hardware Depot</h1>
          <p class="text-sm text-slate-400 mt-2">Onboard remote farming telemetry nodes and wireless micro-controller devices.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5">
          <h4 class="font-bold text-white">Device Specifications</h4>
          <p class="text-xs text-slate-400 leading-relaxed mt-1">
            Compatible hardware includes solar-integrated soil probes, spectral gas analyzers, and battery-powered greenhouse vent motors.
          </p>
        </section>
      </main>
    `
  },
  device_control: {
    title: "Active Device Control & Actuators | EnvirosAgro™",
    description: "Send remote commands, trigger scheduled irrigation, adjust greenhouse airflow, and adjust light levels.",
    keywords: "remote actuator, pump controls, air valves, light tuning",
    schemaType: "ControlAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Automation System</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Live Device Controllers</h1>
          <p class="text-sm text-slate-400 mt-2">Override irrigation lines, configure light ranges, and trigger ventilation valves.</p>
        </header>

        <section class="space-y-4 font-mono text-xs">
          <div class="p-4 bg-zinc-900 border border-white/5 flex justify-between items-center text-slate-300">
            <span>Water Valve #04</span>
            <span class="text-red-400">STATUS: CLOSED</span>
          </div>
          <div class="p-4 bg-zinc-900 border border-white/5 flex justify-between items-center text-slate-300">
            <span>Vent Fan #01</span>
            <span class="text-emerald-400">STATUS: ACTIVE // 40% CAPACITY</span>
          </div>
        </section>
      </main>
    `
  },
  tools: {
    title: "Custom Steward Utilities & Calculators | EnvirosAgro™",
    description: "Access unit converters, soil mixture calculators, carbon offset estimators, and profit analysis layouts.",
    keywords: "precision tools, agritech calculators, formulas",
    schemaType: "ComputeAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Math Engines</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Precision Precision Tools</h1>
          <p class="text-sm text-slate-400 mt-2">Carbon sequestration matrices, soil NPK mixture formulas, and weight scale converters.</p>
        </header>

        <section class="space-y-4">
          <p class="text-sm text-slate-300 leading-relaxed">
            Provides diagnostic agricultural equations, local organic soil calculators, and carbon density offset metrics models.
          </p>
        </section>
      </main>
    `
  },
  live_voice_bridge: {
    title: "Live Peer Voice Bridge | EnvirosAgro™",
    description: "Connect to live audio discussions, participate in community town halls, and talk to online stewards in real-time.",
    keywords: "voice chat, peer connection, audio space",
    schemaType: "CommunicateAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Communication Room</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Peer Radio Bridge</h1>
          <p class="text-sm text-slate-400 mt-2">Join live audio forums and coordinate crop logistics directly with global stewards.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5">
          <p class="text-xs text-slate-400 font-mono">
            Requires dynamic WebRTC setup support with mic permissions to initialize active audio handshakes.
          </p>
        </section>
      </main>
    `
  },
  crm: {
    title: "Nexus Customer CRM & Support Hub | EnvirosAgro™",
    description: "Submit support queries, track resolution logs, request field engineer dispatch, and resolve contract issues.",
    keywords: "helpdesk support, CRM engine, dispatch coordinator",
    schemaType: "ContactPage",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Customer Services</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Nexus CRM Console</h1>
          <p class="text-sm text-slate-400 mt-2">Log engineering disputes, file service requests, and track dispatcher channels.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-4">
          <h4 class="font-bold text-white">24/7 Field Tech Dispatcher</h4>
          <p class="text-xs text-slate-400">
            Submit critical requests to deploy regional inspectors to verify active telemetry probe coordinates quickly.
          </p>
        </section>
      </main>
    `
  },
  multimedia_generator: {
    title: "AI Agro Multimedia Generator | EnvirosAgro™",
    description: "Generate ecological report summaries, export custom visual infographics, and process speech audio translations.",
    keywords: "multimedia AI, agro writer, pdf exporter",
    schemaType: "CreateAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // AI Media Synthesis</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Multimedia Media Forge</h1>
          <p class="text-sm text-slate-400 mt-2">Generate customized high-fidelity ecological infographics, write soil summaries, or export PDF dossiers.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-3xl border border-white/5">
          <h4 class="font-bold text-white">AI Botanical Copywriter</h4>
          <p class="text-xs text-slate-400 mt-2">Synthesize multi-layer legal documents or translate field research files automatically.</p>
        </section>
      </main>
    `
  },
  cost_accounting: {
    title: "Managerial Cost Accounting Terminal | EnvirosAgro™",
    description: "Optimize cash flows, classify overhead versus direct farming costs, and generate GAAP/IFRS compliant logs.",
    keywords: "accounting ledger, budget balance, cost variance",
    schemaType: "AccountingService",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Managerial Finance</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Managerial Cost Accounting</h1>
          <p class="text-sm text-slate-400 mt-2">Map crop overhead configurations, track fixed versus variable direct costs, and optimize margin variances.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-4">
          <h4 class="font-bold text-white uppercase text-xs tracking-wider">GAAP Compliance Checklist</h4>
          <p class="text-xs text-slate-400">
            System logs transactions to maintaining perfect traceability of farming inputs against final market outputs.
          </p>
        </section>
      </main>
    `
  },
  internal_control: {
    title: "Internal Controls & Audit Security | EnvirosAgro™",
    description: "Review automated risk audits, examine system segregation of duties, and monitor network health markers.",
    keywords: "risk security, compliance audit, log trail",
    schemaType: "AssessAction",
    staticContent: `
      <main class="max-w-4xl mx-auto px-6 py-12 text-zinc-100 font-sans">
        <header class="border-b border-emerald-500/20 pb-6 mb-8">
          <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">EnvirosAgro // Audits Core</span>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1">Internal Controls Dashboard</h1>
          <p class="text-sm text-slate-400 mt-2">Audit segregation of duties metrics, analyze system access limits, and check security flags.</p>
        </header>

        <section class="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-3">
          <h4 class="font-bold text-emerald-400">Threat Matrix Score</h4>
          <p class="text-3xl font-black text-white">0.05</p>
          <p class="text-xs text-slate-500 font-mono mt-1">No outstanding administrative balance duty risks detected.</p>
        </section>
      </main>
    `
  }
};
