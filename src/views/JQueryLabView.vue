<script setup>
/**
 * jQuery Lab 视图 — 仅负责加载 jQuery + 外置 js,渲染静态 HTML
 *  - 全部业务逻辑在 public/js/jquery-lab.js,完全外置(满足"代码外置规范")
 *  - Vue 不参与响应式,挂载后 jQuery 接管 DOM
 *  - 卸载时清理事件命名空间 .jql
 */
import { onMounted, onBeforeUnmount } from 'vue'

const JQUERY_SRC = 'https://code.jquery.com/jquery-3.7.1.min.js'
const LAB_SRC = `${import.meta.env.BASE_URL}js/jquery-lab.js`

onMounted(async () => {
  try {
    if (!window.jQuery) await loadScript(JQUERY_SRC)
    // 总是重新加载 lab.js 以确保最新版本初始化
    await loadScript(LAB_SRC, true)
    if (window.__initJQueryLab) window.__initJQueryLab()
  } catch (e) {
    console.error('[jQueryLab] 加载失败', e)
  }
})

onBeforeUnmount(() => {
  if (window.__destroyJQueryLab) window.__destroyJQueryLab()
})

/**
 * 动态加载脚本
 * @param {string} src
 * @param {boolean} bust 是否每次重新加载
 */
function loadScript(src, bust = false) {
  return new Promise((resolve, reject) => {
    const finalSrc = bust ? `${src}?t=${Date.now()}` : src
    // 同 src 已加载就跳过(jQuery CDN 不应重复加载)
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
  <section class="view-jql">
    <header class="jql-section-head">
      <span class="jql-no">11 / jQuery Lab</span>
      <h2>jQuery 实验室</h2>
      <p>
        本页所有交互完全由 <code>public/js/jquery-lab.js</code>(外置脚本)+ jQuery 3.7.1 CDN 实现。
        覆盖课程 9 项要求:jQuery 引入 / 三类交互(tabs / 手风琴 / 弹窗 / 返回顶部 / 搜索 / 主题) /
        表单三类校验 / DOM 动态 CRUD / 多种事件 / 5 种动画 / Canvas 数据更新 / 多媒体 / 文件上传 + 删除。
      </p>
    </header>

    <div class="jql-root theme-paper">

      <!-- ① Tabs ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>① 选项卡切换 <small>click + fadeOut/fadeIn 动画</small></h3>
        <div class="jql-tabs">
          <button class="jql-tab active" data-tab="a" type="button">关于本页</button>
          <button class="jql-tab" data-tab="b" type="button">用到的事件</button>
          <button class="jql-tab" data-tab="c" type="button">用到的动画</button>
        </div>
        <div class="jql-tab-panel" data-tab="a">
          <p>这一页是为了"用 jQuery 实现页面交互"准备的实验场,与 Vue 主项目其他页面解耦:</p>
          <ul>
            <li>本页 mount 时动态加载 jQuery CDN 与外置脚本</li>
            <li>所有交互写在 <code>public/js/jquery-lab.js</code>,不混入 Vue</li>
            <li>卸载时 <code>$(...).off('.jql')</code> 清理事件,无内存泄漏</li>
          </ul>
        </div>
        <div class="jql-tab-panel" data-tab="b" style="display: none">
          <p>本页用到的事件类型:</p>
          <ul>
            <li><code>click</code> — tabs / 弹窗按钮 / 任务删除 / 返回顶部 / 主题切换</li>
            <li><code>input</code> — 实时表单校验 / 搜索筛选 / 字数统计</li>
            <li><code>change</code> — 任务勾选 / 文件上传</li>
            <li><code>submit</code> — 表单提交</li>
            <li><code>mouseover / mouseout</code> — hover 提示</li>
            <li><code>keydown</code> — Enter 提交任务 / Esc 关闭弹窗</li>
            <li><code>scroll</code>(window) — 返回顶部按钮显隐</li>
          </ul>
        </div>
        <div class="jql-tab-panel" data-tab="c" style="display: none">
          <p>本页 jQuery 动画 ≥ 5 种:</p>
          <ul>
            <li><code>fadeIn / fadeOut</code> — 卡片入场 / 弹窗 / Toast / 文件项</li>
            <li><code>slideDown / slideUp / slideToggle</code> — 手风琴 / 校验结果 / 任务项</li>
            <li><code>animate</code> — 进度条宽度 / 任务完成度 / 数字 tween / 平滑滚动</li>
            <li><code>show / hide</code> — 返回顶部初始隐藏</li>
            <li><code>delay</code> — 入场逐项延迟</li>
          </ul>
        </div>
      </article>

      <!-- ② 手风琴 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>② 内容展开收起 <small>slideToggle 动画</small></h3>
        <div class="jql-accordion">
          <div class="jql-acc-item">
            <div class="jql-acc-item-head">
              <span>jQuery 是什么?为什么还要用它?</span>
              <svg class="jql-acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="jql-acc-item-body">
              <p>jQuery 是早期的 DOM 操作与跨浏览器兼容封装库。现代项目大多用 Vue / React,
                但 jQuery 仍然是"在静态页面上加交互"最直接的方式,本课程要求掌握。</p>
            </div>
          </div>
          <div class="jql-acc-item">
            <div class="jql-acc-item-head">
              <span>事件命名空间 <code>.jql</code> 有什么用?</span>
              <svg class="jql-acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="jql-acc-item-body">
              <p>给所有 <code>$(...).on('click.jql', ...)</code> 加同一个命名空间。
                Vue 切走时只需要 <code>$(...).off('.jql')</code> 一行全部移除,
                不会误伤可能存在的其他 jQuery 事件。</p>
            </div>
          </div>
          <div class="jql-acc-item">
            <div class="jql-acc-item-head">
              <span>事件委托(.on('click', selector, fn))为什么重要?</span>
              <svg class="jql-acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="jql-acc-item-body">
              <p>任务列表的 .jql-task-del 是动态生成的。直接 <code>$('.jql-task-del').on(...)</code>
                只对当前已有元素绑定,新增的项不响应。委托到父容器 <code>$('#jql-task-list')</code>
                后,无论何时添加的子项都自动可点。</p>
            </div>
          </div>
        </div>
      </article>

      <!-- ③ 弹窗 + ⑥ 主题 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>③ 弹窗 / ⑥ 主题切换 <small>fadeIn + click</small></h3>
        <div class="jql-row">
          <button id="jql-open-modal" class="jql-btn jql-btn-primary" type="button">打开弹窗</button>
          <div class="jql-theme-pick">
            <span>主题(局部):</span>
            <button class="jql-theme-btn active" data-theme="paper" type="button">Paper</button>
            <button class="jql-theme-btn" data-theme="mint" type="button">Mint</button>
            <button class="jql-theme-btn" data-theme="rose" type="button">Rose</button>
          </div>
        </div>
      </article>

      <!-- ④ 搜索筛选 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>④ 搜索筛选 <small>input 事件 + fadeIn/fadeOut 过滤</small></h3>
        <div class="jql-search-bar">
          <input id="jql-search" type="search" class="jql-input" placeholder="输入关键字筛选下方列表…" />
          <span id="jql-search-count" class="jql-search-count">8 条</span>
        </div>
        <ul class="jql-search-list">
          <li class="jql-search-item" data-keys="vue 框架 前端">Vue 3 · 渐进式前端框架</li>
          <li class="jql-search-item" data-keys="vite 构建 工具 esbuild">Vite 6 · 现代构建工具</li>
          <li class="jql-search-item" data-keys="pinia 状态 store">Pinia · Vue 状态管理</li>
          <li class="jql-search-item" data-keys="echarts 图表 可视化">ECharts · 数据可视化库</li>
          <li class="jql-search-item" data-keys="jquery dom 操作 库">jQuery · DOM 操作经典库</li>
          <li class="jql-search-item" data-keys="odoo erp 开源 制造业">Odoo · 开源 ERP 系统</li>
          <li class="jql-search-item" data-keys="spring boot java 后端">Spring Boot · Java 后端框架</li>
          <li class="jql-search-item" data-keys="docker 容器 部署">Docker · 容器化部署</li>
        </ul>
      </article>

      <!-- ⑤ 表单校验 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>⑤ 表单校验 <small>非空 + 邮箱格式 + 数字范围 三类</small></h3>
        <form id="jql-form" novalidate>
          <div class="jql-field-grid">
            <label class="jql-field">
              <span class="jql-field-label">姓名 <em>*</em></span>
              <input id="jql-form-name" type="text" class="jql-input" placeholder="2-20 字符" />
              <span class="jql-field-tip"></span>
            </label>
            <label class="jql-field">
              <span class="jql-field-label">邮箱 <em>*</em></span>
              <input id="jql-form-email" type="email" class="jql-input" placeholder="you@example.com" />
              <span class="jql-field-tip"></span>
            </label>
            <label class="jql-field">
              <span class="jql-field-label">年龄 <em>*</em> <small>(0 - 150)</small></span>
              <input id="jql-form-age" type="number" class="jql-input" placeholder="18" min="0" max="150" />
              <span class="jql-field-tip"></span>
            </label>
            <label class="jql-field jql-field-full">
              <span class="jql-field-label">留言 <small>(字数 <span id="jql-form-msg-count">0 / 200</span>)</small></span>
              <textarea id="jql-form-msg" class="jql-textarea" rows="3" maxlength="200" placeholder="一两句话…"></textarea>
            </label>
          </div>

          <div id="jql-form-result" class="jql-form-result" style="display: none">
            <span class="jql-form-result-text"></span>
          </div>

          <div class="jql-form-actions">
            <button type="reset" class="jql-btn jql-btn-ghost">重置</button>
            <button type="submit" class="jql-btn jql-btn-primary">提交</button>
          </div>
        </form>
      </article>

      <!-- ⑥ 任务列表 (DOM CRUD) ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>⑥ 动态任务列表 <small>动态创建 / 删除 / 切换状态 + Canvas 完成度</small></h3>
        <div class="jql-task-stage">
          <div class="jql-task-main">
            <div class="jql-task-add-bar">
              <input id="jql-task-input" type="text" class="jql-input" placeholder="新任务内容,回车添加…" maxlength="60" />
              <button id="jql-task-add" class="jql-btn jql-btn-accent" type="button">添加</button>
              <button id="jql-task-clear" class="jql-btn jql-btn-ghost" type="button">清空已完成</button>
            </div>

            <ul id="jql-task-list" class="jql-task-list">
              <!-- 由 jQuery 动态填充 -->
            </ul>

            <div class="jql-task-stats">
              <div class="jql-task-progress">
                <div id="jql-task-progress-fill" class="jql-task-progress-fill" style="width:0%"></div>
              </div>
              <span class="jql-task-numbers">
                完成 <strong id="jql-task-done">0</strong> /
                总数 <strong id="jql-task-total">0</strong> ·
                进度 <strong id="jql-task-progress-text">0%</strong>
              </span>
            </div>
          </div>

          <div class="jql-task-ring-wrap">
            <canvas id="jql-task-ring" width="160" height="160"></canvas>
            <p class="jql-ring-caption">Canvas 实时绘制</p>
          </div>
        </div>
      </article>

      <!-- ⑦ 进度条 animate ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>⑦ 进度条 <small>animate(width) + 数字 tween</small></h3>
        <div class="jql-progress-stage">
          <div class="jql-progress-bar">
            <div id="jql-progress-fill" class="jql-progress-fill" style="width: 0%"></div>
          </div>
          <span id="jql-progress-num" class="jql-progress-num">0%</span>
          <input id="jql-progress-target" type="number" class="jql-input jql-progress-input"
                 min="0" max="100" value="75" />
          <button id="jql-progress-go" class="jql-btn jql-btn-primary" type="button">运行 →</button>
        </div>
      </article>

      <!-- ⑧ 多媒体 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>⑧ 多媒体控制 <small>自定义播放/暂停/重播 + 状态提示</small></h3>
        <div class="jql-media-stage">
          <video id="jql-video" preload="metadata"
                 poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720' viewBox='0 0 1280 720'><rect width='1280' height='720' fill='%23e2e8f0'/><text x='50%25' y='50%25' fill='%237c3aed' font-family='monospace' font-size='28' text-anchor='middle' dy='.3em'>SAMPLE MP4</text></svg>">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <div class="jql-video-controls">
            <button id="jql-video-play" class="jql-btn jql-btn-accent" type="button">▶ 播放</button>
            <button id="jql-video-pause" class="jql-btn jql-btn-ghost" type="button">‖ 暂停</button>
            <button id="jql-video-restart" class="jql-btn jql-btn-ghost" type="button">↻ 重播</button>
            <span class="jql-video-status">
              状态:<span id="jql-video-status">空闲</span>
            </span>
          </div>
        </div>
      </article>

      <!-- ⑨ 文件上传 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>⑨ 文件上传与预览 <small>change + 动态创建 + 删除</small></h3>
        <div class="jql-file-stage">
          <label class="jql-file-pick" for="jql-file">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5-5 5 5M12 5v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>点击选择文件 (支持多选,图片自动预览)</span>
            <input id="jql-file" type="file" multiple hidden />
          </label>
          <ul id="jql-file-list" class="jql-file-list"></ul>
          <p id="jql-file-empty" class="jql-file-empty">尚未选择文件。</p>
        </div>
      </article>

      <!-- ⑩ Hover 提示 ============================================ -->
      <article class="jql-card jql-fade-in">
        <h3>⑩ Hover 提示 <small>mouseover / mouseout</small></h3>
        <div class="jql-hover-row">
          <button class="jql-hover-target jql-btn jql-btn-ghost" type="button">
            悬停我
            <span class="jql-hover-hint">看见我了吗?</span>
          </button>
          <button class="jql-hover-target jql-btn jql-btn-ghost" type="button">
            或者我
            <span class="jql-hover-hint">这是 mouseover 触发的</span>
          </button>
          <button class="jql-hover-target jql-btn jql-btn-ghost" type="button">
            再或者我
            <span class="jql-hover-hint">$.fadeIn 进 + fadeOut 出</span>
          </button>
        </div>
      </article>

    </div>

    <!-- 弹窗 (放在 jql-root 外避免被 theme 影响) -->
    <div id="jql-modal" class="jql-modal-mask">
      <div class="jql-modal">
        <button id="jql-modal-close" type="button" class="jql-modal-x" aria-label="关闭">×</button>
        <h3 class="jql-modal-title">这是一个 jQuery 弹窗</h3>
        <p>fadeIn / fadeOut 动画 + 点击遮罩或 ✕ 或按 <code>Esc</code> 关闭。</p>
        <p>整个项目从顶到底没有一行 <code>onclick="..."</code>,所有事件通过 <code>$(...).on(...)</code> 绑定。</p>
        <div class="jql-modal-actions">
          <button id="jql-modal-ok" type="button" class="jql-btn jql-btn-primary">知道了</button>
        </div>
      </div>
    </div>

    <!-- 返回顶部 -->
    <button id="jql-to-top" class="jql-to-top" type="button" aria-label="返回顶部">↑</button>

    <!-- Toast 容器 -->
    <div id="jql-toast-stack" class="jql-toast-stack" aria-live="polite"></div>
  </section>
</template>

<style scoped>
/* ==============================================================
 * jQuery Lab 样式 — scoped 不污染其他视图
 * 局部主题用 .jql-root.theme-paper / .theme-mint / .theme-rose
 * ============================================================== */

.view-jql {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.jql-section-head {
  margin-bottom: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-soft);
}
.jql-no {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--ink-3);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.jql-section-head h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(22px, 2.4vw, 30px);
  margin: 0 0 8px;
}
.jql-section-head p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-2);
  margin: 0;
  max-width: 880px;
}
.jql-section-head code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  color: var(--accent);
}

