import type { ElegantConstRoute } from '@elegant-router/types'

/**
 * 根据顺序排序路由
 * @param  route 路由
 * @returns  排序后的路由
 */
function sortRouteByOrder(route: ElegantConstRoute) {
  if (route.children?.length) {
    route.children.sort(
      (next, prev) =>
        (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0),
    )
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * 根据顺序排序路由数组
 * @param  routes 路由数组
 * @returns  排序后的路由数组
 */
export function sortRoutesByOrder(routes: ElegantConstRoute[]) {
  routes.sort(
    (next, prev) =>
      (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0),
  )
  routes.forEach(sortRouteByOrder)

  return routes
}
