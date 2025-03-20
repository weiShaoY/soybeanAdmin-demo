import type { AppRouteRecordRaw } from '@/router/types'

/**
 *  根路由和未找到路由
 */
const fallbackRoute: AppRouteRecordRaw[] = [
  {

    name: 'root',
    path: '/',
    redirect: '/blog/workbench',
    meta: {
      title: 'root',
      constant: true,
    },
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/error/404/index.vue'),
    meta: {
      title: 'not-found',
      constant: true,
    },
  },
]

export default fallbackRoute
