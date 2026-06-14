/**
 * AposBlog 后端 —— Express + SQLite
 * - AI 流式代理（藏 key + portfolio system prompt + IP 每日限流）
 * - 文章集 CRUD（写操作需管理口令）
 * - 留言板（公开发布/点赞 + 管理删除）
 * 监听 127.0.0.1，由 nginx 反代 /api -> 此服务
 */
const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

// ---------- 配置 ----------
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const DEEPSEEK_BASE = process.env.DEEPSEEK_BASE || 'https://api.deepseek.com';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const AI_DAILY_LIMIT = parseInt(process.env.AI_DAILY_LIMIT || '20', 10);
const AI_MSG_MAXLEN = parseInt(process.env.AI_MSG_MAXLEN || '2000', 10);
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.db');
const PORTFOLIO = JSON.parse(fs.readFileSync(path.join(__dirname, 'portfolio.json'), 'utf8'));

if (!API_KEY) console.warn('[warn] DEEPSEEK_API_KEY 未设置，/api/chat 将返回错误');
if (!ADMIN_TOKEN) console.warn('[warn] ADMIN_TOKEN 未设置，所有管理写操作将被拒绝');

// ---------- 数据库 ----------
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  tag TEXT,
  date TEXT,
  read_time TEXT,
  content TEXT,
  external INTEGER DEFAULT 0,
  url TEXT,
  created_at TEXT,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  emoji TEXT,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TEXT,
  ip TEXT
);
`);

function seedPosts() {
  if (db.prepare('SELECT COUNT(*) c FROM posts').get().c > 0) return;
  const manifestPath = path.join(__dirname, 'seed', 'manifest.json');
  if (!fs.existsSync(manifestPath)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const now = new Date().toISOString();
  const ins = db.prepare(`INSERT INTO posts (slug,title,excerpt,tag,date,read_time,content,external,url,created_at,updated_at)
    VALUES (@slug,@title,@excerpt,@tag,@date,@read_time,@content,0,NULL,@now,@now)`);
  const tx = db.transaction((list) => {
    for (const p of list) {
      const mdPath = path.join(__dirname, 'seed', 'posts', p.slug + '.md');
      const content = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
      ins.run({ slug: p.slug, title: p.title, excerpt: p.excerpt || '', tag: p.tag || '',
        date: p.date || now.slice(0, 10), read_time: String(p.readTime || ''), content, now });
    }
  });
  tx(manifest.posts || []);
  console.log(`[seed] 导入 ${(manifest.posts || []).length} 篇文章`);
}

function seedGuestbook() {
  if (db.prepare('SELECT COUNT(*) c FROM guestbook').get().c > 0) return;
  const now = new Date().toISOString();
  const ins = db.prepare('INSERT INTO guestbook (name,emoji,content,likes,created_at,ip) VALUES (?,?,?,?,?,?)');
  ins.run('Apos', '👋', '欢迎来到我的小站，留下你的足迹吧！', 2, now, 'seed');
  ins.run('访客', '🚀', '博客做得不错，知识图谱很有意思。', 1, now, 'seed');
  console.log('[seed] 导入欢迎留言');
}
seedPosts();
seedGuestbook();

// ---------- system prompt（注入真实简历）----------
function buildSystemPrompt() {
  const p = PORTFOLIO;
  const lines = [
    '你是赵祥生(Apos)个人博客的 AI 助手。下面是关于他的完整真实资料 —— 当用户(尤其是招聘者)询问他的工作经历、项目经验、技能、教育背景时,请基于这些资料用中文简洁、专业地回答。其他与他工作无关的一般性技术或闲聊问题,正常作答即可。',
    '', '【个人简介】',
    `- 姓名:${p.profile.name}(${p.profile.alias})`,
    `- 年龄 / 性别:${p.profile.age} 岁 · ${p.profile.gender}`,
    `- 所在地:${p.profile.location}`,
    `- 教育:${p.profile.education.school} · ${p.profile.education.major}(${p.profile.education.period})`,
    `- ${p.profile.education.extra}`,
    `- 语言能力:${p.profile.languages.join('、')}`,
    `- 联系:邮箱 ${p.profile.contact.email} · GitHub ${p.profile.contact.github}`,
    '', '【自我概述】', p.profile.summary,
    '', '【工作经历】',
    ...p.experience.flatMap((e) => [
      `- ${e.company} · ${e.role}(${e.period})${e.current ? ' [在职]' : ''}`,
      `  技术栈:${e.stack.join(' / ')}`,
      ...e.achievements.map((a) => `  · ${a}`),
    ]),
    '', '【项目经历】',
    ...p.projects.flatMap((proj) => [
      `- ${proj.name} · ${proj.role}(${proj.period})${proj.ongoing ? ' [进行中]' : ''}`,
      `  技术栈:${proj.stack.join(' / ')}`,
      `  概要:${proj.summary}`,
      ...proj.highlights.map((h) => `  · ${h}`),
    ]),
    '', '【技能栈】',
    `- 编程语言:${p.skills.programmingLanguages.join(' / ')}`,
    `- Web 开发:${p.skills.webDev.join(' / ')}`,
    `- ERP & 工业:${p.skills.erpAndIndustrial.join(' / ')}`,
    `- 数据 & 分析:${p.skills.dataAndAnalysis.join(' / ')}`,
    `- 工程化 & 运维:${p.skills.engineering.join(' / ')}`,
    `- AI 协作工具:${p.skills.aiTools.join(' / ')}`,
    '', '【奖项与证书】', ...p.awards.map((a) => `- ${a}`),
    '', '【兴趣方向】', ...p.interests.map((i) => `- ${i}`),
    '', '回答规则:',
    '1. 招聘类问题(做过什么、会什么、在哪工作、最近的项目),直接基于以上资料回答,不要编造未提及的项目或技术',
    '2. 资料里没有的信息,如实告知"博客资料里没有提及",而不是编造',
    '3. 回答简洁、有条理,优先用要点列举而不是长段落',
    '4. 如果用户想约面试或合作,引导发邮件到上面提供的邮箱',
  ];
  return lines.join('\n');
}
const SYSTEM_PROMPT = buildSystemPrompt();

// 动态对话 system：简历 + 后端文章(DB 实时查，新增自动包含) + 前端传来的知识库笔记
function buildChatSystem(knowledge) {
  let sys = SYSTEM_PROMPT;
  try {
    const posts = db.prepare('SELECT title,excerpt,tag,content FROM posts ORDER BY date DESC LIMIT 40').all();
    if (posts.length) {
      sys += '\n\n【本站博客文章】（可基于这些内容回答读者关于博客主题 / 某篇文章的问题，并推荐相关文章标题）';
      for (const p of posts) {
        const body = (p.content || '').replace(/\s+/g, ' ').trim().slice(0, 600);
        sys += `\n- 《${p.title}》${p.tag ? '[' + p.tag + ']' : ''} ${p.excerpt || ''}${body ? '\n  正文摘要：' + body : ''}`;
      }
    }
  } catch (e) { /* DB 查询失败不致命 */ }
  if (Array.isArray(knowledge) && knowledge.length) {
    sys += '\n\n【本站知识库笔记】（站长的学习笔记，可基于这些回答相关知识问题）';
    for (const n of knowledge.slice(0, 30)) {
      const title = (n && n.title ? String(n.title) : '').slice(0, 80);
      const content = (n && n.content ? String(n.content) : '').replace(/\s+/g, ' ').trim().slice(0, 400);
      if (title || content) sys += `\n- 《${title}》${content}`;
    }
  }
  sys += '\n\n补充：除了简历，你还能看到本站的博客文章与知识库笔记。读者问到博客主题、某篇文章、笔记里的知识时，请基于上面的内容回答并可推荐相关文章；这些资料没覆盖到的不要编造。';
  return sys;
}

// ---------- 限流（内存）----------
const aiHits = new Map();
function aiAllow(ip) {
  const day = new Date().toISOString().slice(0, 10);
  let rec = aiHits.get(ip);
  if (!rec || rec.day !== day) { rec = { day, count: 0 }; aiHits.set(ip, rec); }
  if (rec.count >= AI_DAILY_LIMIT) return false;
  rec.count++;
  return true;
}
const gbHits = new Map();
function gbAllow(ip) {
  const now = Date.now();
  const arr = (gbHits.get(ip) || []).filter((t) => now - t < 60000);
  if (arr.length >= 3) { gbHits.set(ip, arr); return false; }
  arr.push(now); gbHits.set(ip, arr);
  return true;
}

function slugify(s) {
  const base = (s || '').toString().trim().toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return base || 'post-' + Date.now().toString(36);
}

// ---------- app ----------
const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '256kb' }));

function requireAdmin(req, res, next) {
  const t = req.get('x-admin-token') || '';
  if (!ADMIN_TOKEN || t !== ADMIN_TOKEN) return res.status(401).json({ error: '需要管理员权限' });
  next();
}

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// ===== AI 流式代理 =====
app.post('/api/chat', async (req, res) => {
  if (!API_KEY) return res.status(500).json({ error: '服务器未配置 AI key' });
  const ip = req.ip || 'unknown';
  const msgs = Array.isArray(req.body && req.body.messages) ? req.body.messages : null;
  if (!msgs || !msgs.length) return res.status(400).json({ error: 'messages 不能为空' });
  const last = msgs[msgs.length - 1];
  if (!last || last.role !== 'user' || !(last.content || '').trim())
    return res.status(400).json({ error: '最后一条必须是用户消息' });
  if (last.content.length > AI_MSG_MAXLEN)
    return res.status(400).json({ error: `单条消息不能超过 ${AI_MSG_MAXLEN} 字` });
  if (!aiAllow(ip))
    return res.status(429).json({ error: `今日 AI 提问已达上限（${AI_DAILY_LIMIT} 条/天），明天再来吧` });

  const history = msgs
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content }));
  const sys = buildChatSystem(req.body && req.body.knowledge);
  const payload = { model: MODEL, messages: [{ role: 'system', content: sys }, ...history], stream: true, temperature: 0.7 };

  let upstream;
  try {
    upstream = await fetch(`${DEEPSEEK_BASE.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return res.status(502).json({ error: 'AI 服务连接失败，请稍后再试' });
  }
  if (!upstream.ok) {
    let detail = `HTTP ${upstream.status}`;
    try { const j = await upstream.json(); if (j && j.error && j.error.message) detail = j.error.message; } catch {}
    return res.status(502).json({ error: 'AI 服务错误: ' + detail });
  }
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  const nodeStream = Readable.fromWeb(upstream.body);
  nodeStream.pipe(res);
  req.on('close', () => { try { nodeStream.destroy(); } catch {} });
});

