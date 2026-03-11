import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables
const API_BASE = process.env.VITE_API_BASE || 'http://localhost:9031'
const WS_BASE = process.env.VITE_WS_BASE_URL || 'http://localhost:9031'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: WS_BASE,
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      // Proxy Nominatim calls in dev
      '/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/nominatim/, ''),
      }
    }
  },
  define: {
    'global': 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
