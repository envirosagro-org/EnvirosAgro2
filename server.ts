import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import apiRoutes from "./routes/api";
import { socialBotService } from "./services/socialBotService";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
