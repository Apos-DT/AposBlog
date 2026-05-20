/**
 * 笔记 store — Karpathy 风格知识库 + 双向链接 + 反向链接
 * ----------------------------------------------------------
 * 数据结构:
 *   {
 *     id, title, content,
 *     articleSlug, tagIds[], pinned, createdAt, updatedAt,
 *     // 派生(由 content 解析 + 缓存):
 *     // meta: {...},     ← frontmatter (status / date / references / 自定义)
 *     // outLinks: [...]  ← content 里出现的 [[target]] (target = 笔记标题)
 *     // inlineTags:[...] ← content 里出现的 #tag
 *   }
 *
 * 双向链接索引: titleIndex { lowercaseTitle → noteId } + outLinks (写入时计算)
 * 反向链接:    getBacklinks(idOrTitle) → 反向遍历所有笔记的 outLinks
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import initial from '@/data/initial.json'
import { persist } from './_persist'
import { parseFrontmatter, extractWikiLinks, extractInlineTags } from '@/utils/markdown'

function genId() {
  return 'n-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])

  persist('notes', { notes }, () => ({ notes: initial.notes }))

  // ====================== 派生数据 (computed) ======================

  /** 标题 → 笔记 id 索引(小写,用于 wiki link 解析) */
  const titleIndex = computed(() => {
    const m = {}
    notes.value.forEach((n) => {
      if (n.title) m[n.title.toLowerCase().trim()] = n.id
    })
    return m
  })

  /** 笔记 id → outLinks (目标 noteId 数组,只保留实际存在的链接) */
  const outLinksByNote = computed(() => {
    const m = {}
    notes.value.forEach((n) => {
      const targets = extractWikiLinks(n.content || '')
      m[n.id] = targets
        .map((t) => titleIndex.value[t.toLowerCase().trim()])
        .filter((id) => id && id !== n.id) // 排除自引用 + 不存在的
    })
    return m
  })

  /** 笔记 id → backlinks (反向 id 数组) */
  const backlinksByNote = computed(() => {
    const m = {}
    notes.value.forEach((n) => {
      m[n.id] = []
    })
    Object.entries(outLinksByNote.value).forEach(([fromId, toIds]) => {
      toIds.forEach((tid) => {
        if (m[tid] && !m[tid].includes(fromId)) m[tid].push(fromId)
      })
    })
    return m
  })

  /** 笔记 id → 行内 #tag 数组(去重,基于 content) */
  const inlineTagsByNote = computed(() => {
    const m = {}
    notes.value.forEach((n) => {
      m[n.id] = extractInlineTags(n.content || '')
    })
    return m
  })

  /** 笔记 id → frontmatter meta */
  const metaByNote = computed(() => {
    const m = {}
    notes.value.forEach((n) => {
      m[n.id] = parseFrontmatter(n.content || '').meta
    })
    return m
  })

  // ====================== 基础排序 ======================

  const sorted = computed(() =>
    [...notes.value].sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
      return (b.updatedAt || '').localeCompare(a.updatedAt || '')
    })
  )

  // ====================== 查询方法 ======================

  function findById(id) {
    return notes.value.find((n) => n.id === id)
  }

  function findByTitle(title) {
    if (!title) return null
    const id = titleIndex.value[title.toLowerCase().trim()]
    return id ? findById(id) : null
  }

  /** 拿到一篇笔记的 outLinks(完整 note 对象) */
  function getOutLinks(id) {
    const ids = outLinksByNote.value[id] || []
    return ids.map((tid) => findById(tid)).filter(Boolean)
  }

  /** 拿到一篇笔记的 backlinks(完整 note 对象) */
  function getBacklinks(id) {
    const ids = backlinksByNote.value[id] || []
    return ids.map((bid) => findById(bid)).filter(Boolean)
  }

  /** outLinks 里含有但是目标笔记不存在 — 列出来,可用来"创建占位" */
  function getMissingLinks(id) {
    const note = findById(id)
    if (!note) return []
    const targets = extractWikiLinks(note.content || '')
    const idx = titleIndex.value
    return targets.filter((t) => !idx[t.toLowerCase().trim()])
  }

  // ====================== 增删改 ======================

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

  // ====================== 搜索 ======================

  function search({ keyword = '', tagId = null, articleSlug = null, status = null } = {}) {
    let list = sorted.value
    if (tagId) list = list.filter((n) => (n.tagIds || []).includes(tagId))
    if (articleSlug) list = list.filter((n) => n.articleSlug === articleSlug)
    if (status) {
      list = list.filter((n) => (metaByNote.value[n.id]?.status || 'draft') === status)
    }
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

  // ====================== 统计 ======================

  const stats = computed(() => ({
    total: notes.value.length,
    pinned: notes.value.filter((n) => n.pinned).length,
    withArticle: notes.value.filter((n) => n.articleSlug).length,
    totalLinks: Object.values(outLinksByNote.value).reduce((s, arr) => s + arr.length, 0),
    orphans: notes.value.filter((n) => {
      const out = outLinksByNote.value[n.id]?.length || 0
      const back = backlinksByNote.value[n.id]?.length || 0
      return out + back === 0
    }).length,
  }))

  return {
    notes,
    sorted,
    titleIndex,
    outLinksByNote,
    backlinksByNote,
    inlineTagsByNote,
    metaByNote,
    findById,
    findByTitle,
    getOutLinks,
    getBacklinks,
    getMissingLinks,
    create,
    update,
    remove,
    togglePin,
    search,
    stats,
  }
})
