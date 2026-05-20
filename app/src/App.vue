<script setup>
/**
 * 根组件:
 * - 装载背景层(极光 / grain)与自定义光标
 * - <router-view> 渲染当前路由对应的视图
 */
import { onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppBackground from '@/components/AppBackground.vue'
import AppCursor from '@/components/AppCursor.vue'
import AppLayout from '@/components/AppLayout.vue'

const settings = useSettingsStore()

// 启动时应用持久化的主题色相与字号
onMounted(() => {
  settings.applyTheme()
})

// 切换路由时滚动到顶部
onUnmounted(() => {})
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
