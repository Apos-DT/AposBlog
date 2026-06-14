/**
 * 文章库 store —— 数据来自后端 /api/posts（所有访客共享）
 * - 列表只含 metadata；单篇正文用 fetchPost(slug) 取
 * - 增删改为管理操作（api 自动带 admin token）
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loaded = ref(false)
  const loading = ref(false)

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      posts.value = await api.get('/posts')
      loaded.value = true
    } catch (e) {
      console.warn('[posts] load failed', e)
    } finally {
      loading.value = false
    }
  }

  const sorted = computed(() =>
    [...posts.value].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  )

  function findBySlug(slug) {
    return posts.value.find((p) => p.slug === slug)
  }

  // 取单篇完整内容（含正文 markdown）
  function fetchPost(slug) {
    return api.get('/posts/' + encodeURIComponent(slug))
  }

  async function add(post) {
    const r = await api.post('/posts', post, { admin: true })
    await load(true)
    return r.slug
  }

  async function update(slug, patch) {
    await api.put('/posts/' + encodeURIComponent(slug), patch, { admin: true })
    await load(true)
  }

  async function remove(slug) {
    await api.del('/posts/' + encodeURIComponent(slug), { admin: true })
    posts.value = posts.value.filter((p) => p.slug !== slug)
  }

  function search(keyword, tag) {
    let list = sorted.value
    if (tag) list = list.filter((p) => p.tag === tag)
    if (keyword) {
      const k = keyword.toLowerCase()
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(k) ||
          (p.excerpt || '').toLowerCase().includes(k) ||
          (p.tag || '').toLowerCase().includes(k)
      )
    }
    return list
  }

  return { posts, loaded, loading, sorted, findBySlug, fetchPost, load, add, update, remove, search }
})