/* 根容器 + 局部 theme 切换 */
.jql-root {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 80 / 0.5);
  transition: background 0.4s, border-color 0.4s;
}
.jql-root.theme-paper {
  background: oklch(0.985 0.003 80 / 0.5);
}
.jql-root.theme-mint {
  background: oklch(0.96 0.04 160 / 0.45);
  border-color: oklch(0.85 0.08 160 / 0.6);
}
.jql-root.theme-rose {
  background: oklch(0.96 0.04 20 / 0.45);
  border-color: oklch(0.85 0.08 20 / 0.6);
}

.jql-card {
  padding: 20px 22px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
}
.jql-card h3 {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  margin: 0 0 16px;
  color: var(--ink);
}
.jql-card h3 small {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 400;
  color: var(--ink-3);
}
.jql-card p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-2);
  margin: 0 0 8px;
}
.jql-card ul { padding-left: 1.2em; font-size: 13.5px; color: var(--ink-2); line-height: 1.7; }
.jql-card li { margin: 4px 0; }
.jql-card code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  color: var(--accent);
}

/* ===== Tabs ===== */
.jql-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--line-soft);
}
.jql-tab {
  padding: 8px 16px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  font-family: var(--font-display);
  font-size: 13.5px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s;
}
.jql-tab:hover { color: var(--ink); }
.jql-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* ===== Accordion ===== */
.jql-accordion {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.jql-acc-item {
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  overflow: hidden;
}
.jql-acc-item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  color: var(--ink);
  background: oklch(0.97 0.005 80 / 0.7);
  transition: background 0.3s;
}
.jql-acc-item-head:hover { background: oklch(0.94 0.04 295 / 0.4); }
.jql-acc-arrow { transition: transform 0.3s var(--ease-out); color: var(--ink-3); }
.jql-acc-item.open .jql-acc-arrow { transform: rotate(180deg); color: var(--accent); }
.jql-acc-item-body {
  padding: 14px 16px;
  display: none;
  border-top: 1px solid var(--line-soft);
}
.jql-acc-item-body p { margin: 0; }

