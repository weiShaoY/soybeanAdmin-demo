import { BLOG_BASE_Layout } from '@/layouts'

/**
 *  根路由和未找到路由
 */
const aaaRoute = [
  {
    path: '/blog/aaa',
    component: BLOG_BASE_Layout,
    meta: {
      title: '测试aaa',
    },
    children: [
      {
        name: 'aaa',
        path: '',
        component: () => import('@/pages/blog/aaa/index.vue'),
        meta: {
          title: '测试aaa',
          icon: 'mdi:monitor-dashboard',
          order: 0,
        },
      },
    ],
  },
]

export default aaaRoute
