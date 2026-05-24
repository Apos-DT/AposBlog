<script setup>
/**
 * HomeView — 博客首页(原 index.html 的 Vue 化)
 * 包含: Hero / Latest 文章 / Stack 技能 / Experience 经历 / About 联系表单
 * 所有动效统一由 onMounted 触发 GSAP / IntersectionObserver
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const posts = usePostsStore()
const notesStore = useNotesStore()
const tagsStore = useTagsStore()
const settings = useSettingsStore()

// hero 顶部装饰用编辑期号 — 月份生成
const issueLabel = computed(() => {
  const d = new Date()
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const issueNo = String((d.getFullYear() - 2024) * 12 + d.getMonth() + 1).padStart(2, '0')
  return `ISSUE ${issueNo} · ${months[d.getMonth()]} ${d.getFullYear()}`
})
const latestPost = computed(() => posts.sorted[0] || null)

const heroEl = ref(null)
const heroTitleEl = ref(null)
const megaEl = ref(null)
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

  // hero 标题 — 流光填充 + 鼠标 spotlight
  initHeroSpotlight()

  // 底部 APOS 大字 — Canvas 粒子 + 鼠标力场
  initFooterMega()
})

// ============================================================
// Footer APOS — 最简版:单 canvas + 粒子拼字 + 鼠标力场
//   ~800 粒子构成 APOS 字形,verlet 物理弹簧拉回 + 阻尼 + 漂浮
//   鼠标 60px 力场推开,粒子高亮 + 柔光晕
//   IntersectionObserver 控制 rAF 启停,出视口暂停
// ============================================================
let megaCleanup = null

function initFooterMega() {
  const el = megaEl.value
  if (!el) return

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('static')
    return
  }

  const canvas = document.createElement('canvas')
  canvas.className = 'footer-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  el.appendChild(canvas)
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })

  let dpr = 1
  let W = 0, H = 0
  let cssW = 0, cssH = 0
  let particles = []
  const mouse = { x: -9999, y: -9999, active: false }
  let raf = 0
  let visible = false
  let entered = false
  let revealStart = 0
  let needsRender = true

  function sampleText() {
    const off = document.createElement('canvas')
    const octx = off.getContext('2d')
    const fontStack = '"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif'
    const measureSize = 200
    octx.font = `900 ${measureSize}px ${fontStack}`
    const w0 = octx.measureText('APOS').width
    const fontSize = Math.min(measureSize * (cssW * 0.92) / w0, cssH * 0.95)

    octx.font = `900 ${fontSize}px ${fontStack}`
    const m = octx.measureText('APOS')
    const ascent = m.actualBoundingBoxAscent || fontSize * 0.78
    const descent = m.actualBoundingBoxDescent || fontSize * 0.22
    const textW = Math.ceil(m.width)
    const textH = Math.ceil(ascent + descent)

    off.width = textW + 4
    off.height = textH + 4
    const ctx2 = off.getContext('2d')
    ctx2.font = `900 ${fontSize}px ${fontStack}`
    ctx2.fillStyle = '#000'
    ctx2.textBaseline = 'alphabetic'
    ctx2.fillText('APOS', 2, ascent + 2)

    const img = ctx2.getImageData(0, 0, off.width, off.height)
    const data = img.data

    const isMobile = cssW < 640
    const step = isMobile ? 7 : 5
    const xOff = (cssW - off.width) / 2
    const yOff = (cssH - off.height) / 2

    const arr = []
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          const hx = (xOff + x) * dpr
          const hy = (yOff + y) * dpr
          const angle = Math.random() * Math.PI * 2
          const dist = (180 + Math.random() * 260) * dpr
          arr.push({
            x: hx + Math.cos(angle) * dist,
            y: hy + Math.sin(angle) * dist - 60 * dpr,
            hx, hy,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: (1.2 + Math.random()) * dpr,
            seed: Math.random() * Math.PI * 2,
            hueShift: (Math.random() - 0.5) * 28,
            lit: 0,
          })
        }
      }
    }
    particles = arr
  }

  function resize() {
    const rect = el.getBoundingClientRect()
    cssW = rect.width
    cssH = rect.height
    if (cssW < 10 || cssH < 10) {
      requestAnimationFrame(resize)
      return
    }
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.ceil(cssW * dpr)
    canvas.height = Math.ceil(cssH * dpr)
    canvas.style.width = cssW + 'px'
    canvas.style.height = cssH + 'px'
    W = canvas.width
    H = canvas.height
    sampleText()
    needsRender = true
  }

  const FORCE_R = 60
  const SPRING = 0.018
  const DAMPING = 0.86

  function tick(now) {
    if (!visible) {
      raf = 0
      return
    }
    const mx = mouse.x * dpr
    const my = mouse.y * dpr
    const forceR = FORCE_R * dpr
    const forceR2 = forceR * forceR
    const time = now * 0.0008

    let intro = 1
    if (revealStart > 0) {
      intro = Math.min(1, (now - revealStart) / 1800)
      if (intro < 1) needsRender = true
    }

    ctx.clearRect(0, 0, W, H)
    let movingAny = false

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dxh = p.hx - p.x
      const dyh = p.hy - p.y
      p.vx += dxh * SPRING
      p.vy += dyh * SPRING

      if (mouse.active) {
        const dx = p.x - mx
        const dy = p.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < forceR2 && d2 > 0.5) {
          const d = Math.sqrt(d2)
          const f = 1 - d / forceR
          const force = f * f * 22
          const invD = 1 / d
          p.vx += dx * invD * force
          p.vy += dy * invD * force
          if (f > p.lit) p.lit = f
        }
      }

      p.vx *= DAMPING
      p.vy *= DAMPING
      p.vx += Math.sin(time + p.seed) * 0.08
      p.vy += Math.cos(time * 0.7 + p.seed * 1.3) * 0.06
      p.x += p.vx
      p.y += p.vy
      p.lit *= 0.9

      const speed2 = p.vx * p.vx + p.vy * p.vy
      if (speed2 > 0.04 || p.lit > 0.01 || dxh * dxh + dyh * dyh > 0.5) {
        movingAny = true
      }

      const hue = 282 + p.hueShift + p.lit * 18
      const sat = 70 + p.lit * 15
      const light = 55 + p.lit * 18
      const alpha = (0.55 + p.lit * 0.4) * intro
      const radius = p.r * (1 + p.lit * 1.3)

      if (p.lit > 0.18) {
        ctx.fillStyle = `hsla(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light.toFixed(0)}%, ${(alpha * 0.32).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 3.4, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = `hsla(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light.toFixed(0)}%, ${alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    needsRender = movingAny || mouse.active || intro < 1

    if (needsRender) {
      raf = requestAnimationFrame(tick)
    } else {
      raf = 0
    }
  }

  function ensureRunning() {
    if (!raf && visible) {
      needsRender = true
      raf = requestAnimationFrame(tick)
    }
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          visible = true
          if (!entered) {
            entered = true
            revealStart = performance.now()
          }
          ensureRunning()
        } else {
          visible = false
        }
      })
    },
    { threshold: 0.05 }
  )
  obs.observe(el)

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    mouse.active = true
    el.style.setProperty('--mx', mouse.x + 'px')
    el.style.setProperty('--my', mouse.y + 'px')
    ensureRunning()
  }
  function onLeave() {
    mouse.active = false
    mouse.x = -9999
    mouse.y = -9999
    ensureRunning()
  }
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  let resizeRaf = 0
  function onResize() {
    cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => {
      resize()
      ensureRunning()
    })
  }
  window.addEventListener('resize', onResize)

  resize()

  megaCleanup = () => {
    obs.disconnect()
    cancelAnimationFrame(raf)
    cancelAnimationFrame(resizeRaf)
    window.removeEventListener('resize', onResize)
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
  }
}

// hero 标题:真实 CSS 文字 + 鼠标 spotlight(JS 只 setProperty,无 RAF 物理)
//   入场 / 流光 / hover 抬起全 CSS keyframe + animation-delay var(--i) 实现
let heroSpotlightCleanup = null

function initHeroSpotlight() {
  const el = heroTitleEl.value
  if (!el) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let mx = 0
  let my = 0
  let pending = false

  function flush() {
    el.style.setProperty('--mx', mx + 'px')
    el.style.setProperty('--my', my + 'px')
    pending = false
  }

  function onMove(e) {
    const rect = el.getBoundingClientRect()
    mx = e.clientX - rect.left
    my = e.clientY - rect.top
    if (!pending) {
      pending = true
      requestAnimationFrame(flush)
    }
  }

  el.addEventListener('mousemove', onMove)

  heroSpotlightCleanup = () => {
    el.removeEventListener('mousemove', onMove)
  }
}

onBeforeUnmount(() => {
  if (megaCleanup) megaCleanup()
  if (heroSpotlightCleanup) heroSpotlightCleanup()
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
    <!-- HERO — 编辑/杂志风 巨型标题 + 实时 metadata strip -->
    <section ref="heroEl" class="hero" id="hero">
      <!-- 报刊感顶部 strip:期号 / tagline / 系统时间 -->
      <div class="hero-eyebrow">
        <span class="eyebrow-issue">{{ issueLabel }}</span>
        <span class="eyebrow-line"></span>
        <span class="eyebrow-tag">WRITING · BUILDING · THINKING</span>
        <span class="eyebrow-line eyebrow-line-flex"></span>
        <span class="eyebrow-since">SINCE 2024</span>
      </div>

      <!-- 巨型标题 — 多行编辑感断行 -->
      <h1 ref="heroTitleEl" class="hero-title">
        <span class="line">
          <span class="word" style="--i: 0">Building</span>
          <span class="word" style="--i: 1">at</span>
        </span>
        <span class="line">
          <span class="word italic" style="--i: 2">the</span>
          <span class="word" style="--i: 3">Edge</span>
        </span>
        <span class="line">
          <span class="word" style="--i: 4">of</span>
          <span class="word grad" style="--i: 5">Manufacturing.</span>
        </span>
      </h1>

      <div class="hero-actions">
        <RouterLink class="btn btn-primary" to="/library">
          <span>浏览全部文章</span>
          <IconBase name="arrow-right" :size="14" />
        </RouterLink>
        <RouterLink class="btn btn-ghost" to="/guestbook">
          <span>留下脚印</span>
        </RouterLink>
        <RouterLink class="btn btn-ghost" to="/portfolio">
          <span>作品集</span>
        </RouterLink>
      </div>

      <!-- 实时 metadata strip:NOW / 统计 / 最新一篇 -->
      <div class="hero-strip">
        <div class="strip-cell strip-now">
          <span class="dot live"></span>
          <div class="strip-text">
            <div class="strip-label">CURRENTLY</div>
            <div class="strip-value">Odoo ERP · 工业机器视觉</div>
          </div>
        </div>

        <div class="strip-divider"></div>

        <div class="strip-cell">
          <div class="strip-num">{{ posts.posts.length }}</div>
          <div class="strip-label">POSTS</div>
        </div>

        <div class="strip-divider"></div>

        <div class="strip-cell">
          <div class="strip-num">{{ notesStore.stats.total }}</div>
          <div class="strip-label">NOTES</div>
        </div>

        <div class="strip-divider"></div>

        <div class="strip-cell">
          <div class="strip-num">{{ tagsStore.all.length }}</div>
          <div class="strip-label">TAGS</div>
        </div>

        <div class="strip-divider"></div>

        <RouterLink
          v-if="latestPost"
          class="strip-cell strip-latest"
          :to="`/posts/${latestPost.slug}`"
        >
          <div class="strip-text">
            <div class="strip-label">LATEST POST →</div>
            <div class="strip-value strip-latest-title">{{ latestPost.title }}</div>
          </div>
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
      <div ref="megaEl" class="footer-mega" aria-hidden="true">
        <span class="footer-text">APOS</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  /* trae 风:容器加宽,左右更接近 viewport,边界不明显 */
  max-width: min(1320px, calc(100% - 32px));
  margin: 0 auto;
  padding: 0 clamp(24px, 4vw, 64px);
}

