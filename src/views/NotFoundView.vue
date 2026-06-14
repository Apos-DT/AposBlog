<script setup>
import { RouterLink } from 'vue-router'
import IconBase from '@/components/IconBase.vue'
</script>

<template>
  <section class="view-404">
    <span class="big">404</span>
    <h1>页面不存在</h1>
    <p>这个路由可能拼错了,或者还没有实现。</p>
    <RouterLink to="/" class="ui-btn ui-btn-primary">
      <IconBase name="arrow-left" :size="14" />
      <span>回到首页</span>
    </RouterLink>
  </section>
</template>

<style scoped>
.view-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  gap: 16px;
}
.big {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(80px, 14vw, 180px);
  line-height: 1;
  background: linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 60%, var(--accent-warm) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.04em;
}
.view-404 h1 {
  font-family: var(--font-display);
  font-size: clamp(22px, 3vw, 30px);
  margin: 0;
}
.view-404 p {
  color: var(--ink-2);
  font-size: 14px;
  margin: 0;
}
</style>
