import type { CustomRoute } from '@elegant-router/types'

/**
 *  根路由
 */
// const ROOT_ROUTE: CustomRoute = {
//   name: 'root',
//   path: '/',
//   redirect: '/home',
//   meta: {
//     title: 'root',
//     constant: true,
//   },
// }

// /**
//  *  未找到路由
//  */
// const NOT_FOUND_ROUTE: CustomRoute = {
//   name: 'not-found',
//   path: '/:pathMatch(.*)*',
//   component: 'layout.blank$view.404',
//   meta: {
//     title: 'not-found',
//     constant: true,
//   },
// }

/**
 *  根路由和未找到路由
 */
const fallbackRoute: CustomRoute[] = [
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

export default fallbackRoute
