/**
 * jQuery Lab — 课程作业第三周交互演示
 * ----------------------------------------------
 * 9 项要求逐项映射:
 *   1. jQuery 引入与使用 ………… 文件本身 (CDN 加载 jQuery 后 IIFE 启动)
 *   2. 三类页面交互 ……………… tabs / 手风琴 / 弹窗 / 返回顶部 / 搜索筛选 / 主题切换
 *   3. 表单校验 ………………… 非空 + 邮箱格式 + 数字范围 三类
 *   4. DOM 动态操作 ……………… 任务列表 add/delete/toggle (动态创建 / 删除)
 *   5. 事件处理 ………………… click / input / change / submit / mouseover / mouseout / keydown / scroll
 *   6. jQuery 动画 (≥2) ………… fadeIn / fadeOut / slideDown / slideUp / animate (5 种)
 *   7. 数据动态更新 …………… 进度条 animate + 任务完成度 Canvas 环
 *   8. 多媒体 …………………… 自定义视频播放/暂停 / 文件上传预览 / 删除
 *   9. 代码外置 ………………… 本文件即 public/js/jquery-lab.js,在 HTML <script> 加载
 *
 * 入口:window.__initJQueryLab()  由 Vue 视图 onMounted 调用
 * 清理:window.__destroyJQueryLab() 由 onBeforeUnmount 调用,off 命名空间 .jql
 */
