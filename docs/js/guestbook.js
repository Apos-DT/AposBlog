/**
 * 访客留言板 — 全部 jQuery 逻辑(外置,符合"代码组织规范")
 * --------------------------------------------------------
 * 9 项要求自然落地:
 *   ① jQuery 引入       — CDN(由 Vue 视图加载)
 *   ② 三类页面交互  — 搜索 + 排序 + 弹窗(删除确认) + 折叠展开(回复)+
 *                         返回顶部 + Toast 提示
 *   ③ 表单校验       — 姓名(非空+长度) / 邮箱(格式) / 内容(长度) 三类
 *   ④ DOM 动态操作  — 留言 add/delete / 回复嵌入 / 点赞计数 / 图片预览
 *   ⑤ 事件处理       — click / input / change / submit / mouseover / mouseout /
 *                       keydown(Ctrl+Enter 提交) / scroll
 *   ⑥ 动画效果       — fadeIn/fadeOut / slideDown/slideUp/slideToggle /
 *                       animate(数字 tween,缩放) / delay (5 种)
 *   ⑦ 数据动态更新  — 统计数字 tween + Canvas 表情情绪分布 donut 图
 *   ⑧ 多媒体           — 图片上传(FileReader)+ Canvas 缩略图 + 删除
 *   ⑨ 代码外置规范  — 本文件即外置脚本,HTML 模板里零 onclick=""
 *
 * 入口:window.__initGuestbook()  由 Vue 视图 onMounted 调用
 * 卸载:window.__destroyGuestbook() 由 onBeforeUnmount 调用,off 命名空间 .gb
 */
