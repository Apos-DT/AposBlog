<script setup>
/**
 * 留言板 —— 后端共享存储（所有访客看到同一份）
 * 访客填昵称即可发；点赞公开；删除需管理员
 */
import { ref, computed, onMounted } from 'vue'
import { api } from '@/utils/api'
import { useSettingsStore } from '@/stores/settings'
import { useAdminStore } from '@/stores/admin'
import IconBase from '@/components/IconBase.vue'

const settings = useSettingsStore()
const admin = useAdminStore()

const list = ref([])
const loading = ref(true)
const sending = ref(false)
const EMOJIS = ['😀', '🚀', '💡', '👍', '🔥', '❤️', '🎉', '🤔', '👀', '✨']
const form = ref({ name: '', emoji: '😀', content: '' })
const search = ref('')
const sort = ref('newest')

// 已赞记录（sessionStorage，防同会话重复赞）
const likedIds = ref([])
try {
  const raw = sessionStorage.getItem('apos:gb-liked')
  if (raw) likedIds.value = JSON.parse(raw)
} catch {}
function isLiked(id) {
  return likedIds.value.includes(id)
}
function persistLiked() {
  try {
    sessionStorage.setItem('apos:gb-liked', JSON.stringify(likedIds.value))
  } catch {}
}

async function load() {
  loading.value = true
  try {
    list.value = await api.get('/guestbook')
  } catch (e) {
    settings.pushToast('error', '留言加载失败：' + (e.message || ''))
  } finally {
    loading.value = false
  }
}
onMounted(load)

const filtered = computed(() => {
  let arr = list.value
  const k = search.value.trim().toLowerCase()
  if (k) arr = arr.filter((m) => (m.name || '').toLowerCase().includes(k) || (m.content || '').toLowerCase().includes(k))
  arr = [...arr]
  if (sort.value === 'likes') arr.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  else if (sort.value === 'oldest') arr.sort((a, b) => a.id - b.id)
  else arr.sort((a, b) => b.id - a.id)
  return arr
})

const totalLikes = computed(() => list.value.reduce((s, m) => s + (m.likes || 0), 0))

async function submit() {
  const name = form.value.name.trim()
  const content = form.value.content.trim()
  if (!name) {
    settings.pushToast('error', '请填写昵称')
    return
  }
  if (content.length < 2) {
    settings.pushToast('error', '留言至少 2 个字')
    return
  }
  sending.value = true
  try {
    await api.post('/guestbook', { name, emoji: form.value.emoji, content })
    form.value.content = ''
    settings.pushToast('success', '留言已发布')
    await load()
  } catch (e) {
    settings.pushToast('error', e.message || '发布失败')
  } finally {
    sending.value = false
  }
}

async function like(m) {
  if (isLiked(m.id)) {
    settings.pushToast('info', '你已经赞过啦')
    return
  }
  try {
    const r = await api.post(`/guestbook/${m.id}/like`)
    m.likes = r.likes
    likedIds.value = [...likedIds.value, m.id]
    persistLiked()
  } catch (e) {
    settings.pushToast('error', '点赞失败')
  }
}

async function remove(m) {
  if (!confirm(`删除 ${m.name} 的留言？`)) return
  try {
    await api.del(`/guestbook/${m.id}`, { admin: true })
    list.value = list.value.filter((x) => x.id !== m.id)
    settings.pushToast('success', '已删除')
  } catch (e) {
    settings.pushToast('error', e.status === 401 ? '管理员登录已失效' : '删除失败')
  }
}

