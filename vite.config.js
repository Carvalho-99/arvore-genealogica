import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base is updated to '/<repo-name>/' once the GitHub repo is created (M4)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/arvore-genealogica/',
})
