<script setup lang="ts">
// 全站外壳：页眉、导航、页脚。
//
// 导航项集中在这一个数组里 —— 这是 S3 消灭的「改一次导航要开 4 个文件」。
// 想加一页，只需要在 src/pages（这里是 app/pages）建一个 .vue，再往下面加一行。
const navItems = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/about' }
]

// 页脚年份在【构建时】算好。又一次体现「构建期 vs 运行期」：
// 2027 年若不重新构建一次，页脚会一直停在 2026。
const year = new Date().getFullYear()
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink to="/" class="brand">Fa11Leaf</NuxtLink>

      <nav class="site-nav">
        <!--
          NuxtLink 会自动给「当前所在页面」的链接加上 router-link-exact-active 类，
          样式里直接用它做高亮 —— 不必手写「这是不是当前页」的判断。
        -->
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>

  <main class="site-main">
    <div class="container">
      <!-- 每个页面的内容从这里塞进来 -->
      <slot />
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>© {{ year }} Fa11Leaf · 记录我的学习过程</p>
    </div>
  </footer>
</template>
