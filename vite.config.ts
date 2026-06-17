
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
// import process explicitly to resolve TypeScript errors with cwd and env properties
import process from 'node:process';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development, production, etc.)
  // Third parameter '' loads all variables regardless of VITE_ prefix
  // Fix: use process.cwd() from explicitly imported process
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    resolve: {
      alias: {
        'react': path.resolve(process.cwd(), 'node_modules/react'),
        'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom')
      }
    },
    plugins: [react(), tailwindcss(), visualizer({ open: false, filename: 'stats.html' })],
    define: {
      // Emulate process.env for browser compatibility as required by the GenAI SDK
      // Fix: use process.env from explicitly imported process
      'process.env.EA_AI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ''),
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(env.GOOGLE_MAPS_PLATFORM_KEY || process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          // Splitting vendor libraries into a separate chunk to optimize caching and reduce main bundle size
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      },
      // Adjusting the limit to 1000kb to suppress warnings for complex industrial sharding modules
      chunkSizeWarningLimit: 1000
    }
  };
});
