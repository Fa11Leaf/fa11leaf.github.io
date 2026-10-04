<script setup lang="ts">
const route = useRoute()

// 文件 content/posts/my-first-web.md 对应的网址是 /posts/my-first-web
//
// 注意：这个页面在 posts/ 目录下，所以 route.params.slug 只拿到 'my-first-web'，
// '/posts' 这一段被目录名吃掉了。而内容集合里的 stem 是 'posts/my-first-web'。
// 因此不能拿 params.slug 去比对，要用完整的 route.path。
const uri = computed(() => route.path.replace(/\/+$/, ''))

// 取全量再自己匹配，而不是用 .path() 精确查询 —— 多写两行，换来对
// 「路径有没有尾斜杠」这类差异的免疫力，构建期不会因此静默不生成页面。
const { data: post } = await useAsyncData('post:' + uri.value, async () => {
  const all = await queryCollection('posts').all()

  return (
    all.find((p) => (p.path || '').replace(/\/+$/, '') === uri.value) ??
    all.find((p) => p.stem === uri.value.replace(/^\//, '')) ??
    null
  )
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

useHead({ title: `${post.value.title} · Fa11Leaf` })
</script>

<template>
  <article v-if="post" class="post">
    <header class="post-header">
      <h1>{{ post.title }}</h1>
      <p class="post-meta">
        <time :datetime="post.date">{{ post.date }}</time>
        <template v-if="post.tags?.length">
          <span class="dot">·</span>
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </template>
      </p>
      <p v-if="post.description" class="post-desc">{{ post.description }}</p>
    </header>

    <!-- ContentRenderer 把 Markdown 的正文（已转成 HTML）渲染出来 -->
    <div class="prose">
      <ContentRenderer :value="post" />
    </div>

    <footer class="post-footer">
      <NuxtLink to="/">← 返回文章列表</NuxtLink>
    </footer>
  </article>
</template>
