import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { getGlobalMenuByBaseRoute } from './menu'

/**
 * 将菜单转换为面包屑
 *
 * @param  menu 菜单
 * @returns  面包屑
 */
function transformMenuToBreadcrumb(menu: App.Global.Menu) {
  const { children, ...rest } = menu

  const breadcrumb: App.Global.Breadcrumb = {
    ...rest,
  }

  if (children?.length) {
    breadcrumb.options = children.map(transformMenuToBreadcrumb)
  }

  return breadcrumb
}

/**
 * 根据路由获取面包屑
 *
 * @param  route 路由
 * @param  menus 全局菜单数组
 * @returns  面包屑数组
 */
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  menus: App.Global.Menu[],
): App.Global.Breadcrumb[] {
  const key = route.name as string

  const activeKey = route.meta?.activeMenu

  for (const menu of menus) {
    if (menu.key === key) {
      return [transformMenuToBreadcrumb(menu)]
    }

    if (menu.key === activeKey) {
      const ROUTE_DEGREE_SPLITTER = '_'

      const parentKey = key
        .split(ROUTE_DEGREE_SPLITTER)
        .slice(0, -1)
        .join(ROUTE_DEGREE_SPLITTER)

      const breadcrumbMenu = getGlobalMenuByBaseRoute(route)

      if (parentKey !== activeKey) {
        return [transformMenuToBreadcrumb(breadcrumbMenu)]
      }

      return [
        transformMenuToBreadcrumb(menu),
        transformMenuToBreadcrumb(breadcrumbMenu),
      ]
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children)

      if (result.length > 0) {
        return [transformMenuToBreadcrumb(menu), ...result]
      }
    }
  }

  return []
}
