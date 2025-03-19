import type { ElegantConstRoute } from '@elegant-router/types'

/**
 * 递归排序路由及其子路由
 * @param route 路由
 * @returns 排序后的路由
 */
function sortRouteByOrder(route: ElegantConstRoute): ElegantConstRoute {
  if (route.children?.length) {
    route.children.sort((a, b) => (a.meta?.order || 0) - (b.meta?.order || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * 根据顺序排序路由数组
 * @param routes 路由数组
 * @returns 排序后的路由数组
 */
export function sortRoutesByOrder(routes: ElegantConstRoute[]): ElegantConstRoute[] {
  return routes
    .sort((a, b) => (a.meta?.order || 0) - (b.meta?.order || 0))
    .map(sortRouteByOrder)
}
