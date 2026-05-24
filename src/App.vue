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
/* 全局路由过渡 — 仅 opacity 渐变,不用 transform 避免:
   1. transform 创建 stacking context 影响 fixed 元素定位
   2. translateY 与 Lenis 平滑滚动叠加产生右移视觉
   3. enter 阶段 translateY 12px → 0 让用户看到"位置变化" */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
