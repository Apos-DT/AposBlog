<script setup>
/**
 * 右栏默认工具:主题色相 + 字号 + 数据概览
 */
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'

const settings = useSettingsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const tags = useTagsStore()

const swatch = computed(() => `oklch(0.72 0.21 ${settings.hue})`)
</script>

<template>
  <div class="tqp">
    <span class="tqp-label">主题色相</span>
    <input
      type="range"
      min="0"
      max="360"
      :value="settings.hue"
      @input="settings.setHue($event.target.value)"
      aria-label="主题色相"
      class="tqp-range"
    />
    <div class="tqp-hue">
      <span class="swatch" :style="{ background: swatch, boxShadow: `0 0 10px ${swatch}` }"></span>
      <span class="value">{{ settings.hue }}°</span>
    </div>
  </div>

  <div class="tqp">
    <span class="tqp-label">字号</span>
    <div class="tqp-tabs">
      <button
        v-for="fz in [14, 16, 18]"
        :key="fz"
        type="button"
        :class="['tab', { active: settings.fontSize === fz }]"
        @click="settings.setFontSize(fz)"
      >
        {{ fz === 14 ? '紧凑' : fz === 16 ? '标准' : '舒适' }}
      </button>
    </div>
  </div>

  <div class="tqp">
    <span class="tqp-label">数据快照</span>
    <div class="tqp-stat"><span>文章</span><strong>{{ reads.stats.total }}</strong></div>
    <div class="tqp-stat"><span>已读</span><strong class="ok">{{ reads.stats.done }}</strong></div>
    <div class="tqp-stat"><span>在读</span><strong>{{ reads.stats.reading }}</strong></div>
    <div class="tqp-stat"><span>收藏</span><strong>{{ reads.stats.collected }}</strong></div>
    <div class="tqp-stat"><span>笔记</span><strong>{{ notes.stats.total }}</strong></div>
    <div class="tqp-stat"><span>标签</span><strong>{{ tags.tags.length }}</strong></div>
  </div>
</template>

<style scoped>
.tqp {
  padding: 14px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.20 0.014 280 / 0.4);
  margin-bottom: 12px;
  transition: border-color 0.4s;
}
.tqp:hover { border-color: var(--line); }
.tqp-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 10px;
}
.tqp-range {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--line);
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.tqp-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.tqp-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 0 0 6px oklch(0.72 0.21 295 / 0.2);
}
.tqp-range::-moz-range-thumb {
  width: 16px; height: 16px; border: 0;
  border-radius: 50%; background: var(--accent); cursor: pointer;
}
.tqp-hue {
  display: flex; align-items: center; gap: 8px;
  margin-top: 8px;
}
.tqp-hue .swatch {
  width: 18px; height: 18px;
  border-radius: 5px;
  border: 1px solid var(--line);
}
.tqp-hue .value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
}

.tqp-tabs { display: flex; gap: 6px; }
.tqp-tabs .tab {
  flex: 1;
  padding: 7px 8px;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: transparent;
  font-family: var(--font-display);
  font-size: 12.5px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.tqp-tabs .tab:hover { color: var(--ink); border-color: var(--ink-3); }
.tqp-tabs .tab.active {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

.tqp-stat {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 6px 0;
  border-bottom: 1px solid var(--line-soft);
  font-size: 12.5px;
}
.tqp-stat:last-child { border-bottom: none; }
.tqp-stat span { color: var(--ink-2); }
.tqp-stat strong {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--ink);
}
.tqp-stat strong.ok { color: var(--success); }
</style>
