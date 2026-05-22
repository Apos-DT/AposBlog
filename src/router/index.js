/**
 * Vue Router — 整站统一路由
 * - Hash 模式(GitHub Pages 静态托管深链不 404)
 * - 路由 meta.layout:
 *   - 'blog' → 全宽博客布局(只有 nav + 内容 + footer)
 *   - 'app'  → 三栏知识库布局(默认)
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // ===== 博客部分(全宽) =====
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', layout: 'blog' },
  },
  {
    path: '/post/:slug',
    name: 'post',
    component: () => import('@/views/PostView.vue'),
    meta: { title: '文章', layout: 'blog' },
  },

  // ===== 知识库部分(三栏) =====
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '仪表板', icon: 'dashboard', layout: 'app' },
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryView.vue'),
    meta: { title: '文章库', icon: 'library', layout: 'app' },
  },
  // /library/:slug 重定向到 /post/:slug — 文章阅读统一一个视图
  {
    path: '/library/:slug',
    redirect: (to) => `/post/${to.params.slug}`,
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/views/NotesView.vue'),
    meta: { title: '笔记', icon: 'notes', layout: 'app' },
  },
  {
    path: '/notes/:id',
    name: 'noteEdit',
    component: () => import('@/views/NoteEditView.vue'),
    meta: { title: '编辑笔记', icon: 'notes', layout: 'app' },
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('@/views/TagsView.vue'),
    meta: { title: '标签', icon: 'tags', layout: 'app' },
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('@/views/GraphView.vue'),
    meta: { title: '知识图谱', icon: 'graph', layout: 'app' },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: 'AI 对话', icon: 'chat', layout: 'app' },
  },
  {
    path: '/guestbook',
    name: 'guestbook',
    component: () => import('@/views/GuestbookView.vue'),
    meta: { title: '留言板', icon: 'chat', layout: 'blog' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/StatsView.vue'),
    meta: { title: '统计', icon: 'stats', layout: 'app' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: '设置', icon: 'settings', layout: 'app' },
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404', layout: 'blog' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  const base = 'APOS · 赵祥生'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})

export default router
