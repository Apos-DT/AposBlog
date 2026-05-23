<script setup>
/**
 * 作品集 / 简历页
 * 数据完全来自 src/data/portfolio.json,与 AI 对话使用同一份数据源
 * 招聘者可直接浏览,也可去 AI 对话页问"赵祥生做过什么"
 */
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import portfolio from '@/data/portfolio.json'
import IconBase from '@/components/IconBase.vue'

const p = portfolio
const BASE = import.meta.env.BASE_URL
const SITE_URL = 'https://apos-dt.github.io/AposBlog/'
const AVATAR_URL = SITE_URL + 'avatar.jpg'

// 友链复制代码片段
const friendSnippets = {
  markdown: `[APOS · 赵祥生](${SITE_URL}) — 制造业前线的工程笔记博客
![avatar](${AVATAR_URL})`,
  html: `<a href="${SITE_URL}" target="_blank" rel="noopener">
  <img src="${AVATAR_URL}" alt="APOS · 赵祥生" width="80" height="80" style="border-radius:50%">
  <span>APOS · 赵祥生</span>
</a>`,
  json: `{
  "name": "APOS · 赵祥生",
  "url": "${SITE_URL}",
  "avatar": "${AVATAR_URL}",
  "description": "制造业前线的工程笔记博客 + Karpathy 风知识库"
}`,
}

const copiedKey = ref('')

async function copySnippet(key) {
  try {
    await navigator.clipboard.writeText(friendSnippets[key])
    copiedKey.value = key
    setTimeout(() => (copiedKey.value = ''), 1500)
  } catch {
    copiedKey.value = 'fail'
  }
}

