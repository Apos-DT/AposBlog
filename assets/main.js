/* APOS Blog — main script
   - Lenis smooth scroll
   - GSAP hero entrance + ScrollTrigger reveal
   - Custom cursor (dot + ring with lerp)
   - Card spotlight (mouse-tracked radial)
   - Nav scroll-state
   - Home: render posts grid + archive from ./content/manifest.json
   - Post: load ?slug=xxx markdown from ./content/posts/<slug>.md, render with marked
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPost = document.body.dataset.page === 'post';

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (window.Lenis && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------- Custom cursor (lerp ring + instant dot) ---------------- */
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (dot && ring && matchMedia('(hover: hover)').matches) {
    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    const r = { x: m.x, y: m.y };
    addEventListener('mousemove', (e) => { m.x = e.clientX; m.y = e.clientY; }, { passive: true });

    const lerp = (a, b, n) => a + (b - a) * n;
    const tick = () => {
      r.x = lerp(r.x, m.x, 0.16);
      r.y = lerp(r.y, m.y, 0.16);
      dot.style.transform = `translate3d(${m.x - 3}px, ${m.y - 3}px, 0)`;
      ring.style.transform = `translate3d(${r.x - 18}px, ${r.y - 18}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 1; });
    document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
    $$('[data-cursor="link"], a, button, .post-card').forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ---------------- Nav scroll state ---------------- */
  const nav = $('#nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Year ---------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Aurora parallax on mousemove ---------------- */
  const aurora = $('.aurora');
  if (aurora && !prefersReduced) {
    const blobs = $$('.aurora-blob', aurora);
    addEventListener('mousemove', (e) => {
      const x = (e.clientX / innerWidth - 0.5);
      const y = (e.clientY / innerHeight - 0.5);
      blobs.forEach((b, i) => {
        const k = (i + 1) * 14;
        b.style.transform = `translate3d(${x * k}px, ${y * k}px, 0)`;
      });
    }, { passive: true });
  }

  /* ---------------- Hero word entrance ---------------- */
  if (window.gsap && !prefersReduced) {
    const words = $$('.hero-title .word');
    if (words.length) {
      gsap.to(words, {
        y: 0, opacity: 1,
        duration: 1.1, ease: 'expo.out',
        stagger: 0.08,
        delay: 0.1,
      });
    }
  } else {
    // fallback: just show
    $$('.hero-title .word').forEach((w) => { w.style.transform = 'none'; w.style.opacity = 1; });
  }

  /* ---------------- Reveal on scroll (IntersectionObserver) ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .reveal-up').forEach((el) => io.observe(el));

  /* ---------------- Card spotlight (post cards + stack groups) ---------------- */
  document.addEventListener('mousemove', (e) => {
    if (!e.target.closest) return;
    const card = e.target.closest('.post-card, .stack-group');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  /* ============================================================
     Home page: render posts + archive
     ============================================================ */
  if (!isPost) {
    fetch('./content/manifest.json', { cache: 'no-cache' })
      .then((r) => r.json())
      .then((data) => {
        const posts = (data.posts || []).slice().sort((a, b) => b.date.localeCompare(a.date));
        renderLatest(posts.slice(0, 6));
        renderArchive(posts);
        // re-observe newly inserted reveal items
        $$('.reveal, .reveal-up').forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
      })
      .catch((err) => {
        console.error('[apos] manifest load failed', err);
        $('#posts-grid').innerHTML = '<p class="apos-load-err">文章索引加载失败。</p>';
      });

    setupContactForm();
  }

  /* 首页联系表单 — 字数 meter + mailto 提交 */
  function setupContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const ta = form.querySelector('textarea[name="message"]');
    const meter = $('#cf-meter');
    const meterVal = $('#cf-meter-value');
    const status = $('#cf-status');

    if (ta && meter && meterVal) {
      const max = parseInt(ta.getAttribute('maxlength') || '300', 10);
      const updateMeter = () => {
        const n = ta.value.length;
        meter.value = n;
        meterVal.textContent = `${n} / ${max}`;
      };
      ta.addEventListener('input', updateMeter);
      updateMeter();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      // 手动校验,把第一个 invalid 字段聚焦
      const invalid = form.querySelector('input:invalid, select:invalid, textarea:invalid');
      if (invalid) {
        invalid.focus();
        if (status) {
          status.textContent = '× 请检查必填字段 / 邮箱格式';
          status.className = 'form-status err';
        }
        return;
      }
      const subject = `[博客留言] ${data.topic || '来自访客'} · ${data.name || ''}`;
      const body =
        `来自:${data.name || '(未填)'} <${data.email}>\n` +
        `主题:${data.topic || '其他'}\n\n` +
        `${(data.message || '').trim()}\n\n` +
        `—— 通过 https://apos-dt.github.io/AposBlog/ 联系表单提交`;
      const mailto = `mailto:2411447661@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (status) {
        status.textContent = '✓ 正在唤起本地邮件客户端...';
        status.className = 'form-status ok';
      }
      // 直接 location 跳 mailto,浏览器会打开默认邮件客户端
      location.href = mailto;
    });

    // reset 后重置 meter
    form.addEventListener('reset', () => {
      setTimeout(() => {
        if (meter) meter.value = 0;
        if (meterVal) meterVal.textContent = '0 / 300';
        if (status) {
          status.textContent = '提交将唤起本地邮件客户端 · 不经任何第三方服务';
          status.className = 'form-status';
        }
      }, 0);
    });
  }

  function renderLatest(posts) {
    const grid = $('#posts-grid');
    if (!grid) return;
    grid.innerHTML = posts.map((p, i) => `
      <a class="post-card reveal-up" style="transition-delay:${i * 70}ms" href="./post.html?slug=${encodeURIComponent(p.slug)}" data-cursor="link">
        <div class="post-meta">
          <span>${formatDate(p.date)}</span>
          <span class="post-tag">${escapeHtml(p.tag || 'Note')}</span>
          <span>${p.readTime || '5'} min</span>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p class="post-excerpt">${escapeHtml(p.excerpt || '')}</p>
        <span class="post-read">
          <span>阅读全文</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>
    `).join('');
  }

  function renderArchive(posts) {
    const list = $('#archive-list');
    if (!list) return;
    const byYear = {};
    posts.forEach((p) => {
      const y = p.date.slice(0, 4);
      (byYear[y] = byYear[y] || []).push(p);
    });
    const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));
    list.innerHTML = years.map((y) => `
      <div class="archive-year reveal-up">${y}</div>
      ${byYear[y].map((p) => `
        <a href="./post.html?slug=${encodeURIComponent(p.slug)}" class="archive-row reveal-up" data-cursor="link">
          <span class="ar-date">${p.date.slice(5)}</span>
          <span class="ar-title">${escapeHtml(p.title)}</span>
          <span class="ar-tag">${escapeHtml(p.tag || '')}</span>
        </a>
      `).join('')}
    `).join('');
  }

  /* ============================================================
     Post page: load + render markdown
     ============================================================ */
  if (isPost) {
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    if (!slug) {
      renderPostError('未指定文章 slug。');
      return;
    }
    Promise.all([
      fetch('./content/manifest.json', { cache: 'no-cache' }).then((r) => r.json()),
      fetch(`./content/posts/${encodeURIComponent(slug)}.md`, { cache: 'no-cache' }).then((r) => {
        if (!r.ok) throw new Error('post not found');
        return r.text();
      }),
    ]).then(([data, md]) => {
      const meta = (data.posts || []).find((p) => p.slug === slug);
      if (!meta) return renderPostError('文章不存在。');
      renderPost(meta, md, data.posts || []);
    }).catch((err) => {
      console.error('[apos] post load failed', err);
      renderPostError('文章加载失败：' + err.message);
    });
  }

  function renderPost(meta, md, allPosts) {
    document.title = `${meta.title} — APOS`;
    const headEl = $('#post-head');
    const bodyEl = $('#post-body');
    const footerEl = $('#post-footer');

    headEl.innerHTML = `
      <div class="post-meta">
        <span>${formatDate(meta.date)}</span>
        <span class="post-tag">${escapeHtml(meta.tag || 'Note')}</span>
        <span>${meta.readTime || '5'} min read</span>
      </div>
      <h1>${escapeHtml(meta.title)}</h1>
      ${meta.excerpt ? `<p class="post-sub">${escapeHtml(meta.excerpt)}</p>` : ''}
    `;

    bodyEl.innerHTML = renderMarkdown(md);

    // prev / next
    const sorted = allPosts.slice().sort((a, b) => b.date.localeCompare(a.date));
    const idx = sorted.findIndex((p) => p.slug === meta.slug);
    const newer = idx > 0 ? sorted[idx - 1] : null;
    const older = idx < sorted.length - 1 ? sorted[idx + 1] : null;
    footerEl.innerHTML = `
      <a href="${newer ? `./post.html?slug=${encodeURIComponent(newer.slug)}` : './index.html'}" data-cursor="link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${newer ? '更新：' + newer.title : '返回首页'}</span>
      </a>
      <a href="${older ? `./post.html?slug=${encodeURIComponent(older.slug)}` : './index.html#archive'}" data-cursor="link">
        <span>${older ? '更旧：' + older.title : '查看归档'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    `;

    setupPostTools(meta);
  }

  /* ============================================================
     Post tools (TOC / 进度环 / 字号 / 主色 / 复制链接 / 回顶)
     ============================================================ */
  function setupPostTools(meta) {
    buildTOC();
    setupProgressRing();
    setupTopProgressBar();
    setupFontSize();
    setupHueSlider();
    setupCopyLink();
    setupToTop();
  }

  function buildTOC() {
    const nav = $('#post-toc-nav');
    if (!nav) return;
    const headings = $$('.post-body h2, .post-body h3');
    if (!headings.length) {
      const aside = document.querySelector('.post-toc');
      if (aside) aside.style.display = 'none';
      return;
    }
    headings.forEach((h, i) => {
      if (!h.id) h.id = 'h-' + i + '-' + slugify(h.textContent);
    });
    nav.innerHTML = headings.map((h) => {
      const tag = h.tagName.toLowerCase();
      return `<a class="toc-link toc-${tag}" href="#${h.id}" data-cursor="link">${escapeHtml(h.textContent)}</a>`;
    }).join('');

    const links = $$('.toc-link', nav);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    headings.forEach((h) => obs.observe(h));
  }

  function setupProgressRing() {
    const fg = document.querySelector('.rp-fg');
    const text = $('#rp-text');
    if (!fg || !text) return;
    const r = 15.91;
    const C = 2 * Math.PI * r;
    fg.style.strokeDasharray = C;
    fg.style.strokeDashoffset = C;
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? Math.max(0, Math.min(1, (h.scrollTop || document.body.scrollTop) / total)) : 0;
      fg.style.strokeDashoffset = C * (1 - pct);
      text.textContent = Math.round(pct * 100) + '%';
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  function setupTopProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? Math.max(0, Math.min(1, (h.scrollTop || document.body.scrollTop) / total)) : 0;
      bar.style.width = (pct * 100).toFixed(2) + '%';
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  function setupFontSize() {
    const body = document.querySelector('.post-body');
    if (!body) return;
    const apply = (fz, btn) => {
      $$('.tab-btn[data-pfz]').forEach((b) => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      body.style.fontSize = fz + 'px';
    };
    const saved = parseInt(localStorage.getItem('apos-pfz') || '0', 10);
    if (saved) {
      const initBtn = document.querySelector(`.tab-btn[data-pfz="${saved}"]`);
      if (initBtn) apply(saved, initBtn);
    }
    $$('.tab-btn[data-pfz]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fz = parseInt(btn.dataset.pfz, 10);
        apply(fz, btn);
        localStorage.setItem('apos-pfz', String(fz));
      });
    });
  }

  function setupHueSlider() {
    const hue = $('#post-hue');
    const val = $('#post-hue-value');
    const sw  = $('#post-hue-swatch');
    if (!hue) return;
    const root = document.documentElement;
    const apply = () => {
      const h = hue.value;
      const accent = `oklch(0.72 0.21 ${h})`;
      root.style.setProperty('--accent', accent);
      if (val) val.textContent = h + '°';
      if (sw) {
        sw.style.background = accent;
        sw.style.boxShadow = `0 0 10px ${accent}`;
      }
      localStorage.setItem('apos-hue', h);
    };
    const saved = localStorage.getItem('apos-hue');
    if (saved) hue.value = saved;
    apply();
    hue.addEventListener('input', apply);
  }

  function setupCopyLink() {
    const btn = $('#copy-link');
    const txt = $('#copy-link-text');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        btn.classList.add('copied');
        if (txt) txt.textContent = '已复制 ✓';
        setTimeout(() => {
          btn.classList.remove('copied');
          if (txt) txt.textContent = '复制本文链接';
        }, 1800);
      } catch {
        if (txt) txt.textContent = '复制失败';
      }
    });
  }

  function setupToTop() {
    const btn = $('#to-top');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (typeof lenis !== 'undefined' && lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function slugify(s) {
    return (s || '').toLowerCase()
      .replace(/[^\w一-龥\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) || 'h';
  }

  function renderPostError(msg) {
    const headEl = $('#post-head');
    if (!headEl) return;
    headEl.innerHTML = `<h1>404</h1><p class="post-sub">${escapeHtml(msg)}</p>`;
  }

  /* ---------------- Tiny safe markdown renderer (no deps) ---------------- */
  function renderMarkdown(md) {
    md = md.replace(/\r\n/g, '\n');
    const lines = md.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // fenced code
      if (/^```/.test(line)) {
        const lang = line.replace(/^```/, '').trim();
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push(`<pre><code${lang ? ` data-lang="${escapeAttr(lang)}"` : ''}>${escapeHtml(buf.join('\n'))}</code></pre>`);
        continue;
      }

      // headings
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

      // hr
      if (/^\s*---+\s*$/.test(line)) { out.push('<hr/>'); i++; continue; }

      // blockquote (含 GitHub 风 admonition: > [!INFO] / [!WARNING] 等)
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          buf.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        const joined = buf.join(' ').trim();
        const adm = joined.match(/^\[!(INFO|TIP|SUCCESS|NOTE|WARNING|WARN|ERROR|DANGER)\]\s*(.*)$/i);
        if (adm) {
          const raw = adm[1].toUpperCase();
          const cls = ({
            INFO: 'info', TIP: 'tip', SUCCESS: 'success', NOTE: 'note',
            WARNING: 'warning', WARN: 'warning', ERROR: 'error', DANGER: 'error',
          })[raw];
          const mark = ({
            INFO: 'i', TIP: '★', SUCCESS: '✓', NOTE: '·',
            WARNING: '!', WARN: '!', ERROR: '×', DANGER: '×',
          })[raw];
          const label = ({
            INFO: 'Info', TIP: 'Tip', SUCCESS: 'Success', NOTE: 'Note',
            WARNING: 'Warning', WARN: 'Warning', ERROR: 'Error', DANGER: 'Danger',
          })[raw];
          out.push(
            `<aside class="admon ${cls}" role="note">` +
              `<span class="admon-mark" aria-hidden="true">${mark}</span>` +
              `<div class="admon-body"><p><strong>${label} ·</strong> ${inline(adm[2])}</p></div>` +
            `</aside>`
          );
        } else {
          out.push(`<blockquote>${inline(joined)}</blockquote>`);
        }
        continue;
      }

      // unordered list
      if (/^\s*[-*]\s+/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          buf.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`);
          i++;
        }
        out.push(`<ul>${buf.join('')}</ul>`);
        continue;
      }

      // ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          buf.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`);
          i++;
        }
        out.push(`<ol>${buf.join('')}</ol>`);
        continue;
      }

      // blank line
      if (/^\s*$/.test(line)) { i++; continue; }

      // paragraph (collect consecutive non-empty lines)
      const buf = [line];
      i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|---+)/.test(lines[i])) {
        buf.push(lines[i]); i++;
      }
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
    return out.join('\n');
  }

  function inline(s) {
    // escape first then re-insert allowed markup
    s = escapeHtml(s);
    // code spans `x`
    s = s.replace(/`([^`]+?)`/g, (_, c) => `<code>${c}</code>`);
    // ![alt](url) — alt 关键字决定渲染:
    //   ![video] / ![video:caption](mp4)  → <figure.media-card><video controls>
    //   ![audio] / ![audio:caption](ogg)  → <figure.media-card><audio controls>
    //   其他 alt                          → <img>
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, a, u) => {
      const url = escapeAttr(u);
      const altRaw = a.trim();
      const mvideo = altRaw.match(/^video(?::(.*))?$/i);
      const maudio = altRaw.match(/^audio(?::(.*))?$/i);
      if (mvideo) {
        const cap = (mvideo[1] || '').trim();
        return `<figure class="media-card"><video controls preload="metadata" src="${url}"></video>${cap ? `<figcaption>${escapeHtml(cap)}</figcaption>` : ''}</figure>`;
      }
      if (maudio) {
        const cap = (maudio[1] || '').trim();
        return `<figure class="media-card"><audio controls preload="metadata" src="${url}"></audio>${cap ? `<figcaption>${escapeHtml(cap)}</figcaption>` : ''}</figure>`;
      }
      return `<img alt="${escapeAttr(altRaw)}" src="${url}" loading="lazy"/>`;
    });
    // links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, t, u) => {
      const ext = /^https?:\/\//.test(u);
      return `<a href="${escapeAttr(u)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
    });
    // bold
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italic
    s = s.replace(/(^|[\s>])\*([^*]+)\*(?=[\s<.,!?:;)]|$)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[\s>])_([^_]+)_(?=[\s<.,!?:;)]|$)/g, '$1<em>$2</em>');
    return s;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function formatDate(d) {
    if (!d) return '';
    // d = "2026-05-13"
    const [y, m, day] = d.split('-');
    return `${y}.${m}.${day}`;
  }

})();
