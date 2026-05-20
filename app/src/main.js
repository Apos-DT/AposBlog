/**
 * 应用入口
 * - 创建 Vue 实例
 * - 装配 Pinia(状态管理)与 Vue Router(路由)
 * - 注入全局样式
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 全局样式 — 设计 token / 字体 / 背景 / 通用组件
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
