import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    vue(),
    viteCommonjs()
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['grpc-web', 'google-protobuf'],
    // Força o Vite a pré-processar os arquivos gRPC
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    port: 5173, // Porta padrão do Vite para não conflitar com o proxy HTTP do backend na porta 3000
    // Proxy para contornar problemas de CORS durante desenvolvimento
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // API REST (BFF)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantém o caminho original
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Proxy error:', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📤 Proxy Request:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Proxy Response:', proxyRes.statusCode, req.url)
          })
        },
      },
    }
  },
})
