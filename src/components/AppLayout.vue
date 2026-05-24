<script setup>
/**
 * 统一布局组件
 *  - 顶部 nav fixed 常驻,5 个主项 + 2 个有 hover 子菜单
 *  - 主体全宽,各 view 自己控制 max-width
 */
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import AppToastStack from './AppToastStack.vue'
import IconBase from './IconBase.vue'

const route = useRoute()
const router = useRouter()

const search = ref('')
const searchOpen = ref(false)
const searchInputEl = ref(null)

// nav 滚动收缩为悬浮岛 — iOS 26 liquid glass 风格
const lifted = ref(false)
// 临时禁用 transition,避免路由切换瞬间 lifted 重置触发 1s 抖动过渡
const navNoTransition = ref(false)
let rafId = 0
function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    lifted.value = window.scrollY > 30
    rafId = 0
  })
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(rafId)
})

// 路由切换:同步重置 lifted + 临时禁用 transition,避免抖动
watch(() => route.fullPath, async () => {
  navNoTransition.value = true
  lifted.value = false
  // 等一帧 + 一次 nextTick,让浏览器应用 no-transition 类后再恢复
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      navNoTransition.value = false
      // 切换完成后用新 scrollY 重新判定 lifted(用户路由后立刻向下滚的边界场景)
      onScroll()
    })
  })
})

function openSearch() {
  searchOpen.value = true
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

/**
 * 主导航定义
 *   - root 直接是 RouterLink + 可选 children 子菜单
 *   - 鼠标 hover 主项时子菜单展开
 */
// mobileHide:手机端(<= 720px)隐藏该项,精简到核心 5 项让悬浮岛能容下
const mainNav = [
  { to: '/',          label: '首页' },
  { to: '/library',   label: '文章' },
  { to: '/notes',     label: '知识库' },
  { to: '/graph',     label: '知识图谱', mobileHide: true },
  { to: '/portfolio', label: '作品集' },
  { to: '/guestbook', label: '留言板', mobileHide: true },
  { to: '/chat',      label: 'AI' },
  {
    to: '/settings',
    label: '工具',
    hasChildren: true,
    mobileHide: true,
    children: [
      { to: '/dashboard', label: '仪表板',   desc: '阅读与知识库总览' },
      { to: '/tags',      label: '标签',     desc: '知识库标签管理' },
      { to: '/stats',     label: '阅读统计', desc: '阅读 / 知识库 / 标签 4 张图' },
      { to: '/settings',  label: '设置',     desc: '主题 / AI / 数据备份' },
    ],
  },
]

// 当前 nav 项是否激活(支持子路径,且子菜单内任一项激活也算父项激活)
function isActive(item) {
  if (item.to === '/') return route.path === '/'
  if (route.path === item.to || route.path.startsWith(item.to + '/')) return true
  if (item.children) {
    return item.children.some(
      (c) => route.path === c.to || route.path.startsWith(c.to + '/')
    )
  }
  return false
}
</script>

<template>
  <header class="app-nav" :class="{ 'is-lifted': lifted, 'no-transition': navNoTransition }">
    <RouterLink to="/" class="brand" aria-label="APOS 首页">
      <span class="brand-mark"></span>
      <span class="brand-text">APOS</span>
    </RouterLink>

    <nav class="nav-links" aria-label="主导航">
      <div
        v-for="m in mainNav"
        :key="m.label"
        class="nav-item"
        :class="{ 'has-children': m.hasChildren, 'nav-item-mobile-hide': m.mobileHide }"
      >
        <RouterLink
          :to="m.to"
          class="nav-link"
          :class="{ 'is-active': isActive(m) }"
        >
          <span>{{ m.label }}</span>
          <svg
            v-if="m.hasChildren"
            class="nav-caret"
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </RouterLink>

        <!-- 子菜单 -->
        <div v-if="m.hasChildren" class="nav-submenu" role="menu">
          <RouterLink
            v-for="c in m.children"
            :key="c.to"
            :to="c.to"
            class="nav-submenu-item"
            role="menuitem"
          >
            <span class="nav-submenu-label">{{ c.label }}</span>
            <span class="nav-submenu-desc">{{ c.desc }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="nav-actions">
      <button
        type="button"
        class="nav-icon-btn"
        aria-label="搜索文章"
        title="搜索文章"
        @click="openSearch"
      >
        <IconBase name="search" :size="16" />
      </button>
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

    <!-- 搜索抽屉 -->
    <div v-if="searchOpen" class="nav-search-overlay" @click.self="closeSearch">
      <form class="nav-search-form" @submit.prevent="submitSearch">
        <IconBase name="search" :size="16" />
        <input
          ref="searchInputEl"
          v-model="search"
          type="search"
          placeholder="搜索文章 / 标签 / 关键字… 回车跳转文章列表"
          aria-label="搜索"
          @keydown.escape="closeSearch"
        />
        <button type="button" class="nav-search-close" @click="closeSearch" aria-label="关闭">
          <IconBase name="close" :size="14" />
        </button>
      </form>
    </div>
  </header>

  <main class="app-main-wide">
    <slot />
  </main>

  <AppToastStack />
</template>

<style scoped>
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

/* ===== 主导航 ===== */
.nav-links {
  display: flex;
  flex: 1;
  flex-wrap: nowrap;           /* 不换行 */
  justify-content: center;
  gap: 4px;
  min-width: 0;                 /* 允许内容溢出,让 overflow-x 生效 */
}
.nav-item {
  position: relative;
  /* hover 缓冲区,确保鼠标可以从 nav-link 平滑过渡到 submenu */
  padding-bottom: 4px;
  margin-bottom: -4px;
  flex-shrink: 0;               /* 不被父级 flex 压扁 */
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--ink-2);
  letter-spacing: 0.01em;
  white-space: nowrap;          /* 中文不单字换行 */
  flex-shrink: 0;
  transition: color 0.3s, background 0.3s;
}
.nav-link > span { white-space: nowrap; }
.nav-link:hover {
  color: var(--ink);
  background: oklch(0.94 0.008 80 / 0.7);
}
.nav-link.is-active {
  color: var(--accent);
  background: oklch(0.92 0.06 295 / 0.5);
  font-weight: 600;
}
.nav-caret {
  transition: transform 0.2s var(--ease-out);
  opacity: 0.6;
}
.nav-item.has-children:hover .nav-caret,
.nav-item.has-children:focus-within .nav-caret {
  transform: rotate(180deg);
  opacity: 1;
}

/* ===== 子菜单 ===== */
.nav-submenu {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) translateY(-6px);
  min-width: 260px;
  padding: 8px;
  border-radius: 12px;
  background: var(--bg);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-lift);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s var(--ease-out),
              transform 0.2s var(--ease-out),
              visibility 0.2s;
  z-index: 110;
}
.nav-item:hover .nav-submenu,
.nav-item:focus-within .nav-submenu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
/* 子菜单与 nav-link 之间的透明 buffer,确保鼠标过渡时不丢失 hover */
.nav-submenu::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 0; right: 0;
  height: 10px;
}

