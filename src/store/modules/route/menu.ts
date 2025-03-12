import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
} from '@elegant-router/types'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useSvgIcon } from '@/hooks/common/icon'

/**
 * 将菜单转换为搜索菜单
 *
 * @param  menus 菜单数组
 * @param  treeMap 树形映射数组. Default is `[]`
 * @returns  搜索菜单数组
 */
export function transformMenuToSearchMenus(
  menus: App.Global.Menu[],
  treeMap: App.Global.Menu[] = [],
) {
  if (menus && menus.length === 0) {
    return []
  }

  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }

    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap)
    }

    return acc
  }, treeMap)
}

/**
 * 根据路由获取全局菜单
 *
 * @param  route 路由
 * @returns 全局菜单
 */
export function getGlobalMenuByBaseRoute(
  route: RouteLocationNormalizedLoaded | ElegantConstRoute,
) {
  const { SvgIconVNode } = useSvgIcon()

  const { name, path } = route

  const {
    title,
    icon = import.meta.env.VITE_MENU_ICON,
    localIcon,
    iconFontSize,
  } = route.meta ?? {
  }

  const label = title || ''

  const menu: App.Global.Menu = {
    key: name as string,
    label,
    routeKey: name as RouteKey,
    routePath: path as RouteMap[RouteKey],
    icon: SvgIconVNode({
      icon,
      localIcon,
      fontSize: iconFontSize || 20,
    }),
  }

  return menu
}

/**
 * 根据权限路由获取全局菜单
 *
 * @param  routes 权限路由
 * @returns 全局菜单
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]) {
  const menus: App.Global.Menu[] = []

  routes.forEach((route) => {
    if (!route.meta?.hideInMenu) {
      const menu = getGlobalMenuByBaseRoute(route)

      if (route.children?.some(child => !child.meta?.hideInMenu)) {
        menu.children = getGlobalMenusByAuthRoutes(route.children)
      }

      menus.push(menu)
    }
  })

  return menus
}
