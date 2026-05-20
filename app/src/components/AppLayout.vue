<script setup>
/**
 * 主布局 — 顶部 nav + 三栏 grid + 全局 toast 容器
 * 左栏:菜单(7 个 route)+ 实时指示 + 数量徽章
 * 主区:<slot> 渲染当前路由
 * 右栏:工具面板(主色 / 字号 / 数据快照),由各 view 通过 <teleport> 注入
 *      默认显示 ThemeQuickPanel
 */
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useReadsStore } from '@/stores/reads'
import { useTagsStore } from '@/stores/tags'
import { useSettingsStore } from '@/stores/settings'

import ThemeQuickPanel from './ThemeQuickPanel.vue'
import AppToastStack from './AppToastStack.vue'
import IconBase from './IconBase.vue'

const route = useRoute()
const router = useRouter()
const notes = useNotesStore()
const reads = useReadsStore()
const tags = useTagsStore()
const settings = useSettingsStore()

const search = ref('')

function submitSearch() {
  const q = search.value.trim()
  if (!q) return
  router.push({ name: 'library', query: { q } })
  settings.pushToast('info', `已跳到文章库搜索:"${q}"`)
}

const menu = computed(() => [
  { to: '/', label: '仪表板', icon: 'dashboard', badge: null },
  { to: '/library', label: '文章库', icon: 'library', badge: null },
  { to: '/notes', label: '笔记', icon: 'notes', badge: notes.stats.total },
  { to: '/tags', label: '标签', icon: 'tags', badge: tags.tags.length },
  { to: '/graph', label: '知识图谱', icon: 'graph', badge: notes.stats.totalLinks || null },
  { to: '/stats', label: '统计', icon: 'stats', badge: null },
  { to: '/settings', label: '设置', icon: 'settings', badge: null },
])
</script>

<template>
  <!-- 顶部 nav -->
  <header class="app-nav">
    <RouterLink to="/" class="brand">
      <span class="brand-mark"></span>
      <span>APOS · 阅读与笔记</span>
    </RouterLink>

    <form class="nav-search" @submit.prevent="submitSearch">
      <IconBase name="search" :size="14" />
      <input
        v-model="search"
        type="search"
        placeholder="搜索文章 / 笔记 / 标签… (回车跳转文章库)"
        aria-label="全局搜索"
      />
    </form>

    <a href="../../" class="nav-back" data-cursor="link">
      <IconBase name="arrow-left" :size="14" />
      <span>返回博客</span>
    </a>
  </header>

  <!-- 三栏 grid -->
  <div class="app-layout">
    <!-- 左栏 菜单 -->
    <aside class="app-aside" aria-label="侧边导航">
      <div class="app-aside-inner">
        <span class="app-aside-label">导航</span>
        <nav class="app-menu">
          <RouterLink v-for="m in menu" :key="m.to" :to="m.to">
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

    <!-- 主区 -->
    <main class="app-main">
      <slot />
    </main>

    <!-- 右栏 工具 -->
    <aside class="app-tools" aria-label="工具面板">
      <div class="app-tools-inner">
        <!-- view 可以通过 <teleport to=".app-tools-mount"> 注入自定义内容 -->
        <div class="app-tools-mount"></div>
        <ThemeQuickPanel />
      </div>
    </aside>
  </div>

  <!-- 全局 Toast -->
  <AppToastStack />
</template>
