<script setup>
/**
 * PlaygroundView — CSS3 / HTML5 工具间
 * 简化版,聚焦"博客里实际用到的组件展示"
 *  - 按钮 / 卡片 / 列表(:nth-child 斑马)
 *  - 表单(fieldset/legend/input/select/progress/meter/checkbox)
 *  - Canvas 画板
 *  - SVG 图形 + hover
 *  - 视频 / 音频
 *  - 拖放上传 + 文件预览
 *  - 地理定位
 *  - Alert / Toast
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const settings = useSettingsStore()

// ===== Canvas =====
const canvasEl = ref(null)
const paintColor = ref('#a78bfa')
const paintSize = ref(3)
let canvasCleanup = null

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let drawing = false
  let last = null
  const pos = (e) => {
    const r = canvas.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: ((cx - r.left) * canvas.width) / r.width,
      y: ((cy - r.top) * canvas.height) / r.height,
    }
  }
  const start = (e) => { drawing = true; last = pos(e) }
  const move = (e) => {
    if (!drawing) return
    const p = pos(e)
    ctx.strokeStyle = paintColor.value
    ctx.lineWidth = parseInt(paintSize.value, 10)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last = p
  }
  const end = () => { drawing = false }
  canvas.addEventListener('mousedown', start)
  canvas.addEventListener('mousemove', move)
  canvas.addEventListener('mouseup', end)
  canvas.addEventListener('mouseleave', end)
  canvas.addEventListener('touchstart', start, { passive: true })
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e) }, { passive: false })
  canvas.addEventListener('touchend', end)

  canvasCleanup = () => {
    canvas.removeEventListener('mousedown', start)
    canvas.removeEventListener('mousemove', move)
    canvas.removeEventListener('mouseup', end)
    canvas.removeEventListener('mouseleave', end)
  }
})

onBeforeUnmount(() => {
  if (canvasCleanup) canvasCleanup()
})

function clearCanvas() {
  const c = canvasEl.value
  if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height)
}

// ===== 表单 demo =====
const formData = ref({
  name: '',
  email: '',
  role: 'frontend',
  rating: 7,
  progress: 68,
  agree: false,
})
const formStatus = ref('')

function progressDemo() {
  formData.value.progress = 0
  const t = setInterval(() => {
    formData.value.progress += 4 + Math.random() * 6
    if (formData.value.progress >= 100) {
      formData.value.progress = 100
      clearInterval(t)
    }
  }, 80)
}

function submitDemo() {
  formStatus.value = '✓ 已提交'
  settings.pushToast('success', '表单提交成功')
}

// ===== 文件上传 =====
const files = ref([])
const dropZoneActive = ref(false)
const fileInputEl = ref(null)

function onDrop(e) {
  dropZoneActive.value = false
  addFiles(e.dataTransfer.files)
}
function onPick(e) {
  addFiles(e.target.files)
  e.target.value = ''
}
function addFiles(list) {
  Array.from(list || []).forEach((f) => {
    const obj = {
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    }
    files.value.push(obj)
  })
}
function removeFile(id) {
  const i = files.value.findIndex((f) => f.id === id)
  if (i >= 0) {
    if (files.value[i].url) URL.revokeObjectURL(files.value[i].url)
    files.value.splice(i, 1)
  }
}
function formatBytes(n) {
  if (n < 1024) return n + ' B'
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB'
  return (n / 1048576).toFixed(2) + ' MB'
}

// ===== 地理定位 =====
const geo = ref({
  status: '未获取',
  statusClass: '',
  lat: '—',
  lng: '—',
  acc: '—',
})

function getLocation() {
  geo.value.status = '获取中…'
  geo.value.statusClass = 'loading'
  if (!('geolocation' in navigator)) {
    geo.value.status = '浏览器不支持'
    geo.value.statusClass = 'err'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (p) => {
      geo.value.lat = p.coords.latitude.toFixed(6) + '°'
      geo.value.lng = p.coords.longitude.toFixed(6) + '°'
      geo.value.acc = '±' + p.coords.accuracy.toFixed(0) + ' m'
      geo.value.status = '已获取'
      geo.value.statusClass = 'ok'
      settings.pushToast('success', '位置已获取')
    },
    (err) => {
      const msg = err.code === 1 ? '用户拒绝' : err.code === 2 ? '位置不可用' : '超时'
      geo.value.status = msg
      geo.value.statusClass = 'err'
      settings.pushToast('error', '定位失败:' + msg)
    },
    { timeout: 8000 }
  )
}

function resetGeo() {
  geo.value = { status: '未获取', statusClass: '', lat: '—', lng: '—', acc: '—' }
}

function trigToast(type) {
  const text = ({
    info: '这是一条 Info 提示',
    success: '操作已成功',
    warning: '请注意:这是一条警告',
    error: '操作失败,请重试',
  })[type]
  settings.pushToast(type, text)
}
</script>

<template>
  <div class="playground-page">
    <header class="pg-head">
      <span class="pg-eyebrow">PLAYGROUND · CSS3 / HTML5</span>
      <h1 class="pg-title">组件工具间</h1>
      <p class="pg-sub">博客里出现过的按钮、表单、卡片、Canvas、SVG、媒体、拖放、定位、提示等组件,在这里集中展示与试玩。</p>
    </header>

    <!-- 按钮 -->
    <section class="pg-section">
      <h2>01 / 按钮</h2>
      <div class="row">
        <button class="ui-btn ui-btn-primary">Primary</button>
        <button class="ui-btn ui-btn-ghost">Ghost</button>
        <button class="ui-btn ui-btn-accent">Accent</button>
        <button class="ui-btn ui-btn-danger">Danger</button>
        <button class="ui-btn ui-btn-primary" disabled>Disabled</button>
      </div>
    </section>

    <!-- 列表(:nth-child 斑马) -->
    <section class="pg-section">
      <h2>02 / 列表 <small>(:nth-child 斑马纹)</small></h2>
      <ol class="zebra">
        <li v-for="i in 6" :key="i"><span>2026.05.{{ 13 - i }}</span><span>条目 #{{ i }} — 你看到的斑马纹来自 CSS :nth-child(odd/even)</span></li>
      </ol>
    </section>

    <!-- 卡片 -->
    <section class="pg-section">
      <h2>03 / 卡片</h2>
      <div class="card-row">
        <article class="card">
          <span class="tag">ERP</span>
          <h3>Odoo 二开</h3>
          <p>销-采-库-产-质-财全链路二开与上线交付。</p>
        </article>
        <article class="card">
          <span class="tag">Vision</span>
          <h3>机器视觉</h3>
          <p>上下位机联调 / 通信稳定性 / 现场故障定位。</p>
        </article>
        <article class="card">
          <span class="tag">Fullstack</span>
          <h3>Spring Boot + Vue</h3>
          <p>权限 / 表单 / 大屏 / 接口联调 / 性能优化。</p>
        </article>
      </div>
    </section>

    <!-- 表单 -->
    <section class="pg-section">
      <h2>04 / 表单</h2>
      <form class="demo-form" @submit.prevent="submitDemo">
        <fieldset>
          <legend>基本信息</legend>

          <div class="ff-grid">
            <label class="ff">
              <span class="ff-label">姓名</span>
              <input v-model="formData.name" class="ff-input" type="text" placeholder="2-20 字符" />
            </label>
            <label class="ff">
              <span class="ff-label">邮箱</span>
              <input v-model="formData.email" class="ff-input" type="email" placeholder="you@example.com" />
            </label>
            <label class="ff">
              <span class="ff-label">擅长方向</span>
              <select v-model="formData.role" class="ff-input">
                <option value="frontend">前端</option>
                <option value="backend">后端</option>
                <option value="fullstack">全栈</option>
                <option value="erp">ERP</option>
                <option value="vision">视觉</option>
              </select>
            </label>
            <label class="ff">
              <span class="ff-label">熟练度 (meter)</span>
              <div class="bar-row">
                <meter class="ff-meter" min="0" max="10" low="3" high="7" optimum="9" :value="formData.rating"></meter>
                <span class="bar-val">{{ formData.rating }} / 10</span>
              </div>
            </label>
            <label class="ff">
              <span class="ff-label">完成度 (progress)</span>
              <div class="bar-row">
                <progress class="ff-progress" max="100" :value="formData.progress"></progress>
                <span class="bar-val">{{ Math.floor(formData.progress) }}%</span>
              </div>
              <button type="button" class="link-btn" @click="progressDemo">让进度跑一遍 →</button>
            </label>
            <label class="ff">
              <span class="ff-label">同意</span>
              <span class="ff-check">
                <input v-model="formData.agree" type="checkbox" />
                <span>同意演示提交</span>
              </span>
            </label>
          </div>

          <div class="form-foot">
            <span class="form-status">{{ formStatus }}</span>
            <button type="submit" class="ui-btn ui-btn-primary">提交</button>
          </div>
        </fieldset>
      </form>
    </section>

    <!-- Canvas -->
    <section class="pg-section">
      <h2>05 / Canvas 画板</h2>
      <div class="canvas-stage">
        <canvas ref="canvasEl" width="1200" height="320"></canvas>
        <div class="canvas-tools">
          <label>
            <span>颜色</span>
            <input type="color" v-model="paintColor" />
          </label>
          <label class="grow">
            <span>笔触 <strong>{{ paintSize }}</strong> px</span>
            <input type="range" min="1" max="30" v-model.number="paintSize" />
          </label>
          <button class="ui-btn ui-btn-ghost" @click="clearCanvas">清空</button>
        </div>
      </div>
    </section>

    <!-- SVG -->
    <section class="pg-section">
      <h2>06 / SVG 图形(hover 缩放)</h2>
      <div class="svg-stage">
        <svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stop-color="oklch(0.50 0.22 295)" />
              <stop offset="1" stop-color="oklch(0.55 0.18 220)" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0" stop-color="oklch(0.62 0.16 60)" />
              <stop offset="1" stop-color="oklch(0.75 0.20 40)" />
            </linearGradient>
          </defs>
          <circle class="shape" cx="80" cy="100" r="50" fill="url(#g1)" />
          <rect class="shape" x="170" y="50" width="100" height="100" rx="18" fill="url(#g1)" />
          <polygon class="shape" points="350,50 405,150 295,150" fill="url(#g2)" />
        </svg>
      </div>
    </section>

    <!-- 视频 / 音频 -->
    <section class="pg-section">
      <h2>07 / 视频 / 音频</h2>
      <div class="media-grid">
        <figure class="media-card">
          <video controls preload="metadata">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <figcaption><strong>Big Buck Bunny</strong><span>sample · w3schools.com</span></figcaption>
        </figure>
        <figure class="media-card">
          <div class="audio-frame">
            <span class="audio-mark"></span>
            <audio controls preload="metadata" src="https://www.w3schools.com/html/horse.ogg"></audio>
          </div>
          <figcaption><strong>Horse</strong><span>sample · w3schools.com</span></figcaption>
        </figure>
      </div>
    </section>

    <!-- 上传 -->
    <section class="pg-section">
      <h2>08 / 拖放上传</h2>
      <div
        :class="['dropzone', { active: dropZoneActive }]"
        @dragenter.prevent="dropZoneActive = true"
        @dragover.prevent="dropZoneActive = true"
        @dragleave.prevent="dropZoneActive = false"
        @drop.prevent="onDrop"
        @click="fileInputEl?.click()"
      >
        <input ref="fileInputEl" type="file" multiple hidden @change="onPick" />
        <IconBase name="upload" :size="40" />
        <strong>拖文件到此处 / 点击选择</strong>
        <span>支持任意格式 · 仅本地预览</span>
      </div>

      <ul v-if="files.length" class="file-list">
        <li v-for="f in files" :key="f.id" class="file-item">
          <div class="file-thumb">
            <img v-if="f.url" :src="f.url" :alt="f.name" />
            <span v-else>{{ (f.name.split('.').pop() || 'FILE').slice(0, 4).toUpperCase() }}</span>
          </div>
          <span class="file-name">{{ f.name }}</span>
          <span class="file-size">{{ formatBytes(f.size) }}</span>
          <button class="file-del" @click="removeFile(f.id)" title="移除">
            <IconBase name="close" :size="14" />
          </button>
        </li>
      </ul>
      <p v-else class="empty-hint">尚未选择文件。</p>
    </section>

    <!-- 地理定位 -->
    <section class="pg-section">
      <h2>09 / 地理定位</h2>
      <div class="geo-actions">
        <button class="ui-btn ui-btn-primary" @click="getLocation">获取当前位置</button>
        <button class="ui-btn ui-btn-ghost" @click="resetGeo">清空</button>
      </div>
      <article class="geo-card">
        <div class="geo-row"><span>纬度 / Latitude</span><strong>{{ geo.lat }}</strong></div>
        <div class="geo-row"><span>经度 / Longitude</span><strong>{{ geo.lng }}</strong></div>
        <div class="geo-row"><span>精度 / Accuracy</span><strong>{{ geo.acc }}</strong></div>
        <div class="geo-row"><span>状态 / Status</span><strong :class="['geo-status', geo.statusClass]">{{ geo.status }}</strong></div>
      </article>
    </section>

    <!-- Alert + Toast -->
    <section class="pg-section">
      <h2>10 / 提示反馈</h2>
      <div class="alert info"><strong>info ·</strong> 这是一条信息提示。</div>
      <div class="alert success"><strong>success ·</strong> 操作已完成。</div>
      <div class="alert warning"><strong>warning ·</strong> 注意:该操作不可撤销。</div>
      <div class="alert error"><strong>error ·</strong> 网络请求失败。</div>
      <div class="toast-trig">
        <button class="ui-btn ui-btn-ghost" @click="trigToast('info')">触发 Info Toast</button>
        <button class="ui-btn ui-btn-accent" @click="trigToast('success')">Success</button>
        <button class="ui-btn ui-btn-ghost" @click="trigToast('warning')">Warning</button>
        <button class="ui-btn ui-btn-danger" @click="trigToast('error')">Error</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.playground-page {
  max-width: min(1100px, 92vw);
  margin: 0 auto;
  padding: 40px clamp(20px, 4vw, 56px) 80px;
}

.pg-head { margin-bottom: 50px; }
.pg-eyebrow {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--ink-3);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.pg-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(36px, 5.4vw, 64px);
  letter-spacing: -0.025em;
  margin: 0 0 14px;
}
.pg-sub {
  font-size: 15px;
  color: var(--ink-2);
  margin: 0;
  max-width: 720px;
  line-height: 1.65;
}

.pg-section {
  padding: 36px 0 48px;
  border-bottom: 1px solid var(--line-soft);
}
.pg-section:last-child { border-bottom: none; }
.pg-section h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(20px, 2.4vw, 28px);
  margin: 0 0 22px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.pg-section h2 small {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 400;
  color: var(--ink-3);
}

.row { display: flex; flex-wrap: wrap; gap: 12px; }

/* zebra */
.zebra {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  overflow: hidden;
}
.zebra li {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  padding: 12px 18px;
  color: var(--ink-2);
  font-size: 14px;
  transition: background 0.3s, padding 0.3s var(--ease-out), color 0.3s;
}
.zebra li:nth-child(odd) { background: oklch(0.90 0.010 280 / 0.45); }
.zebra li:nth-child(even) { background: oklch(0.87 0.010 280 / 0.45); }
.zebra li:hover {
  background: oklch(0.82 0.06 295 / 0.4);
  color: var(--ink);
  padding-left: 28px;
}
.zebra li span:first-child {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
}