/* ===== 通用按钮 ===== */
.jql-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.3s var(--ease-out), background 0.3s, color 0.3s, border-color 0.3s;
}
.jql-btn:active { transform: translateY(0); }
.jql-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.jql-btn-primary { background: var(--ink); color: var(--bg-deep); }
.jql-btn-primary:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }
.jql-btn-ghost { background: transparent; color: var(--ink-2); border-color: var(--line); }
.jql-btn-ghost:hover { color: var(--ink); border-color: var(--ink-3); transform: translateY(-1px); }
.jql-btn-accent { background: var(--accent); color: #fff; }
.jql-btn-accent:hover { background: oklch(0.45 0.22 295); transform: translateY(-1px); }
.jql-row { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }

/* ===== 主题切换按钮组 ===== */
.jql-theme-pick {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
}
.jql-theme-btn {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.jql-theme-btn:hover { color: var(--ink); border-color: var(--ink-3); }
.jql-theme-btn.active { color: #fff; background: var(--accent); border-color: var(--accent); }

/* ===== 搜索 ===== */
.jql-search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.jql-search-bar .jql-input { flex: 1; }
.jql-search-count {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--line-soft);
}
.jql-search-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.jql-search-item {
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--ink);
  background: oklch(0.97 0.005 80 / 0.6);
  border: 1px solid var(--line-soft);
  transition: background 0.3s, transform 0.3s var(--ease-out);
}
.jql-search-item:hover {
  background: oklch(0.92 0.04 295 / 0.4);
  transform: translateX(3px);
}

/* ===== 表单 ===== */
.jql-input, .jql-textarea {
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
.jql-input:focus, .jql-textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-deep);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.18);
}
.jql-input::placeholder, .jql-textarea::placeholder { color: var(--ink-3); }
.jql-textarea { resize: vertical; min-height: 80px; font-family: var(--font-body); line-height: 1.6; }

