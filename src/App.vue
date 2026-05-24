<script setup>
/**
 * 根组件
 *  - 装载背景层 / 自定义光标
 *  - Lenis 全站平滑滚动
 *  - <router-view> 渲染当前路由对应的视图
 */
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import Lenis from 'lenis'

import { useSettingsStore } from '@/stores/settings'
import AppBackground from '@/components/AppBackground.vue'
import AppCursor from '@/components/AppCursor.vue'
import AppLayout from '@/components/AppLayout.vue'

const settings = useSettingsStore()
const route = useRoute()

let lenis = null
let rafId = 0

onMounted(() => {
  settings.applyTheme()

  // 启动 Lenis 平滑滚动 (减少动效用户跳过)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })
    const raf = (t) => {
      lenis.raf(t)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  }
})

// 路由切换时让 Lenis 立即(无动画)滚到顶部,
// 避免 Lenis 的平滑滚动动画期间页面 transform 持续变化导致视觉右移
watch(() => route.fullPath, () => {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
  } else {
    window.scrollTo(0, 0)
  }
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (lenis) lenis.destroy()
})
</script>

<template>
  <AppBackground />
  <AppCursor />
  <AppLayout>
    <router-view v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </AppLayout>
</template>

<style>
/* 全局路由过渡 — 不引入 layout shift 前提下的"丝滑入场"
   策略:opacity + filter blur 双轨,故意不用 transform
     - opacity: 0 → 1
     - filter: blur(8px) → 0(不影响 box 几何,纯视觉)
   leave 比 enter 快,让新页面更早"亮"出来 */
.page-enter-active {
  transition:
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  filter: blur(8px);
}
.page-leave-to {
  opacity: 0;
}

/* ===== view 直接子元素 stagger 渐入 — opacity only =====
   page transition 0.5s 渐显的同时,内部 section/header/block 错峰 fade-in,
   制造"内容一层一层浮现"的层次感。
   只用 opacity,绝不引入 transform/位移,保证零 layout shift。 */
.home-page > *,
.post-page > *,
.view-gb > *,
.view-dashboard > *,
.view-library > *,
.view-notes > *,
.view-note-edit > *,
.view-tags > *,
.view-graph > *,
.view-stats > *,
.view-settings > *,
.view-chat > *,
.view-portfolio > * {
  opacity: 0;
  animation: view-child-fade-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 前 6 个直接子元素 stagger 70ms,后面统一 0.5s 入场 */
.home-page > :nth-child(1),
.post-page > :nth-child(1),
.view-gb > :nth-child(1),
[class*="view-"] > :nth-child(1) { animation-delay: 0.18s; }

.home-page > :nth-child(2),
.post-page > :nth-child(2),
.view-gb > :nth-child(2),
[class*="view-"] > :nth-child(2) { animation-delay: 0.25s; }

.home-page > :nth-child(3),
.post-page > :nth-child(3),
.view-gb > :nth-child(3),
[class*="view-"] > :nth-child(3) { animation-delay: 0.32s; }

.home-page > :nth-child(4),
.post-page > :nth-child(4),
.view-gb > :nth-child(4),
[class*="view-"] > :nth-child(4) { animation-delay: 0.39s; }

.home-page > :nth-child(5),
.post-page > :nth-child(5),
.view-gb > :nth-child(5),
[class*="view-"] > :nth-child(5) { animation-delay: 0.46s; }

.home-page > :nth-child(n+6),
.post-page > :nth-child(n+6),
.view-gb > :nth-child(n+6),
[class*="view-"] > :nth-child(n+6) { animation-delay: 0.52s; }

@keyframes view-child-fade-in {
  to { opacity: 1; }
}

/* 减少动效用户跳过所有 stagger */
@media (prefers-reduced-motion: reduce) {
  .home-page > *,
  .post-page > *,
  .view-gb > *,
  [class*="view-"] > * {
    opacity: 1 !important;
    animation: none !important;
  }
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.15s ease !important;
  }
  .page-enter-from {
    filter: none !important;
  }
}
</style>