;(function () {
  'use strict'

  /**
   * 主入口 — 由 Vue 组件挂载后调用
   * 所有 jQuery 事件使用 .jql 命名空间,方便统一卸载
   */
  window.__initJQueryLab = function () {
    var $ = window.jQuery
    if (!$) {
      console.error('[jQueryLab] jQuery 未加载,无法启动')
      return
    }

    // 入场:卡片逐项 fadeIn (动画 ①)
    $('.jql-fade-in').hide().each(function (i) {
      $(this).delay(80 * i).fadeIn(420)
    })

    initTabs($)
    initAccordion($)
    initModal($)
    initBackToTop($)
    initSearch($)
    initThemePicker($)
    initForm($)
    initTaskList($)
    initProgressDemo($)
    initMedia($)
    initFileUpload($)
    initHoverHints($)
    initCanvasRing($)

    // 全局成功提示
    toast($, 'info', 'jQuery 已就绪 (v' + $.fn.jquery + ')')
  }

  /**
   * 卸载 — 移除所有事件 + 定时器
   */
  window.__destroyJQueryLab = function () {
    var $ = window.jQuery
    if (!$) return
    $(window).off('.jql')
    $(document).off('.jql')
    $('.jql-root *').off('.jql')
    if (window.__jqlRingTimer) {
      clearInterval(window.__jqlRingTimer)
      window.__jqlRingTimer = null
    }
  }

  // ============================================================
  // ① Tabs(选项卡切换) — click 事件
  // ============================================================
  function initTabs($) {
    $('.jql-tabs .jql-tab').on('click.jql', function () {
      var key = $(this).data('tab')
      $('.jql-tabs .jql-tab').removeClass('active')
      $(this).addClass('active')
      // 切面板时旧的 fadeOut → 新的 fadeIn
      $('.jql-tab-panel').fadeOut(150, function () {
        if ($(this).is(':last-child')) {
          $('.jql-tab-panel[data-tab="' + key + '"]').fadeIn(220)
        }
      })
    })
  }

  // ============================================================
  // ② 手风琴(展开/收起) — slideToggle
  // ============================================================
  function initAccordion($) {
    $('.jql-acc-item-head').on('click.jql', function () {
      var $body = $(this).next('.jql-acc-item-body')
      var $item = $(this).parent()
      $item.toggleClass('open')
      $body.stop(true, true).slideToggle(260)
    })
  }

  // ============================================================
  // ③ 弹窗(Modal) — fadeIn / fadeOut
  // ============================================================
  function initModal($) {
    $('#jql-open-modal').on('click.jql', function () {
      $('#jql-modal').css('display', 'flex').hide().fadeIn(220)
    })
    $('#jql-modal').on('click.jql', function (e) {
      if (e.target === this) $(this).fadeOut(180)
    })
    $('#jql-modal-close, #jql-modal-ok').on('click.jql', function () {
      $('#jql-modal').fadeOut(180)
    })
    // Esc 关闭 — keydown 事件
    $(document).on('keydown.jql', function (e) {
      if (e.key === 'Escape') $('#jql-modal').fadeOut(180)
    })
  }

  // ============================================================
  // ④ 返回顶部 — scroll 监听 + animate(scrollTop)
  // ============================================================
  function initBackToTop($) {
    var $btn = $('#jql-to-top')
    $btn.hide()
    $(window).on('scroll.jql', function () {
      if ($(window).scrollTop() > 280) {
        if (!$btn.is(':visible')) $btn.fadeIn(220)
      } else if ($btn.is(':visible')) {
        $btn.fadeOut(220)
      }
    })
    $btn.on('click.jql', function () {
      $('html, body').stop().animate({ scrollTop: 0 }, 600)
    })
  }

  // ============================================================
  // ⑤ 搜索筛选 — input 事件 + 实时过滤列表
  // ============================================================
  function initSearch($) {
    $('#jql-search').on('input.jql', function () {
      var q = $(this).val().toLowerCase().trim()
      var matched = 0
      $('.jql-search-list .jql-search-item').each(function () {
        var hit = $(this).data('keys').toLowerCase().indexOf(q) > -1
        if (q === '' || hit) {
          $(this).fadeIn(160)
          matched++
        } else {
          $(this).fadeOut(160)
        }
      })
      $('#jql-search-count').text(q ? matched + ' 条匹配' : $('.jql-search-list .jql-search-item').length + ' 条')
    })
  }

  // ============================================================
  // ⑥ 主题切换(局部) — click + 切换 .jql-root 上的 class
  // ============================================================
  function initThemePicker($) {
    $('.jql-theme-btn').on('click.jql', function () {
      var theme = $(this).data('theme')
      $('.jql-theme-btn').removeClass('active')
      $(this).addClass('active')
      $('.jql-root').removeClass('theme-paper theme-mint theme-rose').addClass('theme-' + theme)
    })
  }

  // ============================================================
  // ⑦ 表单校验(非空 + 邮箱格式 + 数字范围) — input + submit
  // ============================================================
  function initForm($) {
    // 实时校验单字段
    $('#jql-form-name').on('input.jql', function () { validateField($, $(this), 'required') })
    $('#jql-form-email').on('input.jql', function () { validateField($, $(this), 'email') })
    $('#jql-form-age').on('input.jql', function () { validateField($, $(this), 'age') })

    // 实时字数
    $('#jql-form-msg').on('input.jql', function () {
      $('#jql-form-msg-count').text($(this).val().length + ' / 200')
    })

    $('#jql-form').on('submit.jql', function (e) {
      e.preventDefault()
      var ok = true
      ok = validateField($, $('#jql-form-name'), 'required') && ok
      ok = validateField($, $('#jql-form-email'), 'email') && ok
      ok = validateField($, $('#jql-form-age'), 'age') && ok
      var $result = $('#jql-form-result')
      if (!ok) {
        $result.hide().removeClass('ok').addClass('err').slideDown(200)
          .find('.jql-form-result-text').text('× 表单未通过校验,请按红框提示修正')
        return
      }
      var data = {
        name: $('#jql-form-name').val().trim(),
        email: $('#jql-form-email').val().trim(),
        age: +$('#jql-form-age').val(),
        message: $('#jql-form-msg').val().trim(),
      }
      $result.hide().removeClass('err').addClass('ok').slideDown(220)
        .find('.jql-form-result-text').text(
          '✓ 校验通过 · 收到 ' + data.name + ' 的留言 (' + data.email + ',年龄 ' + data.age + ')'
        )
      // 6 秒后收起
      setTimeout(function () { $result.slideUp(200) }, 6000)
    })

    $('#jql-form').on('reset.jql', function () {
      setTimeout(function () {
        $('.jql-field').removeClass('is-error is-ok')
        $('.jql-field-tip').text('')
        $('#jql-form-result').hide()
        $('#jql-form-msg-count').text('0 / 200')
      }, 0)
    })
  }

  /**
   * 单字段校验
   * @returns {boolean} true 表示通过
   */
  function validateField($, $input, rule) {
    var v = $input.val().trim()
    var $field = $input.closest('.jql-field')
    var $tip = $field.find('.jql-field-tip')
    var ok = true
    var msg = ''

    switch (rule) {
      case 'required':
        if (!v) { ok = false; msg = '× 不能为空' }
        else if (v.length < 2) { ok = false; msg = '× 至少 2 个字符' }
        else { msg = '✓ ' + v.length + ' 个字符' }
        break
      case 'email':
        if (!v) { ok = false; msg = '× 不能为空' }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { ok = false; msg = '× 邮箱格式不对' }
        else { msg = '✓ 邮箱格式正确' }
        break
      case 'age':
        if (!v) { ok = false; msg = '× 不能为空' }
        else if (!/^\d+$/.test(v)) { ok = false; msg = '× 必须是整数' }
        else {
          var n = +v
          if (n < 0 || n > 150) { ok = false; msg = '× 需在 0–150 之间' }
          else { msg = '✓ 年龄合法' }
        }
        break
    }

    $field.removeClass('is-error is-ok').addClass(ok ? 'is-ok' : 'is-error')
    $tip.text(msg)
    return ok
  }

  // ============================================================
  // ⑧ 任务列表(动态 DOM) — click 增 / 删 / toggle done
  // ============================================================
  function initTaskList($) {
    var seed = [
      { text: '完成 jQuery 实验页', done: true },
      { text: '把 9 项要求全部实现', done: false },
      { text: '推到 GitHub Pages 上线', done: false },
    ]
    seed.forEach(function (t) { addTaskDom($, t.text, t.done, false) })
    updateTaskStats($)

    $('#jql-task-add').on('click.jql', function () {
      var v = $('#jql-task-input').val().trim()
      if (!v) {
        $('#jql-task-input').focus()
        toast($, 'warning', '任务内容不能为空')
        return
      }
      addTaskDom($, v, false, true)
      $('#jql-task-input').val('')
      updateTaskStats($)
    })

    // 回车提交
    $('#jql-task-input').on('keydown.jql', function (e) {
      if (e.key === 'Enter') $('#jql-task-add').click()
    })

    // 事件委托 — 处理动态生成的 DOM
    $('#jql-task-list').on('click.jql', '.jql-task-del', function () {
      var $li = $(this).closest('.jql-task')
      $li.slideUp(180, function () {
        $(this).remove()
        updateTaskStats($)
      })
    })
    $('#jql-task-list').on('change.jql', '.jql-task-check', function () {
      var $li = $(this).closest('.jql-task')
      $li.toggleClass('done', this.checked)
      updateTaskStats($)
    })

    // 清空已完成
    $('#jql-task-clear').on('click.jql', function () {
      var $done = $('.jql-task.done')
      if (!$done.length) {
        toast($, 'info', '没有已完成的任务')
        return
      }
      $done.fadeOut(220, function () {
        $(this).remove()
        if (!$('.jql-task.done').length) updateTaskStats($)
      })
    })
  }

  function addTaskDom($, text, done, animated) {
    var id = 't_' + Math.random().toString(36).slice(2, 8)
    var html =
      '<li class="jql-task' + (done ? ' done' : '') + '">' +
        '<label class="jql-task-label">' +
          '<input type="checkbox" class="jql-task-check"' + (done ? ' checked' : '') + ' />' +
          '<span class="jql-task-text"></span>' +
        '</label>' +
        '<button class="jql-task-del" type="button" title="删除">×</button>' +
      '</li>'
    var $li = $(html)
    $li.find('.jql-task-text').text(text)
    if (animated) {
      $li.hide()
      $('#jql-task-list').append($li)
      $li.slideDown(220)
    } else {
      $('#jql-task-list').append($li)
    }
    return $li
  }

  function updateTaskStats($) {
    var total = $('.jql-task').length
    var done = $('.jql-task.done').length
    var pct = total ? Math.round((done / total) * 100) : 0
    $('#jql-task-total').text(total)
    $('#jql-task-done').text(done)
    // 数据动态更新到进度条 (动画 ②)
    $('#jql-task-progress-fill').stop().animate({ width: pct + '%' }, 500)
    $('#jql-task-progress-text').text(pct + '%')
    // 数据动态更新到 Canvas 环
    drawTaskRing($, pct)
  }

  // ============================================================
  // ⑨ 进度条 demo — animate + 数字 tween
  // ============================================================
  function initProgressDemo($) {
    $('#jql-progress-go').on('click.jql', function () {
      var target = Math.max(0, Math.min(100, +$('#jql-progress-target').val() || 0))
      $('#jql-progress-fill').stop().animate({ width: target + '%' }, 1200)
      $({ n: parseInt($('#jql-progress-num').text(), 10) || 0 })
        .stop()
        .animate({ n: target }, {
          duration: 1200,
          step: function () { $('#jql-progress-num').text(Math.floor(this.n) + '%') },
          complete: function () { $('#jql-progress-num').text(target + '%') },
        })
    })
  }

  // ============================================================
  // ⑩ 多媒体控制 — 自定义视频按钮
  // ============================================================
  function initMedia($) {
    var $v = $('#jql-video')
    if (!$v.length) return
    $('#jql-video-play').on('click.jql', function () { $v[0].play() })
    $('#jql-video-pause').on('click.jql', function () { $v[0].pause() })
    $('#jql-video-restart').on('click.jql', function () { $v[0].currentTime = 0; $v[0].play() })

    $v.on('play.jql', function () { $('#jql-video-status').text('播放中').addClass('playing') })
    $v.on('pause.jql', function () { $('#jql-video-status').text('已暂停').removeClass('playing') })
    $v.on('ended.jql', function () { $('#jql-video-status').text('播放完毕').removeClass('playing') })
  }

  // ============================================================
  // ⑪ 文件上传与删除 — change + 预览 + 删除按钮
  // ============================================================
  function initFileUpload($) {
    $('#jql-file').on('change.jql', function () {
      var files = this.files
      if (!files || !files.length) return
      Array.prototype.forEach.call(files, function (f) {
        addFileItem($, f)
      })
      this.value = ''
      refreshFileEmpty($)
    })

    // 委托给 删除按钮
    $('#jql-file-list').on('click.jql', '.jql-file-del', function () {
      var $item = $(this).closest('.jql-file-item')
      var url = $item.data('url')
      if (url) URL.revokeObjectURL(url)
      $item.fadeOut(180, function () {
        $(this).remove()
        refreshFileEmpty($)
      })
    })

    refreshFileEmpty($)
  }

  function addFileItem($, file) {
    var url = file.type.indexOf('image/') === 0 ? URL.createObjectURL(file) : ''
    var size = formatBytes(file.size)
    var $item = $(
      '<li class="jql-file-item">' +
        '<div class="jql-file-thumb">' +
          (url
            ? '<img src="' + url + '" alt="" />'
            : '<span>' + (file.name.split('.').pop() || 'F').toUpperCase().slice(0, 4) + '</span>') +
        '</div>' +
        '<span class="jql-file-name"></span>' +
        '<span class="jql-file-size">' + size + '</span>' +
        '<button class="jql-file-del" type="button" title="删除">×</button>' +
      '</li>'
    )
    if (url) $item.data('url', url)
    $item.find('.jql-file-name').text(file.name)
    $item.hide()
    $('#jql-file-list').append($item)
    $item.fadeIn(260)
  }

  function refreshFileEmpty($) {
    var has = $('#jql-file-list .jql-file-item').length > 0
    $('#jql-file-empty').toggle(!has)
  }

  function formatBytes(n) {
    if (n < 1024) return n + ' B'
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB'
    return (n / 1048576).toFixed(2) + ' MB'
  }

  // ============================================================
  // ⑫ Hover 提示 — mouseover / mouseout (事件要求覆盖)
  // ============================================================
  function initHoverHints($) {
    $('.jql-hover-target').on('mouseover.jql', function () {
      $(this).find('.jql-hover-hint').stop(true, true).fadeIn(160)
    }).on('mouseout.jql', function () {
      $(this).find('.jql-hover-hint').stop(true, true).fadeOut(120)
    })
  }

  // ============================================================
  // ⑬ Canvas 任务环 — 数据动态更新
  // ============================================================
  function drawTaskRing($, pct) {
    var canvas = document.getElementById('jql-task-ring')
    if (!canvas) return
    var ctx = canvas.getContext('2d')
    var w = canvas.width
    var h = canvas.height
    var cx = w / 2, cy = h / 2
    var r = Math.min(w, h) / 2 - 12
    ctx.clearRect(0, 0, w, h)

    // 底环
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.lineWidth = 10
    ctx.strokeStyle = '#e2e8f0'
    ctx.stroke()

    // 进度环
    if (pct > 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (pct / 100))
      var grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, '#7c3aed')
      grad.addColorStop(1, '#0891b2')
      ctx.strokeStyle = grad
      ctx.lineWidth = 10
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    // 文字
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 24px Space Grotesk, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pct + '%', cx, cy - 2)
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.fillStyle = '#64748b'
    ctx.fillText('完成度', cx, cy + 18)
  }

  function initCanvasRing($) {
    drawTaskRing($, 0)
  }

  // ============================================================
  // Toast 提示 — fadeIn / setTimeout / fadeOut
  // ============================================================
  function toast($, kind, text) {
    var $t = $(
      '<div class="jql-toast jql-toast-' + kind + '">' +
        '<span class="jql-toast-text"></span>' +
      '</div>'
    )
    $t.find('.jql-toast-text').text(text)
    $t.hide()
    $('#jql-toast-stack').append($t)
    $t.fadeIn(220)
    setTimeout(function () {
      $t.fadeOut(220, function () { $(this).remove() })
    }, 2400)
  }
})()
