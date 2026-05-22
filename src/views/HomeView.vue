<script setup>
/**
 * HomeView — 博客首页(原 index.html 的 Vue 化)
 * 包含: Hero / Latest 文章 / Stack 技能 / Experience 经历 / About 联系表单
 * 所有动效统一由 onMounted 触发 GSAP / IntersectionObserver
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useSettingsStore } from '@/stores/settings'
import { gsap } from 'gsap'

import IconBase from '@/components/IconBase.vue'

const posts = usePostsStore()
const settings = useSettingsStore()

const heroEl = ref(null)
const yearEl = computed(() => new Date().getFullYear())

// ===== 联系表单 =====
const contactForm = ref({
  name: '',
  email: '',
  topic: '想合作',
  message: '',
  agree: false,
})
const contactStatus = ref('')
const contactStatusKind = ref('')

const messageBytes = computed(() => new TextEncoder().encode(contactForm.value.message).length)

function submitContact() {
  if (!contactForm.value.name.trim()) {
    contactStatus.value = '× 请填写姓名'
    contactStatusKind.value = 'err'
    return
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactForm.value.email)) {
    contactStatus.value = '× 邮箱格式不对'
    contactStatusKind.value = 'err'
    return
  }
  if (!contactForm.value.message.trim()) {
    contactStatus.value = '× 请填写留言'
    contactStatusKind.value = 'err'
    return
  }
  if (!contactForm.value.agree) {
    contactStatus.value = '× 请勾选同意接收回复邮件'
    contactStatusKind.value = 'err'
    return
  }
  const subject = `[博客留言] ${contactForm.value.topic} · ${contactForm.value.name}`
  const body =
    `来自:${contactForm.value.name} <${contactForm.value.email}>\n` +
    `主题:${contactForm.value.topic}\n\n` +
    `${contactForm.value.message.trim()}\n\n` +
    `—— 通过博客联系表单提交`
  location.href = `mailto:2411447661@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  contactStatus.value = '✓ 已打开邮件客户端'
  contactStatusKind.value = 'ok'
}

function resetContact() {
  contactForm.value = { name: '', email: '', topic: '想合作', message: '', agree: false }
  contactStatus.value = ''
  contactStatusKind.value = ''
}

// ===== Hero 字符 stagger 入场动画 =====
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const words = heroEl.value?.querySelectorAll('.hero-title .word')
  if (words?.length) {
    gsap.to(words, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.1,
    })
  }

  // 滚动揭示
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  document.querySelectorAll('.reveal-up, .reveal').forEach((el) => io.observe(el))
})

// ===== 最新文章 / 归档 =====
const latest = computed(() => posts.sorted.slice(0, 6))

const archiveByYear = computed(() => {
  const byYear = {}
  posts.sorted.forEach((p) => {
    const y = (p.date || '').slice(0, 4)
    if (!y) return
    ;(byYear[y] = byYear[y] || []).push(p)
  })
  return Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0]))
})

function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${y}.${m}.${day}`
}

// ===== Stack 技能矩阵 =====
const stack = [
  { no: '01', label: '编程语言', chips: ['C', 'C++', 'Python', 'Java', 'JavaScript', 'TypeScript'] },
  { no: '02', label: 'Web 开发', chips: ['Spring Boot', 'JPA', 'REST API', 'Vue 3', 'Element Plus', 'Django'] },
  { no: '03', label: 'ERP & 工业', chips: ['Odoo', 'XML-RPC', '机器视觉', '上下位机联调', '企业微信对接', '现场交付'] },
  { no: '04', label: '数据 & 分析', chips: ['MySQL', 'PostgreSQL', 'Selenium', 'Pandas', 'ECharts', '数据可视化'] },
  { no: '05', label: '工程化 & 运维', chips: ['Docker', 'Linux', 'Nginx', 'Git', 'Shell', 'CI / CD'] },
  { no: '06', label: 'AI & 协作', chips: ['Trae', 'Cursor', '代码生成', '重构', '排障', '测试补全'] },
]

const experience = [
  {
    date: '2025.10 – 至今',
    company: '青岛火一五信息科技有限公司',
    role: 'Python 全栈工程师 (ERP)',
    desc: [
      '参与制造业客户 Odoo ERP 项目: 销-采-库-产-质-财全链路二开,负责对接客户业务部门、需求梳理与迭代计划。',
      '完成关键功能二次开发与外部平台集成(企业微信等)。',
      '开发工业机器视觉系统: 上下位机联调与现场支持,定位产线异常,优化通信稳定性。',
      '服务器基础运维: 环境部署、日志排障与运行监控。',
    ],
    tags: ['Odoo', 'Python', '机器视觉', 'Docker'],
  },
  {
    date: '2025.06 – 2025.09',
    company: '青岛隆腾科技有限公司',
    role: '前端开发工程师',
    desc: [
      '在既有 Spring Boot + Vue 项目上进行功能迭代,实现业务页面扩展、权限/表单/列表等通用交互增强。',
      '负责数据可视化大屏,将业务数据以图表与看板形式展示,完成前后端接口联调与性能优化。',
    ],
    tags: ['Spring Boot', 'Vue', 'ECharts', '大屏'],
  },
]
</script>

<template>
  <div class="home-page">
    <!-- HERO -->
    <section ref="heroEl" class="hero" id="hero">
      <div class="hero-meta">
        <span class="dot"></span>
        <span>WRITING · BUILDING · THINKING — Since 2024</span>
      </div>

      <h1 class="hero-title">
        <span class="line"><span class="word">Building</span> <span class="word">at</span></span>
        <span class="line"><span class="word italic">the</span> <span class="word">Edge</span></span>
        <span class="line"><span class="word">of</span> <span class="word grad">Manufacturing.</span></span>
      </h1>

      <p class="hero-lede">
        我是 <strong>赵祥生 (Apos)</strong>。山东科技大学软件工程在读,目前在青岛火一五信息科技做 Odoo ERP 二开与工业机器视觉。
        这里写工程、AI、产品、设计的长文笔记 — 没有 SEO 套话,只有真实的思考过程与可复用的工程经验。
      </p>

      <div class="hero-actions">
        <RouterLink class="btn btn-primary" to="/library">
          <span>浏览全部文章</span>
          <IconBase name="arrow-right" :size="14" />
        </RouterLink>
        <RouterLink class="btn btn-ghost" to="/guestbook">
          <span>留下脚印</span>
        </RouterLink>
      </div>

      <div class="hero-scroll">
        <span class="scroll-line"></span>
        <span class="scroll-text">SCROLL</span>
      </div>
    </section>

    <!-- LATEST 文章 -->
    <section class="section" id="latest">
      <header class="section-head">
        <span class="section-no reveal-up">01 / Latest</span>
        <h2 class="section-title reveal-up">最新文章</h2>
        <p class="section-sub reveal-up">长期主义的写作 · Quality &gt; Frequency.</p>
      </header>

      <div class="posts-grid">
        <RouterLink
          v-for="(p, i) in latest"
          :key="p.slug"
          :to="`/post/${p.slug}`"
          class="post-card reveal-up"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >
          <div class="post-meta">
            <span>{{ fmtDate(p.date) }}</span>
            <span class="post-tag">{{ p.tag }}</span>
            <span>{{ p.readTime }} min</span>
          </div>
          <h3>{{ p.title }}</h3>
          <p class="post-excerpt">{{ p.excerpt }}</p>
          <span class="post-read">
            <span>阅读全文</span>
            <IconBase name="arrow-right" :size="14" />
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- STACK 技能矩阵 -->
    <section class="section" id="stack">
      <header class="section-head">
        <span class="section-no reveal-up">02 / Stack</span>
        <h2 class="section-title reveal-up">技术栈</h2>
        <p class="section-sub reveal-up">3 年技术广度 + 半年制造业 ERP / 视觉深度。</p>
      </header>

      <div class="stack-grid">
        <article
          v-for="g in stack"
          :key="g.label"
          class="stack-group reveal-up"
        >
          <span class="stack-num">{{ g.no }}</span>
          <span class="stack-label">{{ g.label }}</span>
          <div class="chips">
            <span v-for="c in g.chips" :key="c" class="chip">{{ c }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- EXPERIENCE 工作经历 -->
    <section class="section" id="experience">
      <header class="section-head">
        <span class="section-no reveal-up">03 / Experience</span>
        <h2 class="section-title reveal-up">工作经历</h2>
        <p class="section-sub reveal-up">从前端到全栈,从软件到工业。</p>
      </header>

      <ul class="timeline">
        <li v-for="exp in experience" :key="exp.date" class="tl-item reveal-up">
          <span class="tl-date">{{ exp.date }}</span>
          <div class="tl-body">
            <h3 class="tl-title">{{ exp.role }} <em>· {{ exp.company }}</em></h3>
            <p v-for="(line, i) in exp.desc" :key="i" class="tl-desc">{{ line }}</p>
            <div class="tl-tags">
              <span v-for="t in exp.tags" :key="t" class="chip sm">{{ t }}</span>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- ARCHIVE 归档 -->
    <section class="section" id="archive">
      <header class="section-head">
        <span class="section-no reveal-up">04 / Archive</span>
        <h2 class="section-title reveal-up">全部归档</h2>
        <p class="section-sub reveal-up">按年份倒序。</p>
      </header>
      <div class="archive-list">
        <template v-for="[year, list] in archiveByYear" :key="year">
          <div class="archive-year reveal-up">{{ year }}</div>
          <RouterLink
            v-for="p in list"
            :key="p.slug"
            :to="`/post/${p.slug}`"
            class="archive-row reveal-up"
          >
            <span class="ar-date">{{ (p.date || '').slice(5) }}</span>
            <span class="ar-title">{{ p.title }}</span>
            <span class="ar-tag">{{ p.tag }}</span>
          </RouterLink>
        </template>
      </div>
    </section>

    <!-- ABOUT + 联系表单 -->
    <section class="section about-section" id="about">
      <div class="about-grid">
        <div class="about-side">
          <span class="section-no reveal-up">05 / About</span>
        </div>
        <div class="about-main">
          <h2 class="about-title reveal-up">
            我做<em>独立产品</em>,
            写关于<em>工程内在结构</em>的笔记,
            也偶尔聊聊<em>设计与品味</em>。
          </h2>
          <p class="about-body reveal-up">
            目前在构建制造业 ERP 与工业机器视觉系统。相信"少而精"的工程哲学:
            十年后还能跑的代码,比今天用尽花招的代码更值得写。
          </p>

          <div class="contact-grid reveal-up">
            <div class="contact-item">
              <span class="contact-label">邮箱</span>
              <a class="contact-value" href="mailto:2411447661@qq.com">2411447661@qq.com</a>
            </div>
            <div class="contact-item">
              <span class="contact-label">GitHub</span>
              <a class="contact-value" href="https://github.com/Apos-DT" target="_blank" rel="noopener">Apos-DT</a>
            </div>
            <div class="contact-item">
              <span class="contact-label">所在地</span>
              <span class="contact-value">青岛 · 山东</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">语言</span>
              <span class="contact-value">中文 / 英语 (CET-6)</span>
            </div>
          </div>

          <form class="contact-form reveal-up" @submit.prevent="submitContact" @reset.prevent="resetContact" novalidate>
            <fieldset>
              <legend>给我留言</legend>

              <div class="cf-grid">
                <label class="ui-field">
                  <span class="ui-field-label">称呼</span>
                  <input v-model="contactForm.name" class="ui-input" type="text" maxlength="40" placeholder="你的名字" />
                </label>
                <label class="ui-field">
                  <span class="ui-field-label">邮箱 <em>*</em></span>
                  <input v-model="contactForm.email" class="ui-input" type="email" placeholder="you@example.com" />
                </label>
                <label class="ui-field">
                  <span class="ui-field-label">主题</span>
                  <select v-model="contactForm.topic" class="ui-select">
                    <option>想合作</option>
                    <option>文章反馈</option>
                    <option>技术交流</option>
                    <option>其他</option>
                  </select>
                </label>
                <label class="ui-field">
                  <span class="ui-field-label">字数限额</span>
                  <div class="bar-row">
                    <meter class="ui-meter" min="0" max="300" low="200" high="280" optimum="100" :value="messageBytes"></meter>
                    <span class="bar-value">{{ messageBytes }} / 300</span>
                  </div>
                </label>
              </div>

              <label class="ui-field">
                <span class="ui-field-label">留言 <em>*</em></span>
                <textarea v-model="contactForm.message" class="ui-textarea" rows="4" maxlength="300" placeholder="一两句话,告诉我你想聊什么..."></textarea>
              </label>

              <label class="ui-check">
                <input v-model="contactForm.agree" type="checkbox" />
                <span>同意我将通过邮件回复你 <em>*</em></span>
              </label>

              <div class="form-actions">
                <span :class="['form-status', contactStatusKind]">{{ contactStatus }}</span>
                <button type="reset" class="ui-btn ui-btn-ghost">清空</button>
                <button type="submit" class="ui-btn ui-btn-primary">发送邮件</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-mark"></span>
          <span>APOS</span>
        </div>
        <div class="footer-meta">
          <span>© {{ yearEl }} 赵祥生 (Apos) · Crafted with care.</span>
          <span class="dot-sep">·</span>
          <span>Built with Vue 3 · Hosted on GitHub Pages</span>
        </div>
      </div>
      <div class="footer-mega" aria-hidden="true">APOS</div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  /* 全宽模式 — 不用三栏布局 */
  max-width: min(1280px, 92vw);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 56px);
}

