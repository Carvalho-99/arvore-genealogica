import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Firebase Hosting serve o site na raiz do domínio (arvore-genealogica-64443.web.app),
// diferente do GitHub Pages que precisava de um subcaminho (/arvore-genealogica/).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
})
