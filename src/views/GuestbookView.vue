<script setup>
/**
 * 访客留言板视图
 *  - 仅负责加载 jQuery CDN 与外置 public/js/guestbook.js
 *  - 模板完全静态(零 v-bind / v-on),挂载后由 jQuery 接管
 *  - 切走时 __destroyGuestbook 清理 .gb 命名空间事件
 */
import { onMounted, onBeforeUnmount } from 'vue'

const JQUERY_SRC = 'https://code.jquery.com/jquery-3.7.1.min.js'
const SCRIPT_SRC = `${import.meta.env.BASE_URL}js/guestbook.js`

onMounted(async () => {
  try {
    if (!window.jQuery) await loadScript(JQUERY_SRC)
    await loadScript(SCRIPT_SRC, true)
    if (window.__initGuestbook) window.__initGuestbook()
  } catch (e) {
    console.error('[Guestbook] 加载失败', e)
  }
})

onBeforeUnmount(() => {
  if (window.__destroyGuestbook) window.__destroyGuestbook()
})

function loadScript(src, bust = false) {
  return new Promise((resolve, reject) => {
    const finalSrc = bust ? `${src}?t=${Date.now()}` : src
    if (!bust) {
      const existing = Array.from(document.scripts).find((s) => s.src === finalSrc)
      if (existing) return resolve()
    }
    const s = document.createElement('script')
    s.src = finalSrc
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('script failed: ' + src))
    document.head.appendChild(s)
  })
}
</script>

<template>
  <section class="view-gb">
    <header class="gb-section-head">
      <span class="gb-no">访客互动</span>
      <h2>留言板</h2>
      <p>给博客留下脚印。你可以留言、回复、点赞、附图。数据存在浏览器本地 <code>localStorage</code>,
        不会上传到任何服务器。</p>
    </header>

    <!-- ============ 统计 + 表情情绪 Canvas ============ -->
    <article class="gb-stats-card gb-fade-in">
      <div class="gb-stats-numbers">
        <div class="gb-stat">
          <span class="gb-stat-num" id="gb-stat-total">0</span>
          <span class="gb-stat-label">条留言</span>
        </div>
        <div class="gb-stat">
          <span class="gb-stat-num" id="gb-stat-likes">0</span>
          <span class="gb-stat-label">总点赞</span>
        </div>
        <div class="gb-stat">
          <span class="gb-stat-num" id="gb-stat-replies">0</span>
          <span class="gb-stat-label">条回复</span>
        </div>
      </div>
      <div class="gb-stats-chart">
        <canvas id="gb-emoji-chart" width="180" height="180"></canvas>
      </div>
    </article>

    <!-- ============ 发布留言 ============ -->
    <article class="gb-card gb-publish gb-fade-in">
      <h3>写一条留言</h3>
      <form id="gb-form" class="gb-form" novalidate>
        <div class="gb-form-row">
          <label class="gb-field">
            <span class="gb-field-label">名字 <em>*</em></span>
            <input id="gb-form-name" type="text" class="gb-input" placeholder="2-20 字" maxlength="20" />
            <span class="gb-field-tip"></span>
          </label>
          <label class="gb-field">
            <span class="gb-field-label">邮箱 <em>*</em></span>
            <input id="gb-form-email" type="email" class="gb-input" placeholder="you@example.com" />
            <span class="gb-field-tip"></span>
          </label>
        </div>

        <label class="gb-field">
          <span class="gb-field-label">心情 / 头像</span>
          <div id="gb-emoji-picker" class="gb-emoji-picker"></div>
        </label>

        <label class="gb-field">
          <span class="gb-field-label">
            留言 <em>*</em>
            <small>字数 <span id="gb-form-content-count">0 / 300</span> · Ctrl/⌘+Enter 提交</small>
          </span>
          <textarea
            id="gb-form-content"
            class="gb-textarea"
            rows="4"
            maxlength="300"
            placeholder="说点什么吧... 5 字以上,300 字以内"></textarea>
          <span class="gb-field-tip"></span>
        </label>

        <div class="gb-form-extras">
          <label class="gb-image-pick" for="gb-form-image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/>
              <circle cx="9" cy="9" r="2" stroke="currentColor" stroke-width="1.6"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>添加图片(最多 3 张,单张 ≤200KB)</span>
            <input id="gb-form-image" type="file" accept="image/*" multiple hidden />
          </label>
          <div id="gb-form-preview" class="gb-form-preview"></div>
        </div>

        <div class="gb-form-actions">
          <button type="reset" class="gb-btn gb-btn-ghost">清空</button>
          <button type="submit" class="gb-btn gb-btn-accent">发布留言</button>
        </div>
      </form>
    </article>

    <!-- ============ 搜索 / 排序 ============ -->
    <article class="gb-card gb-filter-card gb-fade-in">
      <div class="gb-filter-bar">
        <div class="gb-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input id="gb-search" type="search" class="gb-input" placeholder="搜留言名字 / 内容 / 回复…" />
        </div>
        <div class="gb-sort-wrap">
          <span class="gb-sort-label">排序</span>
          <select id="gb-sort" class="gb-select">
            <option value="newest">最新</option>
            <option value="oldest">最旧</option>
            <option value="likes">点赞最多</option>
            <option value="replies">回复最多</option>
          </select>
        </div>
        <span id="gb-result-count" class="gb-result-count">0 条留言</span>
      </div>
    </article>

    <!-- ============ 留言列表 ============ -->
    <article class="gb-card gb-list-card gb-fade-in">
      <h3>留言流</h3>
      <section id="gb-list" class="gb-list"></section>
      <div id="gb-empty" class="gb-empty" style="display: none">
        <p>没有符合条件的留言。</p>
        <p style="font-size: 12px; color: var(--ink-3); margin-top: 6px">
          尝试换个关键字,或者清空搜索。
        </p>
      </div>
    </article>

    <!-- 返回顶部 + Toast 容器 -->
    <button id="gb-to-top" class="gb-to-top" type="button" aria-label="返回顶部">↑</button>
    <div id="gb-toast-stack" class="gb-toast-stack" aria-live="polite"></div>
  </section>
