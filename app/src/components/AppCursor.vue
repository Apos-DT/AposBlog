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

  const enter = () => document.body.classList.add('cursor-hover')
  const leave = () => document.body.classList.remove('cursor-hover')
  const bind = () => {
    document.querySelectorAll('a, button, .ui-card, .post-card, [data-cursor="link"]').forEach((el) => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })
  }
  bind()
  // 监听 DOM 变化(路由切换后重新绑定)
  const mo = new MutationObserver(() => bind())
  mo.observe(document.body, { childList: true, subtree: true })

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
    mo.disconnect()
    leave()
  }
})

onBeforeUnmount(() => cleanup && cleanup())
</script>

<template>
  <div ref="dot" class="app-cursor-dot" aria-hidden="true"></div>
  <div ref="ring" class="app-cursor-ring" aria-hidden="true"></div>
</template>
