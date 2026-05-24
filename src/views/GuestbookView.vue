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
      <p>欢迎留下你的脚印 —— 一段感想、一个问题、一句鼓励都好。</p>
    </header>

    <!-- ============ 登录态条 ============ -->
    <section class="gb-auth-bar gb-fade-in">
      <!-- 未登录 -->
      <div class="gb-auth-anon">
        <span class="gb-auth-hint">登录后留言会自动带上你的名字和头像</span>
        <div class="gb-auth-anon-actions">
          <button type="button" class="gb-btn gb-btn-ghost" id="gb-auth-open-github">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
            <span>GitHub 登录</span>
          </button>
          <button type="button" class="gb-btn gb-btn-accent" id="gb-auth-open-local">
            <span>登录 / 注册</span>
          </button>
        </div>
      </div>

      <!-- 已登录 -->
      <div class="gb-auth-user" style="display: none">
        <img class="gb-auth-avatar" alt="" />
        <div class="gb-auth-meta">
          <strong class="gb-auth-name"></strong>
          <span class="gb-auth-source"></span>
        </div>
        <button type="button" class="gb-btn gb-btn-ghost gb-btn-sm" id="gb-auth-logout">退出</button>
      </div>
    </section>

    <!-- ============ 登录 modal (由 JS 控制显隐) ============ -->
    <div id="gb-auth-modal" class="gb-modal-mask" style="display: none">
      <div class="gb-modal" @click.stop>
        <header class="gb-modal-head">
          <div class="gb-modal-tabs">
            <button type="button" class="gb-modal-tab active" data-tab="github">GitHub</button>
            <button type="button" class="gb-modal-tab" data-tab="login">登录</button>
            <button type="button" class="gb-modal-tab" data-tab="register">注册</button>
          </div>
          <button type="button" class="gb-modal-close" id="gb-auth-modal-close" aria-label="关闭">×</button>
        </header>

        <!-- GitHub pane -->
        <section class="gb-modal-pane active" data-pane="github">
          <p class="gb-modal-desc">输入 GitHub 用户名,我们会从 GitHub 获取你的头像与显示名。</p>
          <form id="gb-form-github" class="gb-modal-form">
            <label class="gb-modal-field">
              <span>GitHub 用户名</span>
              <input type="text" name="username" placeholder="例:torvalds" autocomplete="off" required />
            </label>
            <button type="submit" class="gb-btn gb-btn-accent gb-btn-block">
              <span>登录</span>
            </button>
          </form>
        </section>

        <!-- 登录 pane -->
        <section class="gb-modal-pane" data-pane="login">
          <p class="gb-modal-desc">已经注册过?用名字和密码登录。</p>
          <form id="gb-form-login" class="gb-modal-form">
            <label class="gb-modal-field">
              <span>用户名</span>
              <input type="text" name="username" autocomplete="username" required />
            </label>
            <label class="gb-modal-field">
              <span>密码</span>
              <input type="password" name="password" autocomplete="current-password" required />
            </label>
            <button type="submit" class="gb-btn gb-btn-accent gb-btn-block">登录</button>
          </form>
        </section>

        <!-- 注册 pane -->
        <section class="gb-modal-pane" data-pane="register">
          <p class="gb-modal-desc">注册一个本站账号,以后用名字登录。</p>
          <form id="gb-form-register" class="gb-modal-form">
            <label class="gb-modal-field">
              <span>用户名 <em>*</em></span>
              <input type="text" name="username" minlength="3" maxlength="20" required />
            </label>
            <label class="gb-modal-field">
              <span>显示名</span>
              <input type="text" name="displayName" maxlength="20" placeholder="同用户名" />
            </label>
            <label class="gb-modal-field">
              <span>密码 <em>*</em></span>
              <input type="password" name="password" minlength="6" autocomplete="new-password" required />
            </label>
            <label class="gb-modal-field">
              <span>确认密码 <em>*</em></span>
              <input type="password" name="password2" minlength="6" autocomplete="new-password" required />
            </label>
            <button type="submit" class="gb-btn gb-btn-accent gb-btn-block">创建账号</button>
          </form>
        </section>
      </div>
    </div>

    <!-- ============ 统计 + 表情情绪 Canvas ============ -->
    <article class="gb-stats-card gb-fade-in">
      <div class="gb-stats-numbers">
        <div class="gb-stat gb-stat--posts">
          <span class="gb-stat-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          </span>
          <div class="gb-stat-text">
            <span class="gb-stat-num" id="gb-stat-total">0</span>
            <span class="gb-stat-label">留言</span>
          </div>
        </div>
        <div class="gb-stat gb-stat--likes">
          <span class="gb-stat-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </span>
          <div class="gb-stat-text">
            <span class="gb-stat-num" id="gb-stat-likes">0</span>
            <span class="gb-stat-label">点赞</span>
          </div>
        </div>
        <div class="gb-stat gb-stat--replies">
          <span class="gb-stat-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
          </span>
          <div class="gb-stat-text">
            <span class="gb-stat-num" id="gb-stat-replies">0</span>
            <span class="gb-stat-label">回复</span>
          </div>
        </div>
      </div>
      <div class="gb-stats-chart">
        <div class="gb-chart-wrap">
          <canvas id="gb-emoji-chart" width="200" height="200"></canvas>
          <div id="gb-chart-tooltip" class="gb-chart-tooltip" role="tooltip"></div>
        </div>
        <div id="gb-chart-legend" class="gb-chart-legend"></div>
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
            <span>添加图片</span>
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

    <!-- ============ 留言列表(每条独立卡片,不再外包大卡片) ============ -->
    <header class="gb-list-head gb-fade-in">
      <h3>留言流</h3>
    </header>
    <section id="gb-list" class="gb-list gb-fade-in"></section>
    <div id="gb-empty" class="gb-empty gb-fade-in" style="display: none">
      <p>没有符合条件的留言。</p>
      <p class="gb-empty-sub">尝试换个关键字,或者清空搜索。</p>
    </div>

    <!-- 返回顶部 + Toast 容器 -->
    <button id="gb-to-top" class="gb-to-top" type="button" aria-label="返回顶部">↑</button>
    <div id="gb-toast-stack" class="gb-toast-stack" aria-live="polite"></div>
  </section>
