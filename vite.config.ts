import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5174,
    hmr: {
      clientPort: 443
    },
    allowedHosts: [
      '5174-ibtbhlzllgy7c9u30lim7-cce57105.manusvm.computer'
    ]
  },
})