</template>

<style scoped>
/* ==============================================================
 * 留言板样式 — scoped
 * ============================================================== */

.view-gb {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gb-section-head {
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
.gb-section-head h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(24px, 2.6vw, 32px);
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}
.gb-section-head p {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-2);
  max-width: 740px;
  line-height: 1.65;
}
.gb-section-head code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  color: var(--accent);
}

.gb-card {
  padding: 22px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--bg);
}
.gb-card h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--ink);
}

/* ===== 统计区 ===== */
.gb-stats-card {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 18px;
  padding: 22px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: linear-gradient(135deg, oklch(0.94 0.04 295 / 0.5), oklch(0.97 0.04 220 / 0.4));
}
@media (max-width: 720px) {
  .gb-stats-card { grid-template-columns: 1fr; }
}
.gb-stats-numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  align-content: center;
}
.gb-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: var(--radius);
  background: var(--bg);
  border: 1px solid var(--line-soft);
}
.gb-stat-num {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(22px, 3vw, 32px);
  color: var(--ink);
}
.gb-stat-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--ink-3);
  text-transform: uppercase;
}
.gb-stats-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}
.gb-stats-chart canvas {
  width: 160px;
  height: 160px;
}

/* ===== 表单 ===== */
.gb-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 600px) {
  .gb-form-row { grid-template-columns: 1fr; }
}
.gb-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.gb-field-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.gb-field-label em { color: var(--error); font-style: normal; margin-left: 2px; }
.gb-field-label small {
  font-family: var(--font-mono);
  text-transform: none;
  font-size: 10.5px;
  letter-spacing: 0;
  color: var(--ink-3);
}
.gb-field-tip {
  min-height: 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
.gb-field.is-ok .gb-input,
.gb-field.is-ok .gb-textarea { border-color: var(--success); }
.gb-field.is-ok .gb-field-tip { color: var(--success); }
.gb-field.is-error .gb-input,
.gb-field.is-error .gb-textarea {
  border-color: var(--error);
  background: oklch(0.97 0.05 25 / 0.5);
}
.gb-field.is-error .gb-field-tip { color: var(--error); }

.gb-input, .gb-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  font: inherit;
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
}
.gb-input:focus, .gb-textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-deep);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.18);
}
.gb-input::placeholder, .gb-textarea::placeholder { color: var(--ink-3); }
.gb-textarea {
  resize: vertical;
  min-height: 92px;
  font-family: var(--font-body);
  line-height: 1.6;
}

