import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://linkedin-creative-awards-api-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
})
