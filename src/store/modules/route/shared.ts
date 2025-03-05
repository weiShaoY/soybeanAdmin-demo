import type {
  ElegantConstRoute,
  LastLevelRouteKey,
  RouteKey,
  RouteMap,
} from '@elegant-router/types'

import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

import { useSvgIcon } from '@/hooks/common/icon'

/**
 * 根据顺序排序路由
 *
 * @param  route 路由
 * @returns  排序后的路由
 */
function sortRouteByOrder(route: ElegantConstRoute) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * 根据顺序排序路由数组
 *
 * @param  routes 路由数组
 * @returns  排序后的路由数组
 */
export function sortRoutesByOrder(routes: ElegantConstRoute[]) {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
  routes.forEach(sortRouteByOrder)

  return routes
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

/**
 * 根据路由获取全局菜单
 *
 * @param  route 路由
 * @returns 全局菜单
 */
function getGlobalMenuByBaseRoute(route: RouteLocationNormalizedLoaded | ElegantConstRoute) {
  const { SvgIconVNode } = useSvgIcon()

  const { name, path } = route

  const { title, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = route.meta ?? {
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
 * 获取缓存路由名
 *
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
 *
 * @param {RouteKey} routeName 路由名
 * @param {ElegantConstRoute[]} routes 路由数组
 * @returns {boolean} 路由是否存在
 */
export function isRouteExistByRouteName(routeName: RouteKey, routes: ElegantConstRoute[]) {
  return routes.some(route => recursiveGetIsRouteExistByRouteName(route, routeName))
}

/**
 * 递归判断路由是否存在
 *
 * @param {ElegantConstRoute} route 路由
 * @param {RouteKey} routeName 路由名
 * @returns {boolean} 路由是否存在
 */
function recursiveGetIsRouteExistByRouteName(route: ElegantConstRoute, routeName: RouteKey) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some(item => recursiveGetIsRouteExistByRouteName(item, routeName))
  }

  return isExist
}

/**
 * 根据选中菜单键获取选中菜单键路径
 *
 * @param  selectedKey 选中菜单键
 * @param  menus 全局菜单
 * @returns  选中菜单键路径数组
 */
export function getSelectedMenuKeyPathByKey(selectedKey: string, menus: App.Global.Menu[]) {
  const keyPath: string[] = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path!)
    }

    return find
  })

  return keyPath
}

/**
 * 查找菜单路径
 *
 * @param  targetKey 目标菜单键
 * @param  menu 菜单
 * @returns  菜单路径数组
 */
function findMenuPath(targetKey: string, menu: App.Global.Menu): string[] | null {
  const path: string[] = []

  function dfs(item: App.Global.Menu): boolean {
    path.push(item.key)

    if (item.key === targetKey) {
      return true
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }

    path.pop()

    return false
  }

  if (dfs(menu)) {
    return path
  }

  return null
}

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

      const parentKey = key.split(ROUTE_DEGREE_SPLITTER).slice(0, -1).join(ROUTE_DEGREE_SPLITTER)

      const breadcrumbMenu = getGlobalMenuByBaseRoute(route)

      if (parentKey !== activeKey) {
        return [transformMenuToBreadcrumb(breadcrumbMenu)]
      }

      return [transformMenuToBreadcrumb(menu), transformMenuToBreadcrumb(breadcrumbMenu)]
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

/**
 * 将菜单转换为搜索菜单
 *
 * @param  menus 菜单数组
 * @param  treeMap 树形映射数组. Default is `[]`
 * @returns  搜索菜单数组
 */
export function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []) {
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
