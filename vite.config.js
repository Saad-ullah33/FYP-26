import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
define: {
    global: 'window'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // Forces explicit IPv4 loopback mapping
        changeOrigin: true,
        secure: false
      }
    }
  }
})