// 用 anchor 在页内跳转
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="view-portfolio">

    <!-- HERO -->
    <header class="po-hero">
      <div class="po-hero-top">
        <img
          v-if="p.profile.avatar"
          class="po-hero-avatar"
          :src="`${BASE}${p.profile.avatar}`"
          :alt="p.profile.name"
        />
        <div class="po-hero-text">
          <span class="po-eyebrow">PORTFOLIO · 作品集 / 简历</span>
          <h1>
            我是<em>{{ p.profile.name }}</em>。<br/>
            在<em>制造业前线</em>写代码、做 ERP、做工业视觉。
          </h1>
        </div>
      </div>
      <p class="po-lede">{{ p.profile.summary }}</p>

      <div class="po-quick">
        <a :href="`mailto:${p.profile.contact.email}`" class="po-btn po-btn-primary">
          <IconBase name="check" :size="14" />
          <span>发邮件聊聊</span>
        </a>
        <RouterLink to="/chat" class="po-btn po-btn-ghost">
          <IconBase name="chat" :size="14" />
          <span>问 AI 我做过什么</span>
        </RouterLink>
        <a :href="p.profile.contact.github" target="_blank" rel="noopener" class="po-btn po-btn-ghost">
          <IconBase name="link" :size="14" />
          <span>GitHub</span>
        </a>
      </div>

      <!-- 目录锚点 -->
      <nav class="po-toc">
        <button type="button" @click="scrollTo('experience')">工作经历</button>
        <button type="button" @click="scrollTo('projects')">项目经历</button>
        <button type="button" @click="scrollTo('skills')">技能矩阵</button>
        <button type="button" @click="scrollTo('education')">教育背景</button>
        <button type="button" @click="scrollTo('awards')">奖项</button>
      </nav>
    </header>

    <!-- 工作经历 -->
    <section id="experience" class="po-section">
      <header class="po-section-head">
        <span class="po-no">01 / Experience</span>
        <h2>工作经历</h2>
      </header>
      <ul class="po-timeline">
        <li v-for="e in p.experience" :key="e.id" class="po-exp">
          <div class="po-exp-meta">
            <span class="po-period">{{ e.period }}</span>
            <span v-if="e.current" class="po-current-tag">在职</span>
          </div>
          <div class="po-exp-body">
            <h3>
              {{ e.role }}
              <em>· {{ e.company }}</em>
            </h3>
            <div class="po-stack">
              <span v-for="s in e.stack" :key="s" class="po-chip">{{ s }}</span>
            </div>
            <ul class="po-bullets">
              <li v-for="a in e.achievements" :key="a">{{ a }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </section>

    <!-- 项目经历 -->
    <section id="projects" class="po-section">
      <header class="po-section-head">
        <span class="po-no">02 / Projects</span>
        <h2>项目经历</h2>
        <p>共 {{ p.projects.length }} 个项目 · 按时间倒序</p>
      </header>
      <div class="po-projects">
        <article v-for="proj in p.projects" :key="proj.id" class="po-project">
          <header class="po-proj-head">
            <h3>{{ proj.name }}</h3>
            <span v-if="proj.ongoing" class="po-current-tag">进行中</span>
          </header>
          <div class="po-proj-meta">
            <span>{{ proj.role }}</span>
            <span class="dot-sep">·</span>
            <span>{{ proj.period }}</span>
          </div>
          <p class="po-proj-summary">{{ proj.summary }}</p>
          <div class="po-stack">
            <span v-for="s in proj.stack" :key="s" class="po-chip">{{ s }}</span>
          </div>
          <ul class="po-bullets">
            <li v-for="h in proj.highlights" :key="h">{{ h }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- 技能矩阵 -->
    <section id="skills" class="po-section">
      <header class="po-section-head">
        <span class="po-no">03 / Skills</span>
        <h2>技能矩阵</h2>
      </header>
      <div class="po-skills">
        <article class="po-skill">
          <span class="po-skill-label">编程语言</span>
          <div class="po-stack">
            <span v-for="s in p.skills.programmingLanguages" :key="s" class="po-chip">{{ s }}</span>
          </div>
        </article>
        <article class="po-skill">
          <span class="po-skill-label">Web 开发</span>
          <div class="po-stack">
            <span v-for="s in p.skills.webDev" :key="s" class="po-chip">{{ s }}</span>
          </div>
        </article>
        <article class="po-skill">
          <span class="po-skill-label">ERP & 工业</span>
          <div class="po-stack">
            <span v-for="s in p.skills.erpAndIndustrial" :key="s" class="po-chip">{{ s }}</span>
          </div>
        </article>
        <article class="po-skill">
          <span class="po-skill-label">数据 & 分析</span>
          <div class="po-stack">
            <span v-for="s in p.skills.dataAndAnalysis" :key="s" class="po-chip">{{ s }}</span>
          </div>
        </article>
        <article class="po-skill">
          <span class="po-skill-label">工程化 & 运维</span>
          <div class="po-stack">
            <span v-for="s in p.skills.engineering" :key="s" class="po-chip">{{ s }}</span>
          </div>
        </article>
        <article class="po-skill">
          <span class="po-skill-label">AI 协作</span>
          <div class="po-stack">
            <span v-for="s in p.skills.aiTools" :key="s" class="po-chip">{{ s }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 教育 -->
    <section id="education" class="po-section">
      <header class="po-section-head">
        <span class="po-no">04 / Education</span>
        <h2>教育背景</h2>
      </header>
      <article class="po-edu">
        <div class="po-edu-meta">
          <span class="po-period">{{ p.profile.education.period }}</span>
        </div>
        <div>
          <h3>{{ p.profile.education.school }}</h3>
          <p class="po-edu-major">{{ p.profile.education.major }} · {{ p.profile.education.degree }}</p>
          <p class="po-edu-extra">{{ p.profile.education.extra }}</p>
        </div>
      </article>
    </section>

    <!-- 奖项 -->
    <section id="awards" class="po-section">
      <header class="po-section-head">
        <span class="po-no">05 / Awards</span>
        <h2>奖项与证书</h2>
      </header>
      <ul class="po-awards">
        <li v-for="a in p.awards" :key="a">
          <span class="po-award-mark">★</span>
          <span>{{ a }}</span>
        </li>
      </ul>
    </section>

    <!-- 联系 -->
    <section class="po-section po-contact">
      <header class="po-section-head">
        <span class="po-no">06 / Contact</span>
        <h2>建立联系</h2>
        <p>有合作 / 招聘 / 技术交流意向,欢迎邮件联系,或者直接问博客 AI</p>
      </header>
      <div class="po-contact-grid">
        <a :href="`mailto:${p.profile.contact.email}`" class="po-contact-tile">
          <span class="po-contact-label">邮箱</span>
          <strong>{{ p.profile.contact.email }}</strong>
        </a>
        <a :href="p.profile.contact.github" target="_blank" rel="noopener" class="po-contact-tile">
          <span class="po-contact-label">GitHub</span>
          <strong>Apos-DT</strong>
        </a>
        <RouterLink to="/chat" class="po-contact-tile po-contact-ai">
          <span class="po-contact-label">AI 问答</span>
          <strong>问 AI 关于我</strong>
        </RouterLink>
        <RouterLink to="/guestbook" class="po-contact-tile">
          <span class="po-contact-label">留言板</span>
          <strong>留下访客脚印</strong>
        </RouterLink>
      </div>
    </section>

    <!-- 友情链接 — 提供给别人引用本站的代码片段 -->
    <section class="po-section po-friendlink">
      <header class="po-section-head">
        <span class="po-no">07 / Friend Link</span>
        <h2>友情链接</h2>
        <p>如果想在你的博客挂上我的友链,可以直接复制下方代码。也可以用 <code>/info.json</code> 接口拿到全部元数据。</p>
      </header>

      <!-- 友链卡预览 -->
      <article class="po-fl-card">
        <img class="po-fl-avatar" :src="AVATAR_URL" alt="APOS 头像" />
        <div class="po-fl-meta">
          <strong>APOS · 赵祥生</strong>
          <span>{{ SITE_URL }}</span>
          <p>制造业前线的工程笔记博客 + Karpathy 风知识库</p>
        </div>
      </article>

      <!-- 资源 endpoint -->
      <div class="po-fl-endpoints">
        <a :href="AVATAR_URL" target="_blank" rel="noopener" class="po-fl-ep">
          <span class="po-fl-ep-label">头像 JPG · 200×200</span>
          <code>{{ AVATAR_URL }}</code>
        </a>
        <a :href="`${SITE_URL}avatar.svg`" target="_blank" rel="noopener" class="po-fl-ep">
          <span class="po-fl-ep-label">头像 SVG · 圆形</span>
          <code>{{ SITE_URL }}avatar.svg</code>
        </a>
        <a :href="`${SITE_URL}info.json`" target="_blank" rel="noopener" class="po-fl-ep">
          <span class="po-fl-ep-label">元数据 JSON</span>
          <code>{{ SITE_URL }}info.json</code>
        </a>
      </div>

      <!-- 代码片段三种 -->
      <div class="po-fl-snippets">
        <div class="po-fl-snippet">
          <header>
            <span>Markdown</span>
            <button type="button" class="po-fl-copy" @click="copySnippet('markdown')">
              <span v-if="copiedKey === 'markdown'">✓ 已复制</span>
              <span v-else>复制</span>
            </button>
          </header>
          <pre><code>{{ friendSnippets.markdown }}</code></pre>
        </div>

        <div class="po-fl-snippet">
          <header>
            <span>HTML</span>
            <button type="button" class="po-fl-copy" @click="copySnippet('html')">
              <span v-if="copiedKey === 'html'">✓ 已复制</span>
              <span v-else>复制</span>
            </button>
          </header>
          <pre><code>{{ friendSnippets.html }}</code></pre>
        </div>

        <div class="po-fl-snippet">
          <header>
            <span>JSON(给友链系统填项时用)</span>
            <button type="button" class="po-fl-copy" @click="copySnippet('json')">
              <span v-if="copiedKey === 'json'">✓ 已复制</span>
              <span v-else>复制</span>
            </button>
          </header>
          <pre><code>{{ friendSnippets.json }}</code></pre>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.view-portfolio {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* ===== Hero ===== */
.po-hero {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 0 18px;
  border-bottom: 1px solid var(--line-soft);
}
.po-hero-top {
  display: flex;
  align-items: center;
  gap: 24px;
}
.po-hero-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--bg);
  box-shadow:
    0 0 0 1px var(--line),
    0 12px 30px -10px oklch(0.50 0.22 295 / 0.30),
    var(--shadow-lift);
  flex-shrink: 0;
  transition: transform 0.5s var(--ease-out), box-shadow 0.5s;
}
.po-hero-avatar:hover {
  transform: scale(1.04) rotate(-2deg);
  box-shadow:
    0 0 0 1px var(--accent),
    0 16px 36px -12px oklch(0.50 0.22 295 / 0.45);
}
.po-hero-text { flex: 1; min-width: 0; }
@media (max-width: 600px) {
  .po-hero-top { flex-direction: column; align-items: flex-start; gap: 18px; }
  .po-hero-avatar { width: 96px; height: 96px; }
}
.po-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--ink-3);
  text-transform: uppercase;
}
.po-hero h1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4.2vw, 48px);
  letter-spacing: -0.022em;
  line-height: 1.18;
  margin: 0;
}
.po-hero h1 em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent-warm);
}
.po-lede {
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--ink-2);
  margin: 0;
  max-width: 760px;
}

