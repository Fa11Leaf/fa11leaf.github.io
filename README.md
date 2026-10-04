# Fa11Leaf 的博客

个人博客的**公开站点**源码。Nuxt 4 + Vue 3 + Vite，构建期生成纯静态页面，
发布在 GitHub Pages 的用户站点根路径：<https://fa11leaf.github.io/>

写作后台在另一个仓库（`weblog-fullstack`），它负责把 Markdown 与配图提交到这里。

---

## 一、目录结构

```
.
├── content.config.ts        内容集合契约：声明文章必备的 Front Matter 字段
├── nuxt.config.ts           站点配置（静态输出、预渲染抓取）
├── package.json             依赖与脚本
│
├── content/posts/           ← 你以后写文章只需要动这里
│   └── *.md                 Front Matter + Markdown 正文
│
├── public/                  原样复制的文件，不参与构建处理
│   ├── favicon.svg
│   └── images/              配图（Markdown 里写 /images/x.png）
│
├── app/                     Nuxt 4 的源码目录
│   ├── app.vue              根组件
│   ├── layouts/default.vue  全站外壳：页眉、导航、页脚（唯一一份）
│   ├── components/PostCard.vue
│   ├── pages/
│   │   ├── index.vue        →  /
│   │   ├── about.vue        →  /about
│   │   └── posts/[...slug].vue →  /posts/任意篇名
│   └── assets/css/main.css  全站样式表（7 段：变量→重置→布局→页眉→卡片→正文→响应式）
│
└── .github/workflows/deploy.yml   推送 main 即自动构建并发布
```

## 二、新增一篇文章

在 `content/posts/` 新建一个 `.md`，文件名用英文 kebab-case（它就是网址）：

```markdown
---
title: 文章标题
description: 一句话摘要，会显示在首页卡片上
date: '2026-10-05'
tags:
  - CSS
---

正文从这里开始，**从 ## 开始写**。

标题由 Front Matter 的 title 提供，正文里不要再写 # 一级标题，
否则一个页面会出现两个 h1。
```

保存即可。首页列表、卡片、网址全部自动产生，**不需要改任何其他文件**。

## 三、插入图片

1. 把图片放进 `public/images/`，文件名用英文 kebab-case
2. Markdown 里写 `![替代文字](/images/图片名.png)`

路径以 `/` 开头，相对站点根目录，不受文章所在层级影响。

## 四、本地开发与构建

```bat
npm install          REM 首次
npm run dev          REM 开发服务器，默认 http://localhost:4321，保存即热更新
npm run build        REM 生成纯静态站点到 .output/public
npm run preview      REM 预览构建产物
```

也可以在项目根目录跑 `weblog-fullstack\start.cmd`，它会把数据库、Python 服务、
Spring Boot 后端和这个前台一起拉起来，并自动打开浏览器。

## 五、部署

由 `.github/workflows/deploy.yml` 完成：推送到 `main` → GitHub 云端 `npm ci && npm run build`
→ 把 `.output/public` 发布为 Pages 站点。

**仓库设置里 Pages 的 Source 必须是 `GitHub Actions`**（不是 Deploy from a branch）。
若还是分支发布模式，Pages 会去仓库根目录找 `index.html` —— 而根目录放的是源码，
结果就是 404。

## 六、内容与产物

Markdown 文件是**唯一真源**。数据库、后台都只是加工它的工具，
随时可以退回「本地写 Markdown → git push」这条最朴素的路径。