/* card */
.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}
.card {
  padding: 22px;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.87 0.010 280 / 0.5), oklch(0.93 0.008 280 / 0.3));
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.card:hover { border-color: var(--accent); transform: translateY(-3px); }
.card .tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
  background: oklch(0.82 0.07 295 / 0.4);
  margin-bottom: 12px;
}
.card h3 { font-family: var(--font-display); font-size: 16px; margin: 0 0 8px; }
.card p { margin: 0; font-size: 13px; color: var(--ink-2); line-height: 1.65; }

/* 表单 */
.demo-form fieldset {
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  padding: 22px 24px 22px;
  background: oklch(0.90 0.010 280 / 0.3);
}
.demo-form legend {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--accent);
  padding: 0 10px;
  background: var(--bg);
  border-radius: 4px;
}
.ff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 18px 22px;
}
.ff { display: flex; flex-direction: column; gap: 6px; }
.ff-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.ff-input {
  width: 100%;
  background: oklch(0.97 0.005 280 / 0.7);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
}
.ff-input:hover { border-color: var(--ink-3); }
.ff-input:focus {
  outline: none;
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.55);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.18);
}
.bar-row { display: flex; align-items: center; gap: 12px; }
.bar-val {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-2);
  min-width: 56px;
  text-align: right;
}
.ff-meter, .ff-progress {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border: 0;
  border-radius: 999px;
  background: oklch(0.87 0.010 280 / 0.7);
  overflow: hidden;
}
.ff-progress::-webkit-progress-bar { background: oklch(0.87 0.010 280 / 0.7); border-radius: 999px; }
.ff-progress::-webkit-progress-value {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 999px;
  transition: width 0.6s var(--ease-out);
}
.ff-meter::-webkit-meter-optimum-value {
  background: linear-gradient(90deg, var(--success), oklch(0.55 0.16 130));
  border-radius: 999px;
}
.ff-meter::-webkit-meter-suboptimum-value {
  background: linear-gradient(90deg, var(--accent-warm), oklch(0.58 0.18 40));
  border-radius: 999px;
}
.ff-check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 280 / 0.5);
  font-size: 13.5px;
  color: var(--ink-2);
  cursor: pointer;
}
.ff-check input[type="checkbox"] {
  appearance: none;
  width: 18px; height: 18px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: oklch(0.97 0.005 280 / 0.7);
  cursor: pointer;
  position: relative;
}
.ff-check input[type="checkbox"]:checked { background: var(--accent); border-color: var(--accent); }
.ff-check input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 5px; top: 1px;
  width: 5px; height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.link-btn {
  background: transparent;
  border: 0;
  color: var(--accent);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-top: 4px;
  text-align: left;
}
.link-btn:hover { color: var(--accent-warm); }

