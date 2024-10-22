import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000
  },
  resolve: {
    alias: {
      global: 'global',
    },
  },
  define: {
    global: 'window', // Define global as window
  },
})