</template>

<style>
/* ==============================================================
 * 留言板样式 — 故意 NOT scoped
 * --------------------------------------------------------------
 * 原因:大部分 .gb-item / .gb-avatar / .gb-reply 等元素由 jQuery
 *       动态 append 进 DOM,不会有 Vue 给静态元素自动加的 data-v
 *       属性,所以 scoped 样式根本不会应用,留言流就裸着没卡片。
 * 隔离策略:所有类名 .gb-* 前缀,不会污染其他视图。
 * ============================================================== */

.view-gb {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 留言板从知识库三栏(自动受 .app-main min-width:0 约束)挪到 blog 全宽布局,
     需要自己约束最大宽度,否则在大屏上会被拉得过宽 */
  max-width: min(1080px, calc(100% - 32px));
  margin: 24px auto 0;
  padding: 0 clamp(20px, 4vw, 48px); /* 与全局 view padding-x 公式严格一致 */
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

/* ===== 登录态条 ===== */
.gb-auth-bar {
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: linear-gradient(135deg, oklch(0.94 0.04 295 / 0.4), oklch(0.96 0.04 220 / 0.3));
}
.gb-auth-anon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.gb-auth-hint {
  font-size: 13px;
  color: var(--ink-2);
}
.gb-auth-anon-actions {
  display: flex;
  gap: 8px;
}
.gb-auth-user {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 14px;
}
.gb-auth-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--line);
  box-shadow: 0 2px 8px -2px oklch(0.50 0.22 295 / 0.25);
}
.gb-auth-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.gb-auth-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14.5px;
  color: var(--ink);
}
.gb-auth-source {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ink-3);
}
.gb-btn-sm { padding: 6px 12px; font-size: 12px; }
.gb-btn-block { width: 100%; justify-content: center; }

/* ===== 登录 modal ===== */
.gb-modal-mask {
  position: fixed;
  inset: 0;
  background: oklch(0.18 0.020 280 / 0.45);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  /* 覆盖全局 stagger:opacity 0 base + animation-delay 都要清零
     forwards 让 animation 结束后保持 opacity 1,避免回退闪退 */
  opacity: 1 !important;
  animation: gb-modal-fade-in 0.2s var(--ease-out) forwards !important;
  animation-delay: 0s !important;
}
@keyframes gb-modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.gb-modal {
  width: 100%;
  max-width: 460px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: var(--bg);
  box-shadow: var(--shadow-lift);
  opacity: 1 !important;
  animation: gb-modal-pop-in 0.3s var(--ease-out) forwards;
}
@keyframes gb-modal-pop-in {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.gb-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 0 16px;
  border-bottom: 1px solid var(--line-soft);
}
.gb-modal-tabs {
  display: flex;
  gap: 4px;
}
.gb-modal-tab {
  padding: 10px 14px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  font-family: var(--font-display);
  font-size: 13.5px;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s;
}
.gb-modal-tab:hover { color: var(--ink); }
.gb-modal-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 600;
}
.gb-modal-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: transparent;
  border: 0;
  font-size: 20px;
  line-height: 1;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
}
.gb-modal-close:hover {
  color: var(--ink);
  background: oklch(0.94 0.008 80);
}

