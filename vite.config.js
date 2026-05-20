import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * Vite 配置
 * - base: 部署到 GitHub Pages 子路径 '/AposBlog/',本地开发 '/'
 * - outDir: 'docs' — GitHub Pages 支持从 main/docs 目录服务,无需 Actions
 * - alias: @ → src
 * - manualChunks: vue/echarts/gsap/lenis 分离,首屏更轻
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/AposBlog/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
          gsap: ['gsap'],
          lenis: ['lenis'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    host: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
}))
