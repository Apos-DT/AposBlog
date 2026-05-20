<script setup>
/**
 * 右栏简洁工具:数据快照 + 当前路由的小贴士
 * (砍掉了主题色滑块与字号切换 — 博客网站不需要工具感)
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'

const route = useRoute()
const reads = useReadsStore()
const notes = useNotesStore()
const tags = useTagsStore()

const tipByRoute = computed(() => {
  const n = route.name
  return ({
    dashboard: '在这里看你的阅读与笔记总览。',
    library: '点右上 + 加文章。点心形收藏。',
    notes: '新建时挑一个 Karpathy 模板。',
    tags: '调色板的颜色会同步到笔记标签。',
    graph: '拖动节点重排,占位灰节点可一键创建。',
    stats: '所有图表都基于你本地的阅读与笔记数据。',
    settings: '所有数据本地存储,可一键导出 JSON 备份。',
    chat: '会话保存在本地,API key 也只在本机存储。',
  })[n] || '在博客与知识库之间无缝切换。'
})
</script>

<template>
  <div class="tqp">
    <span class="tqp-label">数据快照</span>
    <div class="tqp-stat"><span>文章</span><strong>{{ reads.stats.total }}</strong></div>
    <div class="tqp-stat"><span>已读</span><strong class="ok">{{ reads.stats.done }}</strong></div>
    <div class="tqp-stat"><span>收藏</span><strong>{{ reads.stats.collected }}</strong></div>
    <div class="tqp-stat"><span>笔记</span><strong>{{ notes.stats.total }}</strong></div>
    <div class="tqp-stat"><span>双向链接</span><strong>{{ notes.stats.totalLinks }}</strong></div>
    <div class="tqp-stat"><span>标签</span><strong>{{ tags.tags.length }}</strong></div>
  </div>

  <div class="tqp tip">
    <span class="tqp-label">小贴士</span>
    <p>{{ tipByRoute }}</p>
  </div>
</template>

<style scoped>
.tqp {
  padding: 14px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.985 0.003 80 / 0.7);
  margin-bottom: 10px;
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

.tqp.tip p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ink-2);
}
</style>
