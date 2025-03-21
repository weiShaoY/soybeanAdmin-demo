import { BLOG_BASE_Layout } from '@/layouts'

const workbenchRoute = [
  {
    path: '/blog/workbench',
    component: BLOG_BASE_Layout,
    meta: {
      title: '工作台',
    },
    children: [
      {
        name: 'workbench',
        path: '',
        component: () => import('@/pages/blog/workbench/index.vue'),
        meta: {
          title: '工作台',
          icon: 'mdi:monitor-dashboard',
          order: 0,
        },
      },
    ],
  },
]

export default workbenchRoute