/* ===== HERO — 编辑/杂志风,巨型字 + 实时 metadata strip 占满首屏 ===== */
.hero {
  position: relative;
  min-height: calc(100svh - var(--nav-h));
  /* 上下 padding 收紧 — 100% 缩放下完整可见 */
  padding: clamp(20px, 3.5vh, 44px) 0 clamp(16px, 2.5vh, 30px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0;
}
/* 全宽双色光晕 — 突破 home-page 的 max-width 约束,
   背景延伸到 viewport 两侧,消除"内容边界感" */
.hero::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100%;
  pointer-events: none;
  background:
    radial-gradient(ellipse 55% 45% at 20% 25%, oklch(0.50 0.22 295 / 0.12), transparent 60%),
    radial-gradient(ellipse 45% 45% at 85% 75%, oklch(0.60 0.18 220 / 0.10), transparent 60%);
  z-index: -1;
}

/* ===== 顶部编辑期号条 — 报刊感分隔线 + ISSUE 标签 ===== */
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.4vw, 18px);
  margin-bottom: clamp(14px, 2.2vh, 22px);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.eyebrow-issue {
  color: var(--accent);
  font-weight: 600;
}
.eyebrow-tag {
  white-space: nowrap;
}
.eyebrow-line {
  width: clamp(24px, 4vw, 60px);
  height: 1px;
  background: var(--line);
}
.eyebrow-line-flex {
  flex: 1;
  max-width: 240px;
}
.eyebrow-since {
  color: var(--ink-3);
}