.form-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
}
.form-status { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-3); }

/* Canvas */
.canvas-stage {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 280 / 0.6);
  box-shadow: 0 10px 40px -20px oklch(0.05 0 0 / 0.6);
}
.canvas-stage canvas {
  display: block;
  width: 100%;
  height: 320px;
  border-radius: 10px;
  background:
    linear-gradient(oklch(0.87 0.010 280 / 0.7) 1px, transparent 1px) 0 0 / 20px 20px,
    linear-gradient(90deg, oklch(0.87 0.010 280 / 0.7) 1px, transparent 1px) 0 0 / 20px 20px,
    oklch(0.95 0.006 280);
  cursor: crosshair;
}
.canvas-tools {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 4px 4px;
}
.canvas-tools label { display: flex; flex-direction: column; gap: 6px; }
.canvas-tools label.grow { flex: 1; }
.canvas-tools label > span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.canvas-tools label strong { color: var(--accent); font-family: var(--font-mono); }
.canvas-tools input[type="color"] {
  width: 44px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  padding: 0;
}
.canvas-tools input[type="range"] {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--line);
  border-radius: 999px;
  cursor: pointer;
  outline: none;
}
.canvas-tools input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
}

/* SVG */
.svg-stage {
  padding: 30px;
  border: 1px solid var(--line-soft);
  border-radius: 16px;
  background: oklch(0.97 0.005 280 / 0.6);
  text-align: center;
}
.svg-stage svg {
  width: 100%;
  max-width: 520px;
  height: auto;
}
.shape {
  cursor: pointer;
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.5s var(--ease-out), filter 0.5s;
  filter: drop-shadow(0 0 0 transparent);
}
.shape:hover {
  transform: scale(1.18) rotate(8deg);
  filter: drop-shadow(0 0 18px oklch(0.50 0.22 295 / 0.65));
}

