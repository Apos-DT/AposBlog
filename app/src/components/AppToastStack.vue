<script setup>
/**
 * 全局 toast 容器 — 由 settings.pushToast(type, text) 触发
 */
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
</script>

<template>
  <div class="ui-toast-stack" aria-live="polite" aria-atomic="true">
    <div
      v-for="t in settings.toasts"
      :key="t.id"
      :class="['ui-toast', t.type, { leaving: t.leaving }]"
      :role="t.type === 'error' || t.type === 'warning' ? 'alert' : 'status'"
    >
      {{ t.text }}
    </div>
  </div>
</template>