/* 表情选择 */
.gb-emoji-picker {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.gb-emoji {
  width: 38px; height: 38px;
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
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.2);
}

/* 图片上传 */
.gb-form-extras { margin-bottom: 12px; }
.gb-image-pick {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px dashed var(--line);
  background: var(--bg);
  color: var(--ink-2);
  font-size: 12.5px;
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}
.gb-image-pick:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.3);
}
.gb-image-pick svg { color: var(--accent); }

.gb-form-preview {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.gb-preview-item {
  position: relative;
  width: 80px; height: 80px;
  border-radius: 8px;
  border: 1px solid var(--line-soft);
  background: var(--bg-deep);
  overflow: hidden;
}
.gb-preview-item img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.gb-preview-del {
  position: absolute;
  right: 4px; top: 4px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: oklch(0.20 0.020 280 / 0.7);
  border: 0;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.gb-preview-del:hover { background: var(--error); transform: rotate(90deg); }

.gb-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

/* ===== 按钮 ===== */
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
  transition: transform 0.3s var(--ease-out), background 0.3s, color 0.3s, border-color 0.3s;
}
.gb-btn-ghost { background: transparent; color: var(--ink-2); border-color: var(--line); }
.gb-btn-ghost:hover { color: var(--ink); border-color: var(--ink-3); transform: translateY(-1px); }
.gb-btn-accent { background: var(--accent); color: #fff; }
.gb-btn-accent:hover { background: oklch(0.45 0.22 295); transform: translateY(-1px); box-shadow: 0 6px 14px -6px oklch(0.50 0.22 295 / 0.4); }

/* ===== 筛选条 ===== */
.gb-filter-card { padding: 14px 20px; }
.gb-filter-bar {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 14px;
  align-items: center;
}
@media (max-width: 600px) {
  .gb-filter-bar { grid-template-columns: 1fr; }
}
.gb-search-wrap {
  position: relative;
}
.gb-search-wrap svg {
  position: absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--ink-3);
  pointer-events: none;
}
.gb-search-wrap .gb-input { padding-left: 36px; }

.gb-sort-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
}
.gb-select {
  padding: 7px 28px 7px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  font-family: var(--font-display);
  font-size: 12.5px;
  color: var(--ink);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--ink-2) 50%),
    linear-gradient(135deg, var(--ink-2) 50%, transparent 50%);
  background-position:
    calc(100% - 13px) 50%,
    calc(100% - 9px) 50%;
  background-size: 4px 4px;
  background-repeat: no-repeat;
}
.gb-result-count {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--line-soft);
  background: var(--bg-deep);
}

/* ===== 留言列表 ===== */
.gb-list-card { padding-top: 14px; }
.gb-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gb-item {
  padding: 18px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.gb-item:hover {
  border-color: var(--line);
  transform: translateY(-1px);
}
.gb-item-head {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.gb-avatar {
  position: relative;
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
  cursor: default;
}
.gb-avatar-tip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translate(8px, -50%);
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
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
  background: transparent;
  border: 0;
  border-radius: 6px;
  font-size: 18px;
  line-height: 1;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.3s, background 0.3s, transform 0.3s;
}
.gb-item-del:hover {
  color: var(--error);
  background: oklch(0.92 0.06 25 / 0.5);
  transform: rotate(90deg);
}

.gb-item-content {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink);
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 12px;
}
.gb-item-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.gb-item-img {
  width: 100px; height: 100px;
  border-radius: 8px;
  object-fit: cover;
  cursor: zoom-in;
  border: 1px solid var(--line-soft);
  transition: transform 0.3s var(--ease-out);
}
.gb-item-img:hover { transform: scale(1.04); }

