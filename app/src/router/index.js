/**
 * Vue Router 配置
 * - Hash 模式 (#/path) — 适配 GitHub Pages 静态托管,深链不会 404
 * - 路由懒加载 — 各 view chunk 拆分
 * - 全局滚动行为 — 切换路由滚到顶部
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '仪表板', icon: 'dashboard' },
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryView.vue'),
    meta: { title: '文章库', icon: 'library' },
  },
  {
    path: '/library/:slug',
    name: 'reader',
    component: () => import('@/views/ReaderView.vue'),
    meta: { title: '阅读器', icon: 'library', hideInNav: true },
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/views/NotesView.vue'),
    meta: { title: '笔记', icon: 'notes' },
  },
  {
    path: '/notes/:id',
    name: 'noteEdit',
    component: () => import('@/views/NoteEditView.vue'),
    meta: { title: '编辑笔记', icon: 'notes', hideInNav: true },
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('@/views/TagsView.vue'),
    meta: { title: '标签', icon: 'tags' },
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('@/views/GraphView.vue'),
    meta: { title: '知识图谱', icon: 'graph' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/StatsView.vue'),
    meta: { title: '统计', icon: 'stats' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: '设置', icon: 'settings' },
  },
  // 404 兜底
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { hideInNav: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0, behavior: 'smooth' }
  },
})

// 全局标题更新
router.afterEach((to) => {
  const base = 'APOS · 阅读追踪与知识库'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})

export default router
