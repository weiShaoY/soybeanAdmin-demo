import type {
  ElegantConstRoute,
  RouteKey,
} from '@elegant-router/types'

import { SetupStoreId } from '@/enum'

import { router } from '@/router'

import {
  getVueRoutes,
  staticRouteList,
} from '@/router/routes'

import { useBoolean } from '@sa/hooks'

import { defineStore } from 'pinia'

import {
  computed,
  nextTick,
  ref,
  shallowRef,
} from 'vue'

import { useTabStore } from '../tab'

import { getBreadcrumbsByRoute } from './breadcrumb'

import { getGlobalMenusByAuthRoutes, transformMenuToSearchMenus } from './menu'

import {
  getCacheRouteNames,
  getSelectedMenuKeyPathByKey,
  sortRoutesByOrder,
} from './shared'

/**
 * 路由状态管理
 */
export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const tabStore = useTabStore()

  /**
   *  是否已初始化常量路由
   */
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute }
    = useBoolean()

  /**
   *  是否已初始化路由Store
   */
  const { bool: isInitRouteStore, setBool: setIsInitRouteStore } = useBoolean()

  /**
   *  首页路由键
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  /**
   *  路由列表 (未转化为 vue 路由)
   */
  const routeList = shallowRef<ElegantConstRoute[]>([])

  /**
   *  移除路由函数数组
   */
  const removeRouteFns: (() => void)[] = []

  /**
   *  全局菜单
   */
  const menuList = ref<App.Global.Menu[]>([])

  /**
   *  搜索菜单
   */
  const searchMenuList = computed(() =>
    transformMenuToSearchMenus(menuList.value),
  )

  /**
   *  缓存路由数组
   */
  const cacheRouteList = ref<RouteKey[]>([])

  /**
   *  排除缓存路由列表（用于重置路由缓存）
   */
  const excludeCacheRouteList = ref<RouteKey[]>([])

  /**
   * 重置路由缓存
   *
   * @param routeKey - 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey)

    excludeCacheRouteList.value.push(routeName)
    await nextTick()
    excludeCacheRouteList.value = []
  }

  /**
   *  全局面包屑数组（基于当前路由和全局菜单生成
   */
  const breadcrumbList = computed(() =>
    getBreadcrumbsByRoute(router.currentRoute.value, menuList.value),
  )

  /**
   * 初始化常量路由
   */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) {
      return
    } // 避免重复初始化

    handleConstantAndAuthRoutes()

    setIsInitConstantRoute(true)

    // 初始化首页标签页
    tabStore.initHomeTab()
  }

  /**
   * 初始化路由存储
   * 1. 创建一个权限路由映射表
   * 2. 填充静态路由到映射表
   * 3. 更新路由列表
   * 4. 处理常量路由和权限路由
   * 5. 标记路由存储已初始化
   * 6. 初始化首页标签页
   */
  async function initRouteStore() {
  // 创建一个 Map 用于存储权限路由（key: 路由名称, value: 路由对象）
    const authRoutesMap = new Map<string, ElegantConstRoute>([])

    // 遍历静态路由列表，将每个路由添加到 authRoutesMap
    staticRouteList.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    // 将 Map 转换为数组，并更新路由列表
    routeList.value = Array.from(authRoutesMap.values())

    // 处理常量路由和权限路由
    handleConstantAndAuthRoutes()

    // 设置已初始化标志，避免重复初始化
    setIsInitRouteStore(true)

    // 初始化首页标签页
    tabStore.initHomeTab()
  }

  /**
   * 处理常量路由和权限路由
   */
  function handleConstantAndAuthRoutes() {
    // 对路由进行排序
    const sortRoutes = sortRoutesByOrder([...routeList.value])

    // 生成全局菜单数据
    menuList.value = getGlobalMenusByAuthRoutes(sortRoutes)

    // 对路由进行权限过滤
    const vueRoutes = getVueRoutes(sortRoutes)

    // 将处理后的路由添加到 Vue Router
    vueRoutes.forEach((route) => {
      // 添加路由并获取移除函数
      const removeFn = router.addRoute(route)

      // 存储移除函数
      removeRouteFns.push(removeFn)
    })

    // 计算需要缓存的路由
    cacheRouteList.value = getCacheRouteNames(vueRoutes)
  }

  /**
   *  获取选中的菜单键路径
   *  @param selectedKey - 选中的菜单键
   *  @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menuList.value)
  }

  return {
    /**
     * 重置路由存储状态
     */
    // resetStore,

    /**
     * 首页路由键
     */
    routeHome,

    /**
     * 全局菜单列表
     */
    menuList,

    /**
     * 搜索菜单列表（基于全局菜单生成）
     */
    searchMenuList,

    /**
     * 缓存的路由键列表
     */
    cacheRouteList,

    /**
     * 排除缓存的路由键列表（用于重置路由缓存）
     */
    excludeCacheRouteList,

    /**
     * 重置指定路由的缓存
     *
     * @param routeKey - 需要重置缓存的路由键，默认为当前路由
     */
    resetRouteCache,

    /**
     * 全局面包屑数组（基于当前路由和全局菜单生成）
     */
    breadcrumbList,

    /**
     * 初始化常量路由
     */
    initConstantRoute,

    /**
     * 是否已初始化常量路由
     */
    isInitConstantRoute,

    /**
     * 初始化路由Store函数
     */
    initRouteStore,

    /**
     * 是否已初始化路由Store
     */
    isInitRouteStore,

    /**
     * 获取选中菜单的键路径
     *
     * @param selectedKey - 选中的菜单键
     * @returns 选中菜单的键路径数组
     */
    getSelectedMenuKeyPath,
  }
})
