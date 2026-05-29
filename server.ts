import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import { VIEW_SEO_DATA } from "./services/seoDataService";
import apiRoutes from "./routes/api";
import { socialBotService } from "./services/socialBotService";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Strict CORS: Limit to app domain
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
    // Disable default serving of index.html automatically on '/' route
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', (req, res) => {
      try {
        const viewOverride = (req.query.view as string) || "dashboard";
        const meta = VIEW_SEO_DATA[viewOverride] || VIEW_SEO_DATA.dashboard;
        
        const htmlPath = path.join(distPath, 'index.html');
        if (!fs.existsSync(htmlPath)) {
          return res.sendFile(htmlPath);
        }
        
        let html = fs.readFileSync(htmlPath, 'utf8');
        
        // Custom text configurations
        const siteTitle = `${meta.title} | EnvirosAgro`;
        const description = meta.description;
        const keywords = meta.keywords;
        
        // Match & replace standard HTML title
        html = html.replace(/<title>.*?<\/title>/i, `<title>${siteTitle}</title>`);
        
        // Fallback or override dynamic meta tags
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
        html = html.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`);
        
        // Open Graph & Twitter optimizations to display matching visual snippets
        html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:title" content="${siteTitle}" />`);
        html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:description" content="${description}" />`);
        html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/gi, `<meta name="twitter:title" content="${siteTitle}" />`);
        html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/gi, `<meta name="twitter:description" content="${description}" />`);
        
        // Process JSON-LD Structured Schema
        const schemaLd = {
          "@context": "https://schema.org",
          "@type": meta.schemaType || "WebApplication",
          "name": siteTitle,
          "description": description,
          "applicationCategory": "Agriculture",
          "operatingSystem": "Web",
          "url": `https://envirosagro.org/?view=${viewOverride}`
        };
        
        html = html.replace(
          /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, 
          `<script type="application/ld+json">${JSON.stringify(schemaLd, null, 2)}</script>`
        );
        
        // Inject fallback static semantic layout inside the root container so that non-JS crawlers get content
        html = html.replace(
          /<div\s+id="root">\s*<\/div>/i, 
          `<div id="root">${meta.staticContent}</div>`
        );
        
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      } catch (err) {
        console.error("[Server] Pre-render error, serving fallback:", err);
        return res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
