import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    analyzer({
      analyzerMode: 'static'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["web_app"],
    proxy: {
      '/api/resume': {
        target: 'http://localhost:4002',
        changeOrigin: true,
      }
    }
  },
})