.gb-modal-pane {
  display: none;
  padding: 22px 24px 24px;
}
.gb-modal-pane.active { display: block; }
.gb-modal-desc {
  font-size: 13px;
  color: var(--ink-2);
  margin: 0 0 18px;
  line-height: 1.6;
}
.gb-modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gb-modal-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gb-modal-field span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.gb-modal-field em { color: var(--error); font-style: normal; }
.gb-modal-field input {
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg);
  font: inherit;
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.gb-modal-field input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.15);
}
.gb-card h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--ink);
}

/* ===== 统计区 — 紧凑布局 + 三色 stat 卡 + chart 平衡 ===== */
.gb-stats-card {
  display: grid;
  /* 改 minmax 让 chart 列在内容多时收缩,避免溢出右边界 */
  grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
  gap: 20px;
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  /* 背景由 App.vue 全局液态玻璃覆盖,这里不重复 */
}
@media (max-width: 720px) {
  .gb-stats-card { grid-template-columns: 1fr; gap: 16px; padding: 14px 16px; }
  .gb-stats-chart {
    flex-direction: column;
    gap: 12px;
  }
  .gb-stats-chart canvas {
    width: 160px;
    height: 160px;
  }
  .gb-chart-legend {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px 8px;
  }
  .gb-chart-legend .legend-clear {
    grid-column: 1 / -1;
  }
}
@media (max-width: 420px) {
  .gb-stats-numbers { gap: 6px; }
  .gb-stat { padding: 8px 12px; }
  .gb-stat-num { font-size: 20px; }
  .gb-chart-legend { grid-template-columns: 1fr; }
}

/* 三个数字 stat 纵向排列,紧凑 */
.gb-stats-numbers {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
  justify-content: center;
}

/* 单条 stat: icon | num+label,水平紧凑 */
.gb-stat {
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--stat-bg-from), var(--stat-bg-to));
  border: 1px solid var(--stat-border);
  transition: transform 0.3s var(--ease-out),
              border-color 0.3s,
              box-shadow 0.3s;
}
.gb-stat:hover {
  transform: translateX(3px);
  border-color: var(--stat-accent);
  box-shadow: 0 6px 18px -6px var(--stat-accent);
}

.gb-stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--stat-accent);
  color: #fff;
  box-shadow: 0 4px 12px -4px var(--stat-accent),
              inset 0 1px 0 oklch(1 0 0 / 0.3);
}

.gb-stat-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.gb-stat-num {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 24px;
  color: var(--ink);
  line-height: 1;
}
.gb-stat-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--ink-3);
  text-transform: uppercase;
}

/* —— 三色 stat 主题 —— */
.gb-stat--posts {
  --stat-accent: oklch(0.55 0.22 295);
  --stat-bg-from: oklch(0.94 0.05 295 / 0.45);
  --stat-bg-to: oklch(0.97 0.03 280 / 0.25);
  --stat-border: oklch(0.55 0.22 295 / 0.22);
}
.gb-stat--likes {
  --stat-accent: oklch(0.62 0.20 25);
  --stat-bg-from: oklch(0.94 0.05 25 / 0.42);
  --stat-bg-to: oklch(0.97 0.03 40 / 0.25);
  --stat-border: oklch(0.62 0.20 25 / 0.22);
}
.gb-stat--replies {
  --stat-accent: oklch(0.55 0.18 230);
  --stat-bg-from: oklch(0.94 0.05 230 / 0.42);
  --stat-bg-to: oklch(0.97 0.03 250 / 0.25);
  --stat-border: oklch(0.55 0.18 230 / 0.22);
}

