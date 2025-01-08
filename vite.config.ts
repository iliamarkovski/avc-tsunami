import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touc-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AVC Tsunami',
        short_name: 'AVC Tsunami',
        description: 'ACT Tsunami official website',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'favicon',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'favicon',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon',
          },
          {
            src: '/maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        display: 'standalone',
        scope: '/',
        start_url: '/?source=pwa',
        background_color: '#2563eb',
        theme_color: '#2563eb',
        orientation: 'any',
      },
      workbox: {
        // Skip caching for all runtime requests
        runtimeCaching: [],
        // Do not precache any assets
        globPatterns: [],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
