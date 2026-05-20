<script setup>
/**
 * 背景层 — 极光 blob + 噪点 grain
 * blob 跟随鼠标轻微视差,营造空间感
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'

const blobsEl = ref(null)
let cleanup = null

onMounted(() => {
  const blobs = blobsEl.value ? blobsEl.value.querySelectorAll('.blob') : []
  if (!blobs.length) return
  const onMove = (e) => {
    const x = e.clientX / window.innerWidth - 0.5
    const y = e.clientY / window.innerHeight - 0.5
    blobs.forEach((b, i) => {
      const k = (i + 1) * 14
      b.style.transform = `translate3d(${x * k}px, ${y * k}px, 0)`
    })
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  cleanup = () => window.removeEventListener('mousemove', onMove)
})

onBeforeUnmount(() => cleanup && cleanup())
</script>

<template>
  <div class="app-bg-grain" aria-hidden="true"></div>
  <div ref="blobsEl" class="app-bg-aurora" aria-hidden="true">
    <span class="blob a"></span>
    <span class="blob b"></span>
    <span class="blob c"></span>
  </div>
</template>
