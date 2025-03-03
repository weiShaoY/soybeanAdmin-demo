import type { Router } from 'vue-router';
import type { LastLevelRouteKey, RouteKey, RouteMap } from '@elegant-router/types';
import { $t } from '@/locales';
import { getRoutePath } from '@/router/elegant/transform';

/**
 * 获取所有标签页
 *
 * @param tabs 标签页数组
 * @param homeTab 主页标签页
 * @returns 更新后的标签页数组
 */
export function getAllTabs(tabs: App.Global.Tab[], homeTab?: App.Global.Tab) {
  if (!homeTab) {
    return [];
  }

  const filterHomeTabs = tabs.filter(tab => tab.id !== homeTab.id);

  const fixedTabs = filterHomeTabs.filter(isFixedTab).sort((a, b) => a.fixedIndex! - b.fixedIndex!);

  const remainTabs = filterHomeTabs.filter(tab => !isFixedTab(tab));

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs];

  return updateTabsLabel(allTabs);
}

/**
 * 判断是否为固定标签页
 *
 * @param tab 标签页
 * @returns 是否为固定标签页
 */
function isFixedTab(tab: App.Global.Tab) {
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null;
}

/**
 * 根据路由获取标签页 ID
 *
 * @param route 路由
 * @returns 标签页 ID
 */
export function getTabIdByRoute(route: App.Global.TabRoute) {
  const { path, query = {}, meta } = route;

  let id = path;

  if (meta.multiTab) {
    const queryKeys = Object.keys(query).sort();
    const qs = queryKeys.map(key => `${key}=${query[key]}`).join('&');

    id = `${path}?${qs}`;
  }

  return id;
}

/**
 * 根据路由获取标签页
 *
 * @param route 路由
 * @returns 标签页
 */
export function getTabByRoute(route: App.Global.TabRoute) {
  const { name, path, fullPath = path, meta } = route;

  const { title, i18nKey, fixedIndexInTab } = meta;

  // Get icon and localIcon from getRouteIcons function
  const { icon, localIcon } = getRouteIcons(route);

  const label = i18nKey ? $t(i18nKey) : title;

  const tab: App.Global.Tab = {
    id: getTabIdByRoute(route),
    label,
    routeKey: name as LastLevelRouteKey,
    routePath: path as RouteMap[LastLevelRouteKey],
    fullPath,
    fixedIndex: fixedIndexInTab,
    icon,
    localIcon,
    i18nKey
  };

  return tab;
}

/**
 * 获取路由图标
 *
 * @param route 路由
 * @returns 图标和本地图标
 */
export function getRouteIcons(route: App.Global.TabRoute) {
  // Set default value for icon at the beginning
  let icon: string = route?.meta?.icon || import.meta.env.VITE_MENU_ICON;
  let localIcon: string | undefined = route?.meta?.localIcon;

  // Route.matched only appears when there are multiple matches,so check if route.matched exists
  if (route.matched) {
    // Find the meta of the current route from matched
    const currentRoute = route.matched.find(r => r.name === route.name);
    // If icon exists in currentRoute.meta, it will overwrite the default value
    icon = currentRoute?.meta?.icon || icon;
    localIcon = currentRoute?.meta?.localIcon;
  }

  return { icon, localIcon };
}

/**
 * 获取默认主页标签页
 *
 * @param router 路由器
 * @param homeRouteName 主页路由名称
 * @returns 主页标签页
 */
export function getDefaultHomeTab(router: Router, homeRouteName: LastLevelRouteKey) {
  const homeRoutePath = getRoutePath(homeRouteName);
  const i18nLabel = $t(`route.${homeRouteName}`);

  let homeTab: App.Global.Tab = {
    id: getRoutePath(homeRouteName),
    label: i18nLabel || homeRouteName,
    routeKey: homeRouteName,
    routePath: homeRoutePath,
    fullPath: homeRoutePath
  };

  const routes = router.getRoutes();
  const homeRoute = routes.find(route => route.name === homeRouteName);
  if (homeRoute) {
    homeTab = getTabByRoute(homeRoute);
  }

  return homeTab;
}

/**
 * 判断标签页是否在标签页数组中
 *
 * @param tabId 标签页 ID
 * @param tabs 标签页数组
 * @returns 是否在标签页数组中
 */
export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.some(tab => tab.id === tabId);
}

/**
 * 根据 ID 过滤标签页
 *
 * @param tabId 标签页 ID
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsById(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.filter(tab => tab.id !== tabId);
}

/**
 * 根据 ID 数组过滤标签页
 *
 * @param tabIds 标签页 ID 数组
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsByIds(tabIds: string[], tabs: App.Global.Tab[]) {
  return tabs.filter(tab => !tabIds.includes(tab.id));
}

/**
 * 根据所有路由提取标签页
 *
 * @param router 路由器
 * @param tabs 标签页数组
 * @returns 提取后的标签页数组
 */
export function extractTabsByAllRoutes(router: Router, tabs: App.Global.Tab[]) {
  const routes = router.getRoutes();

  const routeNames = routes.map(route => route.name);

  return tabs.filter(tab => routeNames.includes(tab.routeKey));
}

/**
 * 获取固定标签页
 *
 * @param tabs 标签页数组
 * @returns 固定标签页数组
 */
export function getFixedTabs(tabs: App.Global.Tab[]) {
  return tabs.filter(isFixedTab);
}

/**
 * 获取固定标签页 ID
 *
 * @param tabs 标签页数组
 * @returns 固定标签页 ID 数组
 */
export function getFixedTabIds(tabs: App.Global.Tab[]) {
  const fixedTabs = getFixedTabs(tabs);

  return fixedTabs.map(tab => tab.id);
}

/**
 * 更新标签页标签
 *
 * @param tabs 标签页数组
 * @returns 更新后的标签页数组
 */
function updateTabsLabel(tabs: App.Global.Tab[]) {
  const updated = tabs.map(tab => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label
  }));

  return updated;
}

/**
 * 根据国际化键更新标签页
 *
 * @param tab 标签页
 * @returns 更新后的标签页
 */
export function updateTabByI18nKey(tab: App.Global.Tab) {
  const { i18nKey, label } = tab;

  return {
    ...tab,
    label: i18nKey ? $t(i18nKey) : label
  };
}

/**
 * 根据国际化键更新标签页数组
 *
 * @param tabs 标签页数组
 * @returns 更新后的标签页数组
 */
export function updateTabsByI18nKey(tabs: App.Global.Tab[]) {
  return tabs.map(tab => updateTabByI18nKey(tab));
}

/**
 * 根据路由名称查找标签页
 *
 * @param name 路由名称
 * @param tabs 标签页数组
 * @returns 找到的标签页
 */
export function findTabByRouteName(name: RouteKey, tabs: App.Global.Tab[]) {
  const routePath = getRoutePath(name);

  const tabId = routePath;
  const multiTabId = `${routePath}?`;

  return tabs.find(tab => tab.id === tabId || tab.id.startsWith(multiTabId));
}