/* ===== HERO — 紧凑布局,确保第一屏完整可见 ===== */
.hero {
  min-height: calc(100svh - var(--nav-h));
  /* 上 padding 紧贴 nav,下 padding 留下一屏滚动提示空间 */
  padding: clamp(32px, 5vh, 56px) 0 clamp(24px, 4vh, 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* 内容控制 max-height 避免大屏被拉得过开 */
  gap: 0;
}
.hero-meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: clamp(14px, 2vh, 22px);
}
.hero-meta .dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
  animation: hero-pulse 2.4s ease-in-out infinite;
}
@keyframes hero-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.hero-title {
  font-family: var(--font-display);
  /* 从 10vw / 160px 缩到 7vw / 96px,三行占用从 ~450px 缩到 ~280px */
  font-size: clamp(40px, 7vw, 96px);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.03em;
  margin: 0 0 clamp(18px, 2.5vh, 26px);
  color: var(--ink);
}
.hero-title .line {
  display: block;
  padding-right: 0.1em;
}
.hero-title .word {
  display: inline-block;
  transform: translateY(40%);
  opacity: 0;
  will-change: transform, opacity;
}
.hero-title .word.italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent-warm);
}
.hero-title .word.grad {
  background: linear-gradient(120deg, var(--accent) 0%, var(--accent-2) 60%, var(--accent-warm) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-lede {
  max-width: 680px;
  font-size: clamp(14px, 1.4vw, 16.5px);
  color: var(--ink-2);
  margin: 0 0 clamp(20px, 3vh, 32px);
  line-height: 1.65;
}
.hero-lede strong { color: var(--ink); font-weight: 600; }

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: clamp(28px, 4vh, 48px);
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 22px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  transition: transform 0.3s var(--ease-out), background 0.3s, color 0.3s, border-color 0.3s;
  border: 1px solid transparent;
}
.btn-primary { background: var(--ink); color: var(--bg-deep); }
.btn-primary:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }
.btn-ghost { background: transparent; color: var(--ink); border-color: var(--line); }
.btn-ghost:hover { border-color: var(--ink); transform: translateY(-2px); }

