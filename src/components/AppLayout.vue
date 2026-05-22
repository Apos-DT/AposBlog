<script setup>
/**
 * 统一布局组件 — 全宽 + 常驻顶部 nav
 *  - 删除了之前 blog/app 双布局分支与三栏 grid + 左菜单 + 右工具栏
 *  - 顶部 nav 是站点唯一主导航,所有页面共享同一套
 *  - 主体内容全宽承载,各 view 自己控制 max-width 与水平 padding
 */
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

import AppToastStack from './AppToastStack.vue'
import IconBase from './IconBase.vue'

const route = useRoute()
const router = useRouter()
const settings = useSettingsStore()

const search = ref('')
const searchOpen = ref(false)
const searchInputEl = ref(null)

function openSearch() {
  searchOpen.value = true
  // 焦点延后到 DOM 显示后
  setTimeout(() => searchInputEl.value?.focus(), 50)
}

function closeSearch() {
  searchOpen.value = false
  search.value = ''
}

function submitSearch() {
  const q = search.value.trim()
  if (!q) return
  router.push({ name: 'library', query: { q } })
  closeSearch()
}

// 6 项主导航 — 所有页面共享
const mainNav = [
  { to: '/',           label: '首页' },
  { to: '/library',    label: '文章' },
  { to: '/notes',      label: '笔记' },
  { to: '/graph',      label: '图谱' },
  { to: '/guestbook',  label: '留言板' },
  { to: '/chat',       label: 'AI' },
]

// 判断当前 nav 项激活态(支持子路径)
function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <!-- 顶部 nav — 整站常驻,fixed 顶部 -->
  <header class="app-nav">
    <RouterLink to="/" class="brand" aria-label="APOS 首页">
      <span class="brand-mark"></span>
      <span class="brand-text">APOS</span>
    </RouterLink>

    <nav class="nav-links" aria-label="主导航">
      <RouterLink
        v-for="m in mainNav"
        :key="m.to"
        :to="m.to"
        :class="{ 'is-active': isActive(m.to) }"
      >{{ m.label }}</RouterLink>
    </nav>

    <div class="nav-actions">
      <button
        type="button"
        class="nav-icon-btn"
        aria-label="搜索文章"
        title="搜索文章 (在文章库)"
        @click="openSearch"
      >
        <IconBase name="search" :size="16" />
      </button>
      <RouterLink to="/settings" class="nav-icon-btn" aria-label="设置" title="设置">
        <IconBase name="settings" :size="16" />
      </RouterLink>
      <a
        href="https://github.com/Apos-DT"
        target="_blank"
        rel="noopener"
        class="nav-icon-btn"
        aria-label="GitHub"
        title="GitHub"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
        </svg>
      </a>
    </div>

    <!-- 搜索弹窗(整宽抽屉) -->
    <div v-if="searchOpen" class="nav-search-overlay" @click.self="closeSearch">
      <form class="nav-search-form" @submit.prevent="submitSearch">
        <IconBase name="search" :size="16" />
        <input
          ref="searchInputEl"
          v-model="search"
          type="search"
          placeholder="搜索文章 / 标签 / 关键字… 回车跳转文章库"
          aria-label="搜索"
          @keydown.escape="closeSearch"
        />
        <button type="button" class="nav-search-close" @click="closeSearch" aria-label="关闭">
          <IconBase name="close" :size="14" />
        </button>
      </form>
    </div>
  </header>

  <!-- 主体内容(全宽) — 各 view 自己控制 max-width -->
  <main class="app-main-wide">
    <slot />
  </main>

  <!-- 全局 toast -->
  <AppToastStack />
</template>

<style scoped>
/* nav-actions 容器 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--ink-2);
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
}
.nav-icon-btn:hover {
  color: var(--ink);
  background: oklch(0.94 0.008 80 / 0.7);
}

/* 主导航 link */
.nav-links {
  display: flex;
  flex: 1;
  justify-content: center;
  gap: 4px;
}
.nav-links a {
  position: relative;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--ink-2);
  letter-spacing: 0.01em;
  transition: color 0.3s, background 0.3s;
}
.nav-links a:hover {
  color: var(--ink);
  background: oklch(0.94 0.008 80 / 0.7);
}
.nav-links a.is-active {
  color: var(--accent);
  background: oklch(0.92 0.06 295 / 0.5);
  font-weight: 600;
}

/* 搜索抽屉 */
.nav-search-overlay {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  right: 0;
  padding: 18px clamp(20px, 4vw, 40px);
  background: oklch(0.985 0.003 80 / 0.96);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border-bottom: 1px solid var(--line-soft);
  z-index: 99;
  animation: search-slide-in 0.2s var(--ease-out);
}
@keyframes search-slide-in {
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.nav-search-form {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(720px, 96vw);
  margin: 0 auto;
  padding: 0 16px;
  height: 48px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  box-shadow: var(--shadow-card);
}
.nav-search-form > svg { color: var(--ink-3); flex-shrink: 0; }
.nav-search-form input {
  flex: 1;
  height: 100%;
  border: 0;
  background: transparent;
  font-size: 15px;
  color: var(--ink);
  outline: none;
}
.nav-search-form input::placeholder { color: var(--ink-3); }
.nav-search-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: 0;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
}
.nav-search-close:hover {
  color: var(--ink);
  background: oklch(0.94 0.008 80);
}

/* 主体全宽 */
.app-main-wide {
  min-height: calc(100vh - var(--nav-h));
  padding-top: var(--nav-h);
  position: relative;
  z-index: 2;
}

/* 移动端处理 */
@media (max-width: 720px) {
  .nav-links {
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .nav-links::-webkit-scrollbar { display: none; }
  .nav-links a {
    padding: 8px 10px;
    font-size: 13px;
    flex-shrink: 0;
  }
}
</style>
