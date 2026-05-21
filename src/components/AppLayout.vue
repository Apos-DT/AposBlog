<script setup>
/**
 * 统一布局组件 — 根据 route.meta.layout 切换:
 *   - 'blog':全宽,顶部 nav + 内容 + 不显示侧栏(博客首页 / 文章 / 工具间)
 *   - 'app': 三栏 grid,左菜单 + 内容 + 右工具(知识库各页)
 *   - 默认  app
 */
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { useReadsStore } from '@/stores/reads'
import { useSettingsStore } from '@/stores/settings'

import ThemeQuickPanel from './ThemeQuickPanel.vue'
import AppToastStack from './AppToastStack.vue'
import IconBase from './IconBase.vue'

const route = useRoute()
const router = useRouter()
const notes = useNotesStore()
const tags = useTagsStore()
const reads = useReadsStore()
const settings = useSettingsStore()

const layoutType = computed(() => route.meta?.layout || 'app')

const search = ref('')
function submitSearch() {
  const q = search.value.trim()
  if (!q) return
  router.push({ name: 'library', query: { q } })
  settings.pushToast('info', `已跳到文章库搜索:"${q}"`)
}

// 三栏知识库左侧菜单 —— 只保留"作者向内管理"的功能
// 对访客开放的 留言板(/guestbook) 已挪到 blog 顶部 nav,这里不再列出
const appMenu = computed(() => [
  { to: '/dashboard', label: '仪表板', icon: 'dashboard', badge: null },
  { to: '/library', label: '文章库', icon: 'library', badge: null },
  { to: '/notes', label: '笔记', icon: 'notes', badge: notes.stats.total },
  { to: '/tags', label: '标签', icon: 'tags', badge: tags.tags.length },
  { to: '/graph', label: '知识图谱', icon: 'graph', badge: notes.stats.totalLinks || null },
  { to: '/chat', label: 'AI 对话', icon: 'chat', badge: null },
  { to: '/stats', label: '统计', icon: 'stats', badge: null },
  { to: '/settings', label: '设置', icon: 'settings', badge: null },
])
</script>

<template>
  <!-- ===== 顶部 Nav (两套布局共用,内容自适应) ===== -->
  <header class="app-nav">
    <RouterLink to="/" class="brand">
      <span class="brand-mark"></span>
      <span class="brand-text">APOS</span>
    </RouterLink>

    <!-- 博客布局: 主导航(访客向)— 留言板放在这里,所有访客都能找到 -->
    <nav v-if="layoutType === 'blog'" class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/guestbook">留言板</RouterLink>
      <RouterLink to="/dashboard">知识库</RouterLink>
      <RouterLink to="/playground">工具间</RouterLink>
      <a href="https://github.com/Apos-DT" target="_blank" rel="noopener">GitHub ↗</a>
    </nav>

    <!-- 知识库布局: 搜索框 -->
    <form v-else class="nav-search" @submit.prevent="submitSearch">
      <IconBase name="search" :size="14" />
      <input
        v-model="search"
        type="search"
        placeholder="搜索文章 / 笔记 / 标签… (回车跳转文章库)"
        aria-label="全局搜索"
      />
    </form>

    <RouterLink
      v-if="layoutType === 'blog'"
      class="nav-cta"
      to="/dashboard"
    >
      <span>进入应用</span>
      <IconBase name="arrow-right" :size="14" />
    </RouterLink>
    <RouterLink v-else class="nav-back" to="/">
      <IconBase name="arrow-left" :size="14" />
      <span>返回首页</span>
    </RouterLink>
  </header>

  <!-- ===== Blog 布局 (全宽) ===== -->
  <main v-if="layoutType === 'blog'" class="blog-main">
    <slot />
  </main>

  <!-- ===== App 布局 (三栏) ===== -->
  <div v-else class="app-layout">
    <!-- 左 -->
    <aside class="app-aside">
      <div class="app-aside-inner">
        <span class="app-aside-label">导航</span>
        <nav class="app-menu">
          <RouterLink v-for="m in appMenu" :key="m.to" :to="m.to">
            <IconBase :name="m.icon" :size="16" />
            <span>{{ m.label }}</span>
            <span v-if="m.badge != null" class="badge">{{ m.badge }}</span>
          </RouterLink>
        </nav>
        <div class="app-aside-foot">
          <span class="dot live"></span>
          <span>{{ reads.stats.done }} 已读 · {{ reads.stats.reading }} 在读</span>
        </div>
      </div>
    </aside>

    <!-- 中 -->
    <main class="app-main">
      <slot />
    </main>

    <!-- 右 -->
    <aside class="app-tools">
      <div class="app-tools-inner">
        <div class="app-tools-mount"></div>
        <ThemeQuickPanel />
      </div>
    </aside>
  </div>

  <!-- ===== 全局 Toast ===== -->
  <AppToastStack />
</template>

<style scoped>
/* 全宽博客布局的 main */
.blog-main {
  padding-top: var(--nav-h);
  position: relative;
  z-index: 2;
}

/* nav-cta for blog */
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--bg-deep);
  font-size: 12.5px;
  font-weight: 600;
  transition: transform 0.3s var(--ease-out), background 0.3s;
}
.nav-cta:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-1px);
}

.nav-links {
  display: flex;
  gap: 22px;
  flex: 1;
  justify-content: center;
}
.nav-links a {
  font-size: 13.5px;
  color: var(--ink-2);
  letter-spacing: 0.02em;
  position: relative;
  padding: 6px 2px;
  transition: color 0.3s;
}
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0; bottom: 2px;
  width: 100%; height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--ease-out);
}
.nav-links a:hover, .nav-links a.router-link-active {
  color: var(--ink);
}
.nav-links a:hover::after, .nav-links a.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

@media (max-width: 720px) {
  .nav-links { display: none; }
}
</style>