.hero-scroll {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--ink-3);
  text-transform: uppercase;
}
.scroll-line {
  width: 60px;
  height: 1px;
  background: var(--ink-3);
  position: relative;
  overflow: hidden;
}
.scroll-line::after {
  content: "";
  position: absolute;
  left: -60%; top: 0;
  width: 60%; height: 100%;
  background: var(--ink);
  animation: scroll-slide 2.4s var(--ease-inout) infinite;
}
@keyframes scroll-slide {
  0% { left: -60%; }
  60%, 100% { left: 100%; }
}

/* ===== Section 通用 ===== */
.section {
  padding: clamp(60px, 12vh, 120px) 0;
}
.section-head { margin-bottom: 60px; }
.section-no {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 18px;
}
.section-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(32px, 5vw, 60px);
  letter-spacing: -0.025em;
  line-height: 1;
  margin: 0 0 14px;
}
.section-sub {
  font-size: 15px;
  color: var(--ink-2);
  margin: 0;
  max-width: 560px;
}

/* ===== Posts Grid ===== */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
  gap: 24px;
}
.post-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 30px;
  border-radius: 20px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg,
              oklch(0.87 0.010 280 / 0.55),
              oklch(0.93 0.008 280 / 0.4));
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.5s var(--ease-out), border-color 0.5s;
  min-height: 300px;
  color: inherit;
}
.post-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 0%),
              oklch(0.50 0.22 295 / 0.22), transparent 40%);
  opacity: 0;
  transition: opacity 0.5s;
  z-index: -1;
}
.post-card:hover { transform: translateY(-6px); border-color: var(--line); }
.post-card:hover::before { opacity: 1; }
.post-card .post-meta {
  display: flex;
  gap: 14px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 20px;
}
.post-card .post-tag {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--ink-2);
}
.post-card h3 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.2;
  letter-spacing: -0.015em;
  margin: 0 0 14px;
}
.post-card .post-excerpt {
  color: var(--ink-2);
  font-size: 14.5px;
  line-height: 1.65;
  margin: 0 0 auto;
  padding-bottom: 24px;
}
.post-card .post-read {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  margin-top: auto;
}
.post-card .post-read svg { transition: transform 0.3s var(--ease-out); }
.post-card:hover .post-read svg { transform: translateX(6px); }