.po-quick {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.po-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.po-btn-primary {
  background: var(--accent);
  color: #fff;
}
.po-btn-primary:hover {
  background: oklch(0.45 0.22 295);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px oklch(0.50 0.22 295 / 0.45);
}
.po-btn-ghost {
  background: transparent;
  color: var(--ink-2);
  border-color: var(--line);
}
.po-btn-ghost:hover {
  color: var(--ink);
  border-color: var(--ink-3);
  transform: translateY(-2px);
}

.po-toc {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.po-toc button {
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--bg-soft);
  border: 1px solid var(--line-soft);
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.po-toc button:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.5);
}

/* ===== Section 通用 ===== */
.po-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  scroll-margin-top: 90px;
}
.po-section-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.po-no {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.po-section-head h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(22px, 2.6vw, 32px);
  letter-spacing: -0.02em;
  margin: 0;
}
.po-section-head p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--ink-2);
}

.po-period {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.po-current-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  background: oklch(0.92 0.06 160 / 0.6);
  color: var(--success);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  font-weight: 600;
  vertical-align: middle;
}

.po-stack {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 8px 0 4px;
}
.po-chip {
  padding: 3px 10px;
  border-radius: 999px;
  background: oklch(0.94 0.008 80 / 0.7);
  border: 1px solid var(--line-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-2);
}

