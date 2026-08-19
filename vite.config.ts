import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { getRealHardwareStats } from "./src-bridge/telemetry.js";

export default defineConfig(async () => ({
  plugins: [
    react(),
    {
      name: 'real-hardware-telemetry-endpoint',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/stats') {
            const stats = getRealHardwareStats();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(stats));
            return;
          }
          next();
        });
      },
    },
  ],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: false,
  },
}));
