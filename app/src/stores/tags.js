/**
 * 标签 store — 自定义分类与配色
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import initial from '@/data/initial.json'
import { persist } from './_persist'

function genId() {
  return 't-' + Math.random().toString(36).slice(2, 9)
}

const PALETTE = [
  'oklch(0.72 0.21 295)',
  'oklch(0.78 0.18 220)',
  'oklch(0.82 0.16 60)',
  'oklch(0.78 0.18 160)',
  'oklch(0.75 0.20 320)',
  'oklch(0.78 0.15 30)',
  'oklch(0.74 0.17 180)',
  'oklch(0.72 0.20 0)',
]

export const useTagsStore = defineStore('tags', () => {
  const tags = ref([])

  persist('tags', { tags }, () => ({ tags: initial.tags }))

  const all = computed(() => [...tags.value])

  function findById(id) {
    return tags.value.find((t) => t.id === id)
  }

  function findByName(name) {
    return tags.value.find((t) => t.name === name)
  }

  function create({ name, color }) {
    if (!name) throw new Error('标签名不能为空')
    if (findByName(name)) throw new Error('同名标签已存在')
    const t = {
      id: genId(),
      name,
      color: color || PALETTE[tags.value.length % PALETTE.length],
    }
    tags.value.push(t)
    return t
  }

  function update(id, patch) {
    const i = tags.value.findIndex((t) => t.id === id)
    if (i < 0) return
    tags.value[i] = { ...tags.value[i], ...patch }
  }

  function remove(id) {
    tags.value = tags.value.filter((t) => t.id !== id)
  }

  function colorOf(id) {
    return findById(id)?.color || 'var(--ink-3)'
  }

  function nameOf(id) {
    return findById(id)?.name || ''
  }

  return { tags, all, palette: PALETTE, findById, findByName, create, update, remove, colorOf, nameOf }
})