function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<template>
  <section class="view-gb">
    <header class="gb-head">
      <span class="gb-no">访客互动</span>
      <h2>留言板</h2>
      <p>欢迎留下你的脚印 —— 一段感想、一个问题、一句鼓励都好。</p>
    </header>

    <!-- 统计 -->
    <div class="gb-stats">
      <div class="gb-stat"><strong>{{ list.length }}</strong><span>留言</span></div>
      <div class="gb-stat"><strong>{{ totalLikes }}</strong><span>点赞</span></div>
    </div>

    <!-- 发布 -->
    <article class="gb-publish">
      <h3>写一条留言</h3>
      <input v-model="form.name" class="gb-input" maxlength="40" placeholder="你的昵称" />
      <div class="gb-emoji-row">
        <button
          v-for="e in EMOJIS"
          :key="e"
          type="button"
          :class="['gb-emoji', { active: form.emoji === e }]"
          @click="form.emoji = e"
        >{{ e }}</button>
      </div>
      <textarea
        v-model="form.content"
        class="gb-textarea"
        rows="3"
        maxlength="1000"
        placeholder="说点什么吧…（2-1000 字）"
      ></textarea>
      <div class="gb-pub-foot">
        <span class="gb-count">{{ form.content.length }} / 1000</span>
        <button class="gb-btn gb-btn-accent" :disabled="sending" @click="submit">
          {{ sending ? '发布中…' : '发布留言' }}
        </button>
      </div>
    </article>

    <!-- 搜索 + 排序 -->
    <div class="gb-filter">
      <div class="gb-search">
        <IconBase name="search" :size="14" />
        <input v-model="search" type="search" class="gb-input" placeholder="搜昵称 / 内容…" />
      </div>
      <select v-model="sort" class="gb-select">
        <option value="newest">最新</option>
        <option value="oldest">最早</option>
        <option value="likes">最多赞</option>
      </select>
      <span class="gb-rescount">{{ filtered.length }} 条</span>
    </div>

    <!-- 列表 -->
    <div v-if="loading" class="gb-empty">加载中…</div>
    <div v-else-if="!filtered.length" class="gb-empty">
      <p>还没有留言</p>
      <p class="gb-empty-sub">来抢沙发吧～</p>
    </div>
    <section v-else class="gb-list">
      <article v-for="m in filtered" :key="m.id" class="gb-item">
        <div class="gb-item-head">
          <span class="gb-avatar">{{ m.emoji || '💬' }}</span>
          <div class="gb-item-meta">
            <strong class="gb-item-name">{{ m.name }}</strong>
            <span class="gb-item-time">{{ fmtTime(m.createdAt) }}</span>
          </div>
          <button v-if="admin.isAdmin" class="gb-item-del" title="删除" @click="remove(m)">
            <IconBase name="trash" :size="14" />
          </button>
        </div>
        <p class="gb-item-content">{{ m.content }}</p>
        <div class="gb-item-actions">
          <button :class="['gb-like', { active: isLiked(m.id) }]" @click="like(m)">
            <IconBase :name="isLiked(m.id) ? 'heart-filled' : 'heart'" :size="13" />
            <span>{{ m.likes || 0 }}</span>
          </button>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.view-gb {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: min(840px, calc(100% - 32px));
  margin: 24px auto 0;
  padding: 0 clamp(20px, 4vw, 48px);
}

.gb-head {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-soft);
}
.gb-no {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 8px;
}
.gb-head h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(24px, 2.6vw, 32px);
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}
.gb-head p {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-2);
  line-height: 1.6;
}

/* 统计 */
.gb-stats {
  display: flex;
  gap: 12px;
}
.gb-stat {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 12px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.94 0.04 295 / 0.25);
}
.gb-stat strong {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--accent);
}
.gb-stat span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

/* 发布卡 */
.gb-publish {
  padding: 22px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gb-publish h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--ink);
}
.gb-emoji-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.gb-emoji {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--bg);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.2s var(--ease-out), background 0.3s, border-color 0.3s;
}
.gb-emoji:hover { transform: scale(1.12); border-color: var(--ink-3); }
.gb-emoji.active {
  background: oklch(0.92 0.06 295 / 0.5);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.2);
}

.gb-input, .gb-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  font: inherit;
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.gb-input:focus, .gb-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.15);
}
.gb-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: var(--font-body);
  line-height: 1.6;
}
.gb-pub-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gb-count {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
}

/* 按钮 */
.gb-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s var(--ease-out), background 0.3s;
}
.gb-btn-accent { background: var(--accent); color: #fff; }
.gb-btn-accent:hover { background: oklch(0.45 0.22 295); transform: translateY(-1px); }
.gb-btn-accent:disabled { opacity: 0.5; cursor: not-allowed; }

/* 筛选 */
.gb-filter {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.gb-search {
  position: relative;
  flex: 1;
  min-width: 180px;
}
.gb-search svg {
  position: absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--ink-3);
  pointer-events: none;
}
.gb-search .gb-input { padding-left: 36px; }
.gb-select {
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
}
.gb-rescount {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
}

/* 列表 */
.gb-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gb-item {
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: var(--bg);
  box-shadow: 0 1px 3px -1px oklch(0.30 0.05 280 / 0.08);
  transition: border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.gb-item:hover {
  border-color: var(--ink-3);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px -12px oklch(0.30 0.05 280 / 0.22);
}
.gb-item-head {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.gb-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
  background: oklch(0.94 0.04 295 / 0.4);
  border: 1px solid var(--line-soft);
}
.gb-item-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.gb-item-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14.5px;
  color: var(--ink);
}
.gb-item-time {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
.gb-item-del {
  width: 28px; height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
}
.gb-item-del:hover { color: var(--error); background: oklch(0.92 0.06 25 / 0.5); }

.gb-item-content {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0 0 12px;
}
.gb-item-actions {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--line-soft);
}
.gb-like {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--line-soft);
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 11.5px;
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.gb-like:hover, .gb-like.active {
  color: var(--error);
  border-color: oklch(0.85 0.10 25 / 0.6);
  background: oklch(0.96 0.05 25 / 0.4);
}

/* 空状态 */
.gb-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--ink-2);
  border: 1px dashed var(--line-soft);
  border-radius: 12px;
}
.gb-empty p { margin: 0; font-size: 14px; }
.gb-empty-sub { font-size: 12px; color: var(--ink-3); margin-top: 6px !important; }
</style>
