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

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const authStore = useAuthStore()

  const tabStore = useTabStore()

  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()

  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()

  /**
   *  首页路由键
   */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  /**
   * 设置首页路由
   *
   * @param {LastLevelRouteKey} routeKey 路由键
   */
  // function setRouteHome(routeKey: LastLevelRouteKey) {
  //   routeHome.value = routeKey
  // }

  /**
   * 常量路由
   */
  const constantRoutes = shallowRef<ElegantConstRoute[]>([])

  /**
   * 添加并去重常量路由
   *
   * 该函数用于将传入的常量路由去重后存入 `constantRoutes.value`，确保常量路由唯一。
   *
   * @param routes - 需要添加的常量路由列表
   */
  function addConstantRoutes(routes: ElegantConstRoute[]) {
    // 创建一个 Map 用于去重，key 是 route.name，value 是对应的路由对象
    const constantRoutesMap = new Map<string, ElegantConstRoute>([])

    // 遍历传入的路由数组，将每个路由存入 Map，利用 Map 的 key 唯一性进行去重
    routes.forEach((route) => {
      constantRoutesMap.set(route.name, route)
    })

    // 将去重后的路由列表转换为数组，并赋值给 constantRoutes 变量
    constantRoutes.value = Array.from(constantRoutesMap.values())
  }

  /**
   *  权限路由
   */
  const authRoutes = shallowRef<ElegantConstRoute[]>([])

  /**
   * 添加并去重权限路由
   *
   * 该函数会将传入的路由列表去重后存入 `authRoutes.value`，确保权限路由唯一。
   *
   * @param  routes  需要添加的权限路由列表
   */
  function addAuthRoutes(routes: ElegantConstRoute[]) {
    const authRoutesMap = new Map<string, ElegantConstRoute>([])

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    authRoutes.value = Array.from(authRoutesMap.values())
    console.log('%c Line:111 🍇 authRoutes.value', 'color:#465975', authRoutes.value)
  }

  /**
   *  移除路由函数数组
   */
  const removeRouteFns: (() => void)[] = []

  /**
   * 全局菜单
   */
  const menus = ref<App.Global.Menu[]>([])

  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /**
   * 获取全局菜单
   *
   * @param {ElegantConstRoute[]} routes 路由数组
   */
  function getGlobalMenus(routes: ElegantConstRoute[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes)
  }

  /** 缓存路由 */
  const cacheRoutes = ref<RouteKey[]>([])

  /** 排除缓存路由，用于重置路由缓存 */
  const excludeCacheRoutes = ref<RouteKey[]>([])

  /**
   * 获取缓存路由
   *
   * @param {RouteRecordRaw[]} routes Vue 路由数组
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /**
   * 重置路由缓存
   *
   * @param {RouteKey} [routeKey] 路由键，默认值为当前路由名
   */
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey)

    excludeCacheRoutes.value.push(routeName)

    await nextTick()

    excludeCacheRoutes.value = []
  }

  /**
   * 全局面包屑
   */
  const breadcrumbs = computed(() => getBreadcrumbsByRoute(router.currentRoute.value, menus.value))

  /**
   * 重置存储
   */
  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()

    resetVueRoutes()

    // 重置存储后需要重新初始化常量路由
    await initConstantRoute()
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
  // 如果常量路由已经初始化，则直接返回，避免重复执行
    if (isInitConstantRoute.value) {
      return
    }

    // 创建静态路由
    const staticRoute = createStaticRoutes()

    addConstantRoutes(staticRoute.constantRoutes)

    // 处理常量路由和权限路由的逻辑
    handleConstantAndAuthRoutes()

    // 设置常量路由初始化状态为 true
    setIsInitConstantRoute(true)

    // 初始化首页标签页
    tabStore.initHomeTab()
  }

  /**
   * 初始化权限路由
   */
  async function initAuthRoute() {
    // 检查用户信息是否已初始化
    if (!authStore.userInfo.userId) {
      await authStore.initUserInfo()
    }

    initStaticAuthRoute()

    tabStore.initHomeTab()
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
  // 合并常量路由和权限路由
    const allRoutes = [...constantRoutes.value, ...authRoutes.value]

    console.log('%c Line:270 🍕 authRoutes.value', 'color:#ffdd4d', authRoutes.value)

    /**
     *  对路由进行排序
     */
    const sortRoutes = sortRoutesByOrder(allRoutes)

    /**
     *  对路由进行权限过滤
     */
    const vueRoutes = getAuthVueRoutes(sortRoutes)

    // 重置 Vue Router 中的所有动态路由
    resetVueRoutes()

    // 将处理后的路由添加到 Vue Router
    addRoutesToVueRouter(vueRoutes)

    // 生成全局菜单数据
    getGlobalMenus(sortRoutes)

    // 计算需要缓存的路由
    getCacheRoutes(vueRoutes)
  }

  /**
   * 添加路由到 Vue 路由器
   *
   * @param  routes Vue 路由数组
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      // 调用 Vue Router 的 `addRoute` 方法添加路由，返回一个移除该路由的函数
      const removeFn = router.addRoute(route)

      // 将移除函数存储，方便后续清理路由
      addRemoveRouteFn(removeFn)
    })
  }

  /**
   * 添加移除路由函数
   *
   * @param fn 移除路由函数
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  /**
   * 获取权限路由是否存在
   *
   * @param  routePath 路由路径
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
   * @param selectedKey 选中的菜单键
   * @returns 选中的菜单键路径数组
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value)
  }

  /**
   * 登录后执行路由切换操作
   *
   * 该函数在用户登录后初始化用户信息，确保用户身份信息可用。
   */
  async function onRouteSwitchWhenLoggedIn() {
    await authStore.initUserInfo()
  }

  return {
    resetStore,
    routeHome,
    menus,
    searchMenus,
    cacheRoutes,
    excludeCacheRoutes,
    resetRouteCache,
    breadcrumbs,
    initConstantRoute,
    isInitConstantRoute,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath,
    onRouteSwitchWhenLoggedIn,
  }
})
