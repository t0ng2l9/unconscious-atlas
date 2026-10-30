# 无意识图谱 · Unbewusstes Atlas

一部关于无意识的档案。十二个概念、三篇长文，追踪哲学与精神分析双线的分岔与汇合。

> 弗洛伊德不是哲学的对立面，而是哲学终于开始听自己说话。

## 结构

| 层 | 路由 | 内容 |
|---|---|---|
| 首页 | `/` | 视觉论题、双线地形图（滚动绘制）、摘录、文章索引、结语 |
| 档案 | `/archive` | 12 个概念，可按线（哲学 / 精神分析 / 交汇）与年代筛选；筛选状态记在 URL |
| 概念 | `/archive/:id` | 定义、问题、释文、翻转（之前 → 之后）、双线中的关联条目 |
| 文章 | `/essays` | 三篇长文的索引 |
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

### 长文

1. **在笛卡尔之后：被赶出客厅的房间** — 从「我思」到「意志」（1641–1818）
2. **无意识如何获得一个声音** — 梦、症状与聆听的技术（1900–1923）
3. **谁在说话？** — 拉康、福柯与两条「无意识」的路线之争（1964–1976）

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
  data/essays.ts       三篇长文正文
  components/          导航、页脚、卡片、双线地形图、关系图谱、基础组件
  pages/               首页、档案、概念、文章、长文
scripts/               shot.mjs / capture.ps1（截图）、interact.mjs / interact.ps1（交互回归测试）
docs/shots/            主要页面与交互截图
```

截图见 `docs/shots/`。

> 注意：修改组件后若开发服务器报「X is not defined」之类错误，通常是 Vite 热更新缓存过期，重启 `pnpm dev`（必要时删除 `node_modules/.vite`）即可。

## 部署到公网（Cloudflare Pages）

这是纯静态站点，推荐 **GitHub 仓库 + Cloudflare Pages** 自动部署：推代码即上线，免费，稳定且国内可访问。

### 1. 推送到 GitHub

```bash
cd unconscious-atlas
git add -A
git commit -m "无意识图谱：初版"
# 在 github.com 上新建一个空仓库（建议私有），不要勾选 README/License
git remote add origin https://github.com/<你的用户名>/unconscious-atlas.git
git push -u origin main
```

首次 push 会要求登录；推荐用 GitHub 的 Personal Access Token 当密码，或在 GitHub Desktop 里操作。

### 2. 在 Cloudflare Pages 创建项目

1. 打开 [dash.cloudflare.com](https://dash.cloudflare.com) → 左侧 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 GitHub，选择刚建的 `unconscious-atlas` 仓库
3. 填构建配置：

   | 字段 | 值 |
   |---|---|
   | Framework preset | None |
   | Build command | `pnpm build` |
   | Build output directory | `dist` |
   | 环境变量 `NODE_VERSION` | `22` |

4. 点 **Save and Deploy**，一两分钟后就得到 `https://unconscious-atlas-xxx.pages.dev` 这样的网址。

> 仓库里的 `pnpm-lock.yaml` 会让 Cloudflare 自动用 pnpm，无需额外配置。

### 3. 关于路由（已经处理好了）

站点用的是 `BrowserRouter`，直接访问 `/archive/dream` 这类深层链接时，静态托管需要把未知路径回退到 `index.html`。仓库里的 `public/_redirects` 已写入规则，构建时会复制进 `dist/`，Cloudflare Pages 会自动识别：

```
/*    /index.html   200
```

`vite.config.ts` 的 `base` 也已从 `'./'` 改为 `'/'`——用相对路径会导致深层链接下的 JS/CSS 加载失败。

### 4. 以后更新

改完代码 `git add -A && git commit -m "..." && git push`，Cloudflare 会自动重新构建并发布。在 Pages 项目的 **Deployments** 里能看到每次部署记录，也能一键回滚。

### 备选方案

- **Vercel / Netlify**：同样连 GitHub，构建命令和输出目录一致；Netlify 需要在根目录加一个 `netlify.toml` 写 `[[redirects]]` 规则，Vercel 需要在根目录放 `vercel.json` 写 rewrites。需要的话我可以补上。
- **不想连 GitHub**：本地装 `wrangler` 后执行 `npx wrangler pages deploy dist` 也能直接上传，但每次都要手动跑。
