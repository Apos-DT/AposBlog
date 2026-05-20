<script setup>
/**
 * 根组件
 *  - 装载背景层 / 自定义光标
 *  - Lenis 全站平滑滚动
 *  - <router-view> 渲染当前路由对应的视图
 */
import { onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'

import { useSettingsStore } from '@/stores/settings'
import AppBackground from '@/components/AppBackground.vue'
import AppCursor from '@/components/AppCursor.vue'
import AppLayout from '@/components/AppLayout.vue'

const settings = useSettingsStore()

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
/* 全局路由过渡 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
