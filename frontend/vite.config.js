import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Raise warning threshold so small legit chunks don't warn
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
          },
        },
        // Split vendor libraries into focused, cacheable chunks
        manualChunks(id) {
          // React core — tiny, rarely changes, always cached
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }

          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }

          // Framer Motion — large animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }


          // Lenis smooth scroll
          if (id.includes('node_modules/lenis') || id.includes('node_modules/@studio-freight')) {
            return 'lenis';
          }

          // Lucide icons — tree-shaken but still significant
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }


          // Everything else in node_modules → generic vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
