<script setup lang="ts">
// 单张文章卡片。抽出来的意义：列表页、标签页、搜索页将来都能复用它。
defineProps<{
  post: {
    path: string
    title: string
    date: string
    description?: string
    tags?: string[]
  }
}>()
</script>

<template>
  <article class="post-card">
    <h3 class="post-card-title">
      <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
    </h3>

    <p class="post-meta">
      <time :datetime="post.date">{{ post.date }}</time>
      <template v-if="post.tags?.length">
        <span class="dot">·</span>
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </template>
    </p>

    <p v-if="post.description" class="post-card-desc">{{ post.description }}</p>

    <NuxtLink class="post-card-more" :to="post.path">阅读全文 →</NuxtLink>
  </article>
</template>
