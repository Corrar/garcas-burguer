import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa"; // 1. Nova importação do PWA

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // 2. Configuração do PWA adicionada aqui
    VitePWA({
      registerType: 'autoUpdate', // Atualiza automaticamente quando você lança versão nova
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: "Garça's Burguer",
        short_name: "Garça's",
        description: 'Sistema de Pedidos e PDV',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Faz parecer um app de verdade, sem a barra do navegador
        icons: [
          {
            src: '/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));