/**
 * 笔记 store — CRUD 主力
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import initial from '@/data/initial.json'
import { persist } from './_persist'

function genId() {
  return 'n-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])

  persist('notes', { notes }, () => ({ notes: initial.notes }))

  const sorted = computed(() =>
    [...notes.value].sort((a, b) => {
      // pinned 优先,然后按 updatedAt 倒序
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
      return (b.updatedAt || '').localeCompare(a.updatedAt || '')
    })
  )

  function findById(id) {
    return notes.value.find((n) => n.id === id)
  }

  function create(data = {}) {
    const now = new Date().toISOString()
    const note = {
      id: genId(),
      title: data.title || '未命名笔记',
      content: data.content || '',
      articleSlug: data.articleSlug || null,
      tagIds: data.tagIds || [],
      pinned: !!data.pinned,
      createdAt: now,
      updatedAt: now,
    }
    notes.value.unshift(note)
    return note
  }

  function update(id, patch) {
    const i = notes.value.findIndex((n) => n.id === id)
    if (i < 0) return null
    notes.value[i] = {
      ...notes.value[i],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    return notes.value[i]
  }

  function remove(id) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  function togglePin(id) {
    const n = findById(id)
    if (n) update(id, { pinned: !n.pinned })
  }

  function search({ keyword = '', tagId = null, articleSlug = null } = {}) {
    let list = sorted.value
    if (tagId) list = list.filter((n) => (n.tagIds || []).includes(tagId))
    if (articleSlug) list = list.filter((n) => n.articleSlug === articleSlug)
    if (keyword) {
      const k = keyword.toLowerCase()
      list = list.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(k) ||
          (n.content || '').toLowerCase().includes(k)
      )
    }
    return list
  }

  const stats = computed(() => ({
    total: notes.value.length,
    pinned: notes.value.filter((n) => n.pinned).length,
    withArticle: notes.value.filter((n) => n.articleSlug).length,
  }))

  return {
    notes,
    sorted,
    findById,
    create,
    update,
    remove,
    togglePin,
    search,
    stats,
  }
})
