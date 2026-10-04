# Fa11Leaf 的 Weblog · 项目文档

以 [Astro](https://astro.build/) 构建、托管于 GitHub Pages 的静态个人博客。

- 线上地址：[https://fa11leaf.github.io/](https://fa11leaf.github.io/)
- 源码仓库：[https://github.com/Fa11Leaf/Fa11Leaf.github.io](https://github.com/Fa11Leaf/Fa11Leaf.github.io)
- 许可：[MIT](LICENSE)



---

## 一、项目概览

### 是什么

黄睿竣（西南交通大学，大功率半导体科学与工程专业）的个人 Weblog。它既是专业课程作业，也是大学四年的学习与工作日志，性质上更接近一份持续更新的个人简历。

- 作者：黄睿竣
- GitHub：[@Fa11Leaf](https://github.com/Fa11Leaf)

### 站点形态

纯静态。构建期把所有页面预先渲染为真实的 `.html` 文件，访客拿到的是完整 HTML——不依赖任何服务端程序，也不需要浏览器执行 JavaScript 才能看到正文。托管在 GitHub Pages，由 GitHub Actions 在每次向 `main` 推送时于云端构建并发布。

### 当前状态

| 项          | 值                                         | 依据                   |
| ----------- | ------------------------------------------ | ---------------------- |
| 包名 / 版本 | `weblog` / `3.0.0`（`private`）      | `package.json`       |
| 最新提交    | `Alpha0.1.0`                             | `git log`            |
| 开发分支    | `astro-migration`（`main` 为发布分支） | `git branch`         |
| 文章数量    | 1 篇                                       | `src/content/posts/` |
| 许可        | MIT                                        | `LICENSE`            |

---

## 二、技术栈与运行环境

### 依赖

技术选型全部集中在 `package.json`：

- **Astro `^7.3.5`** —— 唯一的运行时依赖。`dependencies` 中只有这一项，没有引入任何 UI 框架、CSS 框架或客户端脚本库。
- **输出模式 `static`** —— 见 `astro.config.mjs`。构建时把每个页面渲染成真正的 `.html` 文件。
- **`site: 'https://fa11leaf.github.io'`** —— 作用是让 Astro 生成正确的绝对地址（供 canonical 链接、未来的 RSS 等使用），站点部署在域名根路径，因此**不需要**配置 `base`。

### 环境要求

| 项      | 要求       | 说明                               |
| ------- | ---------- | ---------------------------------- |
| Node.js | ≥ 22.12.0 | Astro 7 的要求，用`node -v` 自查 |
| npm     | ≥ 9.6.5   | Astro 7 的要求                     |

CI 侧无需额外配置：`withastro/action@v6` 默认使用 Node 24，满足上述要求。

### TypeScript

本项目不是 TypeScript 项目。`tsconfig.json` 只做两件事：

1. 让编辑器正确解析 `.astro` 文件（避免满屏报错）；
2. 为 `astro:content` 这类虚拟模块提供类型提示。

配置为 `extends: "astro/tsconfigs/base"`，另外开启 `strictNullChecks`（要求处理可能为空的情况）与 `allowJs`。`.astro` 文件 `---` 之间的代码完全可以只写普通 JavaScript，不写任何类型标注也能正常运行。

---

## 三、快速开始

```bash
npm install        # 安装依赖到 node_modules/（首次或依赖变化后执行）
npm run dev        # 启动开发服务器，默认 http://localhost:4321
npm run build      # 构建到 dist/，这是最终要部署的内容
npm run preview    # 本地预览 dist/ 中的构建产物
```

**`dev` 与 `build` 的校验强度不同。** `dev` 为了速度跳过部分严格校验，`build` 会逐篇检查内容集合的 Front Matter（见第五节）。因此**以 `npm run build` 的结果为准**：`dev` 下能正常显示，不代表构建能通过。

---

## 四、目录结构

```
fa11leaf.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          推送 main 后自动构建并发布，见第七节
├── public/                     原样复制进产物的文件，不参与构建处理
│   ├── .nojekyll               供"分支发布"模式使用，见 7.4
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── my_github_profile_picture.jpg   首页头像（全站唯一图片）
│   ├── components/
│   │   └── PostCard.astro      首页的单张文章卡片
│   ├── content/
│   │   └── posts/              文章正文，新增文章只需在此建 .md 文件
│   │       └── my-first-web.md
│   ├── layouts/
│   │   └── BaseLayout.astro    全站外壳：head / header / nav / main / footer
│   ├── pages/                  文件名即网址
│   │   ├── index.astro         →  /
│   │   ├── about.astro         →  /about
│   │   └── posts/
│   │       └── [id].astro      →  /posts/<文章 id>/
│   ├── styles/
│   │   └── global.css          全站唯一样式表，422 行
│   └── content.config.ts       内容集合的定义与 schema 校验
├── astro.config.mjs            站点地址与输出模式
├── package.json                依赖清单与命令
├── package-lock.json           锁定依赖精确版本；CI 据此判定使用 npm
├── tsconfig.json               编辑器类型提示配置
├── .gitignore                  忽略 node_modules/ 与 dist/
├── .gitattributes              统一换行符为 LF，图片等按二进制处理
├── LICENSE                     MIT
└── README.md               	本文件
```

### `src/` 与 `public/` 的分工

这是最容易混淆的一处，判断依据是**是否需要被构建工具处理**：

|          | `src/` 下的文件                              | `public/` 下的文件                      |
| -------- | ---------------------------------------------- | ----------------------------------------- |
| 处理方式 | 被读取、处理、打包                             | 原样复制到产物                            |
| 引用方式 | `.astro` 中 `import`；`.md` 中用相对路径 | 以`/` 开头的站点路径                    |
| 是否优化 | **会**（转 WebP、压缩、补生成尺寸属性）  | 不会                                      |
| 文件名   | 变为`名字.哈希.webp`                         | 保持不变                                  |
| 适用场景 | 需要优化的图片、样式、脚本                     | favicon、`robots.txt`、需固定网址的文件 |

---

## 五、内容与资源

### 5.1 内容集合

定义在 `src/content.config.ts`。它由两部分组成：

- **loader** 回答"文章从哪来"：

  ```js
  glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' })
  ```

  `base` 是相对**项目根目录**的路径，不是相对该配置文件。`.md` 与 `.mdx` 都会被收录。
- **schema** 回答"一篇文章长什么样"：用 Zod 逐篇校验，不合规直接**构建失败**，而不是等到运行时白屏。

### 5.2 Front Matter 字段

每篇文章开头的 `---` 之间是元数据，字段规则由 schema 定义：

| 字段            | 类型     | 必填 | 默认值    | 说明                                                          |
| --------------- | -------- | ---- | --------- | ------------------------------------------------------------- |
| `title`       | 文本     | 是   | —        | 文章标题                                                      |
| `description` | 文本     | 是   | —        | 摘要，用于首页卡片与`<meta name="description">`             |
| `pubDate`     | 日期     | 是   | —        | 写`2026-10-04` 或 `"2026-10-04"` 均可，最终转为 Date 对象 |
| `tags`        | 文本数组 | 否   | `[]`    | 显示在文章页标题下方；为空时不渲染标签列表                    |
| `draft`       | 布尔值   | 否   | `false` | 为`true` 时该文章不出现在首页列表中                         |

字段名**区分大小写**：`pubDate` 写成 `pubdate` 会被视为未填写，从而构建失败。

### 5.3 新增一篇文章

**只需一步：在 `src/content/posts/` 下新建一个 `.md` 文件。**

```markdown
---
title: 文章标题
description: 一句话摘要，显示在首页卡片上。
pubDate: 2026-10-05
tags:
  - 标签一
  - 标签二
---

## 第一节

正文从这里开始，用 Markdown 写。
```

保存后：

- **网址自动生成**：`my-post.md` → `/posts/my-post/`
- **首页卡片自动出现**，按 `pubDate` 从新到旧排序；日期相同时以标题按 `zh-CN` 排序兜底，保证每次构建顺序一致
- **标签自动显示**在文章标题下方
- **不需要改动任何 HTML、JavaScript 或 JSON 文件**

### 5.4 图片：两条路径

|          | `src/assets/images/`                         | `public/`                |
| -------- | ---------------------------------------------- | -------------------------- |
| 处理方式 | 构建期读取、压缩、转 WebP、重命名              | 原样复制                   |
| 引用方式 | `.astro` 中 `import`；`.md` 中写相对路径 | 以`/` 开头的站点绝对路径 |
| 是否优化 | 会                                             | 不会                       |
| 适用     | 需要优化的配图                                 | favicon、需固定地址的文件  |

放在 `src/` 下时，`.md` 中的相对路径是**相对当前这个 `.md` 文件**、而非项目根目录计算的，这是最高频的错误来源：

```
src/content/posts/xxx.md          ← 你正在写的文件
src/assets/images/图片.png        ← 图片位置

写法：../../assets/images/图片.png
      ↑ 退到 src/content/，再退到 src/，然后进入 assets/
```

数错层级会导致裂图，且本地不报错，只有构建时才会提示找不到文件。

### 5.5 构建期处理的实证

本站目前唯一的图片资源是首页头像，可作为完整实例。

```
源文件  src/assets/images/my_github_profile_picture.jpg            10,181 字节
产物    dist/_astro/my_github_profile_picture.BYWNPHOL_2c41eq.webp   8,418 字节   （约 -17%）
```

构建产物中生成的 `<img>` 标签：

```html
<img src="/_astro/my_github_profile_picture.BYWNPHOL_2c41eq.webp"
     alt="Fa11Leaf 的头像"
     loading="lazy"
     decoding="async"
     width="220"
     height="220"
     class="avatar">
```

三点说明：

1. `loading="lazy"` 与 `decoding="async"` 由 Astro 自动补上——图片滚到视口才加载，且解码不阻塞渲染。
2. `width` / `height` 取自源图的固有尺寸（220×220），作用是让浏览器提前预留位置，避免图片加载完成时页面跳动。它**不等于**最终显示尺寸：实际显示由 CSS 决定（`global.css` 中 `.avatar` 为 72×72 圆形，`object-fit: cover`）。
3. `alt` 在这里是**显式传入**的——该头像在 `src/pages/index.astro` 中通过 `import` 引入后传给 `<Image />` 组件的 `alt` 属性。这与 Markdown 中 `![说明](路径)` 自动取 `alt` 的方式不同。

> **一处现状说明**：文章正文目前尚未使用配图，因此 5.4 中"在 `.md` 里写相对路径"是本站的**约定**而非既有实例；写法本身有效，但当前仓库中没有可对照的用例。

---

## 六、页面、路由与渲染时机

### 6.1 基于文件的路由

`src/pages/` 下的文件名直接决定网址，无需任何路由配置：

| 源文件                         | 产出网址              | 说明                             |
| ------------------------------ | --------------------- | -------------------------------- |
| `src/pages/index.astro`      | `/`                 | 首页：头像 + 文章列表            |
| `src/pages/about.astro`      | `/about`            | 关于页                           |
| `src/pages/posts/[id].astro` | `/posts/<文章 id>/` | 动态路由，为每篇文章生成一个页面 |

### 6.2 动态路由

方括号表示动态路由：它不是固定地址，而是一个模板。`getStaticPaths()` 向构建器提供"一共有哪些页面、每个页面对应什么数据"的清单，构建时 Astro 按清单把模板运行若干遍，每篇生成一个**真实存在**的 HTML 文件。

`post.id` 来自文件名，因此 `my-first-web.md` 对应 `/posts/my-first-web/`，其产物为 `dist/posts/my-first-web/index.html`。

### 6.3 布局与组件

- **`src/layouts/BaseLayout.astro`** —— 全站外壳（`<head>`、`<header>`、`<nav>`、`<main>`、`<footer>`）。页面自身的内容通过 `<slot />` 注入，外壳只维护一份。
  - 导航项集中在 `navItems` 数组中，新增或修改导航只需改这一处；
  - `aria-current="page"` 由布局根据 `Astro.url.pathname` 自动计算，不靠手工标记；
  - `title` / `description` 由各页面作为参数传入，布局补上站点名后缀。
- **`src/components/PostCard.astro`** —— 首页的单张文章卡片。参数类型为 `CollectionEntry<'posts'>`，即 `post.data` 下必有 schema 中声明的字段。

### 6.4 渲染时机

文章列表与正文均在**构建期**渲染为 HTML，浏览器不做任何填充工作。实测产物：

| 产物文件                               | 体积       | 内容                                      |
| -------------------------------------- | ---------- | ----------------------------------------- |
| `dist/index.html`                    | 1,333 字节 | 含 1 张文章卡片，卡片是真实的`<a>` 标签 |
| `dist/about/index.html`              | 1,231 字节 | 关于页                                    |
| `dist/posts/my-first-web/index.html` | 1,037 字节 | 文章页                                    |

三个页面均不包含用于填充内容的客户端脚本。全站样式表 `src/styles/global.css`（422 行）在构建后合并为 `dist/_astro/BaseLayout.BQC_RjkO.css`（4,131 字节），由布局统一引入。

---

## 七、部署

### 7.1 工作流

站点由 `.github/workflows/deploy.yml` 自动部署。读该文件时关注以下要点：

| 段落                         | 内容                                                        | 作用                                                                                                                |
| ---------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `on.push.branches: [main]` | 仅`main` 分支推送时触发                                   | 推其他分支、开 Pull Request 都不会影响线上站点，可放心用分支做实验                                                  |
| `on.workflow_dispatch`     | 允许手动触发                                                | 可在仓库 Actions 页面点 "Run workflow"                                                                              |
| `permissions`              | `contents: read` / `pages: write` / `id-token: write` | 遵循最小权限原则，默认无权限，需要什么显式声明什么                                                                  |
| `concurrency`              | `group: pages`，`cancel-in-progress: false`             | 同时只跑一个部署，新任务排队而非中断进行中的部署                                                                    |
| `build` 任务               | `actions/checkout@v7` + `withastro/action@v6`           | 官方 Action 自动读取`package-lock.json` 判定使用 npm，依次执行 `npm ci` → `npm run build` → 上传 Pages 工件 |
| `deploy` 任务              | `needs: build` + `actions/deploy-pages@v5`              | 发布工件，并把访问地址回填到 Actions 页面                                                                           |

两个任务之间存在 `needs: build` 依赖，因此**构建失败就不会部署**。

### 7.2 一次性设置

仓库的 Pages 来源需要改为 **GitHub Actions**：仓库 Settings → Pages → Source → 选择 `GitHub Actions` 并保存。此项只需设置一次，但**顺序很重要**：

1. **先**把 Source 改为 GitHub Actions；
2. 在分支上提交并推送代码（不会触发部署，线上站点保持不变）；
3. 开 Pull Request 审阅后合并到 `main` → 自动构建并发布。

**顺序不能颠倒。** 若在 Source 尚未切换时就把 `main` 根目录换成 Astro 项目，Pages 仍会按"分支发布"模式读取根目录，而那里已没有 `index.html`，站点会变成 404 或异常页面。

### 7.3 两条前置约束

- **仓库必须位于根目录。** 仓库名 `Fa11Leaf.github.io` 是 GitHub Pages 的**用户站点专用名**（一个账号只能有一个），因此站点只能部署在该仓库根目录，网址为 [https://fa11leaf.github.io/](https://fa11leaf.github.io/)，没有子路径。这也是 `astro.config.mjs` 不需要配置 `base` 的原因。
- **不要提交产物。** `node_modules/`（数百 MB、约九千个文件）与 `dist/` 均已写入 `.gitignore`——二者都能由源文件重新生成。提交前建议用 `git status --short` 逐项确认，不要直接 `git add -A`。

### 7.4 关于 `public/.nojekyll`

在"分支发布"模式下，GitHub 会用 Jekyll 处理文件，而 Jekyll 默认忽略所有以下划线开头的目录——`_astro/` 会被整个丢弃，导致 CSS 与图片全部 404，页面退化为无样式的裸 HTML。

改用 Actions 发布后，工件是**原样部署**的，Jekyll 完全不参与，该文件已非必需。保留它是为了在必要时留一条退回分支发布的退路。

---

## 八、已知限制与后续方向

以下为当前版本有意未做的部分，逐条说明现状与取舍：

| 项         | 现状   | 说明                                                                    |
| ---------- | ------ | ----------------------------------------------------------------------- |
| 标签页     | 未实现 | 文章页会显示标签，但没有按标签聚合的列表页                              |
| 分页       | 未实现 | 文章数量少，首页一屏足够                                                |
| RSS        | 未实现 | Astro 官方提供`@astrojs/rss` 集成，接入成本较低，属下一步备选         |
| 响应式图片 | 未开启 | 开启后同一张图会生成多个尺寸，移动端更省流量，代价是构建变慢、产物变多  |
| 搜索       | 未实现 | 静态站点做客户端搜索需引入额外方案（如 Pagefind），当前成本与收益不匹配 |

---

## 九、许可

本项目采用 **MIT License**，Copyright (c) 2026 Fa11Leaf。详见仓库根目录的 [`LICENSE`](LICENSE)。