/* media */
.media-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
}
@media (max-width: 720px) { .media-grid { grid-template-columns: 1fr; } }
.media-card {
  margin: 0;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.87 0.010 280 / 0.55), oklch(0.95 0.006 280 / 0.55));
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.media-card:hover { border-color: var(--accent); transform: translateY(-3px); }
.media-card video { width: 100%; border-radius: 10px; aspect-ratio: 16/9; background: oklch(0.97 0.005 280); }
.audio-frame {
  position: relative;
  padding: 28px 18px 22px;
  border-radius: 12px;
  background:
    radial-gradient(circle at 30% 50%, oklch(0.82 0.07 295 / 0.45), transparent 60%),
    oklch(0.95 0.006 280 / 0.6);
  border: 1px solid var(--line-soft);
}
.audio-mark {
  position: absolute;
  left: 18px; top: 50%;
  transform: translateY(-50%);
  width: 28px; height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--accent), oklch(0.55 0.20 295));
  animation: audio-pulse 2.4s ease-out infinite;
}
@keyframes audio-pulse {
  0% { box-shadow: 0 0 0 0 oklch(0.50 0.22 295 / 0.5); }
  70% { box-shadow: 0 0 0 16px oklch(0.50 0.22 295 / 0); }
  100% { box-shadow: 0 0 0 0 oklch(0.50 0.22 295 / 0); }
}
.media-card audio { width: 100%; border-radius: 999px; }
.media-card figcaption { display: flex; flex-direction: column; gap: 4px; padding: 0 6px 4px; }
.media-card figcaption strong { font-family: var(--font-display); font-size: 14px; color: var(--ink); }
.media-card figcaption span { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }

