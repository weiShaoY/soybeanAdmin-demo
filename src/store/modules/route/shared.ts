import type {
  ElegantConstRoute,
  LastLevelRouteKey,
  RouteKey,
} from '@elegant-router/types'

import type { RouteRecordRaw } from 'vue-router'

/**
 * 获取缓存路由名
 * @param  routes Vue 路由数组（两级）
 * @returns  缓存路由名
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: LastLevelRouteKey[] = []

  routes.forEach((route) => {
    // 仅获取具有组件的最后两级路由
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as LastLevelRouteKey)
      }
    })
  })

  return cacheNames
}

/**
 * 根据路由名判断路由是否存在
 * @param  routeName 路由名
 * @param  routes 路由数组
 * @returns  路由是否存在
 */
export function isRouteExistByRouteName(
  routeName: RouteKey,
  routes: ElegantConstRoute[],
) {
  return routes.some(route =>
    recursiveGetIsRouteExistByRouteName(route, routeName),
  )
}

/**
 * 递归判断路由是否存在
 * @param  route 路由
 * @param  routeName 路由名
 * @returns  路由是否存在
 */
function recursiveGetIsRouteExistByRouteName(
  route: ElegantConstRoute,
  routeName: RouteKey,
) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some(item =>
      recursiveGetIsRouteExistByRouteName(item, routeName),
    )
  }

  return isExist
}
