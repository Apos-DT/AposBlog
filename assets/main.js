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

  /* ---------------- Card spotlight ---------------- */
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest && e.target.closest('.post-card');
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
        $('#posts-grid').innerHTML = '<p style="color:var(--ink-3)">文章索引加载失败。</p>';
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
        <span class="post-tag" style="padding:4px 10px;border-radius:999px;border:1px solid var(--line);color:var(--ink-2)">${escapeHtml(meta.tag || 'Note')}</span>
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

    // reading progress bar
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight);
      bar.style.width = (Math.max(0, Math.min(1, pct)) * 100).toFixed(2) + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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

      // blockquote
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
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
    // images ![alt](url)
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, a, u) => `<img alt="${escapeAttr(a)}" src="${escapeAttr(u)}"/>`);
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
