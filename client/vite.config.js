import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// PageHaven Vite Configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
