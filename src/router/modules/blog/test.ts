import type { AppRouteRecordRaw } from '@/router/types'

import { BlogBaseLayout } from '@/layouts'

const Test: AppRouteRecordRaw = {
  path: '/blog/test',
  name: 'Test',
  meta: {
    title: '测试',
    icon: 'blog-menu-test',
    order: 99,
  },
  component: BlogBaseLayout,
  children: [
    {
      path: '/blog/test/api',
      name: 'Api',
      meta: {
        title: 'Api',
        icon: 'blog-menu-api',
      },
      component: () => import('@/pages/blog/test/api/index.vue'),
    },
    {
      path: '/blog/test/component',
      name: 'Component',
      meta: {
        title: '组件',
        icon: 'blog-menu-component',
      },
      component: () => import('@/pages/blog/test/component/index.vue'),
    },
  ],
}

export default Test
