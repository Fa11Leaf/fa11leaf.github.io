# Fa11Leaf 的 Weblog

一个用来记录专业课学习过程的静态博客，同时是一次完整的 Web 学习实践：**从手写 HTML 开始，一路做到用构建工具自动生成页面**，把中间的每一步都真实走一遍。

托管目标：GitHub Pages。仓库最终合并进 [`Fa11Leaf/Fa11Leaf.github.io`](https://github.com/Fa11Leaf/Fa11Leaf.github.io)，网址为 <https://fa11leaf.github.io/>。

---

## 一、三个阶段

本站的价值不在于"最终用上了构建工具"，而在于三个阶段各自解决了什么、又留下了什么问题。

|                 | **S1 手写版**         | **S2 数据驱动**              | **S3 构建器**                    |
| --------------- | ------------------ | ------------------------ | ---------------------------------- |
| 一篇文章由什么构成       | 一整个 `.html` 文件     | `data/posts.json` 里的一个对象 | `src/content/posts/` 下的一个 `.md` 文件 |
| 新增一篇文章要动几个文件    | 2 个（新建 HTML + 改首页） | 1 个                      | **1 个，且不用碰代码**                     |
| 改一次导航栏要改几处      | 4 处                | 3 处                      | **1 处**                            |
| 页眉页脚            | 每页重复               | 每页重复                     | 只存在于布局中                            |
| 页面由谁生成          | 人手写                | 浏览器里的 JS                 | **构建时**                            |
| 关闭 JavaScript 后 | 完整显示               | 列表为空                     | **完整显示**                           |
| 图片优化            | 无                  | 无                        | **自动转 WebP、生成尺寸属性**                |
| 依赖              | 无                  | 无                        | Node + Astro                       |

**S4 构建器 + 自动部署**：不改动上表任何一条。它只把「构建」这一步从你的电脑搬到 GitHub 的服务器上自动执行——你 push 源码，剩下的交给云端。详见第八节。

三个阶段的完整代码都在 git 历史里，可随时取回：

```bash
git checkout s1-handwritten   # 看 S1 手写版
git checkout s2-data-driven   # 看 S2 数据驱动版
git checkout s3-astro         # 看 S3 构建器版
git checkout s4-cicd          # 回到 S4（当前）
```

> **一句话概括 S2 与 S3 的区别**  
> S2 的页面是浏览器**算出来**的，S3 的页面是构建时**造出来**的。  
> 前者每次访问都要重算，后者只造一次。

---

## 二、目录结构

```
weblog/
├── astro.config.mjs           构建配置（站点网址、输出模式）
├── package.json               依赖清单与命令
├── tsconfig.json              编辑器类型提示配置
├── .gitignore                 哪些东西不进版本库
├── .gitattributes             统一换行符
├── .github/
│   └── workflows/
│       └── deploy.yml         ★ S4：推送后由 GitHub 自动构建并发布
├── public/                    原样复制的文件（不参与构建处理）
│   ├── favicon.svg
│   └── .nojekyll              供 GitHub Pages 分支发布使用，见第八节
└── src/
    ├── content.config.ts      内容集合的「契约」：文章必须有哪些字段
    ├── content/
    │   └── posts/             ★ 你以后唯一需要动手的地方
    │       ├── html-basics.md
    │       ├── css-layout.md
    │       └── why-use-a-builder.md
    ├── layouts/
    │   └── BaseLayout.astro   全站外壳：页眉、导航、页脚、<head>
    ├── components/
    │   └── PostCard.astro     首页上的单张文章卡片
    ├── pages/                 文件名即网址
    │   ├── index.astro        →  /
    │   ├── about.astro        →  /about
    │   └── posts/
    │       └── [id].astro     →  /posts/任意文章名
    ├── assets/
    │   └── images/            ★ 文章配图放这里
    └── styles/
        └── global.css         全站唯一样式表
```

**`src/` 与 `public/` 的分工**——这是最容易混的地方：

|        | `src/` 下的文件                 | `public/` 下的文件               |
| ------ | --------------------------- | ---------------------------- |
| 处理方式   | 被构建工具读取、处理、打包               | 原样复制到产物里                     |
| 引用方式   | `import` 或在 Markdown 里用相对路径 | 用 `/开头` 的网址路径                |
| 图片是否优化 | **会**（转 WebP、压缩、写尺寸）        | 不会                           |
| 文件名    | 会变成 `名字.哈希.webp`            | 保持不变                         |
| 适用     | 需要处理的图片、样式、脚本               | favicon、robots.txt、需要固定网址的文件 |



---

## 三、常用命令

```bash
npm install        # 首次或依赖变化后执行，下载依赖到 node_modules/
npm run dev        # 启动开发服务器，默认 http://localhost:4321
npm run build      # 构建到 dist/，这是最终要部署的东西
npm run preview    # 本地预览构建产物（和 dev 不同，它跑的是真实产物）
```

**`dev` 和 `build` 的关系**：`dev` 是边写边看，会自动刷新，产物不落地；`build` 才是生成最终文件。`dev` 里能跑不代表 `build` 一定成功——构建时的检查更严格（比如 Front Matter 少写一个字段只会在这里报错）。

---

## 四、新增一篇文章（本阶段的核心）

**只有一步：在 `src/content/posts/` 下新建一个 `.md` 文件。**

文件开头必须有一段被 `---` 包起来的 **Front Matter**：

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

- **文章地址自动生成**：文件名 `my-post.md` → 网址 `/posts/my-post/`
- **首页卡片自动出现**，按日期从新到旧排序
- **Tags 自动显示**在文章页标题下方
- **不需要动任何 HTML、JS、JSON 文件**

来验证一次：新建 `src/content/posts/test.md`，随便写点内容，跑 `npm run build`，然后看 `dist/index.html` 里是不是多了一张卡片。

### Front Matter 字段说明

字段的规则定义在 `src/content.config.ts` 里，写错了构建会直接报错——这是内容集合相比 S2 的 JSON 最重要的改进。

| 字段            | 类型   | 必填 | 说明                            |
| ------------- | ---- | -- | ----------------------------- |
| `title`       | 文本   | 是  | 文章标题                          |
| `description` | 文本   | 是  | 摘要，显示在首页卡片和搜索引擎结果里            |
| `pubDate`     | 日期   | 是  | 写 `2026-10-05` 这种格式即可         |
| `tags`        | 文本数组 | 否  | 不写就是空数组                       |
| `draft`       | 布尔值  | 否  | 写 `true` 则不出现在列表里（默认 `false`） |

字段名**区分大小写**，`pubDate` 写成 `pubdate` 会被当作没写。

---

## 五、在文章里插入图片

### 语法

```markdown
![图片说明](../assets/images/我的图.png)
```

`![ ]` 里是替代文字（alt），`( )` 里是路径。没有这张图时浏览器显示替代文字，读屏软件也靠它告诉视障用户这里是什么。

### 图片放在哪

本站的约定是：**图片统一放在 `src/assets/images/`**。

那么从 `src/content/posts/xxx.md` 出发，路径就是：

```
src/content/posts/xxx.md          ← 你在写这个文件
src/assets/images/我的图.png      ← 图片在这里

写法：../../assets/images/我的图.png
      ↑ 退一层到 src/content/，再退一层到 src/，然后进 assets/
```

**相对路径是相对「当前这个 `.md` 文件」来算的，不是相对项目根目录。** 这是最高频的错误来源。数错一级，页面就是裂图，而且本地不报错，只有构建时才会提示找不到文件。

### 为什么值得折腾相对路径

因为图片放在 `src/` 下会被构建工具处理。实际构建产物：

```
browser-request-flow.png   43 kB   →   _astro/browser-request-flow.a3f9.webp   21 kB
css-box-model.png          27 kB   →   _astro/css-box-model.b2c1.webp          14 kB
```

同时自动生成这样的 `<img>`：

```html
<img alt="浏览器加载一个页面的四个步骤"
     loading="lazy"
     decoding="async"
     width="1200"
     height="675"
     src="/_astro/browser-request-flow.a3f9.webp">
```

三个属性都是白送的：`loading="lazy"` 让图片滚到视口才加载；`width`/`height` 让浏览器提前留出位置，避免图片加载完成时页面突然跳动；`alt` 是从 Markdown 语法里取的。

### 另一条路：`public/`

如果图片不需要优化，放进 `public/images/`，然后写 `/images/xxx.png`（以 `/` 开头表示从站点根目录算起）。

优点是不用数 `../` 的层级，任何位置写法都一样；缺点是**不会转 WebP、不会压缩**，原图多大就传多大，而且**如果你的站点部署在子路径下（比如 `/weblog/`），这种绝对路径会 404**。

### 想控制图片宽度

Markdown 语法本身做不到。用 CSS 统一管是最省事的做法，`src/styles/global.css` 里已经写了：

```css
img {
  max-width: 100%;   /* 永远不超出容器 */
  height: auto;      /* 等比缩放，不拉伸变形 */
}
```

如果需要单张图特殊处理，Astro 支持 `.mdx`，那样可以直接用 `<Image />` 组件指定宽高和格式。

---

## 六、本阶段新学到的概念

1. **组件与布局**——`<slot />` 是"预留空位"，把重复的外壳抽成一份
2. **基于文件的路由**——`src/pages/about.astro` 就是 `/about`，不用写路由配置
3. **内容集合**——用 schema 约束文章数据的格式，写错在构建时报错而不是运行时白屏
4. **Front Matter**——文件开头 `---` 之间那段元数据
5. **构建期与运行期**——本阶段最核心的认知升级，见第一节末尾那句话
6. **npm 与依赖管理**——`package.json` 声明要什么，`node_modules/` 是下载结果，`package-lock.json` 锁定精确版本
7. **源与产物**——`.gitignore` 为什么忽略 `node_modules/` 和 `dist/`：它们都能由其他文件重新生成
8. **动态路由与 `getStaticPaths`**——用一个模板文件生成 N 个真实页面
9. **构建期资源处理**——图片被读取、压缩、改格式、改文件名，最后写进 HTML 的是新地址
10. **CI/CD**——持续集成与持续部署：把「装依赖、构建、发布」交给服务器在每次推送后自动完成，见第八节
11. **最小权限原则**——工作流默认什么都做不了，需要什么能力就显式声明什么（`permissions` 那一段）

---

## 七、几个容易踩的坑

**1. 构建成功不等于 dev 时不会报错，反之亦然。**  
`npm run dev` 为了快，跳过了严格校验。以 `npm run build` 的结果为准。

**2. Markdown 里写 HTML 标签要小心。**  
Astro 7 换用了更严格的编译器，标签不闭合会直接构建失败。这和写 HTML 时是一样的要求。

**3. 修改 `content.config.ts` 里的 schema 后，旧文章可能立刻不合规。**  
比如把 `description` 改成必填，那么所有没写这个字段的文章都会构建失败。这是特性不是缺陷——它在逼你保持数据一致。

**4. `.astro` 里的普通 HTML 注释 \`\` 会被输出到最终页面里。**  
想让注释只存在于源码，用 Astro 的写法：

```astro
{/* 这条注释不会出现在最终 HTML 里 */}
```

本项目里所有模板注释都用了后一种写法。

**5. 文件名会成为网址，建议只用英文小写和连字符。**  
`我的第一篇文章.md` 会生成一串百分号编码的地址，在不同工具链里偶尔出问题。用 `my-first-post.md` 更稳。

---

## 八、部署（S4：GitHub Actions 自动构建）

### 两种发布方式

`Fa11Leaf/Fa11Leaf.github.io` 的 Pages 原本配置为 **Deploy from a branch → main → /(root)**，线上地址 <https://fa11leaf.github.io/>。

这个配置的根本限制是：**仓库里有什么，网站就是什么。** 它没有「构建」这一步，因此无法理解一个 Astro 项目。

| 维度 | 分支发布 | **Actions 构建部署** ← 本站采用 |
| --- | --- | --- |
| 网站内容等于什么 | 分支里的文件 | 构建产物 `dist/` |
| 谁执行构建 | 没有人 | GitHub 的临时服务器 |
| `dist/` 要不要进仓库 | 要（得手工提交） | **不要** |
| 源码会出现在网站上吗 | 会 | 不会 |
| 需要改设置 | 不需要 | 需要改一次 Source（仅一次） |

官方文档给的取舍建议与此一致：不需要控制构建过程时用分支发布；**一旦构建工具不是 Jekyll、或者你不想让编译产物占据一个专门的分支，就应当用 GitHub Actions 工作流发布**。本项目两个条件都满足。

### S4 做了什么

新增 `.github/workflows/deploy.yml`。它告诉 GitHub：每次 `main` 收到推送，就在云端执行 `npm ci` + `npm run build`，把 `dist/` 发布成网站。

读这个文件时重点看两处：

- **`on.push.branches: [main]`** —— 只有 `main` 分支会触发部署。推其他分支、开 Pull Request 都不会动到线上站点，可以放心拿分支做实验。
- **`withastro/action@v6`** —— Astro 官方维护的 Action，自动读取 `package-lock.json` 判定用 npm，并依次完成「装依赖 → 构建 → 上传工件」。

整个流程分两个任务：`build`（构建并上传工件）与 `deploy`（把工件正式发布）。后者写了 `needs: build`，所以**构建失败就不会部署**——这正是「构建失败没人拦」这个老问题的解药。

### 关于 `public/.nojekyll`

分支发布模式下，GitHub 会用 Jekyll 处理文件，而 **Jekyll 默认忽略所有以下划线开头的目录**——`_astro/` 会被整个丢掉，结果是 CSS 和图片全部 404，页面变成没有样式的裸 HTML。

改用 Actions 发布后，工件是**原样部署**的，Jekyll 完全不参与，因此 `.nojekyll` 不再必要。保留它是为了在迁移期间留一条「退回分支发布」的退路。

### 部署步骤（顺序很重要）

1. **先改 Source**：仓库 Settings → Pages → Source 选 **GitHub Actions**，保存
2. 在旧仓库新建分支，把本项目文件拷进去，**暂时保留**旧的 `index.html` 与 `images/`，并加入 `.gitignore`
3. 提交并推送该分支 —— **不会触发部署**，线上旧站保持不变
4. 在 GitHub 上开 Pull Request 审阅
5. 合并到 `main` —— Actions 自动构建并发布新版
6. 确认新版正常后，再提交一次删除旧的 `index.html` 与 `images/`

**为什么必须先改 Source**：如果顺序反过来，在还没改 Source 的那段时间里，Pages 仍按分支发布处理 `main` 的根目录，而那里已经没有 `index.html`（被 Astro 项目取代），网站会变成 404 或某个奇怪页面。

**为什么第 2 步要暂时保留旧文件**：切换来源那一瞬间的线上行为，我未能从官方文档中得到明确答案（文档没有说明已上线的站点是立刻下线、还是保留到下一次部署）。保留旧文件是低成本的保险；若切换后确认站点始终可用，这步可以省略。

### 为什么必须在仓库根目录

仓库名 `Fa11Leaf.github.io` 恰好是 GitHub Pages 的**用户站点专用名**（一个账号只能有一个），所以本站只能部署在该仓库的**根目录**，网址即 <https://fa11leaf.github.io/>，没有子路径。这也是 `astro.config.mjs` 里 `site` 不需要配 `base` 的原因。

### 两个容易忘记的前置条件

- 旧仓库**没有 `.gitignore`**。把本项目文件拷进去后如果直接 `git add -A`，`node_modules/`（约 144 MB、9000 多个文件）会被一并提交。务必先放入 `.gitignore` 再 `git add`。
- 提交前用 `git status --short` 逐项确认，不要无脑 `git add -A`。

**部署这一步涉及你的账号凭据，需要你本人执行。**

---

## 九、已知的取舍

- **没有开启响应式图片**（`srcset`）。开启后同一张图会生成多个尺寸，移动端加载更省流量，代价是构建变慢、产物变多。作为作业项目暂不需要。
- **没有标签页和分页**。目前文章数量少，首页一屏足够。这是下一步的自然扩展方向。
- **没有 RSS**。Astro 官方有 `@astrojs/rss` 集成，加上去不难。
- **搜索**。静态站点做客户端搜索需要引入额外方案，成本和收益暂时不匹配。

---

## 十、环境要求

- **Node.js ≥ 22.12.0**（Astro 7 的要求，`node -v` 可查）
- npm ≥ 9.6.5

本项目锁定 Astro `^7.3.5`。
