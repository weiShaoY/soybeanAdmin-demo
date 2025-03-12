import type {
  ElegantConstRoute,
  LastLevelRouteKey,
  RouteKey,
} from '@elegant-router/types'

import type { RouteRecordRaw } from 'vue-router'

/**
 * 根据顺序排序路由
 *
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
 *
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
 *
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

/**
 * 根据选中菜单键获取选中菜单键路径
 *
 * @param  selectedKey 选中菜单键
 * @param  menus 全局菜单
 * @returns  选中菜单键路径数组
 */
export function getSelectedMenuKeyPathByKey(
  selectedKey: string,
  menus: App.Global.Menu[],
) {
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
function findMenuPath(
  targetKey: string,
  menu: App.Global.Menu,
): string[] | null {
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
