import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
} from '@elegant-router/types'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useSvgIcon } from '@/hooks/common/icon'

/**
 * 将菜单转换为搜索菜单
 * @param menus 菜单数组
 * @param treeMap 树形映射数组，默认为 `[]`
 * @returns 搜索菜单数组
 */
export function transformMenuToSearchMenus(
  menus: App.Global.Menu[],
  treeMap: App.Global.Menu[] = [],
) {
  if (menus && menus.length === 0) {
    // 如果菜单为空，直接返回空数组
    return []
  }

  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      // 如果当前菜单项没有子菜单，则直接添加到结果数组
      acc.push(cur)
    }

    //  如果有子菜单，递归处理
    if (cur.children && cur.children.length > 0) {
      // 递归处理子菜单
      transformMenuToSearchMenus(cur.children, treeMap)
    }

    // 返回累积的结果
    return acc
  }, treeMap)
}

/**
 * 根据路由获取全局菜单
 * @param route 路由对象
 * @returns 解析后的全局菜单对象
 */
export function getGlobalMenuByBaseRoute(
  route: RouteLocationNormalizedLoaded | ElegantConstRoute, // 可接受 `vue-router` 的 `RouteLocationNormalizedLoaded` 或 `ElegantConstRoute`
) {
  const { SvgIconVNode } = useSvgIcon() // 获取 SVG 图标渲染方法

  const { name, path } = route // 获取路由的名称和路径

  const {
    title, // 菜单标题
    icon = import.meta.env.VITE_MENU_ICON, // 读取环境变量中的默认图标
    localIcon, // 本地图标
    iconFontSize, // 图标字体大小
  } = route.meta ?? {
  } // 读取 `meta` 中的配置信息

  const label = title || '' // 确保 `label` 不为空

  const menu: App.Global.Menu = {
    key: name as string, // 以路由名称作为菜单的唯一 key
    label, // 设置菜单的显示名称
    routeKey: name as RouteKey, // 绑定路由 key
    routePath: path as RouteMap[RouteKey], // 绑定路由路径
    icon: SvgIconVNode({
      icon, // 传入图标
      localIcon, // 传入本地图标
      fontSize: iconFontSize || 20, // 设置图标大小，默认 20
    }),
  }

  return menu // 返回生成的菜单对象
}

/**
 * 根据权限路由获取全局菜单
 * @param routes 权限路由数组
 * @returns 解析后的全局菜单数组
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]) {
  /**
   *  初始化全局菜单数组
   */
  const menus: App.Global.Menu[] = []

  routes.forEach((route) => {
    // 过滤掉 `meta.hideInMenu` 为 `true` 的路由，不显示在菜单中
    if (!route.meta?.hideInMenu) {
      /**
       *  解析当前路由的菜单
       */
      const menu = getGlobalMenuByBaseRoute(route)

      if (route.children?.some(child => !child.meta?.hideInMenu)) {
        // 如果当前路由的子路由中有可显示的菜单项，则递归处理子菜单
        menu.children = getGlobalMenusByAuthRoutes(route.children)
      }

      // 将菜单添加到 `menus` 数组
      menus.push(menu)
    }
  })

  // 返回完整的全局菜单数组
  return menus
}
