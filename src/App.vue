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
    opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  filter: blur(14px);
}
.page-leave-to {
  opacity: 0;
}

/* ===== view 直接子元素 stagger 渐入 — opacity only =====
   page transition 0.5s 渐显的同时,内部 section/header/block 错峰 fade-in,
   制造"内容一层一层浮现"的层次感。
   只用 opacity,绝不引入 transform/位移,保证零 layout shift。 */
/* stagger 排除 modal/popup 类元素(它们由 JS 控制显隐 + 自己的 animation,
   不能被全局 opacity:0 + animation 覆盖,否则关弹窗时会出现"闪退") */
.home-page > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.post-page > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-gb > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-dashboard > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-library > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-notes > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-note-edit > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-tags > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-graph > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-stats > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-settings > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-chat > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]),
.view-portfolio > *:not(.gb-modal-mask):not(.modal):not([role="dialog"]):not([id$="modal"]) {
  opacity: 0;
  animation: view-child-fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 前 5 个直接子元素 stagger 90ms — 节奏更明显,丝滑感更强 */
.home-page > :nth-child(1),
.post-page > :nth-child(1),
.view-gb > :nth-child(1),
[class*="view-"] > :nth-child(1) { animation-delay: 0.22s; }

.home-page > :nth-child(2),
.post-page > :nth-child(2),
.view-gb > :nth-child(2),
[class*="view-"] > :nth-child(2) { animation-delay: 0.31s; }

.home-page > :nth-child(3),
.post-page > :nth-child(3),
.view-gb > :nth-child(3),
[class*="view-"] > :nth-child(3) { animation-delay: 0.40s; }

.home-page > :nth-child(4),
.post-page > :nth-child(4),
.view-gb > :nth-child(4),
[class*="view-"] > :nth-child(4) { animation-delay: 0.49s; }

.home-page > :nth-child(5),
.post-page > :nth-child(5),
.view-gb > :nth-child(5),
[class*="view-"] > :nth-child(5) { animation-delay: 0.58s; }

.home-page > :nth-child(n+6),
.post-page > :nth-child(n+6),
.view-gb > :nth-child(n+6),
[class*="view-"] > :nth-child(n+6) { animation-delay: 0.65s; }

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

/* ===== 全局卡片液态玻璃覆盖 =====
   两档:
     - 容器级卡片(dash-block/set-card/gb-card 等): 完整版,含 backdrop-filter
     - 列表 item(post-card/note-card/gb-item/tag 等): 轻量版,无 backdrop-filter
       避免大量并排元素堆叠 backdrop-filter 导致性能爆炸 */

/* —— 容器级卡片:完整液态玻璃 ——
   仅真正的"卡片块",不包括布局/列表容器。
   .po-section / .gb-replies / .contact-form 是 flex 容器不是卡片,
   全局覆盖会让它们在浅底背景上叠加白光形成色块,已剔除 */
.dash-block,
.set-card,
.gb-card,
.gb-publish,
.gb-stats-card {
  position: relative !important;
  background:
    /* 顶部 specular 减弱 0.55 → 0.32 避免在浅底叠加显白 */
    linear-gradient(180deg, oklch(1 0 0 / 0.32), oklch(1 0 0 / 0.02) 38%, oklch(1 0 0 / 0) 65%),
    linear-gradient(135deg, transparent 25%, oklch(0.95 0.05 290 / 0.04) 50%, transparent 75%),
    /* base 与全局 bg 色相一致,降低饱和度避免染色 */
    oklch(0.985 0.003 80 / 0.25) !important;
  backdrop-filter: blur(16px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(160%) !important;
  border: none !important;
  box-shadow:
    0 6px 22px -10px oklch(0.30 0.08 280 / 0.10),
    inset 0 1px 0 oklch(1 0 0 / 0.40),
    inset 0 -1px 0 oklch(0 0 0 / 0.02),
    0 0 0 1px oklch(1 0 0 / 0.20) !important;
  isolation: isolate;
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
/* 顶部弧形 specular — 强度减弱,更隐形 */
.dash-block::before,
.set-card::before,
.gb-card::before,
.gb-publish::before,
.gb-stats-card::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 12%;
  right: 12%;
  height: 40%;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 0%,
    oklch(1 0 0 / 0.18),
    oklch(1 0 0 / 0.02) 50%,
    transparent 80%
  );
  border-radius: inherit;
  opacity: 0.6;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.dash-block:hover,
.set-card:hover,
.gb-card:hover,
.gb-stats-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 14px 32px -10px oklch(0.30 0.10 280 / 0.16),
    inset 0 1px 0 oklch(1 0 0 / 0.55),
    inset 0 -1px 0 oklch(0 0 0 / 0.03),
    0 0 0 1px oklch(1 0 0 / 0.32) !important;
}

/* —— 列表 item:轻量液态玻璃(无 backdrop-filter,性能友好) ——
   color 与全局背景 oklch(0.985 0.003 80) 色相一致,避免染色 */
.post-card,
.note-card,
.gb-item,
.tag-card,
.tag-item,
.recent-item,
.quick-card,
.archive-card,
.po-exp,
.po-project-card,
.po-skill-card,
.po-award-card,
.po-edu,
.dash-tile,
.tool-tile,
.experience-card,
.stack-card,
.archive-item {
  background:
    linear-gradient(180deg, oklch(1 0 0 / 0.32), oklch(0.985 0.003 80 / 0.18)),
    oklch(0.985 0.003 80 / 0.55) !important;
  border: none !important;
  box-shadow:
    0 3px 12px -6px oklch(0.30 0.08 280 / 0.06),
    inset 0 1px 0 oklch(1 0 0 / 0.40),
    0 0 0 1px oklch(0.86 0.008 80 / 0.32) !important;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.post-card:hover,
.note-card:hover,
.gb-item:hover,
.tag-card:hover,
.recent-item:hover,
.quick-card:hover,
.po-exp:hover,
.po-project-card:hover,
.po-skill-card:hover,
.po-award-card:hover,
.dash-tile:hover,
.tool-tile:hover {
  transform: translateY(-3px) !important;
  box-shadow:
    0 12px 24px -8px oklch(0.30 0.10 280 / 0.15),
    inset 0 1px 0 oklch(1 0 0 / 0.55),
    0 0 0 1px oklch(0.55 0.20 295 / 0.32) !important;
}
</style>
