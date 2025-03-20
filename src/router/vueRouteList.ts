import type { RouteRecordNormalized } from 'vue-router'

import { formatModules } from './utils'

const appModules = import.meta.glob('./modules/*/index.ts', {
  eager: true,
})

const routeList: RouteRecordNormalized[] = formatModules(appModules, [])

console.log('%c Line:4 🍬 routeList', 'color:#93c0a4', routeList)

export const vueRouteList = [
  // {

  //   name: 'root',
  //   path: '/',
  //   redirect: '/home',
  //   meta: {
  //     title: 'root',
  //     constant: true,
  //   },
  // },
  // {
  //   name: 'not-found',
  //   path: '/:pathMatch(.*)*',
  //   component: () => import('@/pages/error/404/index.vue'),
  //   meta: {
  //     title: 'not-found',
  //     constant: true,
  //   },
  // },

  // ////////////////////////

  ...routeList,
]
