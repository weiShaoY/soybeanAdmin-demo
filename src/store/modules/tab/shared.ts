import type {
  LastLevelRouteKey,
  RouteKey,
  RouteMap,
} from '@elegant-router/types' // 导入路由相关的类型

import type { Router } from 'vue-router' // 导入 Vue Router 类型

import { getRoutePath } from '@/router/elegant/transform' // 导入获取路由路径的工具函数

/**
 * 获取所有标签页
 * @param tabs 标签页数组
 * @param homeTab 主页标签页
 * @returns 更新后的标签页数组
 */
export function getTabList(tabs: App.Global.Tab[], homeTab?: App.Global.Tab) {
  if (!homeTab) {
    return [] // 如果没有主页标签页，返回空数组
  }

  /**
   *  过滤掉主页标签页
   */
  const filterHomeTabs = tabs.filter(tab => tab.id !== homeTab.id)

  /**
   *  过滤固定标签页并排序
   */
  const fixedTabs = filterHomeTabs.filter(isFixedTab).sort((a, b) => a.fixedIndex! - b.fixedIndex!)

  /**
   *  非固定标签页
   */
  const remainTabs = filterHomeTabs.filter(tab => !isFixedTab(tab))

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs] // 重新组合所有标签页

  return updateTabsLabel(allTabs) // 更新标签页标签
}

/**
 * 判断是否为固定标签页
 * @param tab 标签页
 * @returns 是否为固定标签页
 */
function isFixedTab(tab: App.Global.Tab) {
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null // 判断标签页是否有固定索引
}

/**
 * 根据路由获取标签页 ID
 * @param route 路由
 * @returns 标签页 ID
 */
export function getTabIdByRoute(route: App.Global.TabRoute) {
  const {
    path,
    query = {
    },
    meta,
  } = route

  let id = path // 默认使用路径作为 ID

  if (meta.multiTab) { // 如果路由支持多标签页
    const queryKeys = Object.keys(query).sort() // 获取查询参数的键并排序

    const qs = queryKeys.map(key => `${key}=${query[key]}`).join('&') // 将查询参数拼接成字符串

    id = `${path}?${qs}` // 将路径和查询参数拼接成完整的 ID
  }

  return id // 返回标签页 ID
}

/**
 * 根据路由获取标签页
 * @param route 路由
 * @returns 标签页
 */
export function getTabByRoute(route: App.Global.TabRoute) {
  const { path, fullPath = path, meta } = route

  const { title, fixedIndexInTab } = meta

  // 从 getRouteIcons 函数中获取图标和本地图标
  const { icon, localIcon } = getRouteIcons(route)

  const label = title || '' // 获取标签页的标题

  const tab: App.Global.Tab = {
    id: getTabIdByRoute(route), // 获取标签页 ID
    label,
    routeKey: path as LastLevelRouteKey, // 路由键
    routePath: path as RouteMap[LastLevelRouteKey], // 路由路径
    fullPath,
    fixedIndex: fixedIndexInTab, // 固定索引
    icon,
    localIcon,
  }

  return tab // 返回标签页
}

/**
 * 获取路由图标
 * @param route 路由
 * @returns 图标和本地图标
 */
export function getRouteIcons(route: App.Global.TabRoute) {
  // 设置图标的默认值
  let icon: string = route?.meta?.icon || import.meta.env.VITE_MENU_ICON

  let localIcon: string | undefined = route?.meta?.localIcon

  // 如果路由有匹配的路由记录
  if (route.matched) {
    // 从匹配的路由记录中找到当前路由
    const currentRoute = route.matched.find(r => r.name === route.name)

    // 如果当前路由的 meta 中有图标，则覆盖默认值
    icon = currentRoute?.meta?.icon || icon
    localIcon = currentRoute?.meta?.localIcon
  }

  return {
    icon,
    localIcon,
  }
}

/**
 * 判断标签页是否在标签页数组中
 * @param tabId 标签页 ID
 * @param tabs 标签页数组
 * @returns 是否在标签页数组中
 */
export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.some(tab => tab.id === tabId) // 判断标签页是否在数组中
}

/**
 * 根据 ID 过滤标签页
 * @param tabId 标签页 ID
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsById(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.filter(tab => tab.id !== tabId) // 过滤掉指定 ID 的标签页
}

/**
 * 根据 ID 数组过滤标签页
 *
 * @param tabIds 标签页 ID 数组
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsByIds(tabIds: string[], tabs: App.Global.Tab[]) {
  return tabs.filter(tab => !tabIds.includes(tab.id)) // 过滤掉指定 ID 数组中的标签页
}

/**
 * 根据所有路由提取标签页
 * @param router 路由器
 * @param tabs 标签页数组
 * @returns 提取后的标签页数组
 */
export function extractTabsByAllRoutes(router: Router, tabs: App.Global.Tab[]) {
  const routes = router.getRoutes() // 获取所有路由

  const routeNames = routes.map(route => route.name) // 获取所有路由的名称

  return tabs.filter(tab => routeNames.includes(tab.routeKey)) // 过滤出路由名称在标签页中的标签页
}

/**
 * 获取固定标签页
 * @param tabs 标签页数组
 * @returns 固定标签页数组
 */
export function getFixedTabs(tabs: App.Global.Tab[]) {
  return tabs.filter(isFixedTab) // 过滤出固定标签页
}

/**
 * 获取固定标签页 ID
 * @param tabs 标签页数组
 * @returns 固定标签页 ID 数组
 */
export function getFixedTabIds(tabs: App.Global.Tab[]) {
  const fixedTabs = getFixedTabs(tabs) // 获取固定标签页

  return fixedTabs.map(tab => tab.id) // 返回固定标签页的 ID 数组
}

/**
 * 更新标签页标签
 * @param tabs 标签页数组
 * @returns 更新后的标签页数组
 */
function updateTabsLabel(tabs: App.Global.Tab[]) {
  const updated = tabs.map(tab => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label, // 更新标签页的标签
  }))

  return updated // 返回更新后的标签页数组
}

/**
 * 根据路由名称查找标签页
 * @param name 路由名称
 * @param tabs 标签页数组
 * @returns 找到的标签页
 */
export function findTabByRouteName(name: RouteKey, tabs: App.Global.Tab[]) {
  const routePath = getRoutePath(name) // 获取路由路径

  const tabId = routePath // 标签页 ID

  const multiTabId = `${routePath}?` // 多标签页 ID

  return tabs.find(tab => tab.id === tabId || tab.id.startsWith(multiTabId)) // 查找标签页
}