.jql-field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 14px 18px;
  margin-bottom: 16px;
}
.jql-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.jql-field-full { grid-column: 1 / -1; }
.jql-field-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.jql-field-label em { color: var(--error); font-style: normal; margin-left: 2px; }
.jql-field-label small { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); text-transform: none; letter-spacing: 0; }
.jql-field-tip {
  min-height: 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
.jql-field.is-error .jql-input { border-color: var(--error); background: oklch(0.97 0.05 25 / 0.5); }
.jql-field.is-error .jql-field-tip { color: var(--error); }
.jql-field.is-ok .jql-input { border-color: var(--success); }
.jql-field.is-ok .jql-field-tip { color: var(--success); }

.jql-form-result {
  margin: 14px 0;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 3px solid;
  font-size: 13.5px;
}
.jql-form-result.ok { background: oklch(0.92 0.05 160 / 0.4); border-left-color: var(--success); color: var(--success); }
.jql-form-result.err { background: oklch(0.92 0.06 25 / 0.4); border-left-color: var(--error); color: var(--error); }

.jql-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

/* ===== 任务列表 ===== */
.jql-task-stage {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 22px;
  align-items: start;
}
@media (max-width: 720px) {
  .jql-task-stage { grid-template-columns: 1fr; }
}
.jql-task-add-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.jql-task-add-bar .jql-input { flex: 1; min-width: 180px; }

.jql-task-list {
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.jql-task {
  display: grid;
  grid-template-columns: 1fr 28px;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: oklch(0.97 0.005 80 / 0.7);
  font-size: 14px;
  color: var(--ink);
  transition: background 0.3s, border-color 0.3s;
}
.jql-task.done { background: oklch(0.92 0.05 160 / 0.25); border-color: oklch(0.85 0.08 160 / 0.4); }
.jql-task.done .jql-task-text { text-decoration: line-through; color: var(--ink-3); }
.jql-task-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.jql-task-check {
  width: 16px; height: 16px;
  accent-color: var(--accent);
  cursor: pointer;
}
.jql-task-del {
  width: 26px; height: 26px;
  border-radius: 6px;
  background: transparent;
  color: var(--ink-3);
  font-size: 18px;
  line-height: 1;
  border: 0;
  cursor: pointer;
  transition: color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
}
.jql-task-del:hover {
  color: var(--error);
  background: oklch(0.92 0.06 25 / 0.5);
  transform: rotate(90deg);
}

.jql-task-stats {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.jql-task-progress {
  flex: 1;
  height: 8px;
  background: var(--bg-soft);
  border-radius: 999px;
  overflow: hidden;
  min-width: 100px;
}
.jql-task-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 999px;
}
.jql-task-numbers {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-2);
}
.jql-task-numbers strong { color: var(--ink); font-weight: 500; }

.jql-task-ring-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg-deep);
}
.jql-task-ring-wrap canvas { width: 140px; height: 140px; }
.jql-ring-caption {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
  margin: 0 !important;
}