/* upload */
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 24px;
  border: 1.5px dashed var(--line);
  border-radius: 16px;
  background: oklch(0.97 0.005 280 / 0.4);
  color: var(--ink-2);
  cursor: pointer;
  transition: border-color 0.4s, background 0.4s, transform 0.4s var(--ease-out);
}
.dropzone:hover { border-color: var(--accent); background: oklch(0.85 0.06 295 / 0.30); transform: translateY(-2px); }
.dropzone.active {
  border-color: var(--accent-2);
  background: oklch(0.85 0.06 220 / 0.30);
  animation: dz-pulse 1.2s ease-in-out infinite;
}
@keyframes dz-pulse {
  0%, 100% { box-shadow: 0 0 0 0 oklch(0.55 0.18 220 / 0.45); }
  50% { box-shadow: 0 0 0 10px oklch(0.55 0.18 220 / 0.05); }
}
.dropzone svg { color: var(--accent); }
.dropzone strong { font-family: var(--font-display); font-size: 16px; color: var(--ink); }
.dropzone span { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }

.file-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.file-item {
  display: grid;
  grid-template-columns: 42px 1fr auto 32px;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.87 0.010 280 / 0.55);
  animation: file-in 0.3s var(--ease-out);
}
@keyframes file-in { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.file-thumb {
  width: 42px; height: 42px;
  border-radius: 8px;
  background: oklch(0.88 0.05 295 / 0.4);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-2);
  overflow: hidden;
}
.file-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.file-name {
  font-size: 13.5px;
  color: var(--ink);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-size { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }
.file-del {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: transparent;
  color: var(--ink-3);
  transition: color 0.3s, background 0.3s, transform 0.4s var(--ease-out);
}
.file-del:hover {
  color: var(--error);
  background: oklch(0.86 0.07 25 / 0.4);
  transform: rotate(90deg);
}
.empty-hint {
  margin: 12px 0 0;
  padding: 14px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-3);
  border: 1px dashed var(--line-soft);
  border-radius: 10px;
}

