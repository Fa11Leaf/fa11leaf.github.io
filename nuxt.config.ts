// Nuxt 配置：纯静态输出（SSG）
//
// 与旧的 Astro 版本相比，这里没有 base 前缀问题——本站是 GitHub Pages 的【用户站点】，
// 仓库名就是 Fa11Leaf.github.io，网址落在根路径 https://fa11leaf.github.io/
export default defineNuxtConfig({
  // 锁住框架行为，避免未来小版本改变默认值导致构建结果变化
  compatibilityDate: '2026-10-04',

  devtools: { enabled: false },

  // @nuxt/content：把 content/ 下的 Markdown 变成可查询的内容集合
  modules: ['@nuxt/content'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Fa11Leaf 的博客 · 记录 Web 学习的完整过程' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // 中文站点的常见优化：让中文优先用系统黑体，西文优先用系统无衬线
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
      ]
    }
  },

  nitro: {
    prerender: {
      // 从首页开始顺着 <a> 抓取，把每个文章的静态 HTML 都生成出来
      crawlLinks: true,
      routes: ['/', '/about']
    }
  }
})
