import type { AppRouteRecordRaw } from './types'

export const vueRouteList: AppRouteRecordRaw[] = [
  {

    name: 'root',
    path: '/',
    redirect: '/home',
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

  // ////////////////////////
]
