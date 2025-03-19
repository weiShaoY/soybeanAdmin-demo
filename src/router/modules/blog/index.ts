import type { CustomRoute } from '@elegant-router/types'

/**
 *  根路由和未找到路由
 */
const blogRoute: CustomRoute[] = [
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
    component: 'layout.blank$view.404',
    meta: {
      title: 'not-found',
      constant: true,
    },
  },
]

export default blogRoute
