import type { AppRouteRecordRaw } from '@/router/types'

/**
 *  根路由和未找到路由
 */
const errorRoute: AppRouteRecordRaw[] = [
  {
    name: '403',
    path: '/403',
    component: () => import('@/pages/error/403/index.vue'),
    meta: {
      title: '403',
      constant: true,
      hideInMenu: true,
    },
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/pages/error/404/index.vue'),
    meta: {
      title: '404',
      constant: true,
      hideInMenu: true,
    },
  },
  {
    name: '500',
    path: '/500',
    component: () => import('@/pages/error/500/index.vue'),
    meta: {
      title: '500',
      constant: true,
      hideInMenu: true,
    },
  },
]

export default errorRoute