@media (max-width: 720px) {
  .hero-eyebrow {
    flex-wrap: wrap;
    font-size: 10px;
  }
  .eyebrow-line-flex { display: none; }
}

/* ===== Hero 标题 — 真实 CSS 文字 + 流光填充 + 鼠标 spotlight =====
   设计:
     - 文字本身用 background-clip:text + 流动渐变 → 永远清晰可读
     - 鼠标位置注入 --mx/--my,::before radial 高光跟随
     - 入场:逐 word blur→clear 滑入(CSS animation-delay var(--i))
     - hover word:抬起 + 高亮锁定(光在该词停住)
   ============================================================ */
.hero-title {
  position: relative;
  font-family: var(--font-display);
  /* 巨型字但克制 — 1080p 100% 缩放下三行 ~360px 高,完整可见 */
  font-size: clamp(46px, 8.5vw, 120px);
  font-weight: 700;
  /* line-height 1.1 — 释放 descender 空间(g/y/p 的下伸尾不被裁) */
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0 0 clamp(20px, 2.8vh, 32px);
  color: var(--ink);
  isolation: isolate;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 跟随鼠标的 radial spotlight,mix-blend lighten 在浅底变明亮 */
.hero-title::before {
  content: "";
  position: absolute;
  left: var(--mx, 30%);
  top: var(--my, 50%);
  width: clamp(260px, 28vw, 420px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(0.62 0.27 295 / 0.45) 0%,
    oklch(0.68 0.22 230 / 0.25) 35%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  filter: blur(50px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s var(--ease-out);
  z-index: -1;
}
.hero-title:hover::before { opacity: 1; }

.hero-title .line {
  display: block;
  padding-right: 0.05em;
}

.hero-title .word {
  display: inline-block;
  position: relative;
  margin-right: 0.18em;
  /* descender 保护:padding-bottom 把 background-clip:text 的 paint box 撑大,
     让 Space Grotesk 的 g/y/p 等下伸尾不被裁 */
  padding-bottom: 0.06em;
  overflow: visible;
  /* 流光填充:深墨色背景上有一道高光带,缓慢扫过 */
  background-image: linear-gradient(
    100deg,
    var(--ink) 0%,
    var(--ink) 42%,
    oklch(0.55 0.27 295) 50%,
    oklch(0.60 0.22 250) 58%,
    var(--ink) 66%,
    var(--ink) 100%
  );
  background-size: 300% 100%;
  background-position: 100% 0;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  /* 入场初态 */
  opacity: 0;
  transform: translateY(58%) scale(0.96);
  filter: blur(10px);
  will-change: transform, opacity, filter;

  animation:
    hero-word-in 1.1s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 0) * 90ms + 200ms) forwards,
    hero-shimmer 7s ease-in-out calc(var(--i, 0) * 200ms + 1500ms) infinite;

  transition: transform 0.4s var(--ease-out), filter 0.4s var(--ease-out);
}

@keyframes hero-word-in {
  0% {
    opacity: 0;
    transform: translateY(58%) scale(0.96);
    filter: blur(10px);
  }
  60% {
    opacity: 1;
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
/* 高光带在文字间扫过:开始/结束 = 暗,中段 = 高光从右往左划过 */
@keyframes hero-shimmer {
  0%, 35%, 100% { background-position: 100% 0; }
  60% { background-position: 0% 0; }
}

/* hover word:抬起 + 缩放 + 加阴影 + 锁定高光 */
.hero-title .word:hover {
  transform: translateY(-6px) scale(1.03);
  filter: drop-shadow(0 12px 28px oklch(0.55 0.28 295 / 0.4));
  background-position: 35% 0;
  animation-play-state: running, paused;
}

/* italic 字 —— 暖琥珀色,有自己的流光循环
   Fraunces variable serif 的 italic 字形(e/y/g)有显著的右下卷尾,
   超出字符 advance box。background-clip:text 只裁到 padding-box,
   所以用 padding 把可绘制区域撑大,确保字尾被完整 paint。
   margin-right 重置为 0,改用 padding-right 充当与下一 word 的间距。 */
.hero-title .word.italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  /* padding 顺序:上 右 下 左 — 顶部 cap 余 / 右侧大量缓冲 / 底部 descender / 左侧不动 */
  padding: 0.06em 0.22em 0.14em 0.04em;
  margin-right: 0;
  background-image: linear-gradient(
    100deg,
    var(--accent-warm) 0%,
    var(--accent-warm) 45%,
    oklch(0.80 0.18 50) 55%,
    var(--accent-warm) 65%,
    var(--accent-warm) 100%
  );
  background-size: 300% 100%;
  background-position: 100% 0;
}

/* grad 字 —— 完整渐变循环移动,本身就是一道流动彩虹 */
.hero-title .word.grad {
  background-image: linear-gradient(
    100deg,
    var(--accent) 0%,
    var(--accent-2) 35%,
    var(--accent-warm) 65%,
    var(--accent) 100%
  );
  background-size: 250% 100%;
  background-position: 0 0;
  animation:
    hero-word-in 1.1s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 0) * 90ms + 200ms) forwards,
    hero-grad-flow 5s ease-in-out calc(var(--i, 0) * 200ms + 1500ms) infinite;
}
@keyframes hero-grad-flow {
  0%, 100% { background-position: 0 0; }
  50% { background-position: 100% 0; }
}

