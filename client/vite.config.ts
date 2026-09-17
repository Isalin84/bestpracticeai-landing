import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import type { Plugin } from 'vite'

// Комментарии в index.html нужны разработчикам, но не посетителям: в проде их вырезаем.
// Только при build (в dev остаются), после остальных html-трансформаций и до сжатия в .gz/.br.
function stripHtmlComments(): Plugin {
  return {
    name: 'bp-strip-html-comments',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => html.replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*\r?\n?/gm, '').replace(/<!--[\s\S]*?-->/g, ''),
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    stripHtmlComments(),
    // Предсжатые .gz/.br рядом с оригиналами — nginx отдаёт их через gzip_static / brotli_static
    compression({
      include: /\.(js|mjs|css|svg|json|xml|txt|html)$/,
      threshold: 1024,
      algorithms: ['gzip', 'brotliCompress'],
      deleteOriginalAssets: false,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'vendor-react'
          if (/\/node_modules\/(framer-motion|motion|motion-dom|motion-utils|lenis)\//.test(id)) return 'vendor-motion'
          return undefined
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
