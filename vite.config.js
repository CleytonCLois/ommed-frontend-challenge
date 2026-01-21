import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'google-protobuf',
      'grpc-web',
    ],
    esbuildOptions: {
      platform: 'browser',
      target: 'esnext',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [
        /node_modules/,
        /testF1_pb\.js/,
        /testF1_grpc_web_pb\.js/,
      ],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/grpc-web': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/grpc-web/, ''),
      },
    },
  },
})