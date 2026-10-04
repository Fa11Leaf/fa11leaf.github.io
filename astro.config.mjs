// ============================================================
// astro.config.mjs —— Astro 的全局配置
//
// 这个文件是 S3 独有的东西。S1/S2 没有「配置」这个概念，
// 因为那时候没有构建工具——你写什么，浏览器就读什么。
// 一旦引入构建工具，就必须有人告诉它：站点部署在哪、怎么构建。
// ============================================================

import { defineConfig } from 'astro/config';

export default defineConfig({
  // site：站点的最终完整网址。
  // 作用不是「让站点能访问」，而是让 Astro 能生成正确的绝对地址——
  // 比如 canonical 链接、RSS 里的文章链接。
  //
  // 我们的最终归宿是把这套代码合并进 Fa11Leaf.github.io 仓库的根目录，
  // 所以最终网址是根路径，没有子路径。这很关键：
  // 如果部署在 https://fa11leaf.github.io/weblog/ 这种子路径下，
  // 就必须额外声明 base: '/weblog'，否则所有绝对路径都会 404。
  site: 'https://fa11leaf.github.io',

  // output 的默认值就是 'static'，这里显式写出来是为了让意图清楚：
  // 构建时把每个页面预先渲染成真正的 .html 文件，
  // 访客拿到的就是完整的 HTML，不需要等服务端或浏览器执行 JS。
  // 这正是 S2 做不到的事（S2 必须等浏览器跑完 fetch 才有内容）。
  output: 'static',

  // markdown：Markdown 怎么被转换成 HTML。
  // theme 决定代码块的语法高亮配色。Astro 的默认值是 github-dark——
  // 它会把深色背景**内联**写在每个 <pre> 的 style 属性上，
  // 于是白底页面上出现一块块黑砖头，而且内联样式优先级很高，
  // 普通 CSS 覆盖不掉（详见 global.css 里 .prose pre 那段注释）。
  // 换成浅色主题，代码块才和页面是同一套视觉。
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
