import type { AppRouteRecordRaw } from '@/router/types'

import { BlogBaseLayout } from '@/layouts'

const News: AppRouteRecordRaw = {
  path: '/blog/news',
  name: 'News',
  meta: {
    title: '新闻',
    icon: 'blog-menu-news',
    order: 99,
  },
  component: BlogBaseLayout,
  children: [
    {
      path: '/blog/news/gold',
      name: 'Gold',
      meta: {
        title: '黄金',
        icon: 'blog-menu-gold',
      },
      component: () => import('@/pages/blog/news/gold/index.vue'),
    },
    {
      path: '/blog/news/oil',
      name: 'Oil',
      meta: {
        title: '燃油',
        icon: 'blog-menu-oil',
      },
      component: () => import('@/pages/blog/news/oil/index.vue'),

    },
  ],
}

export default News
