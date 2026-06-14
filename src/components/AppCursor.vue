<script setup>
/**
 * 自定义光标 — 小点跟手 + 大环 lerp 黏滞
 * 触屏设备隐藏(已在 CSS @media hover)
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'

const dot = ref(null)
const ring = ref(null)
let raf = 0
let cleanup = null

onMounted(() => {
  if (!matchMedia('(hover: hover)').matches) return
  const m = { x: innerWidth / 2, y: innerHeight / 2 }
  const r = { x: m.x, y: m.y }
  const lerp = (a, b, n) => a + (b - a) * n

  const onMove = (e) => {
    m.x = e.clientX
    m.y = e.clientY
  }
  window.addEventListener('mousemove', onMove, { passive: true })

  const tick = () => {
    r.x = lerp(r.x, m.x, 0.16)
    r.y = lerp(r.y, m.y, 0.16)
    if (dot.value)
      dot.value.style.transform = `translate3d(${m.x - 3}px, ${m.y - 3}px, 0)`
    if (ring.value)
      ring.value.style.transform = `translate3d(${r.x - 18}px, ${r.y - 18}px, 0)`
    raf = requestAnimationFrame(tick)
  }
  tick()

  // 事件委托：document 上挂一对监听，closest 判定可交互元素
  // （取代逐元素绑定 + MutationObserver 全量重绑，避免 AI 流式输出时 DOM 高频变动导致监听堆积/卡顿）
  const SEL = 'a, button, .ui-card, .post-card, [data-cursor="link"]'
  const over = (e) => { if (e.target.closest && e.target.closest(SEL)) document.body.classList.add('cursor-hover') }
  const out = (e) => { if (e.target.closest && e.target.closest(SEL)) document.body.classList.remove('cursor-hover') }
  document.addEventListener('mouseover', over, { passive: true })
  document.addEventListener('mouseout', out, { passive: true })

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseover', over)
    document.removeEventListener('mouseout', out)
    document.body.classList.remove('cursor-hover')
  }
})

onBeforeUnmount(() => cleanup && cleanup())
</script>

<template>
  <div ref="dot" class="app-cursor-dot" aria-hidden="true"></div>
  <div ref="ring" class="app-cursor-ring" aria-hidden="true"></div>
</template>