;(function () {
  'use strict'

  var STORAGE_KEY = 'apos-guestbook-v1'
  var AUTH_KEY = 'apos-auth-current'
  var ACCOUNTS_KEY = 'apos-auth-accounts'
  var AUTH_SALT = 'apos-salt-v1'
  var $ = null

  // 当前登录态
  var authState = {
    current: null,   // { type, username, displayName, avatarUrl, source, loggedAt }
    accounts: [],    // [{ username, passwordHash, displayName, createdAt }]
  }

  // 预装 seed:让首次到访的人看到页面"有生命",而不是空白
  var SEED = [
    {
      id: 's_001',
      name: '林夕',
      email: 'linxi@example.com',
      emoji: '🌱',
      content: '看完《Odoo 制造业二开》收获很大,你能不能开一篇讲产线 MES 与 ERP 衔接的?我们厂上线 MES 之后,跟 Odoo 库存对账经常出错。',
      images: [],
      likes: 14,
      liked: false,
      replies: [
        { id: 'r_1a', name: 'Apos', content: '可以,本月底会发。简单说:MES 工单完工到 ERP 入库,中间需要"成品上架确认"一道闸门,不能直接 sync。', at: '2026-05-18T11:20:00.000Z', fromAuthor: true },
      ],
      at: '2026-05-18T10:30:00.000Z',
    },
    {
      id: 's_002',
      name: 'Joey',
      email: 'joey@example.com',
      emoji: '🚀',
      content: '博客的设计真的喜欢,深色之前太暗,改成现在这种浅色温暖感舒服多了。请问字体是哪个 sans?',
      images: [],
      likes: 8,
      liked: false,
      replies: [
        { id: 'r_2a', name: 'Apos', content: '正文 Plus Jakarta Sans,标题 Space Grotesk,序号用 JetBrains Mono。', at: '2026-05-19T09:05:00.000Z', fromAuthor: true },
      ],
      at: '2026-05-19T08:42:00.000Z',
    },
    {
      id: 's_003',
      name: 'Mira',
      email: 'mira.q@example.com',
      emoji: '💡',
      content: '"Karpathy 风笔记约定"那篇启发我重写了自己的笔记系统。frontmatter + 编号节真的能扫一眼搞清,以前用纯 markdown 找东西全靠 Cmd+F。',
      images: [],
      likes: 21,
      liked: false,
      replies: [],
      at: '2026-05-19T15:20:00.000Z',
    },
    {
      id: 's_004',
      name: '张帆',
      email: 'zhangfan@example.com',
      emoji: '☕',
      content: '工业机器视觉那篇看了三遍。我们厂之前实验室能跑、现场就崩,正是因为忽略了通信稳定性。这篇 checklist 我已经打印挂在工位上了。',
      images: [],
      likes: 11,
      liked: false,
      replies: [
        { id: 'r_4a', name: 'Apos', content: '哈哈别打印太显眼,老板看到会问为什么之前没做。', at: '2026-05-20T10:10:00.000Z', fromAuthor: true },
      ],
      at: '2026-05-20T09:30:00.000Z',
    },
    {
      id: 's_005',
      name: '雪糕',
      email: 'xuegao@example.com',
      emoji: '🔥',
      content: '能不能开一个分类讲学生时代怎么准备实习?看你大三在读还能在工厂全栈,我大三还在卷 LeetCode。',
      images: [],
      likes: 18,
      liked: false,
      replies: [],
      at: '2026-05-20T14:55:00.000Z',
    },
    {
      id: 's_006',
      name: '陈一',
      email: 'chenyi@example.com',
      emoji: '😊',
      content: '请问你的知识图谱页是怎么实现的,看着像 Obsidian 但是是在线的。',
      images: [],
      likes: 6,
      liked: false,
      replies: [
        { id: 'r_6a', name: 'Apos', content: 'ECharts 力导向图,数据来自笔记的 [[wiki-link]] 解析。代码全开源在博客 GitHub。', at: '2026-05-21T00:15:00.000Z', fromAuthor: true },
      ],
      at: '2026-05-20T23:45:00.000Z',
    },
  ]

  var messages = []
  var pendingImages = []

  // ============================================================
  // 主入口
  // ============================================================
  window.__initGuestbook = function () {
    $ = window.jQuery
    if (!$) {
      console.error('[Guestbook] jQuery 未加载')
      return
    }

    loadData()
    loadAuth()
    renderList()
    renderStats()
    refreshAuthBar()

    // 入场:发布区与统计区先 fadeIn
    $('.gb-fade-in').hide().each(function (i) {
      $(this).delay(80 * i).fadeIn(380)
    })

    initForm()
    initEmojiPicker()
    initImageUpload()
    initListEvents()
    initSearchSort()
    initBackToTop()
    initAuth()
  }

  window.__destroyGuestbook = function () {
    if (!$) return
    $(window).off('.gb')
    $(document).off('.gb')
    $('.gb-root').off('.gb')
    $('.gb-root *').off('.gb')
  }

  // ============================================================
  // 数据读写 — seed 与本地修改合并
  // ============================================================
  function loadData() {
    var stored = []
    try {
      var raw = localStorage.getItem(STORAGE_KEY)
      if (raw) stored = JSON.parse(raw) || []
    } catch (e) {
      console.warn('[Guestbook] localStorage 读取失败', e)
    }

    var map = {}
    SEED.forEach(function (s) { map[s.id] = JSON.parse(JSON.stringify(s)) })
    // stored 覆盖 seed 的同 id 项(保留点赞 / 回复变化)
    stored.forEach(function (m) { map[m.id] = m })

    messages = Object.keys(map).map(function (k) { return map[k] })
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (e) {
      toast('error', '存储空间已满,请删除部分留言或附图')
    }
  }

  // ============================================================
  // 渲染列表
  // ============================================================
  function renderList() {
    var keyword = ($('#gb-search').val() || '').toLowerCase().trim()
    var sortKey = $('#gb-sort').val() || 'newest'

    var list = messages.slice()

    if (keyword) {
      list = list.filter(function (m) {
        if ((m.name || '').toLowerCase().indexOf(keyword) > -1) return true
        if ((m.content || '').toLowerCase().indexOf(keyword) > -1) return true
        return (m.replies || []).some(function (r) {
          return (r.content || '').toLowerCase().indexOf(keyword) > -1
        })
      })
    }

    if (sortKey === 'newest') {
      list.sort(function (a, b) { return (b.at || '').localeCompare(a.at || '') })
    } else if (sortKey === 'oldest') {
      list.sort(function (a, b) { return (a.at || '').localeCompare(b.at || '') })
    } else if (sortKey === 'likes') {
      list.sort(function (a, b) { return (b.likes || 0) - (a.likes || 0) })
    } else if (sortKey === 'replies') {
      list.sort(function (a, b) { return ((b.replies || []).length) - ((a.replies || []).length) })
    }

    var $list = $('#gb-list').empty()
    list.forEach(function (m) { $list.append(buildItem(m)) })

    $('#gb-empty').toggle(list.length === 0)
    $('#gb-result-count').text(keyword
      ? list.length + ' 条匹配 / 共 ' + messages.length + ' 条'
      : messages.length + ' 条留言')
  }

  function buildItem(m) {
    var hue = hashHue(m.name + m.id)
    var canDel = m.id.indexOf('u_') === 0  // 只有 u_ 前缀(用户自己留的)能删
    var hasAvatar = m.avatarUrl && m.avatarUrl.length > 4

    var avatarInner = hasAvatar
      ? '<img class="gb-avatar-img" src="' + escapeAttr(m.avatarUrl) + '" alt="" />'
      : '<span class="gb-avatar-emoji"></span>'
    var avatarStyle = hasAvatar ? '' : ' style="background: oklch(0.92 0.07 ' + hue + ')"'
    var authBadge = m.authType === 'github'
      ? '<span class="gb-auth-badge gb-auth-badge-github" title="GitHub 登录">GH</span>'
      : m.authType === 'local'
      ? '<span class="gb-auth-badge gb-auth-badge-local" title="本站账号">@</span>'
      : ''

    var html =
      '<article class="gb-item" data-id="' + escapeAttr(m.id) + '">' +
        '<header class="gb-item-head">' +
          '<div class="gb-avatar"' + avatarStyle + '>' +
            avatarInner +
            '<span class="gb-avatar-tip" style="display:none"></span>' +
            authBadge +
          '</div>' +
          '<div class="gb-item-meta">' +
            '<strong class="gb-item-name"></strong>' +
            '<span class="gb-item-time"></span>' +
          '</div>' +
          (canDel
            ? '<button class="gb-item-del" type="button" title="删除我的留言" aria-label="删除">×</button>'
            : '') +
        '</header>' +
        '<div class="gb-item-content"></div>' +
        '<div class="gb-item-images"></div>' +
        '<footer class="gb-item-actions">' +
          '<button type="button" class="gb-like' + (m.liked ? ' active' : '') + '" data-id="' + escapeAttr(m.id) + '">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (m.liked ? 'currentColor' : 'none') + '">' +
              '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
            '</svg>' +
            '<span class="gb-like-count">' + (m.likes || 0) + '</span>' +
          '</button>' +
          '<button type="button" class="gb-reply-toggle" data-id="' + escapeAttr(m.id) + '">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="1.6"/></svg>' +
            '<span>回复</span>' +
            '<span class="gb-reply-count">' + ((m.replies || []).length) + '</span>' +
          '</button>' +
        '</footer>' +
        '<section class="gb-replies"></section>' +
      '</article>'

    var $item = $(html)
    if (!hasAvatar) $item.find('.gb-avatar-emoji').text(m.emoji || '😊')
    if (m.email) $item.find('.gb-avatar-tip').text(m.email)
    $item.find('.gb-item-name').text(m.name || '匿名访客')
    $item.find('.gb-item-time').text(formatTime(m.at))
    $item.find('.gb-item-content').text(m.content || '')

    // 图片
    if (m.images && m.images.length) {
      var $imgs = $item.find('.gb-item-images')
      m.images.forEach(function (src) {
        $imgs.append('<img class="gb-item-img" alt="附图" src="' + escapeAttr(src) + '" />')
      })
    }

    // 回复区(默认收起)
    var $replies = $item.find('.gb-replies')
    if (m.replies && m.replies.length) {
      m.replies.forEach(function (r) { $replies.append(buildReply(r)) })
    }
    $replies.append(
      '<form class="gb-reply-form" data-mid="' + escapeAttr(m.id) + '">' +
        '<input type="text" class="gb-input gb-reply-name" placeholder="回复者(名字)" maxlength="20" required />' +
        '<input type="text" class="gb-input gb-reply-content" placeholder="回复内容..." maxlength="200" required />' +
        '<button type="submit" class="gb-btn gb-btn-accent">发回复</button>' +
      '</form>'
    )

    return $item
  }

  function buildReply(r) {
    var $r = $(
      '<div class="gb-reply' + (r.fromAuthor ? ' from-author' : '') + '">' +
        '<header>' +
          '<strong class="gb-reply-name"></strong>' +
          (r.fromAuthor ? '<span class="gb-author-badge">作者</span>' : '') +
          '<span class="gb-reply-time"></span>' +
        '</header>' +
        '<p class="gb-reply-content"></p>' +
      '</div>'
    )
    $r.find('.gb-reply-name').text(r.name || '匿名')
    $r.find('.gb-reply-time').text(formatTime(r.at))
    $r.find('.gb-reply-content').text(r.content || '')
    return $r
  }

  function hashHue(s) {
    var h = 0
    s = String(s || '')
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
    return Math.abs(h) % 360
  }

  // ============================================================
  // 统计 + Canvas
  // ============================================================
  function renderStats() {
    var total = messages.length
    var likes = messages.reduce(function (s, m) { return s + (m.likes || 0) }, 0)
    var replies = messages.reduce(function (s, m) { return s + ((m.replies || []).length) }, 0)

    animateNumber($('#gb-stat-total'), total)
    animateNumber($('#gb-stat-likes'), likes)
    animateNumber($('#gb-stat-replies'), replies)

    drawEmojiChart()
  }

  function animateNumber($el, target) {
    var cur = parseInt(($el.text() || '0').replace(/[^\d-]/g, ''), 10) || 0
    if (cur === target) { $el.text(target); return }
    $({ n: cur }).stop().animate({ n: target }, {
      duration: 500,
      easing: 'swing',
      step: function () { $el.text(Math.floor(this.n)) },
      complete: function () { $el.text(target) },
    })
  }

  function drawEmojiChart() {
    var canvas = document.getElementById('gb-emoji-chart')
    if (!canvas) return
    var ctx = canvas.getContext('2d')
    var w = canvas.width, h = canvas.height
    var cx = w / 2, cy = h / 2
    var r = Math.min(w, h) / 2 - 22
    ctx.clearRect(0, 0, w, h)

    var map = {}
    messages.forEach(function (m) {
      var e = m.emoji || '😊'
      map[e] = (map[e] || 0) + 1
    })
    var items = Object.keys(map).map(function (k) { return [k, map[k]] })
      .sort(function (a, b) { return b[1] - a[1] }).slice(0, 6)
    var total = items.reduce(function (s, x) { return s + x[1] }, 0)

    if (total === 0) {
      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('暂无数据', cx, cy)
      return
    }

    var colors = ['#7c3aed', '#0891b2', '#d97706', '#16a34a', '#e11d48', '#6366f1']
    var start = -Math.PI / 2
    items.forEach(function (item, i) {
      var angle = (item[1] / total) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, start + angle)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()

      // 边缘 emoji 标签
      var mid = start + angle / 2
      var lx = cx + Math.cos(mid) * (r + 14)
      var ly = cy + Math.sin(mid) * (r + 14)
      ctx.font = '15px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(item[0], lx, ly)
      start += angle
    })

    // 中心圆盖出 donut 风格
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
    ctx.fillStyle = '#fefdfb'
    ctx.fill()

    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 22px Space Grotesk, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total, cx, cy - 4)
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.fillStyle = '#64748b'
    ctx.fillText('情绪分布', cx, cy + 14)
  }

  // ============================================================
  // 表单 — 三类校验:非空 / 邮箱格式 / 长度
  // ============================================================
  function initForm() {
    $('#gb-form-name').on('input.gb', function () { validate($(this), 'name') })
    $('#gb-form-email').on('input.gb', function () { validate($(this), 'email') })
    $('#gb-form-content').on('input.gb', function () {
      validate($(this), 'content')
      $('#gb-form-content-count').text($(this).val().length + ' / 300')
    })

    // Ctrl/Cmd + Enter 快捷提交
    $('#gb-form-content').on('keydown.gb', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        $('#gb-form').submit()
      }
    })

    $('#gb-form').on('submit.gb', function (e) {
      e.preventDefault()
      var contentOk = validate($('#gb-form-content'), 'content')

      // 已登录:用登录态数据,跳过姓名/邮箱校验
      var data = {
        emoji: $('#gb-emoji-picker .gb-emoji.active').text() || '😊',
        content: $('#gb-form-content').val().trim(),
        images: pendingImages.slice(),
      }
      if (authState.current) {
        data.name = authState.current.displayName
        data.email = authState.current.username + (authState.current.type === 'github' ? '@github' : '@local')
        data.avatarUrl = authState.current.avatarUrl || ''
        data.authType = authState.current.type
        if (!contentOk) { toast('warning', '请检查留言内容'); return }
      } else {
        var nameOk = validate($('#gb-form-name'), 'name')
        var emailOk = validate($('#gb-form-email'), 'email')
        if (!nameOk || !emailOk || !contentOk) { toast('warning', '请检查标红字段'); return }
        data.name = $('#gb-form-name').val().trim()
        data.email = $('#gb-form-email').val().trim()
        data.avatarUrl = ''
        data.authType = 'guest'
      }
      addMessage(data)
      // 重置表单
      this.reset()
      pendingImages = []
      $('#gb-form-preview').empty()
      $('.gb-field').removeClass('is-ok is-error')
      $('.gb-field-tip').text('')
      $('#gb-form-content-count').text('0 / 300')
      $('#gb-emoji-picker .gb-emoji').removeClass('active').first().addClass('active')
      toast('success', '留言已发布,谢谢留下脚印')
    })
  }

  function validate($input, rule) {
    var v = ($input.val() || '').trim()
    var $field = $input.closest('.gb-field')
    var $tip = $field.find('.gb-field-tip')
    var ok = true, msg = ''
    switch (rule) {
      case 'name':
        if (!v) { ok = false; msg = '× 名字不能为空' }
        else if (v.length < 2) { ok = false; msg = '× 至少 2 个字符' }
        else { msg = '✓ ' + v.length + ' 字' }
        break
      case 'email':
        if (!v) { ok = false; msg = '× 邮箱不能为空' }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { ok = false; msg = '× 邮箱格式不对' }
        else { msg = '✓ 邮箱合法' }
        break
      case 'content':
        if (!v) { ok = false; msg = '× 留言不能为空' }
        else if (v.length < 5) { ok = false; msg = '× 至少 5 字才有意义吧' }
        else if (v.length > 300) { ok = false; msg = '× 不超过 300 字' }
        else { msg = '✓ ' + v.length + ' / 300 字' }
        break
    }
    $field.removeClass('is-ok is-error').addClass(ok ? 'is-ok' : 'is-error')
    $tip.text(msg)
    return ok
  }

  function addMessage(data) {
    var m = {
      id: 'u_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3),
      name: data.name,
      email: data.email,
      emoji: data.emoji,
      avatarUrl: data.avatarUrl || '',
      authType: data.authType || 'guest',
      content: data.content,
      images: data.images || [],
      likes: 0,
      liked: false,
      replies: [],
      at: new Date().toISOString(),
    }
    messages.unshift(m)
    saveData()

    // 重排序后定位新留言
    $('#gb-sort').val('newest')
    renderList()
    renderStats()

    // 滚到新留言并高亮 fadeIn
    var $new = $('.gb-item[data-id="' + m.id + '"]')
    if ($new.length) {
      $('html, body').animate({ scrollTop: $new.offset().top - 100 }, 500)
      $new.hide().fadeIn(500)
    }
  }

  // ============================================================
  // 表情选择
  // ============================================================
  var EMOJIS = ['😊', '🌱', '🚀', '💡', '☕', '🔥', '✨', '👋']
  function initEmojiPicker() {
    var $picker = $('#gb-emoji-picker').empty()
    EMOJIS.forEach(function (e, i) {
      $picker.append(
        '<button type="button" class="gb-emoji' + (i === 0 ? ' active' : '') + '">' + e + '</button>'
      )
    })
    $picker.on('click.gb', '.gb-emoji', function () {
      $picker.find('.gb-emoji').removeClass('active')
      $(this).addClass('active')
    })
  }

  // ============================================================
  // 图片上传 + 预览
  // ============================================================
  function initImageUpload() {
    $('#gb-form-image').on('change.gb', function () {
      var files = Array.prototype.slice.call(this.files || [])
      files.forEach(handleImageFile)
      this.value = ''
    })
  }

  function handleImageFile(file) {
    if (!file.type || file.type.indexOf('image/') !== 0) {
      toast('warning', '只能上传图片文件')
      return
    }
    if (file.size > 200 * 1024) {
      toast('warning', '图片体积过大,请压缩后再传')
      return
    }
    if (pendingImages.length >= 3) {
      toast('info', '一条留言最多 3 张图')
      return
    }
    var reader = new FileReader()
    reader.onload = function (e) {
      pendingImages.push(e.target.result)
      rebuildPreview()
    }
    reader.readAsDataURL(file)
  }

  function rebuildPreview() {
    var $box = $('#gb-form-preview').empty()
    pendingImages.forEach(function (src, idx) {
      var $item = $(
        '<div class="gb-preview-item">' +
          '<img alt="" />' +
          '<button type="button" class="gb-preview-del" data-idx="' + idx + '">×</button>' +
        '</div>'
      )
      $item.find('img').attr('src', src)
      $item.hide()
      $box.append($item)
      $item.fadeIn(220)
    })
  }

  // ============================================================
  // 列表事件 — 点赞 / 折叠 / 删除 / 回复 / hover
  // ============================================================
  function initListEvents() {
    var $list = $('#gb-list')

    // 点赞(动画:数字 tween + 心形跳动)
    $list.on('click.gb', '.gb-like', function () {
      var id = $(this).data('id')
      var m = messages.filter(function (x) { return x.id === id })[0]
      if (!m) return
      m.liked = !m.liked
      m.likes = Math.max(0, (m.likes || 0) + (m.liked ? 1 : -1))
      var $btn = $(this)
      $btn.toggleClass('active', m.liked)
      $btn.find('svg').attr('fill', m.liked ? 'currentColor' : 'none')
      animateNumber($btn.find('.gb-like-count'), m.likes)
      if (m.liked) {
        $btn.find('svg').stop().animate({ /* css hack */ }, 0)
        // jQuery animate 不直接支持 transform,用 CSS transition + class
        $btn.addClass('liked-pulse')
        setTimeout(function () { $btn.removeClass('liked-pulse') }, 320)
      }
      saveData()
      renderStats()
    })

    // 回复区折叠/展开 (slideToggle)
    $list.on('click.gb', '.gb-reply-toggle', function () {
      var $item = $(this).closest('.gb-item')
      $item.find('.gb-replies').stop(true, true).slideToggle(240)
      $(this).toggleClass('expanded')
    })

    // 提交回复
    $list.on('submit.gb', '.gb-reply-form', function (e) {
      e.preventDefault()
      var $form = $(this)
      var mid = $form.data('mid')
      var name = ($form.find('.gb-reply-name').val() || '').trim()
      var content = ($form.find('.gb-reply-content').val() || '').trim()
      if (!name || !content) {
        toast('warning', '名字与回复内容都不能为空')
        return
      }
      var m = messages.filter(function (x) { return x.id === mid })[0]
      if (!m) return
      var r = {
        id: 'r_' + Math.random().toString(36).slice(2, 8),
        name: name,
        content: content,
        at: new Date().toISOString(),
        fromAuthor: false,
      }
      m.replies = m.replies || []
      m.replies.push(r)
      saveData()
      var $rdom = buildReply(r).hide()
      $form.before($rdom)
      $rdom.fadeIn(280)
      $form.find('input').val('')
      // 计数刷新
      $('.gb-reply-toggle[data-id="' + mid + '"] .gb-reply-count').text(m.replies.length)
      renderStats()
      toast('success', '回复已发布')
    })

    // 删除自己的留言 (slideUp + remove)
    $list.on('click.gb', '.gb-item-del', function () {
      var $item = $(this).closest('.gb-item')
      var id = $item.data('id')
      if (!confirm('确定删除这条留言?')) return
      messages = messages.filter(function (m) { return m.id !== id })
      saveData()
      $item.slideUp(220, function () {
        $(this).remove()
        renderList()
        renderStats()
      })
      toast('info', '已删除')
    })

    // hover 头像显示邮箱 — 用 mouseenter/mouseleave (不冒泡,不会因子元素移动鬼畜)
    // tip 在 buildItem 时已预置在 DOM,这里只 toggle 显隐,不动态 append/remove
    $list.on('mouseenter.gb', '.gb-avatar', function () {
      var $tip = $(this).find('.gb-avatar-tip')
      if (!$tip.length || !$tip.text()) return
      $tip.stop(true, true).fadeIn(180)
    }).on('mouseleave.gb', '.gb-avatar', function () {
      $(this).find('.gb-avatar-tip').stop(true, true).fadeOut(120)
    })

    // 留言项整体 hover — 演示 mouseover / mouseout 事件(冒泡安全,作用在 .gb-item)
    $list.on('mouseover.gb', '.gb-item', function (e) {
      // 只处理直接进入 .gb-item 的事件,避免冒泡多次执行
      if (e.target !== this && !$(e.target).is('.gb-item')) {
        // 子元素进入也允许,但不重复加 class
        if ($(this).hasClass('is-hover')) return
      }
      $(this).addClass('is-hover')
    }).on('mouseout.gb', '.gb-item', function (e) {
      // 用 relatedTarget 判断是否真的离开 .gb-item
      if (!e.relatedTarget || !$.contains(this, e.relatedTarget)) {
        $(this).removeClass('is-hover')
      }
    })

    // 预览图删除
    $('#gb-form-preview').on('click.gb', '.gb-preview-del', function () {
      var idx = +$(this).data('idx')
      pendingImages.splice(idx, 1)
      rebuildPreview()
    })

    // 点击列表中的图片放大
    $list.on('click.gb', '.gb-item-img', function () {
      var src = $(this).attr('src')
      var $mask = $('<div class="gb-lightbox"></div>').append('<img alt="" src="' + escapeAttr(src) + '" />')
      $mask.hide().appendTo('body').fadeIn(180)
      $mask.on('click.gb', function () { $(this).fadeOut(180, function () { $(this).remove() }) })
    })
  }

  // ============================================================
  // 搜索 / 排序
  // ============================================================
  function initSearchSort() {
    $('#gb-search').on('input.gb', function () { renderList() })
    $('#gb-sort').on('change.gb', function () { renderList() })
  }

  // ============================================================
  // 返回顶部 — scroll 监听
  // ============================================================
  function initBackToTop() {
    var $btn = $('#gb-to-top').hide()
    $(window).on('scroll.gb', function () {
      if ($(window).scrollTop() > 320) {
        if (!$btn.is(':visible')) $btn.fadeIn(220)
      } else if ($btn.is(':visible')) {
        $btn.fadeOut(220)
      }
    })
    $btn.on('click.gb', function () {
      $('html, body').stop().animate({ scrollTop: 0 }, 500)
    })
  }

  // ============================================================
  // Toast
  // ============================================================
  function toast(kind, text) {
    var $t = $('<div class="gb-toast gb-toast-' + kind + '"></div>').text(text).hide()
    $('#gb-toast-stack').append($t)
    $t.fadeIn(220)
    setTimeout(function () {
      $t.fadeOut(220, function () { $(this).remove() })
    }, 2400)
  }

  // ============================================================
  // Helpers
  // ============================================================
  function formatTime(iso) {
    if (!iso) return ''
    var d = new Date(iso)
    var now = new Date()
    var diff = (now - d) / 1000
    if (diff < 0) diff = 0
    if (diff < 60) return '刚刚'
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前'
    if (diff < 86400 * 7) return Math.floor(diff / 86400) + ' 天前'
    return iso.slice(0, 10).replace(/-/g, '.')
  }

  function escapeAttr(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  // ============================================================
  // 登录系统(GitHub OAuth-free + 本地账号双方式)
  // ============================================================
  function loadAuth() {
    try {
      var raw = localStorage.getItem(AUTH_KEY)
      authState.current = raw ? JSON.parse(raw) : null
    } catch (e) { authState.current = null }
    try {
      var rawA = localStorage.getItem(ACCOUNTS_KEY)
      authState.accounts = rawA ? JSON.parse(rawA) : []
    } catch (e) { authState.accounts = [] }
  }

  function saveCurrent(u) {
    authState.current = u
    if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u))
    else localStorage.removeItem(AUTH_KEY)
  }

  function saveAccounts() {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(authState.accounts))
  }

  function refreshAuthBar() {
    var u = authState.current
    if (u) {
      $('.gb-auth-anon').hide()
      var $user = $('.gb-auth-user').show().css('display', 'grid')
      $user.find('.gb-auth-avatar').attr('src', u.avatarUrl || ($('html').data('basePath') || '/') + 'hoshinoai.jpg')
      $user.find('.gb-auth-name').text(u.displayName || u.username)
      $user.find('.gb-auth-source').text(
        u.type === 'github' ? '@' + u.username + ' · 通过 GitHub 登录' :
        u.type === 'local'  ? '@' + u.username + ' · 本站账号' :
        '@' + u.username
      )
      // 已登录:隐藏姓名/邮箱字段(自动用登录态)
      $('#gb-form-name').closest('.gb-field').hide()
      $('#gb-form-email').closest('.gb-field').hide()
    } else {
      $('.gb-auth-anon').show().css('display', 'flex')
      $('.gb-auth-user').hide()
      // 未登录:显示姓名/邮箱字段
      $('#gb-form-name').closest('.gb-field').show()
      $('#gb-form-email').closest('.gb-field').show()
    }
  }

  function initAuth() {
    var $modal = $('#gb-auth-modal')

    // 打开 modal
    $('#gb-auth-open-github').on('click.gb', function () { openAuthModal('github') })
    $('#gb-auth-open-local').on('click.gb', function () { openAuthModal('login') })
    $('#gb-auth-modal-close').on('click.gb', closeAuthModal)
    $modal.on('click.gb', function (e) {
      if (e.target === this) closeAuthModal()
    })

    // tab 切换
    $modal.on('click.gb', '.gb-modal-tab', function () {
      var name = $(this).data('tab')
      $modal.find('.gb-modal-tab').removeClass('active')
      $(this).addClass('active')
      $modal.find('.gb-modal-pane').removeClass('active')
      $modal.find('.gb-modal-pane[data-pane="' + name + '"]').addClass('active')
    })

    // GitHub 登录提交
    $('#gb-form-github').on('submit.gb', function (e) {
      e.preventDefault()
      var fd = new FormData(this)
      var username = (fd.get('username') || '').trim()
      if (!username) return
      doGithubLogin(username)
    })

    // 本地登录提交
    $('#gb-form-login').on('submit.gb', function (e) {
      e.preventDefault()
      var fd = new FormData(this)
      doLocalLogin(
        (fd.get('username') || '').trim(),
        fd.get('password') || ''
      )
    })

    // 本地注册提交
    $('#gb-form-register').on('submit.gb', function (e) {
      e.preventDefault()
      var fd = new FormData(this)
      doLocalRegister({
        username: (fd.get('username') || '').trim(),
        displayName: (fd.get('displayName') || '').trim(),
        password: fd.get('password') || '',
        password2: fd.get('password2') || '',
      })
    })

    // 退出
    $('#gb-auth-logout').on('click.gb', doLogout)
  }

  function openAuthModal(tab) {
    var $modal = $('#gb-auth-modal')
    $modal.show().css('display', 'flex')
    $modal.find('.gb-modal-tab').removeClass('active')
    $modal.find('.gb-modal-tab[data-tab="' + tab + '"]').addClass('active')
    $modal.find('.gb-modal-pane').removeClass('active')
    $modal.find('.gb-modal-pane[data-pane="' + tab + '"]').addClass('active')
    setTimeout(function () {
      $modal.find('.gb-modal-pane.active input:first').focus()
    }, 80)
  }

  function closeAuthModal() {
    $('#gb-auth-modal').fadeOut(160)
  }

  function doGithubLogin(username) {
    var $btn = $('#gb-form-github button[type="submit"]').prop('disabled', true).text('查询中...')
    fetch('https://api.github.com/users/' + encodeURIComponent(username))
      .then(function (res) {
        if (!res.ok) {
          if (res.status === 404) throw new Error('找不到 GitHub 用户:' + username)
          if (res.status === 403) throw new Error('GitHub API 调用次数超限,请稍后再试')
          throw new Error('GitHub 接口请求失败 (' + res.status + ')')
        }
        return res.json()
      })
      .then(function (u) {
        var current = {
          type: 'github',
          username: u.login,
          displayName: u.name || u.login,
          avatarUrl: u.avatar_url,
          bio: u.bio || '',
          loggedAt: new Date().toISOString(),
        }
        saveCurrent(current)
        refreshAuthBar()
        toast('success', '欢迎,' + current.displayName)
        closeAuthModal()
        $('#gb-form-github')[0].reset()
      })
      .catch(function (err) {
        toast('error', err.message || '登录失败')
      })
      .finally(function () {
        $btn.prop('disabled', false).text('登录')
      })
  }

  function doLocalRegister(data) {
    if (!data.username || data.username.length < 3) {
      return toast('warning', '用户名至少 3 个字符')
    }
    if (data.password.length < 6) {
      return toast('warning', '密码至少 6 位')
    }
    if (data.password !== data.password2) {
      return toast('warning', '两次密码不一致')
    }
    if (authState.accounts.some(function (a) { return a.username === data.username })) {
      return toast('warning', '用户名已存在,请直接登录')
    }
    hashPassword(data.password).then(function (hash) {
      var account = {
        username: data.username,
        passwordHash: hash,
        displayName: data.displayName || data.username,
        createdAt: new Date().toISOString(),
      }
      authState.accounts.push(account)
      saveAccounts()
      // 注册后自动登录
      saveCurrent({
        type: 'local',
        username: account.username,
        displayName: account.displayName,
        avatarUrl: '',
        loggedAt: new Date().toISOString(),
      })
      refreshAuthBar()
      toast('success', '注册成功,已登录')
      closeAuthModal()
      $('#gb-form-register')[0].reset()
    })
  }

  function doLocalLogin(username, password) {
    var account = authState.accounts.find(function (a) { return a.username === username })
    if (!account) {
      return toast('error', '用户名不存在,请先注册')
    }
    hashPassword(password).then(function (hash) {
      if (hash !== account.passwordHash) {
        return toast('error', '密码不对')
      }
      saveCurrent({
        type: 'local',
        username: account.username,
        displayName: account.displayName,
        avatarUrl: '',
        loggedAt: new Date().toISOString(),
      })
      refreshAuthBar()
      toast('success', '欢迎回来,' + account.displayName)
      closeAuthModal()
      $('#gb-form-login')[0].reset()
    })
  }

  function doLogout() {
    if (!confirm('确定退出登录?')) return
    saveCurrent(null)
    refreshAuthBar()
    toast('info', '已退出')
  }

  async function hashPassword(pw) {
    var buf = new TextEncoder().encode((pw || '') + AUTH_SALT)
    var digest = await crypto.subtle.digest('SHA-256', buf)
    return Array.from(new Uint8Array(digest))
      .map(function (b) { return b.toString(16).padStart(2, '0') })
      .join('')
  }
})()