// ===== 文章集 =====
app.get('/api/posts', (req, res) => {
  const rows = db.prepare('SELECT slug,title,excerpt,tag,date,read_time as readTime,external,url FROM posts ORDER BY date DESC').all();
  res.json(rows.map((r) => ({ ...r, external: !!r.external })));
});
app.get('/api/posts/:slug', (req, res) => {
  const r = db.prepare('SELECT slug,title,excerpt,tag,date,read_time as readTime,content,external,url FROM posts WHERE slug=?').get(req.params.slug);
  if (!r) return res.status(404).json({ error: '文章不存在' });
  res.json({ ...r, external: !!r.external });
});
app.post('/api/posts', requireAdmin, (req, res) => {
  const b = req.body || {};
  if (!(b.title || '').trim()) return res.status(400).json({ error: '标题必填' });
  let slug = (b.slug || '').trim() || slugify(b.title);
  if (db.prepare('SELECT 1 FROM posts WHERE slug=?').get(slug)) slug = slug + '-' + Date.now().toString(36);
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO posts (slug,title,excerpt,tag,date,read_time,content,external,url,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    slug, b.title.trim(), b.excerpt || '', b.tag || '', b.date || now.slice(0, 10),
    String(b.readTime || ''), b.content || '', b.external ? 1 : 0, b.url || null, now, now);
  res.json({ ok: true, slug });
});
app.put('/api/posts/:slug', requireAdmin, (req, res) => {
  if (!db.prepare('SELECT 1 FROM posts WHERE slug=?').get(req.params.slug)) return res.status(404).json({ error: '文章不存在' });
  const b = req.body || {};
  const now = new Date().toISOString();
  db.prepare(`UPDATE posts SET title=COALESCE(@title,title), excerpt=COALESCE(@excerpt,excerpt),
    tag=COALESCE(@tag,tag), date=COALESCE(@date,date), read_time=COALESCE(@read_time,read_time),
    content=COALESCE(@content,content), updated_at=@now WHERE slug=@slug`).run({
    slug: req.params.slug, title: b.title ?? null, excerpt: b.excerpt ?? null, tag: b.tag ?? null,
    date: b.date ?? null, read_time: b.readTime != null ? String(b.readTime) : null, content: b.content ?? null, now,
  });
  res.json({ ok: true });
});
app.delete('/api/posts/:slug', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM posts WHERE slug=?').run(req.params.slug);
  res.json({ ok: true });
});