/* 操作栏 */
.gb-item-actions {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--line-soft);
}
.gb-like, .gb-reply-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--line-soft);
  color: var(--ink-3);
  font-family: var(--font-mono);
  font-size: 11.5px;
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.gb-like svg {
  transition: transform 0.3s var(--ease-out), fill 0.3s;
}
.gb-like:hover {
  color: var(--error);
  border-color: oklch(0.85 0.10 25 / 0.6);
  background: oklch(0.96 0.05 25 / 0.4);
}
.gb-like.active {
  color: var(--error);
  border-color: oklch(0.85 0.10 25 / 0.6);
  background: oklch(0.96 0.05 25 / 0.5);
}
.gb-like.liked-pulse svg {
  animation: gb-heart-pulse 0.32s var(--ease-out);
}
@keyframes gb-heart-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.55); }
}
.gb-reply-toggle:hover {
  color: var(--accent);
  border-color: oklch(0.85 0.10 295 / 0.5);
  background: oklch(0.94 0.04 295 / 0.4);
}
.gb-reply-toggle .gb-reply-count {
  background: var(--bg-deep);
  padding: 0 7px;
  border-radius: 999px;
  font-size: 10.5px;
  color: var(--ink-2);
}

/* 回复区 */
.gb-replies {
  display: none;
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  background: oklch(0.97 0.005 80 / 0.7);
  border-left: 2px solid var(--line);
}
.gb-reply {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px solid var(--line-soft);
  margin-bottom: 8px;
}
.gb-reply.from-author {
  background: oklch(0.94 0.04 295 / 0.35);
  border-color: oklch(0.85 0.08 295 / 0.5);
}
.gb-reply header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.gb-reply-name {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--ink);
}
.gb-author-badge {
  padding: 1px 7px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  background: var(--accent);
  color: #fff;
}
.gb-reply-time {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
  margin-left: auto;
}
.gb-reply-content {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-2);
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 回复输入 */
.gb-reply-form {
  display: grid;
  grid-template-columns: 140px 1fr auto;
  gap: 8px;
  margin-top: 10px;
}
@media (max-width: 600px) {
  .gb-reply-form { grid-template-columns: 1fr; }
}
.gb-reply-form .gb-input { padding: 8px 12px; font-size: 13px; }
.gb-reply-form .gb-btn { padding: 7px 14px; font-size: 12.5px; }

/* 空状态 */
.gb-empty {
  padding: 32px 20px;
  text-align: center;
  color: var(--ink-2);
  border: 1px dashed var(--line-soft);
  border-radius: 12px;
}
.gb-empty p { margin: 0; font-size: 13.5px; }

/* 返回顶部 */
.gb-to-top {
  position: fixed;
  right: 24px; bottom: 24px;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--bg);
  border: 0;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  z-index: 90;
  box-shadow: var(--shadow-lift);
  transition: transform 0.3s var(--ease-out), background 0.3s;
}
.gb-to-top:hover { background: var(--accent); transform: translateY(-3px); }

/* 图片大图 */
:deep(.gb-lightbox) {
  position: fixed; inset: 0;
  background: oklch(0.18 0.020 280 / 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: zoom-out;
  padding: 40px;
}
:deep(.gb-lightbox img) {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: var(--shadow-lift);
}

/* Toast */
.gb-toast-stack {
  position: fixed;
  right: 24px;
  bottom: 84px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 110;
  pointer-events: none;
}
:deep(.gb-toast) {
  pointer-events: auto;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-left: 3px solid;
  font-size: 13px;
  color: var(--ink-2);
  min-width: 220px;
  box-shadow: var(--shadow-card);
}
:deep(.gb-toast-info) { border-left-color: var(--accent-2); }
:deep(.gb-toast-success) { border-left-color: var(--success); }
:deep(.gb-toast-warning) { border-left-color: var(--warning); }
:deep(.gb-toast-error) { border-left-color: var(--error); }
</style>
