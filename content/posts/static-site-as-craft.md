把静态站当成一门手艺,意味着你要为每一个**像素、过渡、字距**负责。这篇拆开 APOS 博客的每一处设计决策。

## 1. 色彩:为什么是 oklch

传统 `#hex` 和 `rgb()` 都是基于设备色域的——**两个数值接近的颜色,人眼感受的差异可能完全不成比例**。oklch 不一样:它把颜色拆成`亮度 / 色度 / 色相`,**亮度变化是感知线性的**。

本站主色:

```css
--accent:      oklch(0.72 0.21 295);  /* violet  */
--accent-2:    oklch(0.78 0.18 220);  /* cyan    */
--accent-warm: oklch(0.82 0.16 60);   /* amber   */
```

三色都把 L 控制在 0.72-0.82 之间,这意味着无论用哪一个,**视觉重量是一致的**——这就是为什么你看上去不会觉得"紫色压过黄色"。

## 2. 字体:不用默认款

> 反 AI Slop 第一条:**禁 Inter / Roboto / 系统默认字体**。

不是说 Inter 不好,是它太"AI 生成感"了——满世界都在用,你的网站立刻就有了**廉价 SaaS 的同质化气质**。

本站三栈:

- **显示标题**:Space Grotesk(科技几何感,字形宽松,80px 以上很出彩)
- **正文**:Plus Jakarta Sans(开放轮廓,中文 fallback PingFang SC)
- **强调斜体**:Fraunces(可变衬线,意大利字形,做"个性化点缀")

斜体只用在**真正想说"这个词很特别"的地方**——本博客叫"the Edge of Code","the"用 Fraunces italic + amber 色,就是要让读者觉得有人在亲口说这句话。

## 3. 动效:Lenis + GSAP + IntersectionObserver

三件套各管一段:

1. **Lenis** 接管全局滚动。把惯性、缓动重写,让滚动手感从"操作系统默认"变成"作品集级别"。
2. **GSAP** 负责入场。hero 三行字按 word 拆分,从 `translateY(110%)` 用 `expo.out` ease 跳出来,stagger 0.08s。
3. **IntersectionObserver** 负责滚动揭示。原生 API,零依赖,触发后立刻 `unobserve`,**不浪费 main thread**。

性能取舍:Lenis 用 `requestAnimationFrame` 驱动,所有动画都接到 `gsap.ticker` 同一个时钟上——**只有一条心跳线**,不会出现"滚动跟动画错帧"的诡异感。

## 4. 自定义光标:dot + ring with lerp

```js
const lerp = (a, b, n) => a + (b - a) * n;
r.x = lerp(r.x, m.x, 0.16);
```

- **小点**(6px)瞬时跟手,不延迟,告诉用户"我没坏"
- **大环**(36px)用 0.16 的 lerp 系数追,**故意慢半拍**,产生黏滞感

hover 链接时大环放大到 70px——这是一个**信号设计**:不用真去框住按钮,光是大小变化就足够说"这里可以点"。

> 别在手机上加自定义光标。本站用 `@media (hover: none)` 直接隐藏。

## 5. 卡片 spotlight:CSS variable + 鼠标坐标

文章卡片 hover 时,有一团柔光跟着鼠标走。实现极简:

```css
.post-card::before {
  background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 0%),
                              oklch(0.72 0.21 295 / 0.22), transparent 40%);
}
```

JS 只做一件事——`mousemove` 时把 `--mx / --my` 写到卡片样式上。**CSS 自己负责重绘**,没有任何 JS 动画。这种"声明式动画"是我最喜欢的写法:逻辑在 JS,渲染在 CSS,各管各的。

## 6. 反 AI Slop 的具体红线

我给自己定的:

- **禁紫渐变 + emoji icon + 圆角卡左竖条**(典型 AI 生成 SaaS 长相)
- **禁伪 3D 产品图**(CSS 画不出的就别画)
- **强制 oklch**,不用 hsl()
- **斜体只在 serif 字体上用**,sans-serif italic 永远丑

这些不是设计教条,是**经验积累出来的"低端审美 trigger"**——读者潜意识看一眼,就能感觉你的站和别人不一样。

## 收束

工程师做设计最大的陷阱,是**只追求"看起来不错"**。但**好设计是可解释的**——每一个决定都该能讲清楚 why。

如果你也在做个人网站,推荐把每一个像素都拷问一遍:

> "如果换成默认值,会不会其实没什么差?"

如果答案是"没差",那你的设计可能就是装饰。如果是"差很多",那你做对了。

—— Apos
2026.05.10
