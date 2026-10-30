# 无意识图谱 · Unbewusstes Atlas

一部关于无意识的档案。十六个概念、十四位人物、三十四个术语、二十二个编年节点、七篇长文，追踪哲学与精神分析双线的分岔与汇合。

> 弗洛伊德不是哲学的对立面，而是哲学终于开始听自己说话。

## 结构

| 层 | 路由 | 内容 |
|---|---|---|
| 首页 | `/` | 视觉论题、双线地形图（滚动绘制）、摘录、七篇文章索引、新栏目入口、结语 |
| 档案 | `/archive` | 16 个概念，可按线（哲学 / 精神分析 / 交汇）与年代筛选、按索引序或编年序排序 |
| 概念 | `/archive/:id` | 定义、问题、释文、引文与关键词、延伸阅读、翻转（之前 → 之后）、双线中的关联图谱 |
| 人物 | `/figures` | 14 位弗洛伊德之外的思想家，可展开核心论点、代表作与对话方 |
| 编年 | `/timeline` | 22 个关键节点，可按线与年代过滤，附必读书目 |
| 术语 | `/glossary` | 34 个术语：一句话释义 + 为什么重要，支持检索与按线过滤 |
| 文章 | `/essays` | 七篇长文的索引 |
| 长文 | `/essays/:slug` | 正文、旁注目录、引语、结语、关联档案 |

### 概念（主轴：无意识）

| # | 概念 | 线 | 提出者 |
|---|---|---|---|
| 01 | 我思 | 哲学 | 笛卡尔 |
| 02 | 意志 | 哲学 | 叔本华 |
| 03 | **无意识** | 精神分析 | 弗洛伊德 |
| 04 | 压抑 | 精神分析 | 弗洛伊德 |
| 05 | 驱力 | 精神分析 | 弗洛伊德 |
| 06 | 梦 | 精神分析 | 弗洛伊德 |
| 07 | 集体无意识 | 交汇 | 荣格 |
| 08 | 大他者 | 交汇 | 拉康 |
| 09 | 存在 | 哲学 | 海德格尔 |
| 10 | 他者 | 哲学 | 萨特 · 列维纳斯 |
| 11 | 权力/知识 | 交汇 | 福柯 |
| 12 | 死亡驱力 | 精神分析 | 弗洛伊德 · 马尔库塞 · 拉康 |
| 13 | 欲望机器 | 交汇 | 德勒兹 · 加塔利 |
| 14 | 意识形态 | 交汇 | 阿尔都塞 · 齐泽克 |
| 15 | 异化 | 哲学 | 黑格尔 · 马克思 |
| 16 | 性别的生产 | 交汇 | 波伏娃 · 巴特勒 |

### 长文

1. **在笛卡尔之后：被赶出客厅的房间** — 从「我思」到「意志」（1641–1818）
2. **无意识如何获得一个声音** — 梦、症状与聆听的技术（1900–1923）
3. **谁在说话？** — 拉康、福柯与两条「无意识」的路线之争（1964–1976）
4. **他始终没有回答「女人想要什么」** — 一个理论内部最深的裂缝（1933–1975）
5. **我们每天都在泄露自己** — 口误、遗忘与日常的无意识地形（1901）
6. **当所有人都做了同一个梦** — 战壕神经症与集体创伤（1915–1947）
7. **在中国的诊疗室里** — 精神分析跨文化的转译（1920s–今）

## 运行

```bash
pnpm install
pnpm dev      # 开发服务器
pnpm build    # 类型检查 + 生产构建（输出 dist/）
pnpm preview  # 预览构建产物
```

## 交互

| 位置 | 交互 |
|---|---|
| 导航栏 | 阅读进度细线随页面滚动；导航项悬停描边生长 |
| 首页标题 | 「我思 / 意志 / 驱力 / 无意识」循环轮换（尊重减少动效偏好） |
| 双线地形图 | 线条随滚动逐段绘制；**节点可悬停看定义、可点击进入档案**；聚焦时其余节点变淡 |
| 档案 | 按线 / 按年代筛选（URL 可分享）；**索引序 / 编年序切换**；筛选动画重播；空态可一键清除 |
| 概念页 | **关系图谱**：几何位置编码关系种类（上方为延续、下方为后继、左为对抗、右为分歧）；悬停/聚焦显示关系说明，点击或 Enter 跳转 |
| 长文 | 旁注目录、引语块、关联档案卡片、下一篇 |

