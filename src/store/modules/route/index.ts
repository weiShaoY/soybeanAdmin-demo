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
   * 初始化路由存储
   * 1. 创建权限路由映射表
   * 2. 填充静态路由到映射表
   * 3. 更新路由列表并排序
   * 4. 生成全局菜单数据
   * 5. 过滤路由权限并添加到 Vue Router
   * 6. 计算需要缓存的路由
   * 7. 标记路由存储已初始化
   * 8. 初始化首页标签页
   */
  async function initRouteStore() {
  // 1. 创建权限路由映射表（key: 路由名称, value: 路由对象）
    const authRoutesMap = new Map<string, ElegantConstRoute>([])

    // 2. 遍历静态路由列表，将每个路由添加到权限路由映射表
    staticRouteList.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    // 3. 将权限路由映射表转换为数组，并更新路由列表
    routeList.value = Array.from(authRoutesMap.values())

    // ////////////////////////////////

    // 4. 对路由列表进行排序
    const sortRoutes = sortRoutesByOrder([...routeList.value])

    // 5. 根据排序后的路由生成全局菜单数据
    menuList.value = getGlobalMenusByAuthRoutes(sortRoutes)

    // 6. 对排序后的路由进行权限过滤，生成 Vue Router 可用的路由
    const vueRoutes = getVueRoutes(sortRoutes)

    // 7. 将处理后的路由添加到 Vue Router，并存储路由移除函数
    vueRoutes.forEach((route) => {
      const removeFn = router.addRoute(route)

      removeRouteFns.push(removeFn)
    })

    // 8. 计算需要缓存的路由名称列表
    cacheRouteList.value = getCacheRouteNames(vueRoutes)

    // 9. 标记路由存储已初始化，避免重复初始化
    setIsInitRouteStore(true)

    // 10. 初始化首页标签页
    tabStore.initHomeTab()
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
