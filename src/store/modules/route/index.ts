import type {
  ElegantConstRoute,
  RouteKey,
  RouteMap,
} from '@elegant-router/types'

import type { RouteRecordRaw } from 'vue-router'

import { SetupStoreId } from '@/enum'

import { router } from '@/router'

import { getRouteName } from '@/router/elegant/transform'

import { createStaticRoutes, getAuthVueRoutes } from '@/router/routes'

import { useBoolean } from '@sa/hooks'

import { defineStore } from 'pinia'

import {
  computed,
  nextTick,
  ref,
  shallowRef,
} from 'vue'

import { useAuthStore } from '../auth'

import { useTabStore } from '../tab'

import {
  filterAuthRoutesByRoles,
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  transformMenuToSearchMenus,
} from './shared'

/**
 * 路由状态管理
 */
export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const authStore = useAuthStore()

  const tabStore = useTabStore()

  // 是否已初始化常量路由
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()

  // 是否已初始化权限路由
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()

  // 首页路由键
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  // 常量路由
  const constantRoutes = shallowRef<ElegantConstRoute[]>([])

  /**
   * 添加并去重常量路由
   *
   * @param routes - 需要添加的常量路由列表
   */
  function addConstantRoutes(routes: ElegantConstRoute[]) {
    const constantRoutesMap = new Map<string, ElegantConstRoute>([])

    routes.forEach((route) => {
      constantRoutesMap.set(route.name, route)
    })
    constantRoutes.value = Array.from(constantRoutesMap.values())
  }

  // 权限路由
  const authRoutes = shallowRef<ElegantConstRoute[]>([])

  /**
   * 添加并去重权限路由
   *
   * @param routes - 需要添加的权限路由列表
   */
  function addAuthRoutes(routes: ElegantConstRoute[]) {
    const authRoutesMap = new Map<string, ElegantConstRoute>([])

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })
    authRoutes.value = Array.from(authRoutesMap.values())
  }

  // 移除路由函数数组
  const removeRouteFns: (() => void)[] = []

  // 全局菜单
  const menus = ref<App.Global.Menu[]>([])

  // 搜索菜单
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /**
   * 获取全局菜单
   *
   * @param routes - 路由数组
   */
  function getGlobalMenus(routes: ElegantConstRoute[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes)
  }

  // 缓存路由
  const cacheRoutes = ref<RouteKey[]>([])

  // 排除缓存路由（用于重置路由缓存）
  const excludeCacheRoutes = ref<RouteKey[]>([])

  /**
   * 获取缓存路由
   *
   * @param routes - Vue 路由数组
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /**
   * 重置路由缓存
   *
   * @param routeKey - 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey)

    excludeCacheRoutes.value.push(routeName)
    await nextTick()
    excludeCacheRoutes.value = []
  }

  // 全局面包屑
  const breadcrumbs = computed(() => getBreadcrumbsByRoute(router.currentRoute.value, menus.value))

  /**
   * 重置存储
   */
  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()
    resetVueRoutes()
    await initConstantRoute() // 重置存储后需要重新初始化常量路由
  }

  /**
   * 重置 Vue 路由
   */
  function resetVueRoutes() {
    removeRouteFns.forEach(fn => fn())
    removeRouteFns.length = 0
  }

  /**
   * 初始化常量路由
   */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) {
      return
    } // 避免重复初始化

    const staticRoute = createStaticRoutes()

    addConstantRoutes(staticRoute.constantRoutes)
    handleConstantAndAuthRoutes()
    setIsInitConstantRoute(true)
    tabStore.initHomeTab() // 初始化首页标签页
  }

  /**
   * 初始化权限路由
   */
  async function initAuthRoute() {
    if (!authStore.userInfo.userId) {
      await authStore.initUserInfo() // 确保用户信息已初始化
    }

    initStaticAuthRoute()
    tabStore.initHomeTab() // 初始化首页标签页
  }

  /**
   * 初始化静态权限路由
   */
  function initStaticAuthRoute() {
    const { authRoutes: staticAuthRoutes } = createStaticRoutes()

    if (authStore.isStaticSuper) {
      addAuthRoutes(staticAuthRoutes)
    }
    else {
      const filteredAuthRoutes = filterAuthRoutesByRoles(staticAuthRoutes, authStore.userInfo.roles)

      addAuthRoutes(filteredAuthRoutes)
    }

    handleConstantAndAuthRoutes()
    setIsInitAuthRoute(true)
  }

  /**
   * 处理常量路由和权限路由
   */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...constantRoutes.value, ...authRoutes.value]

    const sortRoutes = sortRoutesByOrder(allRoutes) // 对路由进行排序

    const vueRoutes = getAuthVueRoutes(sortRoutes) // 对路由进行权限过滤

    resetVueRoutes() // 重置 Vue Router 中的所有动态路由
    addRoutesToVueRouter(vueRoutes) // 将处理后的路由添加到 Vue Router
    getGlobalMenus(sortRoutes) // 生成全局菜单数据
    getCacheRoutes(vueRoutes) // 计算需要缓存的路由
  }

  /**
   * 添加路由到 Vue 路由器
   *
   * @param routes - Vue 路由数组
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      const removeFn = router.addRoute(route) // 添加路由并获取移除函数

      addRemoveRouteFn(removeFn) // 存储移除函数
    })
  }

  /**
   * 添加移除路由函数
   *
   * @param fn - 移除路由函数
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  /**
   * 检查权限路由是否存在
   *
   * @param routePath - 路由路径
   * @returns 是否存在
   */
  async function getIsAuthRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath)

    if (!routeName) {
      return false
    }

    const { authRoutes: staticAuthRoutes } = createStaticRoutes()

    return isRouteExistByRouteName(routeName, staticAuthRoutes)
  }

  /**
   * 获取选中的菜单键路径
   *
   * @param selectedKey - 选中的菜单键
   * @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value)
  }

  /**
   * 登录后执行路由切换操作
   */
  async function onRouteSwitchWhenLoggedIn() {
    await authStore.initUserInfo() // 确保用户信息已初始化
  }

  return {
    /**
     * 重置路由存储状态
     */
    resetStore,

    /**
     * 首页路由键
     */
    routeHome,

    /**
     * 全局菜单列表
     */
    menus,

    /**
     * 搜索菜单列表（基于全局菜单生成）
     */
    searchMenus,

    /**
     * 缓存的路由键列表
     */
    cacheRoutes,

    /**
     * 排除缓存的路由键列表（用于重置路由缓存）
     */
    excludeCacheRoutes,

    /**
     * 重置指定路由的缓存
     *
     * @param routeKey - 需要重置缓存的路由键，默认为当前路由
     */
    resetRouteCache,

    /**
     * 全局面包屑数据（基于当前路由和全局菜单生成）
     */
    breadcrumbs,

    /**
     * 初始化常量路由
     */
    initConstantRoute,

    /**
     * 是否已初始化常量路由
     */
    isInitConstantRoute,

    /**
     * 初始化权限路由
     */
    initAuthRoute,

    /**
     * 是否已初始化权限路由
     */
    isInitAuthRoute,

    /**
     * 设置权限路由初始化状态
     *
     * @param value - 是否已初始化
     */
    setIsInitAuthRoute,

    /**
     * 检查指定路由路径是否存在权限路由
     *
     * @param routePath - 路由路径
     * @returns 是否存在权限路由
     */
    getIsAuthRouteExist,

    /**
     * 获取选中菜单的键路径
     *
     * @param selectedKey - 选中的菜单键
     * @returns 选中菜单的键路径数组
     */
    getSelectedMenuKeyPath,

    /**
     * 登录后执行路由切换操作（初始化用户信息）
     */
    onRouteSwitchWhenLoggedIn,
  }
})
