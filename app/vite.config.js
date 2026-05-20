import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * Vite 配置
 * - base: './' 相对路径,放任何子目录都能跑(配合 hash 路由)
 * - alias: @ → src,简化 import 路径
 * - 构建产物到 dist/,通过 `npm run deploy` 复制到仓库 /app-dist/ 让 Pages 服务
 */
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
