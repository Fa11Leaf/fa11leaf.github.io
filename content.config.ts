// 内容集合的「契约」：声明 content/posts/ 下的 Markdown 必须带哪些 Front Matter。
//
// 这是 Astro 的 src/content.config.ts 在新栈里的对应物。作用相同：
// 构建时校验，字段写错或类型不对会直接报错，而不是悄悄渲染出一篇缺标题的文章。
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      // type: 'page' 表示每个文件是一个「页面」，可用 path / stem 定位
      type: 'page',
      // source 相对 content/ 目录
      source: 'posts/*.md',

      schema: z.object({
        // 必填
        title: z.string(),
        // 用字符串而非 Date：ISO 日期字符串按字典序排序即等于按时间排序，
        // 省掉不同解析器对 YAML 日期的处理差异
        date: z.string(),

        // 可选
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional()
      })
    })
  }
})