/* geo */
.geo-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.geo-card {
  padding: 18px 22px;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.87 0.010 280 / 0.5), oklch(0.93 0.008 280 / 0.4));
}
.geo-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid var(--line-soft);
}
.geo-row:last-child { border-bottom: none; }
.geo-row span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.geo-row strong {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}
.geo-status.ok { color: var(--success); }
.geo-status.err { color: var(--error); }
.geo-status.loading { color: var(--accent-2); animation: blink 1.2s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

/* alert */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 14px;
  border-left: 3px solid;
  margin-bottom: 10px;
  transition: transform 0.3s, border-left-width 0.3s;
}
.alert:hover { transform: translateX(4px); border-left-width: 5px; }
.alert strong { color: var(--ink); }
.alert.info { background: oklch(0.90 0.05 220 / 0.32); border-left-color: var(--accent-2); color: var(--ink-2); }
.alert.success { background: oklch(0.90 0.05 160 / 0.32); border-left-color: var(--success); color: var(--ink-2); }
.alert.warning { background: oklch(0.88 0.07 60 / 0.32); border-left-color: var(--warning); color: var(--ink-2); }
.alert.error { background: oklch(0.88 0.07 25 / 0.30); border-left-color: var(--error); color: var(--ink-2); }
.toast-trig {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

/* 通用按钮 */
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
.ui-btn:active { transform: translateY(0); }
.ui-btn[disabled], .ui-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
.ui-btn-primary { background: var(--ink); color: var(--bg-deep); }
.ui-btn-primary:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }
.ui-btn-ghost { background: transparent; color: var(--ink-2); border-color: var(--line); }
.ui-btn-ghost:hover { color: var(--ink); border-color: var(--ink-3); transform: translateY(-2px); }
.ui-btn-accent { background: var(--accent); color: #fff; }
.ui-btn-accent:hover { background: oklch(0.65 0.22 295); transform: translateY(-2px); }
.ui-btn-danger { background: var(--error); color: #fff; }
.ui-btn-danger:hover { background: oklch(0.48 0.22 25); transform: translateY(-2px); }
</style>