/* —— 图表区 —— */
.gb-stats-chart {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  flex-wrap: nowrap;
  min-width: 0;
  overflow: hidden;
}
.gb-chart-wrap {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}
.gb-stats-chart canvas {
  width: 160px;
  height: 160px;
  cursor: pointer;
  display: block;
}
/* tooltip 跟随鼠标 */
.gb-chart-tooltip {
  position: absolute;
  pointer-events: none;
  background: oklch(0.18 0.02 280 / 0.92);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, -100%) translateY(-8px);
  transition: opacity 0.15s var(--ease-out);
  z-index: 10;
  box-shadow: 0 4px 14px oklch(0 0 0 / 0.18);
}
.gb-chart-tooltip.show { opacity: 1; }
.gb-chart-tooltip::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: oklch(0.18 0.02 280 / 0.92);
}
/* legend — 单列紧凑 flex,行高 + padding 收紧 */
.gb-chart-legend {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-self: center;
  min-width: 0;
  flex: 1;
  font-family: var(--font-mono);
  font-size: 12px;
}
.gb-chart-legend .legend-row {
  display: grid;
  grid-template-columns: 10px 18px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--ink-2);
  min-width: 0;
  transition: background 0.18s, color 0.18s, transform 0.18s var(--ease-out);
}
.gb-chart-legend .legend-row:hover {
  background: oklch(0.94 0.02 280 / 0.5);
  transform: translateX(2px);
}
.gb-chart-legend .legend-row.active {
  background: oklch(0.92 0.06 295 / 0.45);
  color: var(--ink);
  font-weight: 600;
}
.gb-chart-legend .legend-row.dim {
  opacity: 0.35;
}
.gb-chart-legend .legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: currentColor;
}
.gb-chart-legend .legend-emoji {
  font-size: 16px;
  text-align: center;
}
.gb-chart-legend .legend-count {
  color: var(--ink);
  font-weight: 600;
}
.gb-chart-legend .legend-pct {
  color: var(--ink-3);
  font-size: 11px;
}
.gb-chart-legend .legend-clear {
  margin-top: 6px;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--accent);
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px dashed var(--accent);
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.gb-chart-legend .legend-clear:hover {
  background: var(--accent);
  color: #fff;
}
/* 过滤掉的留言项 */
.gb-item.gb-filtered-out {
  display: none;
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
/* 列表标题段(替代原来的卡片头) — 不带边框/背景,只是文本组合 */
.gb-list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  margin: 8px 4px 0;
  padding-bottom: 6px;
  flex-wrap: wrap;
}
.gb-list-head h3 {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: var(--ink);
}
.gb-list-hint {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}

/* 列表本身是空气容器,只负责 gap,不再有 border/padding/background */
.gb-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 每条帖子独立成卡 — feed 流风格(Twitter / 小红书 / 即刻同款) */
.gb-item {
  position: relative;
  padding: 22px 26px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: var(--bg);
  box-shadow: 0 1px 3px -1px oklch(0.30 0.05 280 / 0.08),
              0 4px 14px -8px oklch(0.30 0.05 280 / 0.12);
  transition: border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.gb-item:hover, .gb-item.is-hover {
  border-color: var(--ink-3);
  box-shadow: 0 2px 6px -2px oklch(0.30 0.05 280 / 0.12),
              0 12px 28px -12px oklch(0.30 0.05 280 / 0.22);
  transform: translateY(-3px);
}
/* 左侧微妙的主题色腰条 — 卡片身份印记 */
.gb-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 22px;
  bottom: 22px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, var(--accent), var(--accent-2));
  opacity: 0;
  transition: opacity 0.3s;
}
.gb-item:hover::before, .gb-item.is-hover::before {
  opacity: 0.85;
}

.gb-empty-sub {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 6px;
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
.gb-avatar-emoji {
  /* emoji 不响应鼠标事件,避免触发 mouseover 冒泡到 .gb-avatar 内部抖动 */
  pointer-events: none;
}
.gb-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
}
.gb-auth-badge {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg);
  pointer-events: none;
}
.gb-auth-badge-github { background: #24292e; }
.gb-auth-badge-local { background: var(--accent-2); }
.gb-avatar-tip {
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  padding: 5px 10px;
  border-radius: 6px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 20;
  box-shadow: var(--shadow-lift);
}
/* 小三角指向头像 */
.gb-avatar-tip::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: var(--ink);
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
.gb-lightbox {
  position: fixed; inset: 0;
  background: oklch(0.18 0.020 280 / 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: zoom-out;
  padding: 40px;
}
.gb-lightbox img {
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
.gb-toast {
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
.gb-toast-info { border-left-color: var(--accent-2); }
.gb-toast-success { border-left-color: var(--success); }
.gb-toast-warning { border-left-color: var(--warning); }
.gb-toast-error { border-left-color: var(--error); }
</style>
