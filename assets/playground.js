/* =============================================================
 * APOS Playground — 交互脚本
 * -------------------------------------------------------------
 *  - TOC active 高亮(IntersectionObserver)
 *  - Canvas 鼠标绘制 + 颜色 / 粗细 / 清空
 *  - 表单提交校验 + 进度条动画
 *  - 拖放上传 + 本地预览 + 删除
 *  - Geolocation API
 *  - 工具面板 hue 主色实时调 / 字号
 *  - Toast 触发
 * ============================================================= */

(() => {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- TOC active (IntersectionObserver) ---------- */
  const tocLinks = $$('.pg-toc a');
  const sections = $$('.pg-section');
  if (tocLinks.length && sections.length) {
    const tocObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            tocLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px' }
    );
    sections.forEach((s) => tocObs.observe(s));
  }

  /* ---------- Canvas 画板 ---------- */
  const canvas    = $('#paint');
  const colorEl   = $('#paint-color');
  const sizeEl    = $('#paint-size');
  const sizeVal   = $('#paint-size-value');
  const clearBtn  = $('#paint-clear');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let last = null;

    const pos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (cx - rect.left) * (canvas.width  / rect.width),
        y: (cy - rect.top)  * (canvas.height / rect.height),
      };
    };

    const start = (e) => { drawing = true; last = pos(e); };
    const move  = (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.strokeStyle = colorEl.value;
      ctx.lineWidth = parseInt(sizeEl.value, 10);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    };
    const end = () => { drawing = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, { passive: false });
    canvas.addEventListener('touchend', end);

    sizeEl.addEventListener('input', () => {
      sizeVal.textContent = sizeEl.value;
    });

    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  /* ---------- 表单提交 + 进度动画 ---------- */
  const form = $('#demo-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = $('#form-status');
      // 手动校验,把第一个 invalid 字段聚焦
      const invalid = form.querySelector('input:invalid, select:invalid, textarea:invalid');
      if (invalid) {
        status.textContent = '× 有字段未填写或格式不正确';
        status.className = 'form-status err';
        invalid.focus();
        return;
      }
      status.textContent = '✓ 表单已提交(演示模式,未发送到服务器)';
      status.className = 'form-status ok';
      pushToast('success', '表单提交成功(演示)');
    });
  }

  // 进度条"跑一遍"演示
  const progAnim = $('#progress-anim');
  const progBar  = $('#progress-bar');
  const progVal  = $('#progress-value');
  if (progAnim && progBar && progVal) {
    progAnim.addEventListener('click', () => {
      let v = 0;
      progBar.value = 0;
      progVal.textContent = '0%';
      const timer = setInterval(() => {
        v += 4 + Math.random() * 6;
        if (v >= 100) { v = 100; clearInterval(timer); }
        progBar.value = v;
        progVal.textContent = Math.floor(v) + '%';
      }, 80);
    });
  }

  /* ---------- 拖放上传 ---------- */
  const dropzone  = $('#dropzone');
  const fileInput = $('#file-input');
  const fileList  = $('#file-list');
  const fileEmpty = $('#file-empty');

  if (dropzone && fileInput && fileList) {
    ['dragenter', 'dragover'].forEach((ev) => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((ev) => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });
    dropzone.addEventListener('drop', (e) => {
      handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => {
      handleFiles(fileInput.files);
      fileInput.value = '';
    });
  }

  function handleFiles(files) {
    Array.from(files).forEach(addFile);
    refreshEmpty();
  }

  function addFile(file) {
    const li = document.createElement('li');
    li.className = 'file-item';

    const thumb = document.createElement('div');
    thumb.className = 'file-thumb';
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      // 释放 objectURL
      img.addEventListener('load', () => URL.revokeObjectURL(img.src), { once: true });
      thumb.appendChild(img);
    } else {
      const ext = (file.name.split('.').pop() || file.type.split('/').pop() || 'FILE')
                  .slice(0, 4).toUpperCase();
      thumb.textContent = ext;
    }

    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = file.name;
    name.title = file.name;

    const meta = document.createElement('span');
    meta.className = 'file-meta';
    meta.textContent = formatBytes(file.size);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-remove';
    remove.title = '移除';
    remove.setAttribute('aria-label', '移除 ' + file.name);
    remove.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    remove.addEventListener('click', () => {
      li.remove();
      refreshEmpty();
    });

    li.append(thumb, name, meta, remove);
    fileList.appendChild(li);
  }

  function refreshEmpty() {
    if (!fileEmpty) return;
    fileEmpty.classList.toggle('hidden', fileList.children.length > 0);
  }

  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
    return (n / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  }

  /* ---------- 地理定位 ---------- */
  const geoBtn   = $('#geo-btn');
  const geoReset = $('#geo-reset');
  const geoCard  = $('#geo-card');

  if (geoBtn && geoCard) {
    geoBtn.addEventListener('click', () => {
      const statusEl = geoCard.querySelector('[data-geo="status"]');
      statusEl.textContent = '获取中...';
      statusEl.className = 'geo-status loading';

      if (!('geolocation' in navigator)) {
        statusEl.textContent = '浏览器不支持 Geolocation';
        statusEl.className = 'geo-status err';
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (p) => {
          geoCard.querySelector('[data-geo="lat"]').textContent = p.coords.latitude.toFixed(6) + '°';
          geoCard.querySelector('[data-geo="lng"]').textContent = p.coords.longitude.toFixed(6) + '°';
          geoCard.querySelector('[data-geo="acc"]').textContent = '±' + p.coords.accuracy.toFixed(0) + ' m';
          geoCard.querySelector('[data-geo="alt"]').textContent = p.coords.altitude != null
            ? p.coords.altitude.toFixed(0) + ' m'
            : '不可用';
          statusEl.textContent = '已获取';
          statusEl.className = 'geo-status ok';
          pushToast('success', '位置已获取');
        },
        (err) => {
          const msg = err.code === 1 ? '用户拒绝授权'
                    : err.code === 2 ? '位置不可用'
                    : err.code === 3 ? '请求超时'
                    : '未知错误';
          statusEl.textContent = msg;
          statusEl.className = 'geo-status err';
          pushToast('error', '定位失败:' + msg);
        },
        { timeout: 8000, maximumAge: 30000, enableHighAccuracy: false }
      );
    });
  }

  if (geoReset && geoCard) {
    geoReset.addEventListener('click', () => {
      geoCard.querySelectorAll('[data-geo]').forEach((el) => {
        if (el.dataset.geo === 'status') {
          el.textContent = '未获取';
          el.className = 'geo-status';
        } else {
          el.textContent = '—';
        }
      });
    });
  }

  /* ---------- 工具面板 ---------- */
  // hue 主色相
  const hue = $('#hue-slider');
  const hueVal = $('#hue-value');
  const hueSwatch = $('#hue-swatch');
  if (hue) {
    const root = document.documentElement;
    const applyHue = () => {
      const h = hue.value;
      hueVal.textContent = h + '°';
      const accent = `oklch(0.72 0.21 ${h})`;
      root.style.setProperty('--accent', accent);
      if (hueSwatch) {
        hueSwatch.style.background = accent;
        hueSwatch.style.boxShadow = `0 0 12px ${accent}`;
      }
    };
    hue.addEventListener('input', applyHue);
  }

  // 字号
  $$('.tab-btn[data-fz]').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.tab-btn[data-fz]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.fontSize = btn.dataset.fz + 'px';
    });
  });

  /* ---------- Toast ---------- */
  const stack = $('#toast-stack');
  $$('[data-toast]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.toast;
      const text = ({
        info:    '这是一条 Info 提示',
        success: '操作已成功',
        warning: '请注意:这是一条警告',
        error:   '操作失败,请稍后重试',
      })[type] || type;
      pushToast(type, text);
    });
  });

  function pushToast(type, text) {
    if (!stack) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');
    t.textContent = text;
    stack.appendChild(t);
    setTimeout(() => {
      t.classList.add('leaving');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    }, 2800);
  }
})();
