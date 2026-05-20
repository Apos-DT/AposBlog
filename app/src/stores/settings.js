/**
 * 设置 store — 主题色相 / 字号 / toast / 全局开关
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { persist } from './_persist'

export const useSettingsStore = defineStore('settings', () => {
  const hue = ref(295) // 0-360
  const fontSize = ref(16) // 14 / 16 / 18
  const reducedMotion = ref(false)

  // 全局 toast 队列
  const toasts = ref([])

  persist('settings', { hue, fontSize, reducedMotion }, () => ({
    hue: 295,
    fontSize: 16,
    reducedMotion: false,
  }))

  function applyTheme() {
    const root = document.documentElement
    root.style.setProperty('--accent', `oklch(0.72 0.21 ${hue.value})`)
    root.style.fontSize = fontSize.value + 'px'
  }

  function setHue(v) {
    hue.value = Math.max(0, Math.min(360, parseInt(v, 10) || 0))
    applyTheme()
  }

  function setFontSize(v) {
    fontSize.value = parseInt(v, 10) || 16
    applyTheme()
  }

  function pushToast(type, text, duration = 2800) {
    const id = Math.random().toString(36).slice(2)
    toasts.value.push({ id, type, text })
    setTimeout(() => {
      const i = toasts.value.findIndex((t) => t.id === id)
      if (i >= 0) toasts.value[i].leaving = true
      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id)
      }, 300)
    }, duration)
  }

  return {
    hue,
    fontSize,
    reducedMotion,
    toasts,
    applyTheme,
    setHue,
    setFontSize,
    pushToast,
  }
})