.nav-submenu-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--ink-2);
  transition: color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
}
.nav-submenu-item:hover {
  color: var(--ink);
  background: oklch(0.94 0.04 295 / 0.5);
  transform: translateX(3px);
}
.nav-submenu-item.router-link-active {
  background: oklch(0.92 0.06 295 / 0.5);
}
.nav-submenu-label {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 13.5px;
  color: var(--ink);
}
.nav-submenu-desc {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}

/* ===== 搜索抽屉 ===== */
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

.app-main-wide {
  min-height: calc(100vh - var(--nav-h));
  padding-top: var(--nav-h);
  position: relative;
  z-index: 2;
}

/* 手机端隐藏次要 nav 项,核心 5 项让悬浮岛能容下 */
@media (max-width: 720px) {
  .nav-item-mobile-hide { display: none !important; }
}

@media (max-width: 720px) {
  .nav-links {
    gap: 4px;
    justify-content: center;  /* 精简到 5 项后改回居中 */
    padding: 6px 0;
    /* 5 项不再需要 overflow scroll,但留 nowrap 防止意外换行 */
    flex-wrap: nowrap;
  }
  .nav-link {
    padding: 8px 12px;
    font-size: 13px;
    /* 显式保证最小高度让上下呼吸 */
    min-height: 36px;
    line-height: 1.2;
  }
  .nav-link > span {
    display: inline-block;
    /* 显式 nowrap + 不允许字间 break */
    white-space: nowrap;
    word-break: keep-all;
  }
  /* 移动端禁用 hover 子菜单 */
  .nav-submenu { display: none; }
  .nav-caret { display: none; }
  .brand { font-size: 13px; gap: 6px; }
  .nav-icon-btn { width: 36px; height: 36px; }
  .nav-actions { gap: 2px; }
  .app-main-wide { padding-top: var(--nav-h); }
}
/* 中小屏:brand 文字隐藏 */
@media (max-width: 540px) {
  .brand-text { display: none; }
}
/* 超窄屏 */
@media (max-width: 420px) {
  .nav-link { padding: 8px 10px; font-size: 12.5px; }
  .nav-search-overlay { padding: 12px 16px; }
  .nav-search-form { height: 44px; padding: 0 12px; }
}
</style>
