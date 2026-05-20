/**
 * 文章库 store
 * - 内置博客 manifest 文章
 * - 用户可手动加自定义文章(外部 URL)
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import initial from '@/data/initial.json'
import { persist } from './_persist'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])

  persist('posts', { posts }, () => ({ posts: initial.posts }))

  const sorted = computed(() =>
    [...posts.value].sort((a, b) => b.date.localeCompare(a.date))
  )

  function findBySlug(slug) {
    return posts.value.find((p) => p.slug === slug)
  }

  function add(post) {
    if (!post.slug) post.slug = 'custom-' + Date.now().toString(36)
    if (!post.date) post.date = new Date().toISOString().slice(0, 10)
    if (posts.value.some((p) => p.slug === post.slug)) {
      throw new Error('slug 已存在')
    }
    posts.value.unshift({ external: true, ...post })
  }

  function remove(slug) {
    posts.value = posts.value.filter((p) => p.slug !== slug)
  }

  function update(slug, patch) {
    const i = posts.value.findIndex((p) => p.slug === slug)
    if (i >= 0) posts.value[i] = { ...posts.value[i], ...patch }
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

  function resetToInitial() {
    posts.value = JSON.parse(JSON.stringify(initial.posts))
  }

  return { posts, sorted, findBySlug, add, remove, update, search, resetToInitial }
})