/* 粒子 canvas(footer 用) */
.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: clamp(20px, 3vh, 32px);
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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

/* ===== Hero 底部实时 metadata strip — Linear/Vercel 风信息条 ===== */
.hero-strip {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-bottom: clamp(14px, 2vh, 24px);
  padding: clamp(8px, 1vh, 14px) clamp(16px, 1.6vw, 22px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg,
    oklch(0.97 0.005 280 / 0.4),
    oklch(0.97 0.005 280 / 0.15));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: var(--font-mono);
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  animation: hero-strip-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards;
}
@keyframes hero-strip-in {
  to { opacity: 1; transform: translateY(0); }
}

.strip-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px clamp(12px, 1.4vw, 22px);
  min-height: 38px;
  color: var(--ink-2);
  transition: color 0.3s;
}
.strip-cell.strip-now {
  flex: 0 0 auto;
}
.strip-cell.strip-latest {
  flex: 1 1 0;
  min-width: 180px;
  padding-right: 6px;
  transition: transform 0.3s var(--ease-out), color 0.3s;
}
.strip-cell.strip-latest:hover {
  color: var(--accent);
  transform: translateX(4px);
}
.strip-cell.strip-latest:hover .strip-label { color: var(--accent); }

.strip-divider {
  width: 1px;
  background: var(--line-soft);
  align-self: stretch;
  flex-shrink: 0;
}

