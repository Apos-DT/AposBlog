/**
 * 阅读记录 store
 * 每篇文章对应一条 ReadRecord:
 *   { slug, status, progress, rating, collected, durationMin, lastReadAt, finishedAt }
 *
 *   status:   'unread' | 'reading' | 'done'
 *   progress: 0-100 (滚动百分比 snapshot)
 *   rating:   0-5
 *   collected: boolean
 *   durationMin: 累计阅读分钟
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { persist } from './_persist'

export const useReadsStore = defineStore('reads', () => {
  const records = ref([])

  persist('reads', { records }, () => ({ records: [] }))

  function get(slug) {
    return records.value.find((r) => r.slug === slug)
  }

  function ensure(slug) {
    let r = get(slug)
    if (!r) {
      r = {
        slug,
        status: 'unread',
        progress: 0,
        rating: 0,
        collected: false,
        durationMin: 0,
        lastReadAt: null,
        finishedAt: null,
      }
      records.value.push(r)
    }
    return r
  }

  function patch(slug, p) {
    const r = ensure(slug)
    Object.assign(r, p)
    r.lastReadAt = new Date().toISOString()
    if (r.status === 'done' && !r.finishedAt) r.finishedAt = r.lastReadAt
  }

  function setStatus(slug, status) {
    patch(slug, { status })
  }

  function toggleCollect(slug) {
    const r = ensure(slug)
    r.collected = !r.collected
    r.lastReadAt = new Date().toISOString()
  }

  function setRating(slug, rating) {
    patch(slug, { rating })
  }

  function setProgress(slug, progress) {
    const r = ensure(slug)
    r.progress = Math.max(r.progress, Math.round(progress))
    r.lastReadAt = new Date().toISOString()
    // 80% 起视为已读
    if (r.progress >= 80 && r.status !== 'done') r.status = 'done'
    else if (r.progress > 0 && r.status === 'unread') r.status = 'reading'
  }

  function addDuration(slug, minutes) {
    const r = ensure(slug)
    r.durationMin = Math.round((r.durationMin || 0) + minutes)
    r.lastReadAt = new Date().toISOString()
  }

  // ===== 统计 =====
  const stats = computed(() => {
    const total = records.value.length
    const done = records.value.filter((r) => r.status === 'done').length
    const reading = records.value.filter((r) => r.status === 'reading').length
    const collected = records.value.filter((r) => r.collected).length
    const totalMin = records.value.reduce((s, r) => s + (r.durationMin || 0), 0)
    const avgRating =
      records.value
        .filter((r) => r.rating)
        .reduce((s, r) => s + r.rating, 0) /
      (records.value.filter((r) => r.rating).length || 1)
    return { total, done, reading, collected, totalMin, avgRating }
  })

  const recent = computed(() =>
    [...records.value]
      .filter((r) => r.lastReadAt)
      .sort((a, b) => (b.lastReadAt || '').localeCompare(a.lastReadAt || ''))
      .slice(0, 5)
  )

  return {
    records,
    get,
    ensure,
    patch,
    setStatus,
    toggleCollect,
    setRating,
    setProgress,
    addDuration,
    stats,
    recent,
  }
})
