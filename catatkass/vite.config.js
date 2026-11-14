import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  },
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/icon-192x192.png', 'assets/icon-512x512.png', 'favicon.svg'],
      manifest: {
        name: 'CatatKas Aesthetic',
        short_name: 'CatatKas',
        description: 'Lacak setiap transaksi dengan estetika hologram.',
        theme_color: '#FF9EE5',
        background_color: '#13111C',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'assets/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
