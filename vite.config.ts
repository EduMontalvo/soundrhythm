import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// ... rest of config
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
