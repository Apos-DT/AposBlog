在隆腾的几个月，我做的是在既有 Spring Boot + Vue3 项目上做功能迭代——业务页面扩展、权限/表单/列表增强、数据可视化大屏。这套技术栈是国内中小企业项目最常见的组合，但**真正写好不容易**。这篇写下我的几个工程沉淀。

## 一、前后端分离的"连接处"才是工程功夫

很多人写 Spring Boot + Vue 是"两个独立项目+接口对接"，但**好的全栈项目把"连接处"当一等公民**：

- **接口规范**：统一 `{ code, msg, data }` 包络。前端拦截器一次性处理 401/500，业务层只看 data。
- **错误码字典**：后端 `enum ErrorCode` 与前端 i18n 文案一一对应，新加错误码必同步两边。
- **字段命名**：后端 `camelCase` 出 JSON，前端不要再做 snake/camel 转换层。
- **时间格式**：全用 ISO 8601 字符串，永远不要传 long 时间戳（前端 new Date(long) 会有时区坑）。

## 二、权限：JWT 不是答案的全部

很多项目把 JWT 当万能解。但实际生产里：

- **JWT 改不掉**——用户改了权限要等 token 过期？不可能。
- **JWT 太大**——把所有权限都塞进 payload，单次请求头 4KB，移动端流量灾难。

我的做法：

1. **JWT 只放 `userId + 过期时间`**，权限走 Redis 缓存 + 服务端拉取。
2. **`@PreAuthorize` 用 SpEL** 表达式控制接口级别权限：

   ```java
   @PreAuthorize("hasRole('ADMIN') or @userOwnership.canAccess(#orderId)")
   @GetMapping("/orders/{orderId}")
   public ApiResp<Order> get(@PathVariable Long orderId) { ... }
   ```

3. **数据级权限走 MyBatis 拦截器**或 JPA `@Filter`——SQL 自动追加 `WHERE created_by = ?` 这类条件。

## 三、表单：v-model 的优雅与陷阱

Vue3 的 `defineModel` 用起来很爽，但有几个坑：

- **嵌套对象 v-model 不响应**。要用 `toRefs` 或 computed 拆开。
- **Element Plus 的 `el-form` validate 是 promise**——`await formRef.value.validate()` 失败会抛异常，不会 reject false，记得 try-catch。
- **`reset` 不会清空你 watch 里改过的字段**——表单 reset 后要再次手动 emit 一次。

我写了一个通用的 `<EditableTable>` 组件，封装了：

- 行内增删改
- 单元格校验
- 提交时只 diff 变更的行（减少接口流量）
- 撤销 / 重做（基于 undo stack）

整个组件 ~200 行，但**让业务方少写了至少 10 个 CRUD 页面**。

## 四、列表：分页 / 搜索 / 排序的"沉默约定"

业务列表是项目里最重复的功能。但**80% 的列表实现都有同样的坑**：

| 坑 | 修法 |
|---|---|
| 切换搜索条件不重置 page | watch 搜索表单变化，重置 page 后再 fetch |
| 排序状态在前端，后端不知道 | 把排序字段加进 query params,用 `Sort.by(...)` 透传 JPA |
| 用户翻到第 10 页刷新就回第 1 页 | URL 同步 page/pageSize/搜索条件,用 `vue-router` query |
| 大列表前端排序卡顿 | 后端排，永远后端排 |
| 一次性查全部 + 前端分页 | 千行以下可以，万行以上一律改服务端分页 |

我现在的 list 页面套路是：

```vue
<script setup>
const route = useRoute()
const router = useRouter()

// 单一数据源:URL query
const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (v) => router.replace({ query: { ...route.query, page: v } })
})

const { data, refresh } = useFetch(`/api/orders`, {
  query: { page, pageSize: 20, ...filters }
})

watch(filters, () => page.value = 1)  // 搜索变化重置页
</script>
```

URL = 状态。**刷新页面、分享链接、浏览器后退都自然 work。**

## 五、数据可视化大屏：性能是 1，美观是 0

业务方很爱大屏，但**性能没做好的大屏就是 PPT**。

我的几个原则：

1. **ECharts 不要全量 setOption**——用 `notMerge: false` 增量更新，性能差 10 倍。
2. **图表数据走 WebSocket**——大屏一定要看到"实时"的感觉，HTTP 轮询体验差。
3. **大屏分辨率 ≠ 客户端分辨率**——做 1920×1080 设计稿，外层 `transform: scale()` 自适应到任意分辨率。
4. **暗色主题不是把白底改黑**——所有色阶要重新调，否则文字对比度全崩。
5. **不要堆 5 个以上图表**——大屏的本质是"一眼看到关键指标"，不是 dashboard 列表。

## 六、几个具体工程小技巧

- **`@Validated` + `@Valid`** 分清楚：前者放方法参数级别，后者放对象嵌套字段
- **Spring Boot 配置外置化**：`application-prod.yml` 不放敏感信息，用环境变量
- **JPA 的 `@Query` 写原生 SQL** 要小心 dialect 差异，能用 JPQL 就别写 native
- **Vue3 全局组件**用 `app.component(name, comp)` 自动注册，比每页 import 清爽
- **`pnpm` + `vite`** 起手，比 npm + webpack 快至少 5 倍

## 结束语

技术栈没有银弹。Spring Boot + Vue3 不是最酷的组合，但**它是国内中小项目最稳的组合**——招人好招、踩坑前人已踩、社区文档齐全。

把它写好，比追每个月新出的框架更值钱。

—— Apos
2025.09.18