.po-bullets {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.po-bullets li {
  position: relative;
  padding-left: 18px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-2);
}
.po-bullets li::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 11px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.8;
}

/* ===== Experience timeline ===== */
.po-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 26px;
}
.po-exp {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 28px;
  padding: 20px 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  box-shadow: var(--shadow-card);
  transition: border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.po-exp:hover {
  border-color: var(--ink-3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}
.po-exp-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
}
.po-exp-body h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 17px;
  margin: 0 0 8px;
  color: var(--ink);
}
.po-exp-body h3 em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent-warm);
}
@media (max-width: 720px) {
  .po-exp { grid-template-columns: 1fr; gap: 12px; }
}

/* ===== Projects ===== */
.po-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(420px, 100%), 1fr));
  gap: 16px;
}
.po-project {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  box-shadow: var(--shadow-card);
  transition: border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.po-project:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lift);
}
.po-proj-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.po-proj-head h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16.5px;
  margin: 0;
  color: var(--ink);
  flex: 1;
  min-width: 0;
}
.po-proj-meta {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  display: flex;
  gap: 8px;
  align-items: center;
}
.po-proj-summary {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-2);
  margin: 4px 0 0;
}
.dot-sep { color: var(--ink-3); }

/* ===== Skills ===== */
.po-skills {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 14px;
}
.po-skill {
  padding: 18px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.po-skill:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.po-skill-label {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 13.5px;
  color: var(--ink);
  margin-bottom: 4px;
}

/* ===== Education ===== */
.po-edu {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 28px;
  padding: 22px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  box-shadow: var(--shadow-card);
}
.po-edu h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 17px;
  margin: 0 0 6px;
  color: var(--ink);
}
.po-edu-major {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--ink-2);
}
.po-edu-extra {
  margin: 0;
  font-size: 13px;
  color: var(--ink-3);
}
@media (max-width: 720px) {
  .po-edu { grid-template-columns: 1fr; gap: 12px; }
}

/* ===== Awards ===== */
.po-awards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 10px;
}
.po-awards li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  font-size: 13.5px;
  color: var(--ink-2);
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.po-awards li:hover {
  border-color: var(--accent-warm);
  transform: translateX(3px);
}
.po-award-mark {
  color: var(--accent-warm);
  font-size: 14px;
}

/* ===== Contact ===== */
.po-contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 12px;
}
.po-contact-tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  color: inherit;
  transition: border-color 0.3s, transform 0.3s var(--ease-out), background 0.3s;
}
.po-contact-tile:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  background: oklch(0.94 0.04 295 / 0.4);
}
.po-contact-tile.po-contact-ai {
  background: linear-gradient(135deg, oklch(0.92 0.06 295 / 0.6), oklch(0.95 0.04 220 / 0.5));
  border-color: oklch(0.50 0.22 295 / 0.3);
}
.po-contact-tile.po-contact-ai strong { color: var(--accent); }
.po-contact-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.po-contact-tile strong {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
}

/* ===== Friend Link ===== */
.po-friendlink .po-section-head code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--bg-soft);
  border: 1px solid var(--line-soft);
  color: var(--accent);
}
.po-fl-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: linear-gradient(135deg, oklch(0.94 0.04 295 / 0.35), oklch(0.96 0.04 220 / 0.25));
  box-shadow: var(--shadow-card);
}
.po-fl-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 1px var(--line), 0 6px 14px -6px oklch(0.50 0.22 295 / 0.30);
  flex-shrink: 0;
}
.po-fl-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.po-fl-meta strong {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: var(--ink);
}
.po-fl-meta span {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--accent);
}
.po-fl-meta p {
  margin: 4px 0 0;
  font-size: 13.5px;
  color: var(--ink-2);
}

.po-fl-endpoints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 10px;
}
.po-fl-ep {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  color: inherit;
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.po-fl-ep:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.po-fl-ep-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.po-fl-ep code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--accent);
  word-break: break-all;
}

.po-fl-snippets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.po-fl-snippet {
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  background: var(--bg-deep);
  overflow: hidden;
}
.po-fl-snippet header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: var(--bg-soft);
  border-bottom: 1px solid var(--line-soft);
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--ink-2);
}
.po-fl-snippet pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--ink);
  background: transparent;
}
.po-fl-snippet pre code {
  font-family: inherit;
  color: inherit;
  background: transparent;
  padding: 0;
  white-space: pre;
}
.po-fl-copy {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}
.po-fl-copy:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.4);
}
</style>
