// ============================================================
// src/content.config.ts —— 内容集合的「契约」
//
// 这是 S3 出现的全新概念。回想 S2：文章数据放在 data/posts.json，
// 谁都能往里塞一个字段，写错了也不会有人拦你，直到运行时才白屏。
//
// 内容集合做的是同一件事（集中管理文章数据），但多了一层「校验」：
// 这里声明一篇文章必须有哪些字段、每个字段是什么类型，
// 构建时逐篇检查。标题忘了写、日期写成了「昨天」，构建直接报错。
//
// 【S3 概念对照】
//   S1：文章正文写在 HTML 文件里
//   S2：文章正文写在 JSON 的字符串里
//   S3：文章正文写在独立的 .md 文件里 ← 你现在看的这一层
// ============================================================

// defineCollection：定义一个集合（可以把集合理解成「一张表」）
import { defineCollection } from 'astro:content';

// glob：从某个目录里批量加载文件。这个函数来自 astro/loaders。
import { glob } from 'astro/loaders';

// z：Zod，一个数据校验库。注意导入路径是 astro/zod，
// Astro 把 Zod 重新导出了一份，不需要你单独安装。
import { z } from 'astro/zod';

const posts = defineCollection({
  // loader 负责回答「文章从哪来」。
  // base：文章目录（相对于项目根目录，不是相对于本文件）
  // pattern：哪些文件算一篇文章。.md 和 .mdx 都收。
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),

  // schema 负责回答「一篇文章长什么样」。
  // 每一个键都对应 .md 文件开头 --- 之间那段 Front Matter 里的字段。
  schema: z.object({
    // z.string()：必须是文本，不写就报错
    title: z.string(),
    description: z.string(),

    // z.coerce.date()：先尝试转换、再要求是日期。
    // 所以 Front Matter 里写 2026-10-04（YAML 会把它读成日期）
    // 或者写 "2026-10-04"（字符串）都可以，最终都会变成真正的日期对象。
    pubDate: z.coerce.date(),

    // z.array(z.string()).default([])：
    // 必须是「字符串组成的数组」；如果这篇没写 tags，默认给一个空数组，
    // 而不是报错。这说明 schema 既能强制要求，也能提供默认值。
    tags: z.array(z.string()).default([]),

    // z.boolean().default(false)：草稿标记。
    // 规划中的用法是：draft 为 true 的文章在列表和构建中跳过。
    draft: z.boolean().default(false),
  }),
});

// 把集合登记出去。页面里用 getCollection('posts') 就能取到。
export const collections = { posts };
