<script setup lang="ts">
// 首页：站点简介 + 文章列表
//
// 关键点在这几行 —— 文章列表【不是手写的】，而是从内容集合里查出来的。
// 新增一篇文章 = 往 content/posts/ 放一个 .md，这个文件一个字都不用改。
const { data: posts } = await useAsyncData('posts-list', async () => {
  const all = await queryCollection('posts').all()

  return all
    .filter((p) => !p.draft) // 草稿不上首页
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)))
})

useHead({
  title: 'Fa11Leaf 的博客',
  meta: [{ name: 'description', content: '记录 Web 学习的完整过程：从手写 HTML 到全栈博客' }]
})
</script>

<template>
  <section class="hero">
    <img
      class="avatar"
      src="/images/my_github_profile_picture.jpg"
      alt="Fa11Leaf 的头像"
      width="72"
      height="72"
    />
    <div class="hero-text">
      <h1>你好，这里是 Fa11Leaf 的博客</h1>
      <p>
        从手写 HTML 开始，一步步走到现在这套「静态前台 + 本地写作后台」。
        这个站点本身就是那份作业的产物，文章记录的是整个过程中的坑与结论。
      </p>
    </div>
  </section>

  <section class="post-list">
    <h2 class="section-title">最新文章</h2>

    <p v-if="!posts?.length" class="empty-hint">
      还没有已发布的文章。往 <code>content/posts/</code> 放一个 <code>.md</code> 就会出现。
    </p>

    <PostCard v-for="post in posts" :key="post.path" :post="post" />
  </section>
</template>
