import type { ElegantConstRoute } from '@elegant-router/types'

import type {AppRouteRecordRaw} from '@/router/types'

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



/**
 * 通过子路由 `name` 获取父路由的 `path`
 * @param routes - 路由数组
 * @param childName - 目标子路由的 `name`
 * @returns 父路由的 `path`，如果找不到则返回 `null`
 */
export function getParentPathByChildName(routes: AppRouteRecordRaw[], childName: string): string | null {
  for (const route of routes) {
    if (route.children) {
      const found = route.children.find(child => child.name === childName);
      if (found) {
        return route.path; // 返回父路由路径
      }
    }
  }
  return null; // 没找到返回 null
}