/* ===== 进度条 ===== */
.jql-progress-stage {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.jql-progress-bar {
  flex: 1;
  height: 12px;
  border-radius: 999px;
  background: var(--bg-soft);
  overflow: hidden;
  min-width: 200px;
}
.jql-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 999px;
}
.jql-progress-num {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--accent);
  min-width: 50px;
  text-align: right;
}
.jql-progress-input { width: 90px; }

/* ===== 视频 ===== */
.jql-media-stage {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  align-items: start;
}
@media (max-width: 720px) {
  .jql-media-stage { grid-template-columns: 1fr; }
}
.jql-media-stage video {
  width: 100%;
  border-radius: 10px;
  background: var(--bg-deep);
  aspect-ratio: 16 / 9;
  display: block;
}
.jql-video-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 80 / 0.7);
}
.jql-video-status {
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-2);
}
#jql-video-status.playing { color: var(--success); }

/* ===== 文件上传 ===== */
.jql-file-pick {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 22px;
  border: 1.5px dashed var(--line);
  border-radius: 12px;
  background: oklch(0.97 0.005 80 / 0.4);
  color: var(--ink-2);
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
}
.jql-file-pick:hover {
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.3);
  color: var(--ink);
}
.jql-file-pick svg { color: var(--accent); }
.jql-file-pick span { font-size: 14px; font-weight: 500; }

