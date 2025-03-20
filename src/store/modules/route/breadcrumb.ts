import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { getGlobalMenuByBaseRoute } from './menu'

/**
 * 将菜单转换为面包屑
 * @param menu 菜单项
 * @returns 面包屑对象
 */
function transformMenuToBreadcrumb(menu: App.Global.Menu) {
  // 取出 `children`，其余属性保留
  const { children, ...rest } = menu

  /**
   *  转换后的面包屑对象
   */
  const breadcrumb: App.Global.Breadcrumb = {
    // 继承菜单项的属性
    ...rest,
  }

  if (children?.length) {
    // 如果存在子菜单，则递归转换子菜单为面包屑选项
    breadcrumb.options = children.map(transformMenuToBreadcrumb)
  }

  // 返回转换后的面包屑对象
  return breadcrumb
}

/**
 * 获取面包屑列表
 * @param route 当前路由对象
 * @param menus 全局菜单数组
 * @returns 面包屑数组
 */
export function getBreadcrumbList(
  route: RouteLocationNormalizedLoaded, // 当前激活的路由
  menus: App.Global.Menu[], // 全局菜单列表
): App.Global.Breadcrumb[] {
  /**
   *  获取当前路由的名称作为匹配 key
   */
  const key = route.name as string

  /**
   *  获取路由的 `activeMenu`（用于高亮父级菜单）
   */
  const activeKey = route.meta?.activeMenu

  console.log('%c Line:50 🍓 activeKey', 'color:#93c0a4', activeKey)

  for (const menu of menus) {
    if (menu.key === key) {
      // 如果菜单 key 与路由 key 匹配，则返回转换后的面包屑
      return [transformMenuToBreadcrumb(menu)]
    }

    if (menu.key === activeKey) {
      // 如果菜单 key 与 `activeMenu` 匹配，处理父级菜单
      const ROUTE_DEGREE_SPLITTER = '_' // 路由层级分隔符

      /**
       *  父级路由 key
       */
      const parentKey = key
        .split(ROUTE_DEGREE_SPLITTER) // 按 `_` 分割路由名称
        .slice(0, -1) // 去掉最后一级，获取上一级路由 key
        .join(ROUTE_DEGREE_SPLITTER) // 重新拼接成父级路由 key

      /**
       *  根据基础路由获取对应的菜单项
       */
      const breadcrumbMenu = getGlobalMenuByBaseRoute(route)

      if (parentKey !== activeKey) {
        // 如果 `parentKey` 不是 `activeKey`，说明它是独立的父级菜单
        return [transformMenuToBreadcrumb(breadcrumbMenu)]
      }

      return [
        // 添加当前菜单的面包屑
        transformMenuToBreadcrumb(menu),

        // 添加父级菜单的面包屑
        transformMenuToBreadcrumb(breadcrumbMenu),
      ]
    }

    if (menu.children?.length) {
      // 如果当前菜单存在子菜单，则递归查找匹配项
      const result = getBreadcrumbList(route, menu.children)

      if (result.length > 0) {
        // 如果找到了匹配项，则将当前菜单添加到面包屑路径中
        return [transformMenuToBreadcrumb(menu), ...result]
      }
    }
  }

  // 未找到匹配项时，返回空数组
  return []
}
