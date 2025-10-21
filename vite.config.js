import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        t50: resolve(__dirname, 'dji-agras-t50.html'),
        t100: resolve(__dirname, 'DJI-Agras-T100.html'),
        mavic3: resolve(__dirname, 'dji-mavic-3.html'),
        firmware: resolve(__dirname, 'firmware-generador.html')
      }
    }
  }
})
