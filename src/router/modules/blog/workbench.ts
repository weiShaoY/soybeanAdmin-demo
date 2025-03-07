import type { AppRouteRecordRaw } from '@/router/types'

import { BlogBaseLayout } from '@/layouts'

const Workbench: AppRouteRecordRaw = {
  path: '/blog/workbench',
  component: BlogBaseLayout,
  children: [
    {
      path: '',
      name: 'Workbench',
      component: () => import('@/pages/blog/workbench/index.vue'),
      meta: {
        title: '工作台',
        order: 1,
      },
    },
  ],

}

export default Workbench