全部交互可用键盘完成（Tab 聚焦、Enter / Space 激活），关系变化通过 `aria-live` 播报，按钮带 `aria-pressed`。

## 技术

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4（通过 `@tailwindcss/vite` 接入，主题变量在 `src/index.css` 的 `@theme` 中）
- react-router-dom 7（Data 路由外的 BrowserRouter）
- 无外部图片、无外部字体 CDN：字体按系统字体栈降级（思源宋体 / 宋体 → 衬线），离线可用

## 设计约定

- 色板：纸色 `#e9e5db`、墨色 `#1c1a17`、唯一强调色绯红 `#8f2f2a`；双线色为墨绿与赭色，**颜色本身承担线别编码**
- 版式：标题衬线、正文衬线、标签等宽；大量留白与 1px 细线分隔，避免卡片滥用
- 档案卡片按「古典精神分析」年代反白，形成块面节奏；筛选后最后一行的空位以「Edition note」补足，不留突兀空洞
- 动效：仅 `transform` / `opacity` / `stroke-dashoffset`；滚动进度用 120ms 轮询而非滚动事件，兼容嵌套滚动与浏览器回填；尊重 `prefers-reduced-motion`
- 状态完整：筛选无结果时有空状态与「清除筛选」，未知路由有 404 视图
- 关系图谱的中心圆按词长自适应，避免「权力/知识」这类长词溢出

## 目录

```
src/
  data/concepts.ts     12 个概念（定义、问题、释文、翻转、关联）
  data/enrichment.ts   概念的引文、延伸阅读、关键词（按 id 合并进 concepts）
  data/essays.ts       七篇长文正文
  data/timeline.ts     22 个编年节点 + 必读书目
  data/figures.ts      14 位人物
  data/glossary.ts     34 个术语
  components/          导航、页脚、卡片、双线地形图、关系图谱、基础组件
  pages/               首页、档案、概念、编年、术语、文章、长文
scripts/               shot.mjs / capture.ps1（截图）、interact.mjs / interact.ps1（交互回归测试）
docs/shots/            主要页面与交互截图
```

截图见 `docs/shots/`。

> 注意：修改组件后若开发服务器报「X is not defined」之类错误，通常是 Vite 热更新缓存过期，重启 `pnpm dev`（必要时删除 `node_modules/.vite`）即可。

## 部署到公网（Cloudflare Pages）

线上地址：**https://unconscious-atlas.pages.dev**

采用 **GitHub Actions 构建 + wrangler 发布**：每次 push 到 `main` 都会自动构建并上线，无需手动上传。

### 当前工作流

`.github/workflows/deploy.yml` 做四件事：

1. `pnpm install --frozen-lockfile`
2. `pnpm build`（产出 `dist/`）
3. `pnpm dlx wrangler@latest pages deploy dist --project-name=unconscious-atlas --branch=main`

依赖两个 GitHub 仓库 Secret（Settings → Secrets and variables → Actions）：

| Secret | 说明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token，模板选 **Edit Cloudflare Workers** |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID（Workers & Pages 页面右侧） |

### 为什么不用 wrangler-action

`cloudflare/wrangler-action@v3` 会调用它自带的 pnpm 二进制来装 wrangler，和 `pnpm/action-setup` 安装的 pnpm 冲突，报：

```
Error: The process '/home/runner/setup-pnpm/node_modules/.bin/pnpm' failed with exit code 1
```

所以改为 `pnpm dlx wrangler` 直接用项目环境里的 pnpm 执行。另外 `package.json` 里原本的 `devEngines` 会强制校验包管理器，用 npm 安装时同样报 `EBADENGINE`，已删除，只保留 `packageManager` 字段。

### 日常更新

```bash
git add -A
git commit -m "更新说明"
git push
```

推送后约 1–2 分钟自动上线，进度和日志见仓库的 **Actions** 页。历史版本可在 Cloudflare 的 **Deployments** 里回滚。

### 路由

站点使用 `BrowserRouter`，`public/_redirects` 负责把未知路径回退到 `index.html`（构建时复制进 `dist/`）：

```
/*    /index.html   200
```

`vite.config.ts` 的 `base` 必须是 `'/'`；用相对路径会让深层链接下的 JS/CSS 加载失败。

### 备选平台

仓库已包含 `netlify.toml` 与 `vercel.json`，直接导入仓库即可部署，构建命令均为 `pnpm build`，输出目录 `dist`。
