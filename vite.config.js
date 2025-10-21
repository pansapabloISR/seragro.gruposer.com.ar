import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'unified-contact': './js/unified-contact.js',
        'mavilda-chat': './js/mavilda-chat.js',
        'main-app': './main-app.js'
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})
