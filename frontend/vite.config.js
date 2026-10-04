import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 60', 'safari >= 11', 'ios >= 11', 'not dead'],
      renderModernChunks: true,
    }),
  ],
  css: {
    target: ['chrome60', 'safari11'],
  },
})