.jql-file-list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.jql-file-item {
  display: grid;
  grid-template-columns: 40px 1fr auto 28px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  background: var(--bg-deep);
}
.jql-file-thumb {
  width: 40px; height: 40px;
  border-radius: 6px;
  background: oklch(0.92 0.04 295 / 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  color: var(--accent);
  overflow: hidden;
}
.jql-file-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.jql-file-name {
  font-size: 13.5px;
  color: var(--ink);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jql-file-size {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
.jql-file-del {
  width: 26px; height: 26px;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--ink-3);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.3s, background 0.3s, transform 0.3s;
}
.jql-file-del:hover {
  color: var(--error);
  background: oklch(0.92 0.06 25 / 0.5);
  transform: rotate(90deg);
}
.jql-file-empty {
  margin: 12px 0 0 !important;
  padding: 14px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
  border: 1px dashed var(--line-soft);
  border-radius: 10px;
}

/* ===== Hover 提示 ===== */
.jql-hover-row { display: flex; gap: 12px; flex-wrap: wrap; }
.jql-hover-target {
  position: relative;
  padding-right: 22px;
}
.jql-hover-hint {
  display: none;
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 11.5px;
  white-space: nowrap;
  box-shadow: var(--shadow-card);
  pointer-events: none;
}
.jql-hover-hint::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  transform: translateX(-50%) rotate(45deg);
  width: 8px; height: 8px;
  background: var(--ink);
}

/* ===== 弹窗 ===== */
.jql-modal-mask {
  display: none;
  position: fixed; inset: 0;
  background: oklch(0.30 0.020 280 / 0.45);
  backdrop-filter: blur(4px);
  z-index: 200;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.jql-modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 26px 28px;
  border-radius: var(--radius-lg);
  background: var(--bg);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-lift);
}
.jql-modal-x {
  position: absolute;
  right: 14px; top: 12px;
  width: 30px; height: 30px;
  background: transparent;
  border: 0;
  border-radius: 6px;
  font-size: 22px;
  line-height: 1;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
}
.jql-modal-x:hover { color: var(--error); background: oklch(0.92 0.06 25 / 0.5); }
.jql-modal-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
  color: var(--ink);
}
.jql-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

/* ===== 返回顶部 ===== */
.jql-to-top {
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
.jql-to-top:hover { background: var(--accent); transform: translateY(-3px); }

/* ===== Toast ===== */
.jql-toast-stack {
  position: fixed;
  right: 24px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 110;
  pointer-events: none;
}
.jql-toast {
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
.jql-toast-info { border-left-color: var(--accent-2); }
.jql-toast-success { border-left-color: var(--success); }
.jql-toast-warning { border-left-color: var(--warning); }
.jql-toast-error { border-left-color: var(--error); }
</style>