/* ===== Stack ===== */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 20px;
}
.stack-group {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 26px 24px;
  border-radius: 18px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg,
              oklch(0.87 0.010 280 / 0.5),
              oklch(0.93 0.008 280 / 0.3));
  min-height: 210px;
  transition: border-color 0.5s, transform 0.5s var(--ease-out);
}
.stack-group:hover {
  border-color: var(--line);
  transform: translateY(-4px);
}
.stack-num {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--ink-3);
  margin-bottom: 10px;
  opacity: 0.7;
}
.stack-label {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 17px;
  color: var(--ink);
  margin-bottom: 20px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}
.chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: oklch(0.93 0.008 280 / 0.5);
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1;
  color: var(--ink-2);
  white-space: nowrap;
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}
.chip:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: oklch(0.88 0.05 295 / 0.4);
}
.chip.sm { padding: 4px 9px; font-size: 10.5px; }

/* ===== Experience ===== */
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}
.timeline::before {
  content: "";
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 7px;
  width: 1px;
  background: linear-gradient(180deg, var(--line), transparent);
}
.tl-item {
  position: relative;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  padding: 0 0 40px 32px;
}
.tl-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--accent);
  box-shadow: 0 0 14px oklch(0.50 0.22 295 / 0.5);
}
.tl-item:last-child { padding-bottom: 0; }
.tl-date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
  padding-top: 4px;
}
.tl-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(18px, 2vw, 22px);
  margin: 0 0 10px;
  color: var(--ink);
}
.tl-title em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--accent-warm);
  font-weight: 400;
}
.tl-desc {
  color: var(--ink-2);
  font-size: 14.5px;
  line-height: 1.7;
  margin: 0 0 8px;
}
.tl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
@media (max-width: 720px) {
  .tl-item { grid-template-columns: 1fr; gap: 8px; padding-left: 28px; }
}

