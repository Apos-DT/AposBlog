大三下学期做的一个小项目：爬取主流招聘平台的岗位数据，用 Pandas 清洗分析，最后通过 Django 做 Web 可视化展示。从 0 到 1 跑通一个完整的数据小项目，对我后来理解"数据工程链路"很有帮助。这篇把过程沉淀下来。

## 一、为什么从招聘数据切入

数据项目最难的不是技术，是**选题**。招聘数据的好处：

- **量大且公开**：主流平台都能爬到几万条
- **结构清晰**：岗位名 / 公司 / 薪资 / 地点 / 标签——天然结构化
- **分析价值明显**：求职/择业/薪资趋势都是大家关心的问题
- **不涉及隐私**：合法合规边界清楚

这种"数据天生干净 + 分析口径明确"的场景，是新手练手的最佳选择。

## 二、爬虫：为什么选 Selenium 而不是 requests

主流招聘网站现在几乎都是 SPA + 反爬，纯 `requests` 拿不到渲染后的 DOM。

**Selenium 优势**：

- 真实浏览器渲染，能拿到 JS 跑完后的内容
- 配合 `Chrome Headless`，跑在服务器上也 OK
- API 直观，xpath / CSS selector 都支持

**Selenium 劣势**：

- 慢，比 requests 慢一个数量级
- 资源占用高，几百个并发会爆内存
- 反爬升级后要不断调 selector

实战中的几个细节：

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

opts = Options()
opts.add_argument("--headless=new")
opts.add_argument("--disable-blink-features=AutomationControlled")
opts.add_experimental_option("excludeSwitches", ["enable-automation"])

driver = webdriver.Chrome(options=opts)
driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
    "source": "Object.defineProperty(navigator, 'webdriver', { get: () => undefined })"
})
```

关键 trick：**伪造 `navigator.webdriver`**，绕过常见的反自动化检测。

## 三、Pandas 清洗：80% 的工作在这里

爬下来的数据**远比想象的脏**：

- 薪资字段：`"10-15K"` / `"8000-12000元"` / `"面议"` / `"15K·14薪"`——格式至少 5 种
- 地点字段：`"北京"` / `"北京·朝阳区"` / `"北京/上海"`
- 工作经验：`"3-5年"` / `"经验不限"` / `"应届生"`

我的清洗套路：

```python
import pandas as pd
import re

def parse_salary(s):
    if not s or s == "面议": return (None, None)
    # 提取数字
    nums = [int(n) for n in re.findall(r'\d+', s)]
    if not nums: return (None, None)
    # 判断单位
    multiplier = 1000 if 'K' in s.upper() else 1
    if len(nums) >= 2:
        return (nums[0] * multiplier, nums[1] * multiplier)
    return (nums[0] * multiplier, nums[0] * multiplier)

df['salary_min'], df['salary_max'] = zip(*df['salary'].map(parse_salary))
df['salary_avg'] = (df['salary_min'] + df['salary_max']) / 2
```

**经验**：

- **不要试图一次写完美的清洗函数**——先跑一遍看哪些样本异常，再迭代
- **保留原始字段**：`salary_raw` 与 `salary_min/max` 共存，方便回溯
- **用 `value_counts()` 先看分布**：80% 的清洗 bug 是通过看分布发现的

## 四、分析维度：避免"画图秀技术"

很多人做数据可视化爱堆图——折线图、柱状图、雷达图、桑基图都来一遍。**结果是图很多，但没结论。**

我给自己定的规矩：**每一张图都要回答一个具体问题**。

| 图 | 回答的问题 |
|---|---|
| 城市薪资箱线图 | 哪个城市薪资中位数最高？分布最分散？ |
| 岗位词云 | 招聘市场最缺哪类技能？ |
| 经验-薪资散点图 | 经验和薪资是不是真的线性相关？ |
| 学历-薪资分组柱状图 | 学历溢价具体是多少？ |
| 公司规模 × 薪资 堆叠图 | 大厂 vs 中小厂的差距有多大？ |

回答不了具体问题的图，**就别画**。

## 五、Django 展示：选 Django 不选 Flask 的理由

很多人小项目第一反应是 Flask。但当你需要：

- 用户系统（管理员登录后看分析报告）
- 后台管理（手动管理爬取任务）
- ORM（数据落库 + 查询）
- 模板系统（多页面）

**Django 全都自带**。Flask 全都要自己拼。

我的 Django 项目结构：

```
recruitment_analyzer/
├── scraper/        # Selenium 爬虫,定时任务用 celery beat
├── analyzer/       # Pandas 分析逻辑
├── dashboard/      # Web 展示页面
├── api/            # REST API(给前端 ECharts 调用)
└── core/           # 共用 model / utils
```

前端用原生 HTML + ECharts，**没有上 Vue**。理由是：

- 数据展示页面不需要复杂状态
- 服务端渲染 + 异步 fetch 数据已经够
- 少一层框架等于少一类 bug

## 六、几条整体经验

1. **数据项目的瓶颈是数据质量，不是模型**。
2. **爬虫永远会失效**，写监控比写爬虫本身更重要。
3. **可视化是为了沟通，不是炫技**。
4. **存原始数据**——清洗后的数据可以重生成，原始数据丢了就丢了。
5. **小项目也要写 README + 部署文档**——三个月后的你会感谢现在的你。

## 后续

这个项目让我从"会写 Python"变成"能跑通一个数据链路"。后来做 Odoo 二开时，**ETL、字段清洗、批量处理的思路都是这时候打下的底子**。

工程能力的成长不是一条直线，而是不断在不同项目里复用同一套底层认知。

—— Apos
2025.06.08