// ===== 留言板 =====
app.get('/api/guestbook', (req, res) => {
  const rows = db.prepare('SELECT id,name,emoji,content,likes,created_at as createdAt FROM guestbook ORDER BY id DESC LIMIT 200').all();
  res.json(rows);
});
app.post('/api/guestbook', (req, res) => {
  const ip = req.ip || 'unknown';
  const b = req.body || {};
  const name = (b.name || '').toString().trim().slice(0, 40);
  const content = (b.content || '').toString().trim().slice(0, 1000);
  const emoji = (b.emoji || '💬').toString().slice(0, 8);
  if (!name) return res.status(400).json({ error: '请填写昵称' });
  if (!content) return res.status(400).json({ error: '请填写留言内容' });
  if (!gbAllow(ip)) return res.status(429).json({ error: '留言太频繁，请稍后再试' });
  const now = new Date().toISOString();
  const info = db.prepare('INSERT INTO guestbook (name,emoji,content,likes,created_at,ip) VALUES (?,?,?,0,?,?)').run(name, emoji, content, now, ip);
  res.json({ ok: true, id: info.lastInsertRowid });
});
app.post('/api/guestbook/:id/like', (req, res) => {
  db.prepare('UPDATE guestbook SET likes = likes + 1 WHERE id=?').run(req.params.id);
  const r = db.prepare('SELECT likes FROM guestbook WHERE id=?').get(req.params.id);
  res.json({ ok: true, likes: r ? r.likes : 0 });
});
app.delete('/api/guestbook/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM guestbook WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// ===== 管理鉴权 =====
app.post('/api/admin/login', (req, res) => {
  const pw = ((req.body && req.body.password) || '').toString();
  if (!ADMIN_TOKEN || pw !== ADMIN_TOKEN) return res.status(401).json({ error: '口令错误' });
  res.json({ ok: true, token: ADMIN_TOKEN });
});
app.get('/api/admin/check', requireAdmin, (req, res) => res.json({ ok: true }));

app.listen(PORT, '127.0.0.1', () => console.log(`[aposblog-api] listening on 127.0.0.1:${PORT}`));