/* ===== Archive ===== */
.archive-list { display: flex; flex-direction: column; }
.archive-year {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(36px, 5vw, 72px);
  color: var(--ink-3);
  margin: 50px 0 14px;
  line-height: 1;
}
.archive-row {
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 24px;
  align-items: baseline;
  padding: 18px 4px;
  border-top: 1px solid var(--line-soft);
  color: inherit;
  transition: padding 0.4s var(--ease-out);
}
.archive-row:last-of-type { border-bottom: 1px solid var(--line-soft); }
.archive-row:hover { padding-left: 18px; }
.archive-row .ar-date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
}
.archive-row .ar-title {
  font-family: var(--font-display);
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 500;
  transition: color 0.3s;
}
.archive-row:hover .ar-title { color: var(--accent); }
.archive-row .ar-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

/* ===== About ===== */
.about-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 60px;
}
@media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; gap: 24px; } }
.about-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(26px, 3.6vw, 42px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 28px;
}
.about-title em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--accent-warm);
  font-weight: 400;
}
.about-body {
  color: var(--ink-2);
  font-size: 16px;
  line-height: 1.8;
  max-width: 640px;
  margin: 0 0 28px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}
.contact-item {
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid var(--line-soft);
  background: oklch(0.93 0.008 280 / 0.45);
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.contact-item:hover { border-color: var(--line); transform: translateY(-2px); }
.contact-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 8px;
}
.contact-value {
  display: block;
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--ink);
}
a.contact-value:hover { color: var(--accent); }

