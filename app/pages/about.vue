<script setup lang="ts">
useHead({
  title: '关于 · Fa11Leaf',
  meta: [{ name: 'description', content: '关于这个博客和它的搭建过程' }]
})
</script>

<template>
  <article class="post">
    <header class="post-header">
      <h1>关于</h1>
    </header>

    <!-- class="prose" 让正文里所有标签自动获得统一样式，见 app/assets/css/main.css -->
    <div class="prose">
      <p>
        你好，我是 Fa11Leaf。这里是我的个人博客，用来记录 Web 学习的完整过程。
      </p>

      <h2>这个站点是怎么来的</h2>

      <p>
        它不是一个「先学会再动手」的产物，而是反过来：一边踩坑一边往前走。
        到目前为止走过四个阶段，每一段的代码都完整保留在 git 里。
      </p>

      <ul>
        <li><strong>手写版</strong>：四份 HTML 加一份 CSS，加一篇文章要复制一整份文件</li>
        <li><strong>数据驱动</strong>：文章挪进 JSON，用 JS 渲染，但仍然没有内容就没有页面</li>
        <li><strong>构建期生成</strong>：文章变成 Markdown，页面在构建时就写好</li>
        <li><strong>自动化</strong>：推送到仓库即自动构建上线</li>
      </ul>

      <h2>现在的形态</h2>

      <p>
        公开站点是纯静态的：访客打开页面时，服务器返回的是一个早就生成好的 HTML 文件，
        不查数据库、不跑服务端程序。这也是它能免费托管在 GitHub Pages 上的原因。
      </p>

      <p>
        写作后台只在我自己的电脑上运行，负责把 Markdown 和配图整理好提交到仓库。
        后台挂了不影响阅读，这是有意为之的设计。
      </p>

      <h2>技术栈</h2>

      <ul>
        <li>前台：Nuxt 4 + Vue 3 + Vite，构建期生成静态页面</li>
        <li>内容：Markdown 文件是唯一真源，随时可以退回纯命令行写作</li>
        <li>后台：Spring Boot（状态与权限）+ Python（文本与图片处理）</li>
        <li>部署：GitHub Actions 云端构建，产物直接发布到 Pages</li>
      </ul>
    </div>
  </article>
</template>