.strip-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.strip-num {
  font-family: var(--font-display);
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 600;
  color: var(--ink);
  line-height: 1;
  letter-spacing: -0.02em;
}

.strip-label {
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-3);
  font-weight: 500;
  transition: color 0.3s;
}

.strip-value {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink);
  font-weight: 500;
  margin-top: 1px;
}
.strip-latest-title {
  font-family: var(--font-display);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.strip-cell .dot.live {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--success, oklch(0.65 0.18 145));
  box-shadow: 0 0 12px var(--success, oklch(0.65 0.18 145));
  animation: strip-pulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes strip-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

@media (max-width: 900px) {
  .hero-strip {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 16px;
  }
  .strip-cell {
    padding: 12px 8px;
    min-height: 0;
  }
  .strip-divider {
    width: 100%;
    height: 1px;
  }
  .strip-latest { padding-right: 8px; }
}

/* ===== 手机端整体调整 ===== */
@media (max-width: 600px) {
  .home-page {
    padding: 0 16px;
  }
  .hero {
    padding: 14px 0 14px;
    /* 手机端 hero 不强求 100vh,避免巨型字撑过头 */
    min-height: auto;
  }
  .hero-title {
    font-size: clamp(38px, 11vw, 72px);
    margin-bottom: 18px;
  }
  /* 手机端 hero word 入场幅度小点,blur 也轻 */
  .hero-title .word {
    transform: translateY(40%) scale(0.97);
    filter: blur(6px);
  }
  .hero-actions {
    margin-bottom: 16px;
  }
  .btn {
    padding: 10px 16px;
    font-size: 12.5px;
  }
  .strip-num { font-size: 18px; }
  .strip-label { font-size: 9px; }
  .strip-value { font-size: 11px; }
  .strip-latest-title { font-size: 12px; }
}
/* 超窄屏 — iPhone SE 等 */
@media (max-width: 380px) {
  .hero-title {
    font-size: clamp(34px, 13vw, 60px);
    line-height: 1.0;
  }
  .hero-eyebrow {
    font-size: 9.5px;
  }
}

.hero-scroll {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--ink-3);
  text-transform: uppercase;
}
.scroll-line {
  width: 50px;
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
  overflow: hidden;
}
/* 全宽 border-top — 突破 home-page 的 max-width 延伸到 viewport */
.home-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    var(--line) 20%,
    var(--line) 80%,
    transparent
  );
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
/* ===== Footer APOS — 最简版:单 canvas 粒子拼字 + 鼠标光斑 ===== */
.footer-mega {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 1;
  max-height: 380px;
  min-height: 160px;
  margin: 0 auto -2vw;
  user-select: none;
  cursor: default;
  overflow: visible;
  isolation: isolate;
}

/* 鼠标光斑 — 容器内 ::before 跟随鼠标 */
.footer-mega::before {
  content: "";
  position: absolute;
  left: var(--mx, 50%);
  top: var(--my, 50%);
  width: clamp(280px, 40vw, 600px);
  height: clamp(280px, 40vw, 600px);
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    oklch(0.58 0.27 295 / 0.45),
    oklch(0.65 0.22 220 / 0.22) 35%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  filter: blur(48px);
  transition: opacity 0.5s var(--ease-out);
  z-index: 0;
}
.footer-mega:hover::before { opacity: 1; }

/* 粒子 canvas */
.footer-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* reduced-motion 降级 — 显示真实 CSS 文字 */
.footer-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(100px, 22vw, 320px);
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(
    180deg,
    oklch(0.50 0.25 295 / 0.90) 0%,
    oklch(0.58 0.22 280 / 0.65) 40%,
    oklch(0.75 0.12 295 / 0.32) 75%,
    transparent 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  pointer-events: none;
  opacity: 0;
}
.footer-mega.static .footer-text { opacity: 1; }

/* ===== reveal ===== */
.reveal-up { opacity: 0; transform: translateY(24px); transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
.reveal-up.in { opacity: 1; transform: none; }
</style>