/* contact-form */
.contact-form fieldset {
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  padding: 20px 22px 22px;
  background: oklch(0.90 0.010 280 / 0.3);
}
.contact-form legend {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--accent);
  padding: 0 10px;
  background: var(--bg);
  text-transform: uppercase;
}
.cf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 14px 22px;
  margin-bottom: 18px;
}
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ui-field-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.ui-field-label em {
  color: var(--error);
  font-style: normal;
  margin-left: 2px;
}
.ui-input, .ui-select, .ui-textarea {
  width: 100%;
  background: oklch(0.97 0.005 280 / 0.7);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--ink);
  font: inherit;
  transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
}
.ui-textarea { resize: vertical; min-height: 100px; font-family: var(--font-body); line-height: 1.6; }
.ui-input:hover, .ui-select:hover, .ui-textarea:hover { border-color: var(--ink-3); }
.ui-input:focus, .ui-select:focus, .ui-textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.55);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.18);
}
.ui-select {
  appearance: none;
  -webkit-appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--ink-2) 50%),
    linear-gradient(135deg, var(--ink-2) 50%, transparent 50%);
  background-position:
    calc(100% - 18px) 50%,
    calc(100% - 13px) 50%;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  padding-right: 36px;
  cursor: pointer;
}
.bar-row { display: flex; align-items: center; gap: 12px; }
.bar-value { font-family: var(--font-mono); font-size: 12px; color: var(--ink-2); min-width: 56px; text-align: right; }
.ui-meter {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border: 0;
  border-radius: 999px;
  background: oklch(0.87 0.010 280 / 0.7);
  overflow: hidden;
}
.ui-meter::-webkit-meter-bar {
  background: oklch(0.87 0.010 280 / 0.7);
  border-radius: 999px;
}
.ui-meter::-webkit-meter-optimum-value {
  background: linear-gradient(90deg, var(--success), oklch(0.55 0.16 130));
  border-radius: 999px;
}
.ui-meter::-webkit-meter-suboptimum-value {
  background: linear-gradient(90deg, var(--accent-warm), oklch(0.58 0.18 40));
  border-radius: 999px;
}
.ui-meter::-webkit-meter-even-less-good-value {
  background: linear-gradient(90deg, var(--error), oklch(0.50 0.20 25));
  border-radius: 999px;
}

.ui-check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0 18px;
  font-size: 13.5px;
  color: var(--ink-2);
  cursor: pointer;
}
.ui-check em { color: var(--error); font-style: normal; margin-left: 2px; }
.ui-check input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: oklch(0.97 0.005 280 / 0.7);
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s, background 0.3s;
}
.ui-check input[type="checkbox"]:checked {
  background: var(--accent);
  border-color: var(--accent);
}
.ui-check input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 5px; top: 1px;
  width: 5px; height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.form-status {
  margin-right: auto;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
}
.form-status.ok { color: var(--success); }
.form-status.err { color: var(--error); }

.ui-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: transform 0.3s var(--ease-out), background 0.3s, color 0.3s, border-color 0.3s;
}
.ui-btn-primary { background: var(--ink); color: var(--bg-deep); }
.ui-btn-primary:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }
.ui-btn-ghost { background: transparent; color: var(--ink-2); border-color: var(--line); }
.ui-btn-ghost:hover { color: var(--ink); border-color: var(--ink-3); transform: translateY(-2px); }

/* ===== Footer ===== */
.home-footer {
  position: relative;
  margin-top: clamp(60px, 10vh, 100px);
  padding: 50px 0 0;
  border-top: 1px solid var(--line-soft);
  overflow: hidden;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 40px;
}
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.06em;
}
.brand-mark {
  width: 14px; height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--accent), oklch(0.55 0.20 295));
  box-shadow: 0 0 0 1px var(--line), 0 0 20px var(--accent);
}
.footer-meta {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
}
.dot-sep { color: var(--ink-3); }
.footer-mega {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(100px, 22vw, 320px);
  letter-spacing: -0.04em;
  line-height: 0.8;
  text-align: center;
  background: linear-gradient(180deg, oklch(0.78 0.10 295 / 0.45), transparent 75%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 auto -0.18em;
  user-select: none;
  pointer-events: none;
}

/* ===== reveal ===== */
.reveal-up { opacity: 0; transform: translateY(24px); transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
.reveal-up.in { opacity: 1; transform: none; }
</style